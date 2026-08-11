require('dotenv').config({ path: '.env.local' });

async function testRevisions() {
  const wpUser = process.env.WP_USER;
  const wpPass = process.env.WP_SEO_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');
  
  // Try to fetch posts to find the one with slug 'cat_fip_symptoms_guide'
  const res = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts?slug=cat_fip_symptoms_guide`, {
    headers: { 'Authorization': authHeader }
  });
  const posts = await res.json();
  if (!posts || posts.length === 0) {
    console.log("Post not found");
    return;
  }
  
  const postId = posts[0].id;
  console.log(`Found Post ID: ${postId}`);
  
  // Fetch revisions
  const revRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}/revisions`, {
    headers: { 'Authorization': authHeader }
  });
  const revisions = await revRes.json();
  
  console.log(`Found ${revisions.length} revisions.`);
  for (const rev of revisions.slice(0, 3)) {
    console.log(`Revision ID: ${rev.id}, Date: ${rev.date}`);
    const html = rev.content.rendered;
    const imgs = html.match(/<img[^>]+>/g);
    console.log(`  Images in this revision: ${imgs ? imgs.length : 0}`);
    if (imgs && imgs.length > 0) {
       console.log(`  First image: ${imgs[0]}`);
       require('fs').writeFileSync('test_rev_html.html', html);
       console.log("Saved full html to test_rev_html.html");
    }
  }
}

testRevisions().catch(console.error);
