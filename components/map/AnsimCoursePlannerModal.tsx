'use client';

import React, { useState } from 'react';
import { PetPlacePOI } from '@/lib/map/types';
import { Sparkles, X, MapPin, Share2, Compass, Utensils, Trees, Coffee, Hospital, ArrowRight, CheckCircle2, Navigation } from 'lucide-react';
import SafePlaceImage from './SafePlaceImage';

interface AnsimCoursePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: PetPlacePOI[];
  onSelectPlace: (place: PetPlacePOI) => void;
}

type RegionChoice = '김포' | '서울' | '경기' | '인천' | '부산';
type ThemeChoice = 'healing' | 'energy' | 'brunch';

export default function AnsimCoursePlannerModal({
  isOpen,
  onClose,
  places,
  onSelectPlace,
}: AnsimCoursePlannerModalProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionChoice>('김포');
  const [selectedTheme, setSelectedTheme] = useState<ThemeChoice>('healing');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<{
    dining: PetPlacePOI;
    park: PetPlacePOI;
    cafe: PetPlacePOI;
    hospital: PetPlacePOI;
    title: string;
    description: string;
  } | null>(null);

  if (!isOpen) return null;

  // Generate 1-Second AI 4-Step Course
  const handleGenerateCourse = () => {
    setIsGenerating(true);
    setGeneratedCourse(null);

    setTimeout(() => {
      // Pick matching places or fallbacks
      const regionFiltered = places.filter((p) =>
        p.address.includes(selectedRegion) || p.name.includes(selectedRegion) || selectedRegion === '김포'
      );

      const pool = regionFiltered.length >= 3 ? regionFiltered : places;

      const dining = pool.find((p) => p.category === 'restaurant') || pool[0] || places[0];
      const park = pool.find((p) => p.category === 'park') || pool[1] || places[1] || pool[0];
      const cafe = pool.find((p) => p.category === 'cafe') || pool[2] || places[2] || pool[0];
      const hospital = pool.find((p) => p.category === 'hospital') || pool[3] || places[3] || pool[0];

      const themeTitles: Record<ThemeChoice, string> = {
        healing: `🌸 [${selectedRegion}] 댕댕이와 함께하는 감성 힐링 1일 데이트 코스`,
        energy: `⚡ [${selectedRegion}] 체력 소진! 넓은 잔디 운동장 폭풍 뜀박질 코스`,
        brunch: `☕ [${selectedRegion}] 인스타 핫플 브런치 & 여유로운 오후 산책 코스`,
      };

      const themeDescs: Record<ThemeChoice, string> = {
        healing: `맛있는 애견동반 식사부터 탁 트인 산책 공원, 감성 카페까지 안심이 AI가 엄선한 실패 없는 동선입니다.`,
        energy: `에너지 넘치는 아이를 위한 넓은 잔디 공원과 신나게 뛴 후 아늑하게 쉴 수 있는 애견동반 스팟 모음!`,
        brunch: `사진 잘 나오는 포토존 브런치 카페와 그늘진 산책길로 구성된 완벽한 데이트 풀코스입니다.`,
      };

      setGeneratedCourse({
        dining,
        park,
        cafe,
        hospital,
        title: themeTitles[selectedTheme],
        description: themeDescs[selectedTheme],
      });

      setIsGenerating(false);
    }, 600);
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
            description: `1단계: ${generatedCourse.dining.name}\n2단계: ${generatedCourse.park.name}\n3단계: ${generatedCourse.cafe.name}\n4단계: ${generatedCourse.hospital.name} (24시 응급)`,
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
    const text = `🚗 ${generatedCourse.title}\n\n1코스(식사): ${generatedCourse.dining.name}\n2코스(산책): ${generatedCourse.park.name}\n3코스(카페): ${generatedCourse.cafe.name}\n4코스(응급): ${generatedCourse.hospital.name}\n\n👉 펫 맵에서 코스 확인: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    alert('📋 [가평/김포 댕댕이 1일 데이트 코스] 공유 텍스트가 복사되었습니다! 카톡 대화방에 붙여넣어 공유하세요!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-purple-100 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-purple-200 hover:text-white bg-white/10 p-2 rounded-full backdrop-blur transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-purple-950">
                바이럴 1위 꿀기능 🔥
              </span>
              <h3 className="text-xl font-black tracking-tight mt-0.5">
                주말 1초 꿀조합 AI 코스 플래너 🚗
              </h3>
            </div>
          </div>
          <p className="text-xs text-purple-200 mt-2 leading-relaxed">
            따로따로 검색할 필요 없이! [지역]과 [테마]만 선택하면 **[식당 ➔ 공원 ➔ 카페 ➔ 24시 병원]** 풀코스 1일 동선을 1초 만에 카드로 짜드립니다!
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Region Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-purple-600" />
              <span>1. 어디로 떠나시나요? (지역 선택)</span>
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
              {(['김포', '서울', '경기', '인천', '부산'] as RegionChoice[]).map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap shrink-0 ${
                    selectedRegion === region
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-300 scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  📍 {region}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: Theme Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>2. 원하는 코스 테마 선택</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'healing', label: '🌸 감성 힐링', sub: '여유로운 산책' },
                { id: 'energy', label: '⚡ 폭풍 뜀박질', sub: '잔디 운동장' },
                { id: 'brunch', label: '☕ 브런치 투어', sub: '인스타 핫플' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id as ThemeChoice)}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center ${
                    selectedTheme === t.id
                      ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-500/20 font-bold'
                      : 'border-gray-200 hover:border-purple-200 text-gray-700'
                  }`}
                >
                  <span className="text-xs font-bold">{t.label}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{t.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button: Generate Course */}
          <button
            onClick={handleGenerateCourse}
            disabled={isGenerating}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition active:scale-98 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <span>안심이 AI가 1초 최적 동선 조합하는 중... ⏱️</span>
            ) : (
              <>
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>1초 풀코스 AI 꿀조합 생성하기</span>
              </>
            )}
          </button>

          {/* GENERATED COURSE RESULT DISPLAY */}
          {generatedCourse && (
            <div className="pt-4 border-t border-purple-100 space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 rounded-2xl shadow-md space-y-1">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400 text-purple-950">
                  AI 안심이 추천 코스 완성! 🎉
                </span>
                <h4 className="text-sm font-black text-white">{generatedCourse.title}</h4>
                <p className="text-[11px] text-purple-200">{generatedCourse.description}</p>
              </div>

              {/* 4-Step Timeline Flow */}
              <div className="space-y-2.5">
                {[
                  { step: '1단계', icon: <Utensils className="w-4 h-4 text-amber-500" />, label: '애견동반 식사', place: generatedCourse.dining },
                  { step: '2단계', icon: <Trees className="w-4 h-4 text-emerald-500" />, label: '야외 잔디 산책', place: generatedCourse.park },
                  { step: '3단계', icon: <Coffee className="w-4 h-4 text-purple-500" />, label: '감성 애견카페', place: generatedCourse.cafe },
                  { step: '4단계', icon: <Hospital className="w-4 h-4 text-rose-500" />, label: '24시 응급 병원', place: generatedCourse.hospital },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectPlace(item.place);
                      onClose();
                    }}
                    className="bg-purple-50/70 hover:bg-purple-100 p-3 rounded-2xl border border-purple-100 flex items-center justify-between gap-3 cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center font-black text-xs text-purple-900 border border-purple-100 shrink-0">
                        {item.step}
                      </div>
                      <div className="overflow-hidden space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        <h5 className="text-xs font-bold text-gray-900 truncate group-hover:text-purple-700 transition">
                          {item.place.name}
                        </h5>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition shrink-0" />
                  </div>
                ))}
              </div>

              {/* KakaoTalk Share Button */}
              <button
                onClick={handleShareKakao}
                className="w-full py-3.5 bg-[#FEE500] hover:bg-[#fdd800] text-[#191919] font-black text-sm rounded-2xl shadow-md transition active:scale-98 flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-[#191919]" />
                <span>💬 이 풀코스 카카오톡으로 친구에게 전송하기</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
