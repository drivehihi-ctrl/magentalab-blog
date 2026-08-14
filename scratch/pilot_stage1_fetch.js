require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL;
const WP_USER = process.env.WP_USER;
const WP_PASS = process.env.WORDPRESS_API_APP_PASSWORD || process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const WP_AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
const PROD = 'https://www.magentalabblog.com/api/ai-content';
const API_SECRET = process.env.AI_CONTENT_API_SECRET;
const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` };

async function fetchWP(wpId) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts/${wpId}?context=edit`, {
    headers: { 'Authorization': WP_AUTH }
  });
  if (!res.ok) return null;
  return await res.json();
}

async function runAudit(wpId) {
  const res = await fetch(`${PROD}/audit`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ post_ids: [wpId] })
  });
  const data = await res.json();
  return data.results?.[0];
}

async function searchWP(search) {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?search=${encodeURIComponent(search)}&per_page=10&context=edit`, {
        headers: { 'Authorization': WP_AUTH }
    });
    return await res.json();
}

async function main() {
  const targetIds = [5950, 5985, 6007];
  const candidates = [];
  
  console.log("Fetching primary candidates...");
  for (const id of targetIds) {
      const post = await fetchWP(id);
      if (post) candidates.push(post);
  }
  
  console.log("Searching for behavioral/non-medical posts...");
  // Let's search for "왜" (why), "이유" (reason), "고양이 행동" (cat behavior), etc.
  const searchRes = await searchWP("이유");
  
  const additional = [];
  for (const p of searchRes) {
      if (targetIds.includes(p.id)) continue;
      // Skip known test posts
      if ([6090, 6042, 6130, 5800].includes(p.id)) continue;
      if (p.title.raw.includes('Test') || p.title.raw.includes('테스트')) continue;
      additional.push(p);
      if (additional.length >= 2) break;
  }
  
  const finalPosts = [...candidates, ...additional];
  const results = [];
  
  for (const p of finalPosts) {
      console.log(`Auditing ${p.id}: ${p.title.raw}`);
      const audit = await runAudit(p.id);
      results.push({
          post: {
              id: p.id,
              slug: p.slug,
              title: p.title.raw,
              content: p.content.raw,
              excerpt: p.excerpt.raw,
              status: p.status,
              modified: p.modified,
              featured_media: p.featured_media,
              categories: p.categories,
              tags: p.tags,
              content_length: p.content.raw.length
          },
          audit: audit
      });
  }
  
  fs.writeFileSync('scratch/pilot_stage1_data.json', JSON.stringify(results, null, 2));
  console.log("Saved to scratch/pilot_stage1_data.json");
}

main().catch(console.error);
