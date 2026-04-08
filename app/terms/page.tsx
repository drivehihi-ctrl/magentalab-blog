import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | Magentalab",
  description: "Magentalab 반려동물 연구소의 이용약관입니다.",
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
              이 약관은 Magentalab 반려동물 연구소(이하 "연구소")가 운영하는 웹사이트에서 제공하는 인터넷 관련 서비스(이하 "서비스")를 이용함에 있어 연구소와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 2 조 (정의)</h2>
            <p className="mb-6">
              1. "이용자"란 연구소에 접속하여 이 약관에 따라 연구소가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
              <br />2. "서비스"란 연구소가 이용자에게 제공하는 블로그 정보, 뉴스레터, 파트너십 제안 등의 모든 인터넷 서비스를 의미합니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 3 조 (약관의 명시와 개정)</h2>
            <p className="mb-6">
              연구소는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 초기 서비스 화면에 게시합니다. 연구소는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 4 조 (서비스의 내용 및 변경)</h2>
            <p className="mb-6">
              1. 연구소는 반려동물 건강 정보 및 연구 데이터를 제공합니다.
              <br />2. 연구소에서 제공하는 모든 건강 정보는 참고용이며, 의학적 진단이나 진료를 대신할 수 없습니다. 정확한 진단은 반드시 수의사와 상담해야 합니다.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">제 5 조 (저작권의 귀속 및 이용제한)</h2>
            <p className="mb-6">
              연구소가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 연구소에 귀속됩니다. 이용자는 연구소의 서비스를 이용함으로써 얻은 정보를 연구소의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
            </p>

            <p className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400">
              본 약관은 2026년 4월 8일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
