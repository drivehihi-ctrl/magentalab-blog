require('dotenv').config({ path: '.env.local' });

const PROD_AUDIT_ENDPOINT = 'https://www.magentalabblog.com/api/ai-content/audit';
const API_SECRET = 'magentalab-1234';

async function runAuditPilot() {
  console.log("=======================================================");
  console.log(`[Phase 5.1 Production Audit Pilot] Target: ${PROD_AUDIT_ENDPOINT}`);
  console.log("=======================================================");

  const payload = {
    limit: 5,
    language: "ko"
  };

  console.log("Sending POST Request Payload:", JSON.stringify(payload));
  console.log("Authorization Header: Bearer [REDACTED_SECRET]\n");

  const res = await fetch(PROD_AUDIT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: JSON.stringify(payload)
  });

  console.log(`HTTP Status: ${res.status}`);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Audit Pilot Request Failed Body:", errorText);
    process.exit(1);
  }

  const data = await res.json();

  console.log("\n=======================================================");
  console.log("RESPONSE SUMMARY:");
  console.log("=======================================================");
  console.log(JSON.stringify(data.summary, null, 2));

  console.log("\n=======================================================");
  console.log("AUDIT POSTS RESULT (Limit 5):");
  console.log("=======================================================");

  const posts = data.posts || [];
  posts.slice(0, 5).forEach((p, idx) => {
    console.log(`[Post #${idx + 1}]`);
    console.log(`  - wordpress_id       : ${p.wordpress_id}`);
    console.log(`  - status             : ${p.status}`);
    console.log(`  - medical_risk       : ${p.medical_risk}`);
    console.log(`  - medical_risk_level : ${p.medical_risk_level}`);
    console.log("");
  });

  console.log("=======================================================");
  console.log("🎉 Phase 5.1 Production Audit Pilot Execution Completed");
  console.log("=======================================================");
}

runAuditPilot().catch(err => {
  console.error("❌ Audit Pilot Execution Error:", err);
  process.exit(1);
});
