"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ExternalLink, LogOut, Award, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import LiveSearch from "./LiveSearch";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMapPage, setIsMapPage] = useState(false);
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMap =
        window.location.hostname.startsWith("map.") ||
        window.location.hostname.startsWith("map-") ||
        pathname.startsWith("/map");
      setIsMapPage(isMap);
    }
  }, [pathname]);

  // Track scroll for header style change
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMenuOpen]);

  const isEn = pathname.startsWith("/en");
  const isJa = pathname.startsWith("/ja");

  const logoSubText = isEn ? "Pet Research Lab" : isJa ? "ペット研究所" : "반려동물 연구소";
  const logoMainLink = isEn ? "/en" : isJa ? "/ja" : "/";

  const menu = {
    blog: isEn ? "Blog" : isJa ? "ブログ" : "블로그(카테고리)",
    blogLink: isEn ? "/en" : isJa ? "/ja" : "/blog",
    about: isEn ? "About Us" : isJa ? "研究所紹介" : "연구소 소개",
    aboutLink: isEn ? "/en/about" : isJa ? "/ja/about" : "/about",
    aboutAnsim: isEn ? "Meet Ansim" : isJa ? "アンシム紹介" : "안심이 소개",
    aboutAnsimLink: isEn ? "/en/about-ansim" : isJa ? "/ja/about-ansim" : "/about-ansim",
    ask: isEn ? "Ask Ansim" : isJa ? "質問する" : "질문하기",
    askLink: isEn ? "/en" : isJa ? "/ja" : "/ask-ansimi",
    bcs: isEn ? "BCS Calculator" : isJa ? "BCS計算機" : "칼로리 계산기",
    bcsLink: isEn ? "/en/bcs-calculator" : isJa ? "/ja/bcs-calculator" : "/bcs-calculator",
    age: isEn ? "Age Calculator" : isJa ? "年齢計算機" : "나이 계산기",
    ageLink: isEn ? "/en/age-calculator" : isJa ? "/ja/age-calculator" : "/age-calculator",
    dm: isEn ? "DM Calculator" : isJa ? "栄養＆飲水量" : "영양 & 음수량",
    dmLink: isEn ? "/en/dm-calculator" : isJa ? "/ja/dm-calculator" : "/dm-calculator",
    emergency: isEn ? "Emergency Guide" : isJa ? "応急計算機" : "응급 계산기",
    emergencyLink: isEn ? "/en/emergency-calculator" : isJa ? "/ja/emergency-calculator" : "/emergency-calculator",
    patella: isEn ? "Patella Diagnosis" : isJa ? "膝蓋骨診断" : "슬개골 진단",
    patellaLink: isEn ? "/en/patella-diagnoser" : isJa ? "/ja/patella-diagnoser" : "/patella-diagnoser",
    petCare: isEn ? "Pet Expenses" : isJa ? "養育費計算" : "양육비 계산",
    petCareLink: isEn ? "/en/petcare-expenses-calculator" : isJa ? "/ja/petcare-expenses-calculator" : "/petcare-expenses-calculator",
    fic: isEn ? "Cystitis Diagnoser" : isJa ? "膀胱炎診断" : "방광염 진단",
    ficLink: isEn ? "/en/fic-diagnoser" : isJa ? "/ja/fic-diagnoser" : "/fic-diagnoser",
    contact: isEn ? "Contact" : isJa ? "お問い合わせ" : "문의하기",
    searchLabel: isEn ? "AI Search" : isJa ? "AI検索" : "AI 검색",
  };

  const getNavLink = (linkPath: string) => {
    if (isMapPage && linkPath.startsWith("/")) {
      return `https://www.magentalabblog.com${linkPath}`;
    }
    return linkPath;
  };

  const handleLanguageChange = (lang: string) => {
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments[0] === "en" || pathSegments[0] === "ja") pathSegments.shift();
    if (pathSegments[0] === "posts" && pathSegments[1]) {
      const slug = pathSegments[1];
      const baseSlug = slug.replace(/-en$|-ja$/, "");
      if (lang === "en") pathSegments[1] = `${baseSlug}-en`;
      else if (lang === "ja") pathSegments[1] = `${baseSlug}-ja`;
      else pathSegments[1] = baseSlug;
    }
    let targetPath = "";
    if (lang === "en") targetPath = `/en/${pathSegments.join("/")}`;
    else if (lang === "ja") targetPath = `/ja/${pathSegments.join("/")}`;
    else targetPath = `/${pathSegments.join("/")}`;
    const finalPath = targetPath.replace(/\/$/, "") || "/";
    return isMapPage ? `https://www.magentalabblog.com${finalPath}` : finalPath;
  };

  const navLinks = [
    { label: menu.about, href: getNavLink(menu.aboutLink) },
    { label: menu.aboutAnsim, href: getNavLink(menu.aboutAnsimLink) },
    { label: menu.bcs, href: getNavLink(menu.bcsLink) },
    { label: menu.age, href: getNavLink(menu.ageLink) },
    { label: menu.dm, href: getNavLink(menu.dmLink) },
    { label: menu.emergency, href: getNavLink(menu.emergencyLink) },
    { label: menu.patella, href: getNavLink(menu.patellaLink) },
    { label: menu.petCare, href: getNavLink(menu.petCareLink) },
    { label: menu.fic, href: getNavLink(menu.ficLink) },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#1a1a2e]/95 backdrop-blur-md shadow-lg shadow-[#1a1a2e]/20"
          : "bg-[#1a1a2e]"
      }`}
    >
      {/* ─── Top accent bar (Hani-inspired gradient stripe) ─── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#E5007E] via-[#c9a64c] to-[#E5007E]" />

      <div className="container mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">
        {/* ─── Logo ─── */}
        <Link
          href={isMapPage ? "/" : logoMainLink}
          className="flex items-center gap-2.5 group shrink-0"
        >
          <div className="w-10 h-10 flex items-center justify-center relative transition-transform group-hover:scale-105">
            <Image
              src={isMapPage ? "/images/map-logo.png" : "/images/favicon.png"}
              alt="Magentalab Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="text-[17px] font-extrabold tracking-tight text-white leading-tight">
              {isMapPage ? "마젠타랩 펫 맵" : "Magentalab"}
            </div>
            <p className="text-[10px] font-bold text-[#c9a64c] tracking-widest uppercase leading-none mt-0.5">
              {isMapPage ? "반려동물과 함께하기" : logoSubText}
            </p>
          </div>
        </Link>

        {/* ─── Desktop Navigation ─── */}
        <nav className="hidden lg:flex items-center gap-1 font-medium text-sm text-[#c8c8e0]">
          {isMapPage && (
            <a
              href="https://www.magentalabblog.com"
              className="font-extrabold text-[#E5007E] hover:text-white px-3.5 py-1.5 rounded-full bg-[#E5007E]/10 hover:bg-[#E5007E]/20 transition-all flex items-center gap-1.5 mr-1"
            >
              <span>블로그 보러가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {navLinks.map((nav) => (
            <a
              key={nav.href}
              href={nav.href}
              className="px-2.5 py-1.5 rounded-lg text-[#c8c8e0] hover:text-white hover:bg-white/10 transition-all text-[13px] whitespace-nowrap"
            >
              {nav.label}
            </a>
          ))}

          <div className="mx-1">
            <LiveSearch />
          </div>

          {!isMapPage && (
            <div className="flex items-center gap-1.5 border border-white/10 bg-white/5 rounded-full px-3 py-1 text-xs font-semibold">
              <Link href={handleLanguageChange("ko")} className={`transition-colors hover:text-white ${!isEn && !isJa ? "text-[#c9a64c] font-black" : "text-[#8888aa]"}`}>KO</Link>
              <span className="text-white/20 select-none">|</span>
              <Link href={handleLanguageChange("en")} className={`transition-colors hover:text-white ${isEn ? "text-[#c9a64c] font-black" : "text-[#8888aa]"}`}>EN</Link>
              <span className="text-white/20 select-none">|</span>
              <Link href={handleLanguageChange("ja")} className={`transition-colors hover:text-white ${isJa ? "text-[#c9a64c] font-black" : "text-[#8888aa]"}`}>JA</Link>
            </div>
          )}

          {session?.user ? (
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="flex items-center gap-1.5 bg-[#c9a64c]/15 border border-[#c9a64c]/30 text-[#c9a64c] px-3 py-1 rounded-full text-xs font-black">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[80px]">{session.user.name || "연구원"}님</span>
                <span className="text-[10px] bg-[#c9a64c] text-[#1a1a2e] px-2 py-0.5 rounded-full font-black">수석 🏅</span>
              </div>
              <button
                onClick={() => signOut()}
                className="text-xs font-bold text-[#8888aa] hover:text-rose-400 hover:bg-rose-900/20 px-2.5 py-1.5 rounded-full transition-all flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <a
              href="mailto:smagentalab@gmail.com"
              className="ml-1 px-4 py-2 bg-[#E5007E] hover:bg-[#c0006a] text-white text-sm font-bold rounded-full transition-all shadow-md shadow-[#E5007E]/20 whitespace-nowrap"
            >
              {menu.contact}
            </a>
          )}
        </nav>

        {/* ─── Mobile Toggle ─── */}
        <button
          className="lg:hidden p-2 text-white hover:text-[#c9a64c] transition-colors z-[60] relative"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ─── Mobile Menu Backdrop ─── */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-[3px]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* ─── Mobile Menu Dropdown ─── */}
      <div
        className={`fixed top-[71px] left-0 right-0 z-50 lg:hidden transition-all duration-300 origin-top max-h-[calc(100dvh-80px)] overflow-y-auto overscroll-contain ${
          isMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"
        }`}
        style={{ transformOrigin: "top" }}
      >
        <div className="bg-[#1a1a2e] border-t border-[#c9a64c]/20 shadow-2xl">

          {/* Accent top stripe inside menu */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#c9a64c]/40 to-transparent" />

          <div className="px-4 py-3 flex flex-col gap-0">

            {/* User badge (mobile) */}
            {session?.user && (
              <div className="flex items-center justify-between bg-[#c9a64c]/10 border border-[#c9a64c]/20 rounded-2xl px-4 py-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#c9a64c] text-[#1a1a2e] flex items-center justify-center font-black shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">{session.user.name || "연구원"}님</p>
                    <p className="text-[10px] font-bold text-[#c9a64c]">안심 수석 연구원 🏅</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsMenuOpen(false); signOut(); }}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-900/20 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>로그아웃</span>
                </button>
              </div>
            )}

            {/* Blog link (map page) */}
            {isMapPage && (
              <a
                href="https://www.magentalabblog.com"
                className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-[15px] font-black text-white bg-[#E5007E] hover:bg-[#c0006a] transition-all mb-2 shadow-md shadow-[#E5007E]/20"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>블로그 보러가기 (메인)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Search */}
            <div className="flex items-center justify-between px-4 py-2.5 mb-2 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] font-black text-[#8888aa] uppercase tracking-widest">{menu.searchLabel}</span>
              <LiveSearch />
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-0.5">
              {navLinks.map((nav) => (
                <a
                  key={nav.href}
                  href={nav.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[14px] font-semibold text-[#c8c8e0] hover:bg-white/10 hover:text-white transition-all group"
                >
                  <span>{nav.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#8888aa] group-hover:text-[#c9a64c] transition-colors" />
                </a>
              ))}
            </nav>

            {/* Language selector */}
            {!isMapPage && (
              <div className="flex items-center justify-between px-4 py-3 mt-2 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] font-black text-[#8888aa] uppercase tracking-widest">Language</span>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <Link href={handleLanguageChange("ko")} className={`transition-colors hover:text-white ${!isEn && !isJa ? "text-[#c9a64c] font-black" : "text-[#8888aa]"}`} onClick={() => setIsMenuOpen(false)}>한국어</Link>
                  <span className="text-white/20">|</span>
                  <Link href={handleLanguageChange("en")} className={`transition-colors hover:text-white ${isEn ? "text-[#c9a64c] font-black" : "text-[#8888aa]"}`} onClick={() => setIsMenuOpen(false)}>English</Link>
                  <span className="text-white/20">|</span>
                  <Link href={handleLanguageChange("ja")} className={`transition-colors hover:text-white ${isJa ? "text-[#c9a64c] font-black" : "text-[#8888aa]"}`} onClick={() => setIsMenuOpen(false)}>日本語</Link>
                </div>
              </div>
            )}

            {/* CTA button */}
            <div className="mt-3 pb-4">
              <a
                href="mailto:smagentalab@gmail.com"
                className="flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-[#E5007E] to-[#c0006a] text-white text-[15px] font-bold rounded-2xl shadow-lg shadow-[#E5007E]/20 hover:opacity-90 transition-all active:scale-[0.98]"
                onClick={() => setIsMenuOpen(false)}
              >
                {menu.contact}
              </a>
            </div>

            {/* Footer mini */}
            <div className="py-3 text-center border-t border-white/10">
              <p className="text-[9px] text-[#8888aa] font-bold uppercase tracking-widest">© Magentalab Research</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
