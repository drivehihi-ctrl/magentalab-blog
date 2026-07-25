import Image from "next/image";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { getPosts } from "@/lib/wp";
import { Metadata } from "next";

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
          HERO SECTION — Hani-inspired
      ═══════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f9f5f0 0%, #fff 55%, #FFEBFA 100%)",
        }}
      >
        {/* Decorative accent top border */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#E5007E] via-[#c9a64c] to-[#E5007E]" />

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E5007E]/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[340px] h-[340px] bg-[#c9a64c]/8 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className="container relative mx-auto px-4 sm:px-6 py-16 lg:py-28">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">

            {/* Right Column → mobile: top, desktop: right */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-first lg:order-last">
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

            {/* Left Column → Hero Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              {/* Section label (Hani-inspired) */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-[#1a1a2e] text-[#c9a64c] text-[11px] font-extrabold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5007E] animate-pulse shrink-0" />
                Latest Research & Blog
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a2e] tracking-tight mb-6 leading-[1.12]">
                반려동물을 위한{" "}
                <br />
                <span className="text-[#E5007E]">더 나은 미래</span>를{" "}
                <br className="hidden lg:block" />
                연구합니다.
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-lg text-[#4a4a6a] leading-relaxed font-normal mb-8">
                Magentalab 반려동물 연구소의 최신 연구 결과와{" "}
                <br className="hidden md:block" />
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a2e] text-white font-bold text-sm rounded-full hover:bg-[#252542] transition-all shadow-md"
                >
                  🐾 펫 맵 탐색하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════
          DIVIDER STRIPE
      ═════════════════════════════ */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-[#e5e0d8] to-transparent" />

      {/* ═════════════════════════════
          POST GRID SECTION
      ═════════════════════════════ */}
      <section className="container mx-auto px-4 sm:px-6 py-14">
        {/* Section header (Hani-inspired) */}
        <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-3 rounded-full bg-[#1a1a2e] text-[#c9a64c] text-[10px] font-extrabold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5007E] animate-pulse shrink-0" />
              Research Articles
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e] tracking-tight leading-tight">
              최신 연구 & 블로그
            </h2>
          </div>
          <a
            href="/blog"
            className="text-sm font-bold text-[#E5007E] hover:text-[#c0006a] border-b-2 border-[#E5007E]/30 hover:border-[#E5007E] pb-0.5 transition-all whitespace-nowrap"
          >
            전체 글 보기 →
          </a>
        </div>

        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#8888aa]">
              등록된 게시글이 없습니다.{currentPage > 1 && " 이전 페이지로 돌아가보세요."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
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
