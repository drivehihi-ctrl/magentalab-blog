import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "안심이에게 질문하기 | 마젠타랩",
  description: "마젠타랩 브랜드 캐릭터 안심이에게 반려동물 건강과 생활에 관한 질문을 남기고 공개 자료를 바탕으로 한 참고 정보를 확인해 보세요.",
  alternates: {
    canonical: "https://www.magentalabblog.com/ask-ansimi",
  },
  openGraph: {
    title: "안심이에게 질문하기 | 마젠타랩",
    description: "마젠타랩 브랜드 캐릭터 안심이에게 반려동물 건강과 생활에 관한 질문을 남기고 공개 자료를 바탕으로 한 참고 정보를 확인해 보세요.",
    url: "https://www.magentalabblog.com/ask-ansimi",
    type: "website",
  },
  twitter: {
    title: "안심이에게 질문하기 | 마젠타랩",
    description: "마젠타랩 브랜드 캐릭터 안심이에게 반려동물 건강과 생활에 관한 질문을 남기고 공개 자료를 바탕으로 한 참고 정보를 확인해 보세요.",
  }
};

export default function AskAnsimiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
