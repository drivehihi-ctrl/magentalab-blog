import 'server-only';
import crypto from 'crypto';
import * as cheerio from 'cheerio';
import { getRevision, saveRevision, saveBackup, logAction } from '@/lib/ai-revisions';
import { getPost } from '@/lib/wp';
import { evidenceRepository } from '@/lib/repositories';
import { getWordPressWriteConfig, getWordPressWriteHeaders } from '@/lib/wp-write-auth';
import { assessMedicalRisk } from '@/lib/medical-risk';

// ─── Result types ──────────────────────────────────────────────────────────

export type ApplySuccessResult = {
  success: true;
  revision_id: string;
  backup_id: string;
};

export type ApplyFailureResult = {
  success: false;
  revision_id: string;
  error_code: string;
  error_message: string;
};

export type ApplyResult = ApplySuccessResult | ApplyFailureResult;

export interface ApplyOptions {
  /** source identifier written to audit logs ('single' | 'batch' | string) */
  source?: string;
  /** dry-run: run all validations but skip WP write and DB mutations */
  dryRun?: boolean;
}

// ─── Internal helper ──────────────────────────────────────────────────────

function fail(revision_id: string, error_code: string, error_message: string): ApplyFailureResult {
  return { success: false, revision_id, error_code, error_message };
}

// ─── Core Apply engine ────────────────────────────────────────────────────

/**
 * Apply a single approved revision to WordPress.
 * All safety checks are enforced here; callers (single & batch) share this logic.
 *
 * Immutable fields guaranteed:
 *   slug, status, categories, tags, noindex, featured_media
 *   (featured_media only changes if revision.media_changes.new_featured_media_id is set)
 *
 * Forbidden: auto publish, auto cache revalidation, DELETE, status change
 */
export async function applyOneRevision(
  revisionId: string,
  options: ApplyOptions = {}
): Promise<ApplyResult> {
  const { source = 'system', dryRun = false } = options;

  // ── 1. Fetch revision ────────────────────────────────────────────────────
  const revision = await getRevision(revisionId);
  if (!revision) {
    return fail(revisionId, 'NOT_FOUND', 'Revision not found');
  }

  // ── 2. Status guard: only 'approved' (human review required) ─────────────
  if (revision.status !== 'approved') {
    return fail(
      revisionId,
      'INVALID_STATUS',
      `Revision must be 'approved'. Current: ${revision.status}`
    );
  }

  // ── 3. Medical risk + evidence + medical review gate ──────────────────────
  const medicalRisk = assessMedicalRisk(
    revision.slug,
    revision.new_title,
    revision.new_content
  );
  if (medicalRisk.isMedical) {
    if (!revision.evidence || revision.evidence.references.length === 0) {
      return fail(
        revisionId,
        'MEDICAL_EVIDENCE_MISSING',
        'Medical topics require at least 1 evidence reference.'
      );
    }
    if (revision.medical_reviewed !== true && revision.medical_approved !== true) {
      return fail(
        revisionId,
        'MEDICAL_REVIEW_REQUIRED',
        'Medical topics require explicit medical review confirmation (medical_reviewed: true).'
      );
    }
  }

  // ── 4. Fetch current WP post ─────────────────────────────────────────────
  const currentPost = await getPost(revision.wordpress_id.toString(), { noCache: true });
  if (!currentPost) {
    return fail(revisionId, 'POST_NOT_FOUND', 'Original post not found on WordPress');
  }

  // ── 5. Content truncation detection ──────────────────────────────────────
  const revContent = revision.new_content;
  if (
    !revContent.includes("Ansim-i's Research Summary") &&
    !revContent.includes('Research Summary')
  ) {
    return fail(revisionId, 'CONTENT_TRUNCATION_DETECTED', 'Missing Research Summary in content');
  }

  // Length check: Abnormally short compared to original
  if (currentPost && currentPost.content && currentPost.content.rendered) {
    const origLength = currentPost.content.rendered.length;
    if (origLength > 1000 && revContent.length < origLength * 0.3) {
      return fail(revisionId, 'CONTENT_TRUNCATION_DETECTED', 'Content length is abnormally short compared to original (< 30%)');
    }
  }

  // HTML Tag balancing check
  const checkTags = ['div', 'table', 'ul', 'ol'];
  for (const tag of checkTags) {
    const openCount = (revContent.match(new RegExp(`<${tag}(\\s|>)`, 'gi')) || []).length;
    const closeCount = (revContent.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (openCount > closeCount) {
      return fail(revisionId, 'CONTENT_TRUNCATION_DETECTED', `Unclosed HTML tag detected: <${tag}> (open: ${openCount}, close: ${closeCount})`);
    }
  }

  // Abrupt tag endings
  const trimmed = revContent.trim();
  if (/<[a-z]+[^>]*$/i.test(trimmed)) {
    return fail(revisionId, 'CONTENT_TRUNCATION_DETECTED', 'Content ends abruptly inside an HTML tag');
  }
  if (/="[^"]*$/i.test(trimmed)) {
    return fail(revisionId, 'CONTENT_TRUNCATION_DETECTED', 'Content ends abruptly inside an HTML attribute');
  }

  // Parse with Cheerio to ensure it parses without throwing
  try {
    const $ = cheerio.load(revContent);
    if (revContent.length > 50 && $('body').text().trim().length === 0 && !revContent.includes('<img')) {
      return fail(revisionId, 'CONTENT_TRUNCATION_DETECTED', 'Cheerio parsed an empty body from the HTML');
    }
  } catch (e) {
    return fail(revisionId, 'CONTENT_TRUNCATION_DETECTED', 'HTML parsing failed with Cheerio');
  }

  // ── 6. Evidence duplication in body ──────────────────────────────────────
  if (
    revision.new_content.includes('[근거]') ||
    revision.new_content.includes('<h2>🔬 Veterinary Evidence')
  ) {
    return fail(
      revisionId,
      'EVIDENCE_DUPLICATED_IN_BODY',
      'Evidence section must not appear directly in the HTML body.'
    );
  }

  // ── 7. Optimistic lock ───────────────────────────────────────────────────
  if (currentPost.modified !== revision.source_modified_at) {
    await logAction({
      timestamp: new Date().toISOString(),
      action: 'CONFLICT_DETECTED',
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      revision_id: revisionId,
      source,
      status: 'error',
      message: 'WP modified_at has changed since revision creation.',
    });
    return fail(
      revisionId,
      'POST_CHANGED_SINCE_READ',
      'Post was modified since revision was created. Recreate revision.'
    );
  }

  // ── 8. dry-run: validations passed, skip mutations ────────────────────────
  if (dryRun) {
    return { success: true, revision_id: revisionId, backup_id: 'dry-run' };
  }

  // ── 9. Fetch raw content for backup ──────────────────────────────────────
  const { baseUrl } = getWordPressWriteConfig();
  const wpHeaders = getWordPressWriteHeaders();

  let rawTitle = currentPost.title.rendered;
  let rawContent = currentPost.content.rendered;
  let rawExcerpt = currentPost.excerpt.rendered;

  try {
    const editRes = await fetch(
      `${baseUrl}/wp-json/wp/v2/posts/${currentPost.id}?context=edit`,
      { headers: wpHeaders }
    );
    if (editRes.ok) {
      const editPost = await editRes.json();
      if (editPost.title?.raw) rawTitle = editPost.title.raw;
      if (editPost.content?.raw) rawContent = editPost.content.raw;
      if (editPost.excerpt?.raw) rawExcerpt = editPost.excerpt.raw;
    }
  } catch (e) {
    console.warn('[applyOneRevision] Could not fetch raw content for backup, using rendered:', e);
  }

  // ── 10. Create backup before any mutation ────────────────────────────────
  const backup_id = `bak_${crypto.randomBytes(8).toString('hex')}`;
  const previousEvidence = await evidenceRepository.getByPostId(currentPost.id);

  await saveBackup({
    backup_id,
    revision_id: revisionId,
    wordpress_id: currentPost.id,
    title: rawTitle,
    content: rawContent,
    excerpt: rawExcerpt,
    meta_description: '',
    ansim_summary: previousEvidence?.ansimSummary || undefined,
    slug: currentPost.slug,
    featured_media: currentPost.featured_media,
    evidence: previousEvidence || undefined,
    modified_at: currentPost.modified,
    created_at: new Date().toISOString(),
  });

  // ── 11. Save evidence (with rollback on WP failure) ───────────────────────
  let evidenceSaved = false;
  if (revision.evidence) {
    try {
      await evidenceRepository.save(currentPost.id, revision.evidence);
      evidenceSaved = true;
      await logAction({
        timestamp: new Date().toISOString(),
        action: 'EVIDENCE_EXTERNAL_SAVE_SUCCESS',
        wordpress_id: revision.wordpress_id,
        content_id: revision.content_id,
        revision_id: revisionId,
        source,
        status: 'success',
      });
    } catch {
      await logAction({
        timestamp: new Date().toISOString(),
        action: 'EVIDENCE_EXTERNAL_SAVE_FAILED',
        wordpress_id: revision.wordpress_id,
        content_id: revision.content_id,
        revision_id: revisionId,
        source,
        status: 'error',
        message: 'Failed to save evidence to repository.',
      });
      return fail(revisionId, 'EVIDENCE_DATA_NOT_PERSISTED', 'Failed to persist evidence.');
    }
  }

  // ── 12. WordPress write — immutable fields excluded ───────────────────────
  // NEVER send: slug, status, categories, tags, meta, noindex, password, featured_media
  // Controlled Content Apply ONLY updates title, content, excerpt.
  // featured_media changes are reserved strictly for explicit Media Apply flows.
  const updatePayload: Record<string, unknown> = {
    title: revision.new_title,
    content: revision.new_content,
    excerpt: revision.new_excerpt,
  };

  try {
    const wpRes = await fetch(`${baseUrl}/wp-json/wp/v2/posts/${revision.wordpress_id}`, {
      method: 'POST',
      headers: getWordPressWriteHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(updatePayload),
    });

    if (!wpRes.ok) {
      const errorData = await wpRes.text();
      throw new Error(`WP Update Failed: ${errorData.slice(0, 200)}`);
    }
  } catch (wpError: any) {
    if (evidenceSaved) {
      await evidenceRepository.restore(currentPost.id, previousEvidence);
      await logAction({
        timestamp: new Date().toISOString(),
        action: 'EVIDENCE_EXTERNAL_ROLLBACK',
        wordpress_id: revision.wordpress_id,
        content_id: revision.content_id,
        revision_id: revisionId,
        source,
        status: 'error',
        message: 'Evidence rolled back due to WP content update failure.',
      });
    }
    return fail(revisionId, 'WP_WRITE_FAILED', wpError.message);
  }

  // ── 13. Mark revision as applying (will be set to applied after post-verification) ─
  revision.status = 'applying';
  await saveRevision(revision);

  // ── 14. Audit log ─────────────────────────────────────────────────────────
  await logAction({
    timestamp: new Date().toISOString(),
    action: 'APPLY_REVISION',
    wordpress_id: revision.wordpress_id,
    content_id: revision.content_id,
    revision_id: revisionId,
    source,
    status: 'success',
    message: `backup_id=${backup_id}`,
  });

  return { success: true, revision_id: revisionId, backup_id };
}
