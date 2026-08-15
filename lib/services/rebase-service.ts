import { getBackupByRevision, getRevision, logAction, saveRevision } from '@/lib/ai-revisions';
import { getPost } from '@/lib/wp';
import { getRebaseMismatches } from '@/lib/services/rebase-guards';
import { RevisionError } from '@/lib/services/revision-service';

export interface RebaseRevisionPayload {
  revision_id: string;
  confirm: boolean;
  source?: string;
}

/**
 * Refreshes only the optimistic-lock timestamp for a previously rolled-back
 * revision after proving that WordPress still exactly matches the revision's
 * pre-apply rendered snapshot. The rollback backup must exist, but its raw
 * author source is not compared to WordPress rendered HTML because those are
 * different representation layers. This never writes to WordPress or changes
 * the proposed content.
 */
export async function rebaseRolledBackRevision(payload: RebaseRevisionPayload) {
  const { revision_id, confirm, source = 'mcp' } = payload;

  if (!confirm) {
    throw new RevisionError('CONFIRMATION_REQUIRED', 'confirm: true is required');
  }

  const revision = await getRevision(revision_id);
  if (!revision) throw new RevisionError('NOT_FOUND', 'Revision not found');
  if (revision.status !== 'approved' || !revision.rolled_back_at) {
    throw new RevisionError(
      'INVALID_STATUS',
      'Only a re-approved revision with rollback history can be rebased'
    );
  }

  const backup = await getBackupByRevision(revision_id);
  if (!backup) {
    throw new RevisionError('ROLLBACK_BACKUP_NOT_FOUND', 'Rollback backup not found');
  }

  const currentPost = await getPost(revision.wordpress_id.toString(), { noCache: true });
  if (!currentPost) throw new RevisionError('POST_NOT_FOUND', 'Original post not found on WordPress');

  const revisionMismatches = getRebaseMismatches({
    title: revision.previous_title,
    content: revision.previous_content,
    excerpt: revision.previous_excerpt,
    slug: revision.slug,
    featured_media: backup.featured_media,
  }, currentPost);
  const mismatches = revisionMismatches;
  if (mismatches.length > 0) {
    throw new RevisionError(
      'REBASE_BASELINE_MISMATCH',
      `Current WordPress post differs from the rollback baseline: ${mismatches.join(', ')}`
    );
  }

  const previousSourceModifiedAt = revision.source_modified_at;
  revision.source_modified_at = currentPost.modified;
  await saveRevision(revision);

  await logAction({
    timestamp: new Date().toISOString(),
    action: 'REBASE_ROLLED_BACK_REVISION',
    wordpress_id: revision.wordpress_id,
    content_id: revision.content_id,
    revision_id: revision.revision_id,
    source,
    status: 'success',
    message: `source_modified_at: ${previousSourceModifiedAt} -> ${currentPost.modified}`,
  });

  return {
    revision_id: revision.revision_id,
    wordpress_id: revision.wordpress_id,
    status: revision.status,
    previous_source_modified_at: previousSourceModifiedAt,
    source_modified_at: revision.source_modified_at,
    baseline_match: true,
    wordpress_mutation: false,
  };
}
