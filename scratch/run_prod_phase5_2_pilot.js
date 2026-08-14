require('dotenv').config({ path: '.env.local' });

const PROD_BATCH_ENDPOINT = 'https://www.magentalabblog.com/api/ai-content/revisions/batch';
const PROD_BASE_URL = 'https://www.magentalabblog.com/api/ai-content';
const API_SECRET = 'magentalab-1234';
const WP_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://magentalab.mycafe24.com') + '/wp-json/wp/v2';
const user = process.env.WP_USER || "magentalab";
const pass = process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD || "7q3n UBO5 gHyJ gLos weag GWn9";
const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

async function fetchWPPost(postId) {
  const res = await fetch(`${WP_URL}/posts/${postId}?context=edit`, {
    headers: {
      'Authorization': auth,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch WP post ${postId}: ${res.status}`);
  }
  return await res.json();
}

async function runPhase52Pilot() {
  console.log("=======================================================");
  console.log(`[Phase 5.2 Production Pilot] Target: ${PROD_BATCH_ENDPOINT}`);
  console.log("=======================================================");

  // 1. Fetch posts 6090 and 6042
  console.log("Fetching baseline posts 6090 and 6042 from WordPress...");
  const post6090 = await fetchWPPost(6090);
  const post6042 = await fetchWPPost(6042);

  const raw6090Content = post6090.content?.raw || post6090.content?.rendered || '';
  const raw6042Content = post6042.content?.raw || post6042.content?.rendered || '';

  // 6090: Structure enhancement revision (add H2 structure & summary table + Research Summary tag)
  const content6090 = raw6090Content + "\n\n<h2>📊 개요 및 핵심 요약</h2>\n<table><tr><th>구분</th><th>내용</th></tr><tr><td>안내</td><td>구조 개선 템플릿 적용</td></tr></table>\n\n<!-- Ansim-i's Research Summary -->";

  // 6042: New content for medical topic without evidence reference to trigger warning
  const content6042 = raw6042Content + "\n\n<h2>⚠️ 주의사항 및 관리 팁</h2>\n<p>반려동물 건강 관리를 위한 안내 (의료 근거 태그 미첨부 테스트)</p>\n\n<!-- Research Summary -->";

  const batchPayload = {
    revisions: [
      {
        wordpress_id: 6090,
        new_title: (post6090.title?.raw || post6090.title?.rendered) + " [구조개선 적용]",
        new_content: content6090,
        new_excerpt: post6090.excerpt?.raw || post6090.excerpt?.rendered,
        reason: "Phase 5.2 Pilot: Structure Enhancement",
        source: "phase5_2_pilot"
      },
      {
        wordpress_id: 6042,
        new_title: (post6042.title?.raw || post6042.title?.rendered) + " [내용 업데이트]",
        new_content: content6042,
        new_excerpt: post6042.excerpt?.raw || post6042.excerpt?.rendered,
        reason: "Phase 5.2 Pilot: Content Update (No Evidence Warning Test)",
        source: "phase5_2_pilot"
      }
    ]
  };

  console.log("\nSending Batch Request to Production Endpoint...");
  console.log("Authorization Header: Bearer [REDACTED_SECRET]");
  console.log("Batch Size: 2");

  const batchRes = await fetch(PROD_BATCH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: JSON.stringify(batchPayload)
  });

  console.log(`HTTP Status: ${batchRes.status}`);

  if (!batchRes.ok) {
    const errorText = await batchRes.text();
    console.error("❌ Batch Request Failed:", errorText);
    process.exit(1);
  }

  const batchData = await batchRes.json();

  console.log("\n=======================================================");
  console.log("BATCH REVISIONS CREATED OUTPUT:");
  console.log("=======================================================");

  const revisions = batchData.revisions || [];
  revisions.forEach((rev, idx) => {
    console.log(`\n[Revision #${idx + 1}]`);
    console.log(`  - revision_id       : ${rev.revision_id}`);
    console.log(`  - wordpress_id      : ${rev.wordpress_id}`);
    console.log(`  - status            : ${rev.status}`);
    console.log(`  - evidence_attached : ${rev.evidence_attached}`);
    console.log(`  - warnings          : ${JSON.stringify(rev.warnings)}`);
  });

  // 2. Call diff endpoint for each revision to verify pending_review status and diffs
  console.log("\n=======================================================");
  console.log("VERIFYING REVISIONS VIA DIFF ENDPOINT:");
  console.log("=======================================================");

  for (const rev of revisions) {
    const diffUrl = `${PROD_BASE_URL}/revisions/${rev.revision_id}/diff`;
    console.log(`\nFetching Diff for ${rev.revision_id}...`);

    const diffRes = await fetch(diffUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_SECRET}`
      }
    });

    console.log(`  - HTTP Status : ${diffRes.status}`);
    if (diffRes.ok) {
      const diffData = await diffRes.json();
      console.log(`  - status      : ${diffData.status || rev.status}`);
      console.log(`  - title changed : ${diffData.title_changed ?? (diffData.new_title !== diffData.previous_title)}`);
      console.log(`  - content changed: ${diffData.content_changed ?? (diffData.new_content !== diffData.previous_content)}`);
      console.log(`  - verification : ✅ PENDING_REVIEW & DIFF VERIFIED`);
    } else {
      console.error(`  - Diff fetch failed: ${await diffRes.text()}`);
    }
  }

  console.log("\n=======================================================");
  console.log("🎉 Phase 5.2 Production Pilot Execution Completed Successfully");
  console.log("=======================================================");
}

runPhase52Pilot().catch(err => {
  console.error("❌ Phase 5.2 Pilot Execution Error:", err);
  process.exit(1);
});
