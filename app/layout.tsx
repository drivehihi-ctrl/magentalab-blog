import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Magentalab 반려동물 연구소 | 블로그",
  description: "Magentalab 반려동물 연구소의 최신 연구 소식과 반려동물 건강 정보를 확인하세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <footer className="bg-gray-50 border-t border-gray-100 py-12">
          <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
            &copy; 2026 Magentalab. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
