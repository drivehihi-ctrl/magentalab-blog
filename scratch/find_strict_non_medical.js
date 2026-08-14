require('dotenv').config({ path: '.env.local' });
const WP_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://magentalab.mycafe24.com') + '/wp-json/wp/v2';
const user = process.env.WP_USER;
const pass = process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

async function main() {
  console.log("Fetching posts to test strict non-medical regex...");
  const res = await fetch(`${WP_URL}/posts?per_page=100`, { headers: { 'Authorization': auth } });
  const posts = await res.json();

  const slugRegex = /diabetes|urinary|cystitis|patella|joint|poison|emergency|onion|garlic|chocolate|skin|dermatology|atopic|allergy/i;
  const contentRegex = /당뇨|인슐린|방광|신장|비뇨|슬개골|관절|탈구|골절|독성|응급|양파|초콜릿|피부|아토피|농피증/i;

  const validPosts = [];

  for (const post of posts) {
    const slugMatch = post.slug.match(slugRegex);
    const contentMatch = post.content.rendered.match(contentRegex);

    if (!slugMatch && !contentMatch) {
      validPosts.push({
        id: post.id,
        slug: post.slug,
        title: post.title.rendered,
        categories: post.categories
      });
    }
  }

  console.log(`Found ${validPosts.length} posts strictly matching non-medical criteria:`);
  validPosts.forEach(p => {
    console.log(`ID: ${p.id} | Slug: ${p.slug} | Title: ${p.title}`);
  });
}

main().catch(console.error);
