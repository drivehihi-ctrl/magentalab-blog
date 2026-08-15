ALTER TABLE public.ai_image_assets
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS placement_type text,
  ADD COLUMN IF NOT EXISTS anchor_text text,
  ADD COLUMN IF NOT EXISTS sort_order integer;

ALTER TABLE public.ai_image_assets
  ADD CONSTRAINT ai_image_assets_placement_type_check
  CHECK (placement_type IS NULL OR placement_type IN ('after_title', 'after_heading', 'after_paragraph'));

ALTER TABLE public.ai_image_assets
  ADD CONSTRAINT ai_image_assets_sort_order_check
  CHECK (sort_order IS NULL OR sort_order BETWEEN 1 AND 6);

ALTER TABLE public.ai_image_assets
  ADD CONSTRAINT ai_image_assets_revision_slot_key UNIQUE (revision_id, slot);

CREATE INDEX IF NOT EXISTS idx_ai_image_assets_revision_id
  ON public.ai_image_assets(revision_id);

ALTER TABLE public.ai_image_assets ENABLE ROW LEVEL SECURITY;

COMMENT ON COLUMN public.ai_image_assets.placement_type IS
  'Editor-only staging placement: after_title, after_heading, or after_paragraph.';
COMMENT ON COLUMN public.ai_image_assets.anchor_text IS
  'Exact normalized heading or paragraph text used as the staging insertion anchor.';
