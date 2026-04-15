import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "마젠타몰 | 반려동물 쇼핑 - 마젠타랩",
  description: "안심이 AI 연구팀이 직접 테스트한 프리미엄 반려동물 용품. 사료, 영양제, 위생용품, 장난감까지 믿고 구매하세요.",
};

export default function ShopPage() {
  return <ShopClient />;
}
