require('dotenv').config({ path: '.env.local' });
const WP_URL = 'https://magentalab.mycafe24.com/wp-json/wp/v2';
const auth = 'Basic ' + Buffer.from(process.env.WORDPRESS_API_USERNAME + ':' + process.env.WORDPRESS_API_APP_PASSWORD).toString('base64');

async function run() {
  console.log("Fetching latest 50 posts...");
  const res = await fetch(`${WP_URL}/posts?per_page=50`, { headers: { 'Authorization': auth } });
  const posts = await res.json();
  
  let corrupted = 0;
  for (const post of posts) {
    const content = post.content.rendered;
    if (content.includes('ez-toc-container')) {
      const tocIdx = content.indexOf('ez-toc-container');
      if (tocIdx < 3000 && !content.includes('1. ')) { // TOC is very early, and "1. " is missing
        console.log(`[SUSPICIOUS] Post ID ${post.id}: ${post.title.rendered}`);
        corrupted++;
      }
    }
  }
  
  console.log(`Found ${corrupted} suspiciously truncated posts out of 50.`);
}

run();
