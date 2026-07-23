'use client';

import React from 'react';
import { PetPlacePOI } from '@/lib/map/types';
import { X, MapPin, Clock, Phone, Navigation, Star, ShieldAlert, CheckCircle2, Share2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import NaverBlogReviews from '@/components/map/NaverBlogReviews';


interface PlaceDetailDrawerProps {
  place: PetPlacePOI | null;
  onClose: () => void;
}

export default function PlaceDetailDrawer({ place, onClose }: PlaceDetailDrawerProps) {
  if (!place) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${place.name} | 마젠타랩 애견동반 지도`,
        text: `${place.name} - ${place.address}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-2xl border-t border-purple-100 max-w-2xl mx-auto overflow-hidden animate-in slide-in-from-bottom duration-300">
      {/* Drawer Handle */}
      <div className="w-full py-2 flex justify-center cursor-pointer bg-gray-50 border-b border-gray-100" onClick={onClose}>
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </div>

      <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
        {/* Header Image & Basic Info */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                {place.categoryName}
              </span>
              {place.rating && (
                <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{place.rating}</span>
                  {place.reviewCount && <span className="text-gray-400 font-normal">({place.reviewCount})</span>}
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900">{place.name}</h2>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              {place.roadAddress || place.address}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              title="공유하기"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thumbnail Banner */}
        {place.imageUrl && (
          <div className="relative h-44 w-full rounded-2xl overflow-hidden shadow-inner bg-gray-100">
            {/* eslint-disable-next-html-element-suppression */}
            <img
              src={place.imageUrl}
              alt={place.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Description */}
        {place.description && (
          <p className="text-xs sm:text-sm text-gray-600 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
            {place.description}
          </p>
        )}

        {/* Pet Policy Checklist */}
        <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 space-y-2">
          <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-purple-600" />
            반려동물 동반 수칙 & 시설
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-3.5 h-3.5 ${place.petPolicy.indoorAllowed ? 'text-green-500' : 'text-gray-300'}`} />
              <span>실내 동반 {place.petPolicy.indoorAllowed ? '가능' : '불가'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-3.5 h-3.5 ${place.petPolicy.outdoorAllowed ? 'text-green-500' : 'text-gray-300'}`} />
              <span>야외/테라스 {place.petPolicy.outdoorAllowed ? '가능' : '불가'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-3.5 h-3.5 ${place.petPolicy.offLeashAllowed ? 'text-green-500' : 'text-gray-300'}`} />
              <span>오프리쉬(노리드줄) {place.petPolicy.offLeashAllowed ? '가능' : '불가'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-3.5 h-3.5 ${place.petPolicy.parkingAvailable ? 'text-green-500' : 'text-gray-300'}`} />
              <span>주차 공간 {place.petPolicy.parkingAvailable ? '가능' : '불가'}</span>
            </div>
          </div>
          {place.petPolicy.notes && (
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-2">
              💡 {place.petPolicy.notes}
            </p>
          )}
        </div>

        {/* Operating Hours & Contact */}
        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500 shrink-0" />
            <span>영업시간: <strong>{place.operatingHours}</strong></span>
          </div>
          {place.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-500 shrink-0" />
              <span>전화번호: <a href={`tel:${place.phone}`} className="text-purple-600 underline font-medium">{place.phone}</a></span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {place.tags.map((tag) => (
            <span key={tag} className="text-[11px] bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* Naver Real Blog Reviews Section */}
        <NaverBlogReviews placeName={place.name} address={place.address} />

        {/* Navigation Action Buttons */}

        <div className="grid grid-cols-2 gap-3 pt-2">
          {place.directionsUrls?.kakao && (
            <a
              href={place.directionsUrls.kakao}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-xs rounded-xl shadow-sm transition"
            >
              <Navigation className="w-4 h-4" />
              카카오맵 길찾기
            </a>
          )}
          {place.directionsUrls?.naver && (
            <a
              href={place.directionsUrls.naver}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <Navigation className="w-4 h-4" />
              네이버지도 길찾기
            </a>
          )}
        </div>

        {/* Detailed SEO Link */}
        <div className="text-center pt-2">
          <Link
            href={`/map/place/${place.id}`}
            className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-semibold underline"
          >
            상세 정보 및 블로그 후기 페이지 보기
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
