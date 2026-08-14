require('dotenv').config({ path: '.env.local' });
const WP_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://magentalab.mycafe24.com') + '/wp-json/wp/v2';
const user = process.env.WP_USER;
const pass = process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

async function main() {
  const res = await fetch(`${WP_URL}/posts/5800?context=edit`, {
    headers: { 'Authorization': auth }
  });
  const post = await res.json();
  console.log("ID:", post.id);
  console.log("Slug:", post.slug);
  console.log("Title:", post.title.raw);
  console.log("Content raw length:", post.content.raw.length);
  console.log("Content rendered length:", post.content.rendered.length);
}

main();
