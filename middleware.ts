import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 오직 메인 루트('/') 경로로 최초 접속했을 때만 동작하도록 제어
  if (pathname === '/') {
    // 사용자가 강제로 한국어 메인으로 재접속하거나, 이미 처리된 경우 무한 루프를 방지하기 위해 쿠키 검사
    const hasRedirected = request.cookies.get('lang_redirected');
    if (hasRedirected) {
      return NextResponse.next();
    }

    const acceptLanguage = request.headers.get('accept-language') || '';
    
    let targetUrl = null;
    
    // 영어권 사용자 감지 (Accept-Language 헤더 분석)
    if (acceptLanguage.startsWith('en') || acceptLanguage.includes(',en')) {
      targetUrl = new URL('/en', request.url);
    } 
    // 일본어 사용자 감지
    else if (acceptLanguage.startsWith('ja') || acceptLanguage.includes(',ja')) {
      targetUrl = new URL('/ja', request.url);
    }

    if (targetUrl) {
      const response = NextResponse.redirect(targetUrl);
      // 쿠키를 하루(24시간) 동안 설정하여 반복적인 자동 리다이렉트를 막고 사용자 자유도를 보장
      response.cookies.set('lang_redirected', 'true', { maxAge: 60 * 60 * 24 });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 루트 경로('/') 접속 시에만 미들웨어를 실행하여 최상의 컴파일/렌더링 성능 보장
    '/',
  ],
};
