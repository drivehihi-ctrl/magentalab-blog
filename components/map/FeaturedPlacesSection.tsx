'use client';

import React, { useState } from 'react';
import { PetPlacePOI } from '@/lib/map/types';
import { Star, MapPin, BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import SafePlaceImage from '@/components/map/SafePlaceImage';
import NaverBlogReviews from '@/components/map/NaverBlogReviews';

interface FeaturedPlacesSectionProps {
  places: PetPlacePOI[];
  onSelectPlace: (place: PetPlacePOI) => void;
}

export default function FeaturedPlacesSection({ places, onSelectPlace }: FeaturedPlacesSectionProps) {
  const [selectedForReviews, setSelectedForReviews] = useState<PetPlacePOI | null>(null);

  // Show only places with images, sorted by reviewCount desc
  const featured = places
    .filter((p) => p.imageUrl && p.imageUrl.length > 0)
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, 12);

  if (featured.length === 0) return null;

  const CATEGORY_COLORS: Record<string, string> = {
    cafe: 'bg-amber-50 text-amber-700',
    restaurant: 'bg-green-50 text-green-700',
    park: 'bg-emerald-50 text-emerald-700',
    hospital: 'bg-blue-50 text-blue-700',
    hotel: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="space-y-6">

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">🏆 인기 반려동물 스팟</h2>
          <p className="text-xs text-gray-500 mt-0.5">리뷰 많은 순으로 엄선했어요</p>
        </div>
        <span className="text-xs text-gray-400 font-medium">{featured.length}곳</span>
      </div>

      {/* Horizontal scroll card row */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="inline-flex gap-3" style={{ minWidth: 'max-content' }}>
          {featured.map((place) => (
            <div
              key={place.id}
              className="w-44 sm:w-52 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:border-[#E5007E]/20 transition-all group"
              onClick={() => onSelectPlace(place)}
            >
              {/* Image */}
              <div className="relative w-full h-28 sm:h-32 bg-gray-100 overflow-hidden">
                <SafePlaceImage src={place.imageUrl!} alt={place.name} />
                {/* Category badge */}
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[place.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {place.categoryName}
                </span>
              </div>

              {/* Info */}
              <div className="p-3 space-y-1">
                <h3 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#E5007E] transition-colors">
                  {place.name}
                </h3>
                <p className="text-[10px] text-gray-500 flex items-center gap-1 truncate">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  {place.roadAddress || place.address}
                </p>
                <div className="flex items-center gap-1.5">
                  {place.rating && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      {place.rating}
                    </span>
                  )}
                  {place.reviewCount && (
                    <span className="text-[10px] text-gray-400">리뷰 {place.reviewCount}개</span>
                  )}
                </div>

                {/* Blog review toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedForReviews(selectedForReviews?.id === place.id ? null : place);
                  }}
                  className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-800 mt-1 transition-colors"
                >
                  <BookOpen className="w-3 h-3" />
                  블로그 후기 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Reviews Panel (shown when a place is selected for reviews) */}
      {selectedForReviews && (
        <div className="mt-4 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative shrink-0">
                <SafePlaceImage src={selectedForReviews.imageUrl!} alt={selectedForReviews.name} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{selectedForReviews.name}</p>
                <p className="text-[10px] text-gray-500">블로그 방문 후기</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedForReviews(null)}
              className="text-xs text-gray-500 hover:text-gray-800 font-semibold px-2 py-1 rounded-lg hover:bg-gray-200 transition"
            >
              닫기
            </button>
          </div>
          <div className="p-4">
            <NaverBlogReviews
              placeName={selectedForReviews.name}
              address={selectedForReviews.roadAddress || selectedForReviews.address}
            />
          </div>
        </div>
      )}
    </div>
  );
}
