import { RevisionRepository, BackupRepository, EvidenceRepository, AuditLogRepository, AuditRepository } from './types';
import { jsonRevisionRepository, jsonBackupRepository, jsonEvidenceRepository, jsonAuditLogRepository, jsonAuditRepository } from './json';
import { supabaseRevisionRepository, supabaseBackupRepository, supabaseEvidenceRepository, supabaseAuditLogRepository, supabaseAuditRepository } from './supabase';

const BACKEND = process.env.AI_STORAGE_BACKEND || (process.env.NODE_ENV === 'production' ? 'supabase' : 'json');

export const revisionRepository: RevisionRepository = BACKEND === 'supabase' ? supabaseRevisionRepository : jsonRevisionRepository;
export const backupRepository: BackupRepository = BACKEND === 'supabase' ? supabaseBackupRepository : jsonBackupRepository;
export const evidenceRepository: EvidenceRepository = BACKEND === 'supabase' ? supabaseEvidenceRepository : jsonEvidenceRepository;
export const auditLogRepository: AuditLogRepository = BACKEND === 'supabase' ? supabaseAuditLogRepository : jsonAuditLogRepository;
export const auditRepository: AuditRepository = BACKEND === 'supabase' ? supabaseAuditRepository : jsonAuditRepository;
