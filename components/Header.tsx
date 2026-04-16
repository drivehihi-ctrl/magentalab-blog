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

      {/* Mobile Menu - Immersive Curtain Navigation */}
      <div 
        className={`fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl md:hidden transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full container mx-auto px-6">
          {/* Header row inside Curtain to keep the X button accessible */}
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-magenta flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-magenta/20">
                M
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-gray-900 block">Magentalab</span>
                <span className="text-[10px] font-bold text-magenta uppercase tracking-widest leading-none">반려동물 연구소</span>
              </div>
            </Link>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 -mr-2 text-gray-900 hover:text-magenta transition-colors"
              aria-label="Close Menu"
            >
              <X size={32} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center gap-10">
            <Link 
              href="/blog" 
              className="text-4xl md:text-5xl font-black text-gray-900 hover:text-magenta transition-all hover:scale-105 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              블로그
            </Link>
            <Link 
              href="/about" 
              className="text-4xl md:text-5xl font-black text-gray-900 hover:text-magenta transition-all hover:scale-105 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              연구소 소개
            </Link>
            <Link 
              href="/about-ansim" 
              className="text-4xl md:text-5xl font-black text-gray-900 hover:text-magenta transition-all hover:scale-105 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              안심이 소개
            </Link>
            <Link 
              href="/shop" 
              className="text-4xl md:text-5xl font-black text-gray-900 hover:text-magenta transition-all hover:scale-105 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              전용몰
            </Link>
          </nav>

          <div className="py-12 flex flex-col items-center border-t border-gray-100/50">
            <a 
              href="mailto:smagentalab@gmail.com"
              className="w-full max-w-sm py-5 bg-magenta text-white text-xl font-bold rounded-2xl shadow-2xl shadow-magenta/20 hover:bg-magenta/90 text-center transition-all active:scale-95 mb-8"
              onClick={() => setIsMenuOpen(false)}
            >
              문의하기
            </a>
            <div className="w-12 h-1 bg-gray-100 rounded-full mb-6" />
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.3em]">
              © 2026 Magentalab Research
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
