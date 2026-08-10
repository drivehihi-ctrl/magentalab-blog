require('dotenv').config({ path: '.env.local' });

async function checkPost(postId) {
  const wpUser = process.env.WP_USER;
  const wpPass = process.env.WP_SEO_APP_PASSWORD;
  const authHeader = 'Basic ' + Buffer.from(wpUser + ':' + wpPass).toString('base64');

  console.log(`\nFetching Post ${postId} from WP REST API...`);
  const res = await fetch(`https://magentalab.mycafe24.com/wp-json/wp/v2/posts/${postId}`, {
    headers: { 'Authorization': authHeader }
  });

  if (!res.ok) {
    console.error(`Failed to fetch post ${postId}:`, res.status, res.statusText);
    return;
  }

  const post = await res.json();
  console.log(`✅ Found Post ${postId}!`);
  console.log('ID:', post.id);
  console.log('Title:', post.title.rendered);
  console.log('Slug:', post.slug);

  const rawHtml = post.content.rendered || '';
  const imgs = rawHtml.match(/<img[^>]+>/gi) || [];
  console.log(`Original <img> tags count in Post ${postId}:`, imgs.length);
  imgs.forEach((img, i) => {
    console.log(`\n--- [POST ${postId} IMG ${i + 1}] ---`);
    console.log(img);
  });
}

async function main() {
  await checkPost(2391);
  await checkPost(2459);
  await checkPost(2461);
}

main().catch(console.error);
