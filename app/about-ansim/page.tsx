import { Metadata } from "next";
import { getPageBySlug, fixWpLinks } from "@/lib/wp";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "안심이 소개 | Magentalab",
  description: "마젠타랩의 마스코트이자 수석 연구원, 안심이를 소개합니다.",
};

export default async function AboutAnsimPage() {
  const page = await getPageBySlug("about-ansim");

  if (!page) {
    notFound();
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
            Meet Our Senior Researcher
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4">
            {page.title.rendered}
          </h1>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-magenta/5 blur-3xl opacity-30 transform translate-y-1/2" />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-4xl mt-12">
        <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-2xl shadow-gray-200/50 border border-gray-100">
          <div 
            className="wp-content prose prose-lg md:prose-xl prose-magenta max-w-none text-gray-700 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: fixWpLinks(page.content.rendered) }}
          />
          
          {/* CTA / Footer */}
          <div className="mt-20 pt-12 border-t border-gray-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              안심이 연구원에게 궁금한 점이 있으신가요?
            </h3>
            <div className="flex justify-center">
              <a 
                href="mailto:smagentalab@gmail.com"
                className="px-10 py-4 bg-magenta hover:bg-magenta/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-magenta/20 transform hover:-translate-y-1"
              >
                연구실로 메일 보내기
              </a>
            </div>
          </div>
        </div>
      </main>
    </article>
  );
}
