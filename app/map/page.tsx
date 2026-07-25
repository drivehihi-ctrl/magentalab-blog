'use client';

import React, { useState, useEffect } from 'react';
import PlaceSearchHeader from '@/components/map/PlaceSearchHeader';
import PetMapViewer from '@/components/map/PetMapViewer';
import PlaceDetailDrawer from '@/components/map/PlaceDetailDrawer';
import PetWeatherWidget from '@/components/map/PetWeatherWidget';
import AnsimPetCuratorModal from '@/components/map/AnsimPetCuratorModal';
import AnsimCoursePlannerModal from '@/components/map/AnsimCoursePlannerModal';
import { PetCategory, PetPlacePOI } from '@/lib/map/types';
import { Sparkles, HeartHandshake, ArrowRight, Loader2, Heart, Wand2, Compass, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<PetCategory | 'all' | 'favorite'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<PetPlacePOI | null>(null);
  const [places, setPlaces] = useState<PetPlacePOI[]>([]);
  const [allFetchedPlaces, setAllFetchedPlaces] = useState<PetPlacePOI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCuratorOpen, setIsCuratorOpen] = useState<boolean>(false);
  const [isCoursePlannerOpen, setIsCoursePlannerOpen] = useState<boolean>(false);
  const [favoritePlaces, setFavoritePlaces] = useState<PetPlacePOI[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Load favorite full place objects from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedObjects = localStorage.getItem('magentalab_pet_favorites_full_objects');
      if (savedObjects) {
        const parsed: PetPlacePOI[] = JSON.parse(savedObjects);
        setFavoritePlaces(parsed);
        setFavoriteIds(parsed.map((p) => p.id));
      }
    } catch (err) {
      console.warn('Failed to load favorite place objects:', err);
    }
  }, []);

  // Toggle Favorite handler with full object persistence
  const handleToggleFavoritePlace = (place: PetPlacePOI) => {
    setFavoritePlaces((prev) => {
      const exists = prev.some((p) => p.id === place.id);
      const next = exists ? prev.filter((p) => p.id !== place.id) : [place, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('magentalab_pet_favorites_full_objects', JSON.stringify(next));
      }
      setFavoriteIds(next.map((p) => p.id));
      return next;
    });
  };

  // Auto-open detail drawer if ?placeId= or ?place= exists in URL (from Kakao Share link)
  useEffect(() => {
    if (typeof window === 'undefined' || places.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const placeParam = params.get('placeId') || params.get('place');
    if (placeParam) {
      const found = places.find((p) => p.id === placeParam);
      if (found) {
        setSelectedPlace(found);
      }
    }
  }, [places]);

  // Fetch real Kakao POI places from API route or display local favorite objects
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    if (selectedCategory === 'favorite') {
      let favs = [...favoritePlaces];
      if (searchQuery && searchQuery.trim() !== '') {
        const qLower = searchQuery.trim().toLowerCase();
        favs = favs.filter(
          (p) =>
            p.name.toLowerCase().includes(qLower) ||
            p.address.toLowerCase().includes(qLower) ||
            p.categoryName.toLowerCase().includes(qLower)
        );
      }
      setPlaces(favs);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }
      if (searchQuery && searchQuery.trim() !== '') {
        params.set('q', searchQuery.trim());
      }

      fetch(`/api/map/places?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          if (!isCancelled && data.success && Array.isArray(data.data)) {
            setAllFetchedPlaces(data.data);
            setPlaces(data.data);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch real Kakao places:', err);
        })
        .finally(() => {
          if (!isCancelled) setIsLoading(false);
        });
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery, favoritePlaces]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Search Header */}
      <PlaceSearchHeader
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={places.length}
        favoriteCount={favoriteIds.length}
      />

      {/* Main Map Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 space-y-4">
        {/* Real-time Pet Weather Widget */}
        <PetWeatherWidget />

        {/* Hani-inspired Deep Navy Hero Title Banner & Ansim AI Curator Trigger */}
        <div className="bg-[#1a1a2e] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#c9a64c]/30 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          {/* Top Hani Accent Stripe */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#E5007E] via-[#c9a64c] to-[#E5007E] absolute top-0 left-0 right-0" />
          
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#c9a64c]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#c9a64c] text-xs font-extrabold border border-[#c9a64c]/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a64c] animate-pulse" />
              <span>마젠타랩 펫 맵 (map.magentalabblog.com)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              우리 아이와 함께가는 <span className="text-[#c9a64c]">실시간 애견동반 지도</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
              카카오 지도 기반 전국 실제 애견 카페, 동반 식당, 24시 동물병원, 반려동물 공원, 애견 숙소 실시간 탐색!
            </p>
          </div>

          {/* Action Trigger Buttons (Curator & Course Planner) */}
          <div className="relative z-10 shrink-0 flex flex-wrap gap-3">
            <button
              onClick={() => setIsCoursePlannerOpen(true)}
              className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#E5007E] to-[#c0006a] hover:from-[#c0006a] hover:to-[#E5007E] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 border border-pink-400/30 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-amber-300 shrink-0" />
              <span>주말 1초 AI 코스 플래너 🚗</span>
            </button>

            <button
              onClick={() => setIsCuratorOpen(true)}
              className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#c9a64c] to-[#a38230] hover:from-[#a38230] hover:to-[#c9a64c] text-[#1a1a2e] font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 border border-amber-300/40 cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-[#1a1a2e] shrink-0" />
              <span>1초 댕댕이 성격 맞춤 큐레이션 🐶</span>
            </button>
          </div>
        </div>

        {/* Map Loading Indicator Overlay */}
        <div className="relative">
          {isLoading && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-purple-900/90 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 backdrop-blur animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
              <span>실시간 카카오 지도 매장 탐색중...</span>
            </div>
          )}

          {/* Map Viewer */}
          <PetMapViewer
            places={places}
            selectedPlace={selectedPlace}
            onSelectPlace={(place) => setSelectedPlace(place)}
          />
        </div>

        {/* AI Character Ansim-i Banner & Link (Hani-inspired design) */}
        <div className="bg-[#faf6f0] rounded-3xl p-6 border border-[#e8e4df] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1a1a2e] text-[#c9a64c] flex items-center justify-center border border-[#c9a64c]/30 shrink-0 shadow-xs">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1a1a2e]">오늘 얼마나 뛰어놀아야 할까? 🏃‍♂️</h3>
              <p className="text-xs text-gray-600 font-medium">AI 캐릭터 안심이의 반려견 BCS 체형 & 권장 운동량 계산기</p>
            </div>
          </div>

          <a
            href="https://www.magentalabblog.com/bcs-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-6 py-3 bg-[#1a1a2e] hover:bg-[#252542] text-[#c9a64c] font-extrabold text-xs rounded-full shadow-md border border-[#c9a64c]/30 transition transform hover:scale-[1.02] active:scale-95"
          >
            <span>안심이 운동량 계산기 바로가기</span>
            <ArrowRight className="w-4 h-4 text-[#E5007E]" />
          </a>
        </div>

      </main>

      {/* Selected POI Detail Drawer */}
      <PlaceDetailDrawer
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isFavorite={selectedPlace ? favoriteIds.includes(selectedPlace.id) : false}
        onToggleFavorite={handleToggleFavoritePlace}
      />

      {/* Ansim Pet Curator AI Modal */}
      <AnsimPetCuratorModal
        isOpen={isCuratorOpen}
        onClose={() => setIsCuratorOpen(false)}
        places={allFetchedPlaces.length > 0 ? allFetchedPlaces : places}
        onSelectPlace={(place) => setSelectedPlace(place)}
      />

      {/* 1-Second AI Course Planner Modal */}
      <AnsimCoursePlannerModal
        isOpen={isCoursePlannerOpen}
        onClose={() => setIsCoursePlannerOpen(false)}
        places={allFetchedPlaces.length > 0 ? allFetchedPlaces : places}
        onSelectPlace={(place) => setSelectedPlace(place)}
      />
    </div>
  );
}
