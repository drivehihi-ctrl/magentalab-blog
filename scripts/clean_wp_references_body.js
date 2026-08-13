require('dotenv').config({ path: '.env.local' });

const postIds = [2451, 5661, 5763, 5818, 2370, 5959, 1724, 5928, 5930, 1792, 5843, 5845];

async function cleanAllWpBodyReferences() {
  const wpUser = process.env.WORDPRESS_API_USERNAME;
  const wpPass = process.env.WORDPRESS_API_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  console.log(`🚀 Cleaning raw 🔬 reference sections from WP DB content for ${postIds.length} posts...`);

  for (const id of postIds) {
    const res = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${id}`, {
      headers: { 'Authorization': authHeader }
    });
    if (!res.ok) continue;

    const post = await res.json();
    let content = post.content?.rendered || '';

    // Check if content has 🔬 or 수의학 연구 근거 or Veterinary Evidence or 獣医学
    const h2Matches = Array.from(content.matchAll(/<h2[^>]*>[\s\S]*?<\/h2>/gi));
    let refH2Index = -1;
    for (const match of h2Matches) {
      if (match[0].includes('🔬') || match[0].includes('수의학 연구 근거') || match[0].includes('Veterinary Evidence') || match[0].includes('獣医学')) {
        refH2Index = match.index;
      }
    }

    if (refH2Index !== -1) {
      const cleanedContent = content.slice(0, refH2Index).trim();
      console.log(`Updating WP Post ID ${id} (stripping raw reference block)...`);
      
      const updateRes = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({ content: cleanedContent })
      });

      if (updateRes.ok) {
        console.log(`✅ Post ID ${id} cleaned successfully in WP DB!`);
      } else {
        console.error(`❌ Post ID ${id} failed to update in WP DB`);
      }
    } else {
      console.log(`Post ID ${id} already clean.`);
    }
  }

  // Trigger CDN Revalidation
  console.log('\nTriggering instant CDN revalidation...');
  const revalRes = await fetch('https://www.magentalabblog.com/api/revalidate?secret=magentalab-1234');
  console.log('Revalidate status:', await revalRes.json());
}

cleanAllWpBodyReferences().catch(err => console.error(err));
