require('dotenv').config({ path: '.env.local' });

const API_SECRET = process.env.AI_CONTENT_API_SECRET || 'magentalab-ai-secret-key-1234';

console.log("Secret length:", API_SECRET.length);
console.log("Secret value (first 8 chars):", API_SECRET.slice(0, 8) + '...');

async function testAllHeaders() {
  // Test 1: Standard Bearer
  const res1 = await fetch('https://www.magentalabblog.com/api/ai-content/revisions/rev_9912c192e5eb0eab/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: JSON.stringify({ decision: 'reject', confirm: true })
  });
  console.log("Test1 [Bearer only]:", res1.status, await res1.text());
}

testAllHeaders();
