import type { Metadata } from "next";
import FicDiagnoser from "@/components/FicDiagnoser";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 검색 엔진 노출을 위한 고양이 FIC 자가진단기 전용 메타데이터 설정
export const metadata: Metadata = {
  title: "고양이 스트레스 및 특발성 방광염(FIC) 자가 진단기 | 마젠타랩",
  description: "최근 이사나 모래 교체 등 영역 환경 변화가 있었나요? 고양이의 기본 프로필, 행동 시그널 및 환경 스트레스 요소를 종합 분석하여 특발성 방광염(FIC) 위험 단계를 무료로 실시간 진단해 드립니다.",
  keywords: [
    "고양이 방광염 계산기", 
    "고양이 FIC 자가진단", 
    "고양이 스트레스 지수", 
    "고양이 오버그루밍", 
    "고양이 소변 울음", 
    "고양이 방광염 증상", 
    "고양이 화장실 실수", 
    "마젠타랩 방광염 진단", 
    "마젠타랩"
  ],
  openGraph: {
    title: "고양이 스트레스 및 특발성 방광염(FIC) 자가 진단기 | 마젠타랩",
    description: "아이의 나이, 체형 및 스트레스 환경 체크를 통해 방광염 위험 단계를 10초 만에 분석 진단해 보세요.",
    url: "https://www.magentalabblog.com/FIC",
    type: "website",
    siteName: "Magentalab 반려동물 연구소",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "마젠타랩 고양이 FIC 방광염 자가 진단기 대표 이미지",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "고양이 스트레스 및 특발성 방광염(FIC) 자가 진단기 | 마젠타랩",
    description: "고양이 스트레스 징후 분석을 통해 판별하는 특발성 방광염 자가 진단 프로그램.",
    images: ["/images/favicon.png"],
  }
};

export default async function FicPage() {
  // Schema.org Structured Data - WebApplication / Diagnoser Tool
  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "고양이 스트레스 및 특발성 방광염(FIC) 자가 진단기",
    "url": "https://www.magentalabblog.com/FIC",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "creator": {
      "@type": "Organization",
      "name": "Magentalab 반려동물 연구소",
      "url": "https://www.magentalabblog.com"
    },
    "description": "반려묘의 나이, 비만 여부, 배변 행동 및 주변 스트레스 변화를 기반으로 고양이 특발성 방광염(FIC) 위험 단계를 정밀 판별하는 진단 시뮬레이터입니다."
  };

  let relatedPosts: any[] = [];
  try {
    const posts = await searchPosts("방광염");
    relatedPosts = posts.slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch related posts for FIC:", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <FicDiagnoser />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
