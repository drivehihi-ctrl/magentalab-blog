import Image from "next/image";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { getPosts, getFeaturedImage, getPostViews } from "@/lib/wp";
import { sanitizeForSeo } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { Flame, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import DraggableScrollContainer from "@/components/DraggableScrollContainer";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Magentalab 반려동물 연구소 | 홈",
  description: "Magentalab 반려동물 연구소의 최신 연구 결과와 반려동물 건강 정보를 확인하세요.",
  alternates: {
    canonical: "https://www.magentalabblog.com/",
    languages: {
      ko: "https://www.magentalabblog.com/",
      en: "https://www.magentalabblog.com/en/",
      ja: "https://www.magentalabblog.com/ja/",
    },
  },
  openGraph: {
    title: "Magentalab 반려동물 연구소 | 홈",
    description: "데이터와 과학으로 반려동물의 더 나은 삶을 연구합니다.",
    url: "https://www.magentalabblog.com/",
    type: "website",
    images: [{ url: "/images/favicon.png", width: 1200, height: 630 }],
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const { posts, totalPages } = await getPosts(currentPage, 20);

  // 🌟 "지금 뜨고 있는 글" (Trending Posts) - Sort strictly by View Count!
  const trendingPosts = [...posts]
    .sort((a, b) => getPostViews(b) - getPostViews(a))
    .slice(0, 3);

  // Remove trending posts from main grid only on page 1 for variety
  const trendingIds = new Set(trendingPosts.map((p) => p.id));
  const remainingPosts = currentPage === 1 ? posts.filter((p) => !trendingIds.has(p.id)) : posts;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "홈", item: "https://www.magentalabblog.com" }],
  };

  return (
    <div className="pb-20">
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://www.magentalabblog.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.magentalabblog.com/blog?search={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* ═══════════════════════════════
          HERO SECTION — Soft Cream & Warm Accent
      ═══════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #faf6f0 0%, #ffffff 60%, #FFEBFA 100%)",
        }}
      >
        {/* Top border stripe */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#E5007E] via-amber-400 to-[#E5007E]" />

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E5007E]/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[340px] h-[340px] bg-amber-400/10 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className="container relative mx-auto px-4 sm:px-6 py-14 lg:py-24 max-w-6xl">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-12">

            {/* Character Image */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-center order-first lg:order-last">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-[420px] lg:h-[420px]"
                style={{ animation: "float 6s ease-in-out infinite" }}>
                <div className="absolute inset-0 bg-[#E5007E]/10 rounded-full blur-3xl transform scale-90" />
                <Image
                  src="/images/ansimi-researcher2.png"
                  alt="수석 연구원 안심이"
                  fill
                  className="object-contain relative z-10"
                  priority
                />
              </div>
            </div>

            {/* Hero Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-amber-100/80 border border-amber-300/60 text-[#88004e] text-[11px] font-extrabold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#E5007E] animate-pulse" />
                <span>Magentalab Pet Health Lab</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a2e] tracking-tight mb-5 leading-[1.14]">
                반려동물을 위한 <br />
                <span className="text-[#E5007E]">더 나은 미래</span>를 <br className="hidden lg:block" />
                연구합니다.
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-gray-600 leading-relaxed font-normal mb-7">
                Magentalab 반려동물 연구소의 최신 연구 결과와 <br className="hidden md:block" />
                생활 속 건강 팁을 블로그에서 만나보세요.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E5007E] to-[#c0006a] text-white font-bold text-sm rounded-full shadow-lg shadow-[#E5007E]/25 hover:shadow-xl hover:opacity-95 transition-all"
                >
                  블로그 글 보러가기 →
                </a>
                <a
                  href="/map"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-100/90 text-amber-950 font-bold text-sm rounded-full hover:bg-amber-200 border border-amber-300/50 transition-all shadow-xs"
                >
                  🐾 펫 맵 탐색하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════
          🔥 지금 뜨고 있는 글 (TRENDING POSTS - SORTED BY VIEWS) SECTION
      ═════════════════════════════ */}
      {currentPage === 1 && trendingPosts.length > 0 && (
        <section className="bg-gradient-to-b from-[#faf6f0] to-white py-12 border-y border-amber-900/10">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-500/10 border border-rose-400/30 flex items-center justify-center text-rose-600">
                  <Flame className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black text-rose-600 tracking-widest uppercase bg-rose-100 px-2 py-0.5 rounded-full inline-block">
                      실시간 조회수 기준 📊
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a1a2e] tracking-tight">
                    지금 뜨고 있는 글 🔥
                  </h2>
                </div>
              </div>
              <Link
                href="/blog"
                className="text-xs font-extrabold text-[#E5007E] hover:text-[#c0006a] flex items-center gap-1 bg-magenta-light/50 px-3 py-1.5 rounded-full border border-[#E5007E]/20 transition"
              >
                <span>인기글 더보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Trending Cards Grid (PC Mouse Drag & Left/Right Arrows + Mobile Touch Carousel) */}
            <DraggableScrollContainer className="-mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3">
              {trendingPosts.map((post, idx) => {
                const imgUrl = getFeaturedImage(post);
                const titleText = sanitizeForSeo(post.title.rendered);
                const views = getPostViews(post);
                const viewsFormatted = views.toLocaleString();
                const dateStr = new Date(post.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return (
                  <div
                    key={post.id}
                    className="shrink-0 min-w-[280px] w-[82vw] max-w-[340px] sm:w-auto snap-center bg-white rounded-3xl p-5 border border-rose-100 shadow-md hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
                  >
                    {/* Popular Badge Rank & View Count */}
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs">
                        TOP {idx + 1}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Post Thumbnail */}
                      <div className="w-full h-40 rounded-2xl overflow-hidden relative bg-gray-100">
                        <Image
                          src={imgUrl}
                          alt={titleText}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>실시간 트렌드 포스트</span>
                        </span>
                        <h3
                          className="text-base font-extrabold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#E5007E] transition-colors"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                        <div
                          className="text-xs text-gray-500 line-clamp-2 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                        />
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span>{dateStr}</span>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-xs font-bold text-[#E5007E] group-hover:underline flex items-center gap-0.5"
                      >
                        <span>읽어보기</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </DraggableScrollContainer>
          </div>
        </section>
      )}

      {/* ═════════════════════════════
          ALL POSTS GRID SECTION
      ═════════════════════════════ */}
      <section className="container mx-auto px-4 sm:px-6 py-14">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <span className="text-[10px] font-extrabold text-[#E5007E] uppercase tracking-widest bg-magenta-light px-2.5 py-0.5 rounded-full inline-block mb-1">
              RESEARCH ARTICLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e] tracking-tight leading-tight">
              {currentPage === 1 ? "최신 연구 & 전체 블로그 글" : "전체 블로그 글"}
            </h2>
          </div>
          <a
            href="/blog"
            className="text-xs font-bold text-[#E5007E] hover:text-[#c0006a] border-b-2 border-[#E5007E]/30 hover:border-[#E5007E] pb-0.5 transition-all whitespace-nowrap"
          >
            카테고리별 전체보기 →
          </a>
        </div>

        {remainingPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#8888aa]">
              등록된 게시글이 없습니다.{currentPage > 1 && " 이전 페이지로 돌아가보세요."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {remainingPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="py-12">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        )}
      </section>
    </div>
  );
}
