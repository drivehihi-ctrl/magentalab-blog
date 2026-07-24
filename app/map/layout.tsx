import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '마젠타랩 펫 맵 | 동반 장소 & 안심 지수 현장 제보',
  description: '반려동물과 함께 갈 수 있는 병원, 카페, 펜션 지도 및 안심 지수 정보 서비스입니다.',
  alternates: {
    canonical: 'https://map.magentalabblog.com',
  },
  openGraph: {
    title: '마젠타랩 펫 맵 | 동반 장소 & 안심 지수 현장 제보',
    description: '반려동물과 함께 갈 수 있는 병원, 카페, 펜션 지도 및 안심 지수 정보 서비스입니다.',
    url: 'https://map.magentalabblog.com',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
