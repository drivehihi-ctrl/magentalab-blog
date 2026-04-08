import Image from "next/image";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/wp";

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="pb-20">
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
                {/* Glow Background for the character */}
                <div className="absolute inset-0 bg-magenta/10 rounded-full blur-3xl transform scale-90" />
                <Image
                  src="/images/ansimi-researcher2.png"
                  alt="수석 연구원 안심이"
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
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
                반려동물을 위한 <br /> 
                <span className="text-magenta">더 나은 미래</span>를 <br className="hidden lg:block" />
                연구합니다.
              </h2>
              <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-gray-500 leading-relaxed font-normal">
                Magentalab 반려동물 연구소의 최신 연구 결과와 <br className="hidden md:block" />
                생활 속 건강 팁을 블로그에서 만나보세요.
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
            <p className="text-gray-400">등록된 게시글이 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}
