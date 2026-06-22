import type { Metadata } from "next";
import AgeCalculator from "@/components/AgeCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 구글 및 네이버 검색 노출을 위한 나이 계산기 전용 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 인간 나이 계산기 및 생애주기 진단기 | 마젠타랩",
  description: "우리 강아지와 고양이의 출생년도 및 체형 크기를 반영하여 정확한 인간 환산 나이를 도출합니다. 생후 개월 수 비례 수의학 보간 공식을 적용하며, 생애주기별(성장기/성숙기/장년기/노령기) 맞춤 건강 가이드를 제공합니다.",
  keywords: [
    "반려동물 나이 계산기",
    "강아지 인간 나이",
    "고양이 인간 나이",
    "강아지 나이 환산",
    "고양이 나이 환산",
    "강아지 생애주기",
    "고양이 생애주기",
    "강아지 노화 속도",
    "마젠타랩 나이 계산기",
    "마젠타랩"
  ],
  openGraph: {
    title: "반려동물 인간 나이 계산기 및 생애주기 진단기 | 마젠타랩",
    description: "아이의 출생일과 체형에 맞춰 수의학 표준 공식으로 정확한 인간 환산 나이와 생애주기를 진단해보세요.",
    url: "https://www.magentalabblog.com/age-calculator",
    type: "website",
    siteName: "Magentalab 반려동물 연구소",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "마젠타랩 반려동물 나이 계산기 대표 이미지",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "반려동물 인간 나이 계산기 및 생애주기 진단기 | 마젠타랩",
    description: "우리 아이의 인간 환산 나이와 생애주기별 맞춤 케어 수칙을 즉시 계산합니다.",
    images: ["/images/favicon.png"],
  }
};

export default async function AgeCalculatorPage() {
  let relatedPosts: any[] = [];
  try {
    const posts = await searchPosts("나이");
    relatedPosts = posts.slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch related posts for Age:", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <AgeCalculator />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="age" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
