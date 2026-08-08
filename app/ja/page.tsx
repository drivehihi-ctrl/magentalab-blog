import Image from "next/image";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { getPosts, getFeaturedImage, getPostViews } from "@/lib/wp";
import { sanitizeForSeo } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { Flame, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import DraggableScrollContainer from "@/components/DraggableScrollContainer";
import CategoryFilterGrid from "@/components/CategoryFilterGrid";
import DiagnosticCenterSection from "@/components/DiagnosticCenterSection";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Magentalab ペット研究所 | ホーム",
  description: "Magentalabペット研究所の最新の研究成果と、ペットの健康に役立つヒントをお届けします。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/",
    languages: {
      ko: "https://www.magentalabblog.com/",
      en: "https://www.magentalabblog.com/en/",
      ja: "https://www.magentalabblog.com/ja/",
    },
  },
  openGraph: {
    title: "Magentalab ペット研究所 | ホーム",
    description: "データと科学でペットのより良い生活を研究します。",
    url: "https://www.magentalabblog.com/ja/",
    type: "website",
    images: [{ url: "/images/favicon.png", width: 1200, height: 630 }],
  },
};

export default async function JapaneseHomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { posts: allPosts } = await getPosts(1, 500, undefined, undefined, "ja");

  // Trending Posts (TOP 1~3 sorted by views)
  const trendingPosts = [...allPosts]
    .sort((a, b) => getPostViews(b) - getPostViews(a))
    .slice(0, 3);

  const trendingIds = new Set(trendingPosts.map((p) => p.id));
  const remainingPosts = allPosts.filter((p) => !trendingIds.has(p.id));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: "https://www.magentalabblog.com/ja"
      }
    ]
  };

  return (
    <div className="pb-20">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://www.magentalabblog.com/ja/",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.magentalabblog.com/blog?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #faf6f0 0%, #ffffff 60%, #FFEBFA 100%)",
        }}
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-[#E5007E] via-amber-400 to-[#E5007E]" />
        
        <div className="container relative mx-auto px-4 sm:px-6 py-14 lg:py-24 max-w-6xl">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-12">
            {/* Character */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-center order-first lg:order-last">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-[420px] lg:h-[420px]" style={{ animation: "float 6s ease-in-out infinite" }}>
                <div className="absolute inset-0 bg-[#E5007E]/10 rounded-full blur-3xl transform scale-90" />
                <Image
                  src="/images/ansimi-researcher2.png"
                  alt="主席研究員アンシム"
                  fill
                  className="object-contain relative z-10"
                  priority
                />
              </div>
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end text-center lg:text-left">
              <div className="w-full lg:max-w-[480px]">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-amber-100/80 border border-amber-300/60 text-[#88004e] text-[11px] font-extrabold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5007E] animate-pulse" />
                  <span>Magentalab ペット研究所</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a2e] tracking-tight mb-5 leading-[1.14]">
                  科学的エビデンスで<span className="whitespace-nowrap">築く</span> <br /> 
                  ペットの<span className="text-[#E5007E]">健康な未来</span>。
                </h1>
                <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-gray-600 leading-relaxed font-normal mb-7">
                  Magentalabペット研究所がお届けする、 <br className="hidden md:block" />
                  科学的根拠に基づいた獣医医学研究と日々のケアガイド。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DiagnosticCenterSection lang="ja" />

      {/* 🔥 TRENDING POSTS SECTION (JA) */}
      {trendingPosts.length > 0 && (
        <section className="bg-gradient-to-b from-[#faf6f0] to-white py-12 border-y border-amber-900/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-500/10 border border-rose-400/30 flex items-center justify-center text-rose-600">
                  <Flame className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-rose-600 tracking-widest uppercase bg-rose-100 px-2 py-0.5 rounded-full inline-block mb-0.5">
                    おすすめ記事 🌟
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a1a2e] tracking-tight">
                    注目の研究レポート 📌
                  </h2>
                </div>
              </div>
            </div>

            <DraggableScrollContainer className="-mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3">
              {trendingPosts.map((post, idx) => {
                const imgUrl = getFeaturedImage(post);
                const titleText = sanitizeForSeo(post.title.rendered);
                const dateStr = new Date(post.date).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <Link
                    key={post.id}
                    href={`/ja/posts/${post.slug}`}
                    className="shrink-0 min-w-[280px] w-[82vw] max-w-[340px] sm:w-auto snap-center bg-white rounded-3xl p-5 border border-rose-100 shadow-md hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group block cursor-pointer"
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs">
                        TOP {idx + 1}
                      </span>
                    </div>

                    <div className="space-y-3">
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
                          <span>人気ペット健康ガイド</span>
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

                    <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span>{dateStr}</span>
                      <div className="text-xs font-bold text-[#E5007E] group-hover:underline flex items-center gap-0.5">
                        <span>続きを読む</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </DraggableScrollContainer>
          </div>
        </section>
      )}

      {/* ALL POSTS SECTION */}
      <section className="container mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <span className="text-[10px] font-extrabold text-[#E5007E] uppercase tracking-widest bg-magenta-light px-2.5 py-0.5 rounded-full inline-block mb-1">
              RESEARCH ARTICLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e] tracking-tight leading-tight">
              すべての記事
            </h2>
          </div>
        </div>

        <CategoryFilterGrid posts={allPosts} lang="ja" />
      </section>
    </div>
  );
}
