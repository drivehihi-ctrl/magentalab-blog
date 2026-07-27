import React from 'react';
import { Metadata } from 'next';
import MapClient from '@/components/map/MapClient';

export const metadata: Metadata = {
  title: '실시간 애견동반 지도 (펫 맵) - 마젠타랩',
  description: '카카오 지도 기반 전국 실제 애견 카페, 동반 식당, 24시 동물병원, 반려동물 공원, 애견 숙소를 실시간으로 탐색하세요!',
  alternates: {
    canonical: "https://www.magentalabblog.com/map",
    languages: {
      'ko-KR': 'https://www.magentalabblog.com/map',
      'en-US': 'https://www.magentalabblog.com/en/map',
      'ja-JP': 'https://www.magentalabblog.com/ja/map',
    },
  },
};

export default function MapPage() {
  return <MapClient />;
}
