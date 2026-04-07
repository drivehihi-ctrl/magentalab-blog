import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="ko" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50/50`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="py-12 border-t border-gray-100 bg-white text-center text-sm text-gray-500">
          <div className="container mx-auto px-4">
            <p className="mb-2 font-bold text-gray-900">Magentalab</p>
            <p>© {new Date().getFullYear()} Magentalab 반려동물 연구소. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
