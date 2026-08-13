import { NextResponse } from 'next/server';
import { isAIContentAuthenticated } from '@/lib/ai-content-auth';
import { getWordPressWriteConfig } from '@/lib/wp-write-auth';

export async function GET(req: Request) {
  if (!isAIContentAuthenticated(req)) {
    return NextResponse.json({ error: 'AUTH_FAILED', message: 'Invalid API secret' }, { status: 401 });
  }

  try {
    const { baseUrl, authorization } = getWordPressWriteConfig();
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: authorization,
        'User-Agent': 'MagentaLab-AI-Content/1.0'
      },
      cache: 'no-store'
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      user_id: response.ok ? data?.id ?? null : null,
      user_name: response.ok ? data?.name ?? null : null,
      message: response.ok ? 'WordPress authentication succeeded.' : 'WordPress authentication failed.'
    }, { status: response.ok ? 200 : response.status });
  } catch {
    return NextResponse.json({
      success: false,
      error: 'WORDPRESS_AUTH_CHECK_FAILED'
    }, { status: 500 });
  }
}
