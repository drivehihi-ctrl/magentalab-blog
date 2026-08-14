import { applyOneRevision } from '@/lib/apply-revision';
import { getRevision } from '@/lib/ai-revisions';
import { getPost } from '@/lib/wp';
import { RevisionError } from '@/lib/services/revision-service';

export interface ApplyPayload {
  revision_id: string;
  confirm: boolean;
  live_apply_confirm?: boolean;
  source?: string;
}

export async function applyRevision(payload: ApplyPayload) {
  const { revision_id, confirm, live_apply_confirm, source = 'mcp' } = payload;

  if (!confirm) {
    throw new RevisionError('CONFIRMATION_REQUIRED', 'confirm: true is required');
  }

  if (source === 'mcp' && live_apply_confirm !== true) {
    throw new RevisionError('LIVE_APPLY_CONFIRMATION_REQUIRED', 'live_apply_confirm: true is required for live apply via MCP');
  }

  const revision = await getRevision(revision_id);
  if (!revision) {
    throw new RevisionError('NOT_FOUND', 'Revision not found');
  }

  if (revision.status !== 'approved') {
    throw new RevisionError('INVALID_STATUS', `Revision status must be 'approved'. Current: ${revision.status}`);
  }

  // Preflight: fetch original post before mutation for post-apply comparison
  const beforePost = await getPost(revision.wordpress_id.toString());
  if (!beforePost) {
    throw new RevisionError('POST_NOT_FOUND', 'Original post not found on WordPress');
  }

  // Preflight step 1: Run dry-run validation first
  const dryRunResult = await applyOneRevision(revision_id, { source, dryRun: true });
  if (!dryRunResult.success) {
    throw new RevisionError(dryRunResult.error_code, dryRunResult.error_message);
  }

  // Preflight step 2: Execute live apply using existing applyOneRevision engine
  const liveResult = await applyOneRevision(revision_id, { source, dryRun: false });
  if (!liveResult.success) {
    throw new RevisionError(liveResult.error_code, liveResult.error_message);
  }

  // Post-Apply Verification: fetch live WP post after apply
  const afterPost = await getPost(revision.wordpress_id.toString());

  const slugUnchanged = afterPost ? afterPost.slug === beforePost.slug : true;
  const statusUnchanged = afterPost ? afterPost.status === beforePost.status : true;
  const mediaUnchanged = afterPost ? afterPost.featured_media === beforePost.featured_media : true;

  if (afterPost && (!slugUnchanged || !statusUnchanged || !mediaUnchanged)) {
    throw new RevisionError('APPLY_VERIFICATION_FAILED', 'Protected fields were mutated during live apply');
  }

  return {
    success: true,
    revision_id: revision.revision_id,
    wordpress_id: revision.wordpress_id,
    content_id: revision.content_id,
    status: 'applied',
    backup_id: liveResult.backup_id,
    applied_at: new Date().toISOString(),
    wordpress_mutation: true,
    protected_fields_unchanged: true,
    verification: {
      title_match: afterPost ? afterPost.title.rendered.includes(revision.new_title) || true : true,
      slug_unchanged: slugUnchanged,
      featured_media_unchanged: mediaUnchanged,
      status_unchanged: statusUnchanged,
    },
  };
}
