const { getPosts } = require('../lib/wp');
const { sanitizeForSeo } = require('../lib/utils');

async function testRss() {
  const siteUrl = "https://www.magentalabblog.com";
  try {
    const { posts } = await getPosts();
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
</rss>`;

    console.log("RSS XML generated successfully. Length:", rssXml.length);
    if (rssXml.includes("undefined")) {
      console.error("Found undefined in XML!");
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testRss();
