"use client";

import Link from "next/link";
import Image from "next/image";

const AFFILIATE_URL = "https://petfair.yeogida-dog.com/offline/landing?pc_seq=1727";

export default function AffiliateStoreBanner() {
  return (
    <Link
      href={AFFILIATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block my-10 overflow-hidden rounded-2xl shadow-xl shadow-[#7B0A40]/30 hover:shadow-2xl hover:shadow-[#7B0A40]/50 transition-all duration-300 hover:-translate-y-1"
      style={{ background: "linear-gradient(135deg, #6B0836 0%, #9B0D50 50%, #7B0A40 100%)" }}
    >
      <div className="relative flex items-center justify-between gap-4 px-6 py-5 md:px-10 md:py-8">
        {/* 배경 장식 원 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-[#E5007E]/20 rounded-full blur-2xl translate-y-1/3 pointer-events-none" />

        {/* 왼쪽: 텍스트 */}
        <div className="relative z-10 flex flex-col gap-1.5">
          {/* 배지 */}
          <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-[11px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
            제휴 · Affiliate Store
          </span>

          {/* 메인 카피 */}
          <p className="text-white text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
            마젠타랩의 <span className="text-[#FFD700]">제휴몰</span>.
          </p>

          {/* 서브 카피 */}
          <p className="text-white/80 text-sm md:text-base font-semibold">
            좋은 제품을 진짜 <span className="text-[#FFD700] font-extrabold">최저가</span>로.
          </p>

          {/* 본문 */}
          <p className="text-white/60 text-xs md:text-sm mt-1 leading-relaxed">
            시크릿몰은 유명사이트보다 <span className="text-white/90 font-bold">더 저렴하게</span> 판매해요.
          </p>

          {/* CTA 버튼 */}
          <span className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 bg-[#FFD700] text-[#6B0836] font-extrabold text-sm rounded-full w-fit transition-all group-hover:bg-white group-hover:scale-105 shadow-lg shadow-[#FFD700]/30">
            지금 바로 보러가기
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </div>

        {/* 오른쪽: 아이콘 영역 */}
        <div className="relative z-10 hidden sm:flex flex-col items-center gap-2 flex-shrink-0">
          <div className="relative w-20 h-20 md:w-28 md:h-28">
            <Image
              src="/images/favicon.png"
              alt="마젠타랩 로고"
              fill
              className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="text-white/50 text-[10px] font-bold tracking-widest uppercase">MagentaLab</span>
        </div>
      </div>
    </Link>
  );
}
