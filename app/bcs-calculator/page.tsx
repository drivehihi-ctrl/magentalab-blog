import type { Metadata } from "next";
import BCSCalculator from "@/components/BCSCalculator";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 구글 및 네이버 검색 노출을 위한 상세 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 비만도(BCS) 및 다이어트 칼로리 계산기 | 마젠타랩",
  description: "강아지와 고양이의 현재 체중, 중성화 여부, 활동량 및 BCS 9단계 비만도를 반영하여 하루 권장 칼로리(DER/RER)와 사료 급여량(g)을 정밀하게 연산합니다. 수의학 표준 가이드라인 제공.",
  keywords: [
    "반려동물 비만도 계산기", 
    "강아지 칼로리 계산기", 
    "고양이 칼로리 계산기", 
    "강아지 다이어트", 
    "고양이 다이어트", 
    "RER 계산기", 
    "DER 계산기", 
    "BCS 9단계", 
    "강아지 사료량 계산", 
    "마젠타랩"
  ],
  openGraph: {
    title: "반려동물 비만도(BCS) 및 다이어트 칼로리 계산기 | 마젠타랩",
    description: "아이의 몸무게와 체형(BCS 9단계)에 꼭 맞춘 하루 권장 칼로리와 사료량을 즉시 확인하세요.",
    url: "https://www.magentalabblog.com/bcs-calculator",
    type: "website",
    siteName: "Magentalab 반려동물 연구소",
    images: [
      {
        url: "/images/favicon.png", // 마젠타랩 파비콘 혹은 대표 로고 이미지
        width: 800,
        height: 600,
        alt: "마젠타랩 반려동물 비만도 계산기 대표 이미지",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "반려동물 비만도(BCS) 및 다이어트 칼로리 계산기 | 마젠타랩",
    description: "수의학 공식을 바탕으로 한 우리 아이 맞춤형 일일 열량 및 사료량 자가진단 시스템.",
    images: ["/images/favicon.png"],
  }
};

export default async function BcsCalculatorPage() {
  let relatedPosts: any[] = [];
  try {
    const posts = await searchPosts("비만");
    relatedPosts = posts.slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch related posts for BCS:", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <BCSCalculator />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
