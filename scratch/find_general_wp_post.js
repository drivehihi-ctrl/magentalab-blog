require('dotenv').config({ path: '.env.local' });
const WP_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://magentalab.mycafe24.com') + '/wp-json/wp/v2';
const user = process.env.WP_USER;
const pass = process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

async function main() {
  console.log("Fetching categories...");
  const catRes = await fetch(`${WP_URL}/categories?per_page=100`, { headers: { 'Authorization': auth } });
  const categories = await catRes.json();
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c.name; });
  console.log("Categories:", catMap);

  console.log("\nFetching posts...");
  let page = 1;
  let allPosts = [];
  while (page <= 5) {
    const res = await fetch(`${WP_URL}/posts?per_page=100&page=${page}`, { headers: { 'Authorization': auth } });
    if (!res.ok) break;
    const posts = await res.json();
    if (!posts || posts.length === 0) break;
    allPosts = allPosts.concat(posts);
    page++;
  }

  console.log(`Total fetched posts: ${allPosts.length}`);

  const medicalKeywords = ['당뇨', '인슐린', '방광', '신장', '비뇨', '슬개골', '관절', '탈구', '골절', '독성', '응급', '양파', '초콜릿', '피부', '아토피', '농피증', '질환', '병', '사료', '영양', '단백질', '칼로리', '식단', '건강', '수의', '의학', '약', '치료', '증상', '진단', 'diabetes', 'urinary', 'cystitis', 'patella', 'joint', 'poison', 'emergency', 'onion', 'garlic', 'chocolate', 'skin', 'dermatology', 'atopic', 'allergy', 'disease', 'kidney', 'food', 'nutrition', 'diet', 'health'];

  const nonMedicalPosts = [];

  for (const post of allPosts) {
    const title = post.title.rendered;
    const slug = post.slug;
    const postCats = (post.categories || []).map(cid => catMap[cid] || cid).join(', ');
    
    // Check if title or slug contains medical keywords
    const isMedical = medicalKeywords.some(kw => 
      title.toLowerCase().includes(kw) || slug.toLowerCase().includes(kw)
    );

    if (!isMedical) {
      nonMedicalPosts.push({
        id: post.id,
        slug: post.slug,
        title: title,
        categories: postCats,
        status: post.status,
        featured_media: post.featured_media
      });
    }
  }

  console.log(`\nFound ${nonMedicalPosts.length} non-medical/nutrition posts:`);
  nonMedicalPosts.forEach((p, idx) => {
    console.log(`[${idx+1}] ID: ${p.id} | Status: ${p.status} | Categories: ${p.categories} | Slug: ${p.slug} | Title: ${p.title}`);
  });
}

main().catch(console.error);
