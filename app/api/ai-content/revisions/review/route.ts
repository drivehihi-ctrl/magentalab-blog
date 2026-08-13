import { NextResponse } from 'next/server';
import { revisionRepository } from '@/lib/repositories';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';

export async function GET(req: Request) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const url = new URL(req.url, 'https://www.magentalabblog.com');
    const requestedStatus = url.searchParams.get('status') || 'pending_review';
    const allowedStatuses = ['pending_review', 'approved', 'rejected', 'applied', 'rolled_back'];

    if (!allowedStatuses.includes(requestedStatus)) {
      return NextResponse.json({ error: 'INVALID_STATUS', message: 'Unsupported revision status filter' }, { status: 400 });
    }

    const revisions = await revisionRepository.list();
    const filtered = revisions
      .filter(r => r.status === requestedStatus)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(r => ({
        revision_id: r.revision_id,
        wordpress_id: r.wordpress_id,
        content_id: r.content_id,
        language: r.language,
        slug: r.slug,
        status: r.status,
        reason: r.reason,
        source: r.source,
        created_at: r.created_at,
        source_modified_at: r.source_modified_at,
        evidence_attached: !!r.evidence && Array.isArray(r.evidence.references) && r.evidence.references.length > 0,
        diff: {
          title_changed: r.previous_title !== r.new_title,
          content_changed: r.previous_content !== r.new_content,
          excerpt_changed: r.previous_excerpt !== r.new_excerpt,
          meta_description_changed: r.previous_meta_description !== r.new_meta_description,
          previous_content_length: r.previous_content.length,
          new_content_length: r.new_content.length
        }
      }));

    return NextResponse.json({
      status: requestedStatus,
      count: filtered.length,
      human_review_required: requestedStatus === 'pending_review',
      revisions: filtered
    });
  } catch (error: any) {
    console.error('Human review queue fetch failed:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
