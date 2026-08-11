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

import SeoArticle from "@/components/SeoArticle";

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

      <SeoArticle title="소형견의 숙명, 슬개골 탈구(Patellar Luxation)란?">
        <p>
          한국에서 가장 많이 기르는 말티즈, 포메라니안, 푸들, 치와와 같은 소형견들에게 <strong>슬개골 탈구</strong>는 피하기 힘든 숙명과도 같은 질환입니다. 무릎 관절을 보호하고 도르래 역할을 하는 작은 뼈인 '슬개골'이 정상적인 활차구(홈)에서 자꾸 벗어나는 질환을 말합니다. 
        </p>
        <p>
          유전적으로 뼈의 홈이 얕게 태어나는 경우가 많아 선천적인 요인이 크지만, 한국 특유의 <strong>미끄러운 거실 마룻바닥과 소파 위에서 뛰어내리는 후천적 생활 습관</strong>이 병의 진행 속도를 폭발적으로 가속화시킵니다.
        </p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">놓쳐서는 안 될 슬개골 탈구 기수별 증상</h3>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>1기:</strong> 슬개골이 빠졌다가 제자리로 금방 돌아갑니다. 아이가 걷다가 가끔 뒷다리를 <strong>'깽깽이 걸음(토끼뜀)'</strong>으로 한두 번 들고 걷는다면 이미 1기가 시작된 것입니다.</li>
          <li><strong>2기~3기:</strong> 뼈가 밖으로 빠져 있는 시간이 길어지며, 다리 모양이 O자나 X자로 변형되기 시작합니다. 만지면 '뚝뚝' 하는 뼈 마찰음이 들리기도 합니다.</li>
          <li><strong>4기:</strong> 손으로 밀어 넣어도 슬개골이 제자리로 돌아가지 않으며, 극심한 통증으로 인해 걷기를 거부하거나 주저앉습니다.</li>
        </ul>
        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>수의학적 면책 조항:</strong> 본 자가 진단기는 걷는 자세와 행동 징후를 통한 예측 도구일 뿐, 정확한 기수 판별은 수의사의 촉진과 방사선(X-ray) 검사로만 가능합니다. 2기 이상으로 진행되기 전 십자인대 파열을 막기 위해 반드시 동물병원에서 조기 검진을 받으시길 권장합니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="patella" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
