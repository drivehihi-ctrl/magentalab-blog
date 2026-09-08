import { Metadata } from "next";

export const metadata: Metadata = {
  title: "個人情報処理方針 | Magentalab",
  description: "Magentalab伴侶動物研究所の個人情報処理方針です。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/privacy",
    languages: {
      'ko-KR': 'https://www.magentalabblog.com/privacy',
      'en-US': 'https://www.magentalabblog.com/en/privacy',
      'ja-JP': 'https://www.magentalabblog.com/ja/privacy',
    },
  },
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
              <br />- メール問い合わせ対応：問い合わせ者の身元確認、事実調査のための連絡、処理結果の通知など
              <br />- サービスの利用統計および分析（Vercel Analyticsなどの活用）
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">2. 収集する個人情報項目および保有期間</h2>
            <p className="mb-6">
              研究所は、一般的な会員登録（名前、パスワード、住所、電話番号など）を通じた個人情報の収集を行いません。
              <br />- メール問い合わせ時に収集する項目：メールアドレス、問い合わせ内容（目的達成後、遅滞なく破棄）
              <br />- ソーシャルログイン（OAuth）利用時に収集する項目：ソーシャルアカウントの名前およびメールアドレス（利用終了または退会時に破棄）
              <br />- インターネットサービス利用の過程で自動的に生成され収集される項目：IPアドレス、クッキー、サービス利用記録、訪問記録（Vercel Analyticsなどを通じてウェブサイトの改善目的で活用）
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">3. 分析ツール（Vercel Analytics）の使用</h2>
            <p className="mb-6">
              本ウェブサイトは、訪問者のサービス利用行動を分析し、より良いユーザーエクスペリエンスを提供するためにVercel Analyticsを使用しています。この過程で、個人を特定できない形式のブラウザおよびデバイス情報、ページ訪問記録などが匿名化されて収集される場合があります。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">4. Google AdSenseおよびサードパーティクッキーポリシー</h2>
            <p className="mb-6">
              本ウェブサイトに広告が有効化され掲載される場合、Google LLCが提供するオンライン広告サービスであるGoogle AdSenseを利用することがあります。
              <br />- Googleおよびサードパーティ広告配信事業者は、ユーザーの過去のウェブサイト訪問記録に基づき、パーソナライズ広告を提供するためにクッキー（Cookie）を使用することがあります。
              <br />- ユーザーはGoogleの広告設定（<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-magenta underline">www.google.com/settings/ads</a>）にアクセスし、パーソナライズ広告の受信を拒否（Opt-out）できます。
              <br />- または <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-magenta underline">www.aboutads.info</a> にアクセスしてサードパーティ事業者のクッキー使用を無効にできます。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">5. 個人情報の破棄手続きおよび方法</h2>
            <p className="mb-6">
              研究所は、保有期間の経過、処理目的の達成など、個人情報が不要になったときは、遅滞なく当該個人情報を破棄します。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">6. 利用者および法定代理人の権利とその行使方法</h2>
            <p className="mb-6">
              情報主体は研究所に対し、いつでも個人情報の閲覧・訂正・削除・処理停止の要求などの権利を行使することができます。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">7. 個人情報の安全性確保措置</h2>
            <p className="mb-6">
              研究所は、個人情報の安全性確保のため、管理的な措置（内部管理計画の樹立）、技術的な措置（アクセス権限の管理、セキュリティプログラムの設置）、物理的な措置（アクセス統制）などを講じています。
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">8. 個人情報保護責任者</h2>

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
