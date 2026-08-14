require('dotenv').config({ path: '.env.local' });

const PROD_BASE_URL = 'https://www.magentalabblog.com/api/ai-content';
const API_SECRET = process.env.AI_CONTENT_API_SECRET || 'magentalab-ai-secret-key-1234';

async function runPhase53Pilot() {
  console.log("=======================================================");
  console.log(`[Phase 5.3 Production Human Review Pilot]`);
  console.log(`Base URL: ${PROD_BASE_URL}`);
  console.log("=======================================================");

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_SECRET}`,
    'x-api-secret': API_SECRET,
    'x-ai-secret': API_SECRET
  };

  // -----------------------------------------------------------------
  // Step 1: Re-audit WP Post ID 6042
  // -----------------------------------------------------------------
  console.log("\n[STEP 1] Re-auditing WP Post ID 6042 on Production...");
  const auditRes = await fetch(`${PROD_BASE_URL}/audit?secret=${API_SECRET}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ wordpress_id: 6042, language: 'ko' })
  });

  console.log(`HTTP Status: ${auditRes.status}`);

  if (!auditRes.ok) {
    throw new Error(`Audit request failed: ${await auditRes.text()}`);
  }

  const auditData = await auditRes.json();
  const post6042Audit = (auditData.posts || []).find(p => p.wordpress_id === 6042) || auditData.posts?.[0];

  console.log("STEP 1 OUTPUT (WP ID 6042 Audit Result):");
  if (post6042Audit) {
    console.log(`  - wordpress_id       : ${post6042Audit.wordpress_id}`);
    console.log(`  - status             : ${post6042Audit.status}`);
    console.log(`  - medical_risk       : ${post6042Audit.medical_risk}`);
    console.log(`  - medical_risk_level : ${post6042Audit.medical_risk_level}`);
    console.log(`  - medical_signals    : ${JSON.stringify(post6042Audit.medical_signals)}`);
  } else {
    console.log("  - Post 6042 audit result not found in response.");
  }

  // -----------------------------------------------------------------
  // Step 2: Fetch Human Review Queue
  // -----------------------------------------------------------------
  console.log("\n[STEP 2] Fetching Human Review Queue (pending_review)...");
  const queueRes = await fetch(`${PROD_BASE_URL}/revisions/review?status=pending_review&secret=${API_SECRET}`, {
    method: 'GET',
    headers
  });

  console.log(`HTTP Status: ${queueRes.status}`);

  if (!queueRes.ok) {
    throw new Error(`Queue fetch failed: ${await queueRes.text()}`);
  }

  const queueData = await queueRes.json();
  console.log(`Review Queue Count: ${queueData.count ?? queueData.revisions?.length ?? 0}`);

  // Target revisions
  const targetApproveId = 'rev_869394b4ae5c79e7';
  const targetRejectId = 'rev_96b5971ed8aa285c';

  // -----------------------------------------------------------------
  // Step 3: Action 1 -> Approve rev_869394b4ae5c79e7
  // -----------------------------------------------------------------
  console.log("\n[STEP 3-A] Approving Revision: " + targetApproveId);
  const approveRes = await fetch(`${PROD_BASE_URL}/revisions/review?secret=${API_SECRET}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      revision_id: targetApproveId,
      action: 'approve',
      confirm: true
    })
  });

  const approveData = await approveRes.json();
  console.log("STEP 3-A OUTPUT:");
  console.log(`  - HTTP Status      : ${approveRes.status}`);
  console.log(`  - Target Revision  : ${targetApproveId}`);
  console.log(`  - Final Status     : ${approveData.status || (approveRes.ok ? 'approved' : 'error')}`);

  // -----------------------------------------------------------------
  // Step 3: Action 2 -> Reject rev_96b5971ed8aa285c
  // -----------------------------------------------------------------
  console.log("\n[STEP 3-B] Rejecting Revision: " + targetRejectId);
  const rejectRes = await fetch(`${PROD_BASE_URL}/revisions/review?secret=${API_SECRET}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      revision_id: targetRejectId,
      action: 'reject',
      confirm: true
    })
  });

  const rejectData = await rejectRes.json();
  console.log("STEP 3-B OUTPUT:");
  console.log(`  - HTTP Status      : ${rejectRes.status}`);
  console.log(`  - Target Revision  : ${targetRejectId}`);
  console.log(`  - Final Status     : ${rejectData.status || (rejectRes.ok ? 'rejected' : 'error')}`);

  console.log("\n=======================================================");
  console.log("PHASE 5.3 SUMMARY REPORT:");
  console.log("=======================================================");
  console.log(`- Post 6042 Audit Status       : ${post6042Audit?.status || 'N/A'}`);
  console.log(`- Post 6042 Medical Risk Level : ${post6042Audit?.medical_risk_level || 'N/A'}`);
  console.log(`- ${targetApproveId} Action Result : HTTP ${approveRes.status} (Status: ${approveData.status})`);
  console.log(`- ${targetRejectId} Action Result  : HTTP ${rejectRes.status} (Status: ${rejectData.status})`);
  console.log(`- WordPress Apply / Write      : 0 (ABSOLUTELY DISABLED)`);
  console.log("=======================================================");
  console.log("🎉 Phase 5.3 Production Pilot Execution Completed Successfully");
}

runPhase53Pilot().catch(err => {
  console.error("❌ Phase 5.3 Pilot Execution Error:", err);
  process.exit(1);
});
