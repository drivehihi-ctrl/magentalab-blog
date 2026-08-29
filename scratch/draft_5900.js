require('dotenv').config({ path: '.env.local' });

const wpUrl = process.env.WORDPRESS_API_URL || 'https://magentalab.mycafe24.com/wp-json';
const wpUser = process.env.WORDPRESS_API_USERNAME;
const wpPass = process.env.WORDPRESS_API_APP_PASSWORD;
const auth = Buffer.from(`${wpUser}:${wpPass}`).toString('base64');
const authorization = `Basic ${auth}`;

async function trashPost() {
  const res = await fetch(`${wpUrl}/wp/v2/posts/5900`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authorization,
      'X-Authorization': authorization,
      'x-http-authorization': authorization,
      'User-Agent': 'MagentaLab-AI-Content/1.0',
    },
    body: JSON.stringify({ status: 'draft' })
  });
  
  if (res.ok) {
    console.log("Post 5900 moved to draft successfully.");
  } else {
    console.error("Failed:", await res.text());
  }
}

trashPost();
