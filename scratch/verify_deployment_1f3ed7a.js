require('dotenv').config({ path: '.env.local' });

const API_SECRET = process.env.AI_CONTENT_API_SECRET || 'magentalab-ai-secret-key-1234';

async function verifyDeployment() {
  console.log("Verifying commit 1f3ed7a is deployed to Production...");
  console.log("Testing decision-only payload on rev_9912c192e5eb0eab...\n");

  const res = await fetch('https://www.magentalabblog.com/api/ai-content/revisions/rev_9912c192e5eb0eab/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`,
      'x-ai-secret': API_SECRET
    },
    body: JSON.stringify({ decision: 'reject', confirm: true })
  });

  console.log(`HTTP Status: ${res.status}`);
  const body = await res.text();
  console.log(`Raw Response: ${body}`);

  // Check if new code is deployed
  if (body.includes('decision/action')) {
    console.log("\n✅ NEW code deployed confirmed (decision/action message present)");
  } else if (body.includes('action must be')) {
    console.log("\n⚠️  OLD code still serving (action must be message) - Vercel build still pending");
  } else if (res.ok) {
    console.log("\n✅ Request succeeded - new code working");
  } else {
    console.log("\n⚠️  Different response than expected");
  }
}

verifyDeployment();
