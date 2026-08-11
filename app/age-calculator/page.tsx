import type { Metadata } from "next";
import AgeCalculator from "@/components/AgeCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 구글 및 네이버 검색 노출을 위한 나이 계산기 전용 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 인간 나이 계산기 및 생애주기 진단기 | 마젠타랩",
  description: "우리 강아지와 고양이의 출생년도 및 체형 크기를 반영하여 정확한 인간 환산 나이를 도출합니다. 생후 개월 수 비례 수의학 보간 공식을 적용하며, 생애주기별(성장기/성숙기/장년기/노령기) 맞춤 건강 가이드를 제공합니다.",
  alternates: {
    canonical: "https://www.magentalabblog.com/age-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/age-calculator",
      en: "https://www.magentalabblog.com/en/age-calculator",
      ja: "https://www.magentalabblog.com/ja/age-calculator",
    },
  },
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

import SeoArticle from "@/components/SeoArticle";

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

      <SeoArticle title="강아지와 고양이의 시간은 사람보다 4배 이상 빠릅니다">
        <p>
          "우리 강아지가 사람 나이로 치면 몇 살일까?" 많은 보호자님들이 궁금해하시는 질문입니다. 과거에는 단순히 동물의 나이에 7을 곱하는 방식(예: 3살 = 21살)을 썼지만, 최근 수의학계에서는 <strong>'후성유전학적 노화 시계(Epigenetic clock)'</strong>를 기반으로 한 훨씬 더 정밀한 생애주기 환산 공식을 사용합니다.
        </p>
        <p>
          특히 강아지와 고양이는 <strong>생후 1년~2년 동안 폭발적으로 성장</strong>하여 인간의 24세 청년에 도달합니다. 그 이후부터는 1년마다 사람의 4~5년에 해당하는 속도로 서서히 나이를 먹게 됩니다. 또한 소형견, 중형견, 대형견은 노화의 속도가 완전히 다릅니다. 대형견일수록 세포 분열 횟수가 많아 수명이 짧고 더 빠르게 늙는 경향이 있습니다.
        </p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">생애주기에 따른 건강 케어 핵심 포인트</h3>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>퍼피/키튼 (0~1세):</strong> 골격과 뇌가 발달하는 시기로, 고단백·고칼슘 식단과 기초 백신 접종, 올바른 사회화 교육이 평생의 성격을 좌우합니다.</li>
          <li><strong>성견/성묘 (2~6세):</strong> 신체 기능이 가장 활발한 시기입니다. 잉여 칼로리가 비만으로 이어지지 않도록 꾸준한 산책과 놀이로 체형(BCS 4~5단계)을 유지해야 합니다.</li>
          <li><strong>시니어/노령기 (7세 이상):</strong> 인간 나이로 50대에 접어들며 백내장, 관절염, 신부전, 심장 비대증 등 노인성 질환이 나타나기 시작합니다. 이때부터는 매년 1~2회의 <strong>정기 건강검진(혈액/초음파)</strong>이 선택이 아닌 필수입니다.</li>
        </ul>
        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>수의학적 안내:</strong> 나이 계산 결과는 일반적인 통계에 기반한 참고용입니다. 평소 제공하는 사료의 질, 스트레스 수준, 유전적 요인(견종/묘종)에 따라 실제 신체 나이(건강 상태)는 크게 달라질 수 있습니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="age" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
