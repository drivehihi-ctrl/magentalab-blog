import type { Metadata } from "next";
import EmergencyCalculator from "@/components/EmergencyCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 구글 및 네이버 검색 노출을 위한 응급 계산기 전용 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 응급 독성 계산기 (강아지 초콜릿/고양이 백합 위험 물질 판정) | 마젠타랩",
  description: "강아지나 고양이가 초콜릿(밀크/다크), 포도, 자일리톨, 양파, 백합 등 위험 물질을 섭취했을 때 체중 대비 치사 독성 농도를 즉시 계산합니다. 4단계 위험도 신호 및 신속 대처 레벨 수록.",
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
    "강아지 자일리톨 치사량", 
    "테오브로민 계산기", 
    "반려동물 응급실", 
    "마젠타랩 응급 계산기", 
    "마젠타랩"
  ],
  openGraph: {
    title: "반려동물 통합 응급 독성 계산기 | 마젠타랩",
    description: "아이가 먹은 초콜릿, 백합, 포도, 양파 등의 독성 용량과 신속 대처 레벨을 0초 만에 분석 진단해 보세요.",
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
    description: "반려동물 오섭취 독성 성분별 수의학 치사량 및 응급 대처 가이드 실시간 분석.",
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

      <SeoArticle title="강아지와 고양이 중독(Toxicity), 골든타임이 생명입니다">
        <p>
          사람에게는 무해하거나 유익한 음식들이 강아지와 고양이에게는 적은 양으로도 치명적인 **맹독(Toxin)**으로 작용할 수 있습니다. 대표적으로 <strong>초콜릿(테오브로민), 포도/건포도(타르타르산), 양파/마늘(N-프로필 이황화물), 자일리톨, 그리고 백합과 식물</strong> 등이 있습니다.
        </p>
        <p>
          아이가 위험 물질을 섭취했을 때 가장 중요한 것은 <strong>'섭취 후 경과 시간(골든타임)'</strong>과 <strong>'아이의 체중 대비 섭취량(mg/kg)'</strong>입니다. 섭취 후 2시간 이내라면 동물병원에서 구토 유발 처치나 위세척을 통해 체내 흡수를 막을 수 있지만, 골든타임이 지나 독소가 혈류를 타고 전신으로 퍼진 후에는 급성 신부전이나 간 괴사, 심박수 급증으로 인한 심정지 등 되돌릴 수 없는 결과로 이어집니다.
        </p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">주요 위험 물질별 치명적인 증상</h3>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>초콜릿(다크/카카오):</strong> 테오브로민(Theobromine) 성분이 중추신경계를 자극하여 구토, 빈맥(심박동수 증가), 극심한 헐떡임, 발작을 일으키며 24시간 내 심부전으로 사망할 수 있습니다.</li>
          <li><strong>포도 및 건포도:</strong> 정확한 기전이 모두 밝혀지진 않았으나 타르타르산(Tartaric acid)에 의해 소량 섭취만으로도 <strong>급성 신부전(ARF)</strong>이 발생해 며칠 내로 요독증으로 사망에 이릅니다.</li>
          <li><strong>백합(고양이 한정):</strong> 고양이에게 백합은 꽃가루나 잎 한 잎만 핥아도 급성 신부전을 유발하는 맹독입니다. 집 안에 들이는 것 자체를 금지해야 합니다.</li>
          <li><strong>자일리톨:</strong> 강아지가 자일리톨을 섭취하면 인슐린이 과다 분비되어 <strong>저혈당 쇼크</strong>가 오고, 단기간에 심각한 간 괴사(간부전)가 발생합니다.</li>
        </ul>
        <p className="bg-rose-50 text-rose-800 p-4 rounded-xl mt-6 font-bold border border-rose-200">
          🚨 절대 집에서 과산화수소나 소금물로 강제 구토를 유발하지 마세요! 식도 점막이 심하게 손상되거나, 거품이 기도로 넘어가 흡인성 폐렴을 유발해 더 빠르게 사망할 수 있습니다. 계산 결과를 바탕으로 즉시 24시간 동물병원으로 달려가세요.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="emergency" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
