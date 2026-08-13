import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPost } from '@/lib/wp';
import { sanitizeForSeo } from '@/lib/utils';
import { parseEvidence } from '@/lib/evidence-parser';
import { logAction, saveRevision, AIRevision } from '@/lib/ai-revisions';
import { auditRepository, revisionRepository } from '@/lib/repositories';

const MAX_REVISION_BATCH = 5;

type RevisionDraft = {
  wordpress_id: number;
  new_title?: string;
  new_content?: string;
  new_excerpt?: string;
  reason?: string;
  source?: string;
};

function isAuthenticated(req: Request) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.AI_CONTENT_API_SECRET;
  if (!secret || !authHeader?.startsWith('Bearer ')) return false;
  return authHeader.slice('Bearer '.length).trim() === secret.trim();
}

function inferLanguage(slug: string): 'ko' | 'en' | 'ja' {
  if (slug.endsWith('-en')) return 'en';
  if (slug.endsWith('-ja')) return 'ja';
  return 'ko';
}

function containsUnsafeHtml(content?: string) {
  if (!content) return false;
  const lowered = content.toLowerCase();
  return lowered.includes('<script') || lowered.includes('<iframe');
}

export async function POST(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const drafts = body.revisions as RevisionDraft[];

    if (!Array.isArray(drafts) || drafts.length === 0) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'revisions must be a non-empty array' }, { status: 400 });
    }
    if (drafts.length > MAX_REVISION_BATCH) {
      return NextResponse.json({ error: 'BATCH_LIMIT_EXCEEDED', message: `Maximum ${MAX_REVISION_BATCH} revisions per batch` }, { status: 400 });
    }

    const postIds = drafts.map(d => Number(d.wordpress_id));
    if (postIds.some(id => !Number.isInteger(id) || id <= 0)) {
      return NextResponse.json({ error: 'INVALID_WORDPRESS_ID', message: 'Every wordpress_id must be a positive integer' }, { status: 400 });
    }
    if (new Set(postIds).size !== postIds.length) {
      return NextResponse.json({ error: 'DUPLICATE_WORDPRESS_ID', message: 'Duplicate wordpress_id values are not allowed in one batch' }, { status: 400 });
    }

    const latestAudits = await auditRepository.getLatestByPostIds(postIds);
    const existingRevisions = await revisionRepository.list();
    const prepared: AIRevision[] = [];
    const warnings: Array<{ wordpress_id: number; code: string }> = [];

    // Validate the entire batch before writing any revision rows.
    for (const draft of drafts) {
      const wordpressId = Number(draft.wordpress_id);
      const audit = latestAudits.get(wordpressId);

      if (!audit) {
        return NextResponse.json({ error: 'AUDIT_REQUIRED', wordpress_id: wordpressId, message: 'A stored content audit is required before batch revision creation' }, { status: 409 });
      }
      if (audit.status === 'green') {
        return NextResponse.json({ error: 'AUDIT_NOT_ELIGIBLE', wordpress_id: wordpressId, message: 'Green audit results are not eligible for rewrite batching' }, { status: 409 });
      }

      const activeRevision = existingRevisions.find(r =>
        r.wordpress_id === wordpressId && (r.status === 'pending_review' || r.status === 'approved')
      );
      if (activeRevision) {
        return NextResponse.json({
          error: 'ACTIVE_REVISION_EXISTS',
          wordpress_id: wordpressId,
          revision_id: activeRevision.revision_id,
          message: 'Resolve the existing pending/approved revision before creating another one'
        }, { status: 409 });
      }

      const post = await getPost(String(wordpressId));
      if (!post) {
        return NextResponse.json({ error: 'POST_NOT_FOUND', wordpress_id: wordpressId }, { status: 404 });
      }

      const slug = post.slug || '';
      const language = inferLanguage(slug);
      if (audit.language !== language) {
        return NextResponse.json({ error: 'AUDIT_LANGUAGE_MISMATCH', wordpress_id: wordpressId, message: 'Stored audit language does not match the current post' }, { status: 409 });
      }

      const hasChange = typeof draft.new_title === 'string' || typeof draft.new_content === 'string' || typeof draft.new_excerpt === 'string';
      if (!hasChange) {
        return NextResponse.json({ error: 'NO_REVISION_CONTENT', wordpress_id: wordpressId, message: 'At least one new field is required' }, { status: 400 });
      }
      if (audit.status === 'red' && typeof draft.new_content !== 'string') {
        return NextResponse.json({ error: 'RED_AUDIT_REQUIRES_CONTENT', wordpress_id: wordpressId, message: 'Red audit results require rewritten content' }, { status: 400 });
      }
      if (containsUnsafeHtml(draft.new_content)) {
        return NextResponse.json({ error: 'UNSAFE_HTML', wordpress_id: wordpressId, message: 'Script or iframe tags are not allowed' }, { status: 400 });
      }

      let revisedContent = typeof draft.new_content === 'string' ? draft.new_content : post.content.rendered;
      let evidence: AIRevision['evidence'];

      if (typeof draft.new_content === 'string') {
        const parsed = parseEvidence(draft.new_content);
        revisedContent = parsed.content;
        evidence = parsed.evidence;
        if (draft.new_content.includes('[근거]') && !evidence) {
          return NextResponse.json({ error: 'EVIDENCE_SECTION_PARSE_FAILED', wordpress_id: wordpressId }, { status: 400 });
        }
      }

      if (audit.medical_risk === 100 && audit.evidence_score === 0 && !evidence) {
        warnings.push({ wordpress_id: wordpressId, code: 'MEDICAL_EVIDENCE_REQUIRED_BEFORE_APPLY' });
      }

      const createdAt = new Date().toISOString();
      prepared.push({
        revision_id: `rev_${crypto.randomBytes(8).toString('hex')}`,
        wordpress_id: post.id,
        content_id: String(post.id),
        language,
        slug,
        source_modified_at: post.modified,
        previous_title: post.title.rendered,
        new_title: typeof draft.new_title === 'string' ? draft.new_title : post.title.rendered,
        previous_content: post.content.rendered,
        new_content: revisedContent,
        previous_excerpt: post.excerpt.rendered,
        new_excerpt: typeof draft.new_excerpt === 'string' ? draft.new_excerpt : post.excerpt.rendered,
        previous_meta_description: sanitizeForSeo(post.excerpt.rendered, 160),
        new_meta_description: sanitizeForSeo(typeof draft.new_excerpt === 'string' ? draft.new_excerpt : post.excerpt.rendered, 160),
        evidence,
        reason: draft.reason || `Phase 5.2 ${audit.recommended_action}`,
        source: draft.source || 'phase5_batch',
        status: 'pending_review',
        created_at: createdAt
      });
    }

    for (const revision of prepared) {
      await saveRevision(revision);
      await logAction({
        timestamp: revision.created_at,
        action: 'CREATE_REVISION',
        wordpress_id: revision.wordpress_id,
        content_id: revision.content_id,
        revision_id: revision.revision_id,
        source: revision.source,
        status: 'success',
        message: 'Phase 5.2 audit-gated batch revision created; human review required'
      });
    }

    return NextResponse.json({
      success: true,
      created: prepared.length,
      max_batch_size: MAX_REVISION_BATCH,
      human_review_required: true,
      auto_apply: false,
      revisions: prepared.map(r => ({
        revision_id: r.revision_id,
        wordpress_id: r.wordpress_id,
        content_id: r.content_id,
        language: r.language,
        slug: r.slug,
        status: r.status,
        source_modified_at: r.source_modified_at,
        evidence_attached: !!r.evidence
      })),
      warnings
    }, { status: 201 });
  } catch (error: any) {
    console.error('Phase 5.2 batch revision creation failed:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
