import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.magentalabblog.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/emergency-calculator',
          '/en/emergency-calculator',
          '/ja/emergency-calculator',
          '/map',
          '/map/',
        ],
        disallow: ['/api/', '/shop/', '/shop', '/shop/admin'],
        crawlDelay: 10,
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      {
        userAgent: 'Google-AdSense-Display',
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Bytespider', 'CCBot', 'Diffbot', 'FacebookBot', 'Google-Extended'],
        disallow: '/',
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/rss.xml`
    ],
  };
}
