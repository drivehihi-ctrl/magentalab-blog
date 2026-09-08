import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | Magentalab",
  description: "Magentalab 반려동물 연구소의 이용약관입니다.",
  alternates: {
    canonical: "https://www.magentalabblog.com/terms",
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
            이용<span className="text-magenta">약관</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm">
          <div className="prose prose-magenta max-w-none text-gray-600 leading-relaxed font-sans">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">제 1 조 (목적)</h2>
            <p className="mb-6">
              본 이용약관은 "Magentalab 반려동물 연구소"(이하 "연구소")가 제공하는 모든 정보 및 제반 웹 서비스의 이용 조건과 운영에 관한 사항, 그리고 사용자와 연구소 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 2 조 (서비스의 성격 및 의료 정보 면책)</h2>
            <div className="mb-6">
              본 웹사이트는 반려동물의 건강, 영양, 생활 등에 대한 일반적인 정보와 참고용 계산기 도구를 제공하는 <b>정보성 블로그</b>입니다.
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>본 웹사이트에서 제공하는 모든 콘텐츠, 수치, 계산 결과는 수의학적 진단, 치료, 처방을 대신할 수 없습니다.</li>
                <li>반려동물의 건강에 이상 징후가 있거나 질병이 의심되는 경우, 반드시 전문 수의사의 진료와 상담을 받아야 합니다.</li>
                <li>사용자가 본 웹사이트의 정보를 바탕으로 취한 조치에 대해 연구소는 어떠한 법적 책임도 지지 않습니다.</li>
              </ul>
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 3 조 (비회원제 운영)</h2>
            <p className="mb-6">
              연구소는 별도의 일반 회원가입(이름, 주소, 비밀번호 등 입력) 및 유료 결제 기능을 제공하지 않으며, 누구나 무료로 공개된 콘텐츠를 열람하고 참고용 도구를 이용할 수 있습니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 4 조 (게시물에 대한 저작권 및 이용 제한)</h2>
            <p className="mb-6">
              1. 연구소가 작성한 모든 콘텐츠, 디자인, 계산기 로직 등에 대한 저작권 및 지적재산권은 연구소에 귀속됩니다.
              <br />2. 사용자는 연구소의 서비스를 이용함으로써 얻은 정보를 연구소의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리 목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 5 조 (서비스의 중단 및 변경)</h2>
            <p className="mb-6">
              운영자는 시스템 정기점검, 장비 교체, 통신 두절 등 업무상 또는 기술상 부득이한 사유가 발생한 경우 서비스의 제공을 일시적으로 중단하거나 변경할 수 있습니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 6 조 (면책 조항)</h2>
            <p className="mb-6">
              1. 운영자는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
              <br />2. 운영자는 사용자의 귀책사유로 인한 서비스 이용 장애에 대하여는 책임을 지지 않습니다.
              <br />3. 운영자는 사용자가 웹사이트의 정보, 자료, 사실의 신뢰도 및 정확성을 맹신하여 발생한 손해에 대하여 책임지지 않습니다.
            </p>

            <p className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400">
              본 약관은 2026년 4월 22일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
