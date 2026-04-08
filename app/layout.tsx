import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://magentalab-blog.vercel.app"),
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
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5J3WFMZS');`,
          }}
        />
        {/* End Google Tag Manager */}
        <link rel="stylesheet" as="style" crossOrigin="" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-5J3WFMZS"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Header />
        <main>{children}</main>
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
