import { NextResponse } from 'next/server';
import { getRevision, saveRevision, getBackupByRevision, logAction } from '@/lib/ai-revisions';
import { evidenceRepository } from '@/lib/repositories';
import { clearPostsCache } from '@/lib/wp';
import { revalidateTag, revalidatePath } from 'next/cache';

function isAuthenticated(req: Request) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.AI_CONTENT_API_SECRET;
  if (!secret || !authHeader || !authHeader.startsWith('Bearer ')) return false;
  return authHeader.split(' ')[1] === secret;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) {
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
    if (revision.status !== 'applied') {
      return NextResponse.json({ error: 'INVALID_STATUS', message: 'Only applied revisions can be rolled back' }, { status: 400 });
    }

    const backup = await getBackupByRevision(id);
    if (!backup) {
      return NextResponse.json({ error: 'BACKUP_NOT_FOUND', message: 'No backup found for this revision' }, { status: 404 });
    }

    // Restore WP via REST API
    const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://magentalab.mycafe24.com";
    const user = process.env.WP_USER;
    const pass = process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
    const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

    const updatePayload: any = {
      title: backup.title,
      content: backup.content,
      excerpt: backup.excerpt,
    };

    if (backup.featured_media !== undefined) {
      updatePayload.featured_media = backup.featured_media;
    }

    const wpRes = await fetch(`${WP_URL}/wp-json/wp/v2/posts/${backup.wordpress_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      body: JSON.stringify(updatePayload)
    });

    if (!wpRes.ok) {
      const errorData = await wpRes.text();
      throw new Error(`WP Rollback Failed: ${errorData}`);
    }

    await evidenceRepository.restore(backup.wordpress_id, backup.evidence || null);

    // Update local status
    revision.status = 'rolled_back';
    await saveRevision(revision);

    await logAction({
      timestamp: new Date().toISOString(),
      action: 'ROLLBACK_REVISION',
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      revision_id: revision.revision_id,
      source: 'system',
      status: 'success'
    });

    // Revalidate Cache
    clearPostsCache();
    try {
      // @ts-ignore
      revalidateTag('posts');
      revalidatePath('/', 'layout');
      revalidatePath('/posts/[id]', 'page');
      revalidatePath('/en/posts/[id]', 'page');
      revalidatePath('/ja/posts/[id]', 'page');
    } catch (e) {
      console.warn("Revalidate tags error", e);
    }

    return NextResponse.json({ success: true, message: 'Rollback completed successfully' });

  } catch (error: any) {
    console.error("Error rolling back revision:", error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
