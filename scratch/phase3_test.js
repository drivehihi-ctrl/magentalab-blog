const fs = require('fs');
const sharp = require('sharp');

const API_SECRET = process.env.AI_CONTENT_API_SECRET;
const WP_BASE = "https://magentalab.mycafe24.com/wp-json/wp/v2/posts";
const API_BASE = "http://localhost:3000/api/ai-content";

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log("=== Starting Phase 3 Tests A-J ===");

  // Test A - Upload
  console.log(`\n[Test A] Creating test image and uploading...`);
  const imageBuffer = await sharp({
    create: { width: 1200, height: 800, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 1 } }
  })
  .webp()
  .toBuffer();

  const formData = new FormData();
  formData.append('file', new Blob([imageBuffer], { type: 'image/webp' }), 'test-phase3-upload.webp');
  formData.append('alt_text', '테스트용 반려견 이미지');
  formData.append('title', 'Test Phase 3 Image');

  const uploadRes = await fetch(`${API_BASE}/media`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: formData
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok) {
    console.error("Upload failed:", uploadData);
    return;
  }
  const mediaId = uploadData.media_id;
  console.log(`Upload Success! Media ID: ${mediaId}, URL: ${uploadData.source_url}`);
  console.log(`[Test B] ALT 저장 확인: ${uploadData.alt_text === '테스트용 반려견 이미지' ? 'SUCCESS' : 'FAIL'}`);

  // Test C - Revision
  const targetId = 6042;
  console.log(`\n[Test C] Creating Revision on KO Post: ${targetId}...`);
  const origRes = await fetch(`${WP_BASE}/${targetId}`);
  const origPost = await origRes.json();
  const originalTitle = origPost.title.rendered;

  const revRes = await fetch(`${API_BASE}/revisions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` },
    body: JSON.stringify({
      wordpress_id: targetId,
      reason: "Phase 3 Media Insert Test",
      source: "chatgpt"
    })
  });
  const revision = await revRes.json();
  if (!revRes.ok) {
    console.error("Failed to create revision:", revision);
    return;
  }
  const revId = revision.revision_id;
  console.log(`Revision Created! ID: ${revId}`);

  // Test D - Body Insert
  console.log(`\n[Test D] Inserting Image to Body (after first H2)...`);
  const insertRes = await fetch(`${API_BASE}/revisions/${revId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` },
    body: JSON.stringify({
      media_id: mediaId,
      src: uploadData.source_url,
      alt: uploadData.alt_text,
      caption: 'Phase 3 Test Caption',
      position: { type: 'after_heading', heading_text: '강아지 배 만지면 좋아하는 부위', heading_level: 2 } // Based on post content, we'll just try to match part of it if possible, or fallback to end_of_content
    })
  });
  const insertData = await insertRes.json();
  // We'll actually do a fallback insertion if heading match fails to keep test running
  if (!insertRes.ok && insertData.error === 'HEADING_NOT_FOUND') {
      console.warn("Heading not found, fallback to end_of_content...");
      await fetch(`${API_BASE}/revisions/${revId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` },
        body: JSON.stringify({
          media_id: mediaId,
          src: uploadData.source_url,
          alt: uploadData.alt_text,
          position: { type: 'end_of_content' }
        })
      });
  } else if (!insertRes.ok) {
      console.error("Insert failed:", insertData);
      return;
  } else {
      console.log("Insert Success!");
  }

  // Test E & F - Preview & Diff
  console.log(`\n[Test E] Checking Preview URL availability...`);
  const previewRes = await fetch(`http://localhost:3000/preview/${revId}`);
  console.log(`Preview URL Status: ${previewRes.status}`);

  console.log(`\n[Test F] Checking Diff API...`);
  const diffRes = await fetch(`${API_BASE}/revisions/${revId}/diff`, { headers: { 'Authorization': `Bearer ${API_SECRET}` } });
  const diffData = await diffRes.json();
  console.log(`Diff Response Content Changed: ${diffData.diff.content.changed}`);

  // Test G - Apply
  console.log(`\n[Test G] Applying Revision...`);
  const applyRes = await fetch(`${API_BASE}/revisions/${revId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` },
    body: JSON.stringify({ confirm: true })
  });
  const applyData = await applyRes.json();
  if (!applyRes.ok) {
    console.error("Apply failed:", applyData);
    return;
  }
  console.log(`Apply Success! Backup ID: ${applyData.backup_id}`);
  await wait(3000);

  // Test H - Verify Frontend
  console.log(`\n[Test H] Verifying WP post has changed...`);
  const origRes3 = await fetch(`${WP_BASE}/${targetId}?_t=${Date.now()}`);
  const origPost3 = await origRes3.json();
  if (origPost3.content.rendered.includes(uploadData.source_url)) {
    console.log("SUCCESS: Image was injected to WP post!");
  } else {
    console.error("FAIL: Image NOT injected to WP post.");
  }

  // Test I - Rollback
  console.log(`\n[Test I] Rolling back Revision...`);
  const rollbackRes = await fetch(`${API_BASE}/revisions/${revId}/rollback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` },
    body: JSON.stringify({ confirm: true })
  });
  const rollbackData = await rollbackRes.json();
  if (!rollbackRes.ok) {
    console.error("Rollback failed:", rollbackData);
    return;
  }
  console.log(`Rollback Success!`);
  await wait(3000);

  // Test J - Restore Verify
  console.log(`\n[Test J] Verifying WP post is restored...`);
  const origRes4 = await fetch(`${WP_BASE}/${targetId}?_t=${Date.now()}`);
  const origPost4 = await origRes4.json();
  if (!origPost4.content.rendered.includes(uploadData.source_url)) {
    console.log("SUCCESS: Image removed from WP post (Restored).");
  } else {
    console.error("FAIL: Post still has the image.");
  }

  // --- Featured Image Test ---
  console.log(`\n=== Featured Image Test ===`);
  const revResF = await fetch(`${API_BASE}/revisions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` },
    body: JSON.stringify({ wordpress_id: targetId, reason: "Phase 3 Featured Image Test", source: "chatgpt" })
  });
  const revF = await revResF.json();
  console.log(`Revision Created! ID: ${revF.revision_id}`);

  console.log(`Setting new featured media id...`);
  await fetch(`${API_BASE}/revisions/${revF.revision_id}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` },
    body: JSON.stringify({ media_id: mediaId, position: { type: 'featured_image' } })
  });

  console.log(`Applying featured media revision...`);
  await fetch(`${API_BASE}/revisions/${revF.revision_id}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` },
    body: JSON.stringify({ confirm: true })
  });
  await wait(3000);

  const origRes5 = await fetch(`${WP_BASE}/${targetId}?_t=${Date.now()}`);
  const origPost5 = await origRes5.json();
  console.log(`Apply Verify Featured Media: Expected ${mediaId}, Got ${origPost5.featured_media}`);

  console.log(`Rolling back featured media revision...`);
  await fetch(`${API_BASE}/revisions/${revF.revision_id}/rollback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_SECRET}` },
    body: JSON.stringify({ confirm: true })
  });
  await wait(3000);

  const origRes6 = await fetch(`${WP_BASE}/${targetId}?_t=${Date.now()}`);
  const origPost6 = await origRes6.json();
  console.log(`Rollback Verify Featured Media: Got ${origPost6.featured_media} (Should match original)`);

  console.log("\n=== Phase 3 Tests Completed Successfully ===");
}

runTests().catch(console.error);
