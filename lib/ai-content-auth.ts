import 'server-only';

export function isAIContentAuthenticated(req: Request): boolean {
  const secret = process.env.AI_CONTENT_API_SECRET?.trim();
  if (!secret) return false;

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.match(/^Bearer\s+/i)) return false;

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  return token.length > 0 && token === secret;
}
