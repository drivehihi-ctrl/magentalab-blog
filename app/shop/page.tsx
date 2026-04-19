import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "마젠타몰 | 반려동물 연구소 에디션",
  description: "마젠타랩 연구진이 엄선한 반려동물 전용 제품을 만나보세요.",
};

export default function ShopPage() {
  return <ShopClient />;
}

