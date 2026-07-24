'use client';

import Script from 'next/script';

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || 'a1fac81ff513c131e308c17f7b442343';

export default function KakaoScript() {
  const handleKakaoInit = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }
    }
  };

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      onLoad={handleKakaoInit}
      strategy="afterInteractive"
    />
  );
}
