import { NextResponse } from 'next/server';
import { getRevision, saveRevision, saveBackup, logAction } from '@/lib/ai-revisions';
import { getPost } from '@/lib/wp';
import { evidenceRepository } from '@/lib/repositories';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { getWordPressWriteConfig, getWordPressWriteHeaders } from '@/lib/wp-write-auth';
import crypto from 'crypto';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.confirm !== true) {
    return NextResponse.json({ error: 'REQUIRE_CONFIRM', message: 'confirm: true is required' }, { status: 400 });
  }

  try {
    const revision = await getRevision(id);
    if (!revision) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Revision not found' }, { status: 404 });
    }
    if (revision.status !== 'pending_review' && revision.status !== 'approved') {
      return NextResponse.json({ error: 'INVALID_STATUS', message: 'Revision is already applied or rejected' }, { status: 400 });
    }

    const isMedicalTopic = revision.slug.match(/diabetes|urinary|cystitis|patella|joint|poison|emergency|onion|garlic|chocolate|skin|dermatology|atopic|allergy/i) || revision.new_content.match(/당뇨|인슐린|방광|신장|비뇨|슬개골|관절|탈구|골절|독성|응급|양파|초콜릿|피부|아토피|농피증/i);
    if (isMedicalTopic && (!revision.evidence || revision.evidence.references.length === 0)) {
      return NextResponse.json({ error: 'MEDICAL_EVIDENCE_MISSING', message: 'Medical topics require at least 1 evidence reference.' }, { status: 400 });
    }

    if (!revision.new_content.includes("Ansim-i's Research Summary") && !revision.new_content.includes('Research Summary')) {
      return NextResponse.json({ error: 'CONTENT_TRUNCATION_DETECTED', message: 'Missing Research Summary' }, { status: 400 });
    }

    if (revision.new_content.includes('[근거]') || revision.new_content.includes('<h2>🔬 Veterinary Evidence')) {
      return NextResponse.json({ error: 'EVIDENCE_DUPLICATED_IN_BODY', message: 'Evidence should not be present in the HTML body directly.' }, { status: 400 });
    }

    const currentPost = await getPost(revision.wordpress_id.toString());
    if (!currentPost) {
      return NextResponse.json({ error: 'POST_NOT_FOUND', message: 'Original post not found on WP' }, { status: 404 });
    }

    if (currentPost.modified !== revision.source_modified_at) {
      await logAction({
        timestamp: new Date().toISOString(),
        action: 'CONFLICT_DETECTED',
        wordpress_id: revision.wordpress_id,
        content_id: revision.content_id,
        revision_id: revision.revision_id,
        source: 'system',
        status: 'error',
        message: 'WP modified_at has changed since revision creation.'
      });
      return NextResponse.json({ error: 'POST_CHANGED_SINCE_READ', message: 'Post was modified. Recreate revision.' }, { status: 409 });
    }

    const { baseUrl } = getWordPressWriteConfig();
    const wpHeaders = getWordPressWriteHeaders();

    let rawTitle = currentPost.title.rendered;
    let rawContent = currentPost.content.rendered;
    let rawExcerpt = currentPost.excerpt.rendered;

    try {
      const editRes = await fetch(`${baseUrl}/wp-json/wp/v2/posts/${currentPost.id}?context=edit`, {
        headers: wpHeaders
      });
      if (editRes.ok) {
        const editPost = await editRes.json();
        if (editPost.title?.raw) rawTitle = editPost.title.raw;
        if (editPost.content?.raw) rawContent = editPost.content.raw;
        if (editPost.excerpt?.raw) rawExcerpt = editPost.excerpt.raw;
      }
    } catch (e) {
      console.warn('Could not fetch raw post content for backup, falling back to rendered:', e);
    }

    const backup_id = `bak_${crypto.randomBytes(8).toString('hex')}`;
    const previousEvidence = await evidenceRepository.getByPostId(currentPost.id);

    await saveBackup({
      backup_id,
      revision_id: revision.revision_id,
      wordpress_id: currentPost.id,
      title: rawTitle,
      content: rawContent,
      excerpt: rawExcerpt,
      meta_description: '',
      slug: currentPost.slug,
      featured_media: currentPost.featured_media,
      evidence: previousEvidence || undefined,
      modified_at: currentPost.modified,
      created_at: new Date().toISOString()
    });

    let evidenceSaved = false;
    if (revision.evidence) {
      try {
        await evidenceRepository.save(currentPost.id, revision.evidence);
        evidenceSaved = true;
      } catch {
        await logAction({
          timestamp: new Date().toISOString(),
          action: 'EVIDENCE_EXTERNAL_SAVE_FAILED',
          wordpress_id: revision.wordpress_id,
          content_id: revision.content_id,
          revision_id: revision.revision_id,
          source: 'system',
          status: 'error',
          message: 'Failed to save evidence to repository.'
        });
        return NextResponse.json({ error: 'EVIDENCE_DATA_NOT_PERSISTED', message: 'Failed to persist evidence.' }, { status: 500 });
      }
    }

    if (evidenceSaved) {
      await logAction({
        timestamp: new Date().toISOString(),
        action: 'EVIDENCE_EXTERNAL_SAVE_SUCCESS',
        wordpress_id: revision.wordpress_id,
        content_id: revision.content_id,
        revision_id: revision.revision_id,
        source: 'system',
        status: 'success'
      });
    }

    const updatePayload: Record<string, unknown> = {
      title: revision.new_title,
      content: revision.new_content,
      excerpt: revision.new_excerpt
    };

    if (revision.media_changes?.new_featured_media_id) {
      updatePayload.featured_media = revision.media_changes.new_featured_media_id;
    }

    try {
      const wpRes = await fetch(`${baseUrl}/wp-json/wp/v2/posts/${revision.wordpress_id}`, {
        method: 'POST',
        headers: getWordPressWriteHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updatePayload)
      });

      if (!wpRes.ok) {
        const errorData = await wpRes.text();
        throw new Error(`WP Update Failed: ${errorData}`);
      }
    } catch (wpError) {
      if (evidenceSaved) {
        await evidenceRepository.restore(currentPost.id, previousEvidence);
        await logAction({
          timestamp: new Date().toISOString(),
          action: 'EVIDENCE_EXTERNAL_ROLLBACK',
          wordpress_id: revision.wordpress_id,
          content_id: revision.content_id,
          revision_id: revision.revision_id,
          source: 'system',
          status: 'error',
          message: 'Evidence rolled back due to WP content update failure.'
        });
      }
      throw wpError;
    }

    await logAction({
      timestamp: new Date().toISOString(),
      action: 'CONTENT_EVIDENCE_SEPARATION_VERIFIED',
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      revision_id: revision.revision_id,
      source: 'system',
      status: 'success'
    });

    revision.status = 'applied';
    await saveRevision(revision);

    await logAction({
      timestamp: new Date().toISOString(),
      action: 'APPLY_REVISION',
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      revision_id: revision.revision_id,
      source: 'system',
      status: 'success'
    });

    return NextResponse.json({ success: true, revision_id: revision.revision_id, backup_id });
  } catch (error: any) {
    console.error('Error applying revision:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
