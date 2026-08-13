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
    token = token.trim();

    return token.length > 0;
  } catch (e) {
    return false;
  }
}
