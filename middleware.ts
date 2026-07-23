import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // 1. map 서브도메인 접속 시 /map 경로로 내부 리라이트 (모든 검색엔진 봇 및 애드센스 봇 100% 허용!)
  const isStaticAsset =
    pathname.startsWith('/images/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|json|xml|txt)$/i.test(pathname);

  if ((host.startsWith('map.') || host.startsWith('map-')) && !pathname.startsWith('/map') && !isStaticAsset) {
    const url = request.nextUrl.clone();
    url.pathname = `/map${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
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
