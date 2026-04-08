import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Magentalab",
  description: "Magentalab 반려동물 연구소의 개인정보처리방침입니다.",
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
            개인정보<span className="text-magenta">처리방침</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm">
          <div className="prose prose-magenta max-w-none text-gray-600 leading-relaxed font-sans">
            <p className="mb-8">
              Magentalab 반려동물 연구소(이하 "연구소")는 고객님의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">1. 수집하는 개인정보 항목</h2>
            <p className="mb-6">
              연구소는 문의하기, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
              <br />- 수집항목: 이름, 이메일 주소, 접속 로그, 쿠키, 접속 IP 정보 등
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">2. 개인정보의 수집 및 이용목적</h2>
            <p className="mb-6">
              연구소는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
              <br />- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
              <br />- 회원 관리 및 고객 문의 대응
              <br />- 신규 서비스 개발 및 마케팅 광고에의 활용
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">3. 개인정보의 보유 및 이용기간</h2>
            <p className="mb-6">
              원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 연구소는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">4. 개인정보의 파기절차 및 방법</h2>
            <p className="mb-6">
              연구소는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.
              <br />- 파기절차: 고객님이 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">5. 이용자 및 법정대리인의 권리와 그 행사방법</h2>
            <p className="mb-6">
              이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다.
            </p>

            <p className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400">
              본 방침은 2026년 4월 8일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
