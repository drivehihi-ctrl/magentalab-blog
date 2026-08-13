require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

async function fetchCurrentWp() {
  const wpUser = process.env.WORDPRESS_API_USERNAME;
  const wpPass = process.env.WORDPRESS_API_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  const postIds = [2451, 2370, 2457];

  for (const id of postIds) {
    const res = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${id}`, {
      headers: { 'Authorization': authHeader }
    });

    if (res.ok) {
      const post = await res.json();
      console.log(`\n======================================================`);
      console.log(`Post ID ${id} (${post.slug}) Current WP Content HTML:`);
      console.log(`Title: ${post.title.rendered}`);
      fs.writeFileSync(`wp_current_post_${id}.html`, post.content.rendered, 'utf8');
      
      // Extract all <img ...> tags
      const imgMatches = post.content.rendered.match(/<img[^>]+>/g);
      console.log(`Found ${imgMatches ? imgMatches.length : 0} <img> tags in Post ${id}:`);
      if (imgMatches) {
        imgMatches.forEach((img, idx) => console.log(`  Img ${idx + 1}: ${img}`));
      }
    }
  }
}

fetchCurrentWp().catch(console.error);
