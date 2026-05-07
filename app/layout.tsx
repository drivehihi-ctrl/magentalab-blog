import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react";
import { GoogleTagManager } from "@next/third-parties/google";

import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.magentalabblog.com"),
  title: {
    default: "Magentalab 반려동물 연구소 | 블로그",
    template: "%s | Magentalab"
  },
  description: "Magentalab 반려동물 연구소의 최신 연구 소식과 반려동물 건강 정보를 확인하세요.",
  keywords: ["반려동물", "강아지", "고양이", "건강", "행동연구", "전용몰", "안심이"],
  authors: [{ name: "Magentalab" }],
  creator: "Magentalab",
  publisher: "Magentalab",
  metadataBase: new URL("https://www.magentalabblog.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Magentalab",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.magentalabblog.com",
    siteName: "Magentalab",
    title: "Magentalab 반려동물 연구소",
    description: "데이터와 과학으로 반려동물의 더 나은 삶을 연구합니다. 마젠타랩 블로그에서 최신 연구 소식을 만나보세요.",
    images: [
      {
        url: "/images/favicon.png",
        width: 1200,
        height: 630,
        alt: "Magentalab Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Magentalab 반려동물 연구소",
    description: "반려동물 건강 연구의 모든 것",
    images: ["/images/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <GoogleTagManager gtmId="GTM-5J3WFMZS" />
      <head>
        <meta name="google-site-verification" content="nF22SWcLm8AvJD46bLfNyKCJCMvqHS8SuYoiMeEITwE" />
        <meta name="google-site-verification" content="VfH9EadRthwV5nSVTz48foI3UEdvbXxy8cM69fhqvng" />
        <meta name="naver-site-verification" content="ea62c76d32e97c188c8c9d032fe9ae187c630fe6" />
        <link rel="alternate" type="application/rss+xml" href="/rss.xml" title="Magentalab RSS Feed" />
        <link rel="stylesheet" as="style" crossOrigin="" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Magentalab 반려동물 연구소",
              "url": "https://www.magentalabblog.com",
              "logo": "https://www.magentalabblog.com/logo.png",
              "sameAs": [
                "https://magentalab.mycafe24.com",
                "https://blog.naver.com/magentalab", // 예시: 네이버 블로그
                "https://www.instagram.com/magentalab" // 예시: 인스타그램
              ]
            }),
          }}
        />
        <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" async></script>
      </head>
      <body className="antialiased">
        <SessionProvider>
          <Header />
          <main>{children}</main>
          <Analytics />
          <footer className="bg-gray-50 border-t border-gray-100 py-16 text-gray-600">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 text-left">
                <div className="space-y-4">
                  <p className="text-gray-900 font-bold">마젠타랩 (MagentaLab)</p>
                  <div className="text-[11px] text-gray-500 leading-relaxed space-y-1 font-medium">
                    <p>대표이사 : 김범준 | 사업자등록번호 : 448-07-03101</p>
                    <p>통신판매업 신고 : 제 2025-경기김포-1339호 | 호스팅 : Vercel Inc.</p>
                    <p>주소 : 경기도 김포시 김포한강11로255번길 149, 112동 701호</p>
                    <p>고객센터 : 0502-1933-8452 | 이메일 : smagentalab@gmail.com</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-900 font-bold text-sm">Magentalab 반려동물 연구소</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    본 정보는 참고용이며, 정확한 진단은 반드시 수의사와 상담하십시오. <br />
                    Magentalab은 데이터에 기반한 정보 제공을 목적으로 합니다.
                  </p>
                  <nav className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-2">
                    <Link href="/privacy" className="hover:text-magenta transition-colors">개인정보처리방침</Link>
                    <Link href="/terms" className="hover:text-magenta transition-colors">이용약관</Link>
                    <Link href="/about" className="hover:text-magenta transition-colors">연구소 소개</Link>
                  </nav>
                </div>
              </div>
              <div className="pt-8 border-t border-gray-100 text-center text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                &copy; 2026 Magentalab. All rights reserved.
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
