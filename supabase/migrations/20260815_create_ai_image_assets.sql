CREATE TABLE IF NOT EXISTS public.ai_image_assets (
    id uuid primary key default gen_random_uuid(),
    image_asset_id text unique not null,
    wordpress_id bigint not null,
    content_id text,
    revision_id text,
    
    slot text not null,
    role text not null,
    source_type text not null,
    
    ansim_required boolean not null default false,
    
    prompt text not null,
    alt_text text not null,
    
    generator text,
    model text,
    generation_metadata jsonb,
    
    original_file_url text,
    stored_file_url text,
    
    width integer,
    height integer,
    mime_type text,
    
    status text not null,
    
    rejection_reason text,
    review_note text,
    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    approved_at timestamptz,
    rejected_at timestamptz,
    
    wordpress_media_id bigint,
    wordpress_media_url text,
    uploaded_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_ai_image_assets_wordpress_id ON public.ai_image_assets(wordpress_id);
CREATE INDEX IF NOT EXISTS idx_ai_image_assets_status ON public.ai_image_assets(status);
CREATE INDEX IF NOT EXISTS idx_ai_image_assets_created_at ON public.ai_image_assets(created_at);
