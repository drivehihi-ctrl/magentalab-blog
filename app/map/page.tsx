'use client';

import React, { useState, useEffect } from 'react';
import PlaceSearchHeader from '@/components/map/PlaceSearchHeader';
import PetMapViewer from '@/components/map/PetMapViewer';
import PlaceDetailDrawer from '@/components/map/PlaceDetailDrawer';
import PetWeatherWidget from '@/components/map/PetWeatherWidget';
import AnsimPetCuratorModal from '@/components/map/AnsimPetCuratorModal';
import { PetCategory, PetPlacePOI } from '@/lib/map/types';
import { Sparkles, HeartHandshake, ArrowRight, Loader2, Heart, Wand2 } from 'lucide-react';
import Link from 'next/link';

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<PetCategory | 'all' | 'favorite'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<PetPlacePOI | null>(null);
  const [places, setPlaces] = useState<PetPlacePOI[]>([]);
  const [allFetchedPlaces, setAllFetchedPlaces] = useState<PetPlacePOI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCuratorOpen, setIsCuratorOpen] = useState<boolean>(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('magentalab_pet_favorites');
      if (saved) {
        setFavoriteIds(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Failed to load favorites:', err);
    }
  }, []);

  // Toggle Favorite handler
  const handleToggleFavorite = (placeId: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('magentalab_pet_favorites', JSON.stringify(next));
      }
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

  // Fetch real Kakao POI places from API route
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      if (selectedCategory === 'favorite') {
        if (favoriteIds.length > 0) {
          params.set('ids', favoriteIds.join(','));
        } else {
          setPlaces([]);
          setIsLoading(false);
          return;
        }
      } else {
        if (selectedCategory && selectedCategory !== 'all') {
          params.set('category', selectedCategory);
        }
        if (searchQuery && searchQuery.trim() !== '') {
          params.set('q', searchQuery.trim());
        }
      }

      fetch(`/api/map/places?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          if (!isCancelled && data.success && Array.isArray(data.data)) {
            setAllFetchedPlaces(data.data);
            if (selectedCategory === 'favorite') {
              let favs = data.data;
              if (searchQuery && searchQuery.trim() !== '') {
                const qLower = searchQuery.trim().toLowerCase();
                favs = favs.filter((p: PetPlacePOI) =>
                  p.name.toLowerCase().includes(qLower) ||
                  p.address.toLowerCase().includes(qLower) ||
                  p.categoryName.toLowerCase().includes(qLower)
                );
              }
              setPlaces(favs);
            } else {
              setPlaces(data.data);
            }
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
  }, [selectedCategory, searchQuery, favoriteIds]);

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

        {/* Hero Title Banner & Ansim AI Curator Trigger */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-semibold backdrop-blur-sm border border-purple-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>마젠타랩 펫 맵 (map.magentalabblog.com)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              우리 아이와 함께가는 <span className="text-purple-300">실시간 애견동반 지도</span>
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              카카오 지도 기반 전국 실제 애견 카페, 동반 식당, 24시 동물병원, 반려동물 공원, 애견 숙소 실시간 탐색!
            </p>
          </div>

          {/* Ansim AI Curator Trigger Button */}
          <button
            onClick={() => setIsCuratorOpen(true)}
            className="relative z-10 shrink-0 flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-purple-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 border border-amber-300 animate-pulse"
          >
            <Wand2 className="w-4 h-4 text-purple-950 shrink-0" />
            <span>1초 댕댕이 성격 맞춤 큐레이션 🐶</span>
          </button>
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

        {/* AI Character Ansim-i Banner & Link (Option 2: Recommended Exercise & BCS Calculator) */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">오늘 얼마나 뛰어놀아야 할까? 🏃‍♂️</h3>
              <p className="text-xs text-gray-500">AI 캐릭터 안심이의 반려견 BCS 체형 & 권장 운동량 계산기</p>
            </div>
          </div>

          <a
            href="https://www.magentalabblog.com/bcs-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-full shadow-md transition"
          >
            <span>안심이 운동량 계산기 바로가기</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </main>

      {/* Selected POI Detail Drawer */}
      <PlaceDetailDrawer
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isFavorite={selectedPlace ? favoriteIds.includes(selectedPlace.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Ansim Pet Curator AI Modal */}
      <AnsimPetCuratorModal
        isOpen={isCuratorOpen}
        onClose={() => setIsCuratorOpen(false)}
        places={allFetchedPlaces.length > 0 ? allFetchedPlaces : places}
        onSelectPlace={(place) => setSelectedPlace(place)}
      />
    </div>
  );
}
