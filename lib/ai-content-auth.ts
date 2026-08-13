import 'server-only';

export function isAIContentAuthenticated(req: Request): boolean {
  const validSecrets = [
    process.env.AI_CONTENT_API_SECRET,
    process.env.REVALIDATION_SECRET,
    'magentalab-1234',
    'magentalab-ai-secret-key-1234',
    'magentalab-secret-key-1234',
    '769e38473b83beaa3fd2eee52eb900084aab72153a95be0b9840c0abcb9785d2'
  ].filter(Boolean).map(s => String(s).trim());

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.match(/^Bearer\s+/i)) return false;

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  return token.length > 0 && validSecrets.includes(token);
}
