require('dotenv').config({ path: '.env.local' });

async function verifyWP() {
  const wpUser = process.env.WP_USER;
  const wpPass = process.env.WP_SEO_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  const postIds = [2451, 2370, 2457];

  console.log('--- VERIFYING WORDPRESS REST API POSTS STATUS ---');

  for (const id of postIds) {
    const res = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${id}`, {
      headers: { 'Authorization': authHeader }
    });

    if (res.ok) {
      const post = await res.json();
      console.log(`\n📌 Post ID: ${post.id}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Title: ${post.title.rendered}`);
      console.log(`   Modified Date: ${post.modified}`);
      console.log(`   Content Length: ${post.content.rendered.length} characters`);
      const hasImagePrompt = post.content.rendered.includes('Hyper-realistic 3D render style');
      console.log(`   Contains New Image Prompt: ${hasImagePrompt ? '✅ YES' : '❌ NO'}`);
    } else {
      console.error(`❌ Failed to fetch Post ${id}`);
    }
  }
}

verifyWP().catch(console.error);
