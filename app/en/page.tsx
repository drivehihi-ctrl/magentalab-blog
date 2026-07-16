import Image from "next/image";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { getPosts } from "@/lib/wp";
import { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Magentalab Pet Research Institute | Home",
  description: "Check out the latest research findings and pet health tips from Magentalab Pet Research Institute.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/",
    languages: {
      ko: "https://www.magentalabblog.com/",
      en: "https://www.magentalabblog.com/en/",
      ja: "https://www.magentalabblog.com/ja/",
    },
  },
  openGraph: {
    title: "Magentalab Pet Research Institute | Home",
    description: "We study a better life for pets through data and science.",
    url: "https://www.magentalabblog.com/en/",
    type: "website",
    images: [{ url: "/images/favicon.png", width: 1200, height: 630 }],
  },
};

export default async function EnglishHomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  
  // Fetch posts with English language option
  const { posts, totalPages } = await getPosts(currentPage, 20, undefined, undefined, "en");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.magentalabblog.com/en"
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
          "url": "https://www.magentalabblog.com/en/",
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
                  alt="Ansim, Lead Researcher"
                  fill
                  className="object-contain relative z-10"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Hero Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                Latest Research & Smart Tools
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
                Science-Backed <br /> 
                <span className="text-magenta">Insights</span> for a <br />
                Healthier Pet Future.
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-gray-500 leading-relaxed font-normal">
                Discover evidence-based veterinary research <br />
                and daily care guides from Magentalab Pet Research Institute.
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
            <p className="text-gray-400">No articles registered yet.</p>
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
