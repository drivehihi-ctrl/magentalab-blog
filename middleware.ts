import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 네이버, 구글, 빙 등 검색엔진 봇 User-Agent 목록
const BOT_USER_AGENTS = [
  'googlebot',
  'yeti',          // 네이버 검색봇
  'naverbot',
  'bingbot',
  'slurp',
  'baiduspider',
  'duckduckbot',
  'gptbot',
  'chatgpt-user',
  'claudebot',
  'perplexitybot',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  const isMapDomain = host.startsWith('map.') || host.startsWith('map-') || pathname.startsWith('/map');

  // 스태틱 파일(이미지, 폰트 등) 요청은 서브도메인 리라이트 대상에서 제외
  const isStaticAsset =
    pathname.startsWith('/images/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|json|xml|txt)$/i.test(pathname);

  // 1. 봇 차단 및 noindex 헤더 설정 (map 서브도메인 & /map 경로 대상)
  if (isMapDomain) {
    // 봇 크롤러 접근 시 즉시 차단 (403 Forbidden)
    const isBot = BOT_USER_AGENTS.some((bot) => userAgent.includes(bot));
    if (isBot) {
      return new NextResponse('Access Denied for Search Crawlers', {
        status: 403,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
        },
      });
    }

    let response: NextResponse;

    if ((host.startsWith('map.') || host.startsWith('map-')) && !pathname.startsWith('/map') && !isStaticAsset) {
      const url = request.nextUrl.clone();
      url.pathname = `/map${pathname === '/' ? '' : pathname}`;
      response = NextResponse.rewrite(url);
    } else {
      response = NextResponse.next();
    }

    // 강력한 검색엔진 차단 HTTP 헤더 부여
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    return response;
  }

  
  // 2. 메인 루트('/') 경로 접속 시 언어별(en, ja) 자동 감지 리다이렉트
  if (pathname === '/') {
    const hasRedirected = request.cookies.get('lang_redirected');
    if (hasRedirected) {
      return NextResponse.next();
    }

    const acceptLanguage = request.headers.get('accept-language') || '';
    let targetUrl = null;
    
    if (acceptLanguage.startsWith('en') || acceptLanguage.includes(',en')) {
      targetUrl = new URL('/en', request.url);
    } else if (acceptLanguage.startsWith('ja') || acceptLanguage.includes(',ja')) {
      targetUrl = new URL('/ja', request.url);
    }

    if (targetUrl) {
      const res = NextResponse.redirect(targetUrl);
      res.cookies.set('lang_redirected', 'true', { maxAge: 60 * 60 * 24 });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
