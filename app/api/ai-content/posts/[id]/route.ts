import { NextResponse } from 'next/server';
import { getPost, getFeaturedImage, getCategories, getTags } from '@/lib/wp';
import { sanitizeForSeo } from '@/lib/utils';

function isAuthenticated(req: Request) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.AI_CONTENT_API_SECRET;
  
  if (!secret) return false;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  
  const token = authHeader.split(' ')[1];
  return token === secret;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid or missing API secret' }, { status: 401 });
  }

  const { id } = await params;
  
  try {
    const post = await getPost(id);
    if (!post) {
      return NextResponse.json({ error: 'POST_NOT_FOUND', message: 'Post not found' }, { status: 404 });
    }

    const slug = post.slug || "";
    const lang = slug.endsWith('-en') ? 'en' : slug.endsWith('-ja') ? 'ja' : 'ko';
    
    // Base SEO extraction logic identical to frontend
    const title = sanitizeForSeo(post.title?.rendered || "");
    const meta_description = sanitizeForSeo(post.excerpt?.rendered || "", 160);
    
    // Construct exact post URL as done in frontend
    const postUrl = lang === 'en' 
      ? `https://www.magentalabblog.com/en/posts/${slug}` 
      : lang === 'ja' 
      ? `https://www.magentalabblog.com/ja/posts/${slug}` 
      : `https://www.magentalabblog.com/posts/${slug}`;

    const images: any[] = [];
    const contentHtml = post.content?.rendered || "";
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(contentHtml)) !== null) {
      const imgTag = match[0];
      const src = match[1];
      const altMatch = imgTag.match(/alt="([^"]*)"/i);
      const alt = altMatch ? altMatch[1] : "";
      const classMatch = imgTag.match(/class="[^"]*wp-image-(\d+)[^"]*"/i);
      const media_id = classMatch ? parseInt(classMatch[1], 10) : null;
      
      images.push({ src, alt, media_id });
    }

    return NextResponse.json({
      wordpress_id: post.id,
      content_id: post.id.toString(),
      language: lang,
      slug: slug,
      title: title,
      content_raw: contentHtml,
      content_rendered: contentHtml,
      excerpt: post.excerpt?.rendered || "",
      meta_description,
      categories: getCategories(post).map((c: any) => c.name),
      tags: getTags(post).map((t: any) => t.name),
      status: "publish",
      url: postUrl,
      featured_image: {
        id: post.featured_media,
        url: getFeaturedImage(post),
        alt: title
      },
      images: images, 
      published_at: post.date,
      modified_at: post.modified
    });

  } catch (error: any) {
    console.error("Error in AI Content Post Detail API:", error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
