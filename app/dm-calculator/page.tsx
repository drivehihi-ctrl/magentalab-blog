import type { Metadata } from "next";
import DmCalculator from "@/components/DmCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 구글 및 네이버 검색 최적화를 위한 전용 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 사료 영양성분(DM) 및 하루 필수 음수량 계산기 | 마젠타랩",
  description: "사료 등록성분표의 조단백, 조지방 함량을 수분이 없는 건물(Dry Matter) 기준으로 자동 환산합니다. 또한 개와 고양이의 체중별 표준 일일 필수 음수량(ml)과 종이컵 환산 가이드를 제공합니다.",
  alternates: {
    canonical: "https://www.magentalabblog.com/dm-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/dm-calculator",
      en: "https://www.magentalabblog.com/en/dm-calculator",
      ja: "https://www.magentalabblog.com/ja/dm-calculator",
    },
  },
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

import SeoArticle from "@/components/SeoArticle";

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

      <SeoArticle title="사료 영양성분 건물(DM) 환산이 왜 중요할까요?">
        <p>
          모든 반려동물 사료(건식, 습식, 동결건조 등) 포장지 뒷면에는 의무적으로 '등록성분량'이 표기되어 있습니다. 하지만 이 수치들은 사료가 머금고 있는 **수분(Moisture)**이 포함된 상태의 값(As-fed basis)입니다. 
        </p>
        <p>
          습식 사료는 수분이 70~80%에 달하고, 건식 사료는 수분이 10% 미만이기 때문에 포장지에 적힌 숫자만으로는 두 사료 중 어느 쪽의 단백질이나 지방 함량이 더 높은지 정확히 비교할 수 없습니다. 따라서 수분을 0%로 완전히 제거한 **건물 기준(Dry Matter, DM)**으로 환산해야만 영양소 밀도를 정확하게 비교할 수 있습니다.
        </p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">고양이와 강아지에게 필수적인 하루 음수량 (Hydration)</h3>
        <p>
          수분 섭취는 반려동물의 신장(신부전 예방)과 하부 요로계(결석, 방광염 예방) 건강을 지키는 가장 핵심적인 요소입니다. 고양이는 조상이 사막에서 유래하여 갈증을 느끼는 감각이 매우 둔하므로, 보호자가 의도적으로 수분을 공급해주지 않으면 <strong>만성 탈수</strong>에 시달리게 됩니다.
        </p>
        <p>
          강아지 역량 1kg당 약 50~60ml, 고양이는 1kg당 약 40~50ml의 수분이 매일 필요합니다. 건식 사료만 먹는 아이들은 물그릇을 통한 직접적인 수분 섭취량이 목표치에 도달하기 어렵기 때문에, 부족분을 채우기 위해 습식 사료를 혼합 급여하거나 츄르에 물을 타서 주는 식의 적극적인 **음수량 늘리기(Hydration Hack)**가 필수적입니다.
        </p>
        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>수의학적 면책 조항:</strong> 결석이나 신부전 질환을 앓고 있는 아이들은 일반적인 음수량 공식과 전혀 다른 목표 수치가 필요할 수 있습니다. 또한 질환 관리를 위한 처방식 사료의 성분 비교는 반드시 수의사의 안내에 따라 진행하시기 바랍니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="dm" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
