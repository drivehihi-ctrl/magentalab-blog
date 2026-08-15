import { compareCanonicalContent, compareNormalized } from './verification-helpers.ts';

export interface RebaseBaseline {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featured_media?: number;
}

export interface RebaseCurrentPost {
  title?: { rendered?: string };
  content?: { rendered?: string };
  excerpt?: { rendered?: string };
  slug?: string;
  status?: string;
  featured_media?: number;
}

export function getRebaseMismatches(
  baseline: RebaseBaseline,
  current: RebaseCurrentPost
): string[] {
  const mismatches: string[] = [];

  if (!compareNormalized(baseline.title, current.title?.rendered)) mismatches.push('title');
  if (!compareCanonicalContent(baseline.content, current.content?.rendered)) mismatches.push('content');
  if (!compareNormalized(baseline.excerpt, current.excerpt?.rendered)) mismatches.push('excerpt');
  if (baseline.slug !== current.slug) mismatches.push('slug');
  if (current.status !== 'publish') mismatches.push('status');
  if (baseline.featured_media !== undefined && baseline.featured_media !== current.featured_media) {
    mismatches.push('featured_media');
  }

  return mismatches;
}
