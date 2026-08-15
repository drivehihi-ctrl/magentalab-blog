export const STAGING_COMPATIBILITY_NOTE = 'MAGENTALAB_STAGE_APPROVED_REVISION';

export function isStagingCompatibilityRequest(decision: unknown, note: unknown): boolean {
  return decision === 'approve' && note === STAGING_COMPATIBILITY_NOTE;
}
