import fs from 'fs';
import path from 'path';
import { RevisionRepository, BackupRepository, EvidenceRepository, AuditLogRepository, AuditRepository, ContentAuditResult } from '../types';
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
  async saveAuditResult(result: ContentAuditResult): Promise<void> {
    const audits = readJsonFile<ContentAuditResult>('content_audits.json');
    audits.push(result);
    writeJsonFile('content_audits.json', audits);
  },
  async saveAuditResults(results: ContentAuditResult[]): Promise<void> {
    if (results.length === 0) return;
    const audits = readJsonFile<ContentAuditResult>('content_audits.json');
    audits.push(...results);
    writeJsonFile('content_audits.json', audits);
  }
};
