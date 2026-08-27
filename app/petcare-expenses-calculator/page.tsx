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
    "url": "https://www.magentalabblog.com/petcare-expenses-calculator",
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
          반려동물을 가족으로 맞이하기 전에는 사랑과 관심뿐 아니라 <strong>끝까지 돌볼 수 있는 경제적인 준비가 되어 있는지</strong>도 함께 생각해야 합니다. 사료와 간식 같은 식비부터 위생용품, 예방접종과 건강검진, 미용, 질병 치료까지 반려동물을 돌보는 데에는 꾸준한 비용이 발생하기 때문입니다.
        </p>
        <p>
          농림축산식품부가 발표한 <strong>2025년 동물복지 국민의식조사</strong>에 따르면 반려동물 1마리당 월평균 양육비는 약 <strong>12만 1천 원</strong>으로 조사됐습니다. 동물별로는 강아지가 약 <strong>13만 5천 원</strong>, 고양이가 약 <strong>9만 2천 원</strong>이었으며, 전체 평균 병원비는 월 약 <strong>3만 7천 원</strong>이었습니다.
        </p>
        <p>
          이 금액을 현재 물가가 그대로 유지된다고 가정하고 단순히 15년 동안 합산하면 전체 평균 약 2,178만 원에 해당합니다. 하지만 이것은 어디까지나 현재의 월평균 조사금액을 단순 환산한 참고값입니다. 실제 평생 양육비는 반려동물의 종류와 체격, 먹는 사료, 생활환경, 건강 상태, 의료 이용 정도와 물가 변화 등에 따라 크게 달라질 수 있습니다.
        </p>
        <p>
          이 계산기는 예비 보호자와 현재 반려인이 막연하게 느낄 수 있는 <strong>'반려동물 양육비'를 항목별로 살펴보기 위한 참고 도구</strong>입니다. 사료와 간식 등의 식비, 배변용품이나 고양이 모래 등 위생용품비, 미용 및 관리비, 예방접종과 건강검진 등의 의료비를 입력해 월 예상 지출과 장기간의 누적 예상 비용을 계산할 수 있습니다.
        </p>
        <p>
          계산 결과는 실제 미래 지출을 보장하는 금액이 아니라, 현재의 소비 수준을 기준으로 앞으로 필요한 예산을 미리 생각해 보는 데 의미가 있습니다.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">생애주기에 따라 양육비도 달라질 수 있습니다</h3>
        <p>
          반려동물에게 드는 비용은 평생 일정하게 유지되지 않습니다.
        </p>
        <p>
          <strong>퍼피·키튼 등 성장기</strong>에는 필요한 예방접종과 기생충 예방, 건강검진 등이 집중될 수 있으며, 보호자의 선택과 수의학적 판단에 따라 중성화수술 등의 일회성 비용이 발생할 수도 있습니다. 하네스, 이동장, 화장실, 식기, 침구와 같은 기본 생활용품을 처음 마련하는 비용도 고려해야 합니다.
        </p>
        <p>
          <strong>성년기</strong>에는 사료와 간식, 배변용품이나 고양이 모래, 예방관리 등 비교적 반복적인 생활비의 비중이 커집니다. 다만 피부질환, 치과질환, 외상이나 기타 질병이 발생하면 평소보다 의료비가 증가할 수 있습니다.
        </p>
        <p>
          <strong>시니어 시기</strong>가 되면 건강 상태를 더 자주 확인해야 할 필요성이 커지고, 일부 반려동물에서는 만성 신장질환, 관절질환, 심혈관계 질환, 치과질환, 종양 등 다양한 건강 문제가 발생할 가능성이 높아질 수 있습니다. 이에 따라 검사, 약물, 처방식, 치료 등에 드는 비용이 이전보다 증가할 수도 있습니다.
        </p>
        <p>
          시니어 시기가 시작되는 나이는 모든 반려동물에게 동일하지 않습니다. 특히 강아지는 품종과 체격, 예상 수명에 따라 노화 시점이 크게 다르므로 단순히 특정 나이부터 모두 노령기라고 판단하는 것은 적절하지 않습니다.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">예상하지 못한 의료비도 준비해야 합니다</h3>
        <p>
          월평균 양육비만으로 모든 비용을 예상하기는 어렵습니다. 슬개골 탈구나 십자인대 질환의 수술, 종양 검사와 치료, 치과치료, 응급진료 및 입원 등 예상하지 못한 상황에서는 평소보다 큰 의료비가 발생할 수 있습니다.
        </p>
        <p>
          따라서 평소 생활비뿐 아니라 <strong>예기치 않은 의료비에 대비할 수 있는 별도의 예산을 마련해 두는 것</strong>도 고려할 만합니다. 일정 금액을 반려동물 의료비 용도로 따로 저축하거나, 보장 범위와 자기부담금, 보장 제외 항목 등을 비교한 뒤 펫보험 가입을 검토하는 방법도 있습니다.
        </p>
        <p>
          어떤 방법을 선택하든 중요한 것은 반려동물을 맞이하기 전에 <strong>현재의 월 양육비뿐 아니라 앞으로 발생할 수 있는 장기적인 비용까지 함께 생각해 보는 것</strong>입니다.
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>비용 안내:</strong> 본 계산기의 결과는 사용자가 입력한 비용과 공개된 반려동물 양육비 통계 등을 이용해 산출하는 예상값이며, 실제 지출액을 보장하지 않습니다. 사료 가격, 지역별 동물병원 진료비, 미용 및 생활용품 비용, 물가 변화와 개별 반려동물의 건강 상태에 따라 실제 비용은 크게 달라질 수 있습니다. 또한 응급진료, 입원, 수술, 만성질환 치료 등 예상하지 못한 의료비는 계산 결과를 크게 초과할 수 있으므로 별도의 여유 예산을 고려하시기 바랍니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="expenses" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
