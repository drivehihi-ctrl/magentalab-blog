import PostListItem from "@/components/PostListItem";
import { getPosts } from "@/lib/wp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "전체 글 목록 | Magentalab",
  description: "Magentalab 반려동물 연구소의 모든 연구 게시글과 블로그 포스트를 확인하세요.",
};

export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <div className="pb-24">
      {/* Page Header */}
      <header className="relative pt-24 pb-20 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest">
            ALL POSTS
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            블로그 <span className="text-magenta">전체보기</span>
          </h1>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-magenta/5 rounded-l-full blur-3xl opacity-30 transform translate-x-1/2" />
      </header>

      {/* Post List Section */}
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-medium font-sans">등록된 게시글이 없습니다. 📝</p>
          </div>
        )}
      </section>
      
      {/* Simple Stats or Message */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="py-12 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400 font-sans">
            총 <span className="text-magenta font-bold">{posts.length}</span>개의 연구 데이터가 기록되어 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
