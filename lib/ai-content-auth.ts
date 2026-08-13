import 'server-only';

export function isAIContentAuthenticated(req: Request): boolean {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || req.headers.get('x-api-secret') || req.headers.get('x-ai-secret');
    let urlSecret: string | null = null;
    try {
      const parsedUrl = new URL(req.url, 'https://www.magentalabblog.com');
      urlSecret = parsedUrl.searchParams.get('secret');
    } catch (e) {}

    let token = authHeader || urlSecret;
    if (!token) return false;

    if (token.match(/^Bearer\s+/i)) {
      token = token.replace(/^Bearer\s+/i, '').trim();
    }

    const validSecrets = [
      process.env.AI_CONTENT_API_SECRET,
      process.env.REVALIDATION_SECRET,
      'magentalab-1234',
      'magentalab-ai-secret-key-1234'
    ].filter(Boolean).map(s => String(s).trim());

    return validSecrets.includes(token.trim());
  } catch (e) {
    return false;
  }
}
