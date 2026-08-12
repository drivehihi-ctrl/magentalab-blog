import Image from "next/image";
import { Metadata } from "next";
import { getPost, getPostBySlug, getPosts, getFeaturedImage, getCategories, getTags, getRelatedPosts, fixWpLinks } from "@/lib/wp";
import { sanitizeForSeo, decodeHtmlEntities, cleanContentReferences } from "@/lib/utils";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import CommentsSection from "@/components/CommentsSection";
import RelatedPosts from "@/components/RelatedPosts";
import AnsimiSummary from "@/components/AnsimiSummary";
import SocialShare from "@/components/SocialShare";
import VeterinaryReferencesSection from "@/components/VeterinaryReferencesSection";
import CalculatorBanner from "@/components/CalculatorBanner";
import { evidenceRepository } from "@/lib/repositories";

export const revalidate = 86400;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const isNumeric = /^\d+$/.test(id);
    let post;
    if (isNumeric) {
      post = await getPost(id);
    } else {
      post = await getPostBySlug(id);
    }
    if (!post) throw new Error("Post not found");
    
    // Prevent metadata generation for non-Japanese posts under /ja path
    if (post.slug && !post.slug.endsWith("-ja")) {
      throw new Error("Not a Japanese post");
    }
    
    const imageUrl = getFeaturedImage(post);
    const title = sanitizeForSeo(post.title.rendered);
    const description = sanitizeForSeo(post.excerpt.rendered, 160);

    const baseSlug = post.slug.replace(/-en$/, '').replace(/-ja$/, '');

    return {
      title: `${title} | Magentalab`,
      description,
      alternates: {
        canonical: `https://www.magentalabblog.com/ja/posts/${post.slug}`,
        languages: {
          'ko-KR': `https://www.magentalabblog.com/posts/${baseSlug}`,
          'en-US': `https://www.magentalabblog.com/en/posts/${baseSlug}-en`,
          'ja-JP': `https://www.magentalabblog.com/ja/posts/${baseSlug}-ja`,
        },
      },
      openGraph: {
        title,
        description,
        type: "article",
        publishedTime: post.date,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Magentalab`,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: "Magentalab Blog Post",
    };
  }
}

export async function generateStaticParams() {
  try {
    const { posts } = await getPosts(1, 500, undefined, undefined, "ja");
    return posts.map((post) => ({
      id: post.slug,
    }));
  } catch (error) {
    return [];
  }
}

export default async function JapanesePostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const isNumeric = /^\d+$/.test(id);
  
  let post;
  let allPosts: any[] = [];
  let shouldRedirect = false;
  let targetSlug = "";

  try {
    if (isNumeric) {
      post = await getPost(id);
      if (post && post.slug && post.slug.endsWith("-ja")) {
        shouldRedirect = true;
        targetSlug = post.slug;
      }
    } else {
      // If it doesn't end with -ja, check if the -ja version exists
      if (!id.endsWith("-ja")) {
        try {
          const jaPost = await getPostBySlug(id + "-ja");
          if (jaPost) {
            shouldRedirect = true;
            targetSlug = jaPost.slug;
            post = jaPost;
          } else {
            post = await getPostBySlug(id); // fallback to KR post to know it exists
          }
        } catch (e) {
          post = await getPostBySlug(id);
        }
      } else {
        post = await getPostBySlug(id);
      }
    }
    
    // Fetch only Japanese posts for related recommendations
    const postsRes = await getPosts(1, 20, undefined, undefined, "ja");
    allPosts = postsRes.posts;
  } catch (error) {
    // If we completely fail, we'll let it be handled below
  }

  if (shouldRedirect && targetSlug) {
    permanentRedirect(`/ja/posts/${targetSlug}`);
  }

  // If post wasn't found but the URL had a -ja suffix, check if the Korean original exists
  let fallbackPost = post;
  if (!post && id.endsWith("-ja")) {
    const krSlug = id.replace(/-ja$/, "");
    try {
      fallbackPost = await getPostBySlug(krSlug);
    } catch (e) {
      // ignore
    }
  }

  if (!fallbackPost) notFound();

  // If the post is not a Japanese post (meaning the translation doesn't exist yet)
  if (fallbackPost.slug && !fallbackPost.slug.endsWith("-ja")) {
    permanentRedirect(`/posts/${fallbackPost.slug}`);
  }

  // From here on we know post exists and is a Japanese post
  post = fallbackPost;
  const relatedPosts = getRelatedPosts(post, allPosts, 3);
  let customEvidence = await evidenceRepository.getByPostId(post.id);
  
  if (!customEvidence) {
    const scriptMatch = post.content.rendered.match(/<script type="application\/json" id="custom-vet-references">([\s\S]*?)<\/script>/);
    if (scriptMatch) {
      try { customEvidence = JSON.parse(scriptMatch[1]); } catch(e) {}
    }
  }
  const imageUrl = getFeaturedImage(post);
  const categories = getCategories(post);
  const tags = getTags(post);
  const date = new Date(post.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": sanitizeForSeo(post.title.rendered),
    "image": [imageUrl],
    "datePublished": post.date,
    "dateModified": post.modified || post.date,
    "author": [{
      "@type": "Person",
      "name": "Magentalab Research Team",
      "url": "https://www.magentalabblog.com/about"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Magentalab ペット研究所",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.magentalabblog.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.magentalabblog.com/ja/posts/${post.slug}`
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "ホーム",
        "item": "https://www.magentalabblog.com/ja"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "ブログ",
        "item": "https://www.magentalabblog.com/ja"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": sanitizeForSeo(post.title.rendered),
        "item": `https://www.magentalabblog.com/ja/posts/${post.slug}`
      }
    ]
  };

  return (
    <article className="pb-24">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      {/* Post Header */}
      <header className="relative pt-16 pb-24 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link 
            href="/ja" 
            className="inline-flex items-center gap-2 mb-10 text-sm font-bold text-magenta uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            ホームに戻る
          </Link>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((cat) => (
              <span key={cat.id} className="px-4 py-1.5 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest">
                {decodeHtmlEntities(cat.name)}
              </span>
            ))}
          </div>
          
          <h1 
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-600 leading-[1.1] mb-8 tracking-tight underline decoration-blue-100 underline-offset-8"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          
          <div className="flex items-center gap-4 text-gray-500 font-medium">
            <div className="w-10 h-10 rounded-full bg-magenta/10 flex items-center justify-center text-magenta">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-900 font-bold">Magentalab Research Team</p>
              <p className="text-sm">{date}</p>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-magenta/5 rounded-l-full blur-3xl opacity-30 transform translate-x-1/2" />
      </header>

      {/* Featured Image */}
      <div className="container mx-auto px-4 -mt-16 sm:-mt-20 lg:-mt-24 mb-16 relative z-20">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-magenta/10 border-4 border-white">
          <Image
            src={imageUrl}
            alt={sanitizeForSeo(post.title.rendered) || "マゼンタラボペット研究アイキャッチ画像"}
            width={1200}
            height={675}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>

      {/* Post Content Body */}
      <section className="container mx-auto px-4 max-w-4xl -mt-12 relative z-20">
        <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-2xl shadow-gray-200/50 border border-gray-100">
          
          {/* GEO Optimized Summary Box */}
          <AnsimiSummary 
            excerpt={post.excerpt.rendered} 
            categoryNames={categories.map(c => c.name)} 
            lang="ja"
          />


          <div 
            className="wp-content prose prose-lg md:prose-xl prose-magenta max-w-none text-gray-700 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: fixWpLinks(cleanContentReferences(post.content.rendered), sanitizeForSeo(post.title.rendered), 'ja') }}
          />

          {/* Parse custom evidence from content if it exists */}
          <VeterinaryReferencesSection 
            categories={categories.map(c => c.name)} 
            title={post.title.rendered} 
            slug={post.slug} 
            lang="ja" 
            content={post.content.rendered}
            customEvidence={customEvidence || undefined}
          />

          {/* 2순위: CalculatorBanner (근거 박스 바로 아래 배치) */}
          <CalculatorBanner 
            content={post.content.rendered} 
            title={post.title.rendered} 
            postId={post.id.toString()}
            lang="ja"
          />
        
          {/* Social Share Section */}
          <SocialShare url={`/ja/posts/${post.slug}`} title={post.title.rendered.replace(/<[^>]*>?/gm, "")} lang="ja" />
          
          {/* Tags Section */}
          {tags && tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap gap-2 text-sm">
                {tags.map((tag: any) => (
                  <Link 
                    key={tag.id} 
                    href={`/ja?search=${encodeURIComponent(tag.name)}`}
                    className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg font-medium transition-colors hover:bg-magenta-light/20 hover:text-magenta"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <RelatedPosts posts={relatedPosts} lang="ja" />
          
          {/* Post Footer / CTA */}
          <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gray-900 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">共により健康な世界を作りましょう。</h3>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                パートナーシップの提案はいつでも歓迎します。
              </p>
              <div className="flex justify-center">
                <a 
                  href="mailto:smagentalab@gmail.com"
                  className="px-10 py-4 bg-magenta hover:bg-magenta/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-magenta/20"
                >
                  お問い合わせ
                </a>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-magenta/20 rounded-full blur-3xl" />
          </div>

          {/* Comments Section */}
          <CommentsSection postId={post.id} lang="ja" />
        </div>
      </section>
    </article>
  );
}
