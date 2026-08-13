import { NextResponse } from 'next/server';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { applyOneRevision } from '@/lib/apply-revision';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.confirm !== true) {
    return NextResponse.json(
      { error: 'REQUIRE_CONFIRM', message: 'confirm: true is required' },
      { status: 400 }
    );
  }

  const result = await applyOneRevision(id, { source: 'single' });

  if (!result.success) {
    const statusMap: Record<string, number> = {
      NOT_FOUND: 404,
      INVALID_STATUS: 400,
      MEDICAL_EVIDENCE_MISSING: 400,
      CONTENT_TRUNCATION_DETECTED: 400,
      EVIDENCE_DUPLICATED_IN_BODY: 400,
      POST_NOT_FOUND: 404,
      POST_CHANGED_SINCE_READ: 409,
      EVIDENCE_DATA_NOT_PERSISTED: 500,
      WP_WRITE_FAILED: 500,
    };
    const httpStatus = statusMap[result.error_code] ?? 500;
    return NextResponse.json(
      { error: result.error_code, message: result.error_message },
      { status: httpStatus }
    );
  }

  return NextResponse.json({
    success: true,
    revision_id: result.revision_id,
    backup_id: result.backup_id,
  });
}
