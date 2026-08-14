import { getRevision, saveRevision, getBackupByRevision, logAction } from '@/lib/ai-revisions';
import { evidenceRepository } from '@/lib/repositories';
import { getWordPressWriteConfig, getWordPressWriteHeaders } from '@/lib/wp-write-auth';
import { getPost } from '@/lib/wp';
import { RevisionError } from '@/lib/services/revision-service';

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

  if (revision.status !== 'applied') {
    throw new RevisionError('INVALID_STATUS', `Only applied revisions can be rolled back. Current status: ${revision.status}`);
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
    throw new RevisionError('WP_WRITE_FAILED', `WP Rollback Failed: ${errorData.slice(0, 200)}`);
  }

  await evidenceRepository.restore(backup.wordpress_id, backup.evidence || null);

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

  // Post-rollback verification
  const currentPost = await getPost(backup.wordpress_id.toString());
  const restoreVerified = !!currentPost && currentPost.title.rendered === backup.title;

  return {
    success: true,
    revision_id: revision.revision_id,
    wordpress_id: revision.wordpress_id,
    content_id: revision.content_id,
    status: 'rolled_back',
    backup_id: backup.backup_id,
    rolled_back_at: new Date().toISOString(),
    wordpress_mutation: true,
    restore_verified: restoreVerified,
  };
}
