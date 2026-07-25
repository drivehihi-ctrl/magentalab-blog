import { NextRequest, NextResponse } from 'next/server';
import { getPetPlaces, getPetPlaceByIdAsync } from '@/lib/map/places';
import { PetCategory, PetPlacePOI } from '@/lib/map/types';
import { getRealPlaceImageUrl } from '@/lib/map/aiBriefing';

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY || 'c7850585b1a0e91017128dcf19fc6a25';

const CATEGORY_IMAGE_COLLECTIONS: Record<string, string[]> = {
  cafe: [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&q=80',
  ],
  restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
  ],
  park: [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80',
  ],
  hospital: [
    'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
  ],
  hotel: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  ],
};

function getPlaceMeta(category: string, placeId: string, placeName: string) {
  const collection = CATEGORY_IMAGE_COLLECTIONS[category] || CATEGORY_IMAGE_COLLECTIONS['park'];
  let hash = 0;
  const str = placeId + placeName;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const imageIndex = absHash % collection.length;

  const ratingList = [4.5, 4.6, 4.7, 4.8, 4.9, 4.7, 4.8, 4.9, 4.6, 4.8, 4.9, 4.7];
  const rating = ratingList[absHash % ratingList.length];
  const reviewCount = 38 + (absHash % 320);

  return {
    imageUrl: collection[imageIndex],
    rating,
    reviewCount,
  };
}

function getPhotoSpotInfo(category: string, placeName: string) {
  const spotLocations = [
    '2층 야외 테라스 노란 의자 & 루프탑 잔디',
    '입구 감성 통창 포토존 메인 미니 벤치',
    '넓은 야외 잔디밭 펜스 입구 전용 조명 포토존',
    '아늑한 실내 전용 라운지 강아지 미니 방석',
    '메인 가든 알록달록 무지개 바람개비 존',
  ];
  const bestTimes = [
    '오후 4시 ~ 5시 (노을빛 쏟아지는 골든아워 시간대)',
    '오전 11시 ~ 12시 (햇살이 가장 맑고 눈부신 시각)',
    '해 질 녘 오후 6시 (은은한 조명 켜지는 감성 타임)',
  ];
  const tips = [
    '댕댕이를 의자 중앙에 앉히고 보호자님이 눈높이 수평 수평 구도로 찍으시면 인스타 대박 인생샷 완성!',
    '강아지가 간식을 바라볼 때 정면 샷을 연속 촬영하면 역대급 인생 프로필 컷을 얻을 수 있습니다.',
    '자연광을 등지고 찍으면 털 표면이 반짝이는 천사 컷 촬영이 가능합니다!',
  ];

  let hash = 0;
  for (let i = 0; i < placeName.length; i++) {
    hash = (hash << 5) - hash + placeName.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);

  return {
    location: spotLocations[abs % spotLocations.length],
    bestTime: bestTimes[abs % bestTimes.length],
    shootingTip: tips[abs % tips.length],
  };
}

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
  if (categoryName.includes('음식점') || categoryName.includes('식당') || categoryName.includes('뷔페') || categoryName.includes('버거')) return 'restaurant';
  if (categoryName.includes('공원') || categoryName.includes('놀이터') || categoryName.includes('쉼터') || categoryName.includes('운동장')) return 'park';
  if (categoryName.includes('병원') || categoryName.includes('수의')) return 'hospital';
  if (categoryName.includes('펜션') || categoryName.includes('숙박') || categoryName.includes('호텔') || categoryName.includes('리조트')) return 'hotel';
  return 'cafe';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get('category') || 'all') as PetCategory | 'all';
  const query = searchParams.get('q') || '';
  const idsParam = searchParams.get('ids') || '';

  try {
    // 🌟 If specific POI IDs are requested (e.g. Favorite Places tab: ids=poi-1,kakao-1234)
    if (idsParam.trim()) {
      const requestedIds = idsParam.split(',').map(id => id.trim()).filter(Boolean);
      const favoritePlaces = (
        await Promise.all(requestedIds.map(id => getPetPlaceByIdAsync(id)))
      ).filter((p): p is PetPlacePOI => p !== null);

      return NextResponse.json({
        success: true,
        source: 'favorites_by_ids',
        count: favoritePlaces.length,
        data: favoritePlaces,
      });
    }

    const searchTerm = mapCategoryToSearchTerm(category, query);
    
    // Request Kakao Local REST API
    const kakaoUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(searchTerm)}&size=15`;
    
    const response = await fetch(kakaoUrl, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.documents && data.documents.length > 0) {
        const petKeywords = ['애견', '반려', '펫', '동물', '강아지', '고양이', '멍', '냥', '동반', '입장', '놀이터', '운동장', '병원', '펜션', '카페'];

        const realPlaces: PetPlacePOI[] = await Promise.all(
          data.documents
            .filter((doc: any) => {
              const rawCategory = doc.category_name || '';
              const name = doc.place_name || '';
              
              // 온천, 섬, 산 등 반려동물과 전혀 무관한 카테고리는 이름에 펫 관련 키워드가 없으면 제외
              const excludedCategories = ['온천', '섬', '산', '계곡', '성곽', '유적지', '관공서'];
              const isExcludedCategory = excludedCategories.some(cat => rawCategory.includes(cat));
              const hasPetKeyword = petKeywords.some(kw => name.includes(kw) || rawCategory.includes(kw));

              if (isExcludedCategory && !hasPetKeyword) {
                return false;
              }
              return true;
            })
            .map(async (doc: any) => {
              const rawCategory = doc.category_name || '';
              const categoryName = rawCategory.split(' > ').pop() || '애견동반 스팟';
              const itemCategory = parsePetCategory(rawCategory, category);
              const placeId = `kakao-${doc.id}`;
              const placeMeta = getPlaceMeta(itemCategory, placeId, doc.place_name);

              // 🌟 네이버 이미지 검색 API로 매장의 '진짜 대표 실사 사진' 실시간 가져오기!
              const realImg = await getRealPlaceImageUrl(doc.place_name, doc.road_address_name || doc.address_name);

              return {
                id: placeId,
                name: doc.place_name,
                category: itemCategory,
                categoryName: categoryName,
                address: doc.address_name || '주소 정보 없음',
                roadAddress: doc.road_address_name || doc.address_name,
                lat: parseFloat(doc.y),
                lng: parseFloat(doc.x),
                phone: doc.phone || undefined,
                operatingHours: doc.phone ? `전화 문의 (${doc.phone})` : '영업시간 전화 문의',
                rating: placeMeta.rating,
                reviewCount: placeMeta.reviewCount,
                imageUrl: realImg || placeMeta.imageUrl,
                description: `${doc.place_name}은(는) 카카오 지도에 등록된 실제 ${categoryName} 스팟입니다.`,
                petPolicy: {
                  indoorAllowed: true,
                  outdoorAllowed: true,
                  offLeashAllowed: itemCategory === 'park',
                  parkingAvailable: true,
                  notes: '실시간 동반 가능 여부 및 매너벨트 착용 수칙은 방문 전 전화로 확인해 주세요.',
                },
                photoSpot: getPhotoSpotInfo(itemCategory, doc.place_name),
                tags: [categoryName, '실제매장', '카카오맵'],
                directionsUrls: {
                  kakao: `https://map.kakao.com/link/to/${encodeURIComponent(doc.place_name)},${doc.y},${doc.x}`,
                  naver: `https://map.naver.com/v5/search/${encodeURIComponent(doc.place_name + ' ' + (doc.road_address_name || doc.address_name))}`,
                },
              };
            })
        );

        return NextResponse.json({
          success: true,
          source: 'kakao_real_local_api',
          count: realPlaces.length,
          data: realPlaces,
        });
      }
    }

    // Fallback
    const fallbackPlaces = getPetPlaces({ category, searchQuery: query });
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
