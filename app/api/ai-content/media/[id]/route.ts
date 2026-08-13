import { NextResponse } from 'next/server';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const baseUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || '').replace(/\/$/, '');
    if (!baseUrl) throw new Error('NEXT_PUBLIC_WORDPRESS_URL is not configured');
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/media/${id}`);

    if (!res.ok) {
      if (res.status === 404) return NextResponse.json({ error: 'NOT_FOUND', message: 'Media not found' }, { status: 404 });
      throw new Error('Failed to fetch media');
    }

    const wpMedia = await res.json();
    return NextResponse.json({
      media_id: wpMedia.id,
      source_url: wpMedia.source_url,
      mime_type: wpMedia.mime_type,
      width: wpMedia.media_details?.width,
      height: wpMedia.media_details?.height,
      alt_text: wpMedia.alt_text,
      caption: wpMedia.caption?.raw || wpMedia.caption?.rendered,
      description: wpMedia.description?.raw || wpMedia.description?.rendered,
      parent: wpMedia.post,
      date: wpMedia.date,
      modified: wpMedia.modified
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
