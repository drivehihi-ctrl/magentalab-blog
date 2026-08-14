require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const PROD = 'https://www.magentalabblog.com/api/ai-content';
const API_SECRET = process.env.AI_CONTENT_API_SECRET;
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL;
const WP_USER = process.env.WP_USER;
const WP_PASS = process.env.WORDPRESS_API_APP_PASSWORD || process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const WP_AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` };

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fetchWP(wpId) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts/${wpId}?context=edit`, {
    headers: { 'Authorization': WP_AUTH }
  });
  return await res.json();
}

function compareWP(original, current) {
  const diffs = [];
  ['title.raw', 'content.raw', 'excerpt.raw', 'slug', 'status', 'featured_media'].forEach(key => {
    const parts = key.split('.');
    const getVal = (obj) => parts.reduce((o, k) => (o || {})[k], obj);
    if (getVal(original) !== getVal(current)) diffs.push(key);
  });
  const origCat = JSON.stringify(original.categories || []);
  const curCat = JSON.stringify(current.categories || []);
  if (origCat !== curCat) diffs.push('categories');
  const origTags = JSON.stringify(original.tags || []);
  const curTags = JSON.stringify(current.tags || []);
  if (origTags !== curTags) diffs.push('tags');
  return diffs;
}

async function run() {
  const TEST_WP_ID = 5800;
  console.log(`Starting Phase 5.4 Positive Path Verification for WP ID: ${TEST_WP_ID}\n`);

  const wpBefore = await fetchWP(TEST_WP_ID);
  
  // 1. Create Medical Revision WITH Evidence
  console.log('Creating Test Medical Revision with Evidence...');
  const createRes = await fetch(`${PROD}/revisions`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      wordpress_id: TEST_WP_ID,
      content_id: String(TEST_WP_ID),
      slug: wpBefore.slug,
      language: 'ko',
      new_title: `[Test Positive] ${wpBefore.title?.raw}`,
      new_content: (wpBefore.content?.raw || '') + '\n<!-- Research Summary -->\n[근거]\n근거 해설: 당뇨 약물 투여 시 주의점\n주의사항: 반드시 수의사 상담 필요\n- AAHA Guidelines on Diabetes Management https://example.com/aaha-diabetes',
      new_excerpt: wpBefore.excerpt?.raw || '',
      reason: 'Testing positive path',
      source: 'test'
    })
  });
  const revData = await createRes.json();
  const revId = revData.revision_id || revData.revision?.revision_id;
  console.log(`Created Revision: ${revId}\n`);
  
  if (!revId) throw new Error("Failed to create revision: " + JSON.stringify(revData));

  // 2. Approve with medical_review_confirm
  console.log('Approving Revision...');
  const res2 = await fetch(`${PROD}/revisions/${revId}/review`, {
    method: 'POST', headers: authHeaders,
    body: JSON.stringify({ decision: 'approve', confirm: true, medical_review_confirm: true })
  });
  const body2 = await res2.json();
  
  // 3. Verify Supabase State
  console.log('Verifying Supabase state...');
  const supRev = await supabase.from('ai_revisions').select('status, medical_reviewed, evidence').eq('revision_id', revId).single();
  const isApproved = supRev.data.status === 'approved';
  const isMedicalReviewed = supRev.data.medical_reviewed === true;
  const hasEvidence = supRev.data.evidence && supRev.data.evidence.references?.length > 0;
  console.log(`status=approved: ${isApproved}, medical_reviewed=true: ${isMedicalReviewed}, evidence=exists: ${hasEvidence}\n`);

  if (!isApproved || !isMedicalReviewed || !hasEvidence) {
      throw new Error(`Pre-condition failed. State: ${JSON.stringify(supRev.data)}`);
  }

  // 4. Controlled Batch Apply (dry_run: true)
  console.log('Running dry_run Apply...');
  const res3 = await fetch(`${PROD}/revisions/apply-batch`, {
    method: 'POST', headers: authHeaders,
    body: JSON.stringify({ revision_ids: [revId], confirm: true, dry_run: true })
  });
  const applyHttp = res3.status;
  const applyBody = await res3.json();
  
  console.log(`Apply HTTP: ${applyHttp}`);
  console.log(`dry_run: ${applyBody.dry_run}`);
  console.log(`attempted: ${applyBody.attempted}`);
  console.log(`applied: ${applyBody.applied}`);
  console.log(`failed: ${applyBody.failed}`);
  console.log(`stopped_on_error: ${applyBody.stopped_on_error}`);
  console.log(`backup_id: ${applyBody.results?.[0]?.backup_id || 'none'}\n`);

  // 5. Compare WP
  console.log('Verifying WP unchanged...');
  const wpAfter = await fetchWP(TEST_WP_ID);
  const diffs = compareWP(wpBefore, wpAfter);
  const wpUnchanged = diffs.length === 0;
  console.log(`WP unchanged: ${wpUnchanged} (diffs: ${diffs.join(', ') || 'none'})\n`);

  // 6. Audit Logs
  const logs = await supabase.from('ai_audit_logs').select('action').order('timestamp', { ascending: false }).limit(20);
  const actions = logs.data.map(l => l.action);
  const hasBatchStarted = actions.includes('BATCH_APPLY_STARTED');
  const hasBatchCompleted = actions.includes('BATCH_APPLY_COMPLETED');
  
  console.log(`Audit log BATCH_APPLY_STARTED: ${hasBatchStarted}`);
  console.log(`Audit log BATCH_APPLY_COMPLETED: ${hasBatchCompleted}\n`);

  console.log('--- TEST PASS/FAIL ---');
  if (
    applyHttp === 200 &&
    applyBody.dry_run === true &&
    applyBody.attempted === 1 &&
    applyBody.applied === 1 &&
    applyBody.failed === 0 &&
    applyBody.stopped_on_error === false &&
    applyBody.results?.[0]?.backup_id === 'dry-run' &&
    wpUnchanged &&
    hasBatchStarted &&
    hasBatchCompleted
  ) {
      console.log('✅ ALL POSITIVE PATH TESTS PASSED!');
  } else {
      console.log('❌ SOME TESTS FAILED.');
      if (applyBody.results?.[0]?.error_code) {
          console.error("Apply Error:", applyBody.results?.[0]?.error_code, applyBody.results?.[0]?.message);
      }
  }
}
run().catch(console.error);
