import PostListItem from "@/components/PostListItem";
import Pagination from "@/components/Pagination";
import { getPosts, getAllCategories } from "@/lib/wp";
import Link from "next/link";
import { decodeHtmlEntities } from "@/lib/utils";
import React from "react";

interface BlogListLayoutProps {
  page?: string;
  search?: string;
  categoryId?: string;
  tagId?: string;
  lang?: "ko" | "en" | "ja";
  titleNode?: React.ReactNode;
  badgeText?: string;
  breadcrumbItems?: { name: string; item?: string }[];
}

export default async function BlogListLayout({
  page,
  search,
  categoryId,
  tagId,
  lang = "ko",
  titleNode,
  badgeText,
  breadcrumbItems,
}: BlogListLayoutProps) {
  const currentPage = Number(page) || 1;
  const isEn = lang === "en";
  const isJa = lang === "ja";
  const basePath = isEn ? "/en/blog" : isJa ? "/ja/blog" : "/blog";

  // Fetch posts and categories with appropriate language
  const [{ posts, totalPages, totalPosts }, allCategories] = await Promise.all([
    getPosts(currentPage, 20, search, categoryId, lang, tagId),
    getAllCategories().catch(() => [])
  ]);

  const categories = allCategories.filter((cat: any) => {
    if (isEn) return /^[a-zA-Z0-9\s-]+$/.test(cat.name) || cat.slug.includes('-en');
    if (isJa) return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(cat.name) || cat.slug.includes('-ja');
    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(cat.name);
    return hasKorean || cat.slug === 'food-nutrition';
  });

  const currentCategory = categories.find((c) => c.id.toString() === categoryId);

  // Default Breadcrumb
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": isEn ? "Home" : isJa ? "ホーム" : "홈",
        "item": `https://www.magentalabblog.com${isEn ? '/en' : isJa ? '/ja' : ''}`
      },
      ...(breadcrumbItems || [
        {
          "@type": "ListItem",
          "position": 2,
          "name": search 
            ? `${isEn ? 'Search' : isJa ? '検索' : '검색'}: ${search}` 
            : currentCategory 
              ? `${isEn ? 'Category' : isJa ? 'カテゴリ' : '카테고리'}: ${decodeHtmlEntities(currentCategory.name)}` 
              : isEn ? "Blog" : isJa ? "ブログ" : "블로그",
          "item": search 
            ? `https://www.magentalabblog.com${basePath}?search=${encodeURIComponent(search)}`
            : categoryId
              ? `https://www.magentalabblog.com${basePath}?category=${categoryId}`
              : `https://www.magentalabblog.com${basePath}`
        }
      ]).map((bc, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "name": bc.name,
        ...(bc.item ? { "item": bc.item } : {})
      }))
    ]
  };

  const defaultTitleNode = search ? (
    <><span className="text-magenta">'{search}'</span> {isEn ? "Search Results" : isJa ? "検索結果" : "검색 결과"}</>
  ) : currentCategory ? (
    <><span className="text-magenta">{decodeHtmlEntities(currentCategory.name)}</span> {isEn ? "Research Articles" : isJa ? "研究データ" : "연구 데이터"}</>
  ) : (
    <>{isEn ? "All" : isJa ? "すべての" : "블로그"} <span className="text-magenta">{isEn ? "Articles" : isJa ? "記事" : "전체보기"}</span></>
  );

  return (
    <div className="pb-24">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      {/* Page Header */}
      <header className="relative pt-24 pb-20 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest animate-pulse">
            {badgeText || (currentCategory ? decodeHtmlEntities(currentCategory.name) : "ALL POSTS")}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-8">
            {titleNode || defaultTitleNode}
          </h1>

          {/* Category Pills */}
          {!tagId && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
              {/* All Posts Chip */}
              <Link
                href={search ? `${basePath}?search=${encodeURIComponent(search)}` : basePath}
                className={`px-4.5 py-2 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all active:scale-95 shadow-sm ${
                  !categoryId
                    ? "bg-magenta text-white shadow-magenta/10"
                    : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-105 hover:text-gray-750"
                }`}
              >
                {isEn ? "View All" : isJa ? "すべて見る" : "전체보기"}
              </Link>
              {/* Category Chips */}
              {categories.map((cat) => {
                const isSelected = categoryId === cat.id.toString();
                return (
                  <Link
                    key={cat.id}
                    href={
                      search 
                        ? `${basePath}?category=${cat.id}&search=${encodeURIComponent(search)}` 
                        : `${basePath}?category=${cat.id}`
                    }
                    className={`px-4.5 py-2 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all active:scale-95 shadow-sm ${
                      isSelected
                        ? "bg-magenta text-white shadow-magenta/10"
                        : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-105 hover:text-gray-750"
                    }`}
                  >
                    {decodeHtmlEntities(cat.name)} ({cat.count})
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-magenta/5 rounded-l-full blur-3xl opacity-30 transform translate-x-1/2" />
      </header>

      {/* Post List Section */}
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} lang={lang} />
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-medium font-sans">
              {isEn 
                ? "No research articles found. 📝" 
                : isJa 
                ? "該当する記事が見つかりません。 📝" 
                : "등록된 게시글이 없습니다. 📝"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-8">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        )}
      </section>
      
      {/* Stats footer */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="py-12 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400 font-sans">
            {isEn ? (
              <>Total <span className="text-magenta font-bold">{totalPosts}</span> research articles published.</>
            ) : isJa ? (
              <>全 <span className="text-magenta font-bold">{totalPosts}</span> 件の研究データが公開されています。</>
            ) : (
              <>총 <span className="text-magenta font-bold">{totalPosts}</span>개의 연구 데이터가 기록되어 있습니다.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
