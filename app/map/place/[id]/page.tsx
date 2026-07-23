import React from 'react';
import { getPetPlaceById, INITIAL_PET_PLACES } from '@/lib/map/places';
import { MapPin, Clock, Phone, Navigation, ArrowLeft, Star, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import NaverBlogReviews from '@/components/map/NaverBlogReviews';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PlaceDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PlaceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const place = getPetPlaceById(id);

  if (!place) {
    return {
      title: '장소를 찾을 수 없습니다 | 마젠타랩 펫 맵',
    };
  }

  return {
    title: `${place.name} - 영업시간, 위치, 반려동물 동반 수칙 | 마젠타랩 펫 맵`,
    description: `${place.name} (${place.categoryName}) - ${place.address}. ${place.description || ''} 영업시간: ${place.operatingHours}`,
    keywords: [place.name, place.categoryName, '애견동반', '반려동물지도', ...place.tags],
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}


export async function generateStaticParams() {
  return INITIAL_PET_PLACES.map((place) => ({
    id: place.id,
  }));
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { id } = await params;
  const place = getPetPlaceById(id);

  if (!place) {
    notFound();
  }

  // Schema.org LocalBusiness JSON-LD for Search Engine SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: place.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.roadAddress || place.address,
      addressCountry: 'KR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.lat,
      longitude: place.lng,
    },
    telephone: place.phone,
    openingHours: place.operatingHours,
    image: place.imageUrl,
    aggregateRating: place.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: place.rating,
          reviewCount: place.reviewCount || 1,
        }
      : undefined,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/map"
          className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-white px-4 py-2 rounded-full shadow-sm border border-purple-100 hover:bg-purple-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>전체 애견 지도 보기로 돌아가기</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 inline-block">
              {place.categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{place.name}</h1>
            <p className="text-sm text-gray-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
              {place.roadAddress || place.address}
            </p>
          </div>

          {place.imageUrl && (
            <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-gray-100">
              {/* eslint-disable-next-html-element-suppression */}
              <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
            </div>
          )}

          {place.description && (
            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 text-sm text-gray-700 leading-relaxed">
              {place.description}
            </div>
          )}

          <div className="bg-gray-50 p-5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              반려동물 동반 수칙 & 상세 시설
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${place.petPolicy.indoorAllowed ? 'text-green-500' : 'text-gray-300'}`} />
                <span>실내 동반 {place.petPolicy.indoorAllowed ? '가능' : '불가'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${place.petPolicy.outdoorAllowed ? 'text-green-500' : 'text-gray-300'}`} />
                <span>야외/테라스 {place.petPolicy.outdoorAllowed ? '가능' : '불가'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${place.petPolicy.offLeashAllowed ? 'text-green-500' : 'text-gray-300'}`} />
                <span>오프리쉬(노리드줄) {place.petPolicy.offLeashAllowed ? '가능' : '불가'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${place.petPolicy.parkingAvailable ? 'text-green-500' : 'text-gray-300'}`} />
                <span>주차 {place.petPolicy.parkingAvailable ? '가능' : '불가'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-700 border-t border-b border-gray-100 py-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>영업시간: <strong>{place.operatingHours}</strong></span>
            </div>
            {place.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                <span>전화번호: <a href={`tel:${place.phone}`} className="text-purple-600 underline font-semibold">{place.phone}</a></span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {place.tags.map((tag) => (
              <span key={tag} className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                #{tag}
              </span>
            ))}
          </div>

          {/* Real Naver Blog Reviews */}
          <NaverBlogReviews placeName={place.name} address={place.address} />

          <div className="grid grid-cols-2 gap-3 pt-2">

            {place.directionsUrls?.kakao && (
              <a
                href={place.directionsUrls.kakao}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-xs sm:text-sm rounded-xl transition shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                카카오맵으로 길찾기
              </a>
            )}
            {place.directionsUrls?.naver && (
              <a
                href={place.directionsUrls.naver}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                네이버지도로 길찾기
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
