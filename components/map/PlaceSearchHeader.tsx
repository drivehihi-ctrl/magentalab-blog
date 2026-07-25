'use client';

import React from 'react';
import { PetCategory } from '@/lib/map/types';
import { Search, Coffee, Utensils, Trees, Hospital, Hotel, MapPin, Heart } from 'lucide-react';

interface PlaceSearchHeaderProps {
  selectedCategory: PetCategory | 'all' | 'favorite';
  onCategoryChange: (cat: PetCategory | 'all' | 'favorite') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCount: number;
  favoriteCount?: number;
}

const CATEGORIES: { id: PetCategory | 'all' | 'favorite'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: '전체', icon: <MapPin className="w-4 h-4" /> },
  { id: 'favorite', label: '내 찜한 장소', icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> },
  { id: 'cafe', label: '애견카페', icon: <Coffee className="w-4 h-4" /> },
  { id: 'restaurant', label: '애견동반식당', icon: <Utensils className="w-4 h-4" /> },
  { id: 'park', label: '반려동물공원', icon: <Trees className="w-4 h-4" /> },
  { id: 'hospital', label: '24시동물병원', icon: <Hospital className="w-4 h-4" /> },
  { id: 'hotel', label: '애견숙소', icon: <Hotel className="w-4 h-4" /> },
];

export default function PlaceSearchHeader({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  totalCount,
  favoriteCount,
}: PlaceSearchHeaderProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-purple-100 p-4 shadow-sm sticky top-20 z-30">

      <div className="max-w-6xl mx-auto space-y-3">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="상호명, 지역(예: 연남동, 부천), 태그 검색..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-purple-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-full"
            >
              지우기
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const isFavoriteTab = cat.id === 'favorite';
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                {isFavoriteTab && favoriteCount !== undefined && favoriteCount > 0 && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-white text-purple-900' : 'bg-rose-500 text-white'
                  }`}>
                    {favoriteCount}
                  </span>
                )}
              </button>
            );
          })}

          <div className="ml-auto pl-2 text-xs font-semibold text-purple-700 whitespace-nowrap hidden sm:block">
            검색 결과 {totalCount}개
          </div>
        </div>
      </div>
    </div>
  );
}
