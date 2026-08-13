require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

async function run() {
  const wpUser = process.env.WORDPRESS_API_USERNAME;
  const wpPass = process.env.WORDPRESS_API_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  console.log('Fetching Post 5950 from WP REST API...');
  const res = await fetch('https://magentalab.mycafe24.com/wp-json/wp/v2/posts/5950', {
    headers: { 'Authorization': authHeader }
  });

  if (!res.ok) {
    console.error('Failed to fetch post 5950:', res.status, res.statusText);
    return;
  }

  const post = await res.json();
  console.log('✅ Found Post 5950!');
  console.log('ID:', post.id);
  console.log('Title:', post.title.rendered);
  console.log('Slug:', post.slug);

  const rawHtml = post.content.rendered || '';
  const imgs = rawHtml.match(/<img[^>]+>/gi) || [];
  console.log('Original <img> tags count in Post 5950:', imgs.length);
  imgs.forEach((img, i) => {
    console.log(`\n--- [ORIGINAL IMG ${i + 1}] ---`);
    console.log(img);
  });
}

run().catch(console.error);
