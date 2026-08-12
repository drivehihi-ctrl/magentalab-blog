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

export interface AuditRepository {
  // To be implemented if/when we need structured audit history fetch
  saveAuditResult(result: any): Promise<void>;
}
