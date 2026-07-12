import Link from "next/link";
import Image from "next/image";
import { WPPost, getFeaturedImage, getCategories } from "@/lib/wp";
import { sanitizeForSeo } from "@/lib/utils";

interface RelatedPostsProps {
  posts: WPPost[];
  lang?: "ko" | "en" | "ja";
}

export default function RelatedPosts({ posts, lang = "ko" }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  const titles = {
    ko: (
      <>
        함께 읽으면 더 좋은 <span className="text-magenta">연구 데이터</span> 🕸️
      </>
    ),
    en: (
      <>
        Recommended <span className="text-magenta">Research Data</span> 🕸️
      </>
    ),
    ja: (
      <>
        あわせて読みたい<span className="text-magenta">研究データ</span> 🕸️
      </>
    ),
  };

  const getCategoryFallback = (langCode: string) => {
    if (langCode === "ja") return "研究";
    if (langCode === "en") return "Research";
    return "연구";
  };

  return (
    <div className="mt-20 pt-12 border-t border-gray-100">
      <h3 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">
        {titles[lang] || titles.ko}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => {
          const imageUrl = getFeaturedImage(post);
          const categories = getCategories(post);
          const sanitizedTitle = sanitizeForSeo(post.title.rendered);
          
          const href = lang === "ja" 
            ? `/ja/posts/${post.slug}` 
            : lang === "en" 
              ? `/en/posts/${post.slug}` 
              : `/posts/${post.slug}`;

          return (
            <Link 
              key={post.id} 
              href={href} 
              className="group block"
            >
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                <Image
                  src={imageUrl}
                  alt={sanitizedTitle}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="px-1">
                <span className="text-[10px] font-bold text-magenta uppercase tracking-widest mb-2 block">
                  {categories[0]?.name || getCategoryFallback(lang)}
                </span>
                <h4 
                  className="text-base font-bold text-gray-900 leading-snug group-hover:text-magenta transition-colors line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
