import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { applyOneRevision } from '@/lib/apply-revision';
import { logAction } from '@/lib/ai-revisions';

const BATCH_MAX = 3;

export async function POST(req: Request) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  let body: { revision_ids?: unknown; confirm?: unknown; dry_run?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON', message: 'Request body must be valid JSON' }, { status: 400 });
  }

  // ── Input validation ──────────────────────────────────────────────────────
  if (body.confirm !== true) {
    return NextResponse.json(
      { error: 'REQUIRE_CONFIRM', message: 'confirm: true is required' },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.revision_ids) || body.revision_ids.length === 0) {
    return NextResponse.json(
      { error: 'INVALID_INPUT', message: 'revision_ids must be a non-empty array' },
      { status: 400 }
    );
  }

  if (body.revision_ids.length > BATCH_MAX) {
    return NextResponse.json(
      { error: 'BATCH_LIMIT_EXCEEDED', message: `Maximum ${BATCH_MAX} revisions per batch` },
      { status: 400 }
    );
  }

  const revisionIds: string[] = body.revision_ids.map(String);
  const dryRun = body.dry_run === true;
  const request_id = `batch_${crypto.randomBytes(6).toString('hex')}`;

  // ── Audit: batch started ──────────────────────────────────────────────────
  await logAction({
    timestamp: new Date().toISOString(),
    action: 'BATCH_APPLY_STARTED',
    wordpress_id: 0,
    content_id: request_id,
    source: 'batch',
    status: 'info',
    message: `revision_ids=${revisionIds.join(',')} dry_run=${dryRun}`,
  });

  // ── Sequential apply with STOP_ON_FIRST_ERROR ─────────────────────────────
  type BatchResultItem = {
    revision_id: string;
    status: 'applied' | 'failed';
    backup_id?: string;
    error_code?: string;
    error_message?: string;
    dry_run?: boolean;
  };

  const results: BatchResultItem[] = [];
  let applied = 0;
  let failed = 0;
  let stopped_on_error = false;

  for (const revisionId of revisionIds) {
    const result = await applyOneRevision(revisionId, { source: 'batch', dryRun });

    if (result.success) {
      applied++;
      results.push({
        revision_id: result.revision_id,
        status: 'applied',
        backup_id: result.backup_id,
        ...(dryRun ? { dry_run: true } : {}),
      });
    } else {
      failed++;
      stopped_on_error = true;

      results.push({
        revision_id: result.revision_id,
        status: 'failed',
        error_code: result.error_code,
        error_message: result.error_message,
      });

      await logAction({
        timestamp: new Date().toISOString(),
        action: 'BATCH_APPLY_STOPPED',
        wordpress_id: 0,
        content_id: request_id,
        source: 'batch',
        status: 'error',
        message: `Stopped at revision ${revisionId}: ${result.error_code} — ${result.error_message}`,
      });

      break; // STOP_ON_FIRST_ERROR
    }
  }

  // ── Audit: batch completed ────────────────────────────────────────────────
  await logAction({
    timestamp: new Date().toISOString(),
    action: 'BATCH_APPLY_COMPLETED',
    wordpress_id: 0,
    content_id: request_id,
    source: 'batch',
    status: stopped_on_error ? 'error' : 'success',
    message: `applied=${applied} failed=${failed} stopped_on_error=${stopped_on_error}`,
  });

  return NextResponse.json({
    request_id,
    dry_run: dryRun,
    attempted: results.length,
    applied,
    failed,
    stopped_on_error,
    results,
  });
}
