import type { Metadata } from "next";
import DmCalculator from "@/components/DmCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 구글 및 네이버 검색 최적화를 위한 전용 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 사료 영양성분(DM) 및 하루 필수 음수량 계산기 | 마젠타랩",
  description: "사료 등록성분표의 조단백, 조지방 함량을 수분이 없는 건물(Dry Matter) 기준으로 자동 환산합니다. 또한 개와 고양이의 체중별 표준 일일 필수 음수량(ml)과 종이컵 환산 가이드를 제공합니다.",
  keywords: [
    "사료 DM 계산기", 
    "사료 영양성분 계산기", 
    "강아지 음수량 계산", 
    "고양이 음수량 계산", 
    "사료 건물 환산", 
    "반려동물 사료 단백질 비율", 
    "고단백 사료 판정", 
    "마젠타랩 영양 계산기", 
    "마젠타랩"
  ],
  openGraph: {
    title: "반려동물 사료 영양성분(DM) 및 하루 필수 음수량 계산기 | 마젠타랩",
    description: "아이의 하루 목표 음수량과 사료의 실제 단백질/지방 함량(건물 기준)을 정밀 환산 및 진단해 보세요.",
    url: "https://www.magentalabblog.com/dm-calculator",
    type: "website",
    siteName: "Magentalab 반려동물 연구소",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "마젠타랩 사료 DM 및 음수량 계산기 대표 이미지",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "반려동물 사료 영양성분(DM) 및 하루 필수 음수량 계산기 | 마젠타랩",
    description: "수의학 공식을 바탕으로 한 우리 아이 맞춤형 일일 음수 요구량 및 사료 건물 성분 분석 시스템.",
    images: ["/images/favicon.png"],
  }
};

export default async function DmCalculatorPage() {
  let relatedPosts: any[] = [];
  try {
    const posts = await searchPosts("음수량");
    relatedPosts = posts.slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch related posts for DM:", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <DmCalculator />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="dm" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
