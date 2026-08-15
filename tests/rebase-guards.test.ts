import assert from 'node:assert/strict';
import test from 'node:test';

import { getRebaseMismatches } from '../lib/services/rebase-guards.ts';

const baseline = {
  title: 'Original title',
  content: '<h2>Heading</h2><p>Author content</p><nav>Author nav</nav><img src="pet.jpg">',
  excerpt: '<p>Original excerpt</p>',
  slug: 'original-slug',
  featured_media: 42,
};

const current = {
  title: { rendered: 'Original title' },
  content: { rendered: baseline.content },
  excerpt: { rendered: baseline.excerpt },
  slug: baseline.slug,
  status: 'publish',
  featured_media: 42,
};

test('allows timestamp-only drift when the rollback baseline is unchanged', () => {
  assert.deepEqual(getRebaseMismatches(baseline, current), []);
});

test('allows only Easy TOC generated DOM differences in content', () => {
  const withEasyToc = {
    ...current,
    content: {
      rendered: '<div id="ez-toc-container"><nav>Generated TOC</nav></div><h2><span class="ez-toc-section"></span>Heading<span class="ez-toc-section-end"></span></h2><p>Author content</p><nav>Author nav</nav><img src="pet.jpg">',
    },
  };
  assert.deepEqual(getRebaseMismatches(baseline, withEasyToc), []);
});

test('rejects author content and protected-field changes', () => {
  assert.deepEqual(
    getRebaseMismatches(baseline, {
      ...current,
      content: { rendered: '<h2>Heading</h2><p>Changed content</p>' },
      slug: 'changed-slug',
      status: 'draft',
      featured_media: 99,
    }),
    ['content', 'slug', 'status', 'featured_media']
  );
});

test('rejects removal of author nav and changes to links, tables, or images', () => {
  const changed = '<h2>Heading</h2><p>Author content</p><img src="other.jpg">';
  assert.deepEqual(getRebaseMismatches(baseline, { ...current, content: { rendered: changed } }), ['content']);
});
