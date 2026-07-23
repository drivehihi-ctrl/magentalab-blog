'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, ExternalLink, MessageSquareQuote, CheckCircle, Info, Loader2 } from 'lucide-react';

interface ReviewQuoteItem {
  quote: string;
  author: string;
  date: string;
  link: string;
}

interface AIBriefingData {
  summaryBullets: string[];
  quotes: ReviewQuoteItem[];
  naverSearchUrl: string;
}

interface AIBriefingReviewsProps {
  placeName: string;
  address?: string;
}

export default function AIBriefingReviews({ placeName, address }: AIBriefingReviewsProps) {
  const [briefingData, setBriefingData] = useState<AIBriefingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
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
  }, [placeName, address]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/60 rounded-3xl p-5 border border-purple-100 flex items-center justify-center gap-2 text-xs font-semibold text-purple-700">
        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
        <span>마젠타랩 AI가 실제 리뷰를 분석하여 AI 브리핑을 작성중입니다...</span>
      </div>
    );
  }

  if (!briefingData) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50/80 via-purple-50/50 to-indigo-50/80 rounded-3xl p-5 border border-indigo-100/80 shadow-sm space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-extrabold text-gray-900">AI 브리핑</h3>
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                실시간 분석
              </span>
            </div>
            <p className="text-[11px] text-gray-500">실제 사용자 방문 리뷰를 종합 요약해 드립니다.</p>
          </div>
        </div>

        {briefingData.naverSearchUrl && (
          <a
            href={briefingData.naverSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline shrink-0"
          >
            네이버 전체보기
            <ExternalLink className="w-3 h-3" />
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

      {/* Review Quote Cards */}
      {briefingData.quotes && briefingData.quotes.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
            <span className="flex items-center gap-1">
              <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-500" />
              실제 방문고객 한줄 후기
            </span>
            <span className="text-[10px] text-gray-400">출처 {briefingData.quotes.length}건</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {briefingData.quotes.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-3 rounded-2xl border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <p className="text-xs font-semibold text-gray-800 line-clamp-3 group-hover:text-indigo-600 transition leading-snug">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50 text-[10px] text-gray-400">
                  <span className="truncate max-w-[100px] text-gray-500 font-medium">{item.author}</span>
                  <span className="shrink-0">{item.date}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer Notice */}
      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 pt-1">
        <Info className="w-3 h-3 text-gray-400 shrink-0" />
        <span>AI 브리핑은 카카오/네이버 지도의 실제 방문자 후기를 바탕으로 자동 생성됩니다.</span>
      </div>
    </div>
  );
}
