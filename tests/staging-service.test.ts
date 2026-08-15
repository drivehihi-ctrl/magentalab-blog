import assert from 'node:assert/strict';
import test from 'node:test';
import { stagingSlug } from '../lib/services/staging-guards.ts';

test('stagingSlug is deterministic and scoped to source post and revision', () => {
  assert.equal(
    stagingSlug(5900, 'rev_1a4df11de3516fa0'),
    'magentalab-staging-5900-rev_1a4df11de3516fa0'
  );
  assert.notEqual(stagingSlug(5900, 'rev_a'), stagingSlug(5900, 'rev_b'));
  assert.notEqual(stagingSlug(5900, 'rev_a'), stagingSlug(5685, 'rev_a'));
});

test('stagingSlug strips characters that are unsafe in WordPress slugs', () => {
  assert.equal(stagingSlug(1, 'REV_ABC /?'), 'magentalab-staging-1-rev_abc');
});
