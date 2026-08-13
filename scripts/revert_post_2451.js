require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const postId = 2451;
const csvContent = fs.readFileSync('magentalab_all_posts_454.csv', 'utf8');

// Parse CSV row for post ID 2451
function getOriginalPostData(id) {
  const lines = csvContent.split('\n');
  for (const line of lines) {
    if (line.startsWith(`"${id}"`) || line.startsWith(`${id},`)) {
      // Basic CSV split by quote
      const fields = line.split('","');
      if (fields.length >= 12) {
        const title = fields[3];
        const excerpt = fields[9];
        let contentHtmlRaw = fields[11];
        if (contentHtmlRaw.endsWith('"')) {
          contentHtmlRaw = contentHtmlRaw.slice(0, -1);
        }
        return { title, excerpt, content: contentHtmlRaw };
      }
    }
  }
  return null;
}

async function revertPost() {
  const origData = getOriginalPostData(postId);
  if (!origData) {
    throw new Error(`Original data for post ${postId} not found in CSV backup!`);
  }

  console.log(`Reverting Post ID ${postId} to original CSV backup...`);
  console.log(`Original Title: ${origData.title}`);

  const wpUser = process.env.WORDPRESS_API_USERNAME;
  const wpPass = process.env.WORDPRESS_API_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  const response = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify({
      title: origData.title,
      excerpt: origData.excerpt,
      content: origData.content
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`WP API Error (${response.status}): ${errText}`);
  }

  const updatedPost = await response.json();
  console.log(`✅ Successfully reverted Post ID ${updatedPost.id} back to original state!`);

  // Trigger CDN Revalidation
  console.log('Triggering instant CDN revalidation...');
  const revalRes = await fetch('https://www.magentalabblog.com/api/revalidate?secret=magentalab-1234');
  const revalJson = await revalRes.json();
  console.log('Revalidate status:', revalJson);
}

revertPost().catch(err => console.error(err));
