import 'dotenv/config';
import { applyOneRevision } from '../lib/apply-revision';
import { saveRevision, AIRevision } from '../lib/ai-revisions';

async function runDryRunHardeningTest() {
  console.log("=============================================================");
  console.log("[Phase 5.4 Hardening Dry-Run Unit & Logic Test]");
  console.log("=============================================================\n");

  const medicalRevId = 'rev_test_medical_hardened';
  const medicalRev: AIRevision = {
    revision_id: medicalRevId,
    wordpress_id: 5800,
    content_id: '5800',
    language: 'ko',
    slug: 'diabetes-care-guide-test',
    source_modified_at: '2026-08-13T00:00:00',
    previous_title: '당뇨 가이드',
    new_title: '당뇨 가이드 [개정]',
    previous_content: '당뇨 인슐린 치료가 중요합니다.',
    new_content: '당뇨 인슐린 치료가 중요합니다. <!-- Ansim-i\'s Research Summary -->',
    previous_excerpt: '',
    new_excerpt: '',
    previous_meta_description: '',
    new_meta_description: '',
    evidence: {
      keyInsight: '당뇨 관리',
      cautionNote: '주의',
      references: [{ title: 'Ref 1', org: 'Vet', type: 'Journal', url: 'https://example.com' }]
    },
    reason: 'Medical hardening test',
    source: 'test',
    status: 'approved',
    created_at: new Date().toISOString()
  };

  await saveRevision(medicalRev);

  console.log("--- Test 1: Medical content WITHOUT medical_reviewed flag (dryRun: true) ---");
  const res1 = await applyOneRevision(medicalRevId, { dryRun: true });
  console.log("Result 1:", res1);
  if (!res1.success && res1.error_code === 'MEDICAL_REVIEW_REQUIRED') {
    console.log("✅ TEST 1 PASSED: MEDICAL_REVIEW_REQUIRED correctly returned\n");
  } else {
    console.error("❌ TEST 1 FAILED: Expected MEDICAL_REVIEW_REQUIRED\n");
  }

  // Test 2: Medical content WITH medical_reviewed: true
  medicalRev.medical_reviewed = true;
  await saveRevision(medicalRev);

  console.log("--- Test 2: Medical content WITH medical_reviewed = true (dryRun: true) ---");
  const res2 = await applyOneRevision(medicalRevId, { dryRun: true });
  console.log("Result 2:", res2);
  if (res2.success && res2.backup_id === 'dry-run') {
    console.log("✅ TEST 2 PASSED: Medical content approved with medical_reviewed flag\n");
  } else {
    console.error("❌ TEST 2 FAILED\n");
  }

  console.log("=============================================================");
  console.log("🎉 All Dry-Run Hardening Tests Completed!");
  console.log("=============================================================");
}

runDryRunHardeningTest().catch(e => {
  console.error("Error running test:", e);
  process.exit(1);
});
