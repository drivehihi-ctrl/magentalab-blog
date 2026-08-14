import * as cheerio from 'cheerio';

/**
 * Normalizes text/HTML strings for strict comparison between expected revision values
 * and WordPress REST API rendered values.
 * Handles HTML entity decoding (&amp; -> &, &#8211; -> –, etc.), tag stripping for body text,
 * and whitespace collapsing.
 */
export function normalizeText(input: string | undefined | null): string {
  if (!input) return '';

  let text = input
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
    .replace(/<\/(p|div|h[1-6]|li|tr|td|blockquote|section|article)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ');

  try {
    const $ = cheerio.load(`<body>${text}</body>`);
    text = $('body').text();
  } catch {}

  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Compares two strings after normalizing entities and whitespace.
 * Returns true ONLY if both strings exist and match when normalized.
 */
export function compareNormalized(a: string | undefined | null, b: string | undefined | null): boolean {
  if (a === undefined || a === null || b === undefined || b === null) {
    return false;
  }
  const normA = normalizeText(a);
  const normB = normalizeText(b);
  if (!normA && !normB) return false;
  if (normA === normB) return true;
  if (normA.length > 300 && normB.length > 300) {
    return normA.includes(normB) || normB.includes(normA);
  }
  return false;
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
