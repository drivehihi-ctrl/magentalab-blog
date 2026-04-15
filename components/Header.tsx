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

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 top-[80px] z-50 bg-white/98 backdrop-blur-xl md:hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center justify-start pt-16 h-full container mx-auto px-4 text-center">
          <div className="flex flex-col gap-10 w-full max-w-sm">
            <Link 
              href="/blog" 
              className="text-2xl font-bold text-gray-900 hover:text-magenta transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              블로그
            </Link>
            <Link 
              href="/about" 
              className="text-2xl font-bold text-gray-900 hover:text-magenta transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              연구소 소개
            </Link>
            <Link 
              href="/about-ansim" 
              className="text-2xl font-bold text-gray-900 hover:text-magenta transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              안심이 소개
            </Link>
            <Link 
              href="/shop" 
              className="text-2xl font-bold text-gray-900 hover:text-magenta transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              전용몰
            </Link>
            <div className="pt-6 border-t border-gray-100">
              <a 
                href="mailto:smagentalab@gmail.com"
                className="inline-block w-full py-4 bg-magenta text-white text-xl font-bold rounded-2xl shadow-xl shadow-magenta/20"
                onClick={() => setIsMenuOpen(false)}
              >
                문의하기
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
