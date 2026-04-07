export const WP_API_URL = "http://magentalab.mycafe24.com/wp-json/wp/v2";

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  categories: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        width: number;
        height: number;
      };
    }>;
    "wp:term"?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
      }>
    >;
  };
}

export async function getPosts(): Promise<WPPost[]> {
  const res = await fetch(`${WP_API_URL}/posts?_embed`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export async function getPost(id: string): Promise<WPPost> {
  const res = await fetch(`${WP_API_URL}/posts/${id}?_embed`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch post with id: ${id}`);
  }

  return res.json();
}

export function getFeaturedImage(post: WPPost) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  return media ? media.source_url : "/placeholder-image.jpg";
}

export function getCategories(post: WPPost) {
  const terms = post._embedded?.["wp:term"]?.[0];
  return terms || [];
}
