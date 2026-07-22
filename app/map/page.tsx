'use client';

import React, { useState, useMemo } from 'react';
import PlaceSearchHeader from '@/components/map/PlaceSearchHeader';
import PetMapViewer from '@/components/map/PetMapViewer';
import PlaceDetailDrawer from '@/components/map/PlaceDetailDrawer';
import { getPetPlaces } from '@/lib/map/places';
import { PetCategory, PetPlacePOI } from '@/lib/map/types';
import { MapPin, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<PetCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<PetPlacePOI | null>(null);

  const filteredPlaces = useMemo(() => {
    return getPetPlaces({
      category: selectedCategory,
      searchQuery,
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Search Header */}
      <PlaceSearchHeader
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredPlaces.length}
      />

      {/* Main Map Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 space-y-4">
        {/* Hero Title Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-semibold backdrop-blur-sm border border-purple-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>마젠타랩 펫 맵 (map.magentalabblog.com)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              우리 아이와 함께가는 <span className="text-purple-300">전속 애견동반 지도</span>
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              전국 애견 카페, 동반 식당, 24시 동물병원, 반려동물 공원까지! 위치, 영업시간, 실내/야외 수칙 정보를 한눈에 확인하세요.
            </p>
          </div>
        </div>

        {/* Map Viewer */}
        <PetMapViewer
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onSelectPlace={(place) => setSelectedPlace(place)}
        />

        {/* AI Character Ansim-i Banner & Link */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">외출 전 반려동물 건강 상태 점검하기</h3>
              <p className="text-xs text-gray-500">AI 캐릭터 안심이의 펫 케어 계산기 & 슬개골/방광염 진단 도구 이용하기</p>
            </div>
          </div>

          <Link
            href="/petcare-expenses-calculator"
            className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-full shadow-md transition"
          >
            <span>안심이 펫 진단기 바로가기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Selected POI Detail Drawer */}
      <PlaceDetailDrawer
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  );
}
