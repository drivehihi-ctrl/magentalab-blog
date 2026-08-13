import { AIRevision, AIBackup, AILog, EvidenceData } from '@/lib/ai-revisions';

export interface RevisionRepository {
  list(): Promise<AIRevision[]>;
  get(id: string): Promise<AIRevision | undefined>;
  save(revision: AIRevision): Promise<void>;
}

export interface BackupRepository {
  save(backup: AIBackup): Promise<void>;
  getByRevision(revision_id: string): Promise<AIBackup | undefined>;
}

export interface AuditLogRepository {
  log(actionLog: AILog): Promise<void>;
}

export interface EvidenceRepository {
  getByPostId(postId: number): Promise<EvidenceData | null>;
  save(postId: number, evidence: EvidenceData): Promise<void>;
  validate(postId: number): Promise<boolean>;
  restore(postId: number, evidence: EvidenceData | null): Promise<void>;
}

export interface ContentAuditResult {
  wordpress_id: number;
  content_id: string;
  language: 'ko' | 'en' | 'ja';
  title: string;
  slug: string;
  quality_score: number;
  adsense_risk: number;
  evidence_score: number;
  medical_risk: number;
  medical_risk_level: 'high' | 'low';
  medical_signals?: string[];
  structure_score: number;
  media_score: number;
  freshness_score: number;
  status: 'green' | 'yellow' | 'red';
  recommended_action: 'rewrite_with_evidence' | 'enhance_structure' | 'none';
  reason: string[];
  details: Record<string, unknown>;
  request_id: string;
  reviewed_at?: string;
}

export interface AuditRepository {
  saveAuditResult(result: ContentAuditResult): Promise<void>;
  saveAuditResults(results: ContentAuditResult[]): Promise<void>;
  getLatestByPostIds(postIds: number[]): Promise<Map<number, ContentAuditResult>>;
}
