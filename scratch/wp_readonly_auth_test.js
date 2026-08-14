require('dotenv').config({ path: '.env.local' });

// Vercel Production과 동일한 우선순위로 env 해석
const wpUrl = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || '';
const wpUser = process.env.WORDPRESS_API_USERNAME || process.env.WP_USER || '';
const wpPass = process.env.WORDPRESS_API_APP_PASSWORD || process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD || '';

if (!wpUrl || !wpUser || !wpPass) {
  console.error('Missing required env vars');
  process.exit(1);
}

const auth = 'Basic ' + Buffer.from(`${wpUser}:${wpPass}`).toString('base64');

fetch(`${wpUrl}/wp-json/wp/v2/posts/5800?context=edit`, {
  method: 'GET',
  headers: {
    'Authorization': auth,
    'User-Agent': 'MagentaLab-AI-Content/1.0'
  }
})
  .then(async res => {
    const status = res.status;
    if (!res.ok) {
      console.log(`HTTP status: ${status}`);
      const text = await res.text();
      console.log(`error: ${text.slice(0, 100)}`);
      return;
    }
    const post = await res.json();
    console.log(`HTTP status: ${status}`);
    console.log(`post id: ${post.id}`);
    console.log(`post status: ${post.status}`);
  })
  .catch(e => {
    console.error('Fatal:', e.message);
    process.exit(1);
  });
