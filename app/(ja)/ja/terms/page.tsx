import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | Magentalab",
  description: "Magentalab伴侶動物研究所の利用規約です。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/terms",
    languages: {
      'ko-KR': 'https://www.magentalabblog.com/terms',
      'en-US': 'https://www.magentalabblog.com/en/terms',
      'ja-JP': 'https://www.magentalabblog.com/ja/terms',
    },
  },
};

export default function TermsPage() {
  return (
    <div className="pb-24">
      {/* Page Header */}
      <header className="relative pt-24 pb-20 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest">
            LEGAL
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            利用<span className="text-magenta">規約</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm">
          <div className="prose prose-magenta max-w-none text-gray-600 leading-relaxed font-sans">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">第 1 条 (目的)</h2>
            <p className="mb-6">
              本利用規約は、「Magentalab伴侶動物研究所」（以下「研究所」）が提供するすべての情報および諸ウェブサービスの利用条件と運営に関する事項、ならびに利用者と研究所間の権利、義務、および責任事項を規定することを目的とします。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 2 条 (サービスの性格および医療情報の免責)</h2>
            <div className="mb-6">
              本ウェブサイトは、伴侶動物の健康、栄養、生活などに関する一般的な情報や参考用の計算ツールを提供する<b>情報提供ブログ</b>です。
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>本ウェブサイトの情報は、一般的な教育および参考目的で提供されており、個々の伴侶動物の状態に対する獣医学的な診断や治療の判断に代わるものではありません。利用者は、重要な健康上の判断が必要な場合、担当の獣医師の診察を優先してください。</li>
              </ul>
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 3 条 (非会員制の運営)</h2>
            <p className="mb-6">
              研究所は、別途の一般的な会員登録（名前、住所、パスワードなどの入力）および有料決済機能を提供しておらず、誰でも無料で公開されたコンテンツを閲覧し、参考用ツールを利用することができます。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 4 条 (投稿物の著作権および利用制限)</h2>
            <p className="mb-6">
              1. 研究所が作成したすべてのコンテンツ、デザイン、計算機ロジックなどに関する著作権および知的財産権は研究所に帰属します。
              <br />2. 利用者は、研究所のサービスを利用することによって得た情報を、研究所の事前承諾なしに複製、送信、出版、配布、放送、その他の方法で営利目的に利用したり、第三者に利用させてはなりません。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 5 条 (サービスの中断および変更)</h2>
            <p className="mb-6">
              運営者は、システムの定期点検、機器の交換、通信の途絶など、業務上または技術上やむを得ない事由が発生した場合、サービスの提供を一時的に中断または変更することができます。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 6 条 (免責条項)</h2>
            <p className="mb-6">
              1. 運営者は、天災地変またはこれに準ずる不可抗力によりサービスを提供できない場合には、サービス提供に関する責任が免除されます。
              <br />2. 運営者は、利用者の帰責事由によるサービス利用の障害については責任を負いません。
              <br />3. ウェブサイトの情報や計算結果は、作成または更新時点の資料に基づいて提供されており、個々の伴侶動物の状態や外部データの変更などにより、実際の状況と異なる場合があります。重要な医療的判断は、オンライン情報だけで決定せず、必ず担当獣医師の診察を通じて確認してください。
            </p>

            <p className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400">
              本規約は2026年4月22日から施行されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
