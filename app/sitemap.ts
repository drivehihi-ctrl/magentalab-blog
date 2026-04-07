import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/wp';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://magentalab-blog.vercel.app';

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.date),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    ...postUrls,
  ];
}
