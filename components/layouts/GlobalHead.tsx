import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";

export function GlobalHead() {
  return (
    <>
      <GoogleTagManager gtmId="GTM-5J3WFMZS" />
      <meta name="google-site-verification" content="nF22SWcLm8AvJD46bLfNyKCJCMvqHS8SuYoiMeEITwE" />
      <meta name="google-site-verification" content="VfH9EadRthwV5nSVTz48foI3UEdvbXxy8cM69fhqvng" />
      <meta name="naver-site-verification" content="ea62c76d32e97c188c8c9d032fe9ae187c630fe6" />
      <Script 
        id="adsbygoogle-init"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1405155205468219" 
        crossOrigin="anonymous"
      />
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
              "https://blog.naver.com/magentalab",
              "https://www.instagram.com/magentalab"
            ]
          }),
        }}
      />
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" async></script>
    </>
  );
}
