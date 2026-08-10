require('dotenv').config({ path: '.env.local' });

async function run() {
  const wpUser = process.env.WP_USER;
  const wpPass = process.env.WP_SEO_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  console.log('Fetching Post ID 2402 from WP REST API...');
  const res = await fetch('https://magentalab.mycafe24.com/wp-json/wp/v2/posts/2402', {
    headers: { 'Authorization': authHeader }
  });

  if (!res.ok) {
    console.error('Failed to fetch post 2402:', res.status, res.statusText);
    return;
  }

  const post = await res.json();
  console.log('✅ Found Post 2402!');
  console.log('ID:', post.id);
  console.log('Current Title:', post.title.rendered);
  console.log('Current Slug:', post.slug);
  console.log('Current Link:', post.link);
}

run().catch(console.error);
