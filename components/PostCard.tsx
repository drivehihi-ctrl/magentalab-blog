import Link from "next/link";
import Image from "next/image";
import { WPPost, getFeaturedImage, getCategories } from "@/lib/wp";

interface PostCardProps {
  post: WPPost;
}

export default function PostCard({ post }: PostCardProps) {
  const imageUrl = getFeaturedImage(post);
  const categories = getCategories(post);
  const date = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/posts/${post.id}`} className="group h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-magenta/10 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={imageUrl}
          alt={post.title.rendered}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold text-magenta uppercase tracking-wider"
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3 text-[11px] font-medium text-gray-400 uppercase tracking-widest">
          <span>{date}</span>
        </div>
        
        <h3 
          className="text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-magenta transition-colors line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        
        <div 
          className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        
        <div className="mt-auto flex items-center text-xs font-bold text-magenta uppercase tracking-widest">
          더 보기
          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
