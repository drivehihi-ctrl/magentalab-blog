'use client';

import React, { useState, useMemo } from 'react';
import PostCard from '@/components/PostCard';
import { WPPost, getCategories } from '@/lib/wp';
import { Sparkles, Layers, ChevronDown } from 'lucide-react';

interface CategoryFilterGridProps {
  posts: WPPost[];
  lang?: 'ko' | 'en' | 'ja';
}

type CategoryKey = 'all' | 'health' | 'behavior' | 'nutrition' | 'guide' | 'lifestyle' | 'breed';

const BATCH_SIZE = 18;

export default function CategoryFilterGrid({ posts, lang = 'ko' }: CategoryFilterGridProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);

  // Multi-language Tab Labels and corresponding WP Category Slugs/Names
  const tabConfig: Record<CategoryKey, { label: string; icon: string; matchers: (string | number)[] }> = useMemo(() => {
    if (lang === 'en') {
      return {
        all: { label: '✨ View All', icon: '✨', matchers: [] },
        health: { label: '🩺 Health & Disease', icon: '🩺', matchers: [1749, 'health-disease', 'health & disease'] },
        behavior: { label: '🐾 Behavior & Training', icon: '🐾', matchers: [1751, 'behavior-training', 'behavior & training'] },
        nutrition: { label: '🥗 Food & Nutrition', icon: '🥗', matchers: [1753, 'food-nutrition-en', 'food & nutrition'] },
        guide: { label: '🔰 Beginner Pet Parent Guide', icon: '🔰', matchers: [1757, 'beginner-pet-parent-guide'] },
        lifestyle: { label: '🏠 Lifestyle & Supplies', icon: '🏠', matchers: [1755, 'lifestyle-supplies'] },
        breed: { label: '🔬 Breed Analysis', icon: '🔬', matchers: [1759, 'in-depth-breed-analysis'] },
      };
    }
    if (lang === 'ja') {
      return {
        all: { label: '✨ すべて見る', icon: '✨', matchers: [] },
        health: { label: '🩺 健康・疾病', icon: '🩺', matchers: [1784, '健康・疾病', '健康'] },
        behavior: { label: '🐾 行動・しつけ', icon: '🐾', matchers: [1786, '行動・しつけ', '行動'] },
        nutrition: { label: '🥗 フード・栄養', icon: '🥗', matchers: [1788, 'フード・栄養', 'フード'] },
        guide: { label: '🔰 初めての飼い主さん', icon: '🔰', matchers: [1792, '初めての飼い主さんガイド'] },
        lifestyle: { label: '🏠 ライフスタイル・用品', icon: '🏠', matchers: [1790, 'ライフスタイル・用品'] },
        breed: { label: '🔬 犬種別徹底解析', icon: '🔬', matchers: [1794, '犬種別徹底解析'] },
      };
    }
    return {
      all: { label: '✨ 전체보기', icon: '✨', matchers: [] },
      health: { label: '🩺 건강/질병', icon: '🩺', matchers: [13, '건강-질병', '건강/질병'] },
      behavior: { label: '🐾 행동/훈련', icon: '🐾', matchers: [12, '행동-훈련', '행동/훈련'] },
      nutrition: { label: '🥗 푸드/영양', icon: '🥗', matchers: [2, 'food-nutrition', '푸드/영양'] },
      guide: { label: '🔰 초보 집사 가이드', icon: '🔰', matchers: [10, '초보-집사-가이드', '초보 집사 가이드'] },
      lifestyle: { label: '🏠 생활/용품', icon: '🏠', matchers: [11, '생활-용품', '생활/용품'] },
      breed: { label: '🔬 품종별 정밀 분석', icon: '🔬', matchers: [319, '품종별-정밀-분석-breed-archive', '품종별 정밀 분석'] },
    };
  }, [lang]);

  // Strict category matching using official WP post category IDs/slugs/names
  const matchesCategory = (post: WPPost, key: CategoryKey): boolean => {
    if (key === 'all') return true;

    const postCats = getCategories(post);
    const matchers = tabConfig[key].matchers;

    return postCats.some((c) =>
      matchers.some((m) =>
        typeof m === 'number'
          ? c.id === m
          : (c.slug && c.slug.toLowerCase().includes(m.toString().toLowerCase())) ||
            (c.name && c.name.toLowerCase().includes(m.toString().toLowerCase()))
      )
    );
  };

  // Filtered post list & category count map
  const { filteredPosts, categoryCounts } = useMemo(() => {
    const counts: Record<CategoryKey, number> = {
      all: posts.length,
      health: 0,
      behavior: 0,
      nutrition: 0,
      guide: 0,
      lifestyle: 0,
      breed: 0,
    };

    posts.forEach((post) => {
      (Object.keys(tabConfig) as CategoryKey[]).forEach((key) => {
        if (key !== 'all' && matchesCategory(post, key)) {
          counts[key]++;
        }
      });
    });

    const filtered = posts.filter((post) => matchesCategory(post, activeCategory));

    return { filteredPosts: filtered, categoryCounts: counts };
  }, [posts, activeCategory, tabConfig]);

  const handleCategoryChange = (key: CategoryKey) => {
    setActiveCategory(key);
    setVisibleCount(BATCH_SIZE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const remainingCount = filteredPosts.length - displayedPosts.length;

  return (
    <div className="w-full my-8 space-y-6">
      {/* 🌟 Category Filter Pills Bar (Clean, Mobile Smooth Scroll, 0 Overlap) */}
      <div className="relative z-10 w-full bg-white rounded-3xl p-3 sm:p-5 border border-rose-100 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-3 px-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#E5007E]" />
            <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 tracking-tight">
              {lang === 'en'
                ? 'Filter by Topic'
                : lang === 'ja'
                ? 'テーマ別フィルター'
                : '주제별 연구 데이터 큐레이션'}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-gray-400">
            {lang === 'en'
              ? `Total ${filteredPosts.length} articles`
              : lang === 'ja'
              ? `全 ${filteredPosts.length} 件`
              : `총 ${filteredPosts.length}개의 리포트`}
          </span>
        </div>

        {/* Scrollable Pills Row (Mobile Smooth Horizontal Touch Scroll) */}
        <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-none sm:flex-wrap sm:justify-start">
          {(Object.keys(tabConfig) as CategoryKey[]).map((key) => {
            const isActive = activeCategory === key;
            const count = categoryCounts[key];
            const { label } = tabConfig[key];

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleCategoryChange(key)}
                className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E5007E] to-[#c0006a] text-white shadow-md shadow-[#E5007E]/20 scale-[1.02]'
                    : 'bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-[#E5007E] border border-gray-100'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200/70 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📚 Filtered Article Grid */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
          <p className="text-gray-500 text-sm font-medium">
            {lang === 'en'
              ? 'No articles match this category yet.'
              : lang === 'ja'
              ? '該当する記事がまだありません。'
              : '해당 카테고리의 연구 데이터가 아직 준비 중입니다.'}
          </p>
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className="inline-block mt-2 px-5 py-2 bg-[#E5007E] text-white text-xs font-bold rounded-full shadow-sm hover:bg-[#c0006a] transition"
          >
            {lang === 'en' ? 'View All Articles' : lang === 'ja' ? 'すべての記事を見る' : '전체 글 보기'}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load More Button (0ms in-place expansion) */}
          {remainingCount > 0 && (
            <div className="pt-8 text-center">
              <button
                type="button"
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-rose-50 text-[#E5007E] font-extrabold text-xs sm:text-sm rounded-full border border-rose-200 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group active:scale-95"
              >
                <span>
                  {lang === 'en'
                    ? `Load More Articles (+${remainingCount})`
                    : lang === 'ja'
                    ? `もっと見る (+${remainingCount}件)`
                    : `관련 연구 데이터 더보기 (+${remainingCount}개)`}
                </span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
