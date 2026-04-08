export const WP_API_URL = `${process.env.WORDPRESS_URL}/wp-json/wp/v2`;

export interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  categories: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

export async function getPosts(): Promise<WPPost[]> {
  const res = await fetch(`${WP_API_URL}/posts?_embed&per_page=100`, {
    next: {
      revalidate: 3600,
      tags: ['posts'] // 실시간 업데이트를 위한 태그
    },
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(id: string): Promise<WPPost> {
  const res = await fetch(`${WP_API_URL}/posts/${id}?_embed`, {
    next: {
      revalidate: 3600,
      tags: [`post-${id}`, 'posts']
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch post: ${id}`);
  return res.json();
}

export function getFeaturedImage(post: WPPost) {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/placeholder-image.jpg";
}

export function getCategories(post: WPPost) {
  return post._embedded?.["wp:term"]?.[0] || [];
}

export function getTags(post: WPPost) {
  return post._embedded?.["wp:term"]?.[1] || [];
}

export function getRelatedPosts(currentPost: WPPost, allPosts: WPPost[], limit: number = 3) {
  // Get category IDs of the current post
  const currentCategoryIds = new Set(getCategories(currentPost).map(c => c.id));
  const currentTagIds = new Set(getTags(currentPost).map(t => t.id));

  return allPosts
    .filter(p => p.id !== currentPost.id) // Exclude current post
    .map(p => {
      // Calculate relevance score
      let score = 0;
      const postCategories = getCategories(p);
      const postTags = getTags(p);

      // Category match (High weight)
      postCategories.forEach(c => {
        if (currentCategoryIds.has(c.id)) score += 10;
      });

      // Tag match (Medium weight)
      postTags.forEach(t => {
        if (currentTagIds.has(t.id)) score += 5;
      });

      return { post: p, score };
    })
    .filter(p => p.score > 0) // Only include posts with some relevance
    .sort((a, b) => b.score - a.score || Number(b.post.date) - Number(a.post.date))
    .slice(0, limit)
    .map(p => p.post);
}

export interface WPComment {
  id: number;
  post: number;
  parent: number;
  author_name: string;
  author_url: string;
  date: string;
  content: { rendered: string };
  author_avatar_urls?: {
    [key: string]: string;
  };
}

export async function getComments(postId: number): Promise<WPComment[]> {
  const res = await fetch(`${WP_API_URL}/comments?post=${postId}&order=asc`, {
    next: {
      revalidate: 3600,
      tags: [`comments-${postId}`]
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch comments for post: ${postId}`);
  return res.json();
}

/**
 * 워드프레스 목차 플러그인 등이 생성한 절대 경로 링크를 내부 앵커 링크로 변환합니다.
 * 예: https://magentalab.mycafe24.com/post-slug/#anchor -> #anchor
 */
export function fixWpLinks(content: string) {
  if (!content) return "";
  
  // 워드프레스 주소와 슬러그가 포함된 앵커 링크를 찾아 #anchor 부분만 남깁니다.
  const wpUrlPattern = /href="https?:\/\/magentalab\.mycafe24\.com\/[^"]+\/#([^"]+)"/g;
  return content.replace(wpUrlPattern, 'href="#$1"');
}

export async function getPageBySlug(slug: string): Promise<WPPost | null> {
  const res = await fetch(`${WP_API_URL}/pages?slug=${slug}`, {
    next: {
      revalidate: 3600,
      tags: [`page-${slug}`]
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch page: ${slug}`);
  const pages = await res.json();
  return pages[0] || null;
}
