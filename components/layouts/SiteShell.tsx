import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/providers/SessionProvider";
import KakaoScript from "@/components/KakaoScript";
import { Analytics } from "@vercel/analytics/react";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="overflow-x-hidden w-full flex flex-col min-h-screen">
        <KakaoScript />
        <Header />
        <main className="flex-grow">{children}</main>
        <Analytics />
        <Footer />
      </div>
    </SessionProvider>
  );
}
