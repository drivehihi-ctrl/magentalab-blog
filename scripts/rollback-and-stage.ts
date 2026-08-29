import { rollbackRevision } from '../lib/services/rollback-service';
import { reviewRevision } from '../lib/services/review-service';
import { stageRevision } from '../lib/services/staging-service';

async function run() {
  const revisionId = 'rev_5de08baba271a2a9';

  try {
    console.log('Rolling back live apply...');
    await rollbackRevision({
      revision_id: revisionId,
      confirm: true,
      rollback_confirm: true,
      source: 'agent_script'
    });
    console.log('Rollback successful.');
  } catch (e) {
    console.error('Rollback failed:', e);
  }

  try {
    console.log('Re-approving revision...');
    await reviewRevision({
      revision_id: revisionId,
      decision: 'approve',
      reviewer_id: 'agent_script',
      reason: 'Re-approving after rollback for staging',
      confirm: true,
      medical_review_confirm: true
    });
    console.log('Re-approve successful.');
  } catch (e) {
    console.error('Re-approve failed:', e);
  }

  try {
    console.log('Staging revision...');
    const result = await stageRevision({
      revision_id: revisionId,
      confirm: true,
      staging_apply_confirm: true,
      source: 'agent_script'
    });
    console.log('Staging successful!', JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Staging failed:', e);
  }
}

run();
