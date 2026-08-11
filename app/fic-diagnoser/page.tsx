import type { Metadata } from "next";
import FicDiagnoser from "@/components/FicDiagnoser";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 검색 엔진 노출을 위한 고양이 FIC 자가진단기 전용 메타데이터 설정
export const metadata: Metadata = {
  title: "고양이 스트레스 및 특발성 방광염(FIC) 자가 진단기 | 마젠타랩",
  description: "최근 이사나 모래 교체 등 영역 환경 변화가 있었나요? 고양이의 기본 프로필, 행동 시그널 및 환경 스트레스 요소를 종합 분석하여 특발성 방광염(FIC) 위험 단계를 무료로 실시간 진단해 드립니다.",
  alternates: {
    canonical: "https://www.magentalabblog.com/fic-diagnoser",
    languages: {
      ko: "https://www.magentalabblog.com/fic-diagnoser",
      en: "https://www.magentalabblog.com/en/fic-diagnoser",
      ja: "https://www.magentalabblog.com/ja/fic-diagnoser",
    },
  },
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
    url: "https://www.magentalabblog.com/fic-diagnoser",
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

import SeoArticle from "@/components/SeoArticle";

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

      <SeoArticle title="고양이 3대 질병, 특발성 방광염(FIC)의 진짜 원인">
        <p>
          고양이 하부 요로계 질환(FLUTD) 중 무려 60~70%를 차지하는 것이 바로 <strong>특발성 방광염(FIC, Feline Idiopathic Cystitis)</strong>입니다. '특발성'이라는 말은 결석이나 세균 감염 같은 명확한 물리적 원인 없이 발생한다는 뜻이며, 수의학계에서는 그 핵심 원인을 <strong>'극심한 스트레스'</strong>로 보고 있습니다.
        </p>
        <p>
          고양이는 영역 동물로 환경 변화에 매우 예민합니다. 이사, 낯선 사람의 방문, 새로운 반려동물의 입양은 물론이고, 화장실 모래 종류의 변경이나 캣타워 위치 이동 같은 사소한 변화조차 고양이의 교감신경계를 과도하게 자극합니다. 이 스트레스는 방광 내벽을 보호하는 층을 파괴하여 극심한 통증과 염증을 유발하게 됩니다.
        </p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">놓치기 쉬운 방광염 초기 시그널 3가지</h3>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>화장실 실수(배뇨 실수):</strong> 푹신한 이불이나 빨래 더미, 소파 위에 오줌을 누는 행위는 반항이 아니라 화장실(모래)이 아프거나 불편하다는 가장 강력한 구조 요청입니다.</li>
          <li><strong>오버 그루밍(Over-grooming):</strong> 방광 쪽(생식기나 아랫배)을 털이 빠질 정도로 강박적으로 핥는다면, 통증을 완화하려는 행동일 수 있습니다.</li>
          <li><strong>화장실 체류 시간 증가:</strong> 화장실에 자주 들락거리며 울음소리를 내거나, 오랜 시간 힘을 주지만 감자(소변 덩어리) 크기가 눈에 띄게 작아진다면 급성 방광염을 의심해야 합니다.</li>
        </ul>
        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>수의학적 면책 조항:</strong> 만약 수컷 고양이가 24시간 이상 소변을 전혀 보지 못한다면(요도 폐색), 이는 급성 신부전으로 이어져 48시간 내에 사망할 수 있는 초응급 상황입니다. 즉시 24시간 야간 동물병원으로 내원하여 카테터 시술을 받아야 합니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="fic" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
