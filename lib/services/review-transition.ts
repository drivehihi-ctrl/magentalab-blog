import type { AIRevision } from '@/lib/ai-revisions';

/**
 * Approval is normally pending_review -> approved. A rolled-back revision may
 * be re-approved only when its rollback backup still exists, proving it passed
 * through the controlled apply/rollback path.
 */
export function isApprovalTransitionAllowed(
  status: AIRevision['status'],
  hasRollbackBackup: boolean
): boolean {
  return status === 'pending_review' || (status === 'rolled_back' && hasRollbackBackup);
}

export function isApprovedRollbackRebaseAllowed(
  status: AIRevision['status'],
  hasRollbackHistory: boolean,
  hasRollbackBackup: boolean
): boolean {
  return status === 'approved' && hasRollbackHistory && hasRollbackBackup;
}
