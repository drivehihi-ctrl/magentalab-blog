import React from 'react';
import { Metadata } from 'next';
import MapClient from '@/components/map/MapClient';
import { PetCategory } from '@/lib/map/types';

// SEO 카테고리 매핑
const categoryMap: Record<string, { id: PetCategory, label: string }> = {
  cafe: { id: 'cafe', label: '애견 카페' },
  restaurant: { id: 'restaurant', label: '애견동반 식당' },
  park: { id: 'park', label: '반려동물 공원 (운동장)' },
  hotel: { id: 'hotel', label: '애견 숙소' },
  hospital: { id: 'hospital', label: '24시 동물병원' },
};

// URL slug를 한글로 디코딩 및 매핑
function parseSlug(slug: string[]) {
  const rawRegion = slug[0] ? decodeURIComponent(slug[0]) : '';
  const rawCategory = slug[1] ? decodeURIComponent(slug[1]) : '';
  
  // 영문으로 들어왔을 경우를 위한 간단한 매핑 (필요시 확장)
  const regionMap: Record<string, string> = {
    seoul: '서울',
    gapyeong: '가평',
    yangpyeong: '양평',
    busan: '부산',
    jeju: '제주',
    incheon: '인천',
  };

  const regionName = regionMap[rawRegion.toLowerCase()] || rawRegion;
  const categoryInfo = categoryMap[rawCategory.toLowerCase()] || null;

  return { regionName, categoryInfo };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { regionName, categoryInfo } = parseSlug(resolvedParams.slug);
  
  const title = categoryInfo 
    ? `${regionName} ${categoryInfo.label} 추천 TOP 리스트 - 마젠타랩 펫 맵`
    : `${regionName} 애견동반 핫플 및 스팟 총정리 - 마젠타랩 펫 맵`;

  const description = categoryInfo
    ? `실제 반려인들이 추천하는 ${regionName} 지역의 ${categoryInfo.label} 리스트입니다. 주차, 잔디 운동장, 안전 울타리 등 상세한 안심 제보 데이터를 확인하세요.`
    : `${regionName} 지역의 애견카페, 동반식당, 공원, 동물병원 등 반려견과 함께할 수 있는 모든 장소를 한눈에 확인하세요.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function SeoMapPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const { regionName, categoryInfo } = parseSlug(resolvedParams.slug);
  const categoryId = categoryInfo ? categoryInfo.id : 'all';

  // Schema.org JSON-LD 구조화 데이터 (검색 봇 제공용)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${regionName} ${categoryInfo ? categoryInfo.label : '애견동반 장소'} 추천 리스트`,
    'description': `${regionName} 지역에서 반려견과 함께 갈 수 있는 검증된 장소들입니다.`,
    'itemListElement': [
      // 실제 프로덕션에서는 서버에서 해당 지역 데이터를 DB에서 Fetch한 후 동적으로 리스트를 구성하는 것이 가장 좋습니다.
      // 여기서는 SEO 봇에게 이 페이지의 성격을 명확히 알려주기 위한 대표 스키마를 제공합니다.
      {
        '@type': 'ListItem',
        'position': 1,
        'item': {
          '@type': 'LocalBusiness',
          'name': `${regionName} 대표 ${categoryInfo ? categoryInfo.label : '애견동반 장소'}`,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': regionName,
            'addressRegion': 'KR'
          }
        }
      }
    ]
  };

  return (
    <>
      {/* 구글 검색 봇이 긁어갈 수 있는 Schema.org 데이터 삽입 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 실제 유저에게는 기존과 완벽하게 동일한 맵 UI 제공 (초기값 세팅) */}
      <MapClient initialRegion={regionName} initialCategory={categoryId} />
    </>
  );
}
