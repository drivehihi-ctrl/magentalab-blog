import type { Metadata } from "next";
import BCSCalculator from "@/components/BCSCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 구글 및 네이버 검색 노출을 위한 상세 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 비만도(BCS) 및 다이어트 칼로리 계산기 | 마젠타랩",
  description: "강아지와 고양이의 현재 체중, 중성화 여부, 활동량 및 BCS 9단계 비만도를 반영하여 하루 권장 칼로리(DER/RER)와 사료 급여량(g)을 예상값 계산합니다. 체중 기반 참고 가이드 제공.",
  alternates: {
    canonical: "https://www.magentalabblog.com/bcs-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/bcs-calculator",
      en: "https://www.magentalabblog.com/en/bcs-calculator",
      ja: "https://www.magentalabblog.com/ja/bcs-calculator",
    },
  },
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
    description: "우리 아이 맞춤형 일일 열량 및 사료량 체형 및 필요 열량 참고 도구.",
    images: ["/images/favicon.png"],
  }
};

import SeoArticle from "@/components/SeoArticle";

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
      
      <SeoArticle title="강아지와 고양이 비만도(BCS) 척도란 무엇인가요?">
        <p>
          신체충실지수(BCS, Body Condition Score)는 강아지와 고양이의 체지방 상태와 체형을 평가하기 위해 수의 임상에서 널리 사용하는 표준화된 평가 방법입니다. 체중계에 표시되는 몸무게만으로는 반려동물이 저체중인지, 정상 체중인지, 과체중인지 정확히 판단하기 어려울 수 있습니다. 골격의 크기와 품종, 체형에 따라 적정 체중이 서로 다르기 때문입니다.
        </p>
        <p>
          BCS는 눈으로 전체 체형을 관찰하고, 손으로 갈비뼈와 척추, 허리 주변 등을 만져 지방층의 두께를 확인하여 평가합니다. 흔히 사용하는 BCS 9단계 척도는 1단계의 심한 저체중부터 9단계의 심한 비만까지 체형을 구분합니다.
        </p>
        <p>
          일반적으로 BCS 4~5/9 정도가 이상적인 범위로 평가됩니다. 이상적인 체형에서는 갈비뼈가 과도하게 돌출되어 보이지 않으면서도 손으로 비교적 쉽게 만져지고, 위에서 보았을 때 허리선이 확인되며, 옆에서 보았을 때 복부가 적절히 들어간 모습을 보입니다.
        </p>
        <p>
          다만 적정 BCS는 반려동물의 종, 나이, 품종, 근육량과 건강 상태에 따라 다르게 평가될 수 있으므로 정확한 판단이 필요하다면 수의사의 신체검사를 함께 받는 것이 좋습니다.
        </p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">왜 다이어트와 칼로리 조절(DER/RER)이 중요할까요?</h3>
        <p>
          반려동물의 비만은 단순한 체형 문제가 아니라 여러 질환의 위험 증가와 삶의 질 저하에 영향을 줄 수 있는 중요한 건강 문제입니다. 과도한 체중은 관절과 인대에 가해지는 부담을 증가시키며, 골관절염을 비롯한 일부 정형외과 질환의 위험이나 증상 악화와 관련될 수 있습니다.
        </p>
        <p>
          또한 비만은 특히 고양이에서 인슐린 저항성과 당뇨병 위험 증가와 관련이 있으며, 반려동물에 따라 호흡기 및 심혈관계에 추가적인 부담을 줄 수 있습니다. 따라서 적정 체중을 유지하는 것은 단순히 외형을 관리하는 것이 아니라 장기적인 건강 관리의 중요한 요소입니다.
        </p>
        <p>
          특히 과체중 또는 비만한 고양이가 갑자기 먹지 않거나 지나치게 급격한 칼로리 제한을 받을 경우, 체내 지방이 과도하게 간으로 이동하면서 고양이 지방간(Feline Hepatic Lipidosis)이 발생할 위험이 있습니다. 고양이 지방간은 치료가 필요한 심각한 질환이므로 비만한 고양이의 체중 감량은 무리하게 진행해서는 안 됩니다.
        </p>
        <p>
          안전한 체중 감량을 위해서는 기존 급여량을 임의로 크게 줄이기보다 목표 체중, 현재 BCS, 활동량, 중성화 여부, 연령 등을 고려하여 하루 필요 칼로리의 초기 목표를 설정하는 것이 중요합니다.
        </p>
        <p>
          RER(Resting Energy Requirement, 휴식기 에너지 요구량)은 반려동물이 안정된 상태에서 생명 유지에 필요한 기본적인 에너지 요구량을 추정하는 값이며, 이를 바탕으로 활동량이나 생애 단계, 체중 감량 목적 등을 고려해 실제 하루 급여 칼로리를 조정할 수 있습니다.
        </p>
        <p>
          계산을 통해 얻은 칼로리는 절대적인 값이 아니라 체중 관리의 시작점으로 사용하는 것이 좋습니다. 실제 체중 변화와 BCS를 정기적으로 확인하면서 급여량을 조정해야 보다 안전하게 목표 체중에 접근할 수 있습니다.
        </p>
        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>수의학적 면책 조항:</strong> 본 계산기는 WSAVA, AAHA 및 APOP 등에서 제시하는 반려동물 체형 평가 및 에너지 요구량 관련 수의학 자료를 참고하여 제작되었습니다. 다만 계산 결과는 일반적인 참고값이며 개별 반려동물의 품종, 나이, 활동량, 중성화 여부, 근육량 및 갑상선 기능 저하증·쿠싱증후군·당뇨병 등 기저질환에 따라 실제 에너지 요구량은 달라질 수 있습니다. 특히 비만한 고양이의 급격한 식이 제한은 지방간 위험을 높일 수 있으므로 체중 감량 프로그램을 시작하기 전 수의사와 상담하는 것을 권장합니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="bcs" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
