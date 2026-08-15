-- 1. Add columns to ai_revisions
ALTER TABLE public.ai_revisions
ADD COLUMN IF NOT EXISTS previous_ansim_summary TEXT,
ADD COLUMN IF NOT EXISTS new_ansim_summary TEXT;

-- 2. Add column to ai_backups
ALTER TABLE public.ai_backups
ADD COLUMN IF NOT EXISTS ansim_summary TEXT;

-- 3. Migrate existing new_ansim_summary from evidence.ansimSummary (only where it exists and new_ansim_summary is null)
UPDATE public.ai_revisions
SET new_ansim_summary = evidence->>'ansimSummary'
WHERE evidence ? 'ansimSummary' AND new_ansim_summary IS NULL;

-- 4. Remove ansimSummary from evidence JSON in ai_revisions
UPDATE public.ai_revisions
SET evidence = evidence - 'ansimSummary'
WHERE evidence ? 'ansimSummary';

-- 5. Migrate existing ansim_summary from evidence in ai_backups (just in case)
UPDATE public.ai_backups
SET ansim_summary = evidence->>'ansimSummary'
WHERE evidence ? 'ansimSummary' AND ansim_summary IS NULL;

-- 6. Remove ansimSummary from evidence JSON in ai_backups
UPDATE public.ai_backups
SET evidence = evidence - 'ansimSummary'
WHERE evidence ? 'ansimSummary';
