import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | Magentalab",
  description: "Magentalab伴侶動物研究所の利用規約です。",
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
              本利用規約は、「Magentalab伴侶動物研究所」（以下「研究所」）のサービス利用条件と運営に関する諸事項を規定することを目的とします。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 2 条 (用語의 정의)</h2>
            <div className="mb-6">
              本規約で使用する主な用語の定義は次の通りです。
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>会員：研究所の規約に同意し、個人情報を提供して会員登録を行った者で、研究所との利用契約を締結し、研究所を利用する利用者を指します。</li>
                <li>利用契約：研究所の利用に関して、研究所と会員との間で締結する契約を指します。</li>
                <li>会員ID（以下「ID」）：会員の識別および会員のサービス利用のために、会員ごとに付与される固有の文字と数字の組み合わせを指します。</li>
                <li>パスワード：会員がIDと一致する会員であることを確認し、会員の権利保護のために会員自身が設定した文字と数字の組み合わせを指します。</li>
                <li>運営者：サービス上にホームページを開設し運営する担当者を指します。</li>
                <li>解約：会員が利用契約を解除することを指します。</li>
              </ul>
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 3 条 (規約外の準則)</h2>
            <p className="mb-6">
              運営者は必要な場合、別途運営方針を公示・案内することができ、本規約と運営方針が重複する場合は、運営方針が優先的に適用されます。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 4 条 (利用契約の締結)</h2>
            <p className="mb-6">
              1. 利用契約は、会員として登録し研究所を利用しようとする者の本規約内容への同意と加入申請に対し、運営者が利用を承諾することによって成立します。
              <br />2. 会員として登録してサービスを利用しようとする者は、サイトへの加入申請時に本規約を読み、「同意します」を選択することで、本規約に対する同意の意思表示を行います。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 5 条 (サービス利用申請)</h2>
            <p className="mb-6">
              1. 会員として登録し研究所を利用しようとする利用者は、研究所が要求する諸情報（利用者ID、パスワード、ニックネームなど）を提供しなければなりません。
              <br />2. 他人の情報を盗用したり虚偽の情報を登録するなど、本人の真実の情報を登録していない会員は、研究所の利用に関するいかなる権利も主張できず、関係法令に基づき処罰されることがあります。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 6 条 (運営者の義務)</h2>
            <p className="mb-6">
              1. 運営者は、利用会員から提起される意見や苦情が正当であると認める場合には、速やかに処理するよう努めます。
              <br />2. 運営者は、継続的かつ安定的なサービス提供のために、設備に障害が生じたり紛失したときは、遅滞なくこれを修理または復旧するよう努力します。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 7 条 (会員の義務)</h2>
            <p className="mb-6">
              1. 会員は、本規約で規定する事項と運営者が定めた諸規定、告知事項および運営方針を遵守しなければならず、その他研究所의 業務を妨げる行為や、研究所の名誉を毀損する行為をしてはなりません。
              <br />2. 会員は、研究所の明示的な同意がない限り、サービスの利用権限およびその他の利用契約上の地位を他人に譲渡・贈与することはできません。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 8 条 (サービス利用時間)</h2>
            <p className="mb-6">
              サービス利用時間は、業務上または技術上の特別な支障がない限り、年中無休1日24時間を原則とします。ただし、システムの定期点検など研究所が定めた日や時間には、サービスが一時的に中断されることがあります。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 9 条 (投稿物の著作権)</h2>
            <p className="mb-6">
              1. 会員がサービス内に投稿した投稿物の著作権は、投稿した会員に帰属します。
              <br />2. 利用者は、研究所のサービスを利用することによって得た情報を、研究所の事前承諾なしに複製、送信、出版、配布、放送、その他の方法で営利目的に利用したり、第三者に利用させてはなりません。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">第 10 条 (免責)</h2>
            <p className="mb-6">
              運営者は、天災地変またはこれに準ずる不可抗力によりサービスを提供できない場合、および会員の帰責事由によるサービス利用障害については、責任を負いません。
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
