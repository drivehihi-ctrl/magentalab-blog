'use client';

import React, { useState, useEffect } from 'react';
import PetMapViewer from '@/components/map/PetMapViewer';
import PlaceDetailDrawer from '@/components/map/PlaceDetailDrawer';
import AnsimPetCuratorModal from '@/components/map/AnsimPetCuratorModal';
import AnsimCoursePlannerModal from '@/components/map/AnsimCoursePlannerModal';
import FeaturedPlacesSection from '@/components/map/FeaturedPlacesSection';
import WeatherChip from '@/components/map/WeatherChip';
import MapBlogSection from '@/components/map/MapBlogSection';
import PetHealthToolsSection from '@/components/map/PetHealthToolsSection';
import { PetCategory, PetPlacePOI } from '@/lib/map/types';
import { Search, Coffee, Utensils, Trees, Hospital, Hotel, MapPin, Heart, Navigation, Wand2, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'all' as const, label: '전체' },
  { id: 'favorite' as const, label: '찜' },
  { id: 'cafe' as const, label: '애견카페' },
  { id: 'restaurant' as const, label: '동반식당' },
  { id: 'park' as const, label: '반려공원' },
  { id: 'hospital' as const, label: '24시병원' },
  { id: 'hotel' as const, label: '애견숙소' },
];

interface MapClientProps {
  initialRegion?: string;
  initialCategory?: PetCategory | 'all' | 'favorite';
}

export default function MapClient({ initialRegion = '', initialCategory = 'all' }: MapClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<PetCategory | 'all' | 'favorite'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialRegion);
  const [selectedPlace, setSelectedPlace] = useState<PetPlacePOI | null>(null);
  const [places, setPlaces] = useState<PetPlacePOI[]>([]);
  const [allFetchedPlaces, setAllFetchedPlaces] = useState<PetPlacePOI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCuratorOpen, setIsCuratorOpen] = useState<boolean>(false);
  const [isCoursePlannerOpen, setIsCoursePlannerOpen] = useState<boolean>(false);
  const [favoritePlaces, setFavoritePlaces] = useState<PetPlacePOI[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedObjects = localStorage.getItem('magentalab_pet_favorites_full_objects');
      if (savedObjects) {
        const parsed: PetPlacePOI[] = JSON.parse(savedObjects);
        setFavoritePlaces(parsed);
        setFavoriteIds(parsed.map((p) => p.id));
      }
    } catch (err) { /* ignore */ }
  }, []);

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

  useEffect(() => {
    if (typeof window === 'undefined' || places.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const placeParam = params.get('placeId') || params.get('place');
    if (placeParam) {
      const found = places.find((p) => p.id === placeParam);
      if (found) setSelectedPlace(found);
    }
  }, [places]);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    if (selectedCategory === 'favorite') {
      let favs = [...favoritePlaces];
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        favs = favs.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
        );
      }
      setPlaces(favs);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
      if (searchQuery && searchQuery.trim() !== '') params.set('q', searchQuery.trim());

      fetch(`/api/map/places?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          if (!isCancelled && data.success && Array.isArray(data.data)) {
            setAllFetchedPlaces(data.data);
            setPlaces(data.data);
          }
        })
        .catch(console.error)
        .finally(() => { if (!isCancelled) setIsLoading(false); });
    }, 300);

    return () => { isCancelled = true; clearTimeout(timer); };
  }, [selectedCategory, searchQuery, favoritePlaces]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">

      {/* TOP SEARCH BAR */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="지역, 상호명 검색 (예: 강남, 연남동 카페)"
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#E5007E]/30 focus:border-[#E5007E] transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap transition-all ${
                    active ? 'bg-[#E5007E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                  {cat.id === 'favorite' && favoriteIds.length > 0 && (
                    <span className={`ml-1 text-[10px] font-bold ${active ? 'text-white/80' : 'text-rose-500'}`}>
                      {favoriteIds.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="relative w-full h-[55vh] min-h-[320px]">
        {isLoading && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur text-gray-700 px-4 py-2 rounded-full text-xs font-semibold shadow-md flex items-center gap-2 border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-[#E5007E] animate-pulse" />
            스팟 탐색중...
          </div>
        )}

        <div className="w-full h-full">
          <PetMapViewer
            places={places}
            selectedPlace={selectedPlace}
            onSelectPlace={(place) => setSelectedPlace(place)}
          />
        </div>
      </div>

      {/* BELOW MAP */}
      <div className="max-w-5xl w-full mx-auto px-4 pb-28 mt-8 space-y-10">
        <FeaturedPlacesSection
          places={allFetchedPlaces.length > 0 ? allFetchedPlaces : places}
          onSelectPlace={setSelectedPlace}
        />
        <MapBlogSection />
        <PetHealthToolsSection />
      </div>

      {/* FAB BUTTONS */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2.5">
        <button
          onClick={() => setIsCuratorOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-xs rounded-full shadow-lg hover:border-[#E5007E]/40 transition-all active:scale-95"
        >
          <Wand2 className="w-3.5 h-3.5 text-[#E5007E]" />
          맞춤 추천
        </button>
        <button
          onClick={() => setIsCoursePlannerOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#E5007E] text-white font-bold text-sm rounded-full shadow-lg hover:bg-[#c0006a] transition-all active:scale-95"
        >
          <Navigation className="w-4 h-4" />
          AI 코스 플래너
        </button>
      </div>

      <PlaceDetailDrawer
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isFavorite={selectedPlace ? favoriteIds.includes(selectedPlace.id) : false}
        onToggleFavorite={handleToggleFavoritePlace}
      />
      <AnsimPetCuratorModal
        isOpen={isCuratorOpen}
        onClose={() => setIsCuratorOpen(false)}
        places={allFetchedPlaces.length > 0 ? allFetchedPlaces : places}
        onSelectPlace={(place) => setSelectedPlace(place)}
      />
      <AnsimCoursePlannerModal
        isOpen={isCoursePlannerOpen}
        onClose={() => setIsCoursePlannerOpen(false)}
        places={allFetchedPlaces.length > 0 ? allFetchedPlaces : places}
        onSelectPlace={(place) => setSelectedPlace(place)}
      />

      {/* Draggable Weather Chip — fixed overlay, renders on top of everything */}
      <WeatherChip />
    </div>
  );
}
