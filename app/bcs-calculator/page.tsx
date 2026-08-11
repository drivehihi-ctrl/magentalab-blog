import type { Metadata } from "next";
import BCSCalculator from "@/components/BCSCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 구글 및 네이버 검색 노출을 위한 상세 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 비만도(BCS) 및 다이어트 칼로리 계산기 | 마젠타랩",
  description: "강아지와 고양이의 현재 체중, 중성화 여부, 활동량 및 BCS 9단계 비만도를 반영하여 하루 권장 칼로리(DER/RER)와 사료 급여량(g)을 정밀하게 연산합니다. 수의학 표준 가이드라인 제공.",
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
    description: "수의학 공식을 바탕으로 한 우리 아이 맞춤형 일일 열량 및 사료량 자가진단 시스템.",
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
          신체충실지수(BCS, Body Condition Score)는 반려동물의 비만도를 평가하기 위해 세계소동물수의사회(WSAVA)에서 권장하는 <strong>가장 신뢰할 수 있는 임상 지표</strong>입니다. 체중계의 숫자만으로는 우리 강아지나 고양이가 비만인지 정확히 알기 어렵습니다. 골격의 크기와 견종/묘종에 따라 적정 체중이 완전히 다르기 때문입니다.
        </p>
        <p>
          따라서 눈으로 체형을 관찰하고, 손으로 갈비뼈와 척추뼈 부위의 지방 두께를 직접 만져보아 1단계(극심한 저체중)부터 9단계(고도 비만)까지 평가하는 BCS 9단계 척도가 전 세계 동물병원에서 표준으로 사용됩니다. <strong>이상적인 체형은 4~5단계</strong>로, 갈비뼈가 부드럽게 만져지면서도 얇은 지방층에 덮여 있고, 위에서 보았을 때 허리가 살짝 들어간 형태입니다.
        </p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">왜 다이어트와 칼로리 조절(DER/RER)이 필수적일까요?</h3>
        <p>
          반려동물에게 비만은 단순한 체형 변화가 아닌, <strong>수명을 단축시키는 치명적인 질병의 근원</strong>입니다. 과체중은 십자인대 파열, 슬개골 탈구, 관절염과 같은 치명적인 정형외과 질환의 발병률을 수 배 이상 높입니다. 뿐만 아니라 심혈관계 질환, 당뇨병(DM), 췌장염, 호흡기 장애 등의 심각한 내과적 합병증을 유발합니다.
        </p>
        <p>
          특히 고양이의 경우, 고도 비만 상태에서 식욕 부진이나 갑작스러운 식이 제한이 발생하면 <strong>지방간(Hepatic Lipidosis)</strong>이라는 생명을 위협하는 응급 질환으로 번질 수 있어 각별한 주의가 필요합니다. 안전한 체중 감량을 위해서는 현재 몸무게 기준의 유지 칼로리가 아닌, <strong>목표 체중(이상 체중)에 맞춘 다이어트 권장 칼로리(DER)</strong>를 정밀하게 계산하여 하루 급여량을 통제해야 합니다.
        </p>
        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>수의학적 면책 조항:</strong> 본 계산기는 APOP 및 WSAVA의 표준 임상 알고리즘을 기반으로 제작되었으나, 개별 반려동물의 대사 질환(갑상선 기능 저하증, 쿠싱 증후군 등) 유무에 따라 칼로리 소모량이 크게 다를 수 있습니다. 다이어트 프로그램을 시작하기 전 반드시 주치의 수의사와 상담하시기 바랍니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="bcs" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
