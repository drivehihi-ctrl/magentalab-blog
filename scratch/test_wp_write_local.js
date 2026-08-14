require('dotenv').config({ path: '.env.local' });

const WP_BASE = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL;
const WP_USER = process.env.WP_USER || process.env.WORDPRESS_API_USERNAME;
const WP_PASS = process.env.WORDPRESS_API_APP_PASSWORD || process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;

if (!WP_USER || !WP_PASS) {
  console.error("❌ WP_USER or WP_PASS not set");
  process.exit(1);
}

const auth = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
console.log(`WP_BASE: ${WP_BASE}`);
console.log(`WP_USER: ${WP_USER}`);
console.log(`Auth prefix: ${auth.slice(0, 12)}...`);

async function testWPWrite() {
  // Step 1: GET post 5800 (should work)
  console.log("\n[1] GET /wp-json/wp/v2/posts/5800 ...");
  const getRes = await fetch(`${WP_BASE}/wp-json/wp/v2/posts/5800?context=edit`, {
    headers: { 'Authorization': auth, 'User-Agent': 'MagentaLab-AI-Content/1.0' }
  });
  console.log(`    Status: ${getRes.status}`);
  const getText = await getRes.text();
  if (!getRes.ok) {
    console.error(`    FAIL body (first 200): ${getText.slice(0, 200)}`);
    return;
  }
  const getPost = JSON.parse(getText);
  console.log(`    title: ${getPost.title?.raw?.slice(0, 60)}`);
  console.log(`    slug: ${getPost.slug}`);
  console.log(`    modified: ${getPost.modified}`);

  // Step 2: POST (update) with NO actual change (send same title back)
  console.log("\n[2] POST /wp-json/wp/v2/posts/5800 (WP write test - sending same title) ...");
  const writeRes = await fetch(`${WP_BASE}/wp-json/wp/v2/posts/5800`, {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      'User-Agent': 'MagentaLab-AI-Content/1.0'
    },
    body: JSON.stringify({ title: getPost.title?.raw || getPost.title?.rendered })
  });
  console.log(`    Status: ${writeRes.status}`);
  const writeText = await writeRes.text();
  if (!writeRes.ok) {
    console.error(`    FAIL body (first 300): ${writeText.slice(0, 300)}`);
  } else {
    const writeData = JSON.parse(writeText);
    console.log(`    ✅ Write SUCCESS, post slug: ${writeData.slug}`);
  }
}

testWPWrite().catch(e => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
