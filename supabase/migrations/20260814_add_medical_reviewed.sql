-- Add medical_reviewed column to ai_revisions table
ALTER TABLE public.ai_revisions
ADD COLUMN IF NOT EXISTS medical_reviewed BOOLEAN DEFAULT FALSE;

-- Optional: update existing rows (if they were approved without it, they either aren't medical or they bypass it)
-- We leave it as FALSE by default.
