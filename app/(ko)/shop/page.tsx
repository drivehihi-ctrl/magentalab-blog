import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "마젠타몰 | 반려동물 연구소 에디션",
  description: "마젠타랩 연구진이 엄선한 반려동물 전용 제품을 만나보세요.",
  alternates: {
    canonical: "https://www.magentalabblog.com/shop",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ShopPage() {
  // AdSense 심사 승인 시까지 빈 쇼핑몰 감점 방지를 위해 홈페이지(/)로 임시 리다이렉트 (307)
  // 나중에 상품 등록 후 부활시킬 때는 아래 redirect 라인을 제거하면 기존 쇼핑몰이 그대로 복구됩니다.
  redirect("/");
}
