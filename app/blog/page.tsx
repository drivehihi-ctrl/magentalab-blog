import PostListItem from "@/components/PostListItem";
import Pagination from "@/components/Pagination";
import { getPosts } from "@/lib/wp";
import { Metadata } from "next";

// 1시간마다 데이터 갱신 (ISR)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "전체 글 목록 | Magentalab",
  description: "Magentalab 반려동물 연구소의 모든 연구 게시글과 블로그 포스트를 확인하세요.",
  alternates: {
    canonical: "https://www.magentalabblog.com/blog",
  },
  openGraph: {
    title: "전체 글 목록 | Magentalab",
    description: "Magentalab 반려동물 연구소의 모든 연구 게시글과 블로그 포스트를 확인하세요.",
    url: "https://www.magentalabblog.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "전체 글 목록 | Magentalab",
    description: "Magentalab 반려동물 연구소의 모든 연구 게시글과 블로그 포스트를 확인하세요.",
  },
};

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string, search?: string }>;
}) {
  const { page, search } = await searchParams;
  const currentPage = Number(page) || 1;
  const { posts, totalPages, totalPosts } = await getPosts(currentPage, 20, search);

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
        "name": search ? `검색: ${search}` : "블로그",
        "item": search 
          ? `https://www.magentalabblog.com/blog?search=${encodeURIComponent(search)}`
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
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest">
            ALL POSTS
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            {search ? (
              <>
                <span className="text-magenta">'{search}'</span> 검색 결과
              </>
            ) : (
              <>
                블로그 <span className="text-magenta">전체보기</span>
              </>
            )}
          </h1>
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
