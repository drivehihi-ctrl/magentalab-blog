import { NextResponse } from 'next/server';
import { getRevision, saveRevision, logAction } from '@/lib/ai-revisions';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const decision = body.decision;

    if (body.confirm !== true) {
      return NextResponse.json({ error: 'REQUIRE_CONFIRM', message: 'confirm: true is required' }, { status: 400 });
    }
    if (decision !== 'approve' && decision !== 'reject') {
      return NextResponse.json({ error: 'INVALID_DECISION', message: 'decision must be approve or reject' }, { status: 400 });
    }

    const revision = await getRevision(id);
    if (!revision) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Revision not found' }, { status: 404 });
    }
    if (revision.status !== 'pending_review') {
      return NextResponse.json({
        error: 'INVALID_STATUS',
        message: 'Only pending_review revisions can be reviewed',
        current_status: revision.status
      }, { status: 409 });
    }

    revision.status = decision === 'approve' ? 'approved' : 'rejected';
    await saveRevision(revision);

    await logAction({
      timestamp: new Date().toISOString(),
      action: decision === 'approve' ? 'APPROVE_REVISION' : 'REJECT_REVISION',
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      revision_id: revision.revision_id,
      source: 'human_review',
      status: 'success',
      message: typeof body.note === 'string' && body.note.trim() ? body.note.trim().slice(0, 500) : undefined
    });

    return NextResponse.json({
      success: true,
      revision_id: revision.revision_id,
      wordpress_id: revision.wordpress_id,
      status: revision.status,
      auto_apply: false,
      message: decision === 'approve'
        ? 'Revision approved. Apply remains a separate explicit action.'
        : 'Revision rejected. No WordPress changes were made.'
    });
  } catch (error: any) {
    console.error('Human review action failed:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
