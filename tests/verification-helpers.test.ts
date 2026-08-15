import assert from 'node:assert/strict';
import test from 'node:test';

import { compareCanonicalContent } from '../lib/services/verification-helpers.ts';

const expected = '<h2>Care guide</h2><p>Keep the kitten warm.</p>';

test('passes when Easy TOC inserts a complete container', () => {
  const actual = '<div id="ez-toc-container"><nav><a href="#care">Care guide</a></nav></div>' + expected;
  assert.equal(compareCanonicalContent(expected, actual), true);
});

test('passes when Easy TOC inserts heading marker spans', () => {
  const actual = '<h2><span class="ez-toc-section" id="care"></span>Care guide<span class="ez-toc-section-end"></span></h2><p>Keep the kitten warm.</p>';
  assert.equal(compareCanonicalContent(expected, actual), true);
});

test('fails when body text differs by one character', () => {
  const actual = '<h2>Care guide</h2><p>Keep the kitten warms.</p>';
  assert.equal(compareCanonicalContent(expected, actual), false);
});

test('fails when an author nav disappears', () => {
  const withAuthorNav = '<nav aria-label="Related"><a href="/care">Care</a></nav>' + expected;
  assert.equal(compareCanonicalContent(withAuthorNav, expected), false);
});

test('fails when an author table changes', () => {
  const table = '<table><tbody><tr><td>37 C</td></tr></tbody></table>';
  const changed = '<table><tbody><tr><td>38 C</td></tr></tbody></table>';
  assert.equal(compareCanonicalContent(table, changed), false);
});

test('fails when an author link changes', () => {
  assert.equal(compareCanonicalContent('<a href="/a">Guide</a>', '<a href="/b">Guide</a>'), false);
});

test('fails when an author image changes', () => {
  assert.equal(compareCanonicalContent('<img src="a.jpg" alt="kitten">', '<img src="b.jpg" alt="kitten">'), false);
});

test('fails when unrelated plugin DOM changes', () => {
  const actual = '<div class="another-plugin">Injected</div>' + expected;
  assert.equal(compareCanonicalContent(expected, actual), false);
});
