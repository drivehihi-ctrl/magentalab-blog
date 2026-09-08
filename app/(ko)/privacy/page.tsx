import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Magentalab",
  description: "Magentalab 반려동물 연구소의 개인정보처리방침입니다.",
  alternates: {
    canonical: "https://www.magentalabblog.com/privacy",
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
              <br />- 이메일 문의 처리 : 민원인의 신원 확인, 사실 조사를 위한 연락, 처리 결과 통보 등
              <br />- 서비스 이용 통계 및 분석 (Vercel Analytics 등 활용)
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">2. 수집하는 개인정보 항목 및 보유기간</h2>
            <p className="mb-6">
              연구소는 별도의 일반 회원가입(이름, 비밀번호, 주소, 전화번호 등)을 통한 개인정보 수집을 하지 않습니다.
              <br />- 이메일 문의 시 수집 항목 : 이메일 주소, 문의 내용 (목적 달성 후 지체 없이 파기)
              <br />- 간편 로그인(OAuth 2.0) 이용 시 수집 항목 :
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>로그인 방식: 구글(Google), 카카오(Kakao) 간편 로그인</li>
                <li>수집 필드: 소셜 계정의 이름, 이메일 주소, 프로필 이미지</li>
                <li>계정 및 정보 삭제 방법: 이메일(smagentalab@gmail.com)로 탈퇴 요청 시 지체 없이 파기</li>
              </ul>
              <br />- 인터넷 서비스 이용 과정에서 자동으로 생성되어 수집될 수 있는 항목 : IP주소, 쿠키, 서비스 이용기록, 방문기록 (Vercel Analytics 등을 통해 웹사이트 개선 목적으로 활용)
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">3. 분석 도구(Vercel Analytics)의 사용</h2>
            <p className="mb-6">
              본 웹사이트는 방문자의 서비스 이용 행태를 분석하여 더 나은 사용자 경험을 제공하기 위해 Vercel Analytics를 사용하고 있습니다. 이 과정에서 개인을 식별할 수 없는 형태의 브라우저 및 기기 정보, 페이지 방문 기록 등이 익명화되어 수집될 수 있습니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">4. 구글 애드센스(Google AdSense) 및 제3자 광고 쿠키 정책</h2>
            <p className="mb-6">
              본 웹사이트에 광고가 활성화되어 게재될 경우, 구글(Google LLC)이 제공하는 온라인 광고 서비스인 구글 애드센스(Google AdSense)를 이용할 수 있습니다.
              <br />- 구글 및 제3자 광고 제공업체는 사용자의 이전 웹사이트 방문 기록을 바탕으로 개인 맞춤형 광고를 제공하기 위해 쿠키(Cookie)를 사용할 수 있습니다.
              <br />- 사용자는 구글 광고 설정(<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-magenta underline">www.google.com/settings/ads</a>)에 접속하여 언제든지 맞춤형 광고 수신을 거부(Opt-out)할 수 있습니다.
              <br />- 또한 <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-magenta underline">www.aboutads.info</a>를 방문하여 제3자 광고 제공업체의 쿠키 사용을 선택 해제할 수 있습니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">5. 개인정보의 파기절차 및 방법</h2>
            <p className="mb-6">
              연구소는 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
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
