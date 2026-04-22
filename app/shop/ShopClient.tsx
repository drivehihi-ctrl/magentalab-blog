"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { supabase } from "@/lib/supabase";

// ─── 카테고리 (아시아허브마트 스타일 이모지 바) ──────────────────
const CATEGORIES = [
  { id: "all", label: "전체", emoji: "✨" },
  { id: "food", label: "사료·간식", emoji: "🍖" },
  { id: "supplement", label: "영양제", emoji: "💊" },
  { id: "hygiene", label: "위생·목욕", emoji: "🛁" },
  { id: "toy", label: "장난감", emoji: "🎾" },
  { id: "bedding", label: "침구·하우스", emoji: "🏠" },
  { id: "fashion", label: "의류·악세", emoji: "👗" },
];

// ─── 상품 데이터 (기본 Mock) ──────────────────────────────────────────
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "안심 오메가-3 연구소 에디션",
    brand: "마젠타랩",
    price: 34000,
    originalPrice: 45000,
    category: "supplement",
    image: "https://images.unsplash.com/photo-1550572017-edb418de4315?q=80&w=600&auto=format&fit=crop",
    badge: "BEST",
    badgeColor: "#E5007E",
    rating: 4.9,
    reviewCount: 312,
    tag: "관절·피모 건강에 도움",
  },
  {
    id: 2,
    name: "스트레스 완화 릴렉스 껌",
    brand: "마젠타랩",
    price: 18900,
    originalPrice: null,
    category: "food",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop",
    badge: "NEW",
    badgeColor: "#7C3AED",
    rating: 4.7,
    reviewCount: 188,
    tag: "천연 유래 성분",
  },
  {
    id: 3,
    name: "저자극 포스트바이오틱 샴푸",
    brand: "마젠타랩",
    price: 22000,
    originalPrice: 28000,
    category: "hygiene",
    image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=600&auto=format&fit=crop",
    badge: "SALE",
    badgeColor: "#F59E0B",
    rating: 4.8,
    reviewCount: 245,
    tag: "민감성 피부 전용",
  },
  {
    id: 4,
    name: "인터랙티브 깃털 낚싯대",
    brand: "마젠타랩",
    price: 12500,
    originalPrice: null,
    category: "toy",
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=600&auto=format&fit=crop",
    badge: null,
    badgeColor: null,
    rating: 4.6,
    reviewCount: 92,
    tag: "고양이 본능 자극",
  },
  {
    id: 5,
    name: "메모리폼 쿠션 도넛 하우스",
    brand: "마젠타랩",
    price: 48000,
    originalPrice: 62000,
    category: "bedding",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=600&auto=format&fit=crop",
    badge: "BEST",
    badgeColor: "#E5007E",
    rating: 4.9,
    reviewCount: 421,
    tag: "세탁기 사용 가능",
  },
  {
    id: 6,
    name: "프리미엄 기능성 하네스",
    brand: "마젠타랩",
    price: 32000,
    originalPrice: 38000,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?q=80&w=600&auto=format&fit=crop",
    badge: null,
    badgeColor: null,
    rating: 4.5,
    reviewCount: 134,
    tag: "반사 소재 안전 설계",
  },
  {
    id: 7,
    name: "유기농 치킨 트릿",
    brand: "마젠타랩",
    price: 15500,
    originalPrice: 19000,
    category: "food",
    image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=600&auto=format&fit=crop",
    badge: "SALE",
    badgeColor: "#F59E0B",
    rating: 4.8,
    reviewCount: 278,
    tag: "100% 유기농 원료",
  },
  {
    id: 8,
    name: "프로바이오틱 장 건강 파우더",
    brand: "마젠타랩",
    price: 29000,
    originalPrice: null,
    category: "supplement",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop",
    badge: "NEW",
    badgeColor: "#7C3AED",
    rating: 4.7,
    reviewCount: 156,
    tag: "장내 유익균 증식",
  },
];

// ─── 케어 가이드 영상 (아시아허브마트 쿠킹클래스 대응) ────────────
const CARE_GUIDES = [
  {
    id: 1,
    title: "올바른 양치 습관 만들기",
    subtitle: "안심이의 치아 관리 가이드",
    emoji: "🦷",
    gradient: "linear-gradient(135deg, #E5007E 0%, #FF6B9D 100%)",
  },
  {
    id: 2,
    title: "환절기 피부 관리법",
    subtitle: "민감한 피부를 위한 케어 루틴",
    emoji: "🧴",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
  },
  {
    id: 3,
    title: "산책 후 발바닥 관리",
    subtitle: "발패드 보호 & 마사지 방법",
    emoji: "🐾",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
  },
];

const DISCOVERY_BANNERS = [
  {
    id: 1,
    title: "안심이의 이번 주 PICK 🐾",
    sub: "AI 연구팀이 직접 테스트한 진짜 좋은 것들",
    bg: "linear-gradient(135deg, #E5007E 0%, #7C3AED 100%)",
    emoji: "🔬",
  },
  {
    id: 2,
    title: "봄맞이 반려동물 케어 세트",
    sub: "환절기를 건강하게! 베스트 조합 추천",
    bg: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
    emoji: "🌸",
  },
  {
    id: 3,
    title: "첫 구매 10% 할인 쿠폰",
    sub: "지금 가입하면 바로 사용 가능!",
    bg: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    emoji: "🎁",
  },
];

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

function discountRate(price: number, original: number) {
  return Math.round((1 - price / original) * 100);
}

// ─── CSS Keyframes (앱 전역 주입) ─────────────────────────────────
function GlobalShopStyles() {
  return (
    <style>{`
      @keyframes shopFadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes shopSlideIn {
        from { opacity: 0; transform: translateX(-12px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes shopPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes shopFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .shop-fade-up {
        animation: shopFadeUp 0.5s ease-out both;
      }
      .shop-slide-in {
        animation: shopSlideIn 0.4s ease-out both;
      }
      .shop-card-hover {
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }
      .shop-card-hover:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(229,0,126,0.12);
      }
      .shop-btn-hover {
        transition: all 0.2s ease;
      }
      .shop-btn-hover:hover {
        transform: scale(1.04);
        filter: brightness(1.08);
      }
      .shop-btn-hover:active {
        transform: scale(0.97);
      }
      .shop-scrollbar-hide {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .shop-scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .shop-badge-pulse {
        animation: shopPulse 2s ease-in-out infinite;
      }
      .shop-float {
        animation: shopFloat 3s ease-in-out infinite;
      }
      .shop-hero-title {
        font-size: 32px;
        line-height: 1.25;
      }
      @media (min-width: 768px) {
        .shop-hero-title {
          font-size: 44px;
        }
      }

      /* Responsive Container & Grid */
      .shop-main-container {
        width: 100%;
        margin: 0 auto;
        max-width: 500px;
        transition: max-width 0.3s ease;
      }
      .shop-product-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      .shop-tab-bar {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 500px;
        z-index: 100;
        transition: all 0.3s ease;
      }

      @media (min-width: 768px) {
        .shop-main-container {
          max-width: 100%;
          padding-left: 40px;
          padding-right: 40px;
        }
        .shop-product-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
      }

      @media (min-width: 1024px) {
        .shop-main-container {
          max-width: 1440px; /* 기존 1200px에서 확장 */
        }
        .shop-product-grid {
          grid-template-columns: repeat(5, 1fr); /* 기존 4열에서 대화면 5열로 */
          gap: 24px;
        }
        .shop-tab-bar {
          bottom: 0px;
          max-width: 100%; /* PC에서도 꽉 차게 변경 */
          border-radius: 0px; /* 하단 고정형으로 변경 */
          border: none;
          border-top: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
          background: rgba(255,255,255,0.98) !important;
        }
        .shop-section-px {
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
      }
    `}</style>
  );
}

// ─── 하단 탭바 아이콘 ─────────────────────────────────────────────
function IconDiscover({ active }: { active: boolean }) {
  const c = active ? "#E5007E" : "#94a3b8";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? c : "none"} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconShop({ active }: { active: boolean }) {
  const c = active ? "#E5007E" : "#94a3b8";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconCart({ active }: { active: boolean }) {
  const c = active ? "#E5007E" : "#94a3b8";
  return (
    <div style={{ position: "relative" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
      {/* 장바구니 배지 (아시아허브마트 스타일) */}
      <span style={{
        position: "absolute", top: "-5px", right: "-8px",
        background: "#EF4444", color: "#fff", fontSize: "10px", fontWeight: 800,
        width: "16px", height: "16px", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "2px solid #fff"
      }}>
        3
      </span>
    </div>
  );
}
function IconMy({ active }: { active: boolean }) {
  const c = active ? "#E5007E" : "#94a3b8";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconRequest({ active }: { active: boolean }) {
  const c = active ? "#E5007E" : "#94a3b8";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

// ─── 프로덕트 카드 공통 ──────────────────────────────────────────
function ProductCard({ p, index, variant = "grid" }: { p: any; index: number; variant?: "grid" | "scroll" }) {
  const isScroll = variant === "scroll";

  return (
    <Link
      href={`/shop/${p.id}`}
      className="shop-card-hover shop-fade-up"
      style={{
        animationDelay: `${index * 0.08}s`,
        minWidth: isScroll ? "156px" : undefined,
        width: isScroll ? "156px" : undefined,
        background: "#fff",
        borderRadius: "18px",
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.05)",
        flex: isScroll ? "0 0 auto" : undefined,
      }}
    >
      {/* 이미지 */}
      <div style={{ position: "relative", width: "100%", paddingTop: isScroll ? undefined : "100%", height: isScroll ? "156px" : undefined }}>
        <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} sizes={isScroll ? "156px" : "(max-width: 500px) 50vw, 200px"} />
        {p.badge && (
          <div
            className="shop-badge-pulse"
            style={{
              position: "absolute", top: "8px", left: "8px",
              background: p.badgeColor || "#E5007E", color: "#fff",
              fontSize: "9px", fontWeight: 800, padding: "3px 8px",
              borderRadius: "8px", letterSpacing: "0.06em",
              boxShadow: `0 2px 8px ${p.badgeColor || "#E5007E"}44`,
            }}
          >
            {p.badge}
          </div>
        )}
        {/* 하트 버튼 */}
        <button
          className="shop-btn-hover"
          style={{
            position: "absolute", top: "8px", right: "8px",
            background: "rgba(255,255,255,0.92)", border: "none",
            borderRadius: "50%", width: "30px", height: "30px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", backdropFilter: "blur(4px)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="#9CA3AF" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* 정보 */}
      <div style={{ padding: "10px 11px 13px" }}>
        <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "2px", fontWeight: 500 }}>{p.brand}</div>
        <div style={{
          fontSize: "13px", fontWeight: 700, color: "#111", marginBottom: "4px",
          lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {p.name}
        </div>
        <div style={{ fontSize: "10px", color: "#E5007E", fontWeight: 600, marginBottom: "6px" }}>{p.tag}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "7px" }}>
          <span style={{ color: "#F59E0B", fontSize: "11px" }}>★</span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#374151" }}>{p.rating}</span>
          <span style={{ fontSize: "10px", color: "#9CA3AF" }}>({p.reviewCount})</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            {p.originalPrice && (
              <div style={{ fontSize: "10px", color: "#9CA3AF", textDecoration: "line-through" }}>{formatPrice(p.originalPrice)}</div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {p.originalPrice && (
                <span style={{ fontSize: "12px", color: "#EF4444", fontWeight: 800 }}>{discountRate(p.price, p.originalPrice)}%</span>
              )}
              <span style={{ fontSize: "15px", fontWeight: 800, color: "#111" }}>{formatPrice(p.price)}</span>
            </div>
          </div>
          <button
            className="shop-btn-hover"
            style={{
              background: "linear-gradient(135deg, #E5007E 0%, #FF4DA6 100%)",
              color: "#fff", border: "none", borderRadius: "10px",
              padding: "7px 11px", fontSize: "11px", fontWeight: 700, cursor: "pointer",
              boxShadow: "0 2px 8px rgba(229,0,126,0.25)",
            }}
          >
            담기
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── 디스커버리 탭 (아시아허브마트 메인 스타일) ─────────────────────
function DiscoveryTab({ products }: { products: any[] }) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIdx(i => (i + 1) % DISCOVERY_BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (bannerRef.current) {
      const scrollTo = bannerIdx * (bannerRef.current.scrollWidth / DISCOVERY_BANNERS.length);
      bannerRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, [bannerIdx]);

  return (
    <div style={{ paddingBottom: "86px" }}>
      {/* 상단 히어로 섹션 (아시아허브마트 스타일) */}
      <div 
        className="shop-section-px"
        style={{
          padding: "60px 20px 80px",
          background: "#E5007E",
          textAlign: "center",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 데코 효과 */}
        <div style={{
          position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px",
          background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(40px)"
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", left: "-30px", width: "150px", height: "150px",
          background: "rgba(0,0,0,0.05)", borderRadius: "50%", filter: "blur(30px)"
        }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.9)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em" }}>
            마젠타랩 전용몰
          </div>
          <span style={{ 
            fontSize: "10px", 
            fontWeight: 900, 
            background: "rgba(255,255,255,0.2)", 
            color: "#fff", 
            padding: "2px 8px", 
            borderRadius: "4px",
            letterSpacing: "0.05em",
            backdropFilter: "blur(4px)"
          }}>BETA</span>
        </div>
        <h1 
          className="shop-hero-title"
          style={{ fontWeight: 800, color: "#fff", margin: "0 0 24px", letterSpacing: "-0.02em" }}
        >
          오늘 우리 아이에게<br />
          특별한 선물을 줄게요 🐾
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, fontWeight: 500, maxWidth: "500px", margin: "0 auto" }}>
          연구진이 엄선한 아이템을 발견하세요.<br />
          마젠타랩이 함께 합니다.
        </p>

        {/* 액션 버튼 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "32px" }}>
          <button style={{
            background: "#fff", color: "#E5007E", border: "none", borderRadius: "12px",
            padding: "12px 24px", fontSize: "14px", fontWeight: 800, cursor: "pointer"
          }}>쇼핑하기</button>
          <button style={{
            background: "rgba(0,0,0,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "12px",
            padding: "12px 24px", fontSize: "14px", fontWeight: 800, cursor: "pointer"
          }}>문의하기</button>
        </div>
      </div>

      {/* 검색바 */}
      <div className="shop-section-px" style={{ padding: "0 20px 18px" }}>
        <div
          className="shop-btn-hover"
          style={{
            background: "#F3F4F6", borderRadius: "16px",
            padding: "13px 16px", display: "flex", alignItems: "center", gap: "10px",
            cursor: "pointer", border: "2px solid transparent",
            transition: "border-color 0.2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "14px", color: "#9CA3AF" }}>제품명, 브랜드, 카테고리 검색</span>
        </div>
      </div>

      {/* 배너 슬라이드 (자동 회전) */}
      <div
        ref={bannerRef}
        className="shop-scrollbar-hide"
        style={{ padding: "0 20px 20px", display: "flex", gap: "12px", overflowX: "auto" }}
      >
        {DISCOVERY_BANNERS.map((b, i) => (
          <div
            key={b.id}
            className="shop-fade-up"
            style={{
              animationDelay: `${i * 0.12}s`,
              minWidth: "280px", borderRadius: "22px",
              background: b.bg, padding: "24px 22px", color: "#fff",
              flex: "0 0 auto", position: "relative", overflow: "hidden",
            }}
          >
            {/* 데코 원 */}
            <div style={{
              position: "absolute", top: "-20px", right: "-20px",
              width: "100px", height: "100px", borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
            }} />
            <div className="shop-float" style={{ fontSize: "36px", marginBottom: "10px" }}>{b.emoji}</div>
            <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "6px", position: "relative" }}>{b.title}</div>
            <div style={{ fontSize: "12px", opacity: 0.88, position: "relative" }}>{b.sub}</div>
          </div>
        ))}
      </div>

      {/* 배너 인디케이터 */}
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", paddingBottom: "20px" }}>
        {DISCOVERY_BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setBannerIdx(i)}
            style={{
              width: bannerIdx === i ? "20px" : "6px", height: "6px",
              borderRadius: "3px", border: "none", cursor: "pointer",
              background: bannerIdx === i ? "#E5007E" : "#D1D5DB",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* 카테고리 이모지 그리드 (아시아허브마트 스타일) */}
      <div className="shop-section-px" style={{ padding: "0 20px 24px" }}>
        <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "14px", color: "#111" }}>카테고리</div>
        <div
          className="shop-scrollbar-hide"
          style={{ display: "flex", gap: "10px", overflowX: "auto" }}
        >
          {CATEGORIES.slice(1).map((c, i) => (
            <button
              key={c.id}
              className="shop-btn-hover shop-fade-up"
              style={{
                animationDelay: `${i * 0.06}s`,
                background: "linear-gradient(145deg, #FFF5FA 0%, #FFF0F6 100%)",
                borderRadius: "16px", padding: "14px 16px", border: "1px solid rgba(229,0,126,0.08)",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", gap: "6px", minWidth: "72px", flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "26px" }}>{c.emoji}</span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🎬 안심이 케어 가이드 (아시아허브마트 쿠킹클래스 대응) */}
      <div className="shop-section-px" style={{ padding: "0 20px 24px" }}>
        <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px", color: "#111" }}>🎬 안심이 케어 가이드</div>
        <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "14px" }}>영상을 보고, 아래 추천 제품으로 바로 케어해 보세요!</div>
        <div className="shop-scrollbar-hide" style={{ display: "flex", gap: "12px", overflowX: "auto" }}>
          {CARE_GUIDES.map((g, i) => (
            <div
              key={g.id}
              className="shop-card-hover shop-fade-up"
              style={{
                animationDelay: `${i * 0.1}s`,
                minWidth: "200px", borderRadius: "18px",
                background: g.gradient, padding: "22px 18px",
                color: "#fff", flex: "0 0 auto", position: "relative",
                overflow: "hidden", cursor: "pointer",
              }}
            >
              <div style={{
                position: "absolute", top: "-15px", right: "-15px",
                width: "80px", height: "80px", borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
              }} />
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>{g.emoji}</div>
              <div style={{ fontSize: "14px", fontWeight: 800, marginBottom: "4px", position: "relative" }}>{g.title}</div>
              <div style={{ fontSize: "11px", opacity: 0.85, position: "relative" }}>{g.subtitle}</div>
              <div style={{
                marginTop: "14px", display: "inline-flex", alignItems: "center", gap: "5px",
                background: "rgba(255,255,255,0.25)", borderRadius: "10px", padding: "6px 10px",
                fontSize: "11px", fontWeight: 700,
              }}>
                ▶ 영상보기
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 베스트셀러 가로 스크롤 */}
      <div style={{ paddingBottom: "24px" }}>
        <div className="shop-section-px" style={{ padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#111" }}>🔥 베스트셀러</div>
          <span style={{ fontSize: "12px", color: "#E5007E", fontWeight: 600, cursor: "pointer" }}>전체보기</span>
        </div>
        <div className="shop-scrollbar-hide" style={{ display: "flex", gap: "12px", paddingLeft: "20px", paddingRight: "8px", overflowX: "auto" }}>
          {products.filter((p: any) => p.badge === "BEST").map((p: any, i: number) => (
            <ProductCard key={p.id} p={p} index={i} variant="scroll" />
          ))}
        </div>
      </div>

      {/* 🆕 신상품 가로 스크롤 */}
      <div style={{ paddingBottom: "24px" }}>
        <div className="shop-section-px" style={{ padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#111" }}>🆕 신상품</div>
          <span style={{ fontSize: "12px", color: "#7C3AED", fontWeight: 600, cursor: "pointer" }}>전체보기</span>
        </div>
        <div className="shop-scrollbar-hide" style={{ display: "flex", gap: "12px", paddingLeft: "20px", paddingRight: "8px", overflowX: "auto" }}>
          {products.filter((p: any) => p.badge === "NEW").map((p: any, i: number) => (
            <ProductCard key={p.id} p={p} index={i} variant="scroll" />
          ))}
        </div>
      </div>

      {/* 안심이 AI 추천 배너 */}
      <div
        className="shop-fade-up shop-section-px"
        style={{
          margin: "0 20px 24px",
          background: "linear-gradient(135deg, #1A1025 0%, #2D1B4E 50%, #1A1025 100%)",
          borderRadius: "22px", padding: "22px", display: "flex", alignItems: "center", gap: "16px",
          position: "relative", overflow: "hidden", cursor: "pointer",
        }}
      >
        {/* 데코 */}
        <div style={{
          position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px",
          borderRadius: "50%", background: "rgba(229,0,126,0.12)",
        }} />
        <div style={{
          position: "absolute", bottom: "-20px", left: "40%", width: "80px", height: "80px",
          borderRadius: "50%", background: "rgba(124,58,237,0.1)",
        }} />
        <div className="shop-float" style={{ fontSize: "44px", position: "relative" }}>🤖</div>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "10px", color: "#E5007E", fontWeight: 700, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            AI 연구원 안심이
          </div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "6px", lineHeight: 1.4 }}>
            우리 아이 맞춤 제품<br />추천받기
          </div>
          <div style={{ fontSize: "11px", color: "#9CA3AF" }}>현재 3,200+ 반려인이 이용 중</div>
        </div>
      </div>

      {/* 할인 상품 그리드 */}
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "14px", color: "#111" }}>💰 할인 중인 상품</div>
        <div className="shop-product-grid">
          {products.filter((p: any) => p.original_price || p.originalPrice).map((p: any, i: number) => (
            <ProductCard key={p.id} p={p} index={i} variant="grid" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 샵 탭 (전체 상품, 카테고리 필터) ──────────────────────────────
function ShopTab({ products }: { products: any[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortLabel, setSortLabel] = useState("추천순");

  const filtered = activeCategory === "all"
    ? products
    : products.filter((p: any) => p.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortLabel === "인기순") return b.reviewCount - a.reviewCount;
    if (sortLabel === "낮은가격순") return a.price - b.price;
    if (sortLabel === "높은가격순") return b.price - a.price;
    return b.rating - a.rating; // 추천순 = 평점순
  });

  const sortOptions = ["추천순", "인기순", "낮은가격순", "높은가격순"];

  return (
    <div style={{ paddingBottom: "86px" }}>
      {/* 헤더 */}
      <div className="shop-section-px" style={{ padding: "20px 20px 0", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#111", margin: 0 }}>Shop</h2>
            <span style={{ 
              fontSize: "9px", 
              fontWeight: 800, 
              background: "#F3F4F6", 
              color: "#9CA3AF", 
              padding: "2px 6px", 
              borderRadius: "4px",
              letterSpacing: "0.05em"
            }}>BETA</span>
          </div>
          <div style={{ fontSize: "12px", color: "#9CA3AF" }}>반려동물 전용 쇼핑몰</div>
        </div>
        <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "14px" }}>
          신뢰할 수 있는 제품만 모았습니다
        </div>

        {/* 카테고리 가로 스크롤 탭 */}
        <div className="shop-scrollbar-hide" style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "14px" }}>
          {CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className="shop-slide-in"
              style={{
                animationDelay: `${i * 0.04}s`,
                whiteSpace: "nowrap", padding: "8px 16px", borderRadius: "50px",
                border: activeCategory === c.id ? "none" : "1px solid #E5E7EB",
                cursor: "pointer", fontSize: "13px", fontWeight: 600,
                background: activeCategory === c.id
                  ? "linear-gradient(135deg, #E5007E 0%, #FF4DA6 100%)"
                  : "#fff",
                color: activeCategory === c.id ? "#fff" : "#6B7280",
                transition: "all 0.25s ease",
                flexShrink: 0,
                boxShadow: activeCategory === c.id ? "0 2px 10px rgba(229,0,126,0.3)" : "none",
              }}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 정렬 / 개수 */}
      <div className="shop-section-px" style={{
        padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid #F3F4F6",
      }}>
        <span style={{ fontSize: "13px", color: "#9CA3AF" }}>
          총 <b style={{ color: "#111" }}>{sorted.length}</b>개 상품
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          {sortOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setSortLabel(opt)}
              style={{
                fontSize: "11px", fontWeight: sortLabel === opt ? 700 : 500,
                color: sortLabel === opt ? "#E5007E" : "#9CA3AF",
                background: "none", border: "none", cursor: "pointer",
                padding: "4px 6px", borderRadius: "6px",
                backgroundColor: sortLabel === opt ? "#FFF0F7" : "transparent",
                transition: "all 0.2s",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 그리드 */}
      <div style={{ padding: "14px 16px 0" }} className="shop-product-grid">
        {sorted.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} variant="grid" />
        ))}
      </div>

      {sorted.length === 0 && (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>해당 카테고리에 상품이 없어요</div>
          <div style={{ fontSize: "13px", color: "#9CA3AF" }}>다른 카테고리를 확인해보세요!</div>
        </div>
      )}
    </div>
  );
}

// ─── 장바구니 탭 ─────────────────────────────────────────────────
function CartTab() {
  return (
    <div style={{
      paddingBottom: "86px", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: "40px 20px 86px",
    }}>
      <div className="shop-float" style={{ fontSize: "72px", marginBottom: "20px" }}>🛒</div>
      <div className="shop-fade-up" style={{ fontSize: "20px", fontWeight: 800, color: "#111", marginBottom: "8px" }}>
        장바구니가 비어있어요
      </div>
      <div className="shop-fade-up" style={{ animationDelay: "0.1s", fontSize: "14px", color: "#9CA3AF", marginBottom: "32px", textAlign: "center", lineHeight: 1.6 }}>
        마음에 드는 상품을 담아보세요!<br />
        안심이가 추천하는 제품을 확인해보세요 🐾
      </div>
      <button
        className="shop-btn-hover shop-fade-up"
        style={{
          animationDelay: "0.2s",
          background: "linear-gradient(135deg, #E5007E 0%, #FF4DA6 100%)",
          color: "#fff", border: "none", borderRadius: "16px", padding: "16px 36px",
          fontSize: "15px", fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 16px rgba(229,0,126,0.3)",
        }}
      >
        쇼핑 시작하기
      </button>
    </div>
  );
}

// ─── 마이 탭 ─────────────────────────────────────────────────────
function MyTab() {
  const { data: session } = useSession();

  const menuItems = [
    { emoji: "❤️", label: "찜한 상품", sub: "0개" },
    { emoji: "⭐", label: "리뷰 관리", sub: "0개" },
    { emoji: "🎟️", label: "쿠폰함", sub: "0개" },
    { emoji: "🐾", label: "반려동물 프로필", sub: "설정하기" },
    { emoji: "💬", label: "1:1 문의", sub: "안심이에게 물어보기" },
    { emoji: "📋", label: "이용약관 / 개인정보", sub: "" },
  ];

  return (
    <div style={{ paddingBottom: "86px" }}>
      {/* 상단 프로필 배너 */}
      <div style={{
        padding: "28px 22px", color: "#fff", position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #E5007E 0%, #7C3AED 50%, #4F46E5 100%)",
      }}>
        {/* 데코 */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px",
          borderRadius: "50%", background: "rgba(255,255,255,0.08)",
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", left: "20%", width: "100px", height: "100px",
          borderRadius: "50%", background: "rgba(255,255,255,0.06)",
        }} />
        <div style={{ fontSize: "12px", opacity: 0.85, marginBottom: "4px", position: "relative" }}>{session ? "반가워요!" : "로그인하고 더 많은 혜택을"}</div>
        <div className="shop-fade-up" style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px", position: "relative" }}>
          {session ? `${session.user?.name}님 👋` : "안녕하세요, 반려인님 👋"}
        </div>
        {!session ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", position: "relative" }}>
            {/* Google Login Button */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/shop" })}
              className="shop-btn-hover"
              style={{
                width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px",
                color: "#374151", padding: "12px", fontSize: "14px", fontWeight: 700, 
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
              </svg>
              구글로 계속하기
            </button>
            {/* Kakao Login Button */}
            <button
              onClick={() => signIn("kakao", { callbackUrl: "/shop" })}
              className="shop-btn-hover"
              style={{
                width: "100%", background: "#FEE500", border: "none", borderRadius: "14px",
                color: "#191919", padding: "12px", fontSize: "14px", fontWeight: 700, 
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                boxShadow: "0 2px 8px rgba(254,229,0,0.15)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.315 6.055-.177.65-.638 2.35-.732 2.72-.116.45.16.44.337.32.14-.095 2.227-1.513 3.123-2.12.63.09 1.28.14 1.957.14 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/>
              </svg>
              카카오로 계속하기
            </button>
            <div style={{ textAlign: "center", marginTop: "8px" }}>
               <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>계정이 없으신가요? 위 버튼으로 가입 가능합니다.</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => signOut()}
            className="shop-btn-hover"
            style={{
              width: "fit-content", background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px",
              color: "#fff", padding: "8px 16px", fontSize: "12px", fontWeight: 700,
              cursor: "pointer", position: "relative"
            }}
          >
            로그아웃
          </button>
        )}
      </div>

      {/* 주문 현황 카드 */}
      <div className="shop-fade-up" style={{
        margin: "16px 16px 12px", background: "#fff", borderRadius: "18px",
        border: "1px solid rgba(0,0,0,0.05)", padding: "18px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}>
        <div style={{ fontWeight: 700, fontSize: "14px", color: "#111", marginBottom: "18px" }}>My 주문현황</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center" }}>
          {[["결제완료", "0"], ["배송중", "0"], ["배송완료", "0"], ["취소/환불", "0"]].map(([label, count]) => (
            <div key={label}>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#E5007E" }}>{count}</div>
              <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div style={{ margin: "0 16px" }}>
        {menuItems.map((item, i) => (
          <div
            key={item.label}
            className="shop-fade-up shop-btn-hover"
            style={{
              animationDelay: `${i * 0.05}s`,
              background: "#fff", borderRadius: "14px",
              marginBottom: "6px", padding: "15px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>{item.emoji}</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>{item.label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {item.sub && <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{item.sub}</span>}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 입고 요청 탭 (Request Tab) ───────────────────────────────────
function RequestTab() {
  const [productName, setProductName] = useState("");
  const [link, setLink] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://submit-form.com/Hu1kJWNOZ", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ productName, link, otherDetails }),
      });

      if (response.ok) {
        alert("입고 신청이 완료되었습니다! 관리자에게 메시지가 전송되었습니다. 🐾");
        setProductName("");
        setLink("");
        setOtherDetails("");
      } else {
        alert("신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error(error);
      alert("서버 통신 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingBottom: "100px", background: "#f8fafc" }}>
      {/* 상단 배너 */}
      <div style={{ position: "relative", width: "100%", borderRadius: "0 0 24px 24px", overflow: "hidden", lineHeight: 0 }}>
        <img 
          src="/images/shop/Request.jpeg" 
          alt="입고 신청 배너"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        {/* 텍스트 오버레이 (필요한 경우) */}
        <div style={{ 
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "20px", background: "rgba(0,0,0,0.1)"
        }}>
          <div style={{ 
            fontSize: "clamp(24px, 8vw, 36px)", fontWeight: 900, color: "#fff", 
            marginBottom: "8px", letterSpacing: "-0.05em",
            textAlign: "center", lineHeight: 1.1,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)"
          }}>
            입고 희망<br />제 품 신 청
          </div>
          <div style={{ 
            fontSize: "clamp(10px, 3vw, 14px)", fontWeight: 700, color: "#fff", 
            background: "rgba(0,0,0,0.5)", padding: "4px 12px", borderRadius: "20px",
            backdropFilter: "blur(4px)"
          }}>
            저품질과 과대광고로 이루어진 제품은 입고가 제한됩니다
          </div>
        </div>
      </div>

      {/* 폼 섹션 */}
      <form onSubmit={handleSubmit} style={{ padding: "24px 20px" }}>
        <div style={{ opacity: isSubmitting ? 0.6 : 1, pointerEvents: isSubmitting ? "none" : "auto" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 700, marginBottom: "8px", color: "#111" }}>
              상품명(*필수)
            </label>
            <input 
              type="text" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required 
              placeholder="상품명을 작성해주세요. (필수)"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0",
                fontSize: "14px", background: "#fff", outline: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 700, marginBottom: "8px", color: "#111" }}>
              링크(*필수)
            </label>
            <input 
              type="text" 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required 
              placeholder="제품이 온라인에 있나요? (필수)"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0",
                fontSize: "14px", background: "#fff", outline: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 700, marginBottom: "8px", color: "#111" }}>
              상품 사진(*오프전용상품은 사진첨부)
            </label>
            <div style={{
              width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0",
              fontSize: "14px", background: "#fff", display: "flex", alignItems: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
            }}>
              <input type="file" style={{ fontSize: "12px", width: "100%" }} />
            </div>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 700, marginBottom: "8px", color: "#111" }}>
              기타사항
            </label>
            <textarea 
              value={otherDetails}
              onChange={(e) => setOtherDetails(e.target.value)}
              placeholder="그 외 기타 사항을 적어주세요. (선택)"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0",
                fontSize: "14px", background: "#fff", outline: "none", minHeight: "100px", resize: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
              }}
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="shop-btn-hover"
            style={{
              width: "100%", padding: "18px", borderRadius: "16px", 
              background: isSubmitting ? "#9CA3AF" : "#4DB6AC", color: "#fff", border: "none",
              fontSize: "16px", fontWeight: 800, cursor: isSubmitting ? "default" : "pointer",
              boxShadow: "0 4px 12px rgba(77, 182, 172, 0.3)"
            }}
          >
            {isSubmitting ? "처리 중..." : "입고 신청"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── 메인 ShopClient ────────────────────────────────────────────
export default function ShopClient() {
  const [activeTab, setActiveTab] = useState<"discovery" | "shop" | "cart" | "request" | "my">("discovery");
  const [products, setProducts] = useState<any[]>(MOCK_PRODUCTS);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Supabase DB 데이터가 있으면 목업 데이터와 합치거나 교체
        const dbProducts = data.map(p => ({
          ...p,
          image: p.image_url || p.image, // DB 필드명 매핑
          originalPrice: p.original_price || p.originalPrice
        }));
        setProducts(dbProducts);
      }
    }
    fetchProducts();
  }, []);

  const tabs = [
    { key: "discovery" as const, label: "Discovery", Icon: IconDiscover },
    { key: "shop" as const, label: "Shop", Icon: IconShop },
    { key: "cart" as const, label: "Cart", Icon: IconCart },
    { key: "request" as const, label: "Request", Icon: IconRequest },
    { key: "my" as const, label: "My", Icon: IconMy },
  ];

  return (
    <div className="shop-main-container" style={{
      minHeight: "100vh",
      background: "#F9FAFB", position: "relative",
      fontFamily: "'Pretendard', 'Inter', system-ui, sans-serif",
    }}>
      <GlobalShopStyles />

      {/* 탭 콘텐츠 */}
      <div style={{ overflowY: "auto", minHeight: "100vh" }}>
        {activeTab === "discovery" && <DiscoveryTab products={products} />}
        {activeTab === "shop" && <ShopTab products={products} />}
        {activeTab === "cart" && <CartTab />}
        {activeTab === "request" && <RequestTab />}
        {activeTab === "my" && <MyTab />}
      </div>

      {/* 하단 탭바 */}
      <nav className="shop-tab-bar" style={{
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom, 0)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
      }}>
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "10px 0 12px", background: "none", border: "none",
              cursor: "pointer", gap: "4px", transition: "all 0.2s",
              position: "relative",
            }}
          >
            {/* 액티브 인디케이터 */}
            {activeTab === key && (
              <div style={{
                position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)",
                width: "24px", height: "3px", borderRadius: "2px",
                background: "linear-gradient(90deg, #E5007E, #FF4DA6)",
              }} />
            )}
            <Icon active={activeTab === key} />
            <span style={{
              fontSize: "10px", fontWeight: 700,
              color: activeTab === key ? "#E5007E" : "#9CA3AF",
              transition: "color 0.2s",
            }}>
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
