import assert from 'node:assert/strict';
import test from 'node:test';

import { isApprovalTransitionAllowed, isApprovedRollbackRebaseAllowed } from '../lib/services/review-transition.ts';

test('allows a normal pending review approval', () => {
  assert.equal(isApprovalTransitionAllowed('pending_review', false), true);
});

test('allows re-approval of a rolled-back revision only with its backup', () => {
  assert.equal(isApprovalTransitionAllowed('rolled_back', true), true);
  assert.equal(isApprovalTransitionAllowed('rolled_back', false), false);
});

test('does not open approval from other terminal or in-flight states', () => {
  for (const status of ['approved', 'applied', 'rejected', 'applying', 'rollback_pending', 'apply_failed', 'rollback_failed'] as const) {
    assert.equal(isApprovalTransitionAllowed(status, true), false, status);
  }
});

test('allows an approved rollback revision to rebase only with history and backup', () => {
  assert.equal(isApprovedRollbackRebaseAllowed('approved', true, true), true);
  assert.equal(isApprovedRollbackRebaseAllowed('approved', false, true), false);
  assert.equal(isApprovedRollbackRebaseAllowed('approved', true, false), false);
  assert.equal(isApprovedRollbackRebaseAllowed('applied', true, true), false);
});
