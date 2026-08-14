require('dotenv').config({ path: '.env.local' });

const API_SECRET = process.env.AI_CONTENT_API_SECRET || 'magentalab-ai-secret-key-1234';

async function testOnlyDecisionPayload() {
  console.log("Testing POST /api/ai-content/revisions/rev_9912c192e5eb0eab/review with ONLY decision key...");
  const res = await fetch('https://www.magentalabblog.com/api/ai-content/revisions/rev_9912c192e5eb0eab/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: JSON.stringify({
      decision: 'reject',
      confirm: true
    })
  });

  console.log("HTTP Status:", res.status);
  console.log("Response Body:", await res.text());
}

testOnlyDecisionPayload();
