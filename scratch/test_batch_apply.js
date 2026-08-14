require('dotenv').config({ path: '.env.local' });

const PROD = 'https://www.magentalabblog.com/api/ai-content';
const API_SECRET = process.env.AI_CONTENT_API_SECRET;
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL;
const WP_USER = process.env.WORDPRESS_API_USERNAME || process.env.WP_USER;
const WP_PASS = process.env.WORDPRESS_API_APP_PASSWORD || process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const WP_AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` };

async function abort(step, status, body) {
  console.error(`\n❌ FAIL at [${step}]: HTTP ${status}`);
  console.error('Error:', String(body).slice(0, 300));
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────────

async function createTestRevision(wpId, basePost) {
  const res = await fetch(`${PROD}/revisions`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      wordpress_id: wpId,
      content_id: String(wpId),
      slug: basePost.slug,
      language: 'ko',
      new_title: `[Batch Apply 테스트] ${basePost.title?.rendered || ''}`,
      new_content: (basePost.content?.rendered || '') + "\n<!-- Ansim-i's Research Summary: Batch Apply smoke test. No content change. -->",
      new_excerpt: basePost.excerpt?.rendered || '',
      new_meta_description: '',
      reason: 'Phase 5.4 Batch Apply smoke test',
      source: 'smoke_test'
    })
  });
  return res;
}

async function approveRevision(revisionId) {
  return fetch(`${PROD}/revisions/${revisionId}/review`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ decision: 'approve', action: 'approve', confirm: true })
  });
}

async function rollbackRevision(revisionId) {
  return fetch(`${PROD}/revisions/${revisionId}/rollback`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ confirm: true })
  });
}

// ── Main Test ─────────────────────────────────────────────────────────────

async function run() {
  console.log("=============================================================");
  console.log("[Phase 5.4 Batch Apply Smoke Test — Production]");
  console.log("=============================================================\n");

  const TEST_WP_ID = 6130;

  // ── Step 1: Fetch baseline ───────────────────────────────────────────────
  console.log(`--- Step 1: Fetch WP ${TEST_WP_ID} baseline ---`);
  const wpRes = await fetch(`${WP_URL}/wp-json/wp/v2/posts/${TEST_WP_ID}`, {
    headers: { 'Authorization': WP_AUTH, 'User-Agent': 'MagentaLab-AI-Content/1.0' }
  });
  if (!wpRes.ok) await abort('Step1 WP fetch', wpRes.status, await wpRes.text());
  const basePost = await wpRes.json();
  console.log(`  slug: ${basePost.slug}`);
  console.log(`  featured_media: ${basePost.featured_media}`);
  console.log(`  status: ${basePost.status}`);
  const originalSlug = basePost.slug;
  const originalFeaturedMedia = basePost.featured_media;
  const originalStatus = basePost.status;

  // ── Step 2: Create 2 test revisions ──────────────────────────────────────
  console.log(`\n--- Step 2: Create 2 test revisions for WP ${TEST_WP_ID} ---`);
  const r1Res = await createTestRevision(TEST_WP_ID, basePost);
  const r1Data = await r1Res.json();
  if (!r1Res.ok) await abort('Step2a create rev1', r1Res.status, JSON.stringify(r1Data));
  const rev1Id = r1Data.revision_id || r1Data.revision?.revision_id;
  console.log(`  revision 1: ${rev1Id} (status: ${r1Data.status || r1Data.revision?.status})`);

  // ── Need to refetch base post since modified_at may have changed
  const wpRes2 = await fetch(`${WP_URL}/wp-json/wp/v2/posts/${TEST_WP_ID}`, {
    headers: { 'Authorization': WP_AUTH, 'User-Agent': 'MagentaLab-AI-Content/1.0' }
  });
  const basePost2 = await wpRes2.json();

  const r2Res = await createTestRevision(TEST_WP_ID, basePost2);
  const r2Data = await r2Res.json();
  if (!r2Res.ok) await abort('Step2b create rev2', r2Res.status, JSON.stringify(r2Data));
  const rev2Id = r2Data.revision_id || r2Data.revision?.revision_id;
  console.log(`  revision 2: ${rev2Id} (status: ${r2Data.status || r2Data.revision?.status})`);

  // ── Step 3: Approve both ─────────────────────────────────────────────────
  console.log(`\n--- Step 3: Approve both revisions ---`);
  const a1Res = await approveRevision(rev1Id);
  const a1Data = await a1Res.json();
  if (!a1Res.ok) await abort('Step3a approve rev1', a1Res.status, JSON.stringify(a1Data));
  console.log(`  ${rev1Id}: ${a1Data.status}`);

  const a2Res = await approveRevision(rev2Id);
  const a2Data = await a2Res.json();
  if (!a2Res.ok) await abort('Step3b approve rev2', a2Res.status, JSON.stringify(a2Data));
  console.log(`  ${rev2Id}: ${a2Data.status}`);

  // ── Step 4: dry-run batch apply ───────────────────────────────────────────
  console.log(`\n--- Step 4: POST /revisions/apply-batch (dry_run: true) ---`);
  const dryRes = await fetch(`${PROD}/revisions/apply-batch`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ revision_ids: [rev1Id, rev2Id], confirm: true, dry_run: true })
  });
  const dryData = await dryRes.json();
  console.log(`  HTTP Status: ${dryRes.status}`);
  if (!dryRes.ok) await abort('Step4 dry-run', dryRes.status, JSON.stringify(dryData));
  console.log(`  request_id: ${dryData.request_id}`);
  console.log(`  applied: ${dryData.applied}, failed: ${dryData.failed}, stopped_on_error: ${dryData.stopped_on_error}`);
  console.log(`  dry_run: ${dryData.dry_run}`);
  dryData.results?.forEach(r => console.log(`    ${r.revision_id}: ${r.status} (backup: ${r.backup_id})`));

  // ── Step 5: Real batch apply (1 item only) ───────────────────────────────
  console.log(`\n--- Step 5: POST /revisions/apply-batch (apply 1 item) ---`);
  const batchRes = await fetch(`${PROD}/revisions/apply-batch`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ revision_ids: [rev1Id], confirm: true })
  });
  const batchData = await batchRes.json();
  const batchRaw = JSON.stringify(batchData).slice(0, 200);
  console.log(`  HTTP Status: ${batchRes.status}`);
  console.log(`  Raw (200 chars): ${batchRaw}`);
  if (!batchRes.ok) await abort('Step5 batch apply', batchRes.status, JSON.stringify(batchData));

  const appliedRev = batchData.results?.[0];
  const backupId = appliedRev?.backup_id;
  console.log(`  request_id: ${batchData.request_id}`);
  console.log(`  applied: ${batchData.applied}, failed: ${batchData.failed}`);
  console.log(`  revision: ${appliedRev?.revision_id}, status: ${appliedRev?.status}, backup_id: ${backupId}`);

  // ── Step 6: Verify immutable fields unchanged ─────────────────────────────
  console.log(`\n--- Step 6: Verify slug/status/featured_media unchanged after Apply ---`);
  const wpAfterRes = await fetch(`${WP_URL}/wp-json/wp/v2/posts/${TEST_WP_ID}`, {
    headers: { 'Authorization': WP_AUTH, 'User-Agent': 'MagentaLab-AI-Content/1.0' }
  });
  const afterPost = await wpAfterRes.json();
  console.log(`  slug:           ${afterPost.slug} (was: ${originalSlug}) ${afterPost.slug === originalSlug ? '✅' : '❌ CHANGED'}`);
  console.log(`  featured_media: ${afterPost.featured_media} (was: ${originalFeaturedMedia}) ${afterPost.featured_media === originalFeaturedMedia ? '✅' : '❌ CHANGED'}`);
  console.log(`  status:         ${afterPost.status} (was: ${originalStatus}) ${afterPost.status === originalStatus ? '✅' : '❌ CHANGED'}`);

  if (afterPost.slug !== originalSlug || afterPost.featured_media !== originalFeaturedMedia || afterPost.status !== originalStatus) {
    await abort('Step6 immutable check', 'FAIL', 'Immutable field changed!');
  }

  // ── Step 7: Rollback ─────────────────────────────────────────────────────
  console.log(`\n--- Step 7: Rollback ${rev1Id} ---`);
  const rbRes = await rollbackRevision(rev1Id);
  const rbData = await rbRes.json();
  console.log(`  HTTP Status: ${rbRes.status}`);
  if (!rbRes.ok) await abort('Step7 rollback', rbRes.status, JSON.stringify(rbData));
  console.log(`  ${rev1Id}: rolled_back ✅`);

  // ── Step 8: Error-stop test (4 items) ────────────────────────────────────
  console.log(`\n--- Step 8: Validate BATCH_LIMIT_EXCEEDED (4 items) ---`);
  const limitRes = await fetch(`${PROD}/revisions/apply-batch`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ revision_ids: ['a', 'b', 'c', 'd'], confirm: true })
  });
  const limitData = await limitRes.json();
  console.log(`  HTTP Status: ${limitRes.status}`);
  console.log(`  error: ${limitData.error}`);
  if (limitRes.status !== 400 || limitData.error !== 'BATCH_LIMIT_EXCEEDED') {
    await abort('Step8 limit check', limitRes.status, JSON.stringify(limitData));
  }
  console.log(`  ✅ BATCH_LIMIT_EXCEEDED confirmed`);

  // ── Step 9: Reject rev2 (clean up) ───────────────────────────────────────
  console.log(`\n--- Step 9: Reject rev2 ${rev2Id} (cleanup) ---`);
  const rejRes = await fetch(`${PROD}/revisions/${rev2Id}/review`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ decision: 'reject', confirm: true })
  });
  const rejData = await rejRes.json();
  console.log(`  HTTP Status: ${rejRes.status}, status: ${rejData.status}`);

  console.log("\n=============================================================");
  console.log("🎉 Phase 5.4 Batch Apply Smoke Test PASSED");
  console.log("=============================================================");
  console.log(`  request_id  : ${batchData.request_id}`);
  console.log(`  revision_id : ${rev1Id}`);
  console.log(`  backup_id   : ${backupId}`);
  console.log("  Step4 dry-run           : ✅");
  console.log("  Step5 batch apply (1)   : ✅");
  console.log("  Step6 immutable fields  : ✅ slug/status/media unchanged");
  console.log("  Step7 rollback          : ✅");
  console.log("  Step8 limit enforced    : ✅ BATCH_LIMIT_EXCEEDED");
}

run().catch(err => {
  console.error("❌ Fatal:", err.message);
  process.exit(1);
});
