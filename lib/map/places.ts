import { PetPlacePOI, PlaceFilterOptions } from './types';

export const INITIAL_PET_PLACES: PetPlacePOI[] = [
  {
    id: 'poi-1',
    name: '멍트럴파크 애견카페',
    category: 'cafe',
    categoryName: '애견카페',
    address: '경기도 부천시 소사구 범박동 123-4',
    roadAddress: '경기도 부천시 소사구 옥길로 56',
    lat: 37.4721,
    lng: 126.8202,
    phone: '032-123-4567',
    operatingHours: '매일 11:00 - 21:00',
    closedDays: '연중무휴',
    rating: 4.8,
    reviewCount: 324,
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
    description: '넓은 잔디 운동장과 인조잔디 천연잔디가 모두 완비된 대형 애견 운동장 겸 카페입니다.',
    petPolicy: {
      allowedSizes: ['small', 'medium', 'large'],
      indoorAllowed: true,
      outdoorAllowed: true,
      offLeashAllowed: true,
      parkingAvailable: true,
      notes: '실내 이용 시 매너벨트 착용 필수 (카운터 무료 제공)',
    },
    tags: ['천연잔디운동장', '대형견가능', '주차편리', '디저트맛집'],
    directionsUrls: {
      kakao: 'https://map.kakao.com/link/to/멍트럴파크,37.4721,126.8202',
      naver: 'https://map.naver.com/v5/search/멍트럴파크',
    },
  },
  {
    id: 'poi-2',
    name: '피터펫 피자 & 다이닝 (애견동반)',
    category: 'restaurant',
    categoryName: '애견동반식당',
    address: '서울특별시 마포구 연남동 228-9',
    roadAddress: '서울특별시 마포구 동교로 242',
    lat: 37.5621,
    lng: 126.9248,
    phone: '02-332-9876',
    operatingHours: '12:00 - 22:00 (라스트오더 21:00)',
    breakTime: '15:30 - 17:00',
    closedDays: '매주 월요일 휴무',
    rating: 4.6,
    reviewCount: 189,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    description: '반려견을 위한 특제 화덕 피자와 스테이크 메뉴가 함께 준비된 이탈리안 레스토랑입니다.',
    petPolicy: {
      allowedSizes: ['small', 'medium'],
      indoorAllowed: true,
      outdoorAllowed: true,
      offLeashAllowed: false,
      parkingAvailable: false,
      notes: '테이블 옆 반려동물 이동장 또는 리드줄 고정 필수',
    },
    tags: ['연남동맛집', '화덕피자', '강아지화덕피자', '실내동반'],
    directionsUrls: {
      kakao: 'https://map.kakao.com/link/to/피터펫다이닝,37.5621,126.9248',
      naver: 'https://map.naver.com/v5/search/피터펫연남',
    },
  },
  {
    id: 'poi-3',
    name: '월드컵공원 반려견 놀이터',
    category: 'park',
    categoryName: '반려동물공원',
    address: '서울특별시 마포구 상암동 482',
    roadAddress: '서울특별시 마포구 증산로 32 (월드컵공원 내)',
    lat: 37.5678,
    lng: 126.8912,
    phone: '02-300-5500',
    operatingHours: '24시간 오픈 (조명 23:00 소등)',
    closedDays: '월요일 정기 소독일 (무료 입장)',
    rating: 4.9,
    reviewCount: 512,
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
    description: '서울시에서 운영하는 무료 공공 반려견 놀이터로 소형견/대형견 구역이 완벽히 분리되어 안전합니다.',
    petPolicy: {
      allowedSizes: ['small', 'medium', 'large'],
      indoorAllowed: false,
      outdoorAllowed: true,
      offLeashAllowed: true,
      parkingAvailable: true,
      notes: '동물등록(마이크로칩) 필한 반려견만 입장 가능, 광견병 예방접종 필수',
    },
    tags: ['무료놀이터', '서울시운영', '대소형견분리', '주차가능'],
    directionsUrls: {
      kakao: 'https://map.kakao.com/link/to/월드컵공원반려견놀이터,37.5678,126.8912',
      naver: 'https://map.naver.com/v5/search/월드컵공원반려견놀이터',
    },
  },
  {
    id: 'poi-4',
    name: '24시 안심 동물의료센터',
    category: 'hospital',
    categoryName: '24시동물병원',
    address: '서울특별시 강남구 역삼동 700-1',
    roadAddress: '서울특별시 강남구 테헤란로 305',
    lat: 37.5041,
    lng: 127.0429,
    phone: '02-555-7582',
    operatingHours: '24시간 연중무휴 (응급실 상시 가동)',
    closedDays: '연중무휴',
    rating: 4.9,
    reviewCount: 430,
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
    description: '24시간 영상진단 센터 및 응급 수술실을 갖춘 대학병원급 안심 동물의료센터입니다.',
    petPolicy: {
      allowedSizes: ['small', 'medium', 'large'],
      indoorAllowed: true,
      outdoorAllowed: false,
      offLeashAllowed: false,
      parkingAvailable: true,
      notes: '발렛 주차 지원, 응급 환자 우선 진료 시스템',
    },
    tags: ['24시간동물병원', '응급진료', '강남동물병원', 'CT검사'],
    directionsUrls: {
      kakao: 'https://map.kakao.com/link/to/24시안심동물의료센터,37.5041,127.0429',
      naver: 'https://map.naver.com/v5/search/24시안심동물의료센터',
    },
  },
  {
    id: 'poi-5',
    name: '포레스트 펫 앤 스파 리조트',
    category: 'hotel',
    categoryName: '애견숙소',
    address: '경기도 가평군 설악면 회곡리 345',
    roadAddress: '경기도 가평군 설악면 유명로 890',
    lat: 37.6712,
    lng: 127.4891,
    phone: '031-584-9988',
    operatingHours: '체크인 15:00 / 체크아웃 11:00',
    closedDays: '연중무휴',
    rating: 4.7,
    reviewCount: 260,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    description: '독채 온수풀 미온수 수영장과 개별 잔디마당이 준비된 독채 펜션입니다.',
    petPolicy: {
      allowedSizes: ['small', 'medium', 'large'],
      indoorAllowed: true,
      outdoorAllowed: true,
      offLeashAllowed: true,
      parkingAvailable: true,
      notes: '객실당 2마리 기본 동반 가능, 강아지 전용 드라이룸 완비',
    },
    tags: ['가평애견펜션', '개별수영장', '독채운동장', '강아지스파'],
    directionsUrls: {
      kakao: 'https://map.kakao.com/link/to/포레스트펫리조트,37.6712,127.4891',
      naver: 'https://map.naver.com/v5/search/포레스트펫리조트',
    },
  },
  {
    id: 'poi-6',
    name: '아우디 펫 카페 & 가든',
    category: 'cafe',
    categoryName: '애견카페',
    address: '경기도 용인시 기흥구 보정동 1184-1',
    roadAddress: '경기도 용인시 기흥구 죽전로 15',
    lat: 37.3225,
    lng: 127.1102,
    phone: '031-266-4433',
    operatingHours: '매일 10:30 - 21:30',
    closedDays: '연중무휴',
    rating: 4.7,
    reviewCount: 215,
    imageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80',
    description: '보정동 카페거리에 위치한 포토존 가득한 아늑한 반려견 카페입니다.',
    petPolicy: {
      allowedSizes: ['small', 'medium'],
      indoorAllowed: true,
      outdoorAllowed: true,
      offLeashAllowed: false,
      parkingAvailable: true,
      notes: '포토 스튜디오 무료 이용 가능',
    },
    tags: ['보정동카페거리', '강아지포토존', '멍스무디', '애견동반카페'],
    directionsUrls: {
      kakao: 'https://map.kakao.com/link/to/아우디펫카페,37.3225,127.1102',
      naver: 'https://map.naver.com/v5/search/아우디펫카페용인',
    },
  }
];

export function getPetPlaces(options: PlaceFilterOptions = {}): PetPlacePOI[] {
  let result = [...INITIAL_PET_PLACES];

  if (options.category && options.category !== 'all') {
    result = result.filter(place => place.category === options.category);
  }

  if (options.searchQuery && options.searchQuery.trim() !== '') {
    const q = options.searchQuery.trim().toLowerCase();
    result = result.filter(place =>
      place.name.toLowerCase().includes(q) ||
      place.address.toLowerCase().includes(q) ||
      (place.roadAddress && place.roadAddress.toLowerCase().includes(q)) ||
      place.tags.some(tag => tag.toLowerCase().includes(q)) ||
      place.categoryName.toLowerCase().includes(q)
    );
  }

  return result;
}

export function getPetPlaceById(id: string): PetPlacePOI | undefined {
  return INITIAL_PET_PLACES.find(place => place.id === id);
}
