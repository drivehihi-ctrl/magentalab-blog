import { NextResponse } from 'next/server';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { getRevision, saveRevision, logAction } from '@/lib/ai-revisions';
import { assessMedicalRisk } from '@/lib/medical-risk';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const reviewDecision = body.decision || body.action;
    const { confirm } = body;

    if (!confirm) {
      return NextResponse.json({ error: 'CONFIRMATION_REQUIRED', message: 'confirm: true is required for human review action' }, { status: 400 });
    }

    if (reviewDecision !== 'approve' && reviewDecision !== 'reject') {
      return NextResponse.json({ error: 'INVALID_ACTION', message: 'decision/action must be approve or reject' }, { status: 400 });
    }

    const revision = await getRevision(id);
    if (!revision) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Revision not found' }, { status: 404 });
    }

    const newStatus = reviewDecision === 'approve' ? 'approved' : 'rejected';
    
    if (newStatus === 'approved') {
      const risk = assessMedicalRisk(revision.slug, revision.new_title, revision.new_content);
      if (risk.isMedical) {
        if (body.medical_review_confirm !== true) {
          return NextResponse.json({ error: 'MEDICAL_REVIEW_CONFIRMATION_REQUIRED', message: 'Explicit medical review confirmation is required' }, { status: 400 });
        }
        revision.medical_reviewed = true;
      }
    }
    
    revision.status = newStatus;
    await saveRevision(revision);

    await logAction({
      timestamp: new Date().toISOString(),
      action: reviewDecision === 'approve' ? 'APPROVE_REVISION' : 'REJECT_REVISION',
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      revision_id: revision.revision_id,
      source: 'human_review',
      status: 'success',
      message: `Revision status updated to ${newStatus}${revision.medical_reviewed ? ' (medical reviewed)' : ''}`
    });

    return NextResponse.json({
      success: true,
      revision_id: id,
      wordpress_id: revision.wordpress_id,
      action_taken: reviewDecision,
      status: newStatus
    });

  } catch (error: any) {
    console.error('Error in review action:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
