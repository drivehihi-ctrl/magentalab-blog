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

  return NextResponse.next();

}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
