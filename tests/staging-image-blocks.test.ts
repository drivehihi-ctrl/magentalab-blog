import assert from 'node:assert/strict';
import test from 'node:test';
import {
  hasExpectedImageSlots,
  injectImageSlotBlocks,
  stripImageSlotBlocks,
} from '../lib/image-pipeline/staging-image-blocks.ts';
import type { ImageAsset } from '../lib/image-pipeline/types.ts';

function plan(overrides: Partial<ImageAsset> = {}): ImageAsset {
  return {
    image_asset_id: 'img_rev_test_image_1',
    wordpress_id: 5900,
    revision_id: 'rev_test',
    slot: 'image_1',
    role: '온도 설명',
    source_type: 'generated',
    ansim_required: false,
    prompt: '따뜻한 보온 상자 안의 신생묘와 디지털 온습도계',
    alt_text: '보온 상자 안에서 체온을 유지하는 신생묘',
    tags: ['신생묘', '보온 상자'],
    placement_type: 'after_heading',
    anchor_text: '적정 온도와 습도',
    sort_order: 1,
    status: 'planned',
    ...overrides,
  };
}

test('injects a visible managed block after the exact heading anchor', () => {
  const original = '<p>도입부</p><h2>적정 온도와 습도</h2><p>설명</p>';
  const plans = [plan()];
  const staged = injectImageSlotBlocks(original, plans);

  assert.match(staged, /<h2>적정 온도와 습도<\/h2><!-- MAGENTALAB_IMAGE_SLOT_START:image_1 -->/);
  assert.match(staged, /\[이미지1\]/);
  assert.match(staged, /신생묘, 보온 상자/);
  assert.equal(hasExpectedImageSlots(staged, plans), true);
  assert.equal(stripImageSlotBlocks(staged), original);
});

test('supports an after-title slot without an anchor', () => {
  const original = '<p>첫 문단</p>';
  const staged = injectImageSlotBlocks(original, [plan({ placement_type: 'after_title', anchor_text: null })]);
  assert.match(staged, /^<!-- MAGENTALAB_IMAGE_SLOT_START:image_1 -->/);
  assert.equal(stripImageSlotBlocks(staged), original);
});

test('refuses missing and ambiguous anchors', () => {
  assert.throws(
    () => injectImageSlotBlocks('<h2>다른 제목</h2>', [plan()]),
    /anchor matched 0 blocks/
  );
  assert.throws(
    () => injectImageSlotBlocks('<h2>적정 온도와 습도</h2><h3>적정 온도와 습도</h3>', [plan()]),
    /anchor matched 2 blocks/
  );
});

test('escapes prompt, tags and ALT text in the editor-only block', () => {
  const staged = injectImageSlotBlocks('<p>첫 문단</p>', [plan({
    placement_type: 'after_title',
    anchor_text: null,
    prompt: '<script>alert("x")</script>',
    tags: ['고양이 & 안전'],
    alt_text: '고양이 < 보온 상자',
  })]);
  assert.doesNotMatch(staged, /<script>/);
  assert.match(staged, /&lt;script&gt;/);
  assert.match(staged, /고양이 &amp; 안전/);
  assert.match(staged, /고양이 &lt; 보온 상자/);
});
