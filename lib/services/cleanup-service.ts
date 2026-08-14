import { revisionRepository, backupRepository } from '@/lib/repositories';
import { getPost } from '@/lib/wp';
import { logAction } from '@/lib/ai-revisions';

export interface CleanupResult {
  wordpress_id: number;
  stale_revisions_remediated: Array<{
    revision_id: string;
    previous_status: string;
    new_status: string;
    reason: string;
  }>;
}

/**
 * Audit and remediate stale revision statuses where the DB recorded 'applied'
 * but the authoritative live WordPress post was actually rolled back to the original backup state.
 */
export async function remediateStaleRevisionsForPost(wordpress_id: number): Promise<CleanupResult> {
  const currentPost = await getPost(wordpress_id.toString(), { noCache: true });
  if (!currentPost) {
    throw new Error(`Post ${wordpress_id} not found on WordPress`);
  }

  const allRevisions = await revisionRepository.list();
  const postRevisions = allRevisions.filter(r => r.wordpress_id === wordpress_id);

  const remediated: Array<{ revision_id: string; previous_status: string; new_status: string; reason: string }> = [];

  for (const rev of postRevisions) {
    if (rev.status === 'applied' || rev.status === 'applying') {
      const backup = await backupRepository.getByRevision(rev.revision_id);
      // If live WP content does NOT match rev.new_title or rev.new_content, but matches original backup
      if (currentPost.title?.rendered !== rev.new_title) {
        const previousStatus = rev.status;
        const newStatus = backup ? 'rolled_back' : 'apply_failed';

        rev.status = newStatus;
        await revisionRepository.save(rev);

        await logAction({
          timestamp: new Date().toISOString(),
          action: 'REMEDIATE_STALE_REVISION_STATUS',
          wordpress_id,
          content_id: rev.content_id,
          revision_id: rev.revision_id,
          source: 'cleanup_service',
          status: 'success',
          message: `Changed status from ${previousStatus} to ${newStatus} due to live WP state mismatch`,
        });

        remediated.push({
          revision_id: rev.revision_id,
          previous_status: previousStatus,
          new_status: newStatus,
          reason: `Live WP title (${currentPost.title?.rendered}) does not match revision title (${rev.new_title}). Remediated to ${newStatus}.`
        });
      }
    }
  }

  return {
    wordpress_id,
    stale_revisions_remediated: remediated
  };
}
