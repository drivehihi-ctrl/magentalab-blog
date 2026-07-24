'use client';

import Script from 'next/script';

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '186380c4d2f6974b4c29d1be55963a4a';

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
