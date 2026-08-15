import { ImageAsset, ImagePipelineError } from './types';
import { imageAssetRepository } from '../repositories/image-asset-repository';
import { auditLogRepository } from '../repositories';

export interface RegistrationDetails {
  generator?: string;
  model?: string;
  generation_metadata?: Record<string, any>;
  original_file_url?: string;
  stored_file_url?: string;
  width?: number;
  height?: number;
  mime_type?: string;
}

export async function registerGeneratedImage(imageAssetId: string, details: RegistrationDetails): Promise<ImageAsset> {
  const asset = await imageAssetRepository.getImageAsset(imageAssetId);
  if (!asset) {
    throw new ImagePipelineError('ASSET_NOT_FOUND', `Asset not found: ${imageAssetId}`);
  }
  
  if (asset.status !== 'planned') {
    throw new ImagePipelineError('INVALID_STATUS_TRANSITION', `Cannot register generation for asset in status: ${asset.status}`);
  }

  await imageAssetRepository.updateImageAsset(imageAssetId, {
    ...details,
    status: 'generated'
  });

  // Log audit
  await auditLogRepository.log({
    wordpress_id: asset.wordpress_id,
    content_id: asset.content_id || '',
    revision_id: asset.revision_id || '',
    action: 'IMAGE_GENERATED_REGISTERED',
    source: 'system',
    status: 'success',
    message: JSON.stringify({
      image_asset_id: asset.image_asset_id,
      generator: details.generator
    }),
    timestamp: new Date().toISOString()
  });

  return (await imageAssetRepository.getImageAsset(imageAssetId)) as ImageAsset;
}
