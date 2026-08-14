require('dotenv').config({ path: '.env.local' });
const WP_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://magentalab.mycafe24.com') + '/wp-json/wp/v2';
const user = process.env.WP_USER;
const pass = process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

async function main() {
  const res = await fetch(`${WP_URL}/posts/5885?context=edit`, {
    headers: { 'Authorization': auth }
  });
  if (!res.ok) {
    console.error("Failed to fetch edit context:", res.status, await res.text());
    return;
  }
  const post = await res.json();
  console.log("Post 5885 title.raw  :", post.title.raw);
  console.log("Post 5885 content.raw length:", post.content.raw.length);
  console.log("Post 5885 content.rendered length:", post.content.rendered.length);
}

main();
