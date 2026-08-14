import { supabaseAdmin } from '@/lib/supabase-admin';
import { RevisionRepository, BackupRepository, EvidenceRepository, AuditLogRepository, AuditRepository, ContentAuditResult } from '../types';
import { AIRevision, AIBackup, AILog, EvidenceData } from '@/lib/ai-revisions';

export const supabaseRevisionRepository: RevisionRepository = {
  async list(): Promise<AIRevision[]> {
    const { data, error } = await supabaseAdmin.from('ai_revisions').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase getRevisions error:', error);
      return [];
    }
    return data as AIRevision[];
  },
  async get(id: string): Promise<AIRevision | undefined> {
    const { data, error } = await supabaseAdmin.from('ai_revisions').select('*').eq('revision_id', id).single();
    if (error) {
      console.error('Supabase getRevision error:', error);
      return undefined;
    }
    return data as AIRevision;
  },
  async save(revision: AIRevision): Promise<void> {
    const { error } = await supabaseAdmin.from('ai_revisions').upsert({
      revision_id: revision.revision_id,
      wordpress_id: revision.wordpress_id,
      content_id: revision.content_id,
      language: revision.language,
      slug: revision.slug,
      source_modified_at: revision.source_modified_at,
      previous_title: revision.previous_title,
      new_title: revision.new_title,
      previous_content: revision.previous_content,
      new_content: revision.new_content,
      previous_excerpt: revision.previous_excerpt,
      new_excerpt: revision.new_excerpt,
      previous_meta_description: revision.previous_meta_description,
      new_meta_description: revision.new_meta_description,
      media_changes: revision.media_changes,
      evidence: revision.evidence,
      reason: revision.reason,
      source: revision.source,
      status: revision.status,
      medical_reviewed: revision.medical_reviewed,
      created_at: revision.created_at,
      updated_at: new Date().toISOString(),
      ...(revision.status === 'approved' ? { approved_at: new Date().toISOString() } : {}),
      ...(revision.status === 'applied' ? { applied_at: new Date().toISOString() } : {}),
      ...(revision.status === 'rolled_back' ? { rolled_back_at: new Date().toISOString() } : {})
    }, { onConflict: 'revision_id' });

    if (error) {
      console.error('Supabase saveRevision error:', error);
      throw error;
    }
  }
};

export const supabaseBackupRepository: BackupRepository = {
  async save(backup: AIBackup): Promise<void> {
    const { error } = await supabaseAdmin.from('ai_backups').upsert({
      backup_id: backup.backup_id,
      revision_id: backup.revision_id,
      wordpress_id: backup.wordpress_id,
      title: backup.title,
      content: backup.content,
      excerpt: backup.excerpt,
      meta_description: backup.meta_description,
      slug: backup.slug,
      featured_media_id: backup.featured_media,
      evidence: backup.evidence,
      source_modified_at: backup.modified_at,
      created_at: backup.created_at
    }, { onConflict: 'backup_id' });
    if (error) {
      console.error('Supabase saveBackup error:', error);
      throw error;
    }
  },
  async getByRevision(revision_id: string): Promise<AIBackup | undefined> {
    const { data, error } = await supabaseAdmin.from('ai_backups').select('*').eq('revision_id', revision_id).single();
    if (error) {
      return undefined;
    }
    return {
      ...data,
      modified_at: data.source_modified_at,
      featured_media: data.featured_media_id
    } as AIBackup;
  }
};

export const supabaseAuditLogRepository: AuditLogRepository = {
  async log(actionLog: AILog): Promise<void> {
    const { error } = await supabaseAdmin.from('ai_audit_logs').insert({
      timestamp: actionLog.timestamp,
      action: actionLog.action,
      wordpress_id: actionLog.wordpress_id,
      content_id: actionLog.content_id,
      revision_id: actionLog.revision_id,
      source: actionLog.source,
      status: actionLog.status,
      message: actionLog.message
    });
    if (error) {
      console.error('Supabase logAction error:', error);
    }
  }
};

export const supabaseEvidenceRepository: EvidenceRepository = {
  async getByPostId(postId: number): Promise<EvidenceData | null> {
    const { data, error } = await supabaseAdmin.from('ai_evidence').select('*').eq('wordpress_id', postId).maybeSingle();
    if (error || !data) return null;
    return {
      keyInsight: data.key_insight,
      cautionNote: data.caution_note,
      references: data.references
    };
  },
  async save(postId: number, evidence: EvidenceData): Promise<void> {
    const { error } = await supabaseAdmin.from('ai_evidence').upsert({
      wordpress_id: postId,
      key_insight: evidence.keyInsight,
      caution_note: evidence.cautionNote,
      references: evidence.references,
      updated_at: new Date().toISOString()
    }, { onConflict: 'wordpress_id' });

    if (error) {
      console.error('Supabase Evidence save error:', error);
      throw error;
    }
  },
  async validate(postId: number): Promise<boolean> {
    const ev = await this.getByPostId(postId);
    return ev !== null && Array.isArray(ev.references) && ev.references.length > 0;
  },
  async restore(postId: number, evidence: EvidenceData | null): Promise<void> {
    if (evidence === null) {
      await supabaseAdmin.from('ai_evidence').delete().eq('wordpress_id', postId);
    } else {
      await this.save(postId, evidence);
    }
  }
};

function toAuditRow(result: ContentAuditResult) {
  return {
    wordpress_id: result.wordpress_id,
    content_id: result.content_id,
    language: result.language,
    quality_score: result.quality_score,
    adsense_risk: result.adsense_risk,
    evidence_score: result.evidence_score,
    medical_risk: result.medical_risk,
    structure_score: result.structure_score,
    media_score: result.media_score,
    freshness_score: result.freshness_score,
    status: result.status,
    recommended_action: result.recommended_action,
    details: result.details,
    reviewed_at: new Date().toISOString(),
    request_id: result.request_id
  };
}

function fromAuditRow(row: any): ContentAuditResult {
  const details = row.details || {};
  return {
    wordpress_id: Number(row.wordpress_id),
    content_id: String(row.content_id || row.wordpress_id),
    language: row.language,
    title: String(details.title || ''),
    slug: String(details.slug || ''),
    quality_score: Number(row.quality_score || 0),
    adsense_risk: Number(row.adsense_risk || 0),
    evidence_score: Number(row.evidence_score || 0),
    medical_risk: Number(row.medical_risk || 0),
    medical_risk_level: details.medical_risk_level === 'high' ? 'high' : 'low',
    structure_score: Number(row.structure_score || 0),
    media_score: Number(row.media_score || 0),
    freshness_score: Number(row.freshness_score || 0),
    status: row.status,
    recommended_action: row.recommended_action,
    reason: Array.isArray(details.reasons) ? details.reasons : [],
    details,
    request_id: String(row.request_id || ''),
    reviewed_at: row.reviewed_at
  };
}

export const supabaseAuditRepository: AuditRepository = {
  async saveAuditResult(result: ContentAuditResult): Promise<void> {
    const { error } = await supabaseAdmin.from('ai_content_audits').insert(toAuditRow(result));
    if (error) {
      console.error('Supabase saveAuditResult error:', error);
      throw error;
    }
  },
  async saveAuditResults(results: ContentAuditResult[]): Promise<void> {
    if (results.length === 0) return;
    const { error } = await supabaseAdmin.from('ai_content_audits').insert(results.map(toAuditRow));
    if (error) {
      console.error('Supabase saveAuditResults error:', error);
      throw error;
    }
  },
  async getLatestByPostIds(postIds: number[]): Promise<Map<number, ContentAuditResult>> {
    const uniqueIds = [...new Set(postIds)];
    if (uniqueIds.length === 0) return new Map();

    const { data, error } = await supabaseAdmin
      .from('ai_content_audits')
      .select('*')
      .in('wordpress_id', uniqueIds)
      .order('reviewed_at', { ascending: false });

    if (error) {
      console.error('Supabase getLatestByPostIds error:', error);
      throw error;
    }

    const latest = new Map<number, ContentAuditResult>();
    for (const row of data || []) {
      const postId = Number(row.wordpress_id);
      if (!latest.has(postId)) latest.set(postId, fromAuditRow(row));
    }
    return latest;
  }
};
