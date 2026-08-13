import 'server-only';

export function isAIContentAuthenticated(req: Request): boolean {
  const secret = process.env.AI_CONTENT_API_SECRET?.trim();
  const authHeader = req.headers.get('authorization');

  if (!secret || !authHeader?.startsWith('Bearer ')) return false;
  const token = authHeader.slice('Bearer '.length).trim();
  return token.length > 0 && token === secret;
}
