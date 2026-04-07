import { Metadata } from "next";
import { getPageBySlug, fixWpLinks } from "@/lib/wp";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "연구소 소개 | Magentalab",
  description: "Magentalab 반려동물 연구소의 미션과 연구 분야를 소개합니다.",
};

export default async function AboutPage() {
  const page = await getPageBySlug("institute-introduction");

  if (!page) {
    notFound();
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
            {page.title.rendered}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Magentalab 반려동물 연구소는 데이터와 과학을 통해 반려동물의 더 나은 삶을 연구합니다.
          </p>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-magenta/5 rounded-l-full blur-3xl opacity-30 transform translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-magenta/5 rounded-r-full blur-3xl opacity-20 transform -translate-x-1/2" />
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-4xl shadow-2xl shadow-magenta/5 border border-gray-100 p-8 md:p-16">
          <div 
            className="wp-content prose prose-lg md:prose-xl prose-magenta max-w-none text-gray-700 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: fixWpLinks(page.content.rendered) }}
          />
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
