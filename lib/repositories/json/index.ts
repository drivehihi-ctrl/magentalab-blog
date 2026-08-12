import fs from 'fs';
import path from 'path';
import { RevisionRepository, BackupRepository, EvidenceRepository, AuditLogRepository, AuditRepository } from '../types';
import { AIRevision, AIBackup, AILog, EvidenceData } from '@/lib/ai-revisions';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filename: string): T[] {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeJsonFile<T>(filename: string, data: T[]) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export const jsonRevisionRepository: RevisionRepository = {
  async list(): Promise<AIRevision[]> {
    return readJsonFile<AIRevision>('revisions.json');
  },
  async get(id: string): Promise<AIRevision | undefined> {
    return readJsonFile<AIRevision>('revisions.json').find(r => r.revision_id === id);
  },
  async save(revision: AIRevision): Promise<void> {
    const revisions = readJsonFile<AIRevision>('revisions.json');
    const index = revisions.findIndex(r => r.revision_id === revision.revision_id);
    if (index >= 0) {
      revisions[index] = revision;
    } else {
      revisions.push(revision);
    }
    writeJsonFile('revisions.json', revisions);
  }
};

export const jsonBackupRepository: BackupRepository = {
  async save(backup: AIBackup): Promise<void> {
    const backups = readJsonFile<AIBackup>('backups.json');
    backups.push(backup);
    writeJsonFile('backups.json', backups);
  },
  async getByRevision(revision_id: string): Promise<AIBackup | undefined> {
    return readJsonFile<AIBackup>('backups.json').find(b => b.revision_id === revision_id);
  }
};

export const jsonAuditLogRepository: AuditLogRepository = {
  async log(actionLog: AILog): Promise<void> {
    const logs = readJsonFile<AILog>('audit_log.json');
    logs.push(actionLog);
    writeJsonFile('audit_log.json', logs);
  }
};

export const jsonEvidenceRepository: EvidenceRepository = {
  async getByPostId(postId: number): Promise<EvidenceData | null> {
    const db = readJsonFile<any>('evidence_wrapper.json'); // Actually evidence.json is an object not array.
    // wait, we need custom logic for evidence.json because it's a Record<string, EvidenceData>
    const filePath = path.join(DATA_DIR, 'evidence.json');
    if (!fs.existsSync(filePath)) return null;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return data[postId.toString()] || null;
  },
  async save(postId: number, evidence: EvidenceData): Promise<void> {
    const filePath = path.join(DATA_DIR, 'evidence.json');
    let data: Record<string, EvidenceData> = {};
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    data[postId.toString()] = evidence;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  },
  async validate(postId: number): Promise<boolean> {
    const evidence = await this.getByPostId(postId);
    return evidence !== null && Array.isArray(evidence.references) && evidence.references.length > 0;
  },
  async restore(postId: number, evidence: EvidenceData | null): Promise<void> {
    const filePath = path.join(DATA_DIR, 'evidence.json');
    let data: Record<string, EvidenceData> = {};
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    if (evidence === null) {
      delete data[postId.toString()];
    } else {
      data[postId.toString()] = evidence;
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
};

export const jsonAuditRepository: AuditRepository = {
  async saveAuditResult(result: any): Promise<void> {
    // Phase 4 content audits are just returned in API for now, not saved locally, but we can implement it
    const audits = readJsonFile<any>('content_audits.json');
    audits.push(result);
    writeJsonFile('content_audits.json', audits);
  }
};
