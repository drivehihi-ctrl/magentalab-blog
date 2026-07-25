'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DraggableScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  showArrows?: boolean;
}

export default function DraggableScrollContainer({
  children,
  className = '',
  showArrows = true,
}: DraggableScrollContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.8; // scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group w-full">
      {/* PC Left Arrow Button */}
      {showArrows && (
        <button
          type="button"
          onClick={() => scrollBy(-340)}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 text-gray-800 border border-gray-200 shadow-lg items-center justify-center hover:bg-[#E5007E] hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="이전 스크롤"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Scrollable Container with PC Mouse Drag Support */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex overflow-x-auto snap-x snap-mandatory pb-4 gap-4 md:gap-6 scrollbar-none touch-pan-x cursor-grab active:cursor-grabbing select-none ${className}`}
      >
        {children}
      </div>

      {/* PC Right Arrow Button */}
      {showArrows && (
        <button
          type="button"
          onClick={() => scrollBy(340)}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 text-gray-800 border border-gray-200 shadow-lg items-center justify-center hover:bg-[#E5007E] hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="다음 스크롤"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
