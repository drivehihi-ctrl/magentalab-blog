import { getPost } from '@/lib/wp';
import { sanitizeForSeo } from '@/lib/utils';
import { saveRevision, logAction, AIRevision } from '@/lib/ai-revisions';
import { assessMedicalRisk } from '@/lib/medical-risk';
import { revisionRepository } from '@/lib/repositories';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

export interface CreateRevisionPayload {
  wordpress_id: number;
  source_modified_at: string;
  new_title: string;
  new_content: string;
  new_excerpt: string;
  new_meta_description?: string;
  evidence?: {
    keyInsight: string;
    cautionNote: string;
    references: Array<{
      title: string;
      org: string;
      type: string;
      url: string;
    }>;
  };
  reason: string;
}

export class RevisionError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'RevisionError';
  }
}

export interface CreateRevisionResult {
  revision: AIRevision;
  medical_risk: number;
  medical_risk_level: 'high' | 'low';
  evidence_persisted: boolean;
}

export async function createPendingRevision(payload: CreateRevisionPayload, source: string = 'chatgpt'): Promise<CreateRevisionResult> {
  const { wordpress_id, source_modified_at, new_title, new_content, new_excerpt, reason, evidence } = payload;

  if (!wordpress_id) {
    throw new RevisionError('INVALID_REQUEST', 'wordpress_id is required');
  }
  if (!source_modified_at || typeof source_modified_at !== 'string') {
    throw new RevisionError('INVALID_REQUEST', 'source_modified_at is required and must be a string');
  }

  // Reject immutable extra fields if they sneak in
  const immutableFields = ['slug', 'status', 'featured_media', 'categories', 'tags', 'content_id', 'language', 'medical_reviewed'];
  const passedKeys = Object.keys(payload as any);
  for (const field of immutableFields) {
    if (passedKeys.includes(field)) {
      throw new RevisionError('MCP_INVALID_INPUT', `Cannot mutate immutable field: ${field}`);
    }
  }

  const post = await getPost(wordpress_id.toString(), { noCache: true });
  if (!post) {
    throw new RevisionError('NOT_FOUND', 'Original post not found');
  }

  // 1. Optimistic Locking
  if (source_modified_at !== post.modified) {
    throw new RevisionError('POST_CHANGED_SINCE_READ', `Post has been modified since it was read. Expected ${source_modified_at}, found ${post.modified}`);
  }

  // (Duplicate Guard moved down)

  const slug = post.slug || '';
  const lang = slug.endsWith('-en') ? 'en' : slug.endsWith('-ja') ? 'ja' : 'ko';

  const unsafeContent = new_content || '';
  if (!unsafeContent.trim()) {
    throw new RevisionError('INVALID_REQUEST', 'new_content cannot be empty');
  }

  // 3. Security blocks
  if (unsafeContent.toLowerCase().includes('<script') || unsafeContent.toLowerCase().includes('<iframe')) {
    throw new RevisionError('UNSAFE_HTML', 'Script or Iframe tags are not allowed');
  }

  // 4. Content Validation (Truncation, structural integrity)
  // Evidence duplication block
    if (unsafeContent.includes('[근거]')) {
      throw new RevisionError('EVIDENCE_DUPLICATED_IN_BODY', 'Evidence blocks [근거] should not be in the body content');
    }

    if (!unsafeContent.includes("Ansim-i's Research Summary") && !unsafeContent.includes('Research Summary')) {
      throw new RevisionError('STRUCTURE_VALIDATION', 'Missing Research Summary in content');
    }

    const origLength = post.content.rendered.length;
    if (origLength > 1000 && unsafeContent.length < origLength * 0.3) {
      throw new RevisionError('CONTENT_TRUNCATION_DETECTED', 'Content length is abnormally short compared to original (< 30%)');
    }

    const checkTags = ['div', 'table', 'ul', 'ol'];
    for (const tag of checkTags) {
      const openCount = (unsafeContent.match(new RegExp(`<${tag}(\\s|>)`, 'gi')) || []).length;
      const closeCount = (unsafeContent.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
      if (openCount > closeCount) {
        throw new RevisionError('CONTENT_TRUNCATION_DETECTED', `Unclosed HTML tag detected: <${tag}>`);
      }
    }

    const trimmed = unsafeContent.trim();
    if (/<[a-z]+[^>]*$/i.test(trimmed)) {
      throw new RevisionError('CONTENT_TRUNCATION_DETECTED', 'Content ends abruptly inside an HTML tag');
    }
    if (/="[^"]*$/i.test(trimmed)) {
      throw new RevisionError('CONTENT_TRUNCATION_DETECTED', 'Content ends abruptly inside an HTML attribute');
    }

    try {
      const $ = cheerio.load(unsafeContent);
      if (unsafeContent.length > 50 && $('body').text().trim().length === 0 && !unsafeContent.includes('<img')) {
        throw new RevisionError('CONTENT_TRUNCATION_DETECTED', 'Cheerio parsed an empty body from the HTML');
      }
    } catch (e) {
      throw new RevisionError('CONTENT_TRUNCATION_DETECTED', 'HTML parsing failed with Cheerio');
    }

  // 5. Medical Risk Assessment
  const risk = assessMedicalRisk(slug, new_title || post.title.rendered, unsafeContent || post.content.rendered);

  // 6. Evidence Validation
  if (evidence) {
    if (evidence.references && Array.isArray(evidence.references)) {
      for (const ref of evidence.references) {
        if (!ref.title || !ref.org || !ref.type || !ref.url) {
          throw new RevisionError('MCP_EVIDENCE_INVALID', 'Evidence references must contain title, org, type, and url');
        }
        
        try {
          const u = new URL(ref.url);
          if (u.protocol !== 'http:' && u.protocol !== 'https:') {
            throw new RevisionError('MCP_EVIDENCE_INVALID', 'Invalid evidence URL protocol');
          }
          
          const hostname = u.hostname.toLowerCase();
          const fakeDomains = ['example.com', 'localhost', '127.0.0.1', 'fake.test', 'invalid.test'];
          if (fakeDomains.includes(hostname) || hostname.includes('localhost') || hostname.endsWith('.test')) {
            throw new RevisionError('MCP_EVIDENCE_INVALID', 'Placeholder or invalid evidence URL detected');
          }
        } catch (e) {
          throw new RevisionError('MCP_EVIDENCE_INVALID', `Invalid evidence URL format: ${ref.url}`);
        }
      }
    }
  } else if (risk.isMedical) {
    // Medical evidence missing guard
    throw new RevisionError('MEDICAL_EVIDENCE_MISSING', 'Medical content requires structured evidence');
  }

  const revision_id = `rev_${crypto.randomBytes(8).toString('hex')}`;

  const revision: AIRevision = {
    revision_id,
    wordpress_id: post.id,
    content_id: post.id.toString(),
    language: lang,
    slug,
    source_modified_at: post.modified,
    previous_title: post.title.rendered,
    new_title: new_title || post.title.rendered,
    previous_content: post.content.rendered,
    new_content: new_title ? '' : post.content.rendered,
    previous_excerpt: post.excerpt.rendered,
    new_excerpt: new_excerpt || post.excerpt.rendered,
    previous_meta_description: sanitizeForSeo(post.excerpt.rendered, 160),
    new_meta_description: payload.new_meta_description ? sanitizeForSeo(payload.new_meta_description, 160) : sanitizeForSeo(new_excerpt || post.excerpt.rendered, 160),
    reason: reason || 'AI Update',
    source: source,
    status: 'pending_review',
    created_at: new Date().toISOString(),
    medical_reviewed: false,
    evidence: evidence
  };

  if (unsafeContent) {
    revision.new_content = unsafeContent;
  }

  // Duplicate Revision Guard
  const allRevisions = await revisionRepository.list();
  const activeRevisions = allRevisions.filter(r => 
    r.wordpress_id === wordpress_id && 
    (r.status === 'pending_review' || (r.status === 'approved' && r.source_modified_at === post.modified))
  );
  if (activeRevisions.length > 0) {
    const activeIds = activeRevisions.map(r => r.revision_id).join(', ');
    throw new RevisionError('MCP_REVISION_CONFLICT', `An active revision already exists for this post. (${activeIds})`);
  }

  await saveRevision(revision);

  let evidence_persisted = false;
  if (evidence) {
    const savedRevision = await revisionRepository.get(revision.revision_id);
    const sameCount = savedRevision?.evidence?.references?.length === evidence.references.length;
    const sameUrl = savedRevision?.evidence?.references?.[0]?.url === evidence.references[0]?.url;
    if (!savedRevision || !savedRevision.evidence || !sameCount || !sameUrl) {
      throw new RevisionError('EVIDENCE_DATA_NOT_PERSISTED', 'Failed to verify evidence persistence in repository.');
    }
    evidence_persisted = true;
  }

  await logAction({
    timestamp: revision.created_at,
    action: 'CREATE_REVISION',
    wordpress_id: post.id,
    content_id: post.id.toString(),
    revision_id: revision.revision_id,
    source: revision.source,
    status: 'success'
  });

  return {
    revision,
    medical_risk: risk.score,
    medical_risk_level: risk.level,
    evidence_persisted
  };
}
