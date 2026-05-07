import { MetadataRoute } from 'next';
import { getAllPostsForSitemap } from '@/lib/wp';
import { supabase } from '@/lib/supabase';

// 사이트맵은 매 요청시마다 최신 데이터로 동적 생성
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.magentalabblog.com';

  // Fetch all posts
  let posts: any[] = [];
  try {
    posts = await getAllPostsForSitemap();
  } catch (error) {
    console.error('Failed to fetch posts for sitemap:', error);
  }

  // Fetch all products
  let products: any[] = [];
  try {
    const { data } = await supabase.from('products').select('id, created_at').order('created_at', { ascending: false });
    if (data) products = data;
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.modified || post.date),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/shop/${product.id}`,
    lastModified: new Date(product.created_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...postEntries,
  ];
}

