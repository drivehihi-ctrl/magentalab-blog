'use client';

import React from 'react';
import { PetPlacePOI } from '@/lib/map/types';
import { X, MapPin, Clock, Phone, Navigation, ShieldAlert, CheckCircle2, Share2, ExternalLink, MessageSquareQuote, Info, Heart } from 'lucide-react';
import Link from 'next/link';
import AIBriefingReviews from '@/components/map/AIBriefingReviews';
import AnsimLabCertification from '@/components/map/AnsimLabCertification';
import KakaoShareButton from '@/components/map/KakaoShareButton';
import SafePlaceImage from '@/components/map/SafePlaceImage';







interface PlaceDetailDrawerProps {
  place: PetPlacePOI | null;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (place: PetPlacePOI) => void;
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '186380c4d2f6974b4c29d1be55963a4a';

export default function PlaceDetailDrawer({ place, onClose, isFavorite, onToggleFavorite }: PlaceDetailDrawerProps) {
  if (!place) return null;

  const handleShare = () => {
    const shareUrl = `https://map.magentalabblog.com/place/${place.id}`;
    const defaultImage = place.imageUrl || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80';
    const descText = place.description ? place.description.substring(0, 80) : `${place.address} 에 위치한 대표 ${place.categoryName} 스팟입니다.`;

    if (typeof window !== 'undefined' && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }

      try {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `[마젠타랩 펫 맵] 🐶 우리 아이와 함께 가볼까? ${place.name}`,
            description: `📍 ${place.roadAddress || place.address} (${place.categoryName})\n"${descText}"`,
            imageUrl: defaultImage,
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
              androidExecutionParams: `placeId=${place.id}`,
              iosExecutionParams: `placeId=${place.id}`,
            },
          },
          buttons: [
            {
              title: '펫 맵에서 상세보기',
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
                androidExecutionParams: `placeId=${place.id}`,
                iosExecutionParams: `placeId=${place.id}`,
              },
            },
          ],
        });
        return;
      } catch (err) {
        console.warn('Kakao Share failed:', err);
      }
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `[마젠타랩 펫 맵] ${place.name}`,
        text: `📍 ${place.address} (${place.categoryName})`,
        url: shareUrl,
      }).catch((err) => console.log('Web Share cancelled:', err));
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('공유 링크가 복사되었습니다!');
      }).catch(() => {
        alert(`링크 주소: ${shareUrl}`);
      });
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
              {place.reviewCount && (
                <div className="flex items-center gap-1 text-purple-700 font-semibold text-xs bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>블로그 리뷰 {place.reviewCount.toLocaleString()}개</span>
                </div>
              )}


            </div>

            <h2 className="text-xl font-bold text-gray-900">{place.name}</h2>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              {place.roadAddress || place.address}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(place)}
                className={`p-2 rounded-full transition ${
                  isFavorite
                    ? 'bg-rose-100 text-rose-600 font-bold'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={isFavorite ? '찜 해제' : '찜하기'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            )}
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
          <div className="space-y-1.5">
            <div className="relative h-44 w-full rounded-2xl overflow-hidden shadow-inner bg-gray-100">
              <SafePlaceImage src={place.imageUrl} alt={place.name} />
            </div>
            <p className="text-[11px] text-gray-400 text-right pr-1 flex items-center justify-end gap-1 font-medium">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>※ 상기 대표 이미지는 카테고리 분위기 이해를 돕기 위한 예시 컷이며, 해당 매장의 실제 전경과 다를 수 있습니다.</span>
            </p>
          </div>
        )}

        {/* Description */}
        {place.description && (
          <p className="text-xs sm:text-sm text-gray-600 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
            {place.description}
          </p>
        )}

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

        {/* Ansim Lab Certification & Safety Index */}
        <AnsimLabCertification
          placeName={place.name}
          category={place.category}
          placeId={place.id}
        />

        {/* AI Briefing Review Section */}
        <AIBriefingReviews placeName={place.name} address={place.address} />

        {/* 📸 AI Photo Spot & Shooting Tip Section (Viral Feature) */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-purple-400/20 space-y-2.5 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-purple-950 font-black text-[10px]">
              📸 AI 꿀팁
            </span>
            <h4 className="text-xs font-black text-amber-300">
              인스타 대박 인생샷 명당 좌표 & 촬영 팁
            </h4>
          </div>

          <div className="space-y-1.5 text-xs">
            <p className="text-purple-100">
              📍 <strong className="text-amber-200">Best 포토존 위치:</strong> {place.photoSpot?.location || '2층 야외 테라스 노란 의자 & 루프탑 잔디'}
            </p>
            <p className="text-purple-100">
              ⏰ <strong className="text-amber-200">추천 촬영 시각:</strong> {place.photoSpot?.bestTime || '오후 4시 ~ 5시 (노을빛 쏟아지는 골든아워)'}
            </p>
            <div className="bg-white/10 backdrop-blur p-2.5 rounded-xl border border-white/10 text-[11px] text-purple-100 font-medium leading-relaxed mt-1">
              💡 <strong className="text-amber-300">촬영 팁:</strong> {place.photoSpot?.shootingTip || '댕댕이를 의자 중앙에 앉히고 보호자님이 눈높이 수평 구도로 찍으시면 무조건 인스타 대박 인생샷 완성!'}
            </div>
          </div>
        </div>

        {/* KakaoTalk 1-Second Share Button */}
        <div className="pt-2">
          <KakaoShareButton
            placeId={place.id}
            placeName={place.name}
            categoryName={place.categoryName}
            address={place.roadAddress || place.address}
            imageUrl={place.imageUrl}
            description={place.description}
          />
        </div>

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


      </div>
    </div>
  );
}
