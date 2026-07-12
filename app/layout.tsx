import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
