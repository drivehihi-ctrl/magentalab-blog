// lib/services/review-service.ts
import { getRevision, getBackupByRevision, saveRevision, logAction } from '@/lib/ai-revisions';
import { assessMedicalRisk } from '@/lib/medical-risk';
import { RevisionError } from '@/lib/services/revision-service';
import { isApprovalTransitionAllowed } from '@/lib/services/review-transition';

export interface ReviewPayload {
  revision_id: string;
  decision: 'approve' | 'reject';
  confirm: boolean;
  medical_review_confirm?: boolean;
  note?: string;
  source?: string;
}

/**
 * Shared service that implements the human‑review logic.
 * Both the existing REST review route and the new MCP tool call this service.
 * No WordPress mutation occurs – only Supabase revision status and audit log are updated.
 */
export async function reviewRevision(payload: ReviewPayload) {
  const { revision_id, decision, confirm, medical_review_confirm, note, source = 'mcp' } = payload;

  // ---- Guard: confirmation required ----
  if (!confirm) {
    throw new RevisionError('CONFIRMATION_REQUIRED', 'confirm: true is required');
  }

  // ---- Guard: valid decision ----
  if (decision !== 'approve' && decision !== 'reject') {
    throw new RevisionError('INVALID_ACTION', 'decision must be approve or reject');
  }

  // ---- Load revision ----
  const revision = await getRevision(revision_id);
  if (!revision) {
    throw new RevisionError('NOT_FOUND', 'Revision not found');
  }

  // ---- Guard: allowed state transition ----
  const wasRolledBack = revision.status === 'rolled_back';
  const rollbackBackup = wasRolledBack ? await getBackupByRevision(revision_id) : undefined;
  if (decision === 'approve' && !isApprovalTransitionAllowed(revision.status, !!rollbackBackup)) {
    const detail = wasRolledBack && !rollbackBackup ? ' (rollback backup not found)' : '';
    throw new RevisionError('INVALID_STATUS', `Cannot approve a revision with status ${revision.status}${detail}`);
  }
  if (decision === 'reject' && revision.status !== 'pending_review' && revision.status !== 'approved') {
    throw new RevisionError('INVALID_STATUS', `Cannot reject a revision with status ${revision.status}`);
  }

  // ---- Medical content guard ----
  if (decision === 'approve') {
    const risk = assessMedicalRisk(revision.slug, revision.new_title, revision.new_content);
    if (risk.isMedical && medical_review_confirm !== true) {
      throw new RevisionError('MEDICAL_REVIEW_CONFIRMATION_REQUIRED', 'Medical review confirmation required');
    }
    if (risk.isMedical) {
      revision.medical_reviewed = true;
    }
  }

  // ---- Apply status change ----
  revision.status = decision === 'approve' ? 'approved' : 'rejected';
  await saveRevision(revision);

  // ---- Audit log (message field used, note maps to message) ----
  await logAction({
    timestamp: new Date().toISOString(),
    action: decision === 'approve'
      ? (wasRolledBack ? 'REAPPROVE_ROLLED_BACK_REVISION' : 'APPROVE_REVISION')
      : 'REJECT_REVISION',
    wordpress_id: revision.wordpress_id,
    content_id: revision.content_id,
    revision_id: revision.revision_id,
    source,
    status: 'success',
    message: note ?? undefined,
  });

  // ---- Return result used by both REST and MCP callers ----
  return {
    revision_id: revision.revision_id,
    wordpress_id: revision.wordpress_id,
    content_id: revision.content_id,
    status: revision.status,
    medical_reviewed: !!revision.medical_reviewed,
    decision,
    reviewed_at: new Date().toISOString(),
    wordPress_mutation: false,
  };
}
