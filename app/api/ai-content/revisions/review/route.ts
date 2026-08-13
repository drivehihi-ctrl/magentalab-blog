import { NextResponse } from 'next/server';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { getRevision, updateRevisionStatus, logAction } from '@/lib/ai-revisions';
import { revisionRepository } from '@/lib/repositories';

export async function GET(req: Request) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url, 'https://www.magentalabblog.com');
    const statusFilter = searchParams.get('status') || 'pending_review';

    const allRevisions = await revisionRepository.list();
    const filtered = allRevisions.filter(r => r.status === statusFilter);

    return NextResponse.json({
      success: true,
      count: filtered.length,
      status_filter: statusFilter,
      revisions: filtered.map(r => ({
        revision_id: r.revision_id,
        wordpress_id: r.wordpress_id,
        content_id: r.content_id,
        slug: r.slug,
        language: r.language,
        status: r.status,
        reason: r.reason,
        source: r.source,
        created_at: r.created_at,
        evidence_attached: !!r.evidence
      }))
    });
  } catch (error: any) {
    console.error('Error fetching review queue:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { revision_id, id, action, confirm } = body;

    const targetId = revision_id || id;
    if (!targetId) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'revision_id is required' }, { status: 400 });
    }

    if (!confirm) {
      return NextResponse.json({ error: 'CONFIRMATION_REQUIRED', message: 'confirm: true is required for human review action' }, { status: 400 });
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'INVALID_ACTION', message: 'action must be approve or reject' }, { status: 400 });
    }

    const revision = await getRevision(targetId);
    if (!revision) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Revision not found' }, { status: 404 });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    await updateRevisionStatus(targetId, newStatus);

    await logAction({
      timestamp: new Date().toISOString(),
      action: action === 'approve' ? 'APPROVE_REVISION' : 'REJECT_REVISION',
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      revision_id: revision.revision_id,
      source: 'human_review',
      status: 'success',
      message: `Revision status updated to ${newStatus}`
    });

    return NextResponse.json({
      success: true,
      revision_id: targetId,
      wordpress_id: revision.wordpress_id,
      action_taken: action,
      status: newStatus
    });

  } catch (error: any) {
    console.error('Error in review action:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
