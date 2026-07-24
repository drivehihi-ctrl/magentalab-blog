import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "안심이 1:1 상담소 | 마젠타랩 반려동물 연구소",
  description: "반려동물 건강 고민이나 궁금증을 안심 연구원에게 질문해 보세요. 과학적 근거와 따뜻한 조언을 전달해 드립니다.",
  alternates: {
    canonical: "https://www.magentalabblog.com/ask-ansimi",
  },
  openGraph: {
    title: "안심이 1:1 상담소 | 마젠타랩 반려동물 연구소",
    description: "반려동물 건강 고민이나 궁금증을 안심 연구원에게 질문해 보세요.",
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
