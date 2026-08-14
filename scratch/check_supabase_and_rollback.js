require('dotenv').config({ path: '.env.local' });

const PROD_BASE_URL = 'https://www.magentalabblog.com/api/ai-content';
const API_SECRET = process.env.AI_CONTENT_API_SECRET || 'magentalab-ai-secret-key-1234';

async function runEmergencyRollback6090() {
  console.log("=======================================================");
  console.log("[Emergency Rollback Execution for WP ID 6090]");
  console.log("=======================================================");

  const revId = 'rev_8ffe87563758e903';
  const expectedBackupId = 'bak_ccafbcac901a9594';

  // Step 1: Check Revision via Production GET endpoint or Supabase
  console.log(`\n[STEP 1] Checking revision ${revId} status on Production...`);
  const revRes = await fetch(`${PROD_BASE_URL}/revisions`, {
    headers: { 'Authorization': `Bearer ${API_SECRET}` }
  });

  let revItem = null;
  if (revRes.ok) {
    const revData = await revRes.json();
    const list = revData.revisions || revData || [];
    revItem = list.find(r => r.revision_id === revId);
  }

  if (revItem) {
    console.log(`Found Revision ${revId}:`);
    console.log(`  - status: ${revItem.status}`);
    console.log(`  - wordpress_id: ${revItem.wordpress_id}`);
  } else {
    console.log(`Revision ${revId} check response HTTP: ${revRes.status}`);
  }

  // Step 2: Trigger Rollback via Production Endpoint ONLY
  console.log(`\n[STEP 2] Sending POST Rollback to Production Endpoint...`);
  const rollbackUrl = `${PROD_BASE_URL}/revisions/${revId}/rollback`;
  const rollbackRes = await fetch(rollbackUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: JSON.stringify({ confirm: true })
  });

  const rollbackStatus = rollbackRes.status;
  const rollbackRawText = await rollbackRes.text();

  console.log(`Rollback HTTP Status: ${rollbackStatus}`);
  console.log("Raw Rollback Response Body:");
  console.log(rollbackRawText);

  if (!rollbackRes.ok) {
    console.error(`\n❌ Emergency Rollback Failed with HTTP ${rollbackStatus}! Stopping execution immediately.`);
    process.exit(1);
  }

  // Step 3: Verify WP Post 6090 via WordPress REST API
  console.log(`\n[STEP 3] Fetching restored WP Post 6090 from WordPress REST API...`);
  const wpUrl = 'https://magentalab.mycafe24.com/wp-json/wp/v2/posts/6090';
  const wpRes = await fetch(wpUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });

  if (!wpRes.ok) {
    console.error(`❌ Failed to fetch WP Post 6090 after rollback: HTTP ${wpRes.status}`);
    process.exit(1);
  }

  const wpPost = await wpRes.json();

  const title = wpPost.title?.rendered || '';
  const slug = wpPost.slug || '';
  const featured_media = wpPost.featured_media;
  const content = wpPost.content?.rendered || '';
  const excerpt = wpPost.excerpt?.rendered || '';
  const status = wpPost.status;

  console.log("\n=======================================================");
  console.log("WP 6090 REST VERIFICATION OUTPUT:");
  console.log("=======================================================");
  console.log(`- title          : ${title}`);
  console.log(`- slug           : ${slug}`);
  console.log(`- featured_media : ${featured_media}`);
  console.log(`- content length : ${content.length} characters`);
  console.log(`- excerpt        : ${excerpt.replace(/<[^>]+>/g, '').trim()}`);
  console.log(`- publish status : ${status}`);
  console.log("=======================================================");

  // Validation checks
  const isTitleValid = !title.includes('테스트') && !title.includes('Test');
  const isSlugValid = slug === '5-common-puppy-owner-mistakes';
  const isMediaValid = Number(featured_media) === 6091;
  const isContentLong = content.length > 1000;
  const isStatusPublish = status === 'publish';

  if (isTitleValid && isSlugValid && isMediaValid && isContentLong && isStatusPublish) {
    console.log("\n🎉 ALL ROLLBACK VERIFICATION CHECKS PASSED SUCCESSFULLY!");
  } else {
    console.warn("\n⚠️ Verification notice:");
    console.log(`  title valid       : ${isTitleValid}`);
    console.log(`  slug valid        : ${isSlugValid}`);
    console.log(`  featured_media    : ${isMediaValid} (expected 6091, got ${featured_media})`);
    console.log(`  content long      : ${isContentLong} (length: ${content.length})`);
    console.log(`  status publish    : ${isStatusPublish}`);
  }
}

runEmergencyRollback6090().catch(err => {
  console.error("❌ Fatal Error:", err.message);
  process.exit(1);
});
