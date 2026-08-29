import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "안심이에게 질문하기 | 마젠타랩 반려동물 연구소",
  description: "반려동물 건강 정보나 궁금증을 마젠타랩 브랜드 캐릭터 안심이에게 질문해 보세요. 공개된 수의학 자료를 바탕으로 한 참고 정보를 안내해 드립니다.",
  alternates: {
    canonical: "https://www.magentalabblog.com/ask-ansimi",
  },
  openGraph: {
    title: "안심이에게 질문하기 | 마젠타랩 반려동물 연구소",
    description: "반려동물 건강 정보나 궁금증을 안심이에게 질문해 보세요.",
    url: "https://www.magentalabblog.com/ask-ansimi",
    type: "website",
  },
};

export default function AskAnsimiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
