import { getPosts } from "@/lib/wp";
import { sanitizeForSeo } from "@/lib/utils";

/**
 * 전용몰 제품이 포함되지 않은 순수 블로그 포스트 전용 RSS 피드를 생성합니다.
 * 네이버 서치어드바이저 및 구글 서치콘솔 제출용입니다.
 */
export async function GET() {
  const siteUrl = "https://www.magentalabblog.com";
  
  try {
    // 최신 글 50개를 RSS로 제공 (검색 엔진 노출 범위 확대)
    const { posts } = await getPosts(1, 50);
    
    const rssItemsXml = posts
      .map((post) => {
        const title = sanitizeForSeo(post.title.rendered);
        const description = sanitizeForSeo(post.excerpt.rendered, 160);
        const postUrl = `${siteUrl}/posts/${post.id}`;
        const pubDate = new Date(post.date).toUTCString();
        
        return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <author>Magentalab</author>
    </item>`;
      })
      .join("");

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Magentalab 반려동물 연구소</title>
    <link>${siteUrl}</link>
    <description>데이터와 과학으로 반려동물의 더 나은 삶을 연구합니다.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItemsXml}
  </channel>
</rss>`.trim();

    return new Response(rssXml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("RSS generation failed:", error);
    return new Response("Failed to generate RSS feed", { status: 500 });
  }
}
