import { NextResponse } from 'next/server';
import { logAction } from '@/lib/ai-revisions';
import sharp from 'sharp';

function isAuthenticated(req: Request) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.AI_CONTENT_API_SECRET;
  if (!secret || !authHeader || !authHeader.startsWith('Bearer ')) return false;
  return authHeader.split(' ')[1] === secret;
}

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const per_page = searchParams.get('per_page') || '20';

  try {
    const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://magentalab.mycafe24.com";
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/media?page=${page}&per_page=${per_page}`);
    if (!res.ok) throw new Error("Failed to fetch media");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const alt_text = formData.get('alt_text') as string || '';
    const title = formData.get('title') as string || '';
    const caption = formData.get('caption') as string || '';
    const description = formData.get('description') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'File is required' }, { status: 400 });
    }

    // MIME Type verification
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'INVALID_MIME_TYPE', message: 'Only JPEG, PNG, WEBP allowed' }, { status: 400 });
    }

    // Size Limit: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'IMAGE_TOO_LARGE', message: 'Max size is 10MB' }, { status: 400 });
    }

    // Optimize with Sharp
    const buffer = Buffer.from(await file.arrayBuffer());
    let optimizedBuffer = buffer;
    const metadata = await sharp(buffer).metadata();

    if (!metadata.width || !metadata.height) {
      return NextResponse.json({ error: 'INVALID_IMAGE', message: 'Cannot read image dimensions' }, { status: 400 });
    }

    if (metadata.width < 400 || metadata.height < 300) {
      return NextResponse.json({ error: 'IMAGE_TOO_SMALL', message: 'Min dimensions 400x300' }, { status: 400 });
    }

    let finalType = file.type;
    let finalExt = file.name.split('.').pop() || 'webp';

    // Optimize (preserve format, but resize if > 1600px, remove EXIF)
    let s = sharp(buffer).rotate(); // auto-orient and strip EXIF
    if (metadata.width > 1600) {
      s = s.resize(1600, null, { withoutEnlargement: true });
    }
    
    // Always output as webp if it's not explicitly requested otherwise, but let's just keep original format for safety, or convert to webp as recommended. User said "WebP 우선" but "기존 포맷 유지" if conflicts. We will just convert to WebP to follow "WebP 우선".
    s = s.webp({ quality: 80 });
    finalType = 'image/webp';
    finalExt = 'webp';
    
    optimizedBuffer = await s.toBuffer();

    const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const safeName = originalNameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const fileName = `${safeName}-${Date.now()}.${finalExt}`;

    // Upload to WordPress
    const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://magentalab.mycafe24.com";
    const user = process.env.WP_USER;
    const pass = process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
    const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

    const wpRes = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': finalType
      },
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

    // Update metadata (alt_text, title, caption)
    const updatePayload: any = {};
    if (alt_text) updatePayload.alt_text = alt_text;
    if (title) updatePayload.title = title;
    if (caption) updatePayload.caption = caption;
    if (description) updatePayload.description = description;

    if (Object.keys(updatePayload).length > 0) {
      await fetch(`${WP_URL}/wp-json/wp/v2/media/${mediaId}`, {
        method: 'POST',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json'
        },
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
      alt_text: alt_text,
      width: wpMedia.media_details?.width,
      height: wpMedia.media_details?.height
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error uploading media:", error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
