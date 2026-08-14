import { NextResponse } from 'next/server';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { reviewRevision } from '@/lib/services/review-service';
import { RevisionError } from '@/lib/services/revision-service';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const decision = body.decision || body.action;
    
    const result = await reviewRevision({
      revision_id: id,
      decision,
      confirm: body.confirm,
      medical_review_confirm: body.medical_review_confirm,
      note: body.note,
      source: 'human_review'
    });

    return NextResponse.json({
      success: true,
      revision_id: result.revision_id,
      wordpress_id: result.wordpress_id,
      action_taken: result.decision,
      status: result.status
    });

  } catch (error: any) {
    if (error instanceof RevisionError) {
      const statusMap: Record<string, number> = {
        'CONFIRMATION_REQUIRED': 400,
        'INVALID_ACTION': 400,
        'NOT_FOUND': 404,
        'INVALID_STATUS': 400,
        'MEDICAL_REVIEW_CONFIRMATION_REQUIRED': 400
      };
      return NextResponse.json({ error: error.code, message: error.message }, { status: statusMap[error.code] || 400 });
    }
    console.error('Error in review action:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
