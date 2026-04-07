import Image from "next/image";
import { Metadata } from "next";
import { getPost, getFeaturedImage, getCategories, fixWpLinks } from "@/lib/wp";
import Link from "next/link";
import CommentsSection from "@/components/CommentsSection";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getPost(id);
    const imageUrl = getFeaturedImage(post);
    const title = post.title.rendered.replace(/<[^>]*>?/gm, "");
    const description = post.excerpt.rendered.replace(/<[^>]*>?/gm, "").slice(0, 160);

    return {
      title: `${title} | Magentalab`,
      description,
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
        title,
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

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);
  const imageUrl = getFeaturedImage(post);
  const categories = getCategories(post);
  const date = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="pb-24">
      {/* Post Header */}
      <header className="relative pt-16 pb-24 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 mb-10 text-sm font-bold text-magenta uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            목록으로 돌아가기
          </Link>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((cat) => (
              <span key={cat.id} className="px-4 py-1.5 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest">
                {cat.name}
              </span>
            ))}
          </div>
          
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-8 tracking-tight"
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
            alt={post.title.rendered}
            width={1200}
            height={675}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>

      {/* Post Content */}
      <div className="container mx-auto px-4 max-w-3xl">
        <div 
          className="wp-content prose prose-lg md:prose-xl prose-magenta max-w-none text-gray-700 leading-relaxed font-normal"
          dangerouslySetInnerHTML={{ __html: fixWpLinks(post.content.rendered) }}
        />
        
        {/* Post Footer / CTA */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gray-900 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">함께 더 건강한 세상을 만들어요.</h3>
            <p className="text-gray-400 mb-8 max-w-lg">
              Magentalab 반려동물 연구소의 모든 이야기가 궁금하신가요? 뉴스레터를 구독하고 가장 먼저 소식을 받아보세요.
            </p>
            <button className="px-8 py-3 bg-magenta hover:bg-magenta/90 text-white font-bold rounded-full transition-all shadow-lg shadow-magenta/20">
              연구소 소식 구독하기
            </button>
          </div>
          {/* Decorative background for the CTA */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-magenta/20 rounded-full blur-3xl" />
        </div>

        {/* Comments Section */}
        <CommentsSection postId={parseInt(id)} />
      </div>
    </article>
  );
}
