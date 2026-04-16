"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { searchPosts, WPPost, getFeaturedImage } from "@/lib/wp";

export default function LiveSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WPPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const data = await searchPosts(query);
          setResults(data);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={searchRef} className="relative flex items-center">
      {/* Search Icon / Expansion */}
      <div className={`flex items-center transition-all duration-300 ${isOpen ? "w-64 md:w-80" : "w-10"}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex-none w-10 h-10 flex items-center justify-center rounded-full transition-all ${
            isOpen ? "bg-magenta text-white shadow-lg shadow-magenta/20" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {isOpen ? <X size={18} /> : <Search size={20} />}
        </button>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="나중에 볼 정보를 검색해보세요..."
          className={`ml-2 w-full bg-transparent border-none outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          autoFocus={isOpen}
        />
      </div>

      {/* Results Dropdown */}
      {isOpen && (query.trim().length >= 2 || isLoading) && (
        <div className="absolute top-14 right-0 w-[90vw] md:w-[450px] bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">검색 결과</span>
            {isLoading && <Loader2 size={14} className="animate-spin text-magenta" />}
          </div>

          <div className="max-h-[70vh] overflow-y-auto shop-scrollbar-hide">
            {isLoading ? (
              <div className="py-20 text-center">
                <Loader2 size={32} className="animate-spin text-magenta/20 mx-auto mb-3" />
                <p className="text-xs text-gray-400 font-medium">안심 연구원이 정보를 찾는 중...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="flex flex-col p-2 gap-1">
                {results.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-magenta/5 transition-colors group"
                  >
                    <div className="relative flex-none w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                      <Image
                        src={getFeaturedImage(post)}
                        alt={post.title.rendered}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="text-[13px] font-bold text-gray-900 leading-snug mb-1 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-magenta font-black uppercase tracking-tighter bg-magenta/10 px-1.5 py-0.5 rounded">Story</span>
                        <span className="text-[10px] text-gray-400 font-medium">{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-magenta transition-all -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            ) : query.trim().length >= 2 ? (
              <div className="py-20 text-center">
                <div className="text-4xl mb-3">🧐</div>
                <p className="text-[13px] font-bold text-gray-900 mb-1">관련된 정보를 찾지 못했어요</p>
                <p className="text-[11px] text-gray-400">다른 검색어로 다시 시도해볼까요?</p>
              </div>
            ) : null}
          </div>

          <div className="p-4 bg-gray-50/80 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Powered by Magentalab Research AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
