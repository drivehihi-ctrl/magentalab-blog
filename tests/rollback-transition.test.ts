import assert from 'node:assert/strict';
import test from 'node:test';

import { isRollbackAllowed } from '../lib/services/rollback-transition.ts';

test('allows rollback retry from rollback_failed only when backup exists', () => {
  assert.equal(isRollbackAllowed('rollback_failed', true), true);
  assert.equal(isRollbackAllowed('rollback_failed', false), false);
});

test('retains the existing rollback states when backup exists', () => {
  for (const status of ['applied', 'applying', 'approved', 'rollback_pending'] as const) {
    assert.equal(isRollbackAllowed(status, true), true, status);
  }
});

test('rejects unrelated revision states', () => {
  for (const status of ['pending_review', 'rejected', 'rolled_back', 'apply_failed'] as const) {
    assert.equal(isRollbackAllowed(status, true), false, status);
  }
});
