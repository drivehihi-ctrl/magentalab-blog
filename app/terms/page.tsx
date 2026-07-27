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
              본 이용약관은 "Magentalab 반려동물 연구소"(이하 "연구소")의 서비스 이용조건과 운영에 관한 제반 사항 규정을 목적으로 합니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 2 조 (용어의 정의)</h2>
            <div className="mb-6">
              본 약관에서 사용되는 주요한 용어의 정의는 다음과 같습니다.
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>회원 : 연구소의 약관에 동의하고 개인정보를 제공하여 회원등록을 한 자로서, 연구소와의 이용계약을 체결하고 연구소를 이용하는 이용자를 말합니다.</li>
                <li>이용계약 : 연구소 이용과 관련하여 연구소와 회원간에 체결하는 계약을 말합니다.</li>
                <li>회원 아이디(이하 "ID") : 회원의 식별과 회원의 서비스 이용을 위하여 회원별로 부여하는 고유한 문자와 숫자의 조합을 말합니다.</li>
                <li>비밀번호 : 회원이 부여받은 ID와 일치된 회원임을 확인하고 회원의 권익 보호를 위하여 회원이 선정한 문자와 숫자의 조합을 말합니다.</li>
                <li>운영자 : 서비스에 홈페이지를 개설하여 운영하는 담당자를 말합니다.</li>
                <li>해지 : 회원이 이용계약을 해약하는 것을 말합니다.</li>
              </ul>
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 3 조 (약관 외 준칙)</h2>
            <p className="mb-6">
              운영자는 필요한 경우 별도로 운영정책을 공지 안내할 수 있으며, 본 약관과 운영정책이 중첩될 경우 운영정책이 우선 적용됩니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 4 조 (이용계약 체결)</h2>
            <p className="mb-6">
              1. 이용계약은 회원으로 등록하여 연구소를 이용하려는 자의 본 약관 내용에 대한 동의와 가입신청에 대하여 운영자의 이용승낙으로 성립합니다.
              <br />2. 회원으로 등록하여 서비스를 이용하려는 자는 사이트 가입신청 시 본 약관을 읽고 "동의합니다"를 선택하는 것으로 본 약관에 대한 동의 의사 표시를 합니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 5 조 (서비스 이용 신청)</h2>
            <p className="mb-6">
              1. 회원으로 등록하여 연구소를 이용하려는 이용자는 연구소에서 요청하는 제반정보(이용자ID, 비밀번호, 닉네임 등)를 제공해야 합니다.
              <br />2. 타인의 정보를 도용하거나 허위의 정보를 등록하는 등 본인의 진정한 정보를 등록하지 않은 회원은 연구소 이용과 관련하여 아무런 권리를 주장할 수 없으며, 관계 법령에 따라 처벌받을 수 있습니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 6 조 (운영자의 의무)</h2>
            <p className="mb-6">
              1. 운영자는 이용회원으로부터 제기되는 의견이나 불만이 정당하다고 인정할 경우에는 가급적 빨리 처리하여야 합니다.
              <br />2. 운영자는 계속적이고 안정적인 서비스 제공을 위하여 설비에 장애가 생기거나 유실된 때에는 이를 지체 없이 수리 또는 복구할 수 있도록 노력합니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 7 조 (회원의 의무)</h2>
            <p className="mb-6">
              1. 회원은 본 약관에서 규정하는 사항과 운영자가 정한 제반 규정, 공지사항 및 운영정책을 준수하여야 하며, 기타 연구소의 업무에 방해가 되는 행위, 연구소의 명예를 손상하는 행위를 해서는 안 됩니다.
              <br />2. 회원은 연구소의 명시적 동의가 없는 한 서비스의 이용 권한 및 기타 이용계약상 지위를 타인에게 양도, 증여할 수 없습니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 8 조 (서비스 이용 시간)</h2>
            <p className="mb-6">
              서비스 이용 시간은 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴 1일 24시간을 원칙으로 합니다. 단, 시스템 정기점검 등 연구소가 정한 날이나 시간에는 서비스가 일시 중단될 수 있습니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 9 조 (게시물에 대한 저작권)</h2>
            <p className="mb-6">
              1. 회원이 서비스 내에 게시한 게시물의 저작권은 게시한 회원에게 귀속됩니다.
              <br />2. 이용자는 연구소의 서비스를 이용함으로써 얻은 정보를 연구소의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 10 조 (면책)</h2>
            <p className="mb-6">
              운영자는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우 및 회원의 귀책사유로 인한 서비스 이용 장애에 대하여는 책임을 지지 않습니다.
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
