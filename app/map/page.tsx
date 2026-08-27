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
  return (
    <>
      <div className="sr-only">
        <h1>실시간 반려동물 지도 (펫 맵) - 마젠타랩</h1>
        <p>
          마젠타랩의 반려동물 지도는 전국의 반려동물 동반 장소를 한눈에 확인할 수 있는 지역 기반 검색 서비스입니다. 
          현재 위치 또는 지역별 탐색 기능을 통해 내 주변의 애견 카페, 동반 식당, 24시 동물병원, 반려동물 공원, 애견 숙소를 실시간으로 찾아보세요.
        </p>
      </div>
      <MapClient />
    </>
  );
}
