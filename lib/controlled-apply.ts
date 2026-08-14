import crypto from 'crypto';
import { applyOneRevision } from '@/lib/apply-revision';
import { logAction } from '@/lib/ai-revisions';

export type BatchResultItem = {
  revision_id: string;
  status: 'applied' | 'failed';
  backup_id?: string;
  error_code?: string;
  error_message?: string;
  dry_run?: boolean;
};

export type ControlledApplyResult = {
  request_id: string;
  dry_run: boolean;
  attempted: number;
  applied: number;
  failed: number;
  stopped_on_error: boolean;
  results: BatchResultItem[];
};

export async function controlledApply(
  revisionIds: string[],
  options: { dryRun: boolean; source: string }
): Promise<ControlledApplyResult> {
  const request_id = `batch_${crypto.randomBytes(6).toString('hex')}`;
  const { dryRun, source } = options;

  await logAction({
    timestamp: new Date().toISOString(),
    action: 'BATCH_APPLY_STARTED',
    wordpress_id: 0,
    content_id: request_id,
    source,
    status: 'info',
    message: `revision_ids=${revisionIds.join(',')} dry_run=${dryRun}`,
  });

  const results: BatchResultItem[] = [];
  let applied = 0;
  let failed = 0;
  let stopped_on_error = false;

  for (const revisionId of revisionIds) {
    const result = await applyOneRevision(revisionId, { source, dryRun });

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
        source,
        status: 'error',
        message: `Stopped at revision ${revisionId}: ${result.error_code} — ${result.error_message}`,
      });

      break;
    }
  }

  await logAction({
    timestamp: new Date().toISOString(),
    action: 'BATCH_APPLY_COMPLETED',
    wordpress_id: 0,
    content_id: request_id,
    source,
    status: stopped_on_error ? 'error' : 'success',
    message: `applied=${applied} failed=${failed} stopped_on_error=${stopped_on_error}`,
  });

  return {
    request_id,
    dry_run: dryRun,
    attempted: results.length,
    applied,
    failed,
    stopped_on_error,
    results,
  };
}
