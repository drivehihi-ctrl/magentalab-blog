import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/wp';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://magentalab-blog.vercel.app';

  // Fetch all posts to generate post-specific sitemap entries
  let posts: any[] = [];
  try {
    posts = await getPosts();
  } catch (error) {
    console.error('Failed to fetch posts for sitemap:', error);
  }

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.modified || post.date),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
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
