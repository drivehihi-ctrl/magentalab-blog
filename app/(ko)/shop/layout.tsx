import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

// shop 페이지는 앱 스타일 UI를 위해 기본 헤더/푸터를 숨기고 자체 탭바를 사용합니다.
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* shop 전용: 전역 Header(sticky top-0) 및 footer 숨김 */
        /* shop 전용: 전역 Header(sticky top-0) 숨김은 유지하되 Footer는 표시 (사용자 요청) */
        /* body > main ~ footer,
        body footer {
          display: none !important;
        } */
        /* Header 컴포넌트: sticky header 숨김 (사용자 요청에 따라 주석 처리)
        header.sticky {
          display: none !important;
        } */
        /* main 패딩 초기화 */
        body > main,
        main {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
      `}</style>
      {children}
    </>
  );
}
