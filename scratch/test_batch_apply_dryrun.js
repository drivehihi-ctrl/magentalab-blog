require('dotenv').config({ path: '.env.local' });

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL;
const WP_USER = process.env.WP_USER;
const WP_PASS = process.env.WORDPRESS_API_APP_PASSWORD || process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const WP_AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
const API_SECRET = process.env.AI_CONTENT_API_SECRET;
const PROD = 'https://www.magentalabblog.com/api/ai-content';
const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` };

async function testBatchApplyDryRun() {
  console.log("=============================================================");
  console.log("[Phase 5.4 Hardening Batch Apply Dry-Run Test]");
  console.log("=============================================================\n");

  // 1. Fetch post baseline (WP 6130)
  const wpRes = await fetch(`${WP_URL}/wp-json/wp/v2/posts/6130`, {
    headers: { 'Authorization': WP_AUTH }
  });
  const post = await wpRes.json();

  // 2. Create test revision
  const revRes = await fetch(`${PROD}/revisions`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      wordpress_id: 6130,
      content_id: '6130',
      slug: post.slug,
      language: 'ko',
      new_title: `[DryRun Hardening Test] ${post.title?.rendered}`,
      new_content: (post.content?.rendered || '') + "\n<!-- Ansim-i's Research Summary: DryRun test -->",
      new_excerpt: post.excerpt?.rendered || '',
      new_meta_description: '',
      reason: 'Hardening DryRun Test',
      source: 'dryrun_test'
    })
  });
  const revData = await revRes.json();
  const revId = revData.revision_id || revData.revision?.revision_id;
  console.log(`Created test revision: ${revId}`);

  // 3. Approve revision
  await fetch(`${PROD}/revisions/${revId}/review`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ decision: 'approve', confirm: true })
  });
  console.log(`Approved revision: ${revId}`);

  // 4. Run POST /revisions/apply-batch with dry_run: true
  console.log("\n--- Executing Batch Apply with dry_run: true ---");
  const batchRes = await fetch(`${PROD}/revisions/apply-batch`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      revision_ids: [revId],
      confirm: true,
      dry_run: true
    })
  });

  const batchData = await batchRes.json();
  console.log("HTTP Status:", batchRes.status);
  console.log("Response Body:", JSON.stringify(batchData, null, 2));

  // 5. Cleanup (reject test revision)
  await fetch(`${PROD}/revisions/${revId}/review`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ decision: 'reject', confirm: true })
  });
  console.log(`\nCleaned up revision ${revId} (status -> rejected)`);

  console.log("\n=============================================================");
  console.log("🎉 Dry-Run Test Completed Successfully!");
  console.log("=============================================================");
}

testBatchApplyDryRun().catch(e => {
  console.error("Test error:", e);
  process.exit(1);
});
