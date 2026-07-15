import { Metadata } from "next";
import { getPosts } from "@/lib/wp";
import Link from "next/link";
import RelatedPosts from "@/components/RelatedPosts";

export const metadata: Metadata = {
  title: "アンシム紹介 | Magentalab",
  description: "Magentalabのマスコットであり主任研究員、アンシムを紹介します。",
};

export default async function JaAboutAnsimPage() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch posts for Japanese About Ansim:", error);
  }

  return (
    <article className="pb-24">
      {/* Page Header */}
      <header className="relative pt-16 pb-24 bg-white border-b border-gray-100 overflow-hidden text-center">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link 
            href="/ja" 
            className="inline-flex items-center gap-2 mb-10 text-sm font-bold text-magenta uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            ホームに戻る
          </Link>
          
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest">
            Meet Our Senior Researcher
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4">
            「ペット研究者のアンシムです」
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
              alt="Researcher Ansim" 
              className="rounded-3xl w-full mb-8 shadow-md"
            />
            <p>
              こんにちは！Magentalabペット研究所の主任研究員であり、ダックスフンドの『アンシム』です。
            </p>
            <p>
              飼い主の悩みは尽きることがなく、ペットの痛みには声がありません。「なぜ床にお尻を擦り付けるの？」「なぜ目が白く濁るの？」アンシムは、まさにこれらの疑問に科学的な正解を見つけるために、Magentalabのマスコットとして活動しています。
            </p>

            <h3>🐾 アンシムのプロフィール (Ansim's Research Profile)</h3>
            <ul>
              <li><strong>名前:</strong> アンシム (Ansim)</li>
              <li><strong>職責:</strong> Magentalab 主任研究員 (Chief Researcher)</li>
              <li><strong>犬種:</strong> ダックスフンド (Dachshund) <i>(脚が短いため、ルーペを持ってより低く、詳細に観察します。)</i></li>
              <li><strong>研究分野:</strong>
                <ul>
                  <li>ペットの行動心理分析および行動矯正の処方</li>
                  <li>小数点以下0.1%単位の精密な乾物基準(DM)および可溶無窒素物(NFE)の逆算</li>
                  <li>飼い主とペットの感情的なコミュニケーションの解読</li>
                </ul>
              </li>
              <li><strong>座右の銘:</strong> 「事実は妥協しない。0.1%の誤差も許さない獣医栄養学」</li>
            </ul>

            <hr />

            <h3>🌟 アンシムの使命</h3>
            <p>
              私たちは、飼い主が安心して信頼できる伴侶生活を目指します。
            </p>
            <ol>
              <li><strong>エビデンスベース (Evidence-Based):</strong> 根拠のない噂ではなく、信頼できる獣医学論文と検証された臨床データを基礎に作成します。</li>
              <li><strong>飼い主目線:</strong> 難しく馴染みのない専門医学用語を、飼い主の目線に合わせて解りやすく翻訳・提供します。</li>
              <li><strong>QoLの向上:</strong> 単なる病気治療を超え、ペットと飼い主の生活の質(QoL)を0.1%でも高めることを目標とします。</li>
            </ol>

            <hr />

            <h3>💬 主任研究員アンシムより一言</h3>
            <blockquote>
              <p>
                「時には、愛するがゆえに迷うこともあります。この方法で合っているのか、あの処方が安全なのか…アンシムが正確なデータで『安心』をお届けします。」
              </p>
              <p>
                「短い脚で、より低く、より注意深く観察し、常に飼い主の皆様の心強い同行者であり続けます。今日もMagentalabと共に安心してください！」
              </p>
            </blockquote>
          </div>
          
          <RelatedPosts posts={relatedPosts} lang="ja" />
          
          {/* CTA / Footer */}
          <div className="mt-20 pt-12 border-t border-gray-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              アンシム主任研究員にご質問はありますか？
            </h3>
            <div className="flex justify-center">
              <a 
                href="mailto:smagentalab@gmail.com"
                className="px-10 py-4 bg-magenta hover:bg-magenta/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-magenta/20 transform hover:-translate-y-1"
              >
                研究所にメールを送る
              </a>
            </div>
          </div>
        </div>
      </main>
    </article>
  );
}
