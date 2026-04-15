import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react";
import { GoogleTagManager } from "@next/third-parties/google";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.magentalabblog.com"),
  title: "Magentalab 반려동물 연구소 | 블로그",
  description: "Magentalab 반려동물 연구소의 최신 연구 소식과 반려동물 건강 정보를 확인하세요.",
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
                "https://magentalab.mycafe24.com"
              ]
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Analytics />
        <footer className="bg-gray-50 border-t border-gray-100 py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
              <div className="max-w-md">
                <p className="text-gray-900 font-bold mb-2">Magentalab 반려동물 연구소</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  본 정보는 참고용이며, 정확한 진단은 반드시 수의사와 상담하십시오. <br />
                  Magentalab은 데이터에 기반한 정보 제공을 목적으로 합니다.
                </p>
              </div>
              <nav className="flex flex-wrap gap-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <Link href="/privacy" className="hover:text-magenta transition-colors">개인정보처리방침</Link>
                <Link href="/terms" className="hover:text-magenta transition-colors">이용약관</Link>
                <Link href="/about" className="hover:text-magenta transition-colors">연구소 소개</Link>
              </nav>
            </div>
            <div className="pt-8 border-t border-gray-100 text-center text-gray-400 text-[10px] uppercase tracking-[0.2em]">
              &copy; 2026 Magentalab. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
