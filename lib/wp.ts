export const WP_API_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL}/wp-json/wp/v2`;

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

export interface PostsResponse {
  posts: WPPost[];
  totalPages: number;
  totalPosts: number;
}

export async function getPosts(page: number = 1, perPage: number = 20, search?: string): Promise<PostsResponse> {
  let url = `${WP_API_URL}/posts?_embed&per_page=${perPage}&page=${page}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  const res = await fetch(url, {
    next: {
      revalidate: 3600,
      tags: ['posts'] // 실시간 업데이트를 위한 태그
    },
  });
  
  if (!res.ok) throw new Error("Failed to fetch posts");
  
  const posts = await res.json();
  const totalPosts = Number(res.headers.get('X-WP-Total') || posts.length);
  const totalPages = Number(res.headers.get('X-WP-TotalPages') || 1);

  return { 
    posts, 
    totalPages, 
    totalPosts 
  };
}

/**
 * 사이트맵 전용: 전체 글을 페이지네이션으로 모두 가져옵니다.
 * WordPress REST API의 X-WP-TotalPages 헤더를 활용합니다.
 * revalidate: 0 → Vercel 배포 시 항상 최신 데이터로 사이트맵 생성.
 */
export async function getAllPostsForSitemap(): Promise<WPPost[]> {
  const perPage = 100;
  // 1페이지를 먼저 가져와 전체 페이지 수 확인
  const firstRes = await fetch(
    `${WP_API_URL}/posts?_fields=id,date,modified&per_page=${perPage}&page=1`,
    { next: { revalidate: 0 } } // 사이트맵은 항상 최신 데이터
  );
  if (!firstRes.ok) throw new Error("Failed to fetch posts for sitemap");

  const totalPages = Number(firstRes.headers.get('X-WP-TotalPages') || 1);
  const firstPagePosts: WPPost[] = await firstRes.json();

  if (totalPages <= 1) return firstPagePosts;

  // 2페이지 이상이 있으면 병렬로 나머지 모두 가져오기
  const remainingFetches = Array.from({ length: totalPages - 1 }, (_, i) =>
    fetch(
      `${WP_API_URL}/posts?_fields=id,date,modified&per_page=${perPage}&page=${i + 2}`,
      { next: { revalidate: 0 } }
    ).then(res => res.ok ? res.json() as Promise<WPPost[]> : [])
  );

  const remainingPages = await Promise.all(remainingFetches);
  return [firstPagePosts, ...remainingPages].flat();
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
  const url = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  return url ? encodeURI(decodeURI(url)) : "/placeholder-image.jpg";
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
 *
 * 동시에 alt 속성이 없거나 비어있는 <img> 태그를 탐지하여
 * title 속성 → 파일명 → fallback 순으로 의미 있는 alt를 자동 삽입합니다.
 * (네이버/구글 서치어드바이저의 "Alt 속성 누락" SEO 오류 해결)
 */
export function fixWpLinks(content: string, postTitle?: string) {
  if (!content) return "";
  
  // 1. 워드프레스 앵커 링크 변환
  const wpUrlPattern = /href="https?:\/\/magentalab\.mycafe24\.com\/[^"]+\/#([^"]+)"/g;
  let fixed = content.replace(wpUrlPattern, 'href="#$1"');

  // 2. alt 속성이 없거나 빈 <img> 태그에 자동으로 alt 삽입
  fixed = fixed.replace(/<img(\s[^>]*?)?\/?>|<img(\s[^>]*?)?>/gi, (imgTag) => {
    // 이미 alt="..."가 있고 비어있지 않으면 그대로 유지
    const altMatch = imgTag.match(/alt="([^"]*)"/i);
    if (altMatch && altMatch[1].trim() !== '') {
      return imgTag;
    }

    // alt 값 결정 우선순위: title 속성 > src 파일명 > 포스트 제목 > 기본값
    let altText = '';

    // title 속성 확인
    const titleMatch = imgTag.match(/title="([^"]+)"/i);
    if (titleMatch && titleMatch[1].trim()) {
      altText = titleMatch[1].trim();
    }

    // src에서 파일명 추출
    if (!altText) {
      const srcMatch = imgTag.match(/src="([^"]+)"/i);
      if (srcMatch) {
        const filename = srcMatch[1].split('/').pop()?.split('?')[0] || '';
        const nameWithoutExt = filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        // 숫자만 있거나 너무 짧으면 스킵
        if (nameWithoutExt && !/^\d+$/.test(nameWithoutExt) && nameWithoutExt.length > 3) {
          altText = nameWithoutExt;
        }
      }
    }

    // 포스트 제목 사용
    if (!altText && postTitle) {
      altText = postTitle.replace(/<[^>]*>/g, '').trim();
    }

    // 최후 fallback
    if (!altText) {
      altText = '마젠타랩 반려동물 연구소 이미지';
    }

    // alt 속성이 없으면 추가, 비어있으면 교체
    if (!altMatch) {
      // alt 자체가 없음 → 추가
      return imgTag.replace(/(<img)(\s|\/>|>)/i, `$1 alt="${altText}"$2`);
    } else {
      // alt="" 비어있음 → 채우기
      return imgTag.replace(/alt=""/i, `alt="${altText}"`);
    }
  });

  // 3. 테이블 태그 래핑 및 모바일 스크롤 안내 문구 추가
  fixed = fixed.replace(/<table([\s\S]*?)>([\s\S]*?)<\/table>/gi, (match, tableAttrs, tableContent) => {
    return `<div class="wp-table-wrapper"><table${tableAttrs}>${tableContent}</table></div>` +
      `<div class="wp-table-notice">` +
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E5007E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">` +
          `<path d="M5 12h14M12 5l7 7-7 7"/>` +
        `</svg>` +
        `<span>💡 표를 오른쪽으로 드래그(스크롤)하면 더 많은 정보가 있답니다!</span>` +
      `</div>`;
  });

  return fixed;
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

export async function searchPosts(query: string): Promise<WPPost[]> {
  if (!query) return [];
  const res = await fetch(`${WP_API_URL}/posts?_embed&search=${encodeURIComponent(query)}&per_page=10`, {
    next: {
      revalidate: 3600,
      tags: ['posts-search']
    },
  });
  if (!res.ok) throw new Error(`Failed to search posts for query: ${query}`);
  return res.json();
}
