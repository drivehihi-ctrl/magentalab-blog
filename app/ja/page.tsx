import Image from "next/image";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { getPosts } from "@/lib/wp";
import { Metadata } from "next";

export const revalidate = 3600;

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
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  
  // Fetch posts with Japanese language option
  const { posts, totalPages } = await getPosts(currentPage, 20, undefined, undefined, "ja");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "ホーム",
        "item": "https://www.magentalabblog.com/ja"
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "url": "https://www.magentalabblog.com/ja/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.magentalabblog.com/blog?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }) }}
      />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-white overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-magenta/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-magenta/5 rounded-full blur-3xl opacity-50" />
        
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Column: Ansim-i Character */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[450px] animate-float">
                <div className="absolute inset-0 bg-magenta/10 rounded-full blur-3xl transform scale-90" />
                <Image
                  src="/images/ansimi-researcher2.png"
                  alt="主席研究員アンシム"
                  fill
                  className="object-contain relative z-10"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Hero Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                Latest Research & Blog
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
                ペットのための <br /> 
                <span className="text-magenta">より良い未来</span>を <br />
                研究します。
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-gray-500 leading-relaxed font-normal">
                Magentalabペット研究所の最新の研究結果と <br />
                生活に役立つ健康の秘訣をご紹介します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Post Grid */}
      <section className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400">登録された記事がありません。</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-12">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        )}
      </section>
    </div>
  );
}
