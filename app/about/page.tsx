import { Metadata } from "next";
import { getPosts } from "@/lib/wp";
import { notFound } from "next/navigation";
import RelatedPosts from "@/components/RelatedPosts";
import AboutEEATFeatures from "@/components/AboutEEATFeatures";

export const metadata: Metadata = {
  title: "마젠타랩 소개 | Magentalab",
  description: "보호자의 질문에서 시작한 마젠타랩의 미션과 콘텐츠 작성 원칙을 소개합니다.",
  alternates: {
    canonical: "https://www.magentalabblog.com/about",
    languages: {
      'ko-KR': 'https://www.magentalabblog.com/about',
      'en-US': 'https://www.magentalabblog.com/en/about',
      'ja-JP': 'https://www.magentalabblog.com/ja/about',
    },
  },
  openGraph: {
    title: "마젠타랩 소개 | Magentalab",
    description: "보호자의 질문에서 시작한 마젠타랩의 미션과 콘텐츠 작성 원칙을 소개합니다.",
    url: "https://www.magentalabblog.com/about",
    type: "website",
    siteName: "Magentalab",
    images: [{ url: "/images/favicon.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "마젠타랩 소개 | Magentalab",
    description: "보호자의 질문에서 시작한 마젠타랩의 미션과 콘텐츠 작성 원칙을 소개합니다.",
    images: ["/images/favicon.png"]
  }
};

export default async function AboutPage() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6);
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch posts for About:", error);
  }

  return (
    <div className="pb-24">
      {/* Page Header */}
      <header className="relative pt-24 pb-32 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest mb-6">
            ABOUT US
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8 tracking-tight">
            마젠타랩은 반려동물 보호자의 질문에서 시작합니다
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            반려동물과 함께 살다 보면, 검색 한 번으로 명쾌한 답이 나오지 않아 밤을 새워본 경험이 있으실 겁니다. 마젠타랩은 바로 그 간절한 질문들에서 출발했습니다.
          </p>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-magenta/5 rounded-l-full blur-3xl opacity-30 transform translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-magenta/5 rounded-r-full blur-3xl opacity-20 transform -translate-x-1/2" />
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-4xl shadow-2xl shadow-magenta/5 border border-gray-100 p-8 md:p-16">
          <div className="wp-content prose prose-lg md:prose-xl prose-magenta max-w-none text-gray-700 leading-relaxed font-normal mb-12">
            
            <h2>왜 마젠타랩을 만들었나요?</h2>
            <p>인터넷에는 수많은 정보가 있지만, 우리 아이에게 당장 적용해도 안전한지 판단하기란 쉽지 않습니다. 마젠타랩은 단순히 정보를 많이 모아두는 곳이 아닙니다. 보호자가 어려운 건강, 영양, 행동 정보를 이해하고, 생활에서 관찰할 부분과 진료가 필요한 신호를 구분하는 데 도움을 주는 것이 우리의 목표입니다.</p>
            
            <h2>자료는 어떻게 확인하나요?</h2>
            <p>질환, 영양, 행동에 대한 콘텐츠를 작성할 때 우리는 언제나 공신력 있는 수의학 가이드라인과 정부기관 자료, 그리고 검증된 학술 연구(peer-reviewed research)를 우선적으로 확인합니다. 과거의 게시물을 사실의 유일한 출발점으로 삼지 않으며, 언제나 현재의 근거를 다시 확인하는 원칙을 고수합니다.</p>

            <h2>글은 어떻게 만들어지나요?</h2>
            <p>우리의 콘텐츠는 보호자들의 실제 고민과 질문에서 시작됩니다. 관련된 전문 자료를 폭넓게 조사하고 서로 다른 근거들을 비교한 뒤, 보호자가 이해하기 쉬운 언어로 풀어냅니다. 이 과정에서 매우 위험할 수 있는 자가 치료 방법이나 과도하게 단정적인 표현이 없는지 꼼꼼히 검토합니다.</p>

            <h2>의료정보에는 한계가 있습니다</h2>
            <p>마젠타랩의 모든 콘텐츠와 계산기 도구는 교육 및 참고 목적일 뿐입니다. 개별 동물의 정확한 진단과 치료는 반드시 담당 수의사의 대면 진료를 통해 이루어져야 합니다. 응급 신호가 관찰된다면 온라인 정보나 계산 결과보다 동물병원 진료가 우선입니다.</p>

            <h2>틀린 내용은 어떻게 고치나요?</h2>
            <p>수의학은 계속 발전합니다. 새로운 가이드라인이 발표되거나 더 나은 근거가 확인되었을 때, 혹은 독자분들의 소중한 제보로 오류가 발견되었을 때, 마젠타랩은 내용을 신속하게 다시 확인하고 투명하게 수정합니다.</p>
            
            <h2>누가 운영하나요?</h2>
            <p>마젠타랩은 반려동물의 건강한 일상을 돕기 위해 운영되는 정보 플랫폼입니다. 서비스 이용 및 제안에 관한 문의는 사이트 하단의 공식 연락처를 통해 언제든 전달해 주실 수 있습니다.</p>
          </div>

          <AboutEEATFeatures lang="ko" />
          <RelatedPosts posts={relatedPosts} />
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="container mx-auto px-4 max-w-4xl mt-24">
        <div className="p-12 rounded-4xl bg-gray-900 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">연구소의 발걸음을 함께 지켜봐 주세요.</h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto">
              파트너십 제안은 언제든 환영합니다.
            </p>
            <div className="flex justify-center">
              <a 
                href="mailto:smagentalab@gmail.com"
                className="px-10 py-4 bg-magenta hover:bg-magenta/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-magenta/20"
              >
                문의하기
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-magenta/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
