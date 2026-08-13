import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPost } from '@/lib/wp';
import { sanitizeForSeo } from '@/lib/utils';
import { parseEvidence } from '@/lib/evidence-parser';
import { logAction, saveRevision, AIRevision } from '@/lib/ai-revisions';

const MAX_REVISION_BATCH = 10;

type RevisionDraft = {
  wordpress_id: number;
  new_title?: string;
  new_content?: string;
  new_excerpt?: string;
  reason?: string;
  source?: string;
  evidence?: any;
};

import { isAIContentAuthenticated } from '@/lib/ai-content-auth';

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
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const drafts = (body.revisions || body.items || body) as RevisionDraft[];

    if (!Array.isArray(drafts) || drafts.length === 0) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'revisions array is required' }, { status: 400 });
    }
    if (drafts.length > MAX_REVISION_BATCH) {
      return NextResponse.json({ error: 'BATCH_LIMIT_EXCEEDED', message: `Maximum ${MAX_REVISION_BATCH} revisions per batch` }, { status: 400 });
    }

    const prepared: Array<{
      revision_id: string;
      wordpress_id: number;
      status: string;
      evidence_attached: boolean;
      warnings: string[];
    }> = [];

    for (const draft of drafts) {
      const wordpressId = Number(draft.wordpress_id);
      if (!wordpressId) continue;

      const post = await getPost(String(wordpressId));
      if (!post) {
        return NextResponse.json({ error: 'POST_NOT_FOUND', wordpress_id: wordpressId }, { status: 404 });
      }

      const slug = post.slug || '';
      const language = inferLanguage(slug);

      if (containsUnsafeHtml(draft.new_content)) {
        return NextResponse.json({ error: 'UNSAFE_HTML', wordpress_id: wordpressId, message: 'Script or iframe tags are not allowed' }, { status: 400 });
      }

      let revisedContent = typeof draft.new_content === 'string' ? draft.new_content : post.content.rendered;
      let evidence: AIRevision['evidence'] = draft.evidence || undefined;
      let evidenceAttached = !!evidence;

      if (!evidence && typeof draft.new_content === 'string') {
        const parsed = parseEvidence(draft.new_content);
        if (parsed.evidence && parsed.evidence.references && parsed.evidence.references.length > 0) {
          revisedContent = parsed.content;
          evidence = parsed.evidence;
          evidenceAttached = true;
        }
      }

      const isMedicalTopic = !!(
        slug.match(/diabetes|urinary|cystitis|patella|joint|poison|emergency|onion|garlic|chocolate|skin|dermatology|atopic|allergy/i) ||
        revisedContent.match(/당뇨|인슐린|방광|신장|비뇨|슬개골|관절|탈구|골절|독성|응급|양파|초콜릿|피부|아토피|농피증/i)
      );

      const itemWarnings: string[] = [];
      if (isMedicalTopic && !evidenceAttached) {
        itemWarnings.push('Medical topic detected without evidence reference');
      }

      const revision: AIRevision = {
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
        reason: draft.reason || 'Phase 5.2 Batch Revision Pilot',
        source: draft.source || 'phase5_batch',
        status: 'pending_review',
        created_at: new Date().toISOString()
      };

      await saveRevision(revision);
      await logAction({
        timestamp: revision.created_at,
        action: 'CREATE_REVISION',
        wordpress_id: revision.wordpress_id,
        content_id: revision.content_id,
        revision_id: revision.revision_id,
        source: revision.source,
        status: 'success',
        message: 'Phase 5.2 batch revision created'
      });

      prepared.push({
        revision_id: revision.revision_id,
        wordpress_id: revision.wordpress_id,
        status: revision.status,
        evidence_attached: evidenceAttached,
        warnings: itemWarnings
      });
    }

    return NextResponse.json({
      success: true,
      batch_count: prepared.length,
      human_review_required: true,
      auto_apply: false,
      revisions: prepared
    }, { status: 201 });
  } catch (error: any) {
    console.error('Phase 5.2 batch revision creation failed:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
