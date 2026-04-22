import type { Metadata } from "next";
import ShopClient from "./ShopClient";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "마젠타몰 | 반려동물 연구소 에디션",
  description: "마젠타랩 연구진이 엄선한 반려동물 전용 제품을 만나보세요.",
};

export default async function ShopPage() {
  // 서버 사이드에서 데이터를 미리 가져옵니다 (0.1% 정밀 프리페칭)
  const [productsRes, bannersRes] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("shop_banners").select("*").order("order_index", { ascending: true })
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

  return (
    <ShopClient 
      initialProducts={initialProducts} 
      initialBanners={initialBanners} 
    />
  );
}

