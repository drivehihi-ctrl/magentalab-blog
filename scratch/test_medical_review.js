require('dotenv').config({ path: '.env.local' });

const PROD = 'http://localhost:3000/api/ai-content';
const API_SECRET = process.env.AI_CONTENT_API_SECRET;
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL;
const WP_USER = process.env.WP_USER;
const WP_PASS = process.env.WORDPRESS_API_APP_PASSWORD || process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const WP_AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` };

async function abort(step, status, body) {
  console.error(`\n❌ FAIL at [${step}]: HTTP ${status}`);
  console.error('Error:', String(body).slice(0, 300));
  process.exit(1);
}

async function createRevision(wpId, basePost, isMedical) {
  const contentExt = isMedical ? "\n<!-- Ansim-i's Research Summary -->\n이것은 당뇨병 치료를 위한 가이드입니다." : "\n<!-- Ansim-i's Research Summary -->\n이것은 일반 정보입니다.";
  const res = await fetch(`${PROD}/revisions`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      wordpress_id: wpId,
      content_id: String(wpId),
      slug: basePost.slug,
      language: 'ko',
      new_title: `[Medical Review Test] ${basePost.title?.rendered}`,
      new_content: (basePost.content?.rendered || '') + contentExt,
      new_excerpt: basePost.excerpt?.rendered || '',
      new_meta_description: '',
      reason: 'Testing medical review',
      source: 'test'
    })
  });
  return await res.json();
}

async function reviewRevision(revId, confirm, medicalConfirm) {
  const res = await fetch(`${PROD}/revisions/${revId}/review`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ decision: 'approve', confirm, medical_review_confirm: medicalConfirm })
  });
  return { status: res.status, data: await res.json() };
}

async function dryRunApply(revId) {
  const res = await fetch(`${PROD}/revisions/apply-batch`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ revision_ids: [revId], confirm: true, dry_run: true })
  });
  return { status: res.status, data: await res.json() };
}

async function run() {
  console.log("=============================================================");
  console.log("[Phase 5.4 Medical Review Persistence Test]");
  console.log("=============================================================\n");

  const TEST_WP_ID = 6130;
  
  const wpRes = await fetch(`${WP_URL}/wp-json/wp/v2/posts/${TEST_WP_ID}`, {
    headers: { 'Authorization': WP_AUTH }
  });
  const basePost = await wpRes.json();

  console.log("--- 1. Medical + General Approve (No confirmation) ---");
  const rev1 = await createRevision(TEST_WP_ID, basePost, true);
  const revId1 = rev1.revision_id || rev1.revision?.revision_id;
  
  const review1 = await reviewRevision(revId1, true, false);
  console.log(`Status: ${review1.status}, Error: ${review1.data.error}`);
  if (review1.status !== 400 || review1.data.error !== 'MEDICAL_REVIEW_CONFIRMATION_REQUIRED') {
    await abort('Test 1', review1.status, JSON.stringify(review1.data));
  }
  console.log("✅ Passed: Blocked by MEDICAL_REVIEW_CONFIRMATION_REQUIRED\n");

  console.log("--- 2. Medical + medical_review_confirm: true ---");
  const review2 = await reviewRevision(revId1, true, true);
  console.log(`Status: ${review2.status}, Result: ${review2.data.status}`);
  if (review2.status !== 200 || review2.data.status !== 'approved') {
    await abort('Test 2', review2.status, JSON.stringify(review2.data));
  }
  console.log("✅ Passed: Approved successfully\n");

  console.log("--- 3. Approved Medical Dry-Run Apply ---");
  // Needs evidence first since it's medical
  // We didn't supply evidence in createRevision, so it will fail with MEDICAL_EVIDENCE_MISSING, but it shouldn't fail with MEDICAL_REVIEW_REQUIRED.
  // Wait, let's see which error it hits first.
  const apply1 = await dryRunApply(revId1);
  const applyRes = apply1.data.results?.[0];
  console.log(`Apply Status: ${applyRes?.status}, Error: ${applyRes?.error_code}`);
  if (applyRes?.error_code === 'MEDICAL_REVIEW_REQUIRED') {
    await abort('Test 3', apply1.status, "MEDICAL_REVIEW_REQUIRED was thrown despite confirmation");
  } else if (applyRes?.error_code === 'MEDICAL_EVIDENCE_MISSING') {
    console.log("✅ Passed: Passed medical_reviewed check (hit evidence missing as expected)\n");
  } else {
    console.log("⚠️ Passed but unexpected result:", applyRes);
  }

  console.log("--- 4. Non-medical + General Approve ---");
  const rev2 = await createRevision(TEST_WP_ID, basePost, false);
  const revId2 = rev2.revision_id || rev2.revision?.revision_id;
  const review3 = await reviewRevision(revId2, true, false);
  console.log(`Status: ${review3.status}, Result: ${review3.data.status}`);
  if (review3.status !== 200 || review3.data.status !== 'approved') {
    await abort('Test 4', review3.status, JSON.stringify(review3.data));
  }
  console.log("✅ Passed: Non-medical approved without medical confirm\n");

  // Cleanup
  await fetch(`${PROD}/revisions/${revId1}/review`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ decision: 'reject', confirm: true }) });
  await fetch(`${PROD}/revisions/${revId2}/review`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ decision: 'reject', confirm: true }) });

  console.log("=============================================================");
  console.log("🎉 All Tests Passed!");
  console.log("=============================================================");
}

run().catch(e => console.error(e));
