import PostListItem from "@/components/PostListItem";
import Pagination from "@/components/Pagination";
import { getPosts, getAllCategories } from "@/lib/wp";
import { Metadata } from "next";
import Link from "next/link";

// 1시간마다 데이터 갱신 (ISR)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "전체 글 목록 | Magentalab",
  description: "Magentalab 반려동물 연구소의 모든 연구 게시글 and 블로그 포스트를 확인하세요.",
  alternates: {
    canonical: "https://www.magentalabblog.com/blog",
  },
  openGraph: {
    title: "전체 글 목록 | Magentalab",
    description: "Magentalab 반려동물 연구소의 모든 연구 게시글 and 블로그 포스트를 확인하세요.",
    url: "https://www.magentalabblog.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "전체 글 목록 | Magentalab",
    description: "Magentalab 반려동물 연구소의 모든 연구 게시글 and 블로그 포스트를 확인하세요.",
  },
};

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string, search?: string, category?: string }>;
}) {
  const { page, search, category } = await searchParams;
  const currentPage = Number(page) || 1;

  // 병렬로 포스트와 전체 카테고리 가져오기
  const [{ posts, totalPages, totalPosts }, categories] = await Promise.all([
    getPosts(currentPage, 20, search, category),
    getAllCategories().catch(() => [])
  ]);

  const currentCategory = categories.find((c) => c.id.toString() === category);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://www.magentalabblog.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": search ? `검색: ${search}` : currentCategory ? `카테고리: ${currentCategory.name}` : "블로그",
        "item": search 
          ? `https://www.magentalabblog.com/blog?search=${encodeURIComponent(search)}`
          : category
            ? `https://www.magentalabblog.com/blog?category=${category}`
            : "https://www.magentalabblog.com/blog"
      }
    ]
  };

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
            {currentCategory ? currentCategory.name : "ALL POSTS"}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-8">
            {search ? (
              <>
                <span className="text-magenta">'{search}'</span> 검색 결과
              </>
            ) : currentCategory ? (
              <>
                <span className="text-magenta">{currentCategory.name}</span> 연구 데이터
              </>
            ) : (
              <>
                블로그 <span className="text-magenta">전체보기</span>
              </>
            )}
          </h1>

          {/* 카테고리 필터 칩 영역 (반응형 가로 스크롤) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
            {/* 전체보기 칩 */}
            <Link
              href={search ? `/blog?search=${encodeURIComponent(search)}` : "/blog"}
              className={`px-4.5 py-2 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all active:scale-95 shadow-sm ${
                !category
                  ? "bg-magenta text-white shadow-magenta/10"
                  : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-105 hover:text-gray-750"
              }`}
            >
              전체보기
            </Link>
            {/* 개별 카테고리 칩 */}
            {categories.map((cat) => {
              const isSelected = category === cat.id.toString();
              return (
                <Link
                  key={cat.id}
                  href={
                    search 
                      ? `/blog?category=${cat.id}&search=${encodeURIComponent(search)}` 
                      : `/blog?category=${cat.id}`
                  }
                  className={`px-4.5 py-2 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all active:scale-95 shadow-sm ${
                    isSelected
                      ? "bg-magenta text-white shadow-magenta/10"
                      : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-105 hover:text-gray-750"
                  }`}
                >
                  {cat.name} ({cat.count})
                </Link>
              );
            })}
          </div>

        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-magenta/5 rounded-l-full blur-3xl opacity-30 transform translate-x-1/2" />
      </header>

      {/* Post List Section */}
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-medium font-sans">
              {search ? `'${search}'에 대한 검색 결과가 없습니다. 🔍` : "등록된 게시글이 없습니다. 📝"}
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
      
      {/* Simple Stats or Message */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="py-12 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400 font-sans">
            총 <span className="text-magenta font-bold">{totalPosts}</span>개의 연구 데이터가 기록되어 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
