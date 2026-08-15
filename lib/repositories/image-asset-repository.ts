import { supabaseAdmin } from '@/lib/supabase-admin';
import { ImageAsset, ImageAssetStatus } from '../image-pipeline/types';

export const imageAssetRepository = {
  async createImagePlan(asset: ImageAsset): Promise<void> {
    const { data, error } = await supabaseAdmin.from('ai_image_assets').insert([{
      image_asset_id: asset.image_asset_id,
      wordpress_id: asset.wordpress_id,
      content_id: asset.content_id,
      revision_id: asset.revision_id,
      slot: asset.slot,
      role: asset.role,
      source_type: asset.source_type,
      ansim_required: asset.ansim_required,
      prompt: asset.prompt,
      alt_text: asset.alt_text,
      status: asset.status
    }]);

    if (error) {
      console.error('Supabase createImagePlan error:', error);
      throw new Error(`Failed to create image plan: ${error.message}`);
    }
  },

  async getImageAsset(imageAssetId: string): Promise<ImageAsset | null> {
    const { data, error } = await supabaseAdmin
      .from('ai_image_assets')
      .select('*')
      .eq('image_asset_id', imageAssetId)
      .maybeSingle();

    if (error) {
      console.error('Supabase getImageAsset error:', error);
      return null;
    }
    return (data as ImageAsset) || null;
  },

  async listImageAssetsByPost(wordpressId: number): Promise<ImageAsset[]> {
    const { data, error } = await supabaseAdmin
      .from('ai_image_assets')
      .select('*')
      .eq('wordpress_id', wordpressId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase listImageAssetsByPost error:', error);
      return [];
    }
    return (data as ImageAsset[]) || [];
  },

  async updateImageAsset(imageAssetId: string, updates: Partial<ImageAsset>): Promise<void> {
    const { error } = await supabaseAdmin
      .from('ai_image_assets')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('image_asset_id', imageAssetId);

    if (error) {
      console.error('Supabase updateImageAsset error:', error);
      throw new Error(`Failed to update image asset: ${error.message}`);
    }
  }
};
