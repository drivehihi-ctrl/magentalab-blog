import { ImageAsset } from './types';
import { validateImagePrompt, validateAltText } from './validators';
import { imageAssetRepository } from '../repositories/image-asset-repository';
import { auditLogRepository } from '../repositories';

export async function createImagePlan(params: Omit<ImageAsset, 'image_asset_id' | 'status'>): Promise<ImageAsset> {
  // Validate
  validateImagePrompt(params.prompt, params.ansim_required);
  validateAltText(params.alt_text);

  // Generate ID
  const randomStr = Math.random().toString(36).substring(2, 8);
  const imageAssetId = `img_${params.wordpress_id}_${params.slot}_${randomStr}`;

  const asset: ImageAsset = {
    ...params,
    image_asset_id: imageAssetId,
    status: 'planned'
  };

  // Save to repo
  await imageAssetRepository.createImagePlan(asset);

  // Log audit
  await auditLogRepository.log({
    wordpress_id: asset.wordpress_id,
    content_id: asset.content_id || '',
    revision_id: asset.revision_id || '',
    action: 'IMAGE_PLAN_CREATED',
    source: 'system',
    status: 'success',
    message: JSON.stringify({
      image_asset_id: asset.image_asset_id,
      slot: asset.slot,
      ansim_required: asset.ansim_required,
      source_type: asset.source_type
    }),
    timestamp: new Date().toISOString()
  });

  return asset;
}
