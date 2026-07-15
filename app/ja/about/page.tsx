import { Metadata } from "next";
import { getPosts } from "@/lib/wp";
import RelatedPosts from "@/components/RelatedPosts";

export const metadata: Metadata = {
  title: "研究所紹介 | Magentalab",
  description: "Magentalabペット研究所のミッションと研究分野を紹介します。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/about",
  },
};

export default async function JaAboutPage() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch posts for Japanese About:", error);
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
            私たちは伴侶動物に寄り添います、マゼンタラボ (Magentalab)
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Magentalabペット研究所は、データと科学を通じて伴侶動物のより良い生活を研究します。
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
            <img 
              src="https://magentalab.mycafe24.com/wp-content/uploads/2026/04/Magentalab_logo_We_202604050029.jpeg" 
              alt="Magentalab Lab" 
              className="rounded-3xl w-full mb-8 shadow-md"
            />
            <p>
              Magentalabは、単に情報を伝えるだけの場所ではありません。大切な家族であるペットの幸せと健康のための最高のガイドを目指します。
            </p>
            <p>
              グローバルAI技術を活用してペットの健康情報を深く分析し、獣医学的責任のもとで検証された正しい知識を共有します。
            </p>

            <h2>🔬 3大研究分野</h2>
            
            <p>
              <strong>🧬 品種別精密分析 (Breed Archive)</strong><br />
              品種固有の遺伝的特徴、行動習慣、活動パターンを解剖学的に分析し、オーダーメイドの情報を提供します。
            </p>

            <p>
              <strong>🏥 ペット健康ウィキ (Health Wiki)</strong><br />
              日常で直面する緊急事態、栄養の不均衡、慢性疾患に対し、飼い主が即座に対処できる獣医学ガイドをお届けします。
            </p>

            <p>
              <strong>🌱 ライフサイエンス (Life Science)</strong><br />
              健康で幸せな伴侶生活のための最新獣医トレンドや生活習慣を研究し、提案します。
            </p>

            <h2>🔍 行動メカニズム (E-E-A-T)</h2>
            <ul>
              <li><strong>Experience (経験):</strong> マスコットの「ダックスフンド・アンシム」を通じて、飼い主の実生活に必要なケア技法を伝播します。</li>
              <li><strong>Expertise (専門性):</strong> フードの乾物基準(DM)換算や可溶無窒素物(NFE)の逆算など、獣医栄養学的なデータを定量化して提供します。</li>
              <li><strong>Authoritativeness (権威):</strong> Google YMYLガイドラインを厳格に遵守し、ペットの疾病や解剖学情報を正確に記述します。</li>
              <li><strong>Trust (信頼):</strong> ペットの健康と幸福を最優先とし、徹底したファクトチェックを経て出版します。</li>
            </ul>
          </div>

          <RelatedPosts posts={relatedPosts} lang="ja" />
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="container mx-auto px-4 max-w-4xl mt-24">
        <div className="p-12 rounded-4xl bg-gray-900 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">研究所の歩みを共に見守ってください。</h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto">
              パートナーシップの提案やお問い合わせはいつでも歓迎します。
            </p>
            <div className="flex justify-center">
              <a 
                href="mailto:smagentalab@gmail.com"
                className="px-10 py-4 bg-magenta hover:bg-magenta/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-magenta/20"
              >
                お問い合わせ
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-magenta/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
