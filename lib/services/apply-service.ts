import { applyOneRevision } from '@/lib/apply-revision';
import { getRevision, saveRevision, logAction } from '@/lib/ai-revisions';
import { getPost } from '@/lib/wp';
import { evidenceRepository } from '@/lib/repositories';
import { RevisionError } from '@/lib/services/revision-service';
import { rollbackRevision } from '@/lib/services/rollback-service';
import { compareNormalized, compareCanonicalContent, compareAnsimSummary } from '@/lib/services/verification-helpers';

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
  const beforePost = await getPost(revision.wordpress_id.toString(), { noCache: true });
  if (!beforePost) {
    throw new RevisionError('POST_NOT_FOUND', 'Original post not found on WordPress');
  }

  const beforeSlug = beforePost.slug;
  const beforeStatus = beforePost.status;
  const beforeMedia = beforePost.featured_media;
  const beforeCategories = JSON.stringify((beforePost.categories || []).slice().sort((a: number, b: number) => a - b));
  const beforeTags = JSON.stringify((beforePost.tags || []).slice().sort((a: number, b: number) => a - b));

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

  // Post-Apply Verification: fetch live WP post after apply without cache
  const afterPost = await getPost(revision.wordpress_id.toString(), { noCache: true });
  const liveEvidence = await evidenceRepository.getByPostId(revision.wordpress_id);
  const liveAnsimSummary = evidenceRepository.getAnsimSummary ? await evidenceRepository.getAnsimSummary(revision.wordpress_id) : undefined;

  // Strict verification checks
  const titleMatch = !!afterPost && compareNormalized(afterPost.title?.rendered, revision.new_title);
  const contentMatch = !!afterPost && compareCanonicalContent(revision.new_content, afterPost.content?.rendered);
  const excerptMatch = !!afterPost && compareNormalized(afterPost.excerpt?.rendered, revision.new_excerpt);
  const ansimSummaryMatch = (revision.new_ansim_summary === undefined || revision.new_ansim_summary === null) 
    ? true 
    : compareAnsimSummary(liveAnsimSummary, revision.new_ansim_summary);

  const slugUnchanged = !!afterPost && afterPost.slug === beforeSlug;
  const statusUnchanged = !!afterPost && afterPost.status === beforeStatus;
  const mediaUnchanged = !!afterPost && afterPost.featured_media === beforeMedia;
  const categoriesUnchanged = !!afterPost && JSON.stringify((afterPost.categories || []).slice().sort((a: number, b: number) => a - b)) === beforeCategories;
  const tagsUnchanged = !!afterPost && JSON.stringify((afterPost.tags || []).slice().sort((a: number, b: number) => a - b)) === beforeTags;

  const protectedFieldsUnchanged = slugUnchanged && statusUnchanged && mediaUnchanged && categoriesUnchanged && tagsUnchanged;
  const verificationPassed = !!afterPost && titleMatch && excerptMatch && ansimSummaryMatch && protectedFieldsUnchanged;

  if (!verificationPassed) {
    await logAction({
      timestamp: new Date().toISOString(),
      action: 'APPLY_VERIFICATION_FAILED',
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      revision_id: revision.revision_id,
      source,
      status: 'error',
      message: `Verification failed. afterPost=${!!afterPost}, title=${titleMatch}, content=${contentMatch}, excerpt=${excerptMatch}, ansim=${ansimSummaryMatch}, protected=${protectedFieldsUnchanged}`,
    });

    // Auto-rollback attempt
    let autoRollbackSuccess = false;
    try {
      const rbRes = await rollbackRevision({
        revision_id: revision.revision_id,
        confirm: true,
        rollback_confirm: true,
        source: `${source}_auto_rollback`,
      });
      autoRollbackSuccess = rbRes.success;
    } catch (rbErr) {
      console.error('[applyRevision] Auto-rollback failed:', rbErr);
    }

    const failureDetails = `title=${titleMatch}, content=${contentMatch}, excerpt=${excerptMatch}, ansimSummary=${ansimSummaryMatch}, slug=${slugUnchanged}, status=${statusUnchanged}, media=${mediaUnchanged}, categories=${categoriesUnchanged}, tags=${tagsUnchanged}`;

    if (autoRollbackSuccess) {
      const revToUpdate = await getRevision(revision_id);
      if (revToUpdate && revToUpdate.status !== 'rolled_back') {
        revToUpdate.status = 'rolled_back';
        await saveRevision(revToUpdate);
      }
      throw new RevisionError(
        'APPLY_VERIFICATION_FAILED',
        `Post-apply verification failed [${failureDetails}]. Automatic rollback was performed successfully. (rollback_performed: true, rollback_success: true)`
      );
    } else {
      const revToUpdate = await getRevision(revision_id);
      if (revToUpdate) {
        revToUpdate.status = 'rollback_failed';
        await saveRevision(revToUpdate);
      }
      throw new RevisionError(
        'CRITICAL_APPLY_ROLLBACK_FAILED',
        `Post-apply verification failed [${failureDetails}] and automatic rollback also failed! Manual intervention required. (rollback_performed: true, rollback_success: false)`
      );
    }
  }

  // ALL VERIFICATIONS PASSED -> Mark revision as applied
  const finalRev = await getRevision(revision_id);
  if (finalRev) {
    finalRev.status = 'applied';
    await saveRevision(finalRev);
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
      title_match: titleMatch,
      content_match: contentMatch,
      excerpt_match: excerptMatch,
      ansim_summary_match: ansimSummaryMatch,
      slug_unchanged: slugUnchanged,
      featured_media_unchanged: mediaUnchanged,
      status_unchanged: statusUnchanged,
      categories_unchanged: categoriesUnchanged,
      tags_unchanged: tagsUnchanged,
    },
  };
}
