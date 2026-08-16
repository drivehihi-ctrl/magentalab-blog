import Image from "next/image";
import { Metadata } from "next";
import { getPost, getFeaturedImage, getCategories, getTags, fixWpLinks } from "@/lib/wp";
import { sanitizeForSeo, decodeHtmlEntities, cleanContentReferences } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRevision } from "@/lib/ai-revisions";
import AnsimiSummary from "@/components/AnsimiSummary";
import VeterinaryReferencesSection from "@/components/VeterinaryReferencesSection";

export const revalidate = 0; // Previews should never be cached

interface PageProps {
  params: Promise<{ revision_id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AI Content Preview | Magentalab",
    robots: "noindex, nofollow" // Protect from indexing
  };
}

export default async function PreviewPage({ params }: PageProps) {
  const { revision_id } = await params;
  
  const revision = await getRevision(revision_id);
  if (!revision) {
    notFound();
  }

  // Fetch original post to get the uneditable fields like categories, tags, images
  const originalPost = await getPost(revision.wordpress_id.toString());
  if (!originalPost) {
    return <div>Original Post Not Found. Unable to render preview.</div>;
  }

  let imageUrl = getFeaturedImage(originalPost);
  
  if (revision.media_changes?.new_featured_media_id) {
    try {
      const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://magentalab.mycafe24.com";
      const mediaRes = await fetch(`${WP_URL}/wp-json/wp/v2/media/${revision.media_changes.new_featured_media_id}`);
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        if (mediaData.source_url) {
          imageUrl = mediaData.source_url;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch new featured media for preview", e);
    }
  }

  const categories = getCategories(originalPost);
  const tags = getTags(originalPost);
  const date = new Date(originalPost.date).toLocaleDateString(revision.language === 'en' ? 'en-US' : revision.language === 'ja' ? 'ja-JP' : "ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* AI Preview Admin Banner */}
      <div className="bg-yellow-400 text-black p-4 text-center sticky top-0 z-50 shadow-md font-bold flex justify-center items-center gap-4">
        ⚠️ AI 콘텐츠 미리보기 모드입니다. (Revision: {revision.revision_id})
        <span className="bg-black text-white px-3 py-1 rounded text-xs uppercase">{revision.status}</span>
      </div>

      <article className="pb-24 mt-4">
        <header className="relative pt-16 pb-24 bg-white border-b border-gray-100 overflow-hidden shadow-sm">
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((cat: any) => (
                <span key={cat.id} className="px-4 py-1.5 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest">
                  {decodeHtmlEntities(cat.name)}
                </span>
              ))}
            </div>
            
            <h1 
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-600 leading-[1.1] mb-8 tracking-tight underline decoration-blue-100 underline-offset-8"
              dangerouslySetInnerHTML={{ __html: revision.new_title }}
            />
            
            <div className="flex items-center gap-4 text-gray-500 font-medium">
              <div className="w-10 h-10 rounded-full bg-magenta/10 flex items-center justify-center text-magenta">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-900 font-bold">Magentalab Research Team (AI Revision)</p>
                <p className="text-sm">{date}</p>
              </div>
            </div>
          </div>
        </header>

        {imageUrl && (
          <div className="container mx-auto px-4 -mt-16 sm:-mt-20 lg:-mt-24 mb-16 relative z-20">
            <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-magenta/10 border-4 border-white">
              <Image
                src={imageUrl}
                alt={sanitizeForSeo(revision.new_title) || "대표 이미지"}
                width={1200}
                height={675}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        )}

        <section className="container mx-auto px-4 max-w-4xl -mt-12 relative z-20">
          <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-2xl shadow-gray-200/50 border border-gray-100">
            
            {/* Excerpt Box Preview */}
            <AnsimiSummary 
              ansimSummary={revision.new_ansim_summary}
              excerpt={revision.new_excerpt} 
              categoryNames={categories.map((c: any) => c.name)} 
              lang={revision.language as "ko" | "en" | "ja"}
            />

            <div 
              className="wp-content prose prose-lg md:prose-xl prose-magenta max-w-none text-gray-700 leading-relaxed font-normal mt-10"
              dangerouslySetInnerHTML={{ __html: fixWpLinks(cleanContentReferences(revision.new_content), sanitizeForSeo(revision.new_title), revision.language as 'ko'|'en'|'ja') }}
            />

            {/* Evidence Viewer Preview */}
            <VeterinaryReferencesSection 
              categories={categories.map((c: any) => c.name)} 
              title={revision.new_title} 
              slug={revision.slug} 
              lang={revision.language as "ko" | "en" | "ja"} 
              content={revision.new_content}
              customEvidence={revision.evidence || undefined}
            />

            {tags && tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 text-sm">
                  {tags.map((tag: any) => (
                    <span key={tag.id} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg font-medium">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </article>
    </div>
  );
}
