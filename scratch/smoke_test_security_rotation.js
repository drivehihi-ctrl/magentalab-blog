require('dotenv').config({ path: '.env.local' });

const PROD = 'https://www.magentalabblog.com/api/ai-content';
const API_SECRET = process.env.AI_CONTENT_API_SECRET;
const WP_URL = 'https://magentalab.mycafe24.com/wp-json/wp/v2';
const WP_AUTH = 'Basic ' + Buffer.from(`${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`).toString('base64');

if (!API_SECRET) {
  console.error('❌ AI_CONTENT_API_SECRET not found in .env.local');
  process.exit(1);
}

const authHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_SECRET}`
};

async function abort(step, status, body) {
  const preview = String(body).slice(0, 300);
  console.error(`\n❌ FAIL at [${step}]: HTTP ${status}`);
  console.error('Error body (first 300 chars):', preview);
  process.exit(1);
}

async function run() {
  console.log("====================================================");
  console.log("[Production Security Rotation Smoke Test]");
  console.log("====================================================\n");

  // ─── Step 1: GET review queue with new secret ─────────────────────
  console.log("--- Step 1: GET /revisions/review?status=pending_review ---");
  const queueRes = await fetch(`${PROD}/revisions/review?status=pending_review`, {
    headers: authHeaders
  });
  console.log(`HTTP Status: ${queueRes.status}`);
  console.log(`success: ${queueRes.ok}`);
  if (!queueRes.ok) await abort('Step1 GET queue', queueRes.status, await queueRes.text());
  await queueRes.text(); // consume body

  // ─── Step 2: Invalid token must return 401 AUTH_FAILED ────────────
  console.log("\n--- Step 2: Invalid Bearer → must get 401 AUTH_FAILED ---");
  const badRes = await fetch(`${PROD}/revisions/review?status=pending_review`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer invalid-bad-token-smoke-test-xyz'
    }
  });
  const badBody = await badRes.json();
  console.log(`HTTP Status: ${badRes.status}`);
  console.log(`error: ${badBody.error}`);
  if (badRes.status !== 401 || badBody.error !== 'AUTH_FAILED') {
    await abort('Step2 invalid token', badRes.status, JSON.stringify(badBody));
  }
  console.log("✅ 401 AUTH_FAILED confirmed with invalid token");

  // ─── Step 3: Pick safe test post (slug: cats-avoid-cameras-attention-tips, WP 5800) ──
  const TEST_WP_ID = 5800;
  const TEST_SLUG = 'cats-avoid-cameras-attention-tips';

  console.log(`\n--- Step 3: Fetch baseline WP Post ${TEST_WP_ID} ---`);
  const wpBase = await fetch(`${WP_URL}/posts/${TEST_WP_ID}`, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Authorization': WP_AUTH }
  });
  if (!wpBase.ok) await abort('Step3 WP fetch', wpBase.status, await wpBase.text());
  const basePost = await wpBase.json();
  console.log(`title: ${basePost.title?.rendered?.slice(0, 60)}`);
  console.log(`slug: ${basePost.slug}`);
  console.log(`featured_media: ${basePost.featured_media}`);
  console.log(`content length: ${(basePost.content?.rendered || '').length}`);

  if (basePost.slug !== TEST_SLUG) {
    await abort('Step3 slug check', 'N/A', `Expected ${TEST_SLUG} but got ${basePost.slug}`);
  }

  // ─── Step 4: Create Revision ──────────────────────────────────────
  console.log(`\n--- Step 4: POST /revisions (create test revision for WP ${TEST_WP_ID}) ---`);
  const revBody = {
    wordpress_id: TEST_WP_ID,
    content_id: String(TEST_WP_ID),
    slug: TEST_SLUG,
    language: 'ko',
    new_title: `[보안 로테이션 스모크 테스트] ${basePost.title?.rendered}`,
    new_content: (basePost.content?.rendered || '') + '\n<!-- Ansim-i\'s Research Summary: Security Rotation Smoke Test. No content change. -->',
    new_excerpt: basePost.excerpt?.rendered || '',
    new_meta_description: '',
    reason: 'Security Rotation Smoke Test',
    source: 'smoke_test'
  };

  const createRes = await fetch(`${PROD}/revisions`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(revBody)
  });
  const createData = await createRes.json();
  console.log(`HTTP Status: ${createRes.status}`);
  if (!createRes.ok) await abort('Step4 create revision', createRes.status, JSON.stringify(createData));

  const revisionId = createData.revision_id || createData.revision?.revision_id;
  console.log(`revision_id: ${revisionId}`);
  console.log(`status: ${createData.status || createData.revision?.status}`);

  if (!revisionId) await abort('Step4 revision_id missing', createRes.status, JSON.stringify(createData));

  // ─── Step 5: Human Review → Approve ──────────────────────────────
  console.log(`\n--- Step 5: POST /revisions/${revisionId}/review (approve) ---`);
  const approveRes = await fetch(`${PROD}/revisions/${revisionId}/review`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ decision: 'approve', action: 'approve', confirm: true })
  });
  const approveData = await approveRes.json();
  console.log(`HTTP Status: ${approveRes.status}`);
  if (!approveRes.ok) await abort('Step5 approve', approveRes.status, JSON.stringify(approveData));
  console.log(`revision_id: ${approveData.revision_id}`);
  console.log(`status: ${approveData.status}`);

  // ─── Step 6: Apply ────────────────────────────────────────────────
  console.log(`\n--- Step 6: POST /revisions/${revisionId}/apply ---`);
  const applyRes = await fetch(`${PROD}/revisions/${revisionId}/apply`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ confirm: true })
  });
  const applyRaw = await applyRes.text();
  console.log(`HTTP Status: ${applyRes.status}`);
  console.log(`Raw response (first 200 chars): ${applyRaw.slice(0, 200)}`);
  let applyData = {};
  try { applyData = JSON.parse(applyRaw); } catch {}
  if (!applyRes.ok) await abort('Step6 apply', applyRes.status, applyRaw);
  const backupId = applyData.backup_id;
  console.log(`revision_id: ${revisionId}`);
  console.log(`backup_id: ${backupId}`);
  console.log(`status: ${applyData.status}`);

  // ─── Step 7: Rollback ─────────────────────────────────────────────
  console.log(`\n--- Step 7: POST /revisions/${revisionId}/rollback ---`);
  const rollbackRes = await fetch(`${PROD}/revisions/${revisionId}/rollback`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ confirm: true })
  });
  const rollbackData = await rollbackRes.json();
  console.log(`HTTP Status: ${rollbackRes.status}`);
  if (!rollbackRes.ok) await abort('Step7 rollback', rollbackRes.status, JSON.stringify(rollbackData));
  console.log(`revision_id: ${revisionId}`);
  console.log(`status: ${rollbackData.status || 'rolled_back'}`);

  console.log("\n====================================================");
  console.log("🎉 Production Security Rotation Smoke Test PASSED");
  console.log("====================================================");
  console.log(`revision_id : ${revisionId}`);
  console.log(`backup_id   : ${backupId}`);
  console.log("Step1 GET queue     : ✅");
  console.log("Step2 Invalid token : ✅ 401 AUTH_FAILED");
  console.log("Step3 Baseline fetch: ✅");
  console.log("Step4 Create rev    : ✅");
  console.log("Step5 Approve       : ✅");
  console.log("Step6 Apply         : ✅");
  console.log("Step7 Rollback      : ✅");
}

run().catch(err => {
  console.error("❌ Fatal Error:", err.message);
  process.exit(1);
});
