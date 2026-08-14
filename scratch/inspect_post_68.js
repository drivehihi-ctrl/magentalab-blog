require('dotenv').config({ path: '.env.local' });
const WP_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://magentalab.mycafe24.com') + '/wp-json/wp/v2';
const user = process.env.WP_USER;
const pass = process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

async function main() {
  const postId = 68;
  const res = await fetch(`${WP_URL}/posts/${postId}`, { headers: { 'Authorization': auth } });
  if (!res.ok) {
    console.error("Failed to fetch post", res.status, await res.text());
    return;
  }
  const post = await res.json();
  console.log("Post ID:", post.id);
  console.log("Status:", post.status);
  console.log("Slug:", post.slug);
  console.log("Title:", post.title.rendered);
  console.log("Excerpt:", post.excerpt.rendered);
  console.log("Categories:", post.categories);
  console.log("Tags:", post.tags);
  console.log("Featured Media:", post.featured_media);
  console.log("Modified:", post.modified);
  console.log("Content length:", post.content.rendered.length);
  console.log("Includes 'Research Summary':", post.content.rendered.includes("Research Summary"));
  console.log("Includes 'Ansim-i':", post.content.rendered.includes("Ansim-i"));
  console.log("\nFirst 300 chars of Content:\n", post.content.rendered.substring(0, 300));
}

main();
