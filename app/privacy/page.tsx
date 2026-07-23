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
              Magentalab 반려동물 연구소(이하 "연구소")는 개인정보 보호법 제30조에 따라 정보 주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립, 공개합니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">1. 개인정보의 처리목적</h2>
            <p className="mb-6">
              연구소는 다음의 목적을 위하여 개인정보를 처리하며, 목적 이외의 용도로는 이용되지 않습니다.
              <br />- 홈페이지 회원 가입 및 관리 : 가입 의사 확인, 본인 식별, 회원자격 유지, 각종 고지 및 통지 등
              <br />- 서비스 제공 : 콘텐츠 제공, 맞춤 서비스 제공, 본인인증 등
              <br />- 고충 처리 : 민원인의 신원 확인, 사실 조사를 위한 연락, 처리 결과 통보 등
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">2. 개인정보의 처리 및 보유기간</h2>
            <p className="mb-6">
              연구소는 법령에 따른 개인정보 보유·이용 기간 또는 정보 주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.
              <br />- 홈페이지 회원 가입 및 관리 : 홈페이지 탈퇴 시까지
              <br />- 재화 또는 서비스 제공 : 서비스 공급 완료 및 요금 결제·정산 완료 시까지
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">3. 수집하는 개인정보 항목</h2>
            <p className="mb-6">
              연구소는 다음의 개인정보 항목을 처리하고 있습니다.
              <br />- 필수항목 : 성명, 아이디, 비밀번호, 주소, 전화번호, 이메일 주소
              <br />- 인터넷 서비스 이용 과정에서 자동으로 생성되어 수집될 수 있는 항목 : IP주소, 쿠키, 서비스 이용기록, 방문기록 등
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">4. 구글 애드센스(Google AdSense) 및 제3자 광고 쿠키 정책</h2>
            <p className="mb-6">
              본 웹사이트는 구글(Google LLC)이 제공하는 온라인 광고 서비스인 구글 애드센스(Google AdSense)를 이용합니다.
              <br />- 구글 및 제3자 광고 제공업체는 사용자의 이전 웹사이트 방문 기록을 바탕으로 개인 맞춤형 광고를 제공하기 위해 쿠키(Cookie)를 사용합니다.
              <br />- 사용자는 구글 광고 설정(<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-magenta underline">www.google.com/settings/ads</a>)에 접속하여 언제든지 맞춤형 광고 수신을 거부(Opt-out)할 수 있습니다.
              <br />- 또한 <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-magenta underline">www.aboutads.info</a>를 방문하여 제3자 광고 제공업체의 쿠키 사용을 선택 해제할 수 있습니다.
            </p>


            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">5. 개인정보의 파기절차 및 방법</h2>
            <p className="mb-6">
              연구소는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
              <br />- 파기방법 : 전자적 파일 형태는 기록을 재생할 수 없는 기술적 방법을 사용하며, 종이 문서는 분쇄하거나 소각합니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">6. 이용자 및 법정대리인의 권리와 그 행사방법</h2>
            <p className="mb-6">
              정보 주체는 연구소에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">7. 개인정보의 안전성 확보조치</h2>
            <p className="mb-6">
              연구소는 개인정보의 안전성 확보를 위해 관리적 조치(내부관리계획 수립), 기술적 조치(접근권한 관리, 보안프로그램 설치), 물리적 조치(접근통제) 등을 취하고 있습니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">8. 개인정보 보호책임자</h2>
            <p className="mb-6">
              개인정보 처리에 관한 업무를 총괄해서 책임지고, 관련 불만 처리 및 피해 구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              <br />- 이메일 문의 : smagentalab@gmail.com
            </p>


            <p className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400">
              본 방침은 2026년 4월 22일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
