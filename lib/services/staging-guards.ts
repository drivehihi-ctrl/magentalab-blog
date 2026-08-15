export function stagingSlug(wordpressId: number, revisionId: string): string {
  const suffix = revisionId.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 48);
  return `magentalab-staging-${wordpressId}-${suffix}`;
}
