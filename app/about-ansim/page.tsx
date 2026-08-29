import { Metadata } from "next";
import { getPosts } from "@/lib/wp";
import Link from "next/link";
import RelatedPosts from "@/components/RelatedPosts";

export const metadata: Metadata = {
  title: "안심이 소개",
  description: "마젠타랩의 브랜드 캐릭터이자 보호자를 위한 가이드, 안심이를 소개합니다.",
  alternates: {
    canonical: "https://www.magentalabblog.com/about-ansim",
    languages: {
      'ko-KR': 'https://www.magentalabblog.com/about-ansim',
      'en-US': 'https://www.magentalabblog.com/en/about-ansim',
      'ja-JP': 'https://www.magentalabblog.com/ja/about-ansim',
    },
  },
  openGraph: {
    title: "안심이 소개",
    description: "마젠타랩의 브랜드 캐릭터이자 보호자를 위한 가이드, 안심이를 소개합니다.",
    url: "https://www.magentalabblog.com/about-ansim",
    type: "website",
    siteName: "Magentalab 반려동물 연구소",
    images: [{ url: "/images/favicon.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "안심이 소개",
    description: "마젠타랩의 브랜드 캐릭터이자 보호자를 위한 가이드, 안심이를 소개합니다.",
    images: ["/images/favicon.png"]
  }
};

export default async function AboutAnsimPage() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6);
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch posts for About Ansim:", error);
  }

  return (
    <article className="pb-24">
      {/* Page Header */}
      <header className="relative pt-16 pb-24 bg-white border-b border-gray-100 overflow-hidden text-center">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 mb-10 text-sm font-bold text-magenta uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            홈으로 돌아가기
          </Link>
          
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest">
            About Ansim
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4">
            안심이는 어떤 연구원인가요?
          </h1>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-magenta/5 blur-3xl opacity-30 transform translate-y-1/2" />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-4xl mt-12">
        <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-2xl shadow-gray-200/50 border border-gray-100">
          <div className="wp-content prose prose-lg md:prose-xl prose-magenta max-w-none text-gray-700 leading-relaxed font-normal mb-16">
            <img 
              src="https://magentalab.mycafe24.com/wp-content/uploads/2026/04/33-17-1024x572.jpeg" 
              alt="Magentalab Ansim Dachshund Mascot" 
              className="rounded-3xl w-full mb-8 shadow-md"
            />
            
            <p>반려동물이 평소와 다른 행동을 할 때, 인터넷에서 어려운 수의학 자료를 읽다가 "그래서 우리 아이에게는 무슨 뜻이지?" 하고 막막했던 적 있으신가요? 안심이는 바로 그런 순간, 보호자의 곁에서 어려운 정보를 쉽게 풀어주기 위해 탄생했습니다.</p>
            
            <h2>안심이가 하는 일</h2>
            <p>안심이는 마젠타랩이 반려동물 건강과 생활 정보를 보호자의 눈높이에서 쉽게 설명하기 위해 만든 <strong>닥스훈트 연구원 콘셉트의 브랜드 캐릭터</strong>입니다. 실제 수의사나 의료인이 아니며, 질병을 직접 진단하거나 치료를 처방하지 않습니다.</p>
            <p>대신 안심이는 다음과 같은 역할을 합니다:</p>
            <ul>
              <li>어려운 수의학 자료를 보호자가 이해하기 쉬운 일상적인 말로 번역해 드립니다.</li>
              <li>서로 다른 연구와 가이드라인을 비교하여 맥락을 알기 쉽게 정리합니다.</li>
              <li>생활 속 가벼운 증상과, 반드시 동물병원 응급 진료가 필요한 상황을 분명하게 구분해 안내합니다.</li>
            </ul>

            <h2>어떤 자료를 참고하나요?</h2>
            <p>마젠타랩은 반려동물 건강과 생활 정보를 설명할 때 공신력 있는 수의학 가이드라인, 정부기관 자료와 동료 평가를 거친 연구를 우선적으로 확인합니다. AAHA(미국동물병원협회), WSAVA(세계소동물수의사회), Merck Veterinary Manual, FDA 등 신뢰할 수 있는 자료를 기반으로 콘텐츠를 제작합니다.</p>

            <h2>계산기와 위험 확인 도구는 어떻게 봐야 하나요?</h2>
            <p>마젠타랩에서 제공하는 다양한 계산기(음수량, 칼로리 등)와 위험 확인 도구는 보호자가 아이의 상태를 이해하고 기록하기 위한 <strong>참고용 도구</strong>입니다. 이는 실제 수의사의 신체검사와 진단을 대신할 수 없으며, 결과 하나만으로 특정 질병을 판단해서는 안 됩니다.</p>

            <h2>안심이가 지키는 약속</h2>
            <p>모르는 것은 모른다고 정직하게 말하고, 새로운 근거가 확인되면 내용을 다시 검토하고 필요한 부분을 수정합니다. 무엇보다 온라인 검색보다 생명이 우선이기에, 응급 상황에서는 지체 없이 동물병원 진료를 받도록 안내하는 것을 가장 중요한 원칙으로 삼겠습니다.</p>
          </div>
          
          
          
          {/* CTA / Footer */}
          <div className="mt-20 pt-12 border-t border-gray-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              안심이에게 궁금한 점이 있으신가요?
            </h3>
            <div className="flex justify-center">
              <a 
                href="mailto:smagentalab@gmail.com"
                className="px-10 py-4 bg-magenta hover:bg-magenta/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-magenta/20 transform hover:-translate-y-1"
              >
                메일 보내기
              </a>
            </div>
          </div>
        </div>
      </main>
    </article>
  );
}
