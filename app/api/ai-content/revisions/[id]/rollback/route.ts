import { NextResponse } from 'next/server';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { rollbackRevision } from '@/lib/services/rollback-service';
import { RevisionError } from '@/lib/services/revision-service';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  try {
    const result = await rollbackRevision({
      revision_id: id,
      confirm: body.confirm,
      source: 'single',
    });

    return NextResponse.json({
      success: true,
      message: 'Rollback completed successfully',
      revision_id: result.revision_id,
      backup_id: result.backup_id,
      status: result.status,
    });
  } catch (error: any) {
    if (error instanceof RevisionError) {
      const statusMap: Record<string, number> = {
        CONFIRMATION_REQUIRED: 400,
        ROLLBACK_CONFIRMATION_REQUIRED: 400,
        NOT_FOUND: 404,
        INVALID_STATUS: 400,
        BACKUP_NOT_FOUND: 404,
        WP_WRITE_FAILED: 500,
      };
      return NextResponse.json({ error: error.code, message: error.message }, { status: statusMap[error.code] || 400 });
    }
    console.error('Error rolling back revision:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
