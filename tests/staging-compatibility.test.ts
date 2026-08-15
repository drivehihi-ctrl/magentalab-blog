import assert from 'node:assert/strict';
import test from 'node:test';
import { isStagingCompatibilityRequest, STAGING_COMPATIBILITY_NOTE } from '../lib/services/staging-compatibility.ts';

test('requires approve plus the exact staging compatibility sentinel', () => {
  assert.equal(isStagingCompatibilityRequest('approve', STAGING_COMPATIBILITY_NOTE), true);
  assert.equal(isStagingCompatibilityRequest('reject', STAGING_COMPATIBILITY_NOTE), false);
  assert.equal(isStagingCompatibilityRequest('approve', 'stage it'), false);
  assert.equal(isStagingCompatibilityRequest('approve', undefined), false);
});
