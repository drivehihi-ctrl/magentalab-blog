import 'server-only';
import { timingSafeEqual } from 'crypto';

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function isAIContentAuthenticated(req: Request): boolean {
  try {
    const configuredSecret = process.env.AI_CONTENT_API_SECRET?.trim();
    if (!configuredSecret) {
      console.error('AI_CONTENT_API_SECRET is not configured');
      return false;
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) return false;

    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) return false;

    const token = match[1].trim();
    if (!token) return false;

    return safeEqual(token, configuredSecret);
  } catch {
    return false;
  }
}
