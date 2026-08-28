import type { Metadata } from "next";
import AgeCalculator from "@/components/AgeCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { searchPosts } from "@/lib/wp";

// 구글 및 네이버 검색 노출을 위한 나이 계산기 전용 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "반려동물 나이 계산기 및 생애주기 가이드 | 마젠타랩",
  description: "우리 강아지와 고양이의 출생년도 및 체형 크기를 반영하여 사람 나이 환산 참고값을 제공합니다. 생후 개월 수 비례 나이 변환 공식을 적용하며, 생애주기별(성장기/성숙기/장년기/노령기) 맞춤 건강 가이드를 제공합니다.",
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
    "강아지 사람 나이 참고값",
    "고양이 사람 나이 참고값",
    "강아지 나이 환산",
    "고양이 나이 환산",
    "강아지 생애주기",
    "고양이 생애주기",
    "강아지 노화 속도",
    "마젠타랩 나이 계산기",
    "마젠타랩"
  ],
  openGraph: {
    title: "반려동물 나이 계산기 및 생애주기 가이드 | 마젠타랩",
    description: "아이의 출생일과 체형에 맞춰 수의학 데이터를 바탕으로 사람 나이 환산 참고값과 생애주기를 확인해보세요.",
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
    title: "반려동물 나이 계산기 및 생애주기 가이드 | 마젠타랩",
    description: "우리 아이의 사람 나이 환산 참고값와 생애주기별 맞춤 케어 수칙을 즉시 계산합니다.",
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

      <SeoArticle title="강아지와 고양이의 나이, 사람 나이로 어떻게 환산할까요?">
        <p>
          "우리 강아지나 고양이가 사람 나이로 치면 몇 살일까?" 많은 보호자님들이 궁금해하는 질문입니다. 과거에는 반려동물의 나이에 단순히 7을 곱하는 방식(예: 3살 = 21살)이 널리 알려졌지만, 실제 노화 속도는 성장 단계와 종, 품종, 체격에 따라 달라 <strong>단순한 곱셈만으로 정확하게 환산하기는 어렵습니다.</strong>
        </p>
        <p>
          최근에는 개의 DNA 메틸화 변화를 분석해 사람과 노화 과정을 비교하는 <strong>후성유전학적 노화 시계(Epigenetic clock)</strong> 연구도 진행되고 있습니다. 다만 이러한 연구 결과가 모든 강아지와 고양이에게 공통으로 적용되는 임상 표준 나이 계산법은 아닙니다. 따라서 사람 나이 환산 결과는 정확한 생물학적 나이라기보다 <strong>반려동물의 생애단계를 이해하기 위한 참고 자료</strong>로 보는 것이 적절합니다.
        </p>
        <p>
          강아지와 고양이는 <strong>생후 첫 1~2년 동안 사람보다 매우 빠르게 성장하고 성적으로 성숙</strong>하며, 이후에는 성장과 노화 속도가 점차 완만해집니다. 특히 강아지는 체격과 품종에 따라 노화 속도와 기대수명의 차이가 큽니다. 일반적으로 대형견은 소형견보다 기대수명이 짧고, 노화와 관련된 변화가 더 이른 시기에 나타나는 경향이 있습니다.
        </p>
        <p>
          따라서 반려동물의 나이를 관리할 때는 단순한 '사람 나이' 숫자보다는 <strong>현재 생애단계, 품종과 체격, 체중, 활동량 및 건강 상태를 함께 확인하는 것이 더 중요합니다.</strong>
        </p>
        
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">생애주기에 따른 건강 케어 핵심 포인트</h3>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>퍼피/키튼 (성장기):</strong> 골격과 신경계, 면역계가 빠르게 발달하는 시기입니다. 성장 단계에 맞는 <strong>영양 균형이 갖춰진 완전사료</strong>를 급여하고, 필요한 예방접종과 기생충 예방을 일정에 맞춰 진행하는 것이 중요합니다. 특히 성장기에 칼슘이나 특정 영양소를 임의로 과다 보충하는 것은 바람직하지 않을 수 있습니다. 또한 어린 시기의 적절한 사회화와 긍정적인 경험은 이후 행동 발달과 환경 적응에 중요한 영향을 줄 수 있습니다.</li>
          <li><strong>성견/성묘 (성년기):</strong> 신체 기능과 활동성이 비교적 안정적으로 유지되는 시기입니다. 활동량보다 섭취 칼로리가 많아지면 체중이 쉽게 증가할 수 있으므로 규칙적인 산책과 놀이, 적절한 급여량을 통해 <strong>이상적인 체형과 BCS를 유지하는 것</strong>이 중요합니다. 일반적으로 9점 BCS 척도에서 약 <strong>4~5/9</strong>가 이상적인 범위로 평가되지만, 정확한 평가는 개체의 체격과 근육량 등을 함께 고려해야 합니다.</li>
          <li><strong>시니어/노령기:</strong> 시니어가 시작되는 시기는 모든 반려동물에게 동일하지 않습니다. 강아지는 품종과 체격, 예상 수명에 따라 노화 시점이 달라지며, 수의학적으로는 예상 수명의 후반부를 시니어 단계로 평가하는 방법이 사용됩니다. 고양이는 일반적으로 <strong>10세를 넘어서면서 시니어 단계로 평가하는 기준</strong>이 널리 활용됩니다. 나이가 들수록 관절질환, 만성 신장질환, 치과질환, 심혈관계 질환 및 인지기능 변화 등 다양한 건강 문제의 발생 가능성이 높아질 수 있으므로 정기적인 건강 상태 확인이 더욱 중요합니다.</li>
        </ul>
        
        <p className="mt-4">
          시니어 반려동물은 젊은 시기보다 건강 변화를 조기에 발견하는 것이 중요하므로 <strong>정기적인 수의사 진찰과 필요에 따른 혈액·소변검사 등의 건강검진</strong>을 고려하는 것이 좋습니다. 초음파나 방사선검사와 같은 추가 영상검사는 모든 반려동물에게 일률적으로 시행하기보다 증상, 품종별 위험 요인, 신체검사 및 기본 검사 결과를 토대로 수의사가 필요성을 판단합니다.
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>수의학적 안내:</strong> 사람 나이 환산 결과는 일반적인 생애주기와 통계적 경향을 이해하기 위한 참고값이며, 실제 생물학적 노화 정도를 정확하게 나타내는 수치는 아닙니다. 품종과 체격, 유전적 요인, 영양 상태, 운동량, 생활환경, 질병 여부 등에 따라 동일한 나이의 반려동물도 건강 상태와 노화 정도가 크게 다를 수 있습니다. 사람 나이 계산 결과보다는 현재의 체중과 BCS, 활동성, 행동 변화 및 정기적인 건강검진 결과를 함께 확인하는 것이 중요합니다.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="age" />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </div>
  );
}
