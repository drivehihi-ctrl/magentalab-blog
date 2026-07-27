'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { BookOpen, ArrowRight, ExternalLink } from 'lucide-react';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  date: string;
}

// 나중에 관련 글이 더 생기면 여기 키워드만 바꾸면 됩니다
const KEYWORDS = ['펫티켓의 정석', 'slug:dog-friendly-petiquette-guide', '여행', '애견카페', '초콜릿'];

export default function MapBlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        // searchPosts returns WPPost[] directly (not wrapped in {results:...})
        const results = await Promise.all(
          KEYWORDS.map((kw) =>
            fetch(`/api/search?q=${encodeURIComponent(kw)}&lang=ko`)
              .then((r) => r.json())
              .then((d) => (Array.isArray(d) ? d : []))
              .catch(() => [])
          )
        );

        const seen = new Set<number>();
        const merged: BlogPost[] = [];

        results.flat().forEach((p: any) => {
          if (!seen.has(p.id)) {
            seen.add(p.id);
            const raw = p.excerpt?.rendered || '';
            const excerpt = raw.replace(/<[^>]+>/g, '').replace(/\[&hellip;\]/g, '...').trim();
            const image = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
            merged.push({
              id: p.id,
              slug: p.slug,
              title: p.title?.rendered || '',
              excerpt: excerpt.slice(0, 80) + (excerpt.length > 80 ? '...' : ''),
              imageUrl: image,
              date: p.date
                ? new Date(p.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
                : '',
            });
          }
        });

        setPosts(merged.slice(0, 6));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-pink-100 animate-pulse" />
          <div className="h-4 w-40 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
              <div className="h-24 bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#E5007E]" />
            마젠타랩 반려동물 블로그
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">여행 · 애견카페 · 주의 식품 관련 글 모음</p>
        </div>
        <a
          href="https://www.magentalabblog.com/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-[#E5007E] hover:underline"
        >
          전체 보기
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* 2-col grid on mobile, 3-col on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {posts.map((post) => (
          <a
            key={post.id}
            href={`https://www.magentalabblog.com/posts/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-[#E5007E]/20 transition-all bg-white"
          >
            {/* Thumbnail */}
            <div className="relative h-28 bg-gray-100 overflow-hidden">
              {post.imageUrl ? (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 33vw"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-pink-50 to-pink-100">
                  🐾
                </div>
              )}
              <span className="absolute bottom-2 right-2 text-[10px] font-semibold bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                {post.date}
              </span>
            </div>

            {/* Content */}
            <div className="p-3 flex-1 space-y-1">
              <h3
                className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-[#E5007E] transition-colors"
                dangerouslySetInnerHTML={{ __html: post.title }}
              />
              <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="px-3 pb-3">
              <span className="text-[10px] font-semibold text-[#E5007E] flex items-center gap-0.5">
                자세히 보기 <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
