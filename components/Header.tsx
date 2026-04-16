"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-magenta flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-magenta/20 transition-transform group-hover:scale-110">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Magentalab
            </h1>
            <p className="text-xs font-medium text-magenta tracking-widest uppercase">
              반려동물 연구소
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
          <Link href="/blog" className="hover:text-magenta transition-colors">블로그</Link>
          <Link href="/about" className="hover:text-magenta transition-colors">연구소 소개</Link>
          <Link href="/about-ansim" className="hover:text-magenta transition-colors">안심이 소개</Link>
          <Link href="/shop" className="hover:text-magenta transition-colors">전용몰</Link>
          <a 
            href="mailto:smagentalab@gmail.com"
            className="px-5 py-2.5 bg-magenta text-white rounded-full hover:bg-magenta/90 transition-all shadow-md shadow-magenta/10 hover:shadow-lg"
          >
            문의하기
          </a>
        </nav>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden p-2 text-gray-700 hover:text-magenta transition-colors z-[60] relative"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu - Transparent Backdrop to catch click-outside */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-black/5 backdrop-blur-[2px]" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Sleek Top-Right Dropdown */}
      <div 
        className={`absolute top-[70px] right-4 z-50 w-60 bg-white md:hidden transition-all duration-300 origin-top-right border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden ${
          isMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-1.5">
          <nav className="flex flex-col gap-0.5">
            <Link 
              href="/blog" 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >
              블로그
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </Link>
            <div className="h-px bg-gray-50 mx-4" />
            <Link 
              href="/about" 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >
              연구소 소개
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </Link>
            <div className="h-px bg-gray-50 mx-4" />
            <Link 
              href="/about-ansim" 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >
              안심이 소개
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </Link>
            <div className="h-px bg-gray-50 mx-4" />
            <Link 
              href="/shop" 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >
              전용몰
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </Link>
          </nav>

          <div className="mt-1.5 p-1.5 border-t border-gray-50">
            <a 
              href="mailto:smagentalab@gmail.com"
              className="flex items-center justify-center w-full py-3.5 bg-magenta text-white text-[15px] font-bold rounded-xl shadow-lg shadow-magenta/10 hover:bg-magenta/90 transition-all active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              문의하기
            </a>
          </div>
          
          <div className="py-2 text-center border-t border-gray-50 bg-gray-50/50">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              © Magentalab Research
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
