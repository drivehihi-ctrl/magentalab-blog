import type { Metadata } from "next";
import PetcareExpensesCalculator from "@/components/PetcareExpensesCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 검색 엔진 노출을 위한 반려동물 양육비 계산기 전용 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 평생 양육비 및 월간 유지비 계산기 | 마젠타랩",
  description: "사료비, 위생용품, 미용 및 병원비까지! 강아지, 고양이 축종별 맞춤형 평생 양육비 계산기로 우리 아이 평생 유지비와 지출 비중 차트를 10초 만에 분석해 보세요.",
  keywords: [
    "반려동물 양육비 계산기", 
    "강아지 유지비", 
    "고양이 양육비", 
    "강아지 평생 양육비", 
    "반려묘 키우는 비용", 
    "반려동물 지출 분석", 
    "마젠타랩 양육비 계산기", 
    "마젠타랩"
  ],
  openGraph: {
    title: "반려동물 평생 양육비 및 월간 유지비 계산기 | 마젠타랩",
    description: "아이의 나이, 예상 수명, 식비 등급 및 필수 케어 지출 분석을 통해 평생 누적 양육비와 월간 고정 지출 비율을 0초 만에 분석 진단해 보세요.",
    url: "https://www.magentalabblog.com/Petcareexpenses",
    type: "website",
    siteName: "Magentalab 반려동물 연구소",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "마젠타랩 반려동물 양육비 계산기 대표 이미지",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "반려동물 평생 양육비 및 월간 유지비 계산기 | 마젠타랩",
    description: "사료 등급 및 케어 비용 조절을 통해 알아보는 강아지/고양이 평생 유지비 시뮬레이터.",
    images: ["/images/favicon.png"],
  }
};

export default async function PetcareExpensesPage() {
  // Schema.org Structured Data - WebApplication / Expense Calculator Tool
  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "반려동물 평생 양육비 및 월간 유지비 계산기",
    "url": "https://www.magentalabblog.com/Petcareexpenses",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "creator": {
      "@type": "Organization",
      "name": "Magentalab 반려동물 연구소",
      "url": "https://www.magentalabblog.com"
    },
    "description": "반려동물(강아지/고양이)의 성장 생애주기별 사료 등급, 위생용품, 미용 및 예방 의료비를 반영하여 한 달간 고정 지출과 평생 총 유지비를 계산해주는 지출 분석 시뮬레이터입니다."
  };

  let relatedPosts: any[] = [];
  try {
    const posts = await searchPosts("양육비");
    relatedPosts = posts.slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch related posts for Expenses:", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <PetcareExpensesCalculator />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="expenses" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
