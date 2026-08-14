require('dotenv').config({ path: '.env.local' });

// WP_SEO_APP_PASSWORD를 사용 (Vercel과 동일한 우선순위)
const WP_BASE = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL;
const WP_USER = process.env.WP_USER || process.env.WORDPRESS_API_USERNAME;
const WP_PASS = process.env.WP_SEO_APP_PASSWORD; // Vercel에서 우선 사용되는 값

const auth = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
console.log(`Testing with WP_SEO_APP_PASSWORD (same as Vercel priority)`);

async function test() {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/posts/5800`, {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      'User-Agent': 'MagentaLab-AI-Content/1.0'
    },
    body: JSON.stringify({ title: '고양이 사진 찍기 거부, 카메라 렌즈 피하는 고양이 심리와 시선 끌기 팁' })
  });
  console.log(`Status: ${res.status}`);
  const text = await res.text();
  if (res.ok) console.log(`✅ WP_SEO_APP_PASSWORD works`);
  else console.log(`❌ FAIL (first 200): ${text.slice(0, 200)}`);
}

test();
