require('dotenv').config({ path: '.env.local' });

const API_SECRET = process.env.AI_CONTENT_API_SECRET || 'magentalab-ai-secret-key-1234';

async function executePhase53() {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_SECRET}`
  };

  // 1) GET Review Queue
  console.log("=== 1) GET Review Queue ===");
  const queueUrl = 'https://www.magentalabblog.com/api/ai-content/revisions/review?status=pending_review';
  const queueRes = await fetch(queueUrl, { method: 'GET', headers });
  console.log(`HTTP Status: ${queueRes.status}`);
  const queueBodyText = await queueRes.text();
  console.log("Raw JSON Response:");
  console.log(queueBodyText);

  if (!queueRes.ok) {
    console.error(`\n❌ Failed at GET Queue with HTTP ${queueRes.status}`);
    process.exit(1);
  }

  // 2) POST Approve rev_869394b4ae5c79e7
  console.log("\n=== 2) POST Approve rev_869394b4ae5c79e7 ===");
  const approveUrl = 'https://www.magentalabblog.com/api/ai-content/revisions/rev_869394b4ae5c79e7/review';
  const approveRes = await fetch(approveUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ decision: 'approve', action: 'approve', confirm: true })
  });
  console.log(`HTTP Status: ${approveRes.status}`);
  const approveBodyText = await approveRes.text();
  console.log("Raw JSON Response:");
  console.log(approveBodyText);

  if (!approveRes.ok) {
    console.error(`\n❌ Failed at Approve with HTTP ${approveRes.status}`);
    process.exit(1);
  }

  // 3) POST Reject rev_96b5971ed8aa285c
  console.log("\n=== 3) POST Reject rev_96b5971ed8aa285c ===");
  const rejectUrl = 'https://www.magentalabblog.com/api/ai-content/revisions/rev_96b5971ed8aa285c/review';
  const rejectRes = await fetch(rejectUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ decision: 'reject', action: 'reject', confirm: true })
  });
  console.log(`HTTP Status: ${rejectRes.status}`);
  const rejectBodyText = await rejectRes.text();
  console.log("Raw JSON Response:");
  console.log(rejectBodyText);

  if (!rejectRes.ok) {
    console.error(`\n❌ Failed at Reject with HTTP ${rejectRes.status}`);
    process.exit(1);
  }
}

executePhase53().catch(err => {
  console.error("Execution Fatal Error:", err.message);
  process.exit(1);
});
