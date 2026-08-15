import type { AIRevision } from '@/lib/ai-revisions';

export function isRollbackAllowed(
  status: AIRevision['status'],
  hasBackup: boolean
): boolean {
  if (!hasBackup) return false;
  return status === 'applied'
    || status === 'applying'
    || status === 'approved'
    || status === 'rollback_pending'
    || status === 'rollback_failed';
}
