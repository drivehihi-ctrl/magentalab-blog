import { Metadata } from "next";
import { getPosts } from "@/lib/wp";
import { notFound } from "next/navigation";
import RelatedPosts from "@/components/RelatedPosts";
import AboutEEATFeatures from "@/components/AboutEEATFeatures";

export const metadata: Metadata = {
  title: "マゼンタラボ紹介 | Magentalab",
  description: "飼い主さんの疑問から出発したマゼンタラボのミッションと、コンテンツ作成の原則についてご紹介します。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/about",
    languages: {
      'ko-KR': 'https://www.magentalabblog.com/about',
      'en-US': 'https://www.magentalabblog.com/en/about',
      'ja-JP': 'https://www.magentalabblog.com/ja/about',
    },
  },
  openGraph: {
    title: "マゼンタラボ紹介 | Magentalab",
    description: "飼い主さんの疑問から出発したマゼンタラボのミッションと、コンテンツ作成の原則についてご紹介します。",
    url: "https://www.magentalabblog.com/ja/about",
    type: "website",
    siteName: "Magentalab",
    images: [{ url: "/images/favicon.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "マゼンタラボ紹介 | Magentalab",
    description: "飼い主さんの疑問から出発したマゼンタラボのミッションと、コンテンツ作成の原則についてご紹介します。",
    images: ["/images/favicon.png"]
  }
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
            マゼンタラボは飼い主さんの疑問から始まります
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            ペットと一緒に暮らしていると、一度の検索では明確な答えが出ず、夜を明かして調べた経験があるはずです。マゼンタラボは、そんな切実な疑問から出発しました。
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
            
            <h2>なぜマゼンタラボを作ったのですか？</h2>
            <p>インターネット上には多くの情報がありますが、うちの子にすぐ適用して安全かどうかを判断するのは簡単ではありません。マゼンタラボは単に多くの情報を集めておく場所ではありません。飼い主さんが難しい健康、栄養、行動に関する情報を理解し、家庭で観察すべきこととすぐに診察が必要なサインを区別できるようサポートすることが私たちの目標です。</p>
            
            <h2>資料はどのように確認していますか？</h2>
            <p>疾患、栄養、行動に関するコンテンツを作成する際、私たちは常に公信力のある獣医学ガイドライン、政府機関の資料、そして査読（ピアレビュー）を受けた学術研究を優先的に確認しています。過去の投稿を事実の唯一の出発点とはせず、常に最新の根拠を再確認する原則を固守しています。</p>

            <h2>記事はどのように作られますか？</h2>
            <p>私たちのコンテンツは、飼い主さんたちの実際の悩みや疑問から始まります。関連する専門資料を幅広く調査し、異なる根拠を比較した上で、飼い主さんが理解しやすい言葉で解説します。この過程で、非常に危険な自己治療法や過度に断定的な表現がないか慎重に検討します。</p>

            <h2>医療情報には限界があります</h2>
            <p>マゼンタラボのすべてのコンテンツや計算機ツールは、教育および参考目的でのみ提供されています。個々の動物の正確な診断と治療は、必ず担当獣医師による対面診療を通じて行われなければなりません。ペットに緊急のサインが見られる場合は、オンライン情報や計算結果よりも動物病院での診察が最優先です。</p>

            <h2>間違った内容はどのように修正しますか？</h2>
            <p>獣医学は常に進歩しています。新しいガイドラインが発表されたり、より良い根拠が確認されたり、読者の皆様からの貴重なご指摘で誤りが発見された場合、マゼンタラボは迅速に内容を再確認し、透明性をもって修正します。</p>
            
            <h2>運営者は誰ですか？</h2>
            <p>マゼンタラボは、ペットの健康な日常をサポートするために運営されている情報プラットフォームです。サービスのご利用やご提案に関するお問い合わせは、サイト下部の公式連絡先からいつでもお寄せいただけます。</p>
          </div>

          <AboutEEATFeatures lang="ja" />
          <RelatedPosts posts={relatedPosts} lang="ja" />
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="container mx-auto px-4 max-w-4xl mt-24">
        <div className="p-12 rounded-4xl bg-gray-900 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">私たちの歩みをぜひ見守ってください。</h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto">
              パートナーシップのご提案はいつでも歓迎いたします。
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
