import type { Metadata } from "next";
import DmCalculator from "@/components/DmCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 구글 및 네이버 검색 최적화를 위한 전용 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 사료 영양성분(DM) 및 하루 참고 음수량 계산기 | 마젠타랩",
  description: "사료 등록성분표의 조단백, 조지방 함량을 수분이 없는 건물(Dry Matter) 기준으로 자동 환산합니다. 또한 개와 고양이의 체중별 참고용 일일 목표 음수량(ml)과 종이컵 환산 가이드를 제공합니다.",
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
    title: "반려동물 사료 영양성분(DM) 및 하루 참고 음수량 계산기 | 마젠타랩",
    description: "아이의 체중 기반 일일 참고 음수량과 사료의 실제 단백질/지방 함량(건물 기준)을 환산하여 확인해 보세요.",
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
    title: "반려동물 사료 영양성분(DM) 및 하루 참고 음수량 계산기 | 마젠타랩",
    description: "체중 기반 일일 참고 음수량과 사료의 건물 기준 영양성분을 확인하는 참고 계산 도구입니다.",
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
          반려동물 사료의 포장지에는 관련 표시 기준에 따라 조단백질, 조지방, 조섬유, 수분 등의 등록성분량 또는 영양 정보가 표시됩니다. 하지만 포장지에 적힌 대부분의 영양성분 수치는 사료에 포함된 <strong>수분(Moisture)을 그대로 포함한 상태인 급여 상태 기준(As-fed basis)</strong>으로 표시됩니다.
        </p>
        <p>
          이 때문에 수분 함량이 크게 다른 사료끼리는 포장지에 적힌 숫자만 보고 영양소 함량을 직접 비교하면 오해가 생길 수 있습니다.
        </p>
        <p>
          예를 들어 습식 사료는 일반적으로 수분 함량이 매우 높고, 건식 사료는 상대적으로 수분 함량이 낮습니다. 습식 사료의 단백질 표시 수치가 건식 사료보다 낮아 보여도, 수분을 제외한 실제 고형분 안에서 차지하는 단백질 비율은 더 높을 수도 있습니다.
        </p>
        <p>
          이처럼 서로 수분 함량이 다른 사료의 단백질·지방·탄수화물 등의 <strong>영양소 밀도를 비교하려면 수분을 제외한 건물 기준(Dry Matter, DM)으로 환산하는 것이 유용합니다.</strong>
        </p>
        <p>
          건물 기준은 실제로 사료에서 물을 물리적으로 완전히 제거한다는 의미라기보다, 계산 과정에서 수분을 제외하고 나머지 고형분을 100%로 보았을 때 해당 영양소가 어느 정도를 차지하는지 나타내는 방식입니다.
        </p>
        <p>
          따라서 건식 사료와 습식 사료, 동결건조 사료처럼 수분 함량이 크게 다른 제품을 비교할 때는 단순한 포장지 수치보다 <strong>DM 기준으로 환산한 값을 함께 확인하는 것이 보다 적절합니다.</strong>
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">고양이와 강아지의 하루 수분 섭취가 중요한 이유</h3>
        <p>
          충분한 수분 섭취는 강아지와 고양이의 정상적인 신체 기능을 유지하는 데 매우 중요합니다. 수분은 혈액순환과 체온 조절, 소화 및 대사 과정에 필요하며 신장과 요로계가 정상적으로 기능하는 데에도 중요한 역할을 합니다.
        </p>
        <p>
          다만 <strong>물을 많이 마신다고 신부전이나 방광염, 요로결석을 반드시 예방할 수 있는 것은 아닙니다.</strong> 이러한 질환은 나이, 유전적 요인, 식이, 요 성분, 기저질환 등 다양한 원인의 영향을 받습니다. 그럼에도 적절한 수분 섭취는 정상적인 수분 균형을 유지하고, 일부 요로질환 관리에서는 중요한 요소가 될 수 있습니다.
        </p>
        <p>
          건강한 강아지와 고양이의 하루 필요 수분량은 체중과 활동량, 주변 온도, 사료 종류, 건강 상태 등에 따라 달라집니다. 일반적인 참고 범위로는 <strong>체중 1kg당 하루 약 40~60mL 전후의 총 수분 섭취량</strong>이 자주 사용되지만, 이는 모든 반려동물에게 적용되는 고정된 목표치는 아닙니다.
        </p>
        <p>
          여기서 말하는 하루 수분량에는 <strong>물그릇에서 직접 마시는 물뿐 아니라 습식 사료나 기타 음식에 포함된 수분도 포함</strong>됩니다.
        </p>
        <p>
          특히 습식 사료는 많은 양의 수분을 포함하고 있기 때문에 습식 사료를 주로 먹는 반려동물은 물그릇에서 마시는 양이 적어 보일 수 있습니다. 반대로 건식 사료를 먹는 반려동물은 음식에서 섭취하는 수분이 적기 때문에 필요한 수분의 상당 부분을 직접 물을 마셔 보충하게 됩니다.
        </p>
        <p>
          고양이는 개에 비해 자발적인 음수 행동이 적게 관찰되는 경우가 있으며, 일부 고양이는 충분한 수분 섭취를 유도하기 위해 환경적인 도움이 필요할 수 있습니다. 물그릇을 여러 장소에 배치하거나 신선한 물을 자주 교체하고, 고양이가 선호한다면 급수기를 이용하거나 습식 사료를 활용하는 방법 등을 고려할 수 있습니다.
        </p>
        <p>
          다만 모든 고양이가 건식 사료를 먹는다는 이유만으로 만성 탈수 상태가 되는 것은 아니며, 모든 반려동물에게 습식 사료나 추가적인 수분 급여가 반드시 필요한 것도 아닙니다. <strong>중요한 것은 식사에 포함된 수분과 직접 마시는 물을 합친 총 수분 섭취량과 개별 건강 상태를 함께 확인하는 것입니다.</strong>
        </p>
        <p>
          또한 갑자기 물을 평소보다 지나치게 많이 마시거나 소변량이 크게 증가했다면 단순히 “물을 잘 마신다”고 판단해서는 안 됩니다. 다갈·다뇨는 신장질환, 당뇨병, 내분비질환 등 여러 건강 문제에서 나타날 수 있으므로 변화가 지속된다면 수의사의 진료가 필요합니다.
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>수의학적 안내:</strong> 하루 수분 필요량은 일반적인 참고값이며, 체중과 사료 종류, 활동량, 온도, 임신·수유 여부 및 건강 상태에 따라 달라질 수 있습니다. 특히 만성 신장질환, 심장질환, 요로결석이나 기타 요로계 질환이 있는 반려동물은 일반적인 수분 섭취 기준과 다른 관리가 필요할 수 있습니다. 처방식의 영양성분을 비교하거나 질환 치료 목적으로 급수량과 식이를 변경할 경우에는 수의사의 지시에 따라 진행하시기 바랍니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="dm" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
