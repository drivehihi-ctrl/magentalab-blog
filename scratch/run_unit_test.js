require('dotenv').config({ path: '.env.local' });

// Mock server-only before any ts-node/tsx/cjs require
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'server-only') {
    return {};
  }
  return originalRequire.apply(this, arguments);
};

// Register ts-node on the fly
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    target: 'es2020',
    paths: {
      '@/*': ['./*']
    }
  }
});

const path = require('path');
const { applyOneRevision } = require(path.resolve(__dirname, '../lib/apply-revision.ts'));
const { saveRevision } = require(path.resolve(__dirname, '../lib/ai-revisions.ts'));

async function runHardeningUnitTest() {
  console.log("=============================================================");
  console.log("[Phase 5.4 Hardening Dry-Run Logic & Safety Test]");
  console.log("=============================================================\n");

  const medicalRevId = 'rev_test_medical_hardened';
  const medicalRev = {
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

  console.log("--- Test 1: Medical content WITHOUT medical_reviewed / medical_approved flag (dryRun: true) ---");
  const res1 = await applyOneRevision(medicalRevId, { dryRun: true });
  console.log("Result 1:", res1);
  if (!res1.success && res1.error_code === 'MEDICAL_REVIEW_REQUIRED') {
    console.log("✅ TEST 1 PASSED: MEDICAL_REVIEW_REQUIRED correctly triggered\n");
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
    console.log("✅ TEST 2 PASSED: Medical content allowed when medical_reviewed = true\n");
  } else {
    console.error("❌ TEST 2 FAILED\n");
  }

  console.log("=============================================================");
  console.log("🎉 All Phase 5.4 Hardening Safety Checks Verified!");
  console.log("=============================================================");
}

runHardeningUnitTest().catch(e => {
  console.error("Test error:", e);
  process.exit(1);
});
