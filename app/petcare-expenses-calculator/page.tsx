import type { Metadata } from "next";
import PetcareExpensesCalculator from "@/components/PetcareExpensesCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 검색 엔진 노출을 위한 반려동물 양육비 계산기 전용 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 평생 양육비 및 월간 유지비 계산기 | 마젠타랩",
  description: "사료비, 위생용품, 미용 및 병원비까지! 강아지, 고양이 축종별 맞춤형 평생 양육비 계산기로 우리 아이 평생 유지비와 지출 비중 차트를 10초 만에 분석해 보세요.",
  alternates: {
    canonical: "https://www.magentalabblog.com/petcare-expenses-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/petcare-expenses-calculator",
      en: "https://www.magentalabblog.com/en/petcare-expenses-calculator",
      ja: "https://www.magentalabblog.com/ja/petcare-expenses-calculator",
    },
  },
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
    url: "https://www.magentalabblog.com/petcare-expenses-calculator",
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

import SeoArticle from "@/components/SeoArticle";

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

      <SeoArticle title="강아지와 고양이, 평생 양육비는 얼마나 들까요?">
        <p>
          "사지 말고 입양하세요."라는 말만큼이나 중요한 것은 **"끝까지 책임질 수 있는 경제적 준비가 되었는가"**입니다. 농림축산식품부의 통계에 따르면 반려동물 1마리를 평생(약 15년 기준) 양육하는 데 드는 비용은 최소 1,500만 원에서 최대 3,000만 원 이상으로 추산됩니다.
        </p>
        <p>
          이 계산기는 예비 보호자와 현재 반려인들이 막연하게 느끼는 **'반려동물 유지비'**를 구체적인 데이터로 시각화해 줍니다. 아이의 나이와 체중에 따른 식비(사료 등급별), 매월 소비되는 배변/모래 등의 위생용품비, 주기적인 미용비, 그리고 가장 부담이 큰 정기 건강검진 및 예방 접종비를 종합하여 한 달 고정 지출과 평생 누적 예상 비용을 산출합니다.
        </p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">생애주기별 지출 변화와 노령견/노령묘 의료비 대비</h3>
        <p>
          반려동물의 양육비는 일정한 그래프를 그리지 않습니다. 1세 미만의 퍼피/키튼 시기에는 기초 접종과 중성화 수술비로 초기 목돈이 발생하며, 1세부터 7세까지의 성견/성묘 시기에는 식비와 위생용품 등 고정 지출이 안정적으로 유지됩니다.
        </p>
        <p>
          하지만 **8세 이후 노령기**에 접어들면 상황이 급변합니다. 백내장, 심장병, 신부전, 관절염 등 노화에 따른 만성 질환이 발생하면서 약값과 특수 처방식, 그리고 수술비로 수백만 원이 일시불로 청구되는 일이 빈번해집니다. 따라서 어릴 때부터 펫보험에 가입하거나, 매월 일정 금액을 **'반려동물 전용 적금'**으로 미리 저축해 두는 것이 선택이 아닌 필수입니다.
        </p>
        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>안내:</strong> 본 계산기의 결과는 평균적인 시장 물가와 표준 예방 의학 비용을 기준으로 산정되었습니다. 슬개골 탈구 수술, 종양 제거, 응급실 입원 등 예기치 못한 중증 질환 발생 시 수백만 원의 추가적인 의료비가 발생할 수 있음을 항상 인지하셔야 합니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="expenses" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
