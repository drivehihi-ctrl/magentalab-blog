import type { Metadata } from "next";
import ShopClient from "./ShopClient";
import { supabase } from "@/lib/supabase";

// 항상 최신 데이터를 서버에서 가져옴 (캐시 비활성화)
// 1시간마다 정적 페이지 재생성 (ISR 도입으로 서버 부하 감소 및 SEO 최적화)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "마젠타몰 | 반려동물 연구소 에디션",
  description: "마젠타랩 연구진이 엄선한 반려동물 전용 제품을 만나보세요.",
  alternates: {
    canonical: "https://www.magentalabblog.com/shop",
  },
  openGraph: {
    title: "마젠타몰 | 반려동물 연구소 에디션",
    description: "마젠타랩 연구진이 엄선한 반려동물 전용 제품을 만나보세요.",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ShopPage() {
  // 서버 사이드에서 데이터를 미리 가져옵니다 (0.1% 정밀 프리페칭)
  const [productsRes, bannersRes, guidesRes] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("shop_banners").select("*").order("order_index", { ascending: true }),
    supabase.from("shop_care_guides").select("*").order("order_index", { ascending: true })
  ]);

  const timestamp = Date.now();
  
  // 이미지 캐시 버스터 추가 (서버 사이드)
  const initialBanners = (bannersRes.data || []).map(b => ({
    ...b,
    image_url: b.image_url ? `${b.image_url}?t=${timestamp}` : null
  }));

  const initialProducts = (productsRes.data || []).map(p => ({
    ...p,
    image: p.image_url ? `${p.image_url}?t=${timestamp}` : p.image,
    originalPrice: p.original_price || p.originalPrice
  }));

  const initialCareGuides = guidesRes.data || [];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://www.magentalabblog.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "상점",
        "item": "https://www.magentalabblog.com/shop"
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ShopClient 
        initialProducts={initialProducts} 
        initialBanners={initialBanners} 
        initialCareGuides={initialCareGuides}
      />
    </>
  );
}

