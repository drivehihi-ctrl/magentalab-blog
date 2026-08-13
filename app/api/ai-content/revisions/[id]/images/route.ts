import { NextResponse } from 'next/server';
import { getRevision, saveRevision, logAction } from '@/lib/ai-revisions';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';

function buildGutenbergImage(mediaId: number, src: string, alt: string, caption?: string) {
  let imgHtml = `<figure class="wp-block-image size-large">\n<img src="${src}" alt="${alt.replace(/"/g, '&quot;')}" class="wp-image-${mediaId}" />`;

  if (caption) {
    imgHtml += `\n<figcaption class="wp-element-caption">${caption.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</figcaption>`;
  }
  imgHtml += `\n</figure>`;

  return `\n<!-- wp:image {"id":${mediaId},"sizeSlug":"large"} -->\n${imgHtml}\n<!-- /wp:image -->\n`;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const revision = await getRevision(id);
    if (!revision) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Revision not found' }, { status: 404 });
    }
    if (revision.status !== 'pending_review') {
      return NextResponse.json({ error: 'INVALID_STATUS', message: 'Revision is not pending_review' }, { status: 400 });
    }

    const body = await req.json();
    const { media_id, src, alt, caption, position } = body;

    if (!revision.media_changes) {
      revision.media_changes = { images_added: [], new_featured_media_id: null };
    }

    if (position?.type === 'featured_image') {
      revision.media_changes.new_featured_media_id = media_id;
      await saveRevision(revision);

      await logAction({
        timestamp: new Date().toISOString(),
        action: 'SET_FEATURED_IMAGE_REVISION',
        wordpress_id: revision.wordpress_id,
        content_id: revision.content_id,
        revision_id: revision.revision_id,
        source: 'system',
        status: 'success'
      });
      return NextResponse.json({ success: true, message: 'Featured image updated in revision' });
    }

    if (!src || !alt) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'src and alt are required for body image' }, { status: 400 });
    }

    const imageBlock = buildGutenbergImage(media_id, src, alt, caption);
    let content = revision.new_content;

    if (position?.type === 'after_heading' && position.heading_text) {
      const level = position.heading_level || 2;
      const occurrence = position.occurrence || 1;
      const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const headingRegex = new RegExp(`(<h${level}[^>]*>\\s*${escapeRegExp(position.heading_text)}\\s*</h${level}>)`, 'gi');

      let matchCount = 0;
      let inserted = false;
      content = content.replace(headingRegex, (match) => {
        matchCount++;
        if (matchCount === occurrence) {
          inserted = true;
          return match + '\n' + imageBlock;
        }
        return match;
      });

      if (!inserted) {
        return NextResponse.json({ error: 'HEADING_NOT_FOUND', message: 'Could not find matching heading to insert after' }, { status: 400 });
      }
    } else {
      content += '\n' + imageBlock;
    }

    revision.new_content = content;
    revision.media_changes.images_added.push({
      media_id,
      src,
      alt,
      position: position?.type || 'end_of_content'
    });

    await saveRevision(revision);

    await logAction({
      timestamp: new Date().toISOString(),
      action: 'ADD_IMAGE_TO_REVISION',
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      revision_id: revision.revision_id,
      source: 'system',
      status: 'success'
    });

    return NextResponse.json({ success: true, message: 'Image added to revision content' });
  } catch (error: any) {
    console.error('Error adding image to revision:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
