import type { Metadata } from "next";
import EmergencyCalculator from "@/components/EmergencyCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 구글 및 네이버 검색 노출을 위한 응급 계산기 전용 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 응급 독성 계산기 (강아지 초콜릿/고양이 백합 등 위험 물질 판정) | 마젠타랩",
  description: "강아지나 고양이가 초콜릿(밀크/다크), 포도, 자일리톨, 양파, 백합 등 위험 물질을 섭취했을 때 체중 대비 의학적 위험 평가(Risk Assessment)와 권장 행동(Action Level)을 즉시 분석합니다.",
  alternates: {
    canonical: "https://www.magentalabblog.com/emergency-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/emergency-calculator",
      en: "https://www.magentalabblog.com/en/emergency-calculator",
      ja: "https://www.magentalabblog.com/ja/emergency-calculator",
    },
  },
  keywords: [
    "반려동물 중독 계산기",
    "강아지 초콜릿 계산기", 
    "고양이 백합",
    "고양이 초콜릿 계산기",
    "고양이 양파 중독",
    "강아지 포도 먹었을때", 
    "강아지 자일리톨 위험도", 
    "테오브로민 계산기", 
    "반려동물 응급실", 
    "마젠타랩 응급 계산기", 
    "마젠타랩"
  ],
  openGraph: {
    title: "반려동물 통합 응급 독성 계산기 | 마젠타랩",
    description: "아이가 먹은 초콜릿, 백합, 포도, 양파 등의 의학적 위험 평가와 신속 대처 레벨을 분석해 보세요.",
    url: "https://www.magentalabblog.com/emergency-calculator",
    type: "website",
    siteName: "Magentalab 반려동물 연구소",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "마젠타랩 반려동물 응급 독성 계산기 대표 이미지",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "반려동물 통합 응급 독성 계산기 | 마젠타랩",
    description: "반려동물 위험 물질 섭취 시 의학적 위험 평가 및 권장 행동 가이드 실시간 분석.",
    images: ["/images/favicon.png"],
  }
};

import SeoArticle from "@/components/SeoArticle";

export default async function EmergencyCalculatorPage() {
  let relatedPosts: any[] = [];
  try {
    // 세 가지 핵심 키워드(초콜릿, 포도, 자일리톨)로 병렬 검색 수행
    const [chocolatePosts, grapePosts, xylitolPosts] = await Promise.all([
      searchPosts("초콜릿"),
      searchPosts("포도"),
      searchPosts("자일리톨")
    ]);

    // 검색된 글들을 합친 뒤 중복 제거
    const combined = [...chocolatePosts, ...grapePosts, ...xylitolPosts];
    const uniquePostsMap = new Map();
    combined.forEach(post => uniquePostsMap.set(post.id, post));
    
    relatedPosts = Array.from(uniquePostsMap.values()).slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch related posts for Emergency:", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <EmergencyCalculator />

      <SeoArticle title="강아지와 고양이 중독(Toxicity), 빠른 대처가 중요합니다">
        <p>
          사람에게는 안전한 음식이나 식물이라도 강아지와 고양이에게는 심각한 중독을 일으킬 수 있습니다. 대표적인 위험 물질로는 <strong>초콜릿의 테오브로민·카페인, 포도와 건포도, 양파·마늘 등 파속(Allium) 식물, 자일리톨, 그리고 고양이에게 치명적인 일부 백합류</strong> 등이 있습니다.
        </p>
        <p>
          반려동물이 위험 물질을 섭취했다면 가장 중요한 것은 증상이 나타날 때까지 기다리는 것이 아니라 <strong>가능한 한 빨리 동물병원에 연락하는 것</strong>입니다. 독성의 정도는 섭취한 물질의 종류와 농도, 섭취량, 반려동물의 체중, 섭취 후 경과 시간 및 현재 증상에 따라 크게 달라질 수 있습니다.
        </p>
        <p>
          초콜릿이나 자일리톨처럼 체중 대비 섭취량(mg/kg)이 위험도를 판단하는 데 중요한 물질도 있지만, 모든 중독을 단순한 용량 계산만으로 판단할 수 있는 것은 아닙니다. 특히 포도·건포도나 고양이의 백합 노출처럼 안전한 섭취량을 정확히 예측하기 어려운 경우에는 <strong>소량으로 보여도 수의학적인 상담이 필요합니다.</strong>
        </p>
        <p>
          또한 중독 처치는 무조건적인 구토 유도가 아닙니다. 최근 섭취한 특정 물질의 경우 수의사가 구토 유도나 기타 위장관 제독을 고려할 수 있지만, 섭취한 물질과 동물의 상태에 따라 구토를 시키면 오히려 위험해지는 경우도 있습니다. 따라서 임의로 처치하기보다 섭취한 제품이나 식물의 이름, 먹은 것으로 추정되는 양, 섭취 시각과 반려동물의 체중을 확인해 동물병원에 전달하는 것이 중요합니다.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">주요 위험 물질별 중독 증상</h3>
        <ul className="list-disc list-inside space-y-2 mt-2 text-sm sm:text-base">
          <li><strong>초콜릿·코코아:</strong> 초콜릿에는 테오브로민(Theobromine)과 카페인(Caffeine)이라는 메틸잔틴 성분이 들어 있습니다. 특히 코코아 분말이나 베이킹 초콜릿, 카카오 함량이 높은 다크초콜릿은 일반적으로 더 높은 농도의 메틸잔틴을 포함할 수 있습니다. 중독 시 구토, 설사, 안절부절못함, 갈증 증가, 빠른 호흡, 빈맥이나 부정맥, 떨림 및 발작 등이 나타날 수 있으며, 심한 경우 생명을 위협할 수 있습니다. 위험도는 <strong>초콜릿의 종류와 섭취량, 반려동물의 체중</strong>을 함께 고려해야 합니다.</li>
          <li><strong>포도 및 건포도:</strong> 포도와 건포도는 일부 강아지에서 <strong>급성 신장손상(Acute Kidney Injury, AKI)</strong>을 일으킬 수 있습니다. 최근 연구에서는 타르타르산(Tartaric acid)이 주요 독성 원인으로 제시되고 있지만, 포도마다 함량이 다르고 개체별 민감도 차이도 있어 정확한 위험 섭취량을 예측하기 어렵습니다. 따라서 강아지가 포도나 건포도를 먹었다면 양이 적어 보여도 임의로 안전하다고 판단하지 않는 것이 좋습니다.</li>
          <li><strong>양파·마늘 등 파속 식물:</strong> 양파, 마늘, 파, 부추 등에는 적혈구를 산화 손상시킬 수 있는 유기황 화합물이 포함되어 있습니다. 충분한 양을 섭취하면 적혈구가 손상되어 <strong>용혈성 빈혈</strong>이 발생할 수 있으며, 무기력, 식욕부진, 구토, 잇몸 창백, 빠른 호흡 등의 증상이 나타날 수 있습니다. 특히 고양이는 파속 식물의 독성에 민감한 것으로 알려져 있습니다.</li>
          <li><strong>백합류(특히 고양이):</strong> 고양이에게는 Lilium속의 진짜 백합과 Hemerocallis속 원추리류가 특히 위험합니다. 꽃이나 잎뿐 아니라 <strong>꽃가루 또는 꽃병의 물을 섭취하는 것만으로도 심각한 급성 신장손상</strong>이 발생할 수 있습니다. 고양이가 이러한 백합류에 노출되었다면 증상이 없더라도 즉시 동물병원에 연락하는 것이 중요합니다. 모든 이름에 '백합(lily)'이 들어가는 식물이 동일한 신장독성을 갖는 것은 아니므로 식물의 정확한 종류를 확인하는 것도 중요합니다.</li>
          <li><strong>자일리톨(강아지):</strong> 자일리톨은 강아지에서 빠른 인슐린 분비를 유발하여 <strong>심각한 저혈당</strong>을 일으킬 수 있습니다. 구토, 무기력, 비틀거림, 떨림, 발작 등이 나타날 수 있으며, 더 많은 양을 섭취한 일부 강아지에서는 심각한 간손상이나 간부전이 발생할 수 있습니다. 껌이나 사탕뿐 아니라 일부 무설탕 식품, 치약, 의약품 및 보충제에도 자일리톨이 포함될 수 있으므로 성분표 확인이 중요합니다.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">🚨 중독이 의심될 때 보호자가 해야 할 일</h3>
        <p>
          반려동물이 독성물질을 먹었다고 의심된다면 <strong>증상이 나타날 때까지 기다리지 말고 즉시 동물병원에 연락하세요.</strong> 가능하면 제품 포장지나 성분표, 먹은 식물의 사진을 준비하고, 섭취한 것으로 추정되는 양과 시간, 반려동물의 체중을 함께 알려주는 것이 진료에 도움이 됩니다.
        </p>
        <p>
          <strong>보호자의 판단으로 소금물이나 약물 등을 이용해 강제로 구토를 유발해서는 안 됩니다.</strong> 특히 고양이에게 과산화수소를 이용해 구토를 유도하는 것은 위험합니다. 강아지의 경우에도 3% 과산화수소가 특정 상황에서 수의사의 지시에 따라 사용될 수 있지만, 모든 중독에 적합한 방법은 아니며 잘못 사용하면 위장관 손상이나 흡인 등의 합병증을 일으킬 수 있습니다. 반드시 수의사의 구체적인 지시를 받은 경우에만 시행해야 합니다.
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>수의학적 안내:</strong> 중독 위험도 계산 결과는 응급상황의 판단을 돕기 위한 참고 자료이며, 안전 여부를 확정하거나 수의사의 진료를 대신할 수 없습니다. 독성물질마다 위험 용량과 흡수 속도, 치료 방법이 다르며 포도·건포도나 백합류처럼 계산만으로 안전성을 판단하기 어려운 물질도 있습니다. 위험 물질을 섭취했거나 섭취 여부가 확실하지 않더라도 중독 가능성이 있다면 가능한 한 빨리 동물병원에 문의하시기 바랍니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="emergency" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
