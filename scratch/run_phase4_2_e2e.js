require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3000/api/ai-content';
const API_SECRET = process.env.AI_CONTENT_API_SECRET;
const WP_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://magentalab.mycafe24.com') + '/wp-json/wp/v2';
const user = process.env.WP_USER;
const pass = process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD;
const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

function sanitizeForSeo(html, maxLen = 160) {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? text.slice(0, maxLen) : text;
}

// Mask secrets from logs
function sanitizeOutput(obj) {
  const str = JSON.stringify(obj, null, 2);
  return str.replace(/Bearer [A-Za-z0-9_-]+/g, 'Bearer [REDACTED]')
            .replace(/Basic [A-Za-z0-9+/=]+/g, 'Basic [REDACTED]');
}

async function waitForServer(maxRetries = 10) {
  console.log("Waiting for Next.js server on localhost:3000...");
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch('http://localhost:3000/api/search?q=test');
      if (res.status === 200) {
        console.log("Next.js dev server is ready!");
        return true;
      }
    } catch (e) {
      // not ready yet
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error("Timeout waiting for localhost:3000 server.");
}

async function fetchWPPost(postId) {
  const res = await fetch(`${WP_URL}/posts/${postId}?context=edit`, {
    headers: { 'Authorization': auth }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch WP post ${postId}: ${res.status} ${await res.text()}`);
  }
  return await res.json();
}

async function runE2E() {
  await waitForServer();

  const postId = 5885; // General non-medical post (강아지 고양이 거울 반응 차이)
  console.log("\n=======================================================");
  console.log(`[PRE-FLIGHT] Fetching Baseline WP Post ID: ${postId}`);
  console.log("=======================================================");

  const originalPost = await fetchWPPost(postId);

  const baseline = {
    wordpress_id: originalPost.id,
    slug: originalPost.slug,
    title_raw: originalPost.title?.raw || originalPost.title?.rendered,
    content_raw: originalPost.content?.raw || originalPost.content?.rendered,
    excerpt_raw: originalPost.excerpt?.raw || originalPost.excerpt?.rendered,
    meta_description: sanitizeForSeo(originalPost.excerpt?.rendered, 160),
    featured_media: originalPost.featured_media,
    categories: originalPost.categories,
    tags: originalPost.tags,
    status: originalPost.status
  };

  console.log(`Baseline Post Selected:`);
  console.log(`- ID: ${baseline.wordpress_id}`);
  console.log(`- Title: ${baseline.title_raw}`);
  console.log(`- Slug: ${baseline.slug}`);
  console.log(`- Status: ${baseline.status}`);
  console.log(`- Categories: ${JSON.stringify(baseline.categories)}`);
  console.log(`- Featured Media: ${baseline.featured_media}`);

  // -----------------------------------------------------------------
  // 1. Create Revision
  // -----------------------------------------------------------------
  console.log("\n=======================================================");
  console.log("[STEP 1] Creating Revision");
  console.log("=======================================================");

  const testSuffix = "\n\n<!-- Phase 4.2 Production E2E Test (Ansim-i's Research Summary) -->";
  const newTitle = baseline.title_raw + " [E2E Test]";
  const newContent = baseline.content_raw + testSuffix;

  const createRes = await fetch(`${API_BASE}/revisions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: JSON.stringify({
      wordpress_id: baseline.wordpress_id,
      new_title: newTitle,
      new_content: newContent,
      new_excerpt: baseline.excerpt_raw,
      reason: "Phase 4.2 Production E2E Verification",
      source: "e2e_runner"
    })
  });

  const createData = await createRes.json();
  const revisionId = createData.revision_id;

  console.log("STEP 1 OUTPUT:");
  console.log(`- revision_id: ${revisionId || 'N/A'}`);
  console.log(`- wordpress_id: ${createData.wordpress_id || baseline.wordpress_id}`);
  console.log(`- status: ${createData.status || createRes.status}`);
  console.log(`- API Response:\n${sanitizeOutput(createData)}`);

  if (!createRes.ok || !revisionId) {
    throw new Error(`Revision creation failed! ${JSON.stringify(createData)}`);
  }

  // -----------------------------------------------------------------
  // 2. Preview / Diff Verification (GET Method)
  // -----------------------------------------------------------------
  console.log("\n=======================================================");
  console.log("[STEP 2] Preview & Diff Check");
  console.log("=======================================================");

  const diffRes = await fetch(`${API_BASE}/revisions/${revisionId}/diff`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_SECRET}`
    }
  });

  const diffData = await diffRes.json();

  console.log("STEP 2 OUTPUT:");
  console.log(`- revision_id: ${revisionId}`);
  console.log(`- wordpress_id: ${baseline.wordpress_id}`);
  console.log(`- status: ${diffRes.ok ? 'preview_ready' : 'error'}`);
  console.log(`- API Response:\n${sanitizeOutput(diffData)}`);

  if (!diffRes.ok) {
    throw new Error(`Diff check failed! ${JSON.stringify(diffData)}`);
  }

  // -----------------------------------------------------------------
  // 3. Apply Revision
  // -----------------------------------------------------------------
  console.log("\n=======================================================");
  console.log("[STEP 3] Applying Revision");
  console.log("=======================================================");

  const applyRes = await fetch(`${API_BASE}/revisions/${revisionId}/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: JSON.stringify({ confirm: true })
  });

  const applyData = await applyRes.json();
  const backupId = applyData.backup_id;

  console.log("STEP 3 OUTPUT:");
  console.log(`- revision_id: ${revisionId}`);
  console.log(`- wordpress_id: ${baseline.wordpress_id}`);
  console.log(`- backup_id: ${backupId || 'N/A'}`);
  console.log(`- status: ${applyData.success ? 'applied' : 'error'}`);
  console.log(`- API Response:\n${sanitizeOutput(applyData)}`);

  if (!applyRes.ok || !applyData.success) {
    throw new Error(`Apply failed! ${JSON.stringify(applyData)}`);
  }

  // -----------------------------------------------------------------
  // 4. Rollback Revision
  // -----------------------------------------------------------------
  console.log("\n=======================================================");
  console.log("[STEP 4] Rolling Back Revision");
  console.log("=======================================================");

  const rollbackRes = await fetch(`${API_BASE}/revisions/${revisionId}/rollback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: JSON.stringify({ confirm: true })
  });

  const rollbackData = await rollbackRes.json();

  console.log("STEP 4 OUTPUT:");
  console.log(`- revision_id: ${revisionId}`);
  console.log(`- wordpress_id: ${baseline.wordpress_id}`);
  console.log(`- backup_id: ${backupId || 'N/A'}`);
  console.log(`- status: ${rollbackData.success ? 'rolled_back' : 'error'}`);
  console.log(`- API Response:\n${sanitizeOutput(rollbackData)}`);

  if (!rollbackRes.ok || !rollbackData.success) {
    throw new Error(`Rollback failed! ${JSON.stringify(rollbackData)}`);
  }

  // -----------------------------------------------------------------
  // 5. Verification & Comparison (Byte-level & Semantic)
  // -----------------------------------------------------------------
  console.log("\n=======================================================");
  console.log("[STEP 5] Verification & Restoration Comparison");
  console.log("=======================================================");

  const restoredPost = await fetchWPPost(postId);

  const restored = {
    wordpress_id: restoredPost.id,
    slug: restoredPost.slug,
    title_raw: restoredPost.title?.raw || restoredPost.title?.rendered,
    content_raw: restoredPost.content?.raw || restoredPost.content?.rendered,
    excerpt_raw: restoredPost.excerpt?.raw || restoredPost.excerpt?.rendered,
    meta_description: sanitizeForSeo(restoredPost.excerpt?.rendered, 160),
    featured_media: restoredPost.featured_media,
    categories: restoredPost.categories,
    tags: restoredPost.tags,
    status: restoredPost.status
  };

  function compareField(name, origVal, restVal) {
    const origStr = String(origVal);
    const restStr = String(restVal);
    const byteMatch = Buffer.from(origStr).equals(Buffer.from(restStr));
    const exactMatch = origStr === restStr;

    console.log(`\n--- [Field: ${name}] ---`);
    console.log(`Original Length : ${origStr.length} chars / ${Buffer.byteLength(origStr)} bytes`);
    console.log(`Restored Length : ${restStr.length} chars / ${Buffer.byteLength(restStr)} bytes`);
    console.log(`Exact Match     : ${exactMatch ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Byte-level Match: ${byteMatch ? '✅ PASSED' : '❌ FAILED'}`);

    if (!exactMatch) {
      console.log(`Diff: Original="${origStr.substring(0, 100)}..." vs Restored="${restStr.substring(0, 100)}..."`);
    }

    return exactMatch && byteMatch;
  }

  const titleMatch = compareField("Title", baseline.title_raw, restored.title_raw);
  const contentMatch = compareField("Content (Raw DB Level)", baseline.content_raw, restored.content_raw);
  const excerptMatch = compareField("Excerpt", baseline.excerpt_raw, restored.excerpt_raw);
  const metaDescMatch = compareField("Meta Description", baseline.meta_description, restored.meta_description);
  const slugMatch = compareField("Slug", baseline.slug, restored.slug);

  const metadataPreserved = (
    baseline.featured_media === restored.featured_media &&
    JSON.stringify(baseline.categories) === JSON.stringify(restored.categories) &&
    JSON.stringify(baseline.tags) === JSON.stringify(restored.tags) &&
    baseline.status === restored.status
  );

  console.log("\n=======================================================");
  console.log("FINAL VERIFICATION SUMMARY:");
  console.log("=======================================================");
  console.log(`- Title Restoration (Byte-level)           : ${titleMatch ? '✅ EXACT MATCH' : '❌ MISMATCH'}`);
  console.log(`- Content Restoration (Byte-level Raw DB)   : ${contentMatch ? '✅ EXACT MATCH' : '❌ MISMATCH'}`);
  console.log(`- Excerpt Restoration (Byte-level)         : ${excerptMatch ? '✅ EXACT MATCH' : '❌ MISMATCH'}`);
  console.log(`- Meta Description Restoration (Byte-level): ${metaDescMatch ? '✅ EXACT MATCH' : '❌ MISMATCH'}`);
  console.log(`- Slug Restoration (Byte-level)             : ${slugMatch ? '✅ EXACT MATCH' : '❌ MISMATCH'}`);
  console.log(`- Unchanged Metadata Preserved               : ${metadataPreserved ? '✅ PASSED (slug, content_id, featured_media, category, tag, status intact)' : '❌ FAILED'}`);

  const allPassed = titleMatch && contentMatch && excerptMatch && metaDescMatch && slugMatch && metadataPreserved;
  console.log(`\nOVERALL E2E STATUS: ${allPassed ? '🎉 ALL CHECKS PASSED' : '❌ FAILURE'}`);
}

runE2E().catch(err => {
  console.error("\n❌ E2E Execution Failed:", err);
  process.exit(1);
});
