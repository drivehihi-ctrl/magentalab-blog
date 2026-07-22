import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '마젠타랩 펫 맵 (개발중)',
  description: '우리 아이와 함께하는 전속 애견동반 지도 서비스',
  icons: {
    icon: '/map-icon.png',
    shortcut: '/map-icon.png',
    apple: '/map-icon.png',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};


export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
