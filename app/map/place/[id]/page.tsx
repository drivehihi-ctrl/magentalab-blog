import React from 'react';
import { getPetPlaceById, INITIAL_PET_PLACES } from '@/lib/map/places';
import { MapPin, Clock, Phone, Navigation, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import AIBriefingReviews from '@/components/map/AIBriefingReviews';
import KakaoShareButton from '@/components/map/KakaoShareButton';
import { getAIBriefingData } from '@/lib/map/aiBriefing';
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

  const aiBriefing = await getAIBriefingData(place.name, place.address);
  const briefingSummary = aiBriefing.summaryBullets[0] || place.description || '';
  const metaDescription = `${place.name} (${place.categoryName}) - ${place.address}. ${briefingSummary} 영업시간: ${place.operatingHours}`;

  return {
    title: `${place.name} - AI 후기 요약, 영업시간, 반려동물 동반 수칙 | 마젠타랩 펫 맵`,
    description: metaDescription,
    keywords: [place.name, place.categoryName, '애견동반', '반려동물지도', 'AI후기', ...place.tags],
    openGraph: {
      title: `${place.name} - 마젠타랩 펫 맵 AI 브리핑`,
      description: metaDescription,
      images: place.imageUrl ? [{ url: place.imageUrl }] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
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

  // Fetch AI Briefing on Server-side (SSR/ISR) for search engine indexing
  const aiBriefingData = await getAIBriefingData(place.name, place.address);

  // Schema.org LocalBusiness JSON-LD for Search Engine SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: place.name,
    description: aiBriefingData.summaryBullets.join(' '),
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aiBriefingData.calculatedRating || place.rating || 4.7,
      reviewCount: aiBriefingData.totalReviews || place.reviewCount || 10,
    },
    review: aiBriefingData.quotes.map((q) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: q.author,
      },
      datePublished: q.date,
      reviewBody: q.quote,
    })),
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
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80';
                }}
              />
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

          {/* Real Server-Side Rendered AI Briefing Reviews for 100% SEO Search Engine Crawling */}
          <AIBriefingReviews placeName={place.name} address={place.address} initialData={aiBriefingData} />

          {/* KakaoTalk Viral Share Button */}
          <div className="pt-2">
            <KakaoShareButton
              placeId={place.id}
              placeName={place.name}
              categoryName={place.categoryName}
              address={place.roadAddress || place.address}
              imageUrl={place.imageUrl}
              description={place.description || aiBriefingData.summaryBullets[0]}
            />
          </div>

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
