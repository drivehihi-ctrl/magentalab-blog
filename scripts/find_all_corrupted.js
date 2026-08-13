require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const WP_URL = 'https://magentalab.mycafe24.com/wp-json/wp/v2';
const auth = 'Basic ' + Buffer.from(process.env.WORDPRESS_API_USERNAME + ':' + process.env.WORDPRESS_API_APP_PASSWORD).toString('base64');

async function run() {
  console.log("Fetching all posts...");
  let allPosts = [];
  let page = 1;
  while(true) {
    const res = await fetch(`${WP_URL}/posts?per_page=100&page=${page}`, { headers: { 'Authorization': auth } });
    if (!res.ok) break;
    const posts = await res.json();
    if (posts.length === 0) break;
    allPosts = allPosts.concat(posts);
    page++;
  }
  
  console.log(`Fetched ${allPosts.length} posts. Scanning for truncation...`);
  
  let corruptedIds = [];
  
  for (const post of allPosts) {
    const content = post.content.rendered;
    if (content.includes('ez-toc-container')) {
      const tocIdx = content.indexOf('ez-toc-container');
      
      // If TOC is in the first 3000 chars, AND it's missing '1. ', highly suspicious.
      if (tocIdx < 3000 && !content.includes('1. ')) {
        corruptedIds.push(post.id);
      }
    }
  }
  
  console.log(`Found ${corruptedIds.length} suspiciously truncated posts based on content analysis.`);
  fs.writeFileSync('corrupted_ids.json', JSON.stringify(corruptedIds));
}

run();
