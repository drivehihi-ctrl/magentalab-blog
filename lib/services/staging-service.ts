import 'server-only';

import { getRevision, logAction } from '@/lib/ai-revisions';
import { applyOneRevision } from '@/lib/apply-revision';
import { getPost } from '@/lib/wp';
import { getWordPressWriteConfig, getWordPressWriteHeaders } from '@/lib/wp-write-auth';
import { RevisionError } from '@/lib/services/revision-service';
import { compareCanonicalContent, compareNormalized } from '@/lib/services/verification-helpers';
import { stagingSlug } from '@/lib/services/staging-guards';
import { imageAssetRepository } from '@/lib/repositories/image-asset-repository';
import {
  hasExpectedImageSlots,
  injectImageSlotBlocks,
  stripImageSlotBlocks,
} from '@/lib/image-pipeline/staging-image-blocks';

export { stagingSlug } from '@/lib/services/staging-guards';

export interface StageRevisionPayload {
  revision_id: string;
  confirm: boolean;
  staging_apply_confirm?: boolean;
  source?: string;
}

type EditablePost = {
  id: number;
  status: string;
  slug: string;
  title?: { raw?: string; rendered?: string };
  content?: { raw?: string; rendered?: string };
  excerpt?: { raw?: string; rendered?: string };
};

function rawOrRendered(field?: { raw?: string; rendered?: string }): string {
  return field?.raw ?? field?.rendered ?? '';
}

function draftMatchesRevision(post: EditablePost, revision: {
  new_title: string;
  new_content: string;
  new_excerpt: string;
}): boolean {
  return post.status === 'draft'
    && compareNormalized(rawOrRendered(post.title), revision.new_title)
    && compareCanonicalContent(revision.new_content, rawOrRendered(post.content))
    && compareNormalized(rawOrRendered(post.excerpt), revision.new_excerpt);
}

function draftMatchesImageRevision(post: EditablePost, revision: {
  new_title: string;
  new_content: string;
  new_excerpt: string;
}, plans: Awaited<ReturnType<typeof imageAssetRepository.listImageAssetsByRevision>>): boolean {
  const content = rawOrRendered(post.content);
  return post.status === 'draft'
    && compareNormalized(rawOrRendered(post.title), revision.new_title)
    && compareCanonicalContent(revision.new_content, stripImageSlotBlocks(content))
    && compareNormalized(rawOrRendered(post.excerpt), revision.new_excerpt)
    && hasExpectedImageSlots(content, plans);
}

async function requireApprovedRevisionForStaging(revisionId: string, source: string) {
  const revision = await getRevision(revisionId);
  if (!revision) throw new RevisionError('NOT_FOUND', 'Revision not found');
  if (revision.status !== 'approved') {
    throw new RevisionError('INVALID_STATUS', `Revision must be 'approved'. Current: ${revision.status}`);
  }
  const dryRun = await applyOneRevision(revisionId, { source: `${source}_staging`, dryRun: true });
  if (!dryRun.success) throw new RevisionError(dryRun.error_code, dryRun.error_message);
  return revision;
}

function requireStagingConfirmation(confirm: boolean, stagingApplyConfirm: boolean | undefined, source: string) {
  if (!confirm) {
    throw new RevisionError('CONFIRMATION_REQUIRED', 'confirm: true is required');
  }
  if (source === 'mcp' && stagingApplyConfirm !== true) {
    throw new RevisionError(
      'STAGING_APPLY_CONFIRMATION_REQUIRED',
      'staging_apply_confirm: true is required for WordPress draft mutation via MCP'
    );
  }
}

async function removeCreatedDraft(baseUrl: string, draftId: number): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts/${draftId}?force=true`, {
      method: 'DELETE',
      headers: getWordPressWriteHeaders(),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function stageRevision(payload: StageRevisionPayload) {
  const { revision_id, confirm, staging_apply_confirm, source = 'mcp' } = payload;

  if (!confirm) {
    throw new RevisionError('CONFIRMATION_REQUIRED', 'confirm: true is required');
  }
  if (source === 'mcp' && staging_apply_confirm !== true) {
    throw new RevisionError(
      'STAGING_APPLY_CONFIRMATION_REQUIRED',
      'staging_apply_confirm: true is required for WordPress draft creation via MCP'
    );
  }

  const revision = await getRevision(revision_id);
  if (!revision) throw new RevisionError('NOT_FOUND', 'Revision not found');
  if (revision.status !== 'approved') {
    throw new RevisionError('INVALID_STATUS', `Revision must be 'approved'. Current: ${revision.status}`);
  }

  // Reuse the exact same medical, structural and optimistic-lock guards as live apply.
  const dryRun = await applyOneRevision(revision_id, { source: `${source}_staging`, dryRun: true });
  if (!dryRun.success) throw new RevisionError(dryRun.error_code, dryRun.error_message);

  const sourcePostBefore = await getPost(String(revision.wordpress_id), { noCache: true });
  if (!sourcePostBefore) throw new RevisionError('POST_NOT_FOUND', 'Original post not found on WordPress');

  const { baseUrl } = getWordPressWriteConfig();
  const headers = getWordPressWriteHeaders({ 'Content-Type': 'application/json' });
  const slug = stagingSlug(revision.wordpress_id, revision.revision_id);

  const existingResponse = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=draft&context=edit&per_page=2`,
    { headers: getWordPressWriteHeaders() }
  );
  if (!existingResponse.ok) {
    throw new RevisionError('WP_STAGING_LOOKUP_FAILED', `Could not check existing staging draft (${existingResponse.status})`);
  }
  const existing = await existingResponse.json() as EditablePost[];
  if (existing.length > 1) {
    throw new RevisionError('WP_STAGING_DUPLICATE', 'Multiple staging drafts exist for this revision; manual cleanup required');
  }
  if (existing.length === 1) {
    if (!draftMatchesRevision(existing[0], revision)) {
      throw new RevisionError('WP_STAGING_CONFLICT', 'Existing staging draft differs from this revision and was not overwritten');
    }
    return {
      success: true,
      revision_id,
      wordpress_id: revision.wordpress_id,
      staging_post_id: existing[0].id,
      staging_status: 'draft',
      reused: true,
      edit_url: `${baseUrl}/wp-admin/post.php?post=${existing[0].id}&action=edit`,
      preview_url: `${baseUrl}/?p=${existing[0].id}&preview=true`,
      source_post_unchanged: true,
      wordpress_mutation: false,
    };
  }

  const createResponse = await fetch(`${baseUrl}/wp-json/wp/v2/posts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      status: 'draft',
      slug,
      title: revision.new_title,
      content: revision.new_content,
      excerpt: revision.new_excerpt,
      categories: sourcePostBefore.categories || [],
      tags: sourcePostBefore.tags || [],
      featured_media: sourcePostBefore.featured_media || 0,
    }),
  });
  if (!createResponse.ok) {
    const detail = (await createResponse.text()).slice(0, 300);
    throw new RevisionError('WP_STAGING_CREATE_FAILED', `WordPress draft creation failed: ${detail}`);
  }

  const created = await createResponse.json() as EditablePost;
  const verifyResponse = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts/${created.id}?context=edit`,
    { headers: getWordPressWriteHeaders() }
  );
  const verified = verifyResponse.ok ? await verifyResponse.json() as EditablePost : null;
  const sourcePostAfter = await getPost(String(revision.wordpress_id), { noCache: true });
  const sourceUnchanged = !!sourcePostAfter
    && sourcePostAfter.modified === sourcePostBefore.modified
    && sourcePostAfter.status === sourcePostBefore.status
    && sourcePostAfter.slug === sourcePostBefore.slug;
  const verificationPassed = !!verified && draftMatchesRevision(verified, revision) && sourceUnchanged;

  if (!verificationPassed) {
    const cleanedUp = await removeCreatedDraft(baseUrl, created.id);
    await logAction({
      timestamp: new Date().toISOString(), action: 'STAGING_APPLY_VERIFICATION_FAILED',
      wordpress_id: revision.wordpress_id, content_id: revision.content_id,
      revision_id, source, status: 'error',
      message: `draft=${!!verified}, source_unchanged=${sourceUnchanged}, cleanup=${cleanedUp}`,
    });
    throw new RevisionError(
      cleanedUp ? 'STAGING_VERIFICATION_FAILED' : 'STAGING_CLEANUP_FAILED',
      `Draft verification failed; created draft cleanup ${cleanedUp ? 'succeeded' : 'failed'}`
    );
  }

  await logAction({
    timestamp: new Date().toISOString(), action: 'STAGING_APPLY_SUCCESS',
    wordpress_id: revision.wordpress_id, content_id: revision.content_id,
    revision_id, source, status: 'success', message: `staging_post_id=${created.id}`,
  });

  return {
    success: true,
    revision_id,
    wordpress_id: revision.wordpress_id,
    staging_post_id: created.id,
    staging_status: 'draft',
    reused: false,
    edit_url: `${baseUrl}/wp-admin/post.php?post=${created.id}&action=edit`,
    preview_url: `${baseUrl}/?p=${created.id}&preview=true`,
    source_post_unchanged: true,
    wordpress_mutation: true,
  };
}

export async function stageRevisionWithImages(payload: StageRevisionPayload) {
  const { revision_id, confirm, staging_apply_confirm, source = 'mcp' } = payload;
  requireStagingConfirmation(confirm, staging_apply_confirm, source);
  const revision = await requireApprovedRevisionForStaging(revision_id, source);
  const plans = await imageAssetRepository.listImageAssetsByRevision(revision_id);
  if (plans.length < 1 || plans.length > 6) {
    throw new RevisionError('IMAGE_PLANS_REQUIRED', 'Create 1 to 6 image plans before image staging');
  }
  const stagedContent = injectImageSlotBlocks(revision.new_content, plans);
  const sourcePostBefore = await getPost(String(revision.wordpress_id), { noCache: true });
  if (!sourcePostBefore) throw new RevisionError('POST_NOT_FOUND', 'Original post not found on WordPress');

  const { baseUrl } = getWordPressWriteConfig();
  const slug = stagingSlug(revision.wordpress_id, revision.revision_id);
  const existingResponse = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=draft&context=edit&per_page=2`,
    { headers: getWordPressWriteHeaders() }
  );
  if (!existingResponse.ok) {
    throw new RevisionError('WP_STAGING_LOOKUP_FAILED', `Could not check existing staging draft (${existingResponse.status})`);
  }
  const existing = await existingResponse.json() as EditablePost[];
  if (existing.length > 1) {
    throw new RevisionError('WP_STAGING_DUPLICATE', 'Multiple staging drafts exist for this revision; manual cleanup required');
  }
  if (existing.length === 1) {
    if (draftMatchesImageRevision(existing[0], revision, plans)) {
      return {
        success: true, revision_id, wordpress_id: revision.wordpress_id,
        staging_post_id: existing[0].id, staging_status: 'draft', reused: true,
        image_slots: plans.map((plan) => plan.slot),
        edit_url: `${baseUrl}/wp-admin/post.php?post=${existing[0].id}&action=edit`,
        preview_url: `${baseUrl}/?p=${existing[0].id}&preview=true`,
        source_post_unchanged: true, wordpress_mutation: false,
      };
    }
    throw new RevisionError(
      'STAGING_IMAGE_REFRESH_REQUIRED',
      `Staging draft ${existing[0].id} exists without the requested image slots; use magentalab_refresh_staging_image_slots`
    );
  }

  const createResponse = await fetch(`${baseUrl}/wp-json/wp/v2/posts`, {
    method: 'POST',
    headers: getWordPressWriteHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      status: 'draft', slug, title: revision.new_title, content: stagedContent,
      excerpt: revision.new_excerpt, categories: sourcePostBefore.categories || [],
      tags: sourcePostBefore.tags || [], featured_media: sourcePostBefore.featured_media || 0,
    }),
  });
  if (!createResponse.ok) {
    throw new RevisionError('WP_STAGING_CREATE_FAILED', `WordPress draft creation failed: ${(await createResponse.text()).slice(0, 300)}`);
  }
  const created = await createResponse.json() as EditablePost;
  const verifyResponse = await fetch(`${baseUrl}/wp-json/wp/v2/posts/${created.id}?context=edit`, {
    headers: getWordPressWriteHeaders(),
  });
  const verified = verifyResponse.ok ? await verifyResponse.json() as EditablePost : null;
  const sourcePostAfter = await getPost(String(revision.wordpress_id), { noCache: true });
  const sourceUnchanged = !!sourcePostAfter
    && sourcePostAfter.modified === sourcePostBefore.modified
    && sourcePostAfter.status === sourcePostBefore.status
    && sourcePostAfter.slug === sourcePostBefore.slug;
  if (!verified || !draftMatchesImageRevision(verified, revision, plans) || !sourceUnchanged) {
    const cleanedUp = await removeCreatedDraft(baseUrl, created.id);
    throw new RevisionError(
      cleanedUp ? 'STAGING_IMAGE_VERIFICATION_FAILED' : 'STAGING_IMAGE_CLEANUP_FAILED',
      `Image staging verification failed; created draft cleanup ${cleanedUp ? 'succeeded' : 'failed'}`
    );
  }

  await logAction({
    timestamp: new Date().toISOString(), action: 'STAGING_WITH_IMAGES_SUCCESS',
    wordpress_id: revision.wordpress_id, content_id: revision.content_id,
    revision_id, source, status: 'success', message: `staging_post_id=${created.id}, slots=${plans.length}`,
  });
  return {
    success: true, revision_id, wordpress_id: revision.wordpress_id,
    staging_post_id: created.id, staging_status: 'draft', reused: false,
    image_slots: plans.map((plan) => plan.slot),
    edit_url: `${baseUrl}/wp-admin/post.php?post=${created.id}&action=edit`,
    preview_url: `${baseUrl}/?p=${created.id}&preview=true`,
    source_post_unchanged: true, wordpress_mutation: true,
  };
}

export async function refreshStagingImageSlots(payload: StageRevisionPayload & { staging_post_id: number }) {
  const { revision_id, staging_post_id, confirm, staging_apply_confirm, source = 'mcp' } = payload;
  requireStagingConfirmation(confirm, staging_apply_confirm, source);
  if (!Number.isInteger(staging_post_id) || staging_post_id <= 0) {
    throw new RevisionError('INVALID_STAGING_POST_ID', 'staging_post_id must be a positive integer');
  }
  const revision = await requireApprovedRevisionForStaging(revision_id, source);
  const plans = await imageAssetRepository.listImageAssetsByRevision(revision_id);
  if (plans.length < 1 || plans.length > 6) {
    throw new RevisionError('IMAGE_PLANS_REQUIRED', 'Create 1 to 6 image plans before refreshing staging');
  }
  const stagedContent = injectImageSlotBlocks(revision.new_content, plans);
  const { baseUrl } = getWordPressWriteConfig();
  const sourcePostBefore = await getPost(String(revision.wordpress_id), { noCache: true });
  if (!sourcePostBefore) throw new RevisionError('POST_NOT_FOUND', 'Original post not found on WordPress');

  const draftResponse = await fetch(`${baseUrl}/wp-json/wp/v2/posts/${staging_post_id}?context=edit`, {
    headers: getWordPressWriteHeaders(),
  });
  if (!draftResponse.ok) throw new RevisionError('WP_STAGING_NOT_FOUND', 'Staging draft not found');
  const draft = await draftResponse.json() as EditablePost;
  const expectedSlug = stagingSlug(revision.wordpress_id, revision.revision_id);
  if (draft.status !== 'draft' || draft.slug !== expectedSlug) {
    throw new RevisionError('WP_STAGING_TARGET_MISMATCH', 'Target is not the exact draft for this revision');
  }
  if (!draftMatchesRevision(draft, revision) && !draftMatchesImageRevision(draft, revision, plans)) {
    throw new RevisionError('WP_STAGING_CONFLICT', 'Draft has edits outside managed image slots and was not overwritten');
  }
  if (draftMatchesImageRevision(draft, revision, plans)) {
    return {
      success: true, revision_id, wordpress_id: revision.wordpress_id,
      staging_post_id, staging_status: 'draft', reused: true,
      image_slots: plans.map((plan) => plan.slot),
      edit_url: `${baseUrl}/wp-admin/post.php?post=${staging_post_id}&action=edit`,
      source_post_unchanged: true, wordpress_mutation: false,
    };
  }

  const updateResponse = await fetch(`${baseUrl}/wp-json/wp/v2/posts/${staging_post_id}`, {
    method: 'PUT',
    headers: getWordPressWriteHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ content: stagedContent }),
  });
  if (!updateResponse.ok) {
    throw new RevisionError('WP_STAGING_IMAGE_UPDATE_FAILED', `Draft update failed (${updateResponse.status})`);
  }
  const verifyResponse = await fetch(`${baseUrl}/wp-json/wp/v2/posts/${staging_post_id}?context=edit`, {
    headers: getWordPressWriteHeaders(),
  });
  const verified = verifyResponse.ok ? await verifyResponse.json() as EditablePost : null;
  const sourcePostAfter = await getPost(String(revision.wordpress_id), { noCache: true });
  const sourceUnchanged = !!sourcePostAfter
    && sourcePostAfter.modified === sourcePostBefore.modified
    && sourcePostAfter.status === sourcePostBefore.status
    && sourcePostAfter.slug === sourcePostBefore.slug;
  if (!verified || !draftMatchesImageRevision(verified, revision, plans) || !sourceUnchanged) {
    const restoreResponse = await fetch(`${baseUrl}/wp-json/wp/v2/posts/${staging_post_id}`, {
      method: 'PUT',
      headers: getWordPressWriteHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ content: rawOrRendered(draft.content) }),
    });
    throw new RevisionError(
      restoreResponse.ok ? 'STAGING_IMAGE_REFRESH_VERIFICATION_FAILED' : 'STAGING_IMAGE_REFRESH_RESTORE_FAILED',
      `Image slot refresh verification failed; previous draft content restore ${restoreResponse.ok ? 'succeeded' : 'failed'}`
    );
  }
  await logAction({
    timestamp: new Date().toISOString(), action: 'STAGING_IMAGE_SLOTS_REFRESHED',
    wordpress_id: revision.wordpress_id, content_id: revision.content_id,
    revision_id, source, status: 'success', message: `staging_post_id=${staging_post_id}, slots=${plans.length}`,
  });
  return {
    success: true, revision_id, wordpress_id: revision.wordpress_id,
    staging_post_id, staging_status: 'draft', reused: false,
    image_slots: plans.map((plan) => plan.slot),
    edit_url: `${baseUrl}/wp-admin/post.php?post=${staging_post_id}&action=edit`,
    source_post_unchanged: true, wordpress_mutation: true,
  };
}

export async function stageRevisionBatch(payload: {
  revision_ids: string[];
  confirm: boolean;
  staging_apply_confirm?: boolean;
  source?: string;
}) {
  if (!Array.isArray(payload.revision_ids) || payload.revision_ids.length < 1 || payload.revision_ids.length > 50) {
    throw new RevisionError('INVALID_INPUT', 'revision_ids must contain 1 to 50 items');
  }
  if (new Set(payload.revision_ids).size !== payload.revision_ids.length) {
    throw new RevisionError('INVALID_INPUT', 'Duplicate revision ids are not allowed');
  }

  const results = [];
  for (const revision_id of payload.revision_ids) {
    try {
      results.push(await stageRevision({ ...payload, revision_id }));
    } catch (error) {
      results.push({
        success: false,
        revision_id,
        error_code: error instanceof RevisionError ? error.code : 'STAGING_UNKNOWN_ERROR',
        error_message: error instanceof Error ? error.message : String(error),
        wordpress_mutation: false,
      });
    }
  }
  return {
    attempted: payload.revision_ids.length,
    staged: results.filter((item) => item.success).length,
    failed: results.filter((item) => !item.success).length,
    stopped_on_error: false,
    results,
  };
}
