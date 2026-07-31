'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, ExternalLink, MessageSquareQuote, CheckCircle, Loader2 } from 'lucide-react';
import type { AIBriefingData } from '@/lib/map/aiBriefing';

interface AIBriefingReviewsProps {
  placeName: string;
  address?: string;
  initialData?: AIBriefingData | null;
}

export default function AIBriefingReviews({ placeName, address, initialData }: AIBriefingReviewsProps) {
  const [briefingData, setBriefingData] = useState<AIBriefingData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);

  useEffect(() => {
    if (initialData) {
      setBriefingData(initialData);
      setIsLoading(false);
      return;
    }

    if (!placeName) return;

    setIsLoading(true);

    let locationKeyword = '';
    if (address) {
      const parts = address.split(' ');
      if (parts.length >= 2) {
        locationKeyword = `${parts[0]} ${parts[1]}`;
      }
    }

    const searchQuery = `${locationKeyword} ${placeName}`.trim();

    fetch(`/api/map/blog-reviews?query=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.briefing) {
          setBriefingData(data.briefing);
        }
      })
      .catch((err) => console.error('Failed to fetch AI briefing:', err))
      .finally(() => setIsLoading(false));
  }, [placeName, address, initialData]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/60 rounded-3xl p-5 border border-purple-100 flex items-center justify-center gap-2 text-xs font-semibold text-purple-700">
        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
        <span>마젠타랩 AI가 네이버 블로그 후기를 실시간 분석하여 브리핑을 작성중입니다...</span>
      </div>
    );
  }

  if (!briefingData) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50/80 via-purple-50/50 to-indigo-50/80 rounded-3xl p-5 border border-indigo-100/80 shadow-sm space-y-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-indigo-100/60">
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-gray-900 whitespace-nowrap">AI 브리핑</h3>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/90 px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-2xs">
                실시간 분석
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
              실제 사용자 방문 리뷰를 종합 요약해 드립니다.
            </p>
          </div>
        </div>

        {briefingData.naverSearchUrl && (
          <a
            href={briefingData.naverSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline self-end sm:self-center shrink-0 bg-indigo-50/80 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg transition-colors border border-indigo-100/50"
          >
            <span>
              {briefingData.totalReviews ? `네이버 블로그 후기 (${briefingData.totalReviews.toLocaleString()}건) 전체보기` : '네이버 전체보기'}
            </span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        )}
      </div>

      {/* Bullet Points Summary */}
      <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-indigo-100/60 space-y-2.5">
        {briefingData.summaryBullets.map((bullet, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed">
            <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>{bullet}</span>
          </div>
        ))}
      </div>

      {/* 📸 AI Photo Spot & Shooting Tip Section (3 Real Review-Based Tips) */}
      {((briefingData.photoTips && briefingData.photoTips.length > 0) || briefingData.photoTip) && (
        <div className="bg-[#1a1a2e] text-white p-4 sm:p-5 rounded-2xl shadow-md border border-[#c9a64c]/30 space-y-3 relative overflow-hidden font-sans">
          <div className="h-[2px] w-full bg-gradient-to-r from-[#E5007E] via-[#c9a64c] to-[#E5007E] absolute top-0 left-0 right-0" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#c9a64c] text-[#1a1a2e] font-extrabold text-[10px] whitespace-nowrap">
                📸 AI 꿀팁 3선
              </span>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#c9a64c]">
                실제 후기 기반 인생샷 명당 & 촬영 꿀팁 3가지
              </h4>
            </div>
            <span className="text-[10px] text-gray-400 font-medium shrink-0">실시간 AI 검증</span>
          </div>

          <div className="space-y-2.5">
            {(briefingData.photoTips || (briefingData.photoTip ? [briefingData.photoTip] : [])).slice(0, 3).map((tip, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur p-3 rounded-xl border border-white/10 space-y-1 text-xs">
                {tip.title && (
                  <div className="text-[#c9a64c] font-extrabold text-[11px] mb-1 flex items-center gap-1">
                    <span>{tip.title}</span>
                  </div>
                )}
                <p className="text-gray-200 leading-snug">
                  📍 <strong className="text-[#c9a64c]">Best 포토존:</strong> {tip.location}
                </p>
                {tip.bestTime && (
                  <p className="text-gray-300 leading-snug">
                    ⏰ <strong className="text-[#c9a64c]">추천 시각:</strong> {tip.bestTime}
                  </p>
                )}
                <div className="bg-white/10 backdrop-blur p-2 rounded-lg border border-white/5 text-[11px] text-gray-200 font-medium leading-relaxed mt-1">
                  💡 <strong className="text-[#c9a64c]">촬영 팁:</strong> {tip.shootingTip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Review Quotes */}
      {briefingData.quotes && briefingData.quotes.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-800">
              <MessageSquareQuote className="w-4 h-4 text-purple-600" />
              <span>실제 방문고객 한줄 후기</span>
            </div>
            <span className="text-[10px] font-medium text-gray-400">
              출처 {briefingData.quotes.length}건
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {briefingData.quotes.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <p className="text-[11px] font-medium text-gray-800 line-clamp-3 group-hover:text-indigo-600 transition-colors leading-snug">
                  "{item.quote}"
                </p>

                <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400">
                  <span className="truncate max-w-[90px] font-semibold text-gray-600">{item.author}</span>
                  <span>{item.date}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
