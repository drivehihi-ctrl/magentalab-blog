import { ImagePipelineError } from './types.ts';
import type { ImageAsset } from './types.ts';

const START = '<!-- MAGENTALAB_IMAGE_SLOT_START:';
const END = '<!-- MAGENTALAB_IMAGE_SLOT_END:';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalized(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function textFromHtml(value: string): string {
  return normalized(value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16))));
}

function findAnchorEndPositions(content: string, placement: ImageAsset['placement_type'], anchor: string): number[] {
  const tagPattern = placement === 'after_heading' ? 'h[2-4]' : 'p';
  const pattern = new RegExp(`<(${tagPattern})(?:\\s[^>]*)?>[\\s\\S]*?<\\/\\1>`, 'gi');
  const positions: number[] = [];
  for (const match of content.matchAll(pattern)) {
    if (textFromHtml(match[0]) === anchor) {
      positions.push((match.index || 0) + match[0].length);
    }
  }
  return positions;
}

export function renderImageSlotBlock(asset: ImageAsset): string {
  const number = asset.slot.replace('image_', '');
  const tags = (asset.tags || []).map(escapeHtml).join(', ');
  return `${START}${asset.slot} -->\n`
    + `<div class="magentalab-image-slot" data-image-slot="${escapeHtml(asset.slot)}" data-image-asset-id="${escapeHtml(asset.image_asset_id)}">`
    + `<p><strong>[이미지${number}]</strong></p>`
    + `<p><strong>위치:</strong> ${escapeHtml(asset.placement_type || '')}${asset.anchor_text ? ` — ${escapeHtml(asset.anchor_text)}` : ''}</p>`
    + `<p><strong>프롬프트:</strong> ${escapeHtml(asset.prompt)}</p>`
    + `<p><strong>태그:</strong> ${tags}</p>`
    + `<p><strong>ALT:</strong> ${escapeHtml(asset.alt_text)}</p>`
    + `</div>\n${END}${asset.slot} -->`;
}

export function injectImageSlotBlocks(content: string, plans: ImageAsset[]): string {
  if (plans.length < 1 || plans.length > 6) {
    throw new ImagePipelineError('IMAGE_PLAN_COUNT_INVALID', 'Expected 1 to 6 image plans');
  }
  const sorted = [...plans].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const insertions: Array<{ position: number; order: number; block: string }> = [];
  for (const plan of sorted) {
    if (content.includes(`data-image-slot="${plan.slot}"`)) {
      throw new ImagePipelineError('IMAGE_SLOT_DUPLICATE', `Content already contains ${plan.slot}`);
    }
    const block = renderImageSlotBlock(plan);
    if (plan.placement_type === 'after_title') {
      insertions.push({ position: 0, order: plan.sort_order || 0, block });
      continue;
    }
    const anchor = normalized(plan.anchor_text || '');
    const positions = findAnchorEndPositions(content, plan.placement_type, anchor);
    if (positions.length !== 1) {
      throw new ImagePipelineError(
        positions.length === 0 ? 'IMAGE_SLOT_ANCHOR_NOT_FOUND' : 'IMAGE_SLOT_ANCHOR_AMBIGUOUS',
        `${plan.slot} anchor matched ${positions.length} blocks: ${plan.anchor_text}`
      );
    }
    insertions.push({ position: positions[0], order: plan.sort_order || 0, block });
  }
  const grouped = new Map<number, Array<{ order: number; block: string }>>();
  for (const insertion of insertions) {
    const group = grouped.get(insertion.position) || [];
    group.push({ order: insertion.order, block: insertion.block });
    grouped.set(insertion.position, group);
  }
  let output = content;
  const positions = [...grouped.keys()].sort((a, b) => b - a);
  for (const position of positions) {
    const blocks = (grouped.get(position) || [])
      .sort((a, b) => a.order - b.order)
      .map((item) => item.block)
      .join('');
    output = output.slice(0, position) + blocks + output.slice(position);
  }
  return output;
}

export function stripImageSlotBlocks(content: string): string {
  const pattern = /<!-- MAGENTALAB_IMAGE_SLOT_START:[\s\S]*?<!-- MAGENTALAB_IMAGE_SLOT_END:[^>]*-->/g;
  return content.replace(pattern, '').trim();
}

export function hasExpectedImageSlots(content: string, plans: ImageAsset[]): boolean {
  return plans.every((plan) => content.includes(`data-image-slot="${plan.slot}"`)
    && content.includes(`data-image-asset-id="${plan.image_asset_id}"`));
}
