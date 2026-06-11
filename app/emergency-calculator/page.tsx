import type { Metadata } from "next";
import EmergencyCalculator from "@/components/EmergencyCalculator";

// 구글 및 네이버 검색 노출을 위한 응급 계산기 전용 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "강아지 초콜릿 및 위험 물질 응급 독성 계산기 | 마젠타랩",
  description: "강아지가 초콜릿(밀크/다크), 포도, 자일리톨 등을 섭취했을 때 체중 대비 치사 독성 농도를 즉시 계산합니다. 수의학 기초 응급 대처 지침 및 위험군 판별 신호등 시각화.",
  keywords: [
    "강아지 초콜릿 계산기", 
    "강아지 초콜릿 치사량", 
    "강아지 포도 먹었을때", 
    "강아지 자일리톨 치사량", 
    "테오브로민 계산기", 
    "강아지 초콜릿 치사량 계산기", 
    "강아지 응급실", 
    "마젠타랩 응급 계산기", 
    "마젠타랩"
  ],
  openGraph: {
    title: "강아지 초콜릿 및 위험 물질 응급 독성 계산기 | 마젠타랩",
    description: "아이가 먹은 초콜릿, 포도, 자일리톨의 독성 용량과 신속 대처 레벨을 0초 만에 분석 진단해 보세요.",
    url: "https://www.magentalabblog.com/emergency-calculator",
    type: "website",
    siteName: "Magentalab 반려동물 연구소",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "마젠타랩 강아지 응급 독성 계산기 대표 이미지",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "강아지 초콜릿 및 위험 물질 응급 독성 계산기 | 마젠타랩",
    description: "강아지 오섭취 독성 성분별 수의학 치사량 및 응급 대처 가이드 실시간 분석.",
    images: ["/images/favicon.png"],
  }
};

export default function EmergencyCalculatorPage() {
  return <EmergencyCalculator />;
}
