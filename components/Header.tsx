"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ExternalLink, LogOut, User } from "lucide-react";
import { usePathname } from "next/navigation";
import LiveSearch from "./LiveSearch";
import { useSession, signOut, signIn } from "next-auth/react";



export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMapPage, setIsMapPage] = useState(false);
  const pathname = usePathname() || "/";


  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMap = window.location.hostname.startsWith("map.") ||
                    window.location.hostname.startsWith("map-") ||
                    pathname.startsWith("/map");
      setIsMapPage(isMap);
    }
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Determine current language from path
  const isEn = pathname.startsWith("/en");
  const isJa = pathname.startsWith("/ja");

  // Multilingual content mapping
  const logoSubText = isEn 
    ? "Pet Research Lab" 
    : isJa 
    ? "ペット研究所" 
    : "반려동물 연구소";

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
    blogDesc: isEn ? "Browse categories" : isJa ? "カテゴリで表示" : "카테고리별 모아보기"
  };

  const getNavLink = (linkPath: string) => {
    if (isMapPage && linkPath.startsWith("/")) {
      return `https://www.magentalabblog.com${linkPath}`;
    }
    return linkPath;
  };

  const handleLanguageChange = (lang: string) => {
    const pathSegments = pathname.split("/").filter(Boolean);
    
    if (pathSegments[0] === "en" || pathSegments[0] === "ja") {
      pathSegments.shift();
    }
    
    if (pathSegments[0] === "posts" && pathSegments[1]) {
      const slug = pathSegments[1];
      const baseSlug = slug.replace(/-en$|-ja$/, "");
      
      if (lang === "en") {
        pathSegments[1] = `${baseSlug}-en`;
      } else if (lang === "ja") {
        pathSegments[1] = `${baseSlug}-ja`;
      } else {
        pathSegments[1] = baseSlug;
      }
    }
    
    let targetPath = "";
    if (lang === "en") {
      targetPath = `/en/${pathSegments.join("/")}`;
    } else if (lang === "ja") {
      targetPath = `/ja/${pathSegments.join("/")}`;
    } else {
      targetPath = `/${pathSegments.join("/")}`;
    }
    
    const finalPath = targetPath.replace(/\/$/, "") || "/";
    return isMapPage ? `https://www.magentalabblog.com${finalPath}` : finalPath;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href={isMapPage ? "/" : logoMainLink} className="flex items-center gap-2 group">
          <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110 relative">
            <Image 
              src={isMapPage ? "/images/map-logo.png" : "/images/favicon.png"} 
              alt="Magentalab Logo" 
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-gray-900">
              {isMapPage ? "마젠타랩 펫 맵" : "Magentalab"}
            </div>
            <p className="text-xs font-medium text-magenta tracking-widest uppercase">
              {isMapPage ? "반려동물과 함께하기" : logoSubText}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-gray-600">
          {isMapPage && (
            <a 
              href="https://www.magentalabblog.com"
              className="font-extrabold text-magenta hover:text-magenta/80 transition-colors flex items-center gap-1.5 bg-magenta/10 hover:bg-magenta/20 px-3.5 py-1.5 rounded-full shadow-2xs"
            >
              <span>블로그 보러가기</span>
              <ExternalLink className="w-3.5 h-3.5 text-magenta" />
            </a>
          )}
          <a href={getNavLink(menu.aboutLink)} className="hover:text-magenta transition-colors">{menu.about}</a>
          <a href={getNavLink(menu.aboutAnsimLink)} className="hover:text-magenta transition-colors">{menu.aboutAnsim}</a>
          <a href={getNavLink(menu.bcsLink)} className="hover:text-magenta transition-colors">{menu.bcs}</a>
          <a href={getNavLink(menu.ageLink)} className="hover:text-magenta transition-colors">{menu.age}</a>
          <a href={getNavLink(menu.dmLink)} className="hover:text-magenta transition-colors">{menu.dm}</a>
          <a href={getNavLink(menu.emergencyLink)} className="hover:text-magenta transition-colors">{menu.emergency}</a>
          <a href={getNavLink(menu.patellaLink)} className="hover:text-magenta transition-colors">{menu.patella}</a>
          <a href={getNavLink(menu.petCareLink)} className="hover:text-magenta transition-colors">{menu.petCare}</a>
          <a href={getNavLink(menu.ficLink)} className="hover:text-magenta transition-colors">{menu.fic}</a>
          <div className="ml-2 mr-2">
            <LiveSearch />
          </div>

          {!isMapPage && (
            <div className="flex items-center gap-2 border border-gray-200 bg-gray-50/50 rounded-full px-3 py-1.5 text-xs font-semibold mr-1">
              <Link href={handleLanguageChange("ko")} className={`transition-colors hover:text-magenta ${!isEn && !isJa ? "text-magenta font-black" : "text-gray-400 font-medium"}`}>KO</Link>
              <span className="text-gray-250 select-none">|</span>
              <Link href={handleLanguageChange("en")} className={`transition-colors hover:text-magenta ${isEn ? "text-magenta font-black" : "text-gray-400 font-medium"}`}>EN</Link>
              <span className="text-gray-250 select-none">|</span>
              <Link href={handleLanguageChange("ja")} className={`transition-colors hover:text-magenta ${isJa ? "text-magenta font-black" : "text-gray-400 font-medium"}`}>JA</Link>
            </div>
          )}

          {session?.user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">{session.user.name || '연구원'}님</span>
              <button
                onClick={() => signOut()}
                className="text-xs font-bold text-gray-500 hover:text-rose-600 bg-gray-100 hover:bg-rose-50 px-2.5 py-1 rounded-full transition-all flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <a 
              href="mailto:smagentalab@gmail.com"
              className="px-5 py-2.5 bg-magenta text-white rounded-full hover:bg-magenta/90 transition-all shadow-md shadow-magenta/10 hover:shadow-lg"
            >
              {menu.contact}
            </a>
          )}
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

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-black/5 backdrop-blur-[2px]" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Dropdown */}
      <div 
        className={`fixed top-[75px] right-4 z-50 w-72 max-w-[calc(100vw-32px)] bg-white md:hidden transition-all duration-300 origin-top-right border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl max-h-[calc(100dvh-90px)] overflow-y-auto overscroll-contain ${
          isMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-2">
          {session?.user && (
            <div className="px-4 py-3 mb-2 flex items-center justify-between bg-purple-50 rounded-2xl border border-purple-100 mx-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-900">{session.user.name || '안심 연구원'}님</span>
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-100/80 px-3 py-1.5 rounded-xl transition flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>로그아웃</span>
              </button>
            </div>
          )}

          {/* Mobile Search area */}
          <div className="px-4 py-3 mb-1 bg-gray-50/50 rounded-2xl border border-gray-50 flex items-center justify-between">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">{menu.searchLabel}</span>
             <LiveSearch />
          </div>


          <nav className="flex flex-col gap-0.5">
            {isMapPage && (
              <>
                <a 
                  href="https://www.magentalabblog.com" 
                  className="px-5 py-3.5 rounded-2xl text-[15px] font-black text-white bg-magenta hover:bg-magenta/90 transition-all flex items-center justify-between shadow-md shadow-magenta/20 mb-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>블로그 보러가기 (메인)</span>
                  <ExternalLink className="w-4 h-4 text-white" />
                </a>
                <div className="h-px bg-gray-100 mx-4 my-0.5" />
              </>
            )}
            <a 
              href={getNavLink(menu.aboutLink)} 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >

              {menu.about}
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </a>
            <div className="h-px bg-gray-50 mx-4" />
            <a 
              href={getNavLink(menu.aboutAnsimLink)} 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >
              {menu.aboutAnsim}
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </a>
            <div className="h-px bg-gray-50 mx-4" />
            <a 
              href={getNavLink(menu.bcsLink)} 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >
              {menu.bcs}
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </a>
            <div className="h-px bg-gray-50 mx-4" />
            <a 
              href={getNavLink(menu.ageLink)} 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >
              {menu.age}
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </a>
            <div className="h-px bg-gray-50 mx-4" />
            <a 
              href={getNavLink(menu.dmLink)} 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >
              {menu.dm}
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </a>
            <div className="h-px bg-gray-50 mx-4" />
            <a 
              href={getNavLink(menu.emergencyLink)} 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >
              {menu.emergency}
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </a>
            <div className="h-px bg-gray-50 mx-4" />
            <a 
              href={getNavLink(menu.patellaLink)} 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >
              {menu.patella}
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </a>
            <div className="h-px bg-gray-50 mx-4" />
            <a 
              href={getNavLink(menu.petCareLink)} 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >
              {menu.petCare}
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </a>
            <div className="h-px bg-gray-50 mx-4" />
            <a 
              href={getNavLink(menu.ficLink)} 
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-700 hover:bg-magenta-light/30 hover:text-magenta transition-all flex items-center justify-between group"
              onClick={() => setIsMenuOpen(false)}
            >
              {menu.fic}
              <span className="text-gray-300 group-hover:text-magenta transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
            </a>
          </nav>

          {!isMapPage && (
            <div className="px-4 py-3 mb-2 flex items-center justify-between bg-gray-50/50 rounded-2xl border border-gray-50 mx-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Language</span>
              <div className="flex items-center gap-3 text-xs font-bold">
                <Link href={handleLanguageChange("ko")} className={`transition-colors hover:text-magenta ${!isEn && !isJa ? "text-magenta font-black" : "text-gray-400"}`} onClick={() => setIsMenuOpen(false)}>한국어</Link>
                <span className="text-gray-200">|</span>
                <Link href={handleLanguageChange("en")} className={`transition-colors hover:text-magenta ${isEn ? "text-magenta font-black" : "text-gray-400"}`} onClick={() => setIsMenuOpen(false)}>English</Link>
                <span className="text-gray-200">|</span>
                <Link href={handleLanguageChange("ja")} className={`transition-colors hover:text-magenta ${isJa ? "text-magenta font-black" : "text-gray-400"}`} onClick={() => setIsMenuOpen(false)}>日本語</Link>
              </div>
            </div>
          )}

          <div className="mt-1.5 p-1.5 border-t border-gray-50">
            <a 
              href="mailto:smagentalab@gmail.com"
              className="flex items-center justify-center w-full py-3.5 bg-magenta text-white text-[15px] font-bold rounded-xl shadow-lg shadow-magenta/10 hover:bg-magenta/90 transition-all active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              {menu.contact}
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
