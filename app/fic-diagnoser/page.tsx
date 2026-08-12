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

      <SeoArticle title="고양이에게 흔한 하부요로질환, 특발성 방광염(FIC)이란?">
        <p>
          고양이 하부요로질환(FLUTD, Feline Lower Urinary Tract Disease)은 하나의 특정 질병을 뜻하는 것이 아니라 방광과 요도에 발생하는 여러 질환을 통칭하는 표현입니다. 그중 **고양이 특발성 방광염(FIC, Feline Idiopathic Cystitis)**은 특히 흔하게 진단되는 원인 중 하나이며, 여러 연구에서 FLUTD 증상을 보이는 고양이의 약 55~65% 내외를 차지하는 것으로 보고되고 있습니다.
        </p>
        <p>
          '특발성(Idiopathic)'이라는 말은 결석이나 세균 감염, 종양처럼 증상을 설명할 수 있는 명확한 원인이 확인되지 않았다는 의미입니다. 따라서 FIC는 소변검사와 영상검사 등을 통해 다른 원인을 배제한 뒤 진단되는 경우가 많습니다.
        </p>
        <p>
          FIC의 정확한 원인은 아직 하나로 밝혀지지 않았습니다. 다만 현재 수의학에서는 **스트레스와 환경적 요인, 신경계와 호르몬의 스트레스 반응, 방광의 감각 및 보호 기능 변화 등이 복합적으로 관여하는 질환**으로 이해하고 있습니다.
        </p>
        <p>
          고양이는 생활환경의 변화와 사회적 긴장에 민감할 수 있습니다. 이사, 새로운 가족이나 반려동물의 등장, 다른 고양이와의 갈등, 생활패턴 변화, 화장실 환경의 변화 등은 일부 고양이에서 스트레스 요인이 될 수 있습니다.
        </p>
        <p>
          하지만 단순히 “스트레스를 받으면 방광염이 생긴다”는 의미는 아닙니다. 모든 스트레스가 FIC를 일으키는 것도 아니며, 고양이마다 스트레스에 대한 반응과 질환 발생 위험에는 차이가 있습니다. 다만 FIC가 반복되는 고양이에서는 생활환경을 안정시키고 스트레스 요인을 줄이는 **환경 풍부화와 다중 환경 개선(Multimodal Environmental Modification)**이 관리의 중요한 요소가 될 수 있습니다.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">놓치기 쉬운 고양이 하부요로질환의 신호</h3>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>화장실 밖에서 소변을 봅니다:</strong> 평소 화장실을 잘 사용하던 고양이가 갑자기 침대, 이불, 소파나 바닥 등에 소변을 본다면 단순한 '반항'으로 판단해서는 안 됩니다. 방광이나 요도의 통증, 잦은 요의, 화장실 환경에 대한 불편감 또는 행동학적 원인 등 여러 가능성이 있습니다. 특히 갑작스러운 배뇨 행동 변화가 있다면 요로질환 여부를 확인하는 것이 좋습니다.</li>
          <li><strong>생식기나 아랫배를 과도하게 핥습니다:</strong> 생식기 주변이나 하복부를 평소보다 반복적으로 핥는 행동은 방광이나 요도 부위의 불편감이나 통증과 관련될 수 있습니다. 털이 빠질 정도로 과도한 그루밍이 지속된다면 다른 피부질환이나 행동 문제와 함께 비뇨기계 질환 가능성도 확인할 필요가 있습니다.</li>
          <li><strong>화장실을 자주 가지만 소변량이 적습니다:</strong> 평소보다 자주 화장실에 들어가거나 오랜 시간 힘을 주고, 소변 덩어리가 작아지거나 소량씩만 배뇨한다면 하부요로질환의 중요한 신호일 수 있습니다. 배뇨하면서 울거나 불편해하고 혈뇨가 보이는 경우도 있습니다.</li>
        </ul>
        <p className="mt-4">
          이러한 증상만으로 FIC라고 확정할 수는 없습니다. 요로결석, 요도폐색, 요로감염 등 다른 질환에서도 비슷한 증상이 나타날 수 있으므로 반복되거나 심해진다면 수의사의 진료가 필요합니다.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">🚨 특히 수컷 고양이의 '소변이 나오지 않는 상태'는 응급입니다</h3>
        <p>
          수컷 고양이는 암컷보다 요도가 길고 좁기 때문에 **요도폐색(Urethral Obstruction)**의 위험이 더 높습니다. FIC에 따른 염증이나 요도 경련, 요도 플러그, 결석 등이 요도를 막으면 소변이 정상적으로 배출되지 않을 수 있습니다.
        </p>
        <p>
          고양이가 화장실을 계속 들락거리며 힘을 주는데 **소변이 거의 나오지 않거나 전혀 나오지 않는다면 시간을 두고 지켜봐서는 안 됩니다.**
        </p>
        <p>
          완전한 요도폐색이 지속되면 신장 기능에 심각한 영향을 주고 혈중 칼륨 증가와 산-염기 이상, 요독증 등 생명을 위협하는 합병증으로 이어질 수 있습니다. 따라서 특히 수컷 고양이가 반복적으로 배뇨 자세를 취하지만 실제 소변이 나오지 않는다면 **즉시 응급 진료가 가능한 동물병원에 연락하여 진료를 받아야 합니다.**
        </p>
        <p>
          요도폐색의 치료는 고양이의 전신 상태와 폐색 정도에 따라 결정됩니다. 수액과 전해질 이상에 대한 안정화 치료가 필요할 수 있으며, 많은 경우 진정 또는 마취하에 요도 카테터 등을 이용해 폐색을 해소하는 치료가 시행됩니다.
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>수의학적 안내:</strong> 본 자가 확인 기능은 보호자가 관찰한 배뇨 행동을 바탕으로 고양이 하부요로질환 가능성을 확인하기 위한 참고 도구이며 FIC, 요로결석, 요로감염 또는 요도폐색을 확진할 수 없습니다. 특히 고양이가 반복적으로 힘을 주는데 소변이 나오지 않거나 극소량만 나오고, 통증·구토·무기력 등의 증상이 동반된다면 응급상황일 수 있으므로 결과와 관계없이 즉시 동물병원에서 진료를 받으시기 바랍니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="fic" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
