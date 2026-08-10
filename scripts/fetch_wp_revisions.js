require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

async function fetchRevisions() {
  const wpUser = process.env.WP_USER;
  const wpPass = process.env.WP_SEO_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  const postIds = [2451, 2370, 2457];

  for (const id of postIds) {
    console.log(`\nFetching revisions for Post ID ${id}...`);
    const res = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${id}/revisions`, {
      headers: { 'Authorization': authHeader }
    });

    if (res.ok) {
      const revisions = await res.json();
      console.log(`Found ${revisions.length} revisions for Post ${id}.`);
      for (let i = 0; i < revisions.length; i++) {
        const rev = revisions[i];
        const imgMatches = rev.content.rendered.match(/<img[^>]+>/g);
        if (imgMatches && imgMatches.length > 0) {
          console.log(`🎉 Found ${imgMatches.length} <img> tags in Revision ID ${rev.id} (date: ${rev.date}):`);
          imgMatches.forEach((img, idx) => console.log(`   Img ${idx + 1}: ${img}`));
          fs.writeFileSync(`post_${id}_revision_${rev.id}.html`, rev.content.rendered, 'utf8');
        }
      }
    } else {
      console.error(`❌ Failed to fetch revisions for Post ${id}: ${res.status}`);
    }
  }
}

fetchRevisions().catch(console.error);
