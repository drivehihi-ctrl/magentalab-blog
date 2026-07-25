export type PetCategory = 'cafe' | 'restaurant' | 'park' | 'hospital' | 'hotel';

export interface PetPolicy {
  allowedSizes?: ('small' | 'medium' | 'large')[]; // 소형견, 중형견, 대형견
  indoorAllowed?: boolean;                         // 실내 동반 가능 여부
  outdoorAllowed?: boolean;                        // 야외/테라스 가능 여부
  offLeashAllowed?: boolean;                       // 오프리쉬(노리드줄) 가능 여부
  parkingAvailable?: boolean;                      // 주차 가능 여부
  notes?: string;                                  // 기타 주의사항 (예: 기저귀 착용 필수 등)
}

export interface PhotoSpotInfo {
  location: string;
  bestTime: string;
  shootingTip: string;
}

export interface PetPlacePOI {
  id: string;
  name: string;
  category: PetCategory;
  categoryName: string;
  address: string;
  roadAddress?: string;
  lat: number;
  lng: number;
  phone?: string;
  operatingHours: string;
  breakTime?: string;
  closedDays?: string;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  description?: string;
  petPolicy: PetPolicy;
  photoSpot?: PhotoSpotInfo;
  tags: string[];
  directionsUrls?: {
    kakao?: string;
    naver?: string;
  };
}

export interface PlaceFilterOptions {
  category?: PetCategory | 'all';
  searchQuery?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
}
