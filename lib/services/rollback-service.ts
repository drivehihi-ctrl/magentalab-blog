import { getRevision, saveRevision, getBackupByRevision, logAction } from '@/lib/ai-revisions';
import { evidenceRepository } from '@/lib/repositories';
import { getWordPressWriteConfig, getWordPressWriteHeaders } from '@/lib/wp-write-auth';
import { getPost } from '@/lib/wp';
import { RevisionError } from '@/lib/services/revision-service';
import { compareNormalized, compareEvidence, compareAnsimSummary } from '@/lib/services/verification-helpers';

export interface RollbackPayload {
  revision_id: string;
  confirm: boolean;
  rollback_confirm?: boolean;
  source?: string;
}

export async function rollbackRevision(payload: RollbackPayload) {
  const { revision_id, confirm, rollback_confirm, source = 'system' } = payload;

  if (!confirm) {
    throw new RevisionError('CONFIRMATION_REQUIRED', 'confirm: true is required');
  }

  if (source === 'mcp' && rollback_confirm !== true) {
    throw new RevisionError('ROLLBACK_CONFIRMATION_REQUIRED', 'rollback_confirm: true is required');
  }

  const revision = await getRevision(revision_id);
  if (!revision) {
    throw new RevisionError('NOT_FOUND', 'Revision not found');
  }

  if (revision.status !== 'applied' && revision.status !== 'applying' && revision.status !== 'approved' && revision.status !== 'rollback_pending') {
    throw new RevisionError('INVALID_STATUS', `Revision status must be 'applied', 'applying', or 'approved' to rollback. Current status: ${revision.status}`);
  }

  const backup = await getBackupByRevision(revision_id);
  if (!backup) {
    throw new RevisionError('BACKUP_NOT_FOUND', 'No backup found for this revision');
  }

  const { baseUrl } = getWordPressWriteConfig();

  const updatePayload: Record<string, unknown> = {
    title: backup.title,
    content: backup.content,
    excerpt: backup.excerpt,
  };

  if (backup.featured_media !== undefined) {
    updatePayload.featured_media = backup.featured_media;
  }

  const wpRes = await fetch(`${baseUrl}/wp-json/wp/v2/posts/${backup.wordpress_id}`, {
    method: 'POST',
    headers: getWordPressWriteHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(updatePayload),
  });

  if (!wpRes.ok) {
    const errorData = await wpRes.text();
    await logAction({
      timestamp: new Date().toISOString(),
      action: 'ROLLBACK_FAILED',
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      revision_id: revision.revision_id,
      source,
      status: 'error',
      message: `WP Rollback Failed: ${errorData.slice(0, 200)}`,
    });
    revision.status = 'rollback_failed';
    await saveRevision(revision);
    throw new RevisionError('WP_WRITE_FAILED', `WP Rollback Failed: ${errorData.slice(0, 200)}`);
  }

  // Restore evidence (including backup ansim_summary if present)
  await evidenceRepository.restore(backup.wordpress_id, backup.evidence || null);
  if (evidenceRepository.saveAnsimSummary) {
    await evidenceRepository.saveAnsimSummary(backup.wordpress_id, backup.ansim_summary || null);
  }
  const restoredEvidence = await evidenceRepository.getByPostId(backup.wordpress_id);
  const restoredAnsimSummary = evidenceRepository.getAnsimSummary ? await evidenceRepository.getAnsimSummary(backup.wordpress_id) : undefined;

  // Post-rollback verification: fetch live WP post after rollback without cache
  const currentPost = await getPost(backup.wordpress_id.toString(), { noCache: true });

  const titleMatch = !!currentPost && compareNormalized(currentPost.title?.rendered, backup.title);
  const contentMatch = !!currentPost && compareNormalized(currentPost.content?.rendered, backup.content);
  const excerptMatch = !!currentPost && compareNormalized(currentPost.excerpt?.rendered, backup.excerpt);
  const slugUnchanged = !!currentPost && currentPost.slug === backup.slug;
  const mediaUnchanged = !!currentPost && (backup.featured_media === undefined || currentPost.featured_media === backup.featured_media);
  
  // Strict canonical structure & null symmetry evidence comparison
  const evidenceMatch = compareEvidence(backup.evidence, restoredEvidence);
  const ansimSummaryMatch = (backup.ansim_summary === undefined || backup.ansim_summary === null)
    ? (restoredAnsimSummary === undefined || restoredAnsimSummary === null)
    : compareAnsimSummary(restoredAnsimSummary, backup.ansim_summary);

  const restoreVerified = !!currentPost && titleMatch && contentMatch && excerptMatch && slugUnchanged && mediaUnchanged && evidenceMatch && ansimSummaryMatch;

  if (!restoreVerified) {
    const failureDetails = `title=${titleMatch}, content=${contentMatch}, excerpt=${excerptMatch}, slug=${slugUnchanged}, media=${mediaUnchanged}, evidence=${evidenceMatch}, ansim=${ansimSummaryMatch}`;
    await logAction({
      timestamp: new Date().toISOString(),
      action: 'ROLLBACK_VERIFICATION_FAILED',
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      revision_id: revision.revision_id,
      source,
      status: 'error',
      message: `Rollback verification failed [${failureDetails}].`,
    });
    revision.status = 'rollback_failed';
    await saveRevision(revision);
    throw new RevisionError('ROLLBACK_VERIFICATION_FAILED', `Post-rollback verification failed [${failureDetails}]. Revision status set to rollback_failed.`);
  }

  // Save revision status ONLY AFTER verification passes
  revision.status = 'rolled_back';
  await saveRevision(revision);

  await logAction({
    timestamp: new Date().toISOString(),
    action: 'ROLLBACK_REVISION',
    wordpress_id: revision.wordpress_id,
    content_id: revision.content_id,
    revision_id: revision.revision_id,
    source,
    status: 'success',
  });

  return {
    success: true,
    revision_id: revision.revision_id,
    wordpress_id: revision.wordpress_id,
    content_id: revision.content_id,
    status: 'rolled_back',
    backup_id: backup.backup_id,
    rolled_back_at: new Date().toISOString(),
    wordpress_mutation: true,
    restore_verified: true,
  };
}
