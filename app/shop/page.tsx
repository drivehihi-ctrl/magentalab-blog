import type { Metadata } from "next";
import Link from "next/link";
// import ShopClient from "./ShopClient"; // 잠시 숨김 처리 (추후 오픈 시 주석 해제)

export const metadata: Metadata = {
  title: "준비 중 | 마젠타몰",
  description: "마젠타 전용몰은 더욱 완벽한 서비스를 위해 현재 준비 중입니다. 곧 찾아뵙겠습니다.",
};

export default function ShopPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      {/* 애니메이션 아이콘 */}
      <div className="w-24 h-24 rounded-[2rem] bg-magenta/5 flex items-center justify-center text-magenta mb-10 animate-pulse">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          <path d="m7 7 6 6" />
        </svg>
      </div>
      
      <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
        마젠타 전용몰 <span className="text-magenta">준비 중</span> 🐾
      </h1>
      
      <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-lg leading-relaxed">
        반려동물과 반려인을 위한 더 똑똑한 쇼핑 경험을 위해<br className="hidden md:block" />
        <span className="text-gray-900 font-semibold">마젠타랩 연구팀</span>이 정성을 다해 준비하고 있습니다.<br />
        곧 멋진 모습으로 찾아뵙겠습니다!
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/"
          className="w-full sm:w-auto px-10 py-4.5 bg-magenta text-white font-bold rounded-2xl shadow-xl shadow-magenta/20 transition-all hover:scale-105 active:scale-95"
        >
          홈으로 돌아가기
        </Link>
        <Link 
          href="/blog"
          className="w-full sm:w-auto px-10 py-4.5 bg-gray-100 text-gray-700 font-bold rounded-2xl transition-all hover:bg-gray-200"
        >
          블로그 읽어보기
        </Link>
      </div>
      
      <div className="mt-20 pt-8 border-t border-gray-100 w-full max-w-[200px]">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
          MAGENTA RESEARCH LAB
        </p>
      </div>
    </div>
  );
}

