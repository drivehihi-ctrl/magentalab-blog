'use client';

import React, { useState, useCallback } from 'react';
import { PetPlacePOI } from '@/lib/map/types';
import { Sparkles, X, MapPin, Share2, Compass, Utensils, Trees, Coffee, Hospital, ArrowRight, Navigation, Search } from 'lucide-react';

interface AnsimCoursePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: PetPlacePOI[];
  onSelectPlace: (place: PetPlacePOI) => void;
}

type ThemeChoice = 'healing' | 'energy' | 'brunch';

const POPULAR_PRESETS = [
  '가평',
  '양평',
  '강남',
  '연남동',
  '부천',
  '김포',
  '속초',
  '해운대',
  '제주',
];

export default function AnsimCoursePlannerModal({
  isOpen,
  onClose,
  places,
  onSelectPlace,
}: AnsimCoursePlannerModalProps) {
  const [searchRegion, setSearchRegion] = useState<string>('가평');
  const [selectedTheme, setSelectedTheme] = useState<ThemeChoice>('healing');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<{
    dining: PetPlacePOI;
    park: PetPlacePOI;
    cafe: PetPlacePOI;
    hospital: PetPlacePOI;
    title: string;
    description: string;
    targetRegionLabel: string;
  } | null>(null);

  // Helper: fetch best place from API for a specific category + region keyword
  const fetchBestPlaceForCategory = useCallback(async (
    category: 'restaurant' | 'park' | 'cafe' | 'hospital',
    regionQuery: string
  ): Promise<PetPlacePOI | null> => {
    try {
      const params = new URLSearchParams();
      params.set('category', category);
      if (regionQuery.trim()) params.set('q', regionQuery.trim());
      const res = await fetch(`/api/map/places?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        // Pick first result that matches the region keyword in address/name
        const trimmedKw = regionQuery.trim().toLowerCase();
        const regionMatch = data.data.find((p: PetPlacePOI) => {
          const text = (p.address + ' ' + (p.roadAddress || '') + ' ' + p.name).toLowerCase();
          return text.includes(trimmedKw);
        });
        return regionMatch || data.data[0];
      }
    } catch (err) {
      console.warn(`Failed to fetch ${category} for region "${regionQuery}":`, err);
    }
    return null;
  }, []);

  if (!isOpen) return null;

  // Generate 1-Second AI 3-Step Outing Course — each category fetched independently
  const handleGenerateCourse = async () => {
    if (!searchRegion.trim()) {
      alert('떠날 지역을 먼저 입력하거나 선택해주세요! 📍');
      return;
    }
    setIsGenerating(true);
    setGeneratedCourse(null);

    const displayRegion = searchRegion.trim();

    // ✅ Parallel fetch for each category independently — NOT from parent filtered places
    const [dining, park, cafe, hospital] = await Promise.all([
      fetchBestPlaceForCategory('restaurant', displayRegion),
      fetchBestPlaceForCategory('park', displayRegion),
      fetchBestPlaceForCategory('cafe', displayRegion),
      fetchBestPlaceForCategory('hospital', displayRegion),
    ]);

    // Fallback: if any category returned null, use the others or a placeholder
    const fallbackPlace: PetPlacePOI = {
      id: 'fallback',
      name: `${displayRegion} 주변 스팟 (검색 중)`,
      category: 'cafe',
      categoryName: '애견동반 스팟',
      address: displayRegion,
      roadAddress: displayRegion,
      lat: 37.5665,
      lng: 126.978,
      operatingHours: '영업시간 방문 전 문의',
      rating: 4.5,
      reviewCount: 0,
      tags: [],
      petPolicy: { indoorAllowed: true, outdoorAllowed: true, offLeashAllowed: false, parkingAvailable: true },
      directionsUrls: {},
    };

    const themeTitles: Record<ThemeChoice, string> = {
      healing: `🌸 [${displayRegion}] 댕댕이와 함께하는 감성 힐링 1일 데이트 코스`,
      energy: `⚡ [${displayRegion}] 체력 소진! 넓은 잔디 운동장 폭풍 뜀박질 코스`,
      brunch: `☕ [${displayRegion}] 인스타 핫플 브런치 & 여유로운 오후 산책 코스`,
    };

    const themeDescs: Record<ThemeChoice, string> = {
      healing: `${displayRegion} 근처 맛있는 애견동반 식사부터 탁 트인 산책 공원, 감성 카페까지 안심이 AI가 엄선한 실패 없는 3단계 데이트 동선입니다.`,
      energy: `${displayRegion} 근처 에너지 넘치는 아이를 위한 넓은 잔디 공원과 신나게 뛴 후 아늑하게 쉴 수 있는 애견동반 스팟 모음!`,
      brunch: `${displayRegion} 근처 사진 잘 나오는 포토존 브런치 카페와 그늘진 산책길로 구성된 완벽한 데이트 코스입니다.`,
    };

    setGeneratedCourse({
      dining: dining || fallbackPlace,
      park: park || fallbackPlace,
      cafe: cafe || fallbackPlace,
      hospital: hospital || fallbackPlace,
      title: themeTitles[selectedTheme],
      description: themeDescs[selectedTheme],
      targetRegionLabel: displayRegion,
    });

    setIsGenerating(false);
  };


  // KakaoTalk 1-Click Course Share Handler
  const handleShareKakao = () => {
    if (!generatedCourse) return;

    if (typeof window !== 'undefined' && window.kakao && window.kakao.Link) {
      try {
        window.kakao.Link.sendDefault({
          objectType: 'feed',
          content: {
            title: generatedCourse.title,
            description: `1단계: ${generatedCourse.dining.name}\n2단계: ${generatedCourse.park.name}\n3단계: ${generatedCourse.cafe.name}`,
            imageUrl: generatedCourse.cafe.imageUrl || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
          buttons: [
            {
              title: '🐾 1초 AI 코스 지도에서 보기',
              link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
              },
            },
          ],
        });
      } catch (err) {
        console.warn('Kakao Share API call fallback:', err);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (!generatedCourse) return;
    const text = `🚗 ${generatedCourse.title}\n\n1코스(식사): ${generatedCourse.dining.name}\n2코스(산책): ${generatedCourse.park.name}\n3코스(카페): ${generatedCourse.cafe.name}\n\n🏥 비상시 응급병원: ${generatedCourse.hospital.name}\n👉 펫 맵에서 코스 확인: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    alert(`📋 [${generatedCourse.targetRegionLabel} 댕댕이 1일 데이트 코스] 공유 텍스트가 복사되었습니다! 카톡 대화방에 붙여넣어 공유하세요!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1a2e]/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Hani-inspired Deep Navy Modal Header */}
        <div className="bg-[#1a1a2e] text-white p-5 sm:p-6 relative overflow-hidden border-b border-[#c9a64c]/30">
          <div className="h-[3px] w-full bg-gradient-to-r from-[#E5007E] via-[#c9a64c] to-[#E5007E] absolute top-0 left-0 right-0" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white bg-white/10 p-2 rounded-full backdrop-blur transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-[#c9a64c]/40 flex items-center justify-center text-[#c9a64c] shrink-0 shadow-xs">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#c9a64c]/20 text-[#c9a64c] border border-[#c9a64c]/30 inline-block">
                지역 맞춤 AI 코스 플래너 🚗
              </span>
              <h3 className="text-xl font-extrabold tracking-tight text-white mt-1">
                주말 1초 꿀조합 AI 코스 플래너
              </h3>
            </div>
          </div>
          <p className="text-xs text-gray-300 mt-2.5 leading-relaxed font-normal">
            원하시는 [지역]을 직접 검색하고 [테마]를 선택하면 <strong className="text-[#c9a64c]">식당 ➔ 산책 공원 ➔ 카페</strong> 1일 동선을 해당 지역 근처로 1초 만에 추천해 드립니다!
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* STEP 1: Region Direct Input Search + Popular Presets */}
          <div className="space-y-2.5">
            <label className="text-xs font-extrabold text-[#1a1a2e] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#E5007E]" />
                <span>1. 어디로 떠나시나요? (떠날 지역 입력/검색)</span>
              </span>
              <span className="text-[10px] text-[#E5007E] font-extrabold">직접 입력 가능 ✍️</span>
            </label>

            {/* Region Search Input Field */}
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchRegion}
                onChange={(e) => setSearchRegion(e.target.value)}
                placeholder="목적지 입력 (예: 가평, 양평, 연남동, 속초, 해운대, 서초...)"
                className="w-full pl-10 pr-9 py-3 bg-[#faf6f0] border border-gray-200 rounded-2xl text-xs font-bold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] focus:bg-white transition"
              />
              {searchRegion && (
                <button
                  onClick={() => setSearchRegion('')}
                  className="absolute right-3 text-[10px] bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full font-bold"
                >
                  지우기
                </button>
              )}
            </div>

            {/* Popular Region Quick Preset Buttons */}
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-semibold">🔥 인기 대표 지역 빠르게 선택하기:</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
                {POPULAR_PRESETS.map((preset) => {
                  const isSelected = searchRegion.trim().toLowerCase() === preset.toLowerCase();
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSearchRegion(preset)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition whitespace-nowrap shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1a1a2e] text-[#c9a64c] shadow-xs border border-[#c9a64c]/30'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200/50'
                      }`}
                    >
                      📍 {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 2: Theme Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-extrabold text-[#1a1a2e] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#c9a64c]" />
              <span>2. 원하는 코스 테마 선택</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'healing', label: '🌸 감성 힐링', sub: '여유로운 산책' },
                { id: 'energy', label: '⚡ 폭풍 뜀박질', sub: '잔디 운동장' },
                { id: 'brunch', label: '☕ 브런치 투어', sub: '인스타 핫플' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id as ThemeChoice)}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center cursor-pointer ${
                    selectedTheme === t.id
                      ? 'border-[#1a1a2e] bg-[#faf6f0] text-[#1a1a2e] ring-2 ring-[#c9a64c]/40 font-extrabold shadow-2xs'
                      : 'border-gray-200 hover:border-[#1a1a2e]/30 text-gray-700'
                  }`}
                >
                  <span className="text-xs font-bold">{t.label}</span>
                  <span className="text-[10px] text-gray-500 mt-1 font-medium">{t.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button: Generate Course */}
          <button
            onClick={handleGenerateCourse}
            disabled={isGenerating}
            className="w-full py-4 bg-[#1a1a2e] hover:bg-[#252542] text-[#c9a64c] font-black text-sm rounded-2xl shadow-lg border border-[#c9a64c]/30 transition transform hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <span>안심이 AI가 [{searchRegion || '목적지'}] 근처 1초 최적 동선 조합하는 중... ⏱️</span>
            ) : (
              <>
                <Navigation className="w-4 h-4 text-[#E5007E]" />
                <span>[{searchRegion || '목적지'}] 근처 1초 풀코스 생성하기</span>
              </>
            )}
          </button>

          {/* GENERATED COURSE RESULT DISPLAY */}
          {generatedCourse && (
            <div className="pt-4 border-t border-gray-100 space-y-4 animate-fadeIn">
              <div className="bg-[#1a1a2e] text-white p-4 sm:p-5 rounded-2xl shadow-md space-y-1.5 border border-[#c9a64c]/30 relative overflow-hidden">
                <div className="h-[2px] w-full bg-gradient-to-r from-[#E5007E] via-[#c9a64c] to-[#E5007E] absolute top-0 left-0 right-0" />
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#c9a64c] text-[#1a1a2e] inline-block">
                  [{generatedCourse.targetRegionLabel}] 맞춤 추천 코스 완성! 🎉
                </span>
                <h4 className="text-sm font-black text-white">{generatedCourse.title}</h4>
                <p className="text-[11px] text-gray-300 font-medium">{generatedCourse.description}</p>
              </div>

              {/* 3-Step Outing Timeline Flow */}
              <div className="space-y-2.5">
                {[
                  { step: '1단계', icon: <Utensils className="w-4 h-4 text-amber-600" />, label: `${generatedCourse.targetRegionLabel} 애견동반 식사`, place: generatedCourse.dining },
                  { step: '2단계', icon: <Trees className="w-4 h-4 text-emerald-600" />, label: `${generatedCourse.targetRegionLabel} 야외 잔디 산책`, place: generatedCourse.park },
                  { step: '3단계', icon: <Coffee className="w-4 h-4 text-purple-600" />, label: `${generatedCourse.targetRegionLabel} 감성 애견카페`, place: generatedCourse.cafe },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectPlace(item.place);
                      onClose();
                    }}
                    className="bg-[#faf6f0] hover:bg-gray-100 p-3.5 rounded-2xl border border-gray-200/80 flex items-center justify-between gap-3 cursor-pointer transition group shadow-2xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-[#1a1a2e] text-[#c9a64c] flex items-center justify-center font-black text-xs border border-[#c9a64c]/30 shrink-0">
                        {item.step}
                      </div>
                      <div className="overflow-hidden space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        <h5 className="text-xs font-extrabold text-[#1a1a2e] truncate group-hover:text-[#E5007E] transition">
                          {item.place.name}
                        </h5>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#E5007E] group-hover:translate-x-1 transition shrink-0" />
                  </div>
                ))}
              </div>

              {/* Emergency Hospital Section (Separate Reassuring Care Recommendation) */}
              <div className="bg-[#faf6f0] p-4 rounded-2xl border border-rose-200/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1a1a2e]">
                  <Hospital className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>🏥 혹시나 우리 아이가 아프다면 가까운 병원은?</span>
                </div>
                <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                  즐거운 나들이 길, 만약의 비상 상황에 대비해 [{generatedCourse.targetRegionLabel}] 동선 근처 24시 응급 동물의료센터 좌표도 준비해 두었습니다.
                </p>
                <div
                  onClick={() => {
                    onSelectPlace(generatedCourse.hospital);
                    onClose();
                  }}
                  className="bg-white p-3 rounded-xl border border-gray-200 hover:border-rose-300 transition cursor-pointer flex items-center justify-between gap-3 shadow-2xs group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 shrink-0">
                      24시 응급
                    </span>
                    <h5 className="text-xs font-extrabold text-[#1a1a2e] group-hover:text-rose-600 transition truncate">
                      {generatedCourse.hospital.name}
                    </h5>
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 group-hover:underline shrink-0 flex items-center gap-0.5">
                    병원 위치 보기 →
                  </span>
                </div>
              </div>

              {/* KakaoTalk Share Button */}
              <button
                onClick={handleShareKakao}
                className="w-full py-3.5 bg-[#FEE500] hover:bg-[#fdd800] text-[#191919] font-black text-sm rounded-2xl shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#191919]" />
                <span>💬 이 [{generatedCourse.targetRegionLabel}] 3단계 코스 카카오톡으로 친구에게 전송하기</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
