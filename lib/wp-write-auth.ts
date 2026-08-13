import 'server-only';

export type WordPressWriteConfig = {
  baseUrl: string;
  username: string;
  appPassword: string;
  authorization: string;
};

export function getWordPressWriteConfig(): WordPressWriteConfig {
  const baseUrl = (process.env.WORDPRESS_API_URL || '').replace(/\/$/, '');
  const username = (process.env.WORDPRESS_API_USERNAME || '').trim();
  const appPassword = (process.env.WORDPRESS_API_APP_PASSWORD || '').trim();

  if (!baseUrl || !username || !appPassword) {
    throw new Error(
      'WORDPRESS_WRITE_CONFIG_MISSING: WORDPRESS_API_URL, WORDPRESS_API_USERNAME, and WORDPRESS_API_APP_PASSWORD are required.'
    );
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
