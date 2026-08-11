require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const WP_URL = 'https://magentalab.mycafe24.com/wp-json/wp/v2';
const auth = 'Basic ' + Buffer.from(process.env.WP_USER + ':' + process.env.WP_SEO_APP_PASSWORD).toString('base64');

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
  
  console.log(`Fetched ${allPosts.length} posts. Scanning revision histories...`);
  
  let corruptedPosts = [];
  
  for (let i = 0; i < allPosts.length; i++) {
    const post = allPosts[i];
    console.log(`Scanning [${i+1}/${allPosts.length}] Post ID ${post.id}`);
    
    // Fetch revisions
    const revRes = await fetch(`${WP_URL}/posts/${post.id}/revisions`, { headers: { 'Authorization': auth } });
    if (!revRes.ok) continue;
    const revisions = await revRes.json();
    
    if (revisions.length < 2) continue;
    
    // Sort revisions from oldest to newest
    revisions.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let maxDrop = 0;
    let healthyRevision = null;
    let corruptedRevision = null;
    
    for (let j = 0; j < revisions.length - 1; j++) {
      const older = revisions[j];
      const newer = revisions[j+1];
      
      const drop = older.content.rendered.length - newer.content.rendered.length;
      if (drop > maxDrop) {
        maxDrop = drop;
        healthyRevision = older;
        corruptedRevision = newer;
      }
    }
    
    // If the maximum drop in history is greater than 3000 chars, it's highly suspicious!
    // AND the drop must have happened around July 20-25 (the known incident).
    if (maxDrop > 3000 && corruptedRevision) {
      const dropDate = new Date(corruptedRevision.date);
      if (dropDate.getMonth() === 6) { // July (0-indexed)
        // Check if the current live post is STILL truncated (i.e. length is close to the corrupted revision)
        const currentLength = post.content.rendered.length;
        if (currentLength < healthyRevision.content.rendered.length - 2000) {
          corruptedPosts.push({
            id: post.id,
            title: post.title.rendered,
            healthyRevId: healthyRevision.id,
            dropSize: maxDrop,
            dropDate: corruptedRevision.date
          });
        }
      }
    }
  }
  
  console.log(`\nFound ${corruptedPosts.length} TRULY corrupted posts!`);
  fs.writeFileSync('true_corrupted_posts.json', JSON.stringify(corruptedPosts, null, 2));
}

run();
