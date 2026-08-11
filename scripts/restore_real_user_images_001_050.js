require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

async function restorePosts() {
  const wpUser = process.env.WP_USER;
  const wpPass = process.env.WP_SEO_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');
  
  const postsToRestore = [
    2451, 2370, 2457, 5950, 5959, 5961, 2391, 2459, 2402, 2461,
    2156, 2516, 2519, 2189, 2501, 2504, 2590, 2600, 2604, 2307,
    2446, 2449, 2530, 2539, 2542, 2279, 2404, 2110, 2545, 2548,
    2223, 2355, 2364, 1811, 5818, 5820, 2629, 2643, 2645, 2303,
    2422, 2424, 1879, 2845, 2847, 618, 2177, 2506, 2509, 1820
  ];

  console.log(`Starting restoration for ${postsToRestore.length} posts...`);

  for (const postId of postsToRestore) {
    if (!postId || isNaN(postId)) continue;
    
    console.log(`\nRestoring Post ID: ${postId}...`);
    
    try {
      // 1. Fetch current post
      const postRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
        headers: { 'Authorization': authHeader }
      });
      if (!postRes.ok) {
        console.error(`Failed to fetch current post ${postId}: ${postRes.statusText}`);
        continue;
      }
      const postData = await postRes.json();
      const currentContent = postData.content.rendered;
      
      // 2. Extract the custom-vet-references block
      const refIndex = currentContent.indexOf('<div id="custom-vet-references"');
      let customRefHtml = '';
      if (refIndex !== -1) {
        customRefHtml = currentContent.substring(refIndex);
      } else {
        console.warn(`WARNING: Post ${postId} does not have custom-vet-references!`);
      }
      
      // 3. Fetch revisions
      const revRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}/revisions`, {
        headers: { 'Authorization': authHeader }
      });
      if (!revRes.ok) {
        console.error(`Failed to fetch revisions for ${postId}: ${revRes.statusText}`);
        continue;
      }
      const revisions = await revRes.json();
      
      // 4. Find the correct old revision
      let targetRevision = null;
      for (const rev of revisions) {
        if (!rev.content.rendered.includes('id="custom-vet-references"')) {
          targetRevision = rev;
          break; // Found the most recent revision before my destructive script
        }
      }
      
      if (!targetRevision) {
        console.warn(`WARNING: No suitable old revision found for ${postId}!`);
        continue;
      }
      
      console.log(`  Found target revision ${targetRevision.id} from ${targetRevision.date}`);
      
      // 5. Combine old content with the new references UI
      let oldContent = targetRevision.content.rendered;
      
      let finalContent = oldContent;
      if (customRefHtml) {
        finalContent = oldContent.replace(/\s+$/, '') + '\n\n' + customRefHtml;
      }
      
      // 6. Update the post
      const updateRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authHeader 
        },
        body: JSON.stringify({
          content: finalContent
        })
      });
      
      if (updateRes.ok) {
        console.log(`✅ Post ${postId} successfully restored!`);
      } else {
        const errorText = await updateRes.text();
        console.error(`❌ Failed to update post ${postId}: ${errorText}`);
      }
      
    } catch (e) {
      console.error(`Error processing post ${postId}: ${e.message}`);
    }
  }
  
  console.log('\n🎉 All restorations completed!');
}

restorePosts();
