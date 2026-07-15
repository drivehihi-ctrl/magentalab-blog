import type { Metadata } from "next";
import PatellaDiagnoser from "@/components/PatellaDiagnoser";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 검색 엔진 노출을 위한 슬개골 자가진단기 전용 메타데이터 설정
export const metadata: Metadata = {
  title: "강아지 슬개골 탈구 및 관절 건강 자가 진단기 | 마젠타랩",
  description: "우리 아이의 걷는 자세가 이상한가요? 소형견/대형견 맞춤형 슬개골 탈구 자가 진단기로 관절 건강 위험도를 10초 만에 체크하고 수의학 관절 보호 가이드를 확인해 보세요.",
  alternates: {
    canonical: "https://www.magentalabblog.com/patella-diagnoser",
    languages: {
      ko: "https://www.magentalabblog.com/patella-diagnoser",
      en: "https://www.magentalabblog.com/en/patella-diagnoser",
      ja: "https://www.magentalabblog.com/ja/patella-diagnoser",
    },
  },
  keywords: [
    "슬개골 탈구 계산기", 
    "강아지 슬개골 탈구 자가진단", 
    "강아지 슬개골 탈구 증상", 
    "소형견 슬개골 탈구", 
    "강아지 관절 영양제", 
    "슬개골 보호 매트", 
    "마젠타랩 슬개골 진단", 
    "마젠타랩"
  ],
  openGraph: {
    title: "강아지 슬개골 탈구 및 관절 건강 자가 진단기 | 마젠타랩",
    description: "아이의 견종, 나이, 몸무게 및 행동 변화 체크를 통해 관절 건강 상태와 위험 단계를 0초 만에 분석 진단해 보세요.",
    url: "https://www.magentalabblog.com/patella-diagnoser",
    type: "website",
    siteName: "Magentalab 반려동물 연구소",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "마젠타랩 강아지 슬개골 자가 진단기 대표 이미지",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "강아지 슬개골 탈구 및 관절 건강 자가 진단기 | 마젠타랩",
    description: "걷는 자세와 행동 징후 분석을 통해 알아내는 슬개골 탈구 위험도 자가 진단 프로그램.",
    images: ["/images/favicon.png"],
  }
};

export default async function PatellaPage() {
  // Schema.org Structured Data - WebApplication / Diagnoser Tool
  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "강아지 슬개골 탈구 및 관절 건강 자가 진단기",
    "url": "https://www.magentalabblog.com/patella",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "creator": {
      "@type": "Organization",
      "name": "Magentalab 반려동물 연구소",
      "url": "https://www.magentalabblog.com"
    },
    "description": "반려견의 나이, 체중, 걷는 모습 행동 증상을 기반으로 슬개골 탈구 및 관절 질환 위험도를 신속하게 진단하는 자가 진단 프로그램입니다."
  };

  let relatedPosts: any[] = [];
  try {
    const posts = await searchPosts("슬개골");
    relatedPosts = posts.slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch related posts for Patella:", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <PatellaDiagnoser />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="patella" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
