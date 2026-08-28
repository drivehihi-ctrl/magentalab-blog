import { MetadataRoute } from 'next';
import { getAllPostsForSitemap } from '@/lib/wp';
import { INITIAL_PET_PLACES } from '@/lib/map/places';

// 사이트맵은 매 요청시마다 최신 데이터로 동적 생성
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.magentalabblog.com';

  // 펫 맵 개별 장소 상세 페이지 목록
  const placeEntries: MetadataRoute.Sitemap = INITIAL_PET_PLACES.map((place) => ({
    url: `${baseUrl}/map/place/${place.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 블로그 포스트 전체 가져오기
  let posts: any[] = [];
  try {
    posts = await getAllPostsForSitemap();
  } catch (error) {
    console.error('Failed to fetch posts for sitemap:', error);
  }

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    let path = `/posts/${post.slug}`;
    if (post.slug && post.slug.endsWith('-ja')) {
      path = `/ja/posts/${post.slug}`;
    } else if (post.slug && post.slug.endsWith('-en')) {
      path = `/en/posts/${post.slug}`;
    }

    return {
      url: `${baseUrl}${path}`,
      lastModified: new Date(post.modified || post.date),
      changeFrequency: 'weekly',
      priority: 0.7,
    };
  });

  // 고정 정적 페이지 목록 (한국어, 영어, 일본어)
  const staticPages: MetadataRoute.Sitemap = [
    // 한국어 페이지
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/map`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },

    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/about-ansim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/ask-ansimi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/bcs-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/age-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/dm-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/emergency-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/fic-diagnoser`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/patella-diagnoser`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/petcare-expenses-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },



    // 영어 페이지
    { url: `${baseUrl}/en`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/en/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/en/about-ansim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/en/bcs-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/en/age-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/en/dm-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/en/emergency-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/en/fic-diagnoser`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/en/patella-diagnoser`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/en/petcare-expenses-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/en/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/en/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },

    // 일본어 페이지
    { url: `${baseUrl}/ja`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/ja/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/ja/about-ansim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/ja/bcs-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/ja/age-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/ja/dm-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/ja/emergency-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/ja/fic-diagnoser`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/ja/patella-diagnoser`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/ja/petcare-expenses-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/ja/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/ja/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  return [...staticPages, ...placeEntries, ...postEntries];
}
