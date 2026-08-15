import { ImageAsset, ImagePipelineError } from './types';
import { imageAssetRepository } from '../repositories/image-asset-repository';
import { auditLogRepository } from '../repositories';

export async function submitImageForReview(imageAssetId: string): Promise<ImageAsset> {
  const asset = await imageAssetRepository.getImageAsset(imageAssetId);
  if (!asset) {
    throw new ImagePipelineError('ASSET_NOT_FOUND', `Asset not found: ${imageAssetId}`);
  }
  if (asset.status !== 'generated') {
    throw new ImagePipelineError('INVALID_STATUS_TRANSITION', `Cannot submit for review from status: ${asset.status}`);
  }

  await imageAssetRepository.updateImageAsset(imageAssetId, {
    status: 'review_pending'
  });

  await auditLogRepository.log({
    wordpress_id: asset.wordpress_id,
    content_id: asset.content_id || '',
    revision_id: asset.revision_id || '',
    action: 'IMAGE_REVIEW_PENDING',
    source: 'system',
    status: 'success',
    message: JSON.stringify({ image_asset_id: asset.image_asset_id }),
    timestamp: new Date().toISOString()
  });

  return (await imageAssetRepository.getImageAsset(imageAssetId)) as ImageAsset;
}

export async function reviewImageAsset(imageAssetId: string, decision: 'approve' | 'reject', note?: string): Promise<{ asset: ImageAsset, wordpress_mutation: boolean }> {
  const asset = await imageAssetRepository.getImageAsset(imageAssetId);
  if (!asset) {
    throw new ImagePipelineError('ASSET_NOT_FOUND', `Asset not found: ${imageAssetId}`);
  }

  if (asset.status !== 'review_pending') {
    throw new ImagePipelineError('INVALID_STATUS_TRANSITION', `Cannot ${decision} asset in status: ${asset.status}`);
  }

  const newStatus = decision === 'approve' ? 'approved' : 'rejected';
  
  const updates: Partial<ImageAsset> = { status: newStatus };
  if (decision === 'approve') {
    updates.approved_at = new Date().toISOString();
  } else {
    updates.rejected_at = new Date().toISOString();
    updates.rejection_reason = note;
  }
  if (note && decision === 'approve') {
    updates.review_note = note;
  }

  await imageAssetRepository.updateImageAsset(imageAssetId, updates);

  await auditLogRepository.log({
    wordpress_id: asset.wordpress_id,
    content_id: asset.content_id || '',
    revision_id: asset.revision_id || '',
    action: decision === 'approve' ? 'IMAGE_APPROVED' : 'IMAGE_REJECTED',
    source: 'system',
    status: 'success',
    message: JSON.stringify({
      image_asset_id: asset.image_asset_id,
      note
    }),
    timestamp: new Date().toISOString()
  });

  const updatedAsset = (await imageAssetRepository.getImageAsset(imageAssetId)) as ImageAsset;
  
  return {
    asset: updatedAsset,
    wordpress_mutation: false
  };
}
