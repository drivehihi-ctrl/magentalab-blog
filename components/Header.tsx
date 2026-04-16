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

      {/* Mobile Menu - Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu - Sidebar Drawer */}
      <div 
        className={`fixed right-0 top-0 bottom-0 z-50 w-[280px] bg-white md:hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Top Bar for Drawer */}
          <div className="flex items-center justify-between px-6 h-20 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-magenta flex items-center justify-center text-white font-bold text-sm shadow-md shadow-magenta/10">
                M
              </div>
              <span className="text-sm font-bold text-gray-900 tracking-tight">Magentalab</span>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 -mr-2 text-gray-500 hover:text-magenta transition-colors"
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-10">
            <div className="flex flex-col gap-8">
              <Link 
                href="/blog" 
                className="text-xl font-bold text-gray-900 hover:text-magenta transition-colors flex items-center justify-between group"
                onClick={() => setIsMenuOpen(false)}
              >
                블로그
                <span className="text-gray-300 group-hover:text-magenta transition-colors">→</span>
              </Link>
              <Link 
                href="/about" 
                className="text-xl font-bold text-gray-900 hover:text-magenta transition-colors flex items-center justify-between group"
                onClick={() => setIsMenuOpen(false)}
              >
                연구소 소개
                <span className="text-gray-300 group-hover:text-magenta transition-colors">→</span>
              </Link>
              <Link 
                href="/about-ansim" 
                className="text-xl font-bold text-gray-900 hover:text-magenta transition-colors flex items-center justify-between group"
                onClick={() => setIsMenuOpen(false)}
              >
                안심이 소개
                <span className="text-gray-300 group-hover:text-magenta transition-colors">→</span>
              </Link>
              <Link 
                href="/shop" 
                className="text-xl font-bold text-gray-900 hover:text-magenta transition-colors flex items-center justify-between group"
                onClick={() => setIsMenuOpen(false)}
              >
                전용몰
                <span className="text-gray-300 group-hover:text-magenta transition-colors">→</span>
              </Link>
            </div>

            <div className="mt-12 pt-10 border-t border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Contact Us</p>
              <a 
                href="mailto:smagentalab@gmail.com"
                className="flex items-center justify-center w-full py-4 bg-magenta text-white font-bold rounded-2xl shadow-lg shadow-magenta/10 hover:bg-magenta/90 transition-all active:scale-95"
                onClick={() => setIsMenuOpen(false)}
              >
                문의하기
              </a>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-50 bg-gray-50/50">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">
              © 2026 Magentalab
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
