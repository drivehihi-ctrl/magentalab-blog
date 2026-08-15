import 'server-only';

import { getRevision } from '@/lib/ai-revisions';
import { imageAssetRepository } from '@/lib/repositories/image-asset-repository';
import { auditLogRepository } from '@/lib/repositories';
import { ImageAsset, ImagePipelineError, ImagePlacementType, ImageSlot } from './types';
import { validateAltText, validateImagePrompt } from './validators';

const BODY_SLOTS: ImageSlot[] = ['image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'image_6'];
const PLACEMENTS: ImagePlacementType[] = ['after_title', 'after_heading', 'after_paragraph'];

export interface RevisionImagePlanInput {
  slot: ImageSlot;
  role: string;
  prompt: string;
  alt_text: string;
  tags: string[];
  placement_type: ImagePlacementType;
  anchor_text?: string;
  ansim_required?: boolean;
}

function validatePlan(plan: RevisionImagePlanInput) {
  if (!BODY_SLOTS.includes(plan.slot)) {
    throw new ImagePipelineError('IMAGE_PLAN_SLOT_INVALID', 'Revision body plans must use image_1 through image_6');
  }
  if (!PLACEMENTS.includes(plan.placement_type)) {
    throw new ImagePipelineError('IMAGE_PLAN_PLACEMENT_INVALID', `Unsupported placement: ${plan.placement_type}`);
  }
  if (plan.placement_type !== 'after_title' && !plan.anchor_text?.trim()) {
    throw new ImagePipelineError('IMAGE_PLAN_ANCHOR_REQUIRED', `${plan.placement_type} requires anchor_text`);
  }
  if (!plan.role?.trim()) {
    throw new ImagePipelineError('IMAGE_PLAN_ROLE_REQUIRED', 'role is required');
  }
  if (!Array.isArray(plan.tags) || plan.tags.length < 1 || plan.tags.length > 12) {
    throw new ImagePipelineError('IMAGE_PLAN_TAGS_INVALID', 'tags must contain 1 to 12 items');
  }
  if (plan.tags.some((tag) => !tag.trim() || tag.length > 50)) {
    throw new ImagePipelineError('IMAGE_PLAN_TAG_INVALID', 'Each tag must be 1 to 50 characters');
  }
  validateImagePrompt(plan.prompt, plan.ansim_required === true);
  validateAltText(plan.alt_text);
}

function samePlan(existing: ImageAsset, input: RevisionImagePlanInput, order: number): boolean {
  return existing.slot === input.slot
    && existing.role === input.role.trim()
    && existing.prompt === input.prompt
    && existing.alt_text === input.alt_text
    && existing.placement_type === input.placement_type
    && (existing.anchor_text || '') === (input.anchor_text?.trim() || '')
    && existing.sort_order === order
    && JSON.stringify(existing.tags || []) === JSON.stringify(input.tags.map((tag) => tag.trim()));
}

export async function planRevisionImages(params: {
  revision_id: string;
  plans: RevisionImagePlanInput[];
  source?: string;
}) {
  if (!Array.isArray(params.plans) || params.plans.length < 1 || params.plans.length > 6) {
    throw new ImagePipelineError('IMAGE_PLAN_COUNT_INVALID', 'plans must contain 1 to 6 items');
  }
  const slots = params.plans.map((plan) => plan.slot);
  if (new Set(slots).size !== slots.length) {
    throw new ImagePipelineError('IMAGE_PLAN_DUPLICATE_SLOT', 'Each image slot may be planned only once');
  }
  params.plans.forEach(validatePlan);

  const revision = await getRevision(params.revision_id);
  if (!revision) throw new ImagePipelineError('REVISION_NOT_FOUND', 'Revision not found');

  const existing = await imageAssetRepository.listImageAssetsByRevision(params.revision_id);
  if (existing.length > 0) {
    const allMatch = existing.length === params.plans.length
      && params.plans.every((plan, index) => {
        const asset = existing.find((item) => item.slot === plan.slot);
        return !!asset && samePlan(asset, plan, index + 1);
      });
    if (!allMatch) {
      throw new ImagePipelineError(
        'IMAGE_PLAN_CONFLICT',
        'Image plans already exist for this revision and differ from the request; they were not overwritten'
      );
    }
    return { revision_id: params.revision_id, wordpress_id: revision.wordpress_id, reused: true, plans: existing };
  }

  const created: ImageAsset[] = params.plans.map((plan, index) => {
    return {
      image_asset_id: `img_${params.revision_id}_${plan.slot}`,
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      revision_id: params.revision_id,
      slot: plan.slot,
      role: plan.role.trim(),
      source_type: 'generated',
      ansim_required: plan.ansim_required === true,
      prompt: plan.prompt,
      alt_text: plan.alt_text,
      tags: plan.tags.map((tag) => tag.trim()),
      placement_type: plan.placement_type,
      anchor_text: plan.anchor_text?.trim() || null,
      sort_order: index + 1,
      status: 'planned',
    };
  });
  await imageAssetRepository.createRevisionImagePlans(created);

  await auditLogRepository.log({
    wordpress_id: revision.wordpress_id,
    content_id: revision.content_id || '',
    revision_id: params.revision_id,
    action: 'REVISION_IMAGE_PLANS_CREATED',
    source: params.source || 'mcp',
    status: 'success',
    message: JSON.stringify({ slots: created.map((asset) => asset.slot) }),
    timestamp: new Date().toISOString(),
  });

  return { revision_id: params.revision_id, wordpress_id: revision.wordpress_id, reused: false, plans: created };
}

export async function getRevisionImagePlan(revisionId: string) {
  const plans = await imageAssetRepository.listImageAssetsByRevision(revisionId);
  return { revision_id: revisionId, count: plans.length, plans };
}
