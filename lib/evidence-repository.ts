import fs from 'fs';
import path from 'path';
import { EvidenceData } from './ai-revisions';

export interface EvidenceRepository {
  getByPostId(postId: number): Promise<EvidenceData | null>;
  save(postId: number, evidence: EvidenceData): Promise<void>;
  validate(postId: number): Promise<boolean>;
  restore(postId: number, evidence: EvidenceData | null): Promise<void>;
}

const EVIDENCE_FILE = path.join(process.cwd(), 'data', 'evidence.json');

// Helper to safely read JSON
function readEvidenceDb(): Record<string, EvidenceData> {
  if (!fs.existsSync(EVIDENCE_FILE)) {
    const dir = path.dirname(EVIDENCE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(EVIDENCE_FILE, JSON.stringify({}), 'utf-8');
    return {};
  }
  try {
    const data = fs.readFileSync(EVIDENCE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading evidence db:", err);
    return {};
  }
}

// Helper to safely write JSON
function writeEvidenceDb(db: Record<string, EvidenceData>): void {
  fs.writeFileSync(EVIDENCE_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

export const evidenceRepository: EvidenceRepository = {
  async getByPostId(postId: number): Promise<EvidenceData | null> {
    const db = readEvidenceDb();
    return db[postId.toString()] || null;
  },

  async save(postId: number, evidence: EvidenceData): Promise<void> {
    const db = readEvidenceDb();
    db[postId.toString()] = evidence;
    writeEvidenceDb(db);
  },

  async validate(postId: number): Promise<boolean> {
    const evidence = await this.getByPostId(postId);
    return evidence !== null && Array.isArray(evidence.references) && evidence.references.length > 0;
  },

  async restore(postId: number, evidence: EvidenceData | null): Promise<void> {
    const db = readEvidenceDb();
    if (evidence === null) {
      delete db[postId.toString()];
    } else {
      db[postId.toString()] = evidence;
    }
    writeEvidenceDb(db);
  }
};
