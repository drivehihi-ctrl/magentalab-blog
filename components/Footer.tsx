"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname() || "/";

  const isEn = pathname.startsWith("/en");
  const isJa = pathname.startsWith("/ja");

  const text = {
    privacy: isEn ? "Privacy Policy" : isJa ? "個人情報処理方針" : "개인정보처리방침",
    privacyLink: isEn ? "/en/privacy" : isJa ? "/ja/privacy" : "/privacy",
    
    terms: isEn ? "Terms of Service" : isJa ? "利用規約" : "이용약관",
    termsLink: isEn ? "/en/terms" : isJa ? "/ja/terms" : "/terms",
    
    about: isEn ? "About Us" : isJa ? "研究所紹介" : "연구소 소개",
    aboutLink: isEn ? "/en/about" : isJa ? "/ja/about" : "/about",
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-16 text-gray-600">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 text-left">
          <div className="space-y-4">
            <p className="text-gray-900 font-bold">마젠타랩 (MagentaLab)</p>
            <div className="text-[11px] text-gray-500 leading-relaxed space-y-1 font-medium">
              <p>대표이사 : 김범준 | 사업자등록번호 : 448-07-03101</p>
              <p>통신판매업 신고 : 제 2025-경기김포-1339호 | 호스팅 : Vercel Inc.</p>
              <p>주소 : 경기도 김포시 김포한강11로255번길 149, 112동 701호</p>
              <p>고객센터 : 0502-1933-8452 | 이메일 : smagentalab@gmail.com</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-gray-900 font-bold text-sm">
              {isEn ? "Magentalab Pet Research Institute" : isJa ? "Magentalabペット研究所" : "Magentalab 반려동물 연구소"}
            </p>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              {isEn 
                ? "This information is for reference only. Please consult a veterinarian for accurate diagnosis. Magentalab aims to provide data-based information." 
                : isJa 
                ? "この情報は参考用であり、正確な診断は必ず獣医師にご相談ください。Magentalabはデータに基づく情報提供を目的としています。" 
                : "본 정보는 참고용이며, 정확한 진단은 반드시 수의사와 상담하십시오. Magentalab은 데이터에 기반한 정보 제공을 목적으로 합니다."
              }
            </p>
            <nav className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-2">
              <Link href={text.privacyLink} className="hover:text-magenta transition-colors">{text.privacy}</Link>
              <Link href={text.termsLink} className="hover:text-magenta transition-colors">{text.terms}</Link>
              <Link href={text.aboutLink} className="hover:text-magenta transition-colors">{text.about}</Link>
            </nav>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 text-center text-gray-400 text-[10px] uppercase tracking-[0.2em]">
          &copy; 2026 Magentalab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
