import { RevisionRepository, BackupRepository, EvidenceRepository, AuditLogRepository, AuditRepository } from './types';
import { jsonRevisionRepository, jsonBackupRepository, jsonEvidenceRepository, jsonAuditLogRepository, jsonAuditRepository } from './json';
import { supabaseRevisionRepository, supabaseBackupRepository, supabaseEvidenceRepository, supabaseAuditLogRepository, supabaseAuditRepository } from './supabase';

const BACKEND = process.env.AI_STORAGE_BACKEND || 'json';
const IS_PROD = process.env.NODE_ENV === 'production';

if (IS_PROD && BACKEND === 'json') {
  // Fail-fast if someone tries to use JSON in production without explicit override (if even allowed)
  throw new Error("STORAGE_BACKEND_NOT_ALLOWED: JSON storage cannot be used in production environment.");
}

export const revisionRepository: RevisionRepository = BACKEND === 'supabase' ? supabaseRevisionRepository : jsonRevisionRepository;
export const backupRepository: BackupRepository = BACKEND === 'supabase' ? supabaseBackupRepository : jsonBackupRepository;
export const evidenceRepository: EvidenceRepository = BACKEND === 'supabase' ? supabaseEvidenceRepository : jsonEvidenceRepository;
export const auditLogRepository: AuditLogRepository = BACKEND === 'supabase' ? supabaseAuditLogRepository : jsonAuditLogRepository;
export const auditRepository: AuditRepository = BACKEND === 'supabase' ? supabaseAuditRepository : jsonAuditRepository;
