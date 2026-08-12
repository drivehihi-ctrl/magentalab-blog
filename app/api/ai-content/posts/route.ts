import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/wp';

function isAuthenticated(req: Request) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.AI_CONTENT_API_SECRET;
  
  if (!secret) return false;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  
  const token = authHeader.split(' ')[1];
  return token === secret;
}

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid or missing API secret' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || '50', 10);
  const language = searchParams.get('language') || 'ko';
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const tag = searchParams.get('tag') || undefined;

  try {
    const { posts, totalPages, totalPosts } = await getPosts(page, perPage, search, category, language, tag);

    const formattedPosts = posts.map(post => {
      const slug = post.slug || "";
      const lang = slug.endsWith('-en') ? 'en' : slug.endsWith('-ja') ? 'ja' : 'ko';
      
      return {
        wordpress_id: post.id,
        content_id: post.id.toString(),
        language: lang,
        slug: post.slug,
        title: post.title?.rendered || "",
        status: "publish",
        categories: post.categories || [],
        published_at: post.date,
        modified_at: post.modified,
        featured_media_id: post.featured_media
      };
    });

    return NextResponse.json({
      total: totalPosts,
      page,
      per_page: perPage,
      posts: formattedPosts
    });
  } catch (error: any) {
    console.error("Error in AI Content Posts API:", error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
