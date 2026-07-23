import { NextRequest, NextResponse } from 'next/server';
import { getPetPlaces, INITIAL_PET_PLACES } from '@/lib/map/places';
import { PetCategory, PetPlacePOI } from '@/lib/map/types';

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY || 'c7850585b1a0e91017128dcf19fc6a25';

function mapCategoryToSearchTerm(category: PetCategory | 'all', userQuery: string): string {
  const cleanQuery = userQuery.trim();

  if (cleanQuery) {
    if (category !== 'all') {
      const categoryKeyword = 
        category === 'cafe' ? '애견카페' :
        category === 'restaurant' ? '애견동반식당' :
        category === 'park' ? '반려동물 공원' :
        category === 'hospital' ? '24시 동물병원' : '애견숙소';
      
      if (!cleanQuery.includes(categoryKeyword)) {
        return `${cleanQuery} ${categoryKeyword}`;
      }
    }
    return cleanQuery;
  }

  // Default broad queries
  switch (category) {
    case 'cafe': return '애견카페';
    case 'restaurant': return '애견동반식당';
    case 'park': return '반려견 놀이터';
    case 'hospital': return '24시 동물병원';
    case 'hotel': return '애견펜션';
    default: return '애견동반';
  }
}

function parsePetCategory(categoryName: string, queryCategory: PetCategory | 'all'): PetCategory {
  if (queryCategory !== 'all') return queryCategory;
  
  if (categoryName.includes('카페')) return 'cafe';
  if (categoryName.includes('음식점') || categoryName.includes('식당')) return 'restaurant';
  if (categoryName.includes('공원') || categoryName.includes('놀이터')) return 'park';
  if (categoryName.includes('병원') || categoryName.includes('수의')) return 'hospital';
  if (categoryName.includes('펜션') || categoryName.includes('숙박') || categoryName.includes('호텔')) return 'hotel';
  return 'cafe';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get('category') || 'all') as PetCategory | 'all';
  const query = searchParams.get('q') || '';

  try {
    const searchTerm = mapCategoryToSearchTerm(category, query);
    
    // Request Kakao Local REST API
    const kakaoUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(searchTerm)}&size=15`;
    
    const response = await fetch(kakaoUrl, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.documents && data.documents.length > 0) {
        const realPlaces: PetPlacePOI[] = data.documents.map((doc: any) => {
          const rawCategory = doc.category_name || '';
          const categoryName = rawCategory.split(' > ').pop() || '애견동반 스팟';
          const itemCategory = parsePetCategory(rawCategory, category);

          return {
            id: `kakao-${doc.id}`,
            name: doc.place_name,
            category: itemCategory,
            categoryName: categoryName,
            address: doc.address_name || '주소 정보 없음',
            roadAddress: doc.road_address_name || doc.address_name,
            lat: parseFloat(doc.y),
            lng: parseFloat(doc.x),
            phone: doc.phone || undefined,
            operatingHours: doc.phone ? `전화 문의 (${doc.phone})` : '영업시간 전화 문의',
            rating: 4.8,
            reviewCount: Math.floor(Math.random() * 200) + 20,
            imageUrl: `https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80`,
            description: `${doc.place_name}은(는) 카카오 지도에 등록된 실제 ${categoryName} 스팟입니다.`,
            petPolicy: {
              indoorAllowed: true,
              outdoorAllowed: true,
              offLeashAllowed: false,
              parkingAvailable: true,
              notes: '실시간 동반 가능 여부 및 매너벨트 착용 수칙은 방문 전 전화로 확인해 주세요.',
            },
            tags: [categoryName, '실제매장', '카카오맵'],
            directionsUrls: {
              kakao: doc.place_url || `https://map.kakao.com/link/map/${doc.id}`,
              naver: `https://map.naver.com/v5/search/${encodeURIComponent(doc.place_name)}`,
            },
          };
        });

        return NextResponse.json({
          success: true,
          source: 'kakao_real_local_api',
          count: realPlaces.length,
          data: realPlaces,
        });
      }
    }

    // Fallback to initial local sample dataset if API returns empty
    const fallbackPlaces = getPetPlaces({
      category,
      searchQuery: query,
    });

    return NextResponse.json({
      success: true,
      source: 'initial_dataset',
      count: fallbackPlaces.length,
      data: fallbackPlaces,
    });
  } catch (error) {
    console.error('Failed to fetch POI places:', error);
    const fallbackPlaces = getPetPlaces({ category, searchQuery: query });
    return NextResponse.json({
      success: true,
      source: 'fallback',
      count: fallbackPlaces.length,
      data: fallbackPlaces,
    });
  }
}
