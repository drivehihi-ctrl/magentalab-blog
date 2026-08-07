'use client';

import React, { useState, useMemo } from 'react';
import PostCard from '@/components/PostCard';
import { WPPost, getCategories, getTags } from '@/lib/wp';
import { Sparkles, Layers } from 'lucide-react';

interface CategoryFilterGridProps {
  posts: WPPost[];
  lang?: 'ko' | 'en' | 'ja';
}

type CategoryKey = 'all' | 'behavior' | 'health' | 'nutrition' | 'cat';

export default function CategoryFilterGrid({ posts, lang = 'ko' }: CategoryFilterGridProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');

  // Multi-language Tab Labels
  const tabConfig: Record<CategoryKey, { label: string; icon: string }> = useMemo(() => {
    if (lang === 'en') {
      return {
        all: { label: '✨ All Research', icon: '✨' },
        behavior: { label: '🐾 Behavior & Training', icon: '🐾' },
        health: { label: '🩺 Health & Care', icon: '🩺' },
        nutrition: { label: '🥗 Nutrition & Food', icon: '🥗' },
        cat: { label: '🐱 Cat Care', icon: '🐱' },
      };
    }
    if (lang === 'ja') {
      return {
        all: { label: '✨ すべて', icon: '✨' },
        behavior: { label: '🐾 行動・しつけ', icon: '🐾' },
        health: { label: '🩺 病気・健康', icon: '🩺' },
        nutrition: { label: '🥗 栄養・フード', icon: '🥗' },
        cat: { label: '🐱 猫専用ガイド', icon: '🐱' },
      };
    }
    return {
      all: { label: '✨ 전체보기', icon: '✨' },
      behavior: { label: '🐾 행동 & 훈련', icon: '🐾' },
      health: { label: '🩺 질병 & 건강', icon: '🩺' },
      nutrition: { label: '🥗 영양 & 사료', icon: '🥗' },
      cat: { label: '🐱 고양이 전용', icon: '🐱' },
    };
  }, [lang]);

  // Keyword matching helper
  const matchesCategory = (post: WPPost, key: CategoryKey): boolean => {
    if (key === 'all') return true;

    const cats = getCategories(post).map((c) => c.name.toLowerCase());
    const tags = getTags(post).map((t) => t.name.toLowerCase());
    const title = (post.title?.rendered || '').toLowerCase();
    const slug = (post.slug || '').toLowerCase();

    const isMatchText = (keywords: string[]) =>
      keywords.some(
        (kw) =>
          cats.some((c) => c.includes(kw)) ||
          tags.some((t) => t.includes(kw)) ||
          title.includes(kw) ||
          slug.includes(kw)
      );

    switch (key) {
      case 'behavior':
        return isMatchText([
          '행동', '훈련', '습성', '카밍', '소리', '언어', '배방구',
          'behavior', 'training', 'sigh', 'bark', 'wag', 'tail', 'belly',
          '行動', 'しつけ', '鳴き声',
        ]);

      case 'health':
        return isMatchText([
          '건강', '질병', '증상', '슬개골', '신장', '역재채기', '피부', '체중', '보험', '응급',
          'health', 'disease', 'symptom', 'patella', 'skin', 'weight', 'insurance', 'emergency',
          '健康', '病気', '症状', '保険',
        ]);

      case 'nutrition':
        return isMatchText([
          '영양', '사료', '음식', '간식', '독성', '초콜릿', '체중', '식단',
          'food', 'nutrition', 'diet', 'toxic', 'chocolate', 'treat',
          'フード', '栄養', '毒性', '食事',
        ]);

      case 'cat':
        return isMatchText([
          '고양이', '신생묘', '인큐베이터', '캣타워', '길막',
          'cat', 'kitten', 'feline', 'tower',
          '猫', '子猫',
        ]);

      default:
        return true;
    }
  };

  // Filtered post list & category count map
  const { filteredPosts, categoryCounts } = useMemo(() => {
    const counts: Record<CategoryKey, number> = {
      all: posts.length,
      behavior: 0,
      health: 0,
      nutrition: 0,
      cat: 0,
    };

    posts.forEach((post) => {
      if (matchesCategory(post, 'behavior')) counts.behavior++;
      if (matchesCategory(post, 'health')) counts.health++;
      if (matchesCategory(post, 'nutrition')) counts.nutrition++;
      if (matchesCategory(post, 'cat')) counts.cat++;
    });

    const filtered = posts.filter((post) => matchesCategory(post, activeCategory));

    return { filteredPosts: filtered, categoryCounts: counts };
  }, [posts, activeCategory]);

  return (
    <div className="w-full my-8 space-y-6">
      {/* 🌟 Category Filter Pills Bar (Clean, Spacious, Zero Overlap) */}
      <div className="relative z-10 w-full bg-white rounded-3xl p-3 sm:p-4 border border-rose-100 shadow-sm">
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

        {/* Scrollable Pills Row (Mobile Scroll + Desktop Centered Wrap) */}
        <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-none sm:flex-wrap sm:justify-start">
          {(Object.keys(tabConfig) as CategoryKey[]).map((key) => {
            const isActive = activeCategory === key;
            const count = categoryCounts[key];
            const { label } = tabConfig[key];

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveCategory(key)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
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
              ? '該当する記事가 아직 없습니다.'
              : '해당 주제의 연구 리포트가 아직 준비 중입니다.'}
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className="inline-block mt-2 px-5 py-2 bg-[#E5007E] text-white text-xs font-bold rounded-full shadow-sm hover:bg-[#c0006a] transition"
          >
            {lang === 'en' ? 'View All Articles' : lang === 'ja' ? 'すべての記事を見る' : '전체 글 보기'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
