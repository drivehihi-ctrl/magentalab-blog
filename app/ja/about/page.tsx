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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.2] mb-8 tracking-tight">
            データと愛でペットの明日を研究する、Magentalab（マゼンタラボ）
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium italic">
            「なぜ私たちはペットの言葉を学ぶべきなのでしょうか？」
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
              Magentalabペット研究所は、単に無秩序な情報を羅列する場所ではありません。溢れるペット情報の波の中で、飼い主さんが最も必要とする「検証された医学的知識」と「実用的なライフスタイル」を提案するために設立されました。
            </p>
            <p>
              私たちはグローバルAI技術を活用して世界中の膨大な獣医学データを高速で収集し、首席研究員による精密な監修（Editorial Responsibility）を経て、最も正確で温かいコンテンツを配信しています。
            </p>

            <h2>🔬 Magentalabの3大中核研究分野</h2>
            
            <p>
              <strong>① 犬種・猫種別精密分析 (Breed Archive)</strong><br />
              ペットの単なる外見的な個性にとどまらず、遺伝的特性、行動学的な性格、運動量に応じた解剖学的なリスクを分析し、品種ごとに最適なケアソリューションを提案します。
            </p>

            <p>
              <strong>② 疾病予防および健康百科 (Health Wiki)</strong><br />
              飼い主さんが日常で最も慌ててしまう排尿異常、急性中毒、関節疾患などの瞬間に、即座に医学的な手がかりを提供できるよう、疾患のメカニズムと応急予防のガイドラインを精密に整理します。
            </p>

            <p>
              <strong>③ ペットライフサイエンス (Life Science)</strong><br />
              同伴可能なペットフレンドリーなインフラ情報から最新の栄養学トレンドまで、ペットと共にする生活の質を科学的に高める方法を研究します。
            </p>

            <h2>💖 Magentalabの行動ガバナンス (E-E-A-T)</h2>
            <ul>
              <li><strong>Experience (経験):</strong> Magentalabのマスコットであり首席研究員である「ダックスフントのアンシミ」の視点から、実際の飼い主さんが日常の中で直面する現実的な看病の悩みや行動学的な背景を深く捉えます。</li>
              <li><strong>Expertise (専門性):</strong> 高度なデータ分析ツールと獣医学的な乾物量（DM）換算式に基づき、可溶無窒素物（NFE）および1日の必須水分摂取量を精密に逆算し、情報の数値的な信頼性を構築します。</li>
              <li><strong>Authoritativeness (権威性):</strong> GoogleのYMYL基準を徹底的に遵守し、ペットの健康スコアおよび泌尿器・内分泌疾患管理のための標準的な技術ガイドを目指します。</li>
              <li><strong>Trust (信頼):</strong> 私たちはペットの命と健康を最優先の価値と考え、ファクトチェック（事実確認）を通過した無欠の知識だけをお届けすることをお約束します。</li>
            </ul>

            <h2>🧪 Magentalabコンテンツの3段階検収プロトコル</h2>
            <p>
              Google検索エンジンおよびAI回答オーバービューの信頼性基準を満たすため、Magentalabのすべての知識レポートは、以下の3段階のスクリーニングを常に経た後に最終発行されます。
            </p>
            <ul>
              <li><strong>[API収集]</strong> 世界中の医学学術指標およびAAFCO給与ガイドラインのリアルタイムトラフィック分析</li>
              <li><strong>[ファクトチェック]</strong> AI草案のテキストスロップ（Slop）の除去、および獣医学的臨床数値の完全性の校正</li>
              <li><strong>[人間の介入 (Human Intervention)]</strong> 実際の飼い主さんの経験による洞察と、直感的な構造化データ（Schema）の最適化</li>
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
