import { Metadata } from "next";
import { getPosts } from "@/lib/wp";
import Link from "next/link";
import RelatedPosts from "@/components/RelatedPosts";

export const metadata: Metadata = {
  title: "アンシム紹介 | Magentalab",
  description: "マゼンタラボのブランドキャラクターであり、飼い主さんのためのガイドであるアンシムをご紹介します。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/about-ansim",
    languages: {
      'ko-KR': 'https://www.magentalabblog.com/about-ansim',
      'en-US': 'https://www.magentalabblog.com/en/about-ansim',
      'ja-JP': 'https://www.magentalabblog.com/ja/about-ansim',
    },
  },
  openGraph: {
    title: "アンシム紹介 | Magentalab",
    description: "マゼンタラボのブランドキャラクターであり、飼い主さんのためのガイドであるアンシムをご紹介します。",
    url: "https://www.magentalabblog.com/ja/about-ansim",
    type: "website",
    siteName: "Magentalab",
    images: [{ url: "/images/favicon.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "アンシム紹介 | Magentalab",
    description: "マゼンタラボのブランドキャラクターであり、飼い主さんのためのガイドであるアンシムをご紹介します。",
    images: ["/images/favicon.png"]
  }
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
            About Ansim
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4">
            アンシムはどんな研究員ですか？
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
            
            <p>ペットの様子がいつもと違う時、ネットで難しい獣医学の専門記事を読んで「結局うちの子にはどういう意味なの？」と戸惑ったことはありませんか？アンシムはまさにそんな時、飼い主さんに寄り添い、難しい情報をわかりやすく解説するために誕生しました。</p>
            
            <h2>アンシムの役割</h2>
            <p>アンシムは、ペットの健康や生活情報を飼い主さんの目線でわかりやすく説明するためにマゼンタラボが生み出した、<strong>ダックスフント研究員コンセプトのブランドキャラクター</strong>です。実際の獣医師や医療従事者ではなく、自ら病気を診断したり治療を処方したりすることはありません。</p>
            <p>その代わり、アンシムは次のような役割を果たします：</p>
            <ul>
              <li>難しい獣医学の資料を、飼い主さんが理解しやすい日常の言葉に翻訳します。</li>
              <li>異なる研究やガイドラインを比較し、文脈をわかりやすく整理します。</li>
              <li>日常の軽い症状と、必ず動物病院での緊急診療が必要な状況を明確に区別して案内します。</li>
            </ul>

            <h2>どんな資料を参考にしていますか？</h2>
            <p>マゼンタラボではペットの健康や生活情報をご説明する際、公信力のある獣医学ガイドライン、政府機関の資料、および査読（ピアレビュー）を受けた研究を優先して確認しています。AAHA、WSAVA、Merck Veterinary Manual、FDAなどの信頼できるリソースを基にコンテンツを制作しています。</p>

            <h2>計算機やリスク確認ツールはどう活用すべきですか？</h2>
            <p>マゼンタラボが提供する各種の計算機やリスク確認ツールは、飼い主さんがペットの状態を理解し記録するための<strong>参考用ツール</strong>です。これらは実際の獣医師による身体検査や診断に代わるものではなく、一つの結果だけで特定の病気を判断してはいけません。</p>

            <h2>アンシムの約束</h2>
            <p>分からないことは正直に分からないとお伝えし、新しい根拠が確認された場合は内容を再検討し、必要な部分を修正します。何よりも、オンラインでの検索より命が最優先であるため、緊急時には遅滞なく動物病院での診療を受けるようご案内することを最優先の原則とします。</p>
          </div>
          
          <RelatedPosts posts={relatedPosts} lang="ja" />
          
          {/* CTA / Footer */}
          <div className="mt-20 pt-12 border-t border-gray-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              アンシムに何か質問がありますか？
            </h3>
            <div className="flex justify-center">
              <a 
                href="mailto:smagentalab@gmail.com"
                className="px-10 py-4 bg-magenta hover:bg-magenta/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-magenta/20 transform hover:-translate-y-1"
              >
                メールを送る
              </a>
            </div>
          </div>
        </div>
      </main>
    </article>
  );
}
