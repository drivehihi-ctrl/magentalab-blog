import * as cheerio from 'cheerio';

/**
 * Normalizes text/HTML strings for strict comparison between expected revision values
 * and WordPress REST API rendered values.
 * Performs NFC Unicode normalization, zero-width character removal,
 * HTML entity decoding, block/br tag boundary spacing, tag stripping, and whitespace collapsing.
 */
export function normalizeText(input: string | undefined | null): string {
  if (!input) return '';

  let text = input
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/<(?:\/?(?:p|div|h[1-6]|li|ul|ol|tr|td|th|table|blockquote|section|article|header|footer|figcaption|figure|hr)|br\s*\/?)>/gi, ' ');

  try {
    const $ = cheerio.load(`<body>${text}</body>`);
    text = $('body').text();
  } catch {}

  return text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
}

/**
 * Compares two strings after canonical normalization.
 * Returns true ONLY if both strings exist and match exactly (normA === normB).
 * No similarity or fuzzy fallback is permitted in verification.
 */
export function compareNormalized(a: string | undefined | null, b: string | undefined | null): boolean {
  if (a === undefined || a === null || b === undefined || b === null) {
    return false;
  }
  const normA = normalizeText(a);
  const normB = normalizeText(b);
  if (!normA && !normB) return false;
  return normA === normB;
}

/**
 * Separate helper for similarity checking if needed outside of strict verification.
 * NOT used for apply/rollback verification.
 */
export function compareSimilarity(a: string | undefined | null, b: string | undefined | null): number {
  if (!a || !b) return 0;
  const normA = normalizeText(a);
  const normB = normalizeText(b);
  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0;

  const wordsA = new Set(normA.split(/\s+/));
  const wordsB = new Set(normB.split(/\s+/));
  let wordIntersect = 0;
  for (const w of wordsB) {
    if (wordsA.has(w)) wordIntersect++;
  }
  return wordIntersect / Math.max(wordsA.size, wordsB.size);
}

export interface EvidenceReference {
  title?: string;
  org?: string;
  type?: string;
  url?: string;
}

export interface EvidenceData {
  keyInsight?: string;
  cautionNote?: string;
  references?: EvidenceReference[];
}

/**
 * Normalizes an Evidence object for deterministic canonical comparison.
 */
export function normalizeEvidence(ev: EvidenceData | undefined | null) {
  if (!ev) return null;
  const keyInsight = (ev.keyInsight || '').trim();
  const cautionNote = (ev.cautionNote || '').trim();
  const references = (ev.references || [])
    .map(r => ({
      title: (r.title || '').trim(),
      org: (r.org || '').trim(),
      type: (r.type || '').trim(),
      url: (r.url || '').trim(),
    }))
    .sort((a, b) => a.url.localeCompare(b.url) || a.title.localeCompare(b.title));

  if (!keyInsight && !cautionNote && references.length === 0) {
    return null;
  }

  return { keyInsight, cautionNote, references };
}

/**
 * Compares two Evidence objects for exact structure, content, and null symmetry.
 */
export function compareEvidence(ev1: EvidenceData | undefined | null, ev2: EvidenceData | undefined | null): boolean {
  const norm1 = normalizeEvidence(ev1);
  const norm2 = normalizeEvidence(ev2);

  if (norm1 === null && norm2 === null) return true;
  if (norm1 === null || norm2 === null) return false;

  return JSON.stringify(norm1) === JSON.stringify(norm2);
}
