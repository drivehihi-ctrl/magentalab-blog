'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, BookOpen, Sparkles, Loader2 } from 'lucide-react';

interface BlogReviewItem {
  title: string;
  link: string;
  description: string;
  bloggerName: string;
  bloggerLink: string;
  postDate: string;
}

interface NaverBlogReviewsProps {
  placeName: string;
  address?: string;
}

export default function NaverBlogReviews({ placeName, address }: NaverBlogReviewsProps) {
  const [reviews, setReviews] = useState<BlogReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [naverSearchUrl, setNaverSearchUrl] = useState<string>('');

  useEffect(() => {
    if (!placeName) return;

    setIsLoading(true);

    // Extract city/district for a better search query
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
        if (data.success && Array.isArray(data.data)) {
          setReviews(data.data);
          if (data.naverSearchUrl) {
            setNaverSearchUrl(data.naverSearchUrl);
          } else {
            setNaverSearchUrl(`https://search.naver.com/search.naver?where=blog&query=${encodeURIComponent(searchQuery)}`);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch blog reviews:', err))
      .finally(() => setIsLoading(false));
  }, [placeName, address]);

  return (
    <div className="bg-emerald-50/40 rounded-2xl p-4 border border-emerald-100/80 space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-[10px]">
            N
          </span>
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <span>네이버 블로그 실시간 방문 후기</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          </h3>
        </div>

        {naverSearchUrl && (
          <a
            href={naverSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
          >
            네이버에서 더보기
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-6 flex items-center justify-center text-xs text-emerald-700 gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          <span>네이버 최신 블로그 글 수집중...</span>
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-xs text-gray-500 py-3 text-center">등록된 블로그 후기가 없습니다.</p>
      ) : (
        /* Reviews List */
        <div className="space-y-2.5">
          {reviews.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white p-3 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-600 line-clamp-1 transition">
                  {item.title}
                </h4>
                <span className="text-[10px] text-gray-400 shrink-0">{item.postDate}</span>
              </div>
              <p className="text-[11px] text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                {item.description}
              </p>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50 text-[10px] text-gray-400">
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {item.bloggerName}
                </span>
                <span className="text-emerald-600 font-semibold flex items-center gap-0.5 group-hover:underline">
                  원문보기
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
