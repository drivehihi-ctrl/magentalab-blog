import Link from "next/link";
import Image from "next/image";
import { WPPost, getFeaturedImage, getCategories, getTags } from "@/lib/wp";

interface PostListItemProps {
  post: WPPost;
}

export default function PostListItem({ post }: PostListItemProps) {
  const imageUrl = getFeaturedImage(post);
  const categories = getCategories(post);
  const tags = getTags(post);
  const date = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link 
      href={`/posts/${post.id}`} 
      className="group flex flex-col sm:flex-row gap-6 py-8 border-b border-gray-100 transition-colors hover:bg-magenta-light/10"
    >
      {/* Content Side */}
      <div className="flex-grow order-2 sm:order-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.slice(0, 1).map((cat) => (
            <span
              key={cat.id}
              className="px-0 py-0 text-sm font-bold text-magenta uppercase tracking-tight"
            >
              {cat.name}
            </span>
          ))}
        </div>
        
        <h3 
          className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight mb-2 group-hover:text-magenta transition-colors"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Tags indicator */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag: any) => (
              <span key={tag.id} className="text-[11px] text-gray-400 font-medium">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
        
        <div 
          className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 mb-4 font-normal"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />

        <div className="text-xs text-gray-400 font-medium font-sans">
          {date}
        </div>
      </div>

      {/* Image Side */}
      <div className="relative w-full sm:w-48 md:w-64 aspect-[16/10] sm:aspect-square flex-shrink-0 rounded-xl overflow-hidden order-1 sm:order-2">
        <Image
          src={imageUrl}
          alt={post.title.rendered}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-magenta transform translate-x-4 -translate-y-4 rotate-45 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </div>
    </Link>
  );
}
