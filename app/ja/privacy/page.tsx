import { Metadata } from "next";

export const metadata: Metadata = {
  title: "個人情報処理方針 | Magentalab",
  description: "Magentalab伴侶動物研究所の個人情報処理方針です。",
};

export default function PrivacyPage() {
  return (
    <div className="pb-24">
      {/* Page Header */}
      <header className="relative pt-24 pb-20 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest">
            LEGAL
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            個人情報<span className="text-magenta">処理方針</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm">
          <div className="prose prose-magenta max-w-none text-gray-600 leading-relaxed font-sans">
            <p className="mb-8">
              Magentalab伴侶動物研究所（以下「研究所」）は、個人情報保護法第30条に基づき、情報主体の個人情報を保護し、これに関する苦情を迅速かつ円滑に処理できるようにするため、以下のように個人情報処理指針を樹立・公開します。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">1. 個人情報の処理目的</h2>
            <p className="mb-6">
              研究所は、以下の目的のために個人情報を処理し、目的以外の用途には利用しません。
              <br />- ホームページ会員登録および管理：登録意思の確認、本人識別、会員資格の維持、各種通知・告知など
              <br />- サービスの提供：コンテンツの提供、カスタマイズされたサービスの提供、本人確認など
              <br />- 苦情処理：苦情申し立て人の身元確認、事実調査のための連絡、処理結果の通知など
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">2. 個人情報の処理および保有期間</h2>
            <p className="mb-6">
              研究所は、法令に基づく個人情報の保有・利用期間、または情報主体から個人情報を収集する際に同意を得た個人情報の保有・利用期間内で個人情報を処理・保有します。
              <br />- ホームページ会員登録および管理：ホームページ退会時まで
              <br />- 財貨またはサービスの提供：サービスの提供完了および料金決済・精算完了時まで
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">3. 収集する個人情報項目</h2>
            <p className="mb-6">
              研究所は、以下の個人情報項目を処理しています。
              <br />- 必須項目：氏名、ユーザーID、パスワード、住所、電話番号、メールアドレス
              <br />- インターネットサービス利用の過程で自動的に生成され収集される項目：IPアドレス、クッキー、サービス利用記録、訪問記録など
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">4. 個人情報の破棄手続きおよび方法</h2>
            <p className="mb-6">
              研究所は、個人情報の保有期間の経過、処理目的の達成など、個人情報が不要になったときは、遅滞なく当該個人情報を破棄します。
              <br />- 破棄方法：電子的なファイル形態は記録を再生できない技術的な方法を使用し、紙の文書は粉砕するか焼却します。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">5. 利用者および法定代理人の権利とその行使方法</h2>
            <p className="mb-6">
              情報主体は研究所に対し、いつでも個人情報の閲覧・訂正・削除・処理停止の要求などの権利を行使することができます。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">6. 個人情報の安全性確保措置</h2>
            <p className="mb-6">
              研究所は、個人情報の安全性確保のため、管理的な措置（内部管理計画の樹立）、技術的な措置（アクセス権限の管理、セキュリティプログラムの設置）、物理的な措置（アクセス統制）などを講じています。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">7. 個人情報保護責任者</h2>
            <p className="mb-6">
              個人情報処理に関する業務を総括して責任を持ち、関連する苦情処理および被害救済などのため、以下のように個人情報保護責任者を指定しています。
              <br />- メール問い合わせ：smagentalab@gmail.com
            </p>

            <p className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400">
              本方針は2026年4月22日から施行されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
