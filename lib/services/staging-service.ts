import 'server-only';

import { getRevision, logAction } from '@/lib/ai-revisions';
import { applyOneRevision } from '@/lib/apply-revision';
import { getPost } from '@/lib/wp';
import { getWordPressWriteConfig, getWordPressWriteHeaders } from '@/lib/wp-write-auth';
import { RevisionError } from '@/lib/services/revision-service';
import { compareCanonicalContent, compareNormalized } from '@/lib/services/verification-helpers';
import { stagingSlug } from '@/lib/services/staging-guards';

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
