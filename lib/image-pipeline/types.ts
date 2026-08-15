export type ImageAssetStatus =
  | "planned"
  | "generated"
  | "review_pending"
  | "approved"
  | "rejected"
  | "generation_failed";

export type ImageSourceType =
  | "generated"
  | "existing"
  | "external_reference";

export type ImageSlot =
  | "featured"
  | "image_1"
  | "image_2"
  | "image_3"
  | "image_4"
  | "image_5"
  | "image_6";

export interface ImageAsset {
  id?: string;
  image_asset_id: string;
  wordpress_id: number;
  content_id?: string | null;
  revision_id?: string | null;
  
  slot: ImageSlot;
  role: string;
  source_type: ImageSourceType;
  
  ansim_required: boolean;
  
  prompt: string;
  alt_text: string;
  
  generator?: string | null;
  model?: string | null;
  generation_metadata?: Record<string, any> | null;
  
  original_file_url?: string | null;
  stored_file_url?: string | null;
  
  width?: number | null;
  height?: number | null;
  mime_type?: string | null;
  
  status: ImageAssetStatus;
  
  rejection_reason?: string | null;
  review_note?: string | null;
  
  created_at?: string;
  updated_at?: string;
  approved_at?: string | null;
  rejected_at?: string | null;
  
  wordpress_media_id?: number | null;
  wordpress_media_url?: string | null;
  uploaded_at?: string | null;
}

export class ImagePipelineError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'ImagePipelineError';
  }
}
