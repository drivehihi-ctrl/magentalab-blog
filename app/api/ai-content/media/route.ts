import { NextResponse } from 'next/server';
import { logAction } from '@/lib/ai-revisions';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { getWordPressWriteConfig, getWordPressWriteHeaders } from '@/lib/wp-write-auth';
import sharp from 'sharp';

export async function GET(req: Request) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const per_page = searchParams.get('per_page') || '20';

  try {
    const baseUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || '').replace(/\/$/, '');
    if (!baseUrl) throw new Error('NEXT_PUBLIC_WORDPRESS_URL is not configured');
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/media?page=${page}&per_page=${per_page}`);
    if (!res.ok) throw new Error('Failed to fetch media');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const alt_text = (formData.get('alt_text') as string) || '';
    const title = (formData.get('title') as string) || '';
    const caption = (formData.get('caption') as string) || '';
    const description = (formData.get('description') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'File is required' }, { status: 400 });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'INVALID_MIME_TYPE', message: 'Only JPEG, PNG, WEBP allowed' }, { status: 400 });
    }

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'IMAGE_TOO_LARGE', message: 'Max size is 10MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();

    if (!metadata.width || !metadata.height) {
      return NextResponse.json({ error: 'INVALID_IMAGE', message: 'Cannot read image dimensions' }, { status: 400 });
    }

    if (metadata.width < 400 || metadata.height < 300) {
      return NextResponse.json({ error: 'IMAGE_TOO_SMALL', message: 'Min dimensions 400x300' }, { status: 400 });
    }

    let s = sharp(buffer).rotate();
    if (metadata.width > 1600) {
      s = s.resize(1600, null, { withoutEnlargement: true });
    }
    s = s.webp({ quality: 80 });

    const optimizedBuffer = await s.toBuffer();
    const finalType = 'image/webp';
    const finalExt = 'webp';
    const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const safeName = originalNameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const fileName = `${safeName}-${Date.now()}.${finalExt}`;

    const { baseUrl } = getWordPressWriteConfig();
    const wpRes = await fetch(`${baseUrl}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: getWordPressWriteHeaders({
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': finalType
      }),
      body: optimizedBuffer
    });

    if (!wpRes.ok) {
      const errorText = await wpRes.text();
      await logAction({
        timestamp: new Date().toISOString(),
        action: 'MEDIA_UPLOAD_FAILED',
        wordpress_id: 0,
        content_id: 'media',
        source: 'system',
        status: 'error',
        message: errorText
      });
      return NextResponse.json({ error: 'MEDIA_UPLOAD_FAILED', message: errorText }, { status: wpRes.status });
    }

    const wpMedia = await wpRes.json();
    const mediaId = wpMedia.id;

    const updatePayload: Record<string, string> = {};
    if (alt_text) updatePayload.alt_text = alt_text;
    if (title) updatePayload.title = title;
    if (caption) updatePayload.caption = caption;
    if (description) updatePayload.description = description;

    if (Object.keys(updatePayload).length > 0) {
      await fetch(`${baseUrl}/wp-json/wp/v2/media/${mediaId}`, {
        method: 'POST',
        headers: getWordPressWriteHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updatePayload)
      });
    }

    await logAction({
      timestamp: new Date().toISOString(),
      action: 'MEDIA_UPLOAD',
      wordpress_id: mediaId,
      content_id: 'media',
      source: 'system',
      status: 'success'
    });

    return NextResponse.json({
      media_id: mediaId,
      source_url: wpMedia.source_url,
      mime_type: wpMedia.mime_type,
      alt_text,
      width: wpMedia.media_details?.width,
      height: wpMedia.media_details?.height
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading media:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
