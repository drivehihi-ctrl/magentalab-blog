import type { Metadata } from "next";
import PatellaRisk Checker from "@/components/PatellaRisk Checker";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 검색 엔진 노출을 위한 슬개골 자가확인기 전용 메타데이터 설정
export const metadata: Metadata = {
  title: "강아지 슬개골 탈구 및 관절 건강 위험 신호 확인 도구 | 마젠타랩",
  description: "우리 아이의 걷는 자세가 이상한가요? 소형견/대형견 맞춤형 슬개골 탈구 위험 신호 확인 도구로 관절 건강 위험도를 1즉시 체크하고 수의학 관절 보호 가이드를 확인해 보세요.",
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
    "강아지 슬개골 탈구 자가확인", 
    "강아지 슬개골 탈구 증상", 
    "소형견 슬개골 탈구", 
    "강아지 관절 영양제", 
    "슬개골 보호 매트", 
    "마젠타랩 슬개골 확인", 
    "마젠타랩"
  ],
  openGraph: {
    title: "강아지 슬개골 탈구 및 관절 건강 위험 신호 확인 도구 | 마젠타랩",
    description: "아이의 견종, 나이, 몸무게 및 행동 변화 체크를 통해 관절 건강 상태와 위험 단계를 즉시 분석 확인해 보세요.",
    url: "https://www.magentalabblog.com/patella-diagnoser",
    type: "website",
    siteName: "Magentalab 반려동물 연구소",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "마젠타랩 강아지 슬개골 위험 신호 확인 도구 대표 이미지",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "강아지 슬개골 탈구 및 관절 건강 위험 신호 확인 도구 | 마젠타랩",
    description: "걷는 자세와 행동 징후 분석을 통해 알아내는 슬개골 탈구 위험도 자가 확인 프로그램.",
    images: ["/images/favicon.png"],
  }
};

import SeoArticle from "@/components/SeoArticle";

export default async function PatellaPage() {
  // Schema.org Structured Data - WebApplication / Risk Checker Tool
  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "강아지 슬개골 탈구 및 관절 건강 위험 신호 확인 도구",
    "url": "https://www.magentalabblog.com/patella-diagnoser",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "creator": {
      "@type": "Organization",
      "name": "Magentalab 반려동물 연구소",
      "url": "https://www.magentalabblog.com"
    },
    "description": "반려견의 나이, 체중, 걷는 모습 행동 증상을 기반으로 슬개골 탈구 및 관절 질환 위험도를 신속하게 확인하는 자가 확인 프로그램입니다."
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
      <PatellaRisk Checker />

      <SeoArticle title="소형견에서 흔한 슬개골 탈구(Patellar Luxation)란?">
        <p>
          슬개골 탈구(Patellar Luxation)는 말티즈, 포메라니안, 치와와, 미니어처 푸들 등 <strong>소형견에서 비교적 흔하게 발생하는 정형외과 질환</strong>입니다. 하지만 소형견이라면 반드시 발생하는 질환은 아니며, 품종과 개체에 따라 위험도에는 차이가 있습니다.
        </p>
        <p>
          슬개골은 무릎 앞쪽에 위치한 작은 뼈로, 정상적으로는 대퇴골 끝부분에 있는 홈인 <strong>활차구(Trochlear groove)</strong> 안에서 움직입니다. 슬개골 탈구는 이 슬개골이 정상 위치에서 안쪽 또는 바깥쪽으로 벗어나는 상태를 말하며, 소형견에서는 안쪽으로 빠지는 <strong>내측 슬개골 탈구(Medial Patellar Luxation, MPL)</strong>가 흔합니다.
        </p>
        <p>
          슬개골 탈구는 단순히 무릎의 홈이 얕아서 발생하는 질환으로만 보기 어렵습니다. 비외상성 슬개골 탈구는 유전적·발달적 요인의 영향을 받으며, 대퇴골과 경골의 형태와 각도, 경골조면의 위치, 대퇴사두근부터 슬개골과 슬개건으로 이어지는 신전기전의 정렬 이상 등이 복합적으로 관여할 수 있습니다.
        </p>
        <p>
          미끄러운 바닥에서 반복적으로 미끄러지거나 높은 곳에서 뛰어내리는 행동은 이미 관절이나 무릎에 문제가 있는 강아지에게 추가적인 부담이나 부상의 위험을 줄 수 있습니다. 다만 이러한 생활환경만으로 슬개골 탈구가 발생하거나 반드시 빠르게 진행된다고 단정할 수는 없습니다. 평소 적정 체중을 유지하고, 반복적인 미끄러짐이나 무리한 점프를 줄이는 환경을 만드는 것은 관절 건강 관리에 도움이 될 수 있습니다.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">슬개골 탈구는 어떻게 1~4기로 나눌까요?</h3>
        <p className="mb-4">
          슬개골 탈구의 기수는 단순히 걷는 모습만 보고 결정하는 것이 아니라, <strong>수의사가 슬개골의 위치와 탈구·환납 가능 여부를 촉진하여 평가</strong>합니다.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2 text-sm sm:text-base">
          <li><strong>1기(Grade I):</strong> 평소 슬개골은 정상적인 활차구 안에 위치하지만, 검사할 때 손으로 밀면 탈구시킬 수 있습니다. 손을 놓으면 슬개골이 다시 정상 위치로 돌아옵니다. 증상이 거의 없거나 간헐적으로 나타날 수 있으므로 보호자가 눈치채지 못하는 경우도 있습니다.</li>
          <li><strong>2기(Grade II):</strong> 슬개골이 움직임 중 자연스럽게 빠지거나 손으로 탈구될 수 있으며, 일정 시간 탈구된 상태로 머물 수 있습니다. 다리를 펴거나 자세를 바꾸면서 다시 제자리로 돌아오기도 합니다. 걷다가 갑자기 뒷다리를 몇 걸음 들고 걷는 이른바 <strong>'스키핑 보행(skipping gait)'</strong>이 나타날 수 있습니다.</li>
          <li><strong>3기(Grade III):</strong> 슬개골이 대부분의 시간 동안 탈구된 상태이지만 손으로 정상 위치에 넣는 것이 가능합니다. 다만 다시 쉽게 탈구될 수 있으며, 장기간 지속되면 대퇴골이나 경골의 정렬 이상과 다리 형태의 변형이 함께 나타날 수 있습니다. 지속적인 보행 이상이나 절뚝거림이 관찰될 수 있습니다.</li>
          <li><strong>4기(Grade IV):</strong> 슬개골이 지속적으로 탈구되어 있으며 손으로도 정상적인 활차구 안으로 되돌리기 어려운 가장 심한 단계입니다. 심한 골격 변형과 비정상적인 보행이 동반될 수 있지만, 통증의 정도와 보행 능력은 개체에 따라 다르게 나타날 수 있습니다.</li>
        </ul>

        <p className="mt-4">
          슬개골 탈구가 있다고 해서 모든 강아지가 수술을 받아야 하는 것은 아닙니다. <strong>증상이 없는 경도의 슬개골 탈구는 정기적으로 상태를 관찰하면서 관리하기도 합니다.</strong> 반면 반복적인 절뚝거림이나 통증이 있거나 탈구 정도가 심한 경우, 또는 골격 변형과 관절 손상이 진행되고 있다면 수술적 교정을 고려할 수 있습니다.
        </p>
        <p className="mt-4">
          슬개골이 반복적으로 활차구를 벗어나면 시간이 지나면서 관절 연골이 손상되고 골관절염이 진행할 수 있으며, 무릎의 다른 구조에도 부담을 줄 수 있습니다. 일부 강아지에서는 전십자인대 질환이 함께 발생하기도 합니다. 따라서 걸음걸이가 반복적으로 이상하거나 한쪽 뒷다리를 자주 들고 걷는다면 기수를 스스로 판단하기보다 정형외과적인 검진을 받아보는 것이 좋습니다.
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-6 font-medium text-sm">
          ⚠️ <strong>수의학적 안내:</strong> 본 자가 확인 기능은 보행 모습과 보호자가 관찰한 증상을 바탕으로 슬개골 탈구 가능성을 확인하는 참고 도구이며, 슬개골 탈구 여부나 기수를 확정하는 확인 도구가 아닙니다. 슬개골 탈구의 확인과 기수 평가는 수의사의 정형외과적 촉진 검사가 기본이며, 방사선 검사(X-ray)는 뼈의 형태와 정렬, 관절 변화 및 수술 계획 등을 평가하기 위해 추가로 시행될 수 있습니다. 증상이 반복되거나 통증, 지속적인 절뚝거림, 체중 부하 감소가 나타난다면 동물병원에서 진료를 받으시기 바랍니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="patella" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
