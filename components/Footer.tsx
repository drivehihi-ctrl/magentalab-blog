"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";

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
    <footer className="bg-[#1a1a2e] text-[#c8c8e0]">
      {/* Top gradient stripe */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#E5007E] via-[#c9a64c] to-[#E5007E]" />

      {/* Main footer content */}
      <div className="container mx-auto px-4 sm:px-6 pt-12 pb-8 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">

          {/* Brand column */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">마젠타랩</h2>
              <p className="text-[11px] font-bold text-[#c9a64c] uppercase tracking-widest mt-0.5">
                {isEn ? "Pet Research Lab" : isJa ? "ペット研究所" : "반려동물 연구소"}
              </p>
            </div>
            <p className="text-[12px] text-[#8888aa] leading-relaxed">
              {isEn
                ? "Data-driven research for better pet lives."
                : isJa
                ? "データに基づくペット研究."
                : "데이터와 과학으로 반려동물의 더 나은 삶을 연구합니다."}
            </p>
            <nav className="flex flex-wrap gap-3 text-[11px] font-bold text-[#8888aa] uppercase tracking-widest pt-1">
              <Link href={text.privacyLink} className="hover:text-[#E5007E] transition-colors">{text.privacy}</Link>
              <span className="text-white/20">·</span>
              <Link href={text.termsLink} className="hover:text-[#E5007E] transition-colors">{text.terms}</Link>
              <span className="text-white/20">·</span>
              <Link href={text.aboutLink} className="hover:text-[#E5007E] transition-colors">{text.about}</Link>
            </nav>
          </div>

          {/* Business info column */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-black text-[#c9a64c] uppercase tracking-widest border-b border-white/10 pb-2">
              {isEn ? "Company Info" : isJa ? "会社情報" : "사업자 정보"}
            </h3>
            <div className="text-[11px] text-[#8888aa] leading-relaxed space-y-1.5">
              <p>{isEn ? "CEO: Kim Beomjun" : isJa ? "代表者: Kim Beomjun" : "대표이사 : 김범준"} &nbsp;|&nbsp; {isEn ? "Business Registration No.: 448-07-03101" : isJa ? "事業者登録番号: 448-07-03101" : "사업자등록번호 : 448-07-03101"}</p>
              <p>{isEn ? "E-commerce Registration: 2025-Gyeonggimpo-1339" : isJa ? "通信販売業届出: 第2025-京畿金浦-1339号" : "통신판매업 신고 : 제 2025-경기김포-1339호"}</p>
              <p>{isEn ? "Hosting Provider: Vercel Inc. / Gabia Inc." : isJa ? "ホスティング提供者: Vercel Inc. / (株)ガビア" : "호스팅 제공자 : Vercel Inc. / (주)가비아"}</p>
            </div>
          </div>

          {/* Contact column */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-black text-[#c9a64c] uppercase tracking-widest border-b border-white/10 pb-2">
              {isEn ? "Contact" : isJa ? "お問い合わせ" : "문의"}
            </h3>
            <div className="space-y-2">
              <a href="tel:050219338452" className="flex items-center gap-2.5 text-[12px] text-[#8888aa] hover:text-white transition-colors group">
                <Phone className="w-3.5 h-3.5 text-[#c9a64c] shrink-0" />
                <span>0502-1933-8452</span>
              </a>
              <a href="mailto:smagentalab@gmail.com" className="flex items-center gap-2.5 text-[12px] text-[#8888aa] hover:text-[#E5007E] transition-colors group">
                <Mail className="w-3.5 h-3.5 text-[#c9a64c] shrink-0" />
                <span>smagentalab@gmail.com</span>
              </a>
              <div className="flex items-start gap-2.5 text-[12px] text-[#8888aa]">
                <MapPin className="w-3.5 h-3.5 text-[#c9a64c] shrink-0 mt-0.5" />
                <span>경기도 김포시 양촌읍 황금산단로 65, 2층</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#5a5a7a] uppercase tracking-[0.15em]">
          <span>© 2026 Magentalab. All rights reserved.</span>
          <span className="text-[#c9a64c]/60 font-bold">{isEn ? "A better tomorrow with our pets 🐾" : isJa ? "ペットと共により良い明日を 🐾" : "반려동물과 함께 더 나은 내일을 🐾"}</span>
        </div>
      </div>
    </footer>
  );
}
