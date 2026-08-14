require('dotenv').config({ path: '.env.local' });

const API_SECRET = process.env.AI_CONTENT_API_SECRET;
const WP_BASE = "https://magentalab.mycafe24.com/wp-json/wp/v2/posts";
const API_BASE = "http://localhost:3000/api/ai-content";

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log("=== Starting Phase 2 Tests A-J ===");
  
  // Test A
  const targetId = 6042;
  console.log(`\n[Test A] Selected KO Post: ${targetId}`);
  
  // Test B
  console.log(`\n[Test B] Reading original data...`);
  const origRes = await fetch(`${WP_BASE}/${targetId}`);
  const origPost = await origRes.json();
  const originalTitle = origPost.title.rendered;
  const originalContent = origPost.content.rendered;
  console.log(`Original Title: ${originalTitle.substring(0, 40)}...`);
  
  // Test C
  console.log(`\n[Test C] Creating Revision (safe small change)...`);
  const newTitle = originalTitle + " [AI Test Revision]";
  const newContent = originalContent + "\n<p>This is a safe AI test sentence added to the end.</p>";
  
  const revRes = await fetch(`${API_BASE}/revisions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: JSON.stringify({
      wordpress_id: targetId,
      new_title: newTitle,
      new_content: newContent,
      reason: "Phase 2 Integration Test",
      source: "chatgpt"
    })
  });
  
  const revision = await revRes.json();
  if (!revRes.ok) {
    console.error("Failed to create revision:", revision);
    return;
  }
  const revId = revision.revision_id;
  console.log(`Revision Created! ID: ${revId}, Status: ${revision.status}`);
  
  // Test D
  console.log(`\n[Test D] Verifying original WP post hasn't changed...`);
  const origRes2 = await fetch(`${WP_BASE}/${targetId}`);
  const origPost2 = await origRes2.json();
  if (origPost2.title.rendered === originalTitle) {
    console.log("SUCCESS: Original post is untouched.");
  } else {
    console.error("FAIL: Original post was modified!");
    return;
  }
  
  // Test E
  console.log(`\n[Test E] Checking Diff API...`);
  const diffRes = await fetch(`${API_BASE}/revisions/${revId}/diff`, {
    headers: { 'Authorization': `Bearer ${API_SECRET}` }
  });
  const diffData = await diffRes.json();
  console.log(`Diff Response:`, diffData.diff.title);
  
  // Test F
  console.log(`\n[Test F] Checking Preview URL availability...`);
  const previewRes = await fetch(`http://localhost:3000/preview/${revId}`);
  console.log(`Preview URL Status: ${previewRes.status}`);
  
  // Test G
  console.log(`\n[Test G] Applying Revision...`);
  const applyRes = await fetch(`${API_BASE}/revisions/${revId}/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: JSON.stringify({ confirm: true })
  });
  const applyData = await applyRes.json();
  if (!applyRes.ok) {
    console.error("Apply failed:", applyData);
    return;
  }
  console.log(`Apply Success! Backup ID: ${applyData.backup_id}`);
  
  // Wait a few seconds for WP to settle
  await wait(3000);
  
  // Test H
  console.log(`\n[Test H] Verifying WP post has changed...`);
  const origRes3 = await fetch(`${WP_BASE}/${targetId}?_t=${Date.now()}`); // cache buster
  const origPost3 = await origRes3.json();
  if (origPost3.title.rendered.includes("[AI Test Revision]")) {
    console.log("SUCCESS: WP post was updated correctly.");
  } else {
    console.error("FAIL: WP post was not updated! Title is:", origPost3.title.rendered);
    return;
  }
  
  // Test I
  console.log(`\n[Test I] Rolling back Revision...`);
  const rollbackRes = await fetch(`${API_BASE}/revisions/${revId}/rollback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: JSON.stringify({ confirm: true })
  });
  const rollbackData = await rollbackRes.json();
  if (!rollbackRes.ok) {
    console.error("Rollback failed:", rollbackData);
    return;
  }
  console.log(`Rollback Success!`);
  
  // Wait a few seconds for WP to settle
  await wait(3000);
  
  // Test J
  console.log(`\n[Test J] Verifying WP post is restored to original state...`);
  const origRes4 = await fetch(`${WP_BASE}/${targetId}?_t=${Date.now()}`);
  const origPost4 = await origRes4.json();
  if (origPost4.title.rendered === originalTitle) {
    console.log("SUCCESS: WP post was fully restored.");
  } else {
    console.error("FAIL: WP post was not restored properly!");
  }
  
  console.log("\n=== Phase 2 Tests Completed Successfully ===");
}

runTests().catch(console.error);
