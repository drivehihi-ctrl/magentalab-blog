require('dotenv').config({ path: '.env.local' });

const PROD = 'https://www.magentalabblog.com/api/ai-content';
const API_SECRET = process.env.AI_CONTENT_API_SECRET;
const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` };

async function check() {
  const res = await fetch(`${PROD}/revisions/apply-batch`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ revision_ids: ['a', 'b', 'c', 'd'], confirm: true })
  });
  console.log('HTTP Status:', res.status);
  console.log('Content-Type:', res.headers.get('content-type'));
  console.log('Body (first 200):', (await res.text()).slice(0, 200));
}

check();
