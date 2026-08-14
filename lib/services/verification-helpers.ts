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
    .replace(/&nbsp;/g, ' ');

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
  if (!normA && !normB) return false; // empty string comparison should fail unless explicitly intended
  return normA === normB;
}
