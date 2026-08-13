import 'server-only';

export type WordPressWriteConfig = {
  baseUrl: string;
  username: string;
  appPassword: string;
  authorization: string;
};

export function getWordPressWriteConfig(): WordPressWriteConfig {
  const baseUrl = (process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || '').replace(/\/$/, '');
  const username = (process.env.WORDPRESS_API_USERNAME || process.env.WP_USER || '').trim();
  const appPassword = (process.env.WORDPRESS_API_APP_PASSWORD || process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD || '').trim();

  if (!baseUrl || !username || !appPassword) {
    throw new Error('WORDPRESS_WRITE_CONFIG_MISSING: configure WORDPRESS_API_URL/NEXT_PUBLIC_WORDPRESS_URL plus WORDPRESS_API_USERNAME (or WP_USER) and WORDPRESS_API_APP_PASSWORD (or legacy WP_SEO_APP_PASSWORD/WP_APP_PASSWORD).');
  }

  return {
    baseUrl,
    username,
    appPassword,
    authorization: `Basic ${Buffer.from(`${username}:${appPassword}`).toString('base64')}`
  };
}

export function getWordPressWriteHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const { authorization } = getWordPressWriteConfig();
  return {
    Authorization: authorization,
    'X-Authorization': authorization,
    'x-http-authorization': authorization,
    'User-Agent': 'MagentaLab-AI-Content/1.0',
    ...extra
  };
}
