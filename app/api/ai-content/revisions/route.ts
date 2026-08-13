import { NextResponse } from 'next/server';
import { getPost } from '@/lib/wp';
import { sanitizeForSeo } from '@/lib/utils';
import { saveRevision, logAction, AIRevision } from '@/lib/ai-revisions';
import { parseEvidence } from '@/lib/evidence-parser';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import crypto from 'crypto';

export async function POST(req: Request) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid or missing API secret' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { wordpress_id, new_title, new_content, new_excerpt, reason, source } = body;

    if (!wordpress_id) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'wordpress_id is required' }, { status: 400 });
    }

    const post = await getPost(wordpress_id.toString());
    if (!post) {
      return NextResponse.json({ error: 'POST_NOT_FOUND', message: 'Original post not found' }, { status: 404 });
    }

    const slug = post.slug || '';
    const lang = slug.endsWith('-en') ? 'en' : slug.endsWith('-ja') ? 'ja' : 'ko';

    const unsafeContent = new_content || '';
    if (unsafeContent.toLowerCase().includes('<script') || unsafeContent.toLowerCase().includes('<iframe')) {
      return NextResponse.json({ error: 'UNSAFE_HTML', message: 'Script or Iframe tags are not allowed' }, { status: 400 });
    }

    const revision_id = `rev_${crypto.randomBytes(8).toString('hex')}`;

    const revision = {
      revision_id,
      wordpress_id: post.id,
      content_id: post.id.toString(),
      language: lang,
      slug,
      source_modified_at: post.modified,
      previous_title: post.title.rendered,
      new_title: new_title || post.title.rendered,
      previous_content: post.content.rendered,
      new_content: new_title ? '' : post.content.rendered,
      previous_excerpt: post.excerpt.rendered,
      new_excerpt: new_excerpt || post.excerpt.rendered,
      previous_meta_description: sanitizeForSeo(post.excerpt.rendered, 160),
      new_meta_description: sanitizeForSeo(new_excerpt || post.excerpt.rendered, 160),
      reason: reason || 'AI Update',
      source: source || 'chatgpt',
      status: 'pending_review' as const,
      created_at: new Date().toISOString()
    } as AIRevision;

    if (new_content) {
      const { content, evidence } = parseEvidence(new_content);
      revision.new_content = content;
      if (evidence) {
        revision.evidence = evidence;
      } else if (new_content.includes('[근거]')) {
        return NextResponse.json({ error: 'EVIDENCE_SECTION_PARSE_FAILED', message: 'Found [근거] block but failed to parse references' }, { status: 400 });
      }
    } else {
      revision.new_content = post.content.rendered;
    }

    await saveRevision(revision);

    await logAction({
      timestamp: revision.created_at,
      action: 'CREATE_REVISION',
      wordpress_id: post.id,
      content_id: post.id.toString(),
      revision_id: revision.revision_id,
      source: revision.source,
      status: 'success'
    });

    return NextResponse.json(revision, { status: 201 });
  } catch (error: any) {
    console.error('Error creating revision:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
