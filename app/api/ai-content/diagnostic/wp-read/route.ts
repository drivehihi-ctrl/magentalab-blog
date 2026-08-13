import { NextResponse } from 'next/server';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';

// 임시 진단 라우트: Vercel Production에서 WP REST API 연결 상태 확인 (읽기 전용)
export async function GET(req: Request) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED' }, { status: 401 });
  }

  const wpUrl = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || '';
  const wpUser = process.env.WORDPRESS_API_USERNAME || process.env.WP_USER || '';
  const wpPass = process.env.WORDPRESS_API_APP_PASSWORD || process.env.WP_SEO_APP_PASSWORD || process.env.WP_APP_PASSWORD || '';

  const envStatus = {
    WORDPRESS_API_URL: wpUrl ? 'SET' : 'MISSING',
    WORDPRESS_API_USERNAME: wpUser ? 'SET' : 'MISSING',
    WORDPRESS_API_APP_PASSWORD: (process.env.WORDPRESS_API_APP_PASSWORD ? 'SET' : 'MISSING'),
    WP_SEO_APP_PASSWORD: (process.env.WP_SEO_APP_PASSWORD ? 'SET' : 'MISSING'),
    WP_APP_PASSWORD: (process.env.WP_APP_PASSWORD ? 'SET' : 'MISSING'),
    resolved_url: wpUrl || '(empty)',
    resolved_user: wpUser || '(empty)',
    resolved_pass_length: wpPass.length,
  };

  if (!wpUrl || !wpUser || !wpPass) {
    return NextResponse.json({
      error: 'WP_CONFIG_INCOMPLETE',
      env_status: envStatus
    }, { status: 500 });
  }

  const testPostId = 5800;
  const targetUrl = `${wpUrl}/wp-json/wp/v2/posts/${testPostId}?context=edit`;
  const authorization = `Basic ${Buffer.from(`${wpUser}:${wpPass}`).toString('base64')}`;

  let wpStatus: number | null = null;
  let wpContentType: string | null = null;
  let wpErrorCode: string | null = null;
  let wpErrorMessage: string | null = null;

  try {
    const wpRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'User-Agent': 'MagentaLab-AI-Diagnostic/1.0',
      },
      cache: 'no-store',
    });

    wpStatus = wpRes.status;
    wpContentType = wpRes.headers.get('content-type');

    const bodyText = await wpRes.text();

    if (!wpRes.ok) {
      try {
        const bodyJson = JSON.parse(bodyText);
        wpErrorCode = bodyJson.code || bodyJson.error || null;
        wpErrorMessage = bodyJson.message || null;
      } catch {
        // HTML or non-JSON error page
        wpErrorCode = 'NON_JSON_RESPONSE';
        wpErrorMessage = bodyText.slice(0, 120);
      }
    } else {
      // Success - just confirm the slug without exposing content
      try {
        const post = JSON.parse(bodyText);
        return NextResponse.json({
          success: true,
          env_status: envStatus,
          wp_http_status: wpStatus,
          wp_content_type: wpContentType,
          post_id: post.id,
          post_slug: post.slug,
          post_status: post.status,
        });
      } catch {
        wpErrorCode = 'JSON_PARSE_ERROR';
        wpErrorMessage = bodyText.slice(0, 120);
      }
    }
  } catch (err: any) {
    return NextResponse.json({
      error: 'FETCH_FAILED',
      env_status: envStatus,
      detail: err.message,
    }, { status: 500 });
  }

  return NextResponse.json({
    success: false,
    env_status: envStatus,
    wp_http_status: wpStatus,
    wp_content_type: wpContentType,
    wp_error_code: wpErrorCode,
    wp_error_message: wpErrorMessage,
  }, { status: 200 });
}
