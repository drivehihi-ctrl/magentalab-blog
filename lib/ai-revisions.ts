// Removed fs and path


export interface AIRevisionMediaChanges {
  images_added: Array<{
    media_id: number;
    src: string;
    alt: string;
    position: string;
  }>;
  new_featured_media_id?: number | null;
}

export interface EvidenceReference {
  title: string;
  org: string;
  type: string;
  url: string;
}

export interface EvidenceData {
  keyInsight: string;
  cautionNote: string;
  references: EvidenceReference[];
}

export interface AIRevision {
  revision_id: string;
  wordpress_id: number;
  content_id: string;
  language: string;
  slug: string;
  source_modified_at: string;
  previous_title: string;
  new_title: string;
  previous_content: string;
  new_content: string;
  previous_excerpt: string;
  new_excerpt: string;
  previous_meta_description: string;
  new_meta_description: string;
  previous_ansim_summary?: string;
  new_ansim_summary?: string;
  media_changes?: AIRevisionMediaChanges; // Added for Phase 3
  evidence?: EvidenceData; // Added for Phase 4
  medical_reviewed?: boolean; // Added for Phase 5.4 Medical Safety Guard
  medical_approved?: boolean; // Alias flag for medical review confirmation
  reason: string;
  source: string;
  status: 'pending_review' | 'approved' | 'applied' | 'rejected' | 'rolled_back' | 'applying' | 'rollback_pending' | 'apply_failed' | 'rollback_failed';
  created_at: string;
  rolled_back_at?: string;
}

export interface AILog {
  timestamp: string;
  action: string;
  wordpress_id: number;
  content_id: string;
  revision_id?: string;
  source: string;
  status: string;
  message?: string;
}

export interface AIBackup {
  backup_id: string;
  revision_id: string;
  wordpress_id: number;
  title: string;
  content: string;
  excerpt: string;
  meta_description: string;
  ansim_summary?: string;
  slug: string;
  featured_media?: number; // Added for Phase 3
  evidence?: EvidenceData; // Added for Phase 4
  modified_at: string;
  created_at: string;
}

import { revisionRepository, backupRepository, auditLogRepository } from './repositories';

// Revisions
export async function getRevisions(): Promise<AIRevision[]> {
  return await revisionRepository.list();
}

export async function getRevision(id: string): Promise<AIRevision | undefined> {
  return await revisionRepository.get(id);
}

export async function saveRevision(revision: AIRevision): Promise<void> {
  return await revisionRepository.save(revision);
}

export async function updateRevisionStatus(id: string, status: AIRevision['status']): Promise<void> {
  const rev = await getRevision(id);
  if (rev) {
    rev.status = status;
    await saveRevision(rev);
  }
}

// Audit Log
export async function logAction(log: AILog): Promise<void> {
  return await auditLogRepository.log(log);
}

// Backups
export async function saveBackup(backup: AIBackup): Promise<void> {
  return await backupRepository.save(backup);
}

export async function getBackupByRevision(revision_id: string): Promise<AIBackup | undefined> {
  return await backupRepository.getByRevision(revision_id);
}
