-- 20260812_ai_content_storage.sql
-- Migration file for AI Content Integration Storage

-- 1. ai_revisions table
CREATE TABLE IF NOT EXISTS ai_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revision_id TEXT UNIQUE NOT NULL,
    wordpress_id BIGINT NOT NULL,
    content_id TEXT NOT NULL,
    language TEXT NOT NULL,
    slug TEXT NOT NULL,
    source_modified_at TEXT NOT NULL,
    previous_title TEXT,
    new_title TEXT,
    previous_content TEXT,
    new_content TEXT,
    previous_excerpt TEXT,
    new_excerpt TEXT,
    previous_meta_description TEXT,
    new_meta_description TEXT,
    media_changes JSONB,
    evidence JSONB,
    reason TEXT,
    source TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    applied_at TIMESTAMP WITH TIME ZONE,
    rolled_back_at TIMESTAMP WITH TIME ZONE,
    request_id TEXT
);

-- 2. ai_backups table
CREATE TABLE IF NOT EXISTS ai_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_id TEXT UNIQUE NOT NULL,
    revision_id TEXT NOT NULL,
    wordpress_id BIGINT NOT NULL,
    content_id TEXT,
    title TEXT,
    content TEXT,
    excerpt TEXT,
    meta_description TEXT,
    slug TEXT,
    featured_media_id BIGINT,
    evidence JSONB,
    source_modified_at TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    request_id TEXT
);

-- 3. ai_evidence table
CREATE TABLE IF NOT EXISTS ai_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wordpress_id BIGINT UNIQUE NOT NULL,
    content_id TEXT,
    language TEXT,
    key_insight TEXT,
    caution_note TEXT,
    references JSONB,
    evidence_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source_revision_id TEXT
);

-- 4. ai_audit_logs table
CREATE TABLE IF NOT EXISTS ai_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    action TEXT NOT NULL,
    wordpress_id BIGINT,
    content_id TEXT,
    revision_id TEXT,
    backup_id TEXT,
    request_id TEXT,
    source TEXT,
    status TEXT,
    message TEXT,
    details JSONB
);

-- 5. ai_content_audits table
CREATE TABLE IF NOT EXISTS ai_content_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wordpress_id BIGINT NOT NULL,
    content_id TEXT,
    language TEXT,
    quality_score INT,
    adsense_risk INT,
    evidence_score INT,
    medical_risk INT,
    structure_score INT,
    media_score INT,
    freshness_score INT,
    status TEXT,
    recommended_action TEXT,
    details JSONB,
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    request_id TEXT
);

-- RLS Enable (Blocks public access by default)
ALTER TABLE ai_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_content_audits ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_revisions_wordpress_id ON ai_revisions(wordpress_id);
CREATE INDEX IF NOT EXISTS idx_ai_revisions_status ON ai_revisions(status);
CREATE INDEX IF NOT EXISTS idx_ai_backups_wordpress_id ON ai_backups(wordpress_id);
CREATE INDEX IF NOT EXISTS idx_ai_backups_revision_id ON ai_backups(revision_id);
CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_wordpress_id ON ai_audit_logs(wordpress_id);
CREATE INDEX IF NOT EXISTS idx_ai_content_audits_wordpress_id ON ai_content_audits(wordpress_id);
