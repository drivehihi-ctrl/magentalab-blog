"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { Camera, Plus } from "lucide-react";

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

// ─── 반려동물 연구 프로필 키워드 (Ansim-i's Research Categories) ──────────
const HEALTH_KEYWORDS = [
  { id: "eye", label: "눈/눈물", hashtags: ["#눈물자국", "#안구건조", "#백내장예방"], tip: "반짝이는 눈망울 연구소", emoji: "👀" },
  { id: "skin", label: "피부/모질", hashtags: ["#가려움/알러지", "#각질", "#털빠짐"], tip: "비단결 모질 프로젝트", emoji: "🧴" },
  { id: "joint", label: "관절/뼈", hashtags: ["#슬개골탈구", "#디스크예방", "#활동량저하"], tip: "안심 튼튼 보행 가이드", emoji: "🦴" },
  { id: "digestion", label: "소화/장", hashtags: ["#묽은변/설사", "#구토", "#식욕부진"], tip: "황금변 생성 연구소", emoji: "💩" },
  { id: "dental", label: "구강/치아", hashtags: ["#입냄새", "#치석", "#잇몸건강"], tip: "건강한 미소(Smile) 연구", emoji: "🦷" },
  { id: "weight", label: "체중/다이어트", hashtags: ["#비만관리", "#근력강화", "#노령견영양"], tip: "0.1% 정밀 체중 관리", emoji: "⚖️" },
  { id: "kidney", label: "신장/요로", hashtags: ["#음수량부족", "#결석예방", "#신부전케어"], tip: "마젠타랩의 핵심 연구 분야!", emoji: "💧" },
  { id: "emotion", label: "심리/행동", hashtags: ["#분리불안", "#스트레스", "#사회성"], tip: "행복한 멍냥이 심리 상담", emoji: "🧠" },
];

interface PetProfile {
  id: string;
  name: string;
  type: "dog" | "cat";
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  breed: string;
  keywords: string[];
  photo_url?: string;
  updatedAt?: number;
}

/**
 * 만 나이와 개월 수를 정밀하게 계산하는 함수 (마젠타 연구소 0.1% 정밀 로직)
 */
const calculatePreciseAge = (year: number, month: number, day: number = 1) => {
  const now = new Date();
  const birthDate = new Date(year, month - 1, day);
  
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  
  if (now.getDate() < birthDate.getDate()) {
    months--;
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months };
};

const formatAgeString = (years: number, months: number) => {
  if (years === 0) return `${months}개월 연구원`;
  if (months === 0) return `${years}세 연구원`;
  return `${years}세 ${months}개월 연구원`;
};

// calculateAge 함수 제거 (calculatePreciseAge로 통합)

/**
 * 마젠타 연구소 정밀 이미지 처리 (400x400 Crop + 80% 압축)
 */
const processImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new (window as any).Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas context error");

        const size = Math.min(img.width, img.height);
        canvas.width = 400;
        canvas.height = 400;

        // 중앙 크롭 및 리사이징
        ctx.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          400,
          400
        );

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject("Blob conversion error");
          },
          "image/jpeg",
          0.8
        );
      };
      img.onerror = reject;
      img.src = e.target?.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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

// ─── 케어 가이드 (DB 연동 전 기본값) ────────────────────
let DEFAULT_CARE_GUIDES = [
  {
    id: 1,
    title: "올바른 양치 습관 만들기",
    subtitle: "안심이의 치아 관리 가이드",
    emoji: "🦷",
    gradient: "linear-gradient(135deg, #E5007E 0%, #FF6B9D 100%)",
  },
];

// ─── 디스커버리 배너 (DB 연동 전 기본값) ─────────────────────
let DEFAULT_BANNERS = [
  {
    id: 1,
    title: "안심이의 이번 주 PICK 🐾",
    sub: "AI 연구팀이 직접 테스트한 진짜 좋은 것들",
    bg: "#E5007E",
    emoji: "🔬",
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
      @keyframes shopGlow {
        0%, 100% { box-shadow: 0 0 10px rgba(229, 0, 126, 0.4), 0 0 20px rgba(229, 0, 126, 0.2); }
        50% { box-shadow: 0 0 20px rgba(229, 0, 126, 0.6), 0 0 40px rgba(229, 0, 126, 0.4); }
      }
      .shop-avatar-active {
        animation: shopGlow 2s ease-in-out infinite;
        border: 3px solid #E5007E !important;
        transform: scale(1.1);
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
          max-width: 100% !important; /* 모니터 끝까지 확장 (아시아허브마트 스타일) */
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
      href={p.details_link || `/shop/${p.id}`}
      target={p.details_link?.startsWith('http') ? "_blank" : undefined}
      rel={p.details_link?.startsWith('http') ? "noopener noreferrer" : undefined}
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
function DiscoveryTab({ products, banners, careGuides, session, activePet, onOpenModal, logoUrl }: { products: any[]; banners: any[]; careGuides: any[]; session: any; activePet: PetProfile | null; onOpenModal: () => void; logoUrl: string }) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const displayBanners = banners.length > 0 ? banners : DEFAULT_BANNERS;
  const displayGuides = careGuides.length > 0 ? careGuides : DEFAULT_CARE_GUIDES;

  useEffect(() => {
    if (displayBanners.length <= 1) return;
    const timer = setInterval(() => {
      setBannerIdx(i => (i + 1) % displayBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayBanners]);

  useEffect(() => {
    if (bannerRef.current) {
      const scrollTo = bannerIdx * (bannerRef.current.scrollWidth / displayBanners.length);
      bannerRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, [bannerIdx, displayBanners]);

  const getYTId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div style={{ paddingBottom: "86px" }}>
      {selectedVideo && (
        <VideoModal url={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
      {/* 상단 히어로 섹션 (아시아허브마트 스타일) */}
      <div 
        className="shop-section-px"
        style={{
          padding: "80px 20px 100px",
          background: "linear-gradient(to bottom, #88004D, #660039)",
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

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
          <img 
            src={logoUrl} 
            alt="Magenta Lab Logo"
            style={{ width: "120px", height: "auto", marginBottom: "16px" }} 
          />
          <div style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>MAGENTA LAB</div>
          <div style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Pet Wellness Research Institute</div>
        </div>

        <h1 
          className="shop-hero-title"
          style={{ fontSize: "32px", fontWeight: 900, color: "#fff", margin: "0 0 24px", letterSpacing: "-0.03em", lineHeight: 1.2 }}
        >
          {activePet ? `${activePet.name} 연구원을 위한` : "세상의 모든 아이를 위한"}<br />
          정밀 케어 솔루션 🐾
        </h1>

        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, fontWeight: 500, maxWidth: "500px", margin: "0 auto" }}>
          연구진이 엄선한 아이템을 발견하세요.<br />
          마젠타랩이 함께 합니다.
        </p>

        {/* 액션 버튼 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "32px" }}>
          <button 
            onClick={() => {
              if (typeof window !== "undefined") {
                const { setActiveTab }: any = window as any;
                if (setActiveTab) setActiveTab("shop");
              }
            }}
            style={{
              background: "#fff", color: "#E5007E", border: "none", borderRadius: "12px",
              padding: "12px 24px", fontSize: "14px", fontWeight: 800, cursor: "pointer"
            }}
          >쇼핑하기</button>
          <button 
            onClick={() => {
              if (typeof window !== "undefined") {
                const { setActiveTab, setActiveSubPage }: any = window as any;
                if (setActiveTab) setActiveTab("my");
                if (setActiveSubPage) setActiveSubPage("consultation");
              }
            }}
            style={{
              background: "rgba(0,0,0,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "12px",
              padding: "12px 24px", fontSize: "14px", fontWeight: 800, cursor: "pointer"
            }}
          >문의하기</button>
        </div>
      </div>

      {/* 검색바 삭제됨 (Shop 탭으로 이동) */}

      {/* 배너 슬라이드 (자동 회전) */}
      <div
        ref={bannerRef}
        className="shop-scrollbar-hide"
        style={{ padding: "0 20px 20px", display: "flex", gap: "12px", overflowX: "auto" }}
      >
        {displayBanners.map((b, i) => (
          <div
            key={b.id}
            className="shop-fade-up"
            style={{
              animationDelay: `${i * 0.12}s`,
              minWidth: b.banner_type === "story" ? "180px" : "280px",
              aspectRatio: b.banner_type === "story" ? "9/16" : "auto",
              height: b.banner_type === "story" ? "auto" : "160px",
              borderRadius: "22px",
              background: b.image_url ? `url(${b.image_url}) center/cover no-repeat` : (b.bg || b.bg_gradient),
              padding: "24px 22px", color: "#fff",
              flex: "0 0 auto", position: "relative", overflow: "hidden",
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
            }}
          >
            {/* 데코 원 (이미지 없을 때만 노출) */}
            {!b.image_url && (
              <div style={{
                position: "absolute", top: "-20px", right: "-20px",
                width: "100px", height: "100px", borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
              }} />
            )}
            
            {/* 이미지 위 오버레이 (가독성 향상) */}
            {b.image_url && (
              <div style={{ 
                position: "absolute", inset: 0, 
                background: b.banner_type === "story" 
                  ? "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)" 
                  : "rgba(0,0,0,0.2)" 
              }} />
            )}

            <div style={{ position: "relative", zIndex: 1 }}>
              {b.emoji && <div className="shop-float" style={{ fontSize: b.banner_type === "story" ? "28px" : "36px", marginBottom: "8px" }}>{b.emoji}</div>}
              <div style={{ fontSize: b.banner_type === "story" ? "14px" : "16px", fontWeight: 800, marginBottom: "4px", lineHeight: 1.3 }}>{b.title}</div>
              <div style={{ fontSize: "11px", opacity: 0.9, whiteSpace: "pre-line" }}>{b.sub || b.sub_text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 배너 인디케이터 */}
      {displayBanners.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", paddingBottom: "20px" }}>
          {displayBanners.map((_, i) => (
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
      )}

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
          {displayGuides.map((g, i) => (
            <div
              key={g.id}
              onClick={() => g.video_url && setSelectedVideo(g.video_url)}
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
                ▶ {g.video_url ? "영상보기" : "연구 준비중"}
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
        onClick={onOpenModal}
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

      {/* 🧬 우리아이 연구 등록 유도 배너 (Discovery 추가) */}
      {!session ? (
        <div style={{ padding: "24px 20px", background: "#f8fafc", borderRadius: "24px", margin: "0 20px 20px", border: "1px solid #e2e8f0", textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔐</div>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#111", marginBottom: "4px" }}>나만의 맞춤 연구 정보를 확인하세요</div>
          <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "20px" }}>로그인하시면 아이의 건강 상태에 딱 맞는 제품을 추천해 드립니다.</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button 
              onClick={() => signIn("google")}
              style={{
                flex: 1, padding: "12px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer"
              }}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" />
              Google 로그인
            </button>
            <button 
              onClick={() => signIn("kakao")}
              style={{
                flex: 1, padding: "12px", background: "#FEE500", border: "none", borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer"
              }}
            >
              <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png" width="18" height="18" />
              카카오 로그인
            </button>
          </div>
        </div>
      ) : !activePet && (
        <div 
          onClick={onOpenModal}
          className="shop-card-hover"
          style={{ 
            padding: "20px", background: "linear-gradient(135deg, #E5007E 0%, #FF4DA6 100%)", 
            borderRadius: "20px", margin: "0 20px 24px", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 4px 15px rgba(229,0,126,0.2)"
          }}
        >
          <div>
            <div style={{ fontSize: "15px", fontWeight: 900, marginBottom: "4px" }}>우리아이 건강 연구 등록하기</div>
            <div style={{ fontSize: "11px", opacity: 0.9 }}>정밀 분석을 통해 딱 맞는 제품을 추천해 드려요 ✨</div>
          </div>
          <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={20} color="#fff" />
          </div>
        </div>
      )}

      {/* 💰 할인 중인 상품 그리드 */}
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
function ShopTab({ products, session, activePet, onOpenModal, logoUrl }: { products: any[]; session: any; activePet: PetProfile | null; onOpenModal: () => void; logoUrl: string }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortLabel, setSortLabel] = useState("추천순");
  const [searchQuery, setSearchQuery] = useState("");

  // 반려동물 맞춤형 추천 상품 필터링 (키워드 기반)
  const recommendedProducts = useMemo(() => {
    if (!activePet || !activePet.keywords || activePet.keywords.length === 0) return [];
    
    return products.filter(p => {
      // 상품 태그나 이름에 반려동물 키워드 관련 단어가 포함되어 있는지 확인
      const petKeywords = activePet.keywords.map(k => HEALTH_KEYWORDS.find(hk => hk.id === k)?.label || "");
      return petKeywords.some(keyword => 
        p.name.includes(keyword) || 
        (p.tag || "").includes(keyword) || 
        (p.category || "").includes(keyword)
      );
    }).slice(0, 4); // 최대 4개만 추천
  }, [activePet, products]);

  const filtered = products.filter((p: any) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortLabel === "인기순") return b.reviewCount - a.reviewCount;
    if (sortLabel === "낮은가격순") return a.price - b.price;
    if (sortLabel === "높은가격순") return b.price - a.price;
    return b.rating - a.rating; // 추천순 = 평점순
  });

  const sortOptions = ["추천순", "인기순", "낮은가격순", "높은가격순"];

  return (
    <div style={{ paddingBottom: "86px" }}>
      {/* 💎 샵 프리미엄 히어로 섹션 (3번째 스샷 스타일) */}
      <div style={{ 
        background: "linear-gradient(to bottom, #88004D, #660039)", 
        padding: "60px 20px", 
        textAlign: "center", 
        color: "#fff",
        marginBottom: "24px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
          {/* 정식 로고 장착 (0.1% 정밀 이식) */}
          <img 
            src={logoUrl} 
            alt="Magenta Lab Logo"
            style={{ width: "120px", height: "auto", marginBottom: "12px" }} 
          />
          <div style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" }}>MAGENTA LAB</div>
        </div>
        <h2 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-0.02em", margin: "0 0 12px", textTransform: "uppercase" }}>
          DISCOVER PRECISION PET WELLNESS
        </h2>
        <p style={{ fontSize: "13px", opacity: 0.8, letterSpacing: "0.05em", fontWeight: 500, textTransform: "uppercase" }}>
          EXPERTS CURATING RESEARCH-DRIVEN PRODUCTS FOR YOUR PET'S PRECISE NEEDS.
        </p>
      </div>

      {/* 로그인 및 프로필 등록 유도 (하단 이동) */}
      {!session && (
        <div style={{ padding: "24px 20px", background: "#f8fafc", borderRadius: "24px", margin: "0 20px 20px", border: "1px solid #e2e8f0", textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔐</div>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#111", marginBottom: "4px" }}>나만의 맞춤 연구 정보를 확인하세요</div>
          <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "20px" }}>로그인하시면 아이의 건강 상태에 딱 맞는 제품을 추천해 드립니다.</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button 
              onClick={() => signIn("google")}
              style={{
                flex: 1, padding: "12px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer"
              }}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" />
              Google 로그인
            </button>
            <button 
              onClick={() => signIn("kakao")}
              style={{
                flex: 1, padding: "12px", background: "#FEE500", border: "none", borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer"
              }}
            >
              <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png" width="18" height="18" />
              카카오 로그인
            </button>
          </div>
        </div>
      )}

      {session && !activePet && (
        <div 
          onClick={onOpenModal}
          className="shop-card-hover"
          style={{ 
            padding: "20px", background: "linear-gradient(135deg, #E5007E 0%, #FF4DA6 100%)", 
            borderRadius: "20px", margin: "0 20px 20px", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 4px 15px rgba(229,0,126,0.2)"
          }}
        >
          <div>
            <div style={{ fontSize: "15px", fontWeight: 900, marginBottom: "4px" }}>우리아이 건강 연구 등록하기</div>
            <div style={{ fontSize: "11px", opacity: 0.9 }}>정밀 분석을 통해 딱 맞는 제품을 추천해 드려요 ✨</div>
          </div>
          <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={20} color="#fff" />
          </div>
        </div>
      )}

      {/* 🧬 반려동물 맞춤 추천 섹션 */}
      {activePet && recommendedProducts.length > 0 && (
        <div style={{ margin: "0 20px 24px", padding: "20px", background: "#FFF0F6", borderRadius: "24px", border: "1px solid rgba(229,0,126,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "#E5007E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🧬</div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 900, color: "#111" }}>{activePet.name} 연구원을 위한 맞춤 추천</div>
              <div style={{ fontSize: "10px", color: "#E5007E", fontWeight: 700 }}>0.1% 정밀 분석 시스템 가동 중</div>
            </div>
          </div>
          <div className="shop-scrollbar-hide" style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "4px" }}>
            {recommendedProducts.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} variant="scroll" />
            ))}
          </div>
        </div>
      )}

      {/* 카테고리 및 검색 (스샷 스타일로 정렬) */}
      <div style={{ background: "#fff", padding: "20px 20px 10px" }}>
        {/* 카테고리 가로 스크롤 탭 */}
        <div className="shop-scrollbar-hide" style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "16px" }}>
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
                boxShadow: activeCategory === c.id ? "0 4px 12px rgba(229,0,126,0.2)" : "none"
              }}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {/* 검색 바 */}
        <div
          style={{
            background: "#F3F4F6", borderRadius: "16px",
            padding: "4px 16px", display: "flex", alignItems: "center", gap: "10px",
            border: "1px solid #E5E7EB",
            marginBottom: "12px"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제품명, 브랜드, 카테고리 검색"
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              padding: "10px 0", fontSize: "14px", color: "#111", width: "100%"
            }}
          />
        </div>

        <div style={{ fontSize: "12px", color: "#6B7280", opacity: 0.8 }}>
          신뢰할 수 있는 제품만 모았습니다
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


// ─── 개인화 추천 배너 (CurationBanner) ─────────────────────────────
function CurationBanner({ profile }: { profile: PetProfile }) {
  if (!profile || !profile.keywords) return null;
  
  const keywordLabels = profile.keywords.map(k => HEALTH_KEYWORDS.find(hk => hk.id === k)?.label).filter(Boolean);
  const primaryKeyword = profile.keywords[0];
  const tip = HEALTH_KEYWORDS.find(hk => hk.id === primaryKeyword)?.tip || "정밀 분석 중...";
  
  // 키워드별 추천 상품 키워드 매칭
  const getRecMessage = (k: string) => {
    switch(k) {
      case "eye": return "루테인 보조제와 저자극 세정제를 추천해요";
      case "skin": return "가수분해 간식과 오메가3가 도움이 될 거예요";
      case "joint": return "글루코사민 영양제와 미끄럼 방지 용품이 필수예요";
      case "digestion": return "프로바이오틱스와 소화가 잘 되는 화식은 어때요?";
      case "dental": return "치석 제거 껌과 구강 세정액을 연구해왔어요";
      case "weight": return "저칼로리 간식과 근력 강화 아이템이 필요해요";
      case "kidney": return "저나트륨 간식과 수분 보충제가 가장 중요해요!";
      case "emotion": return "스트레스 완화 간식과 노즈워크 장난감을 추천해요";
      default: return "안심 연구원이 선정한 맞춤 추천템을 확인하세요";
    }
  };

  return (
    <div className="shop-fade-up" style={{
      margin: "0 16px 24px",
      padding: "20px",
      borderRadius: "20px",
      background: "linear-gradient(135deg, #FF69B4 0%, #E5007E 100%)",
      color: "#fff",
      boxShadow: "0 10px 20px rgba(229, 0, 126, 0.2)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* 배경 장식 */}
      <div style={{ position: "absolute", right: "-10px", bottom: "-10px", fontSize: "80px", opacity: 0.15 }}>🧪</div>
      
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 700 }}>AI NUTRITION REPORT</span>
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "4px", letterSpacing: "-0.02em" }}>
          안심이가 제안하는 <span style={{ color: "#FFE066" }}>'{profile.name}'</span> 맞춤 리포트
        </h3>
        <p style={{ fontSize: "12px", opacity: 0.9, marginBottom: "16px", lineHeight: 1.4 }}>
          {keywordLabels.join(", ")} 집중 케어가 필요해 보여요! <br />
          {getRecMessage(primaryKeyword)}
        </p>
        
        <button style={{
          background: "#fff", color: "#E5007E", border: "none", borderRadius: "10px",
          padding: "8px 16px", fontSize: "12px", fontWeight: 800, cursor: "pointer",
          display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}>
          상세 보고서 보기
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── 프로필 입력 모달 (PetProfileModal) ────────────────────────────
function PetProfileModal({ isOpen, onClose, onSave, initialData }: { 
  isOpen: boolean; onClose: () => void; onSave: (profile: PetProfile, file?: File) => void; initialData: PetProfile | null 
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState<"dog" | "cat">(initialData?.type || "dog");
  const [birthYear, setBirthYear] = useState<number>(initialData?.birthYear || 2024);
  const [birthMonth, setBirthMonth] = useState<number>(initialData?.birthMonth || 1);
  const [birthDay, setBirthDay] = useState<number>(initialData?.birthDay || 1);
  const [breed, setBreed] = useState(initialData?.breed || "");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photo_url || "");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(initialData?.keywords || []);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const yearsArr = Array.from({ length: 30 }, (_, i) => 2026 - i);
  const monthsArr = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysArr = Array.from({ length: 31 }, (_, i) => i + 1);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "");
      setType(initialData?.type || "dog");
      setBirthYear(initialData?.birthYear || 2024);
      setBirthMonth(initialData?.birthMonth || 1);
      setBirthDay(initialData?.birthDay || 1);
      setBreed(initialData?.breed || "");
      setPhotoUrl(initialData?.photo_url || "");
      setSelectedKeywords(initialData?.keywords || []);
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // 0.1초 미리보기
    }
  };

  const toggleKeyword = (id: string) => {
    setSelectedKeywords(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
  };

  const handleSave = () => {
    if (!name || !breed) {
      alert("모든 정보를 입력해주세요!");
      return;
    }
    onSave({ 
      id: initialData?.id || "pet-" + Date.now(),
      name, 
      type, 
      birthYear, 
      birthMonth,
      birthDay,
      breed, 
      photo_url: photoUrl,
      keywords: selectedKeywords,
      updatedAt: Date.now() 
    }, selectedFile || undefined);
  };

  const { years, months } = calculatePreciseAge(birthYear, birthMonth, birthDay);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
    }}>
      <div className="shop-fade-in" style={{
        width: "100%", maxWidth: "450px", background: "#fff", borderRadius: "28px",
        padding: "32px 24px", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        maxHeight: "90vh", overflowY: "auto"
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#9CA3AF" }}>✕</button>
        
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          {/* 사진 업로드 영역 (아이 증명사진) */}
          <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 20px" }}>
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "120px", height: "120px", borderRadius: "50%",
                background: "#F3F4F6", overflow: "hidden", cursor: "pointer",
                border: "4px solid #fff", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease",
                position: "relative"
              }}
              className="shop-card-hover"
            >
              {previewUrl || photoUrl ? (
                <img src={previewUrl || photoUrl} alt="pet" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "4px" }}>{type === "dog" ? "🐶" : "🐱"}</div>
                  <div style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 700 }}>사진 등록</div>
                </div>
              )}
              {/* 오버레이 효과 */}
              <div style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: 0, transition: "opacity 0.3s ease"
              }} className="hover-overlay">
                <Camera size={24} color="#fff" />
              </div>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "absolute", bottom: "4px", right: "4px",
                background: "linear-gradient(135deg, #E5007E 0%, #FF4DA6 100%)",
                color: "#fff", border: "2px solid #fff",
                width: "36px", height: "36px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(229,0,126,0.4)", cursor: "pointer",
                zIndex: 2
              }}
              className="shop-btn-hover"
            >
              <Camera size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              style={{ display: "none" }} 
            />
          </div>
          
          <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#111", letterSpacing: "-0.04em", marginBottom: "4px" }}>
            {name ? `${name} 연구원` : "우리아이 연구 프로필"}
          </h2>
          <p style={{ fontSize: "13px", color: "#E5007E", fontWeight: 700, marginBottom: "24px" }}>
            {name ? "0.1% 정밀 분석 시스템 가동 중 🧬" : "안심이가 정밀 분석을 시작합니다!"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button 
            onClick={() => setType("dog")}
            style={{ flex: 1, padding: "12px", borderRadius: "14px", border: type === "dog" ? "2px solid #E5007E" : "1px solid #e2e8f0", background: type === "dog" ? "#FFF0F6" : "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
          >🐕 강아지</button>
          <button 
            onClick={() => setType("cat")}
            style={{ flex: 1, padding: "12px", borderRadius: "14px", border: type === "cat" ? "2px solid #E5007E" : "1px solid #e2e8f0", background: type === "cat" ? "#FFF0F6" : "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
          >🐈 고양이</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 800, color: "#E5007E", marginBottom: "6px", display: "block" }}>이름</label>
            <input 
              value={name} onChange={e => setName(e.target.value)} 
              placeholder="식별 가능한 이름을 적어주세요" 
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#F9FAFB" }} 
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 800, color: "#E5007E", marginBottom: "6px", display: "block" }}>태어난 연도</label>
              <select 
                value={birthYear}
                onChange={e => setBirthYear(Number(e.target.value))}
                style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#F9FAFB", fontSize: "14px" }}
              >
                {yearsArr.map(y => <option key={y} value={y}>{y}년</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 800, color: "#E5007E", marginBottom: "6px", display: "block" }}>태어난 월</label>
              <select 
                value={birthMonth}
                onChange={e => setBirthMonth(Number(e.target.value))}
                style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#F9FAFB", fontSize: "14px" }}
              >
                {monthsArr.map(m => <option key={m} value={m}>{m}월</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 800, color: "#E5007E", marginBottom: "6px", display: "block" }}>태어난 일</label>
              <select 
                value={birthDay}
                onChange={e => setBirthDay(Number(e.target.value))}
                style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#F9FAFB", fontSize: "14px" }}
              >
                {daysArr.map(d => <option key={d} value={d}>{d}일</option>)}
              </select>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#E5007E", fontWeight: 800, textAlign: "right", marginTop: "-10px" }}>
             {name} 연구원은 현재 {formatAgeString(years, months)}입니다! 🎂
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 800, color: "#E5007E", marginBottom: "6px", display: "block" }}>견종/묘종</label>
            <input 
              value={breed} onChange={e => setBreed(e.target.value)} 
              placeholder="예: 푸들" 
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#F9FAFB" }} 
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 800, color: "#E5007E", marginBottom: "10px", display: "block" }}>
              현재 가장 걱정되는 건강 키워드(정밀 분석 모드)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {HEALTH_KEYWORDS.map(k => (
                <button
                  key={k.id}
                  onClick={() => toggleKeyword(k.id)}
                  style={{
                    padding: "10px", borderRadius: "12px", fontSize: "12px", fontWeight: 600,
                    cursor: "pointer", border: "1px solid", transition: "all 0.2s",
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px",
                    background: selectedKeywords.includes(k.id) ? "#E5007E" : "#fff",
                    borderColor: selectedKeywords.includes(k.id) ? "#E5007E" : "#e2e8f0",
                    color: selectedKeywords.includes(k.id) ? "#fff" : "#111"
                  }}
                >
                  <div style={{ fontSize: "14px" }}>{k.emoji} {k.label}</div>
                  <div style={{ fontSize: "9px", opacity: 0.7 }}>{k.hashtags[0]} {k.hashtags[1]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          style={{
            width: "100%", marginTop: "32px", padding: "16px", borderRadius: "16px",
            background: "#E5007E", color: "#fff", border: "none", fontSize: "16px", fontWeight: 800,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(229, 0, 126, 0.3)"
          }}
        >
          연구 프로필 저장하기
        </button>
      </div>
    </div>
  );
}

// ─── 내 마이페이지 탭 (My Tab) ────────────────────────────────────
function MyTab({ profiles, activeId, onSelect, onOpenModal, onEditModal, setActiveSubPage }: { 
  profiles: PetProfile[]; 
  activeId: string | null;
  onSelect: (id: string) => void;
  onOpenModal: () => void; 
  onEditModal: () => void;
  setActiveSubPage: (id: string | null) => void;
}) {
  const { data: session } = useSession();
  const activePet = profiles.find(p => p.id === activeId) || profiles[0] || null;
  
  // 생일 체크 로직 (0.1% 정밀 축하 시스템)
  const isBirthday = useMemo(() => {
    if (!activePet) return false;
    const now = new Date();
    return now.getMonth() + 1 === activePet.birthMonth && now.getDate() === (activePet.birthDay || 1);
  }, [activePet]);

  const menuItems = [
    { id: "address", label: "배송지 관리", emoji: "📍" },
    { id: "research", label: "내 연구 기록", emoji: "📝" },
    { id: "loyalty", label: "포인트/쿠폰", emoji: "🎟️", sub: "0P" },
    { id: "consultation", label: "상담 내역", emoji: "💬" },
  ];

  const handleMenuClick = (id: string) => {
    if (!session) {
      alert("사장님! 로그인이 필요한 서비스입니다. 안심이와 함께 연구를 시작해 보세요! 🐾");
      signIn("kakao", { callbackUrl: "/shop" });
      return;
    }
    setActiveSubPage(id);
  };

  return (
    <div style={{ paddingBottom: "100px", background: "#F9FAFB" }}>
      {/* 프로필 헤더 */}
      <div style={{
        background: "linear-gradient(180deg, #E5007E 0%, #FF2E9D 100%)",
        padding: "40px 24px 60px",
        borderRadius: "0 0 32px 32px",
        color: "#fff",
        position: "relative",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "22px",
            background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
            border: "2px solid rgba(255,255,255,0.3)"
          }}>
            {session?.user?.image ? (
              <img src={session.user.image} style={{ width: "100%", height: "100%", borderRadius: "22px" }} alt="me" />
            ) : "👤"}
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 900 }}>{session?.user?.name || "방문자"} 사장님</div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px" }}>연구소에 오신 것을 환영합니다!</div>
          </div>
        </div>
        
        {!session && (
          <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: "18px", padding: "12px" }}>
            <button
              onClick={() => signIn("kakao", { callbackUrl: "/shop" })}
              className="shop-btn-hover"
              style={{
                width: "100%", background: "#FEE500", border: "none", borderRadius: "12px",
                color: "#191919", padding: "10px", fontSize: "13px", fontWeight: 700, 
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                marginBottom: "8px"
              }}
            >
              <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png" width="18" height="18" />
              카카오 로그인하고 혜택 받기
            </button>
            <button
              onClick={() => signIn("google", { callbackUrl: "/shop" })}
              className="shop-btn-hover"
              style={{
                width: "100%", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px",
                color: "#111", padding: "10px", fontSize: "13px", fontWeight: 700, 
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" />
              Google 로그인하고 혜택 받기
            </button>
          </div>
        )}
      </div>

      {/* [업그레이드] 우리 아이 연구 프로필 섹션 (가로 아바타 스와이프 UI) */}
      <div style={{ margin: "-30px 0 20px", position: "relative", zIndex: 110 }}>
        
        {/* 생일 축하 배너 (안심이의 감동 팝업) */}
        {isBirthday && activePet && (
          <div className="shop-fade-up" style={{
            margin: "0 16px 16px",
            background: "linear-gradient(135deg, #FF6B6B 0%, #E5007E 100%)",
            borderRadius: "16px", padding: "16px", color: "#fff",
            display: "flex", alignItems: "center", gap: "12px",
            boxShadow: "0 8px 20px rgba(229,0,126,0.25)",
            border: "2px solid #fff"
          }}>
            <div style={{ fontSize: "32px" }}>🎂</div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 900 }}>축하합니다! 🥳</div>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>
                오늘은 {activePet.name} 연구원의 {calculatePreciseAge(activePet.birthYear, activePet.birthMonth, activePet.birthDay || 1).years}살 생일이에요!
              </div>
            </div>
          </div>
        )}
        
        {/* 현재 선택된 아이 상세 요약 카드 */}
        {activePet ? (
          <div style={{ margin: "0 16px 24px" }}>
            <div style={{ 
              background: "#fff", borderRadius: "24px", padding: "24px", 
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.02)",
              position: "relative", overflow: "hidden"
            }}>
              {/* 배경 장식 */}
              <div style={{ position: "absolute", right: "-10px", top: "-10px", fontSize: "60px", opacity: 0.05 }}>🧪</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#111" }}>{activePet.name} 연구원</h3>
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>{activePet.breed}</span>
                    <span style={{ fontSize: "12px", color: "#E5E7EB" }}>|</span>
                    <span style={{ fontSize: "12px", color: "#E5007E", fontWeight: 700 }}>
                      {(() => {
                        const { years, months } = calculatePreciseAge(activePet.birthYear, activePet.birthMonth, activePet.birthDay || 1);
                        return formatAgeString(years, months);
                      })()}
                    </span>
                  </div>
                  <div style={{ 
                    marginTop: "10px", fontSize: "11px", color: "#6B7280", 
                    background: "#F3F4F6", padding: "4px 10px", borderRadius: "20px",
                    display: "inline-block"
                  }}>
                    ✨ {activePet.name} 연구원이 지켜보고 있어요!
                  </div>
                </div>
                <div 
                  onClick={onEditModal}
                  style={{ 
                    background: "linear-gradient(135deg, #E5007E 0%, #FF4DA6 100%)", 
                    padding: "8px 16px", borderRadius: "12px", 
                    fontSize: "12px", fontWeight: 800, color: "#fff", cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(229,0,126,0.2)"
                  }}
                  className="shop-btn-hover"
                >
                  수정하기
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {(activePet.keywords || []).map(kId => {
                  const kw = HEALTH_KEYWORDS.find(h => h.id === kId);
                  return (
                    <span key={kId} style={{ 
                      fontSize: "11px", background: "#FFF0F6", color: "#E5007E", 
                      padding: "4px 10px", borderRadius: "8px", fontWeight: 600
                    }}>
                      #{kw?.label || kId}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ) : session && (
          <div style={{ margin: "0 16px 24px" }}>
            <div 
              onClick={onOpenModal}
              className="shop-card-hover"
              style={{ 
                background: "#fff", borderRadius: "24px", padding: "32px 24px", 
                textAlign: "center", border: "2px dashed #E5E7EB", cursor: "pointer"
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🧬</div>
              <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#111", marginBottom: "8px" }}>아직 등록된 아이가 없어요</h3>
              <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px" }}>우리 아이 건강 연구를 시작하고<br />0.1% 정밀 맞춤 제품을 추천받으세요!</p>
              <div style={{ 
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "#E5007E", color: "#fff", padding: "12px 24px",
                borderRadius: "14px", fontWeight: 800, fontSize: "14px"
              }}>
                <Plus size={18} />
                연구 프로필 등록하기
              </div>
            </div>
          </div>
        )}

        <div 
          style={{ 
            display: "flex", overflowX: "auto", gap: "20px", padding: "10px 24px 20px", 
            scrollbarWidth: "none", alignItems: "center" 
          }} 
          className="no-scrollbar"
        >
          {/* 아이 추가하기 버튼 (원형) */}
          <div 
            onClick={onOpenModal}
            className="shop-btn-hover"
            style={{
              minWidth: "70px", height: "70px", borderRadius: "50%",
              background: "#fff", border: "2px dashed #E5E7EB",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0, color: "#9CA3AF"
            }}
          >
            <Plus size={24} />
          </div>

          {/* 등록된 프로필 아바타들 */}
          {profiles.map(p => {
            const isActive = activeId === p.id;
            
            return (
              <div 
                key={p.id}
                onClick={() => onSelect(p.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", 
                  gap: "8px", flexShrink: 0, cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <div 
                  className={`shop-btn-hover ${isActive ? "shop-avatar-active" : ""}`}
                  style={{
                    width: "74px", height: "74px", borderRadius: "50%",
                    padding: "3px",
                    background: isActive ? "linear-gradient(135deg, #E5007E, #FF69B4)" : "rgba(0,0,0,0.05)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                  }}
                >
                  <div style={{
                    width: "100%", height: "100%", borderRadius: "50%",
                    background: "#fff", border: "2px solid #fff", overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {p.photo_url ? (
                      <img src={p.photo_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={p.name} />
                    ) : (
                      <div style={{ fontSize: "32px" }}>{p.type === "dog" ? "🐶" : "🐱"}</div>
                    )}
                  </div>
                  {isActive && (
                    <div style={{
                      position: "absolute", bottom: "-2px", right: "-2px",
                      background: "#E5007E", color: "#fff", borderRadius: "50%",
                      width: "20px", height: "20px", display: "flex", alignItems: "center",
                      justifyContent: "center", border: "2px solid #fff"
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
                <div style={{ 
                  fontSize: "12px", fontWeight: isActive ? 900 : 600, 
                  color: isActive ? "#E5007E" : "#4B5563" 
                }}>
                  {p.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 현재 선택된 아이 상세 요약 카드 */}
      {activePet && (
        <div style={{ margin: "0 16px 24px" }}>
          <div style={{ 
            background: "#fff", borderRadius: "24px", padding: "24px", 
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.02)",
            position: "relative", overflow: "hidden"
          }}>
            {/* 배경 장식 */}
            <div style={{ position: "absolute", right: "-10px", top: "-10px", fontSize: "60px", opacity: 0.05 }}>🧪</div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#111" }}>{activePet.name} 연구원</h3>
                <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>
                  {activePet.breed} · {(() => {
                    const { years, months } = calculatePreciseAge(activePet.birthYear, activePet.birthMonth, activePet.birthDay || 1);
                    return formatAgeString(years, months);
                  })()}
                </p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onOpenModal(); }}
                style={{ 
                  fontSize: "11px", color: "#E5007E", background: "#fdf2f8", 
                  border: "none", cursor: "pointer", fontWeight: 700, 
                  padding: "6px 12px", borderRadius: "10px" 
                }}
              >
                정보 수정
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
              {(activePet.keywords || []).map(k => (
                <span key={k} style={{ 
                  fontSize: "11px", background: "#f1f5f9", padding: "4px 10px", borderRadius: "8px", 
                  color: "#475569", fontWeight: 600, border: "1px solid #e2e8f0" 
                }}>
                  #{HEALTH_KEYWORDS.find(hk => hk.id === k)?.label || k}
                </span>
              ))}
            </div>

            <div style={{ 
              background: "#F9FAFB", borderRadius: "14px", padding: "14px", 
              fontSize: "12px", color: "#4B5563", lineHeight: 1.5,
              borderLeft: "4px solid #E5007E"
            }}>
              💡 <b>안심이의 처방:</b> {HEALTH_KEYWORDS.find(hk => activePet.keywords.includes(hk.id))?.tip || "정밀 분석을 위해 상담 기록을 업데이트해 주세요!"}
            </div>
          </div>
        </div>
      )}

      {/* 주문 현황 카드 */}
      <div className="shop-fade-up" style={{
        margin: "0 16px 12px", background: "#fff", borderRadius: "18px",
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
        {menuItems.map((item: any, i: number) => (
          <div
            key={item.label}
            onClick={() => handleMenuClick(item.id)}
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



// ─── 서브페이지 컴포넌트들 ──────────────────────────────────────────

// ─── 비디오 모달 (YouTube Embed) ─────────────────────────────
function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  const getYTId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYTId(url);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 3000, background: "rgba(0,0,0,0.9)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
    }}>
      <div style={{ width: "100%", maxWidth: "800px", position: "relative" }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "-40px", right: 0, background: "none", border: "none",
          color: "#fff", fontSize: "24px", cursor: "pointer"
        }}>✕</button>
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "16px", overflow: "hidden" }}>
          <iframe
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

function AddressSubPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) fetchAddresses();
  }, [session]);

  const fetchAddresses = async () => {
    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .order("is_default", { ascending: false });
    if (data) setAddresses(data);
  };

  const handleAddAddress = () => {
    if (!(window as any).daum) {
      alert("주소 서비스가 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    new (window as any).daum.Postcode({
      oncomplete: function(data: any) {
        const fullAddress = data.address;
        alert(`연구소로 배송받을 주소: ${fullAddress}\n연구 기록을 위해 상세 주소까지 입력해 주세요!`);
        // 여기서 실제로 insert logic을 수행할 수 있습니다.
      }
    }).open();
  };

  return (
    <div style={{ padding: "0 4px" }}>
      <button 
        onClick={handleAddAddress}
        className="shop-btn-hover"
        style={{ 
          width: "100%", padding: "16px", background: "#E5007E", color: "#fff", 
          border: "none", borderRadius: "14px", fontWeight: 800, marginBottom: "20px",
          boxShadow: "0 4px 12px rgba(229,0,126,0.2)"
        }}
      >
        + 새 배송지 추가 (0.1초 검색)
      </button>
      
      {addresses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📍</div>
          <p style={{ color: "#9CA3AF", fontSize: "14px" }}>등록된 배송지가 없네요.<br />첫 번째 연구소 배송지를 등록해 보세요!</p>
        </div>
      ) : (
        addresses.map(addr => (
          <div key={addr.id} style={{ background: "#fff", padding: "18px", borderRadius: "18px", marginBottom: "12px", border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontWeight: 800, fontSize: "15px" }}>
                {addr.address_name} {addr.is_default && <span style={{ color: "#E5007E", fontSize: "10px", background: "#fdf2f8", padding: "2px 6px", borderRadius: "6px", marginLeft: "4px" }}>기본</span>}
              </span>
              <button style={{ fontSize: "12px", color: "#EF4444", background: "none", border: "none", fontWeight: 600 }}>삭제</button>
            </div>
            <div style={{ fontSize: "13px", color: "#4B5563", lineHeight: 1.5 }}>
              [{addr.post_code}]<br />
              {addr.address}<br />
              {addr.detail_address}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ResearchRecordsSubPage({ products }: { products: any[] }) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실시간 Supabase 연동 시: await supabase.from('orders').select('*, products(*)')...
    // 여기서는 주인님이 요청하신 브랜딩 컨셉을 위해 모의 데이터를 구성합니다.
    setTimeout(() => {
      setRecords([
        { id: "R-1024", product_id: 1, created_at: "2026.04.20", health_concern: "eye", status: "배송완료" },
        { id: "R-1025", product_id: 3, created_at: "2026.04.15", health_concern: "skin", status: "연구중" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div style={{ padding: "0 4px" }}>
      <div style={{ fontSize: "13px", color: "#64748B", marginBottom: "20px", lineHeight: 1.5 }}>
        사장님과 아이가 함께한 모든 연구의 기록입니다.<br />
        아이의 고민이 어떻게 해결되고 있는지 확인해 보세요!
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>기록을 불러오는 중...</div>
      ) : records.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📝</div>
          <p style={{ color: "#9CA3AF", fontSize: "14px" }}>아직 기록된 연구 내역이 없습니다.<br />아이가 필요한 아이템으로 첫 연구를 시작해 보세요!</p>
        </div>
      ) : (
        records.map(rec => {
          const product = products.find(p => p.id === rec.product_id);
          const keyword = HEALTH_KEYWORDS.find(k => k.id === rec.health_concern);
          return (
            <div key={rec.id} style={{ background: "#fff", padding: "20px", borderRadius: "22px", marginBottom: "16px", border: "1px solid #F3F4F6", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 600 }}>{rec.created_at} | No.{rec.id}</span>
                <span style={{ fontSize: "12px", fontWeight: 800, color: rec.status === "배송완료" ? "#22C55E" : "#E5007E" }}>{rec.status}</span>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <img src={product?.image || product?.image_url} style={{ width: "64px", height: "64px", borderRadius: "14px", objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#111", marginBottom: "4px" }}>{product?.name}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#fdf2f8", padding: "2px 8px", borderRadius: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#E5007E" }}>
                      연구 목표: {keyword?.label} {keyword?.emoji}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function LoyaltySubPage() {
  const [loyalty, setLoyalty] = useState<{points: number, coupons: number} | null>(null);

  useEffect(() => {
    // await supabase.from('loyalty_accounts').select('*')...
    setLoyalty({ points: 2500, coupons: 2 });
  }, []);

  return (
    <div style={{ padding: "0 4px" }}>
      <div style={{ 
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", 
        borderRadius: "24px", padding: "28px", color: "#fff", marginBottom: "24px",
        boxShadow: "0 10px 25px rgba(15,23,42,0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "13px", opacity: 0.7, marginBottom: "8px" }}>안심 리워드 포인트</div>
            <div style={{ fontSize: "36px", fontWeight: 900 }}>{loyalty?.points.toLocaleString() || "0"} <span style={{ fontSize: "16px", fontWeight: 400 }}>P</span></div>
          </div>
          <div style={{ fontSize: "40px" }}>🎟️</div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", border: "1px solid #F3F4F6" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "20px" }}>보유 쿠폰 <span style={{ color: "#E5007E" }}>{loyalty?.coupons || 0}</span>장</h3>
        {loyalty?.coupons === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", border: "1px dashed #E5E7EB", borderRadius: "16px" }}>
            사용 가능한 쿠폰이 없습니다.
          </div>
        ) : (
          <div style={{ background: "#fdf2f8", border: "2px dashed #E5007E", padding: "16px", borderRadius: "16px", position: "relative", overflow: "hidden" }}>
             <div style={{ fontSize: "15px", fontWeight: 800, color: "#E5007E" }}>연구소 첫 방문 기념 할인쿠폰</div>
             <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>전 제품 10% 추가 할인 | ~2026.12.31</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConsultationSubPage() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    // await supabase.from('support_tickets').select('*')...
    setTickets([
      { id: 1, subject: "아이 눈물 자국 제품 추천 문의", status: "completed", created_at: "2026.04.18" },
      { id: 2, subject: "결제 오류 확인 부탁드립니다", status: "pending", created_at: "2026.04.21" },
    ]);
  }, []);

  return (
    <div style={{ padding: "0 4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 800 }}>상담 히스토리</h3>
        <span style={{ fontSize: "12px", color: "#9CA3AF" }}>총 {tickets.length}건</span>
      </div>

      {tickets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>💬</div>
          <p style={{ color: "#9CA3AF", fontSize: "14px" }}>아직 상담 기록이 없습니다.</p>
        </div>
      ) : (
        tickets.map(t => (
          <div key={t.id} style={{ background: "#fff", padding: "20px", borderRadius: "18px", marginBottom: "12px", border: "1px solid #F3F4F6", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "10px", color: t.status === "completed" ? "#22C55E" : "#E5007E", background: t.status === "completed" ? "#F0FDF4" : "#fdf2f8", padding: "2px 8px", borderRadius: "6px", fontWeight: 800 }}>
                {t.status === "completed" ? "답변 완료" : "답변 대기"}
              </span>
              <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{t.created_at}</span>
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#111" }}>{t.subject}</div>
          </div>
        ))
      )}
    </div>
  );
}

function SupportSubPage() {
  return (
    <div style={{ padding: "0 4px" }}>
      <div style={{ background: "#fff", padding: "28px", borderRadius: "28px", marginBottom: "24px", border: "1px solid #F3F4F6", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
        <h3 style={{ fontSize: "17px", fontWeight: 900, marginBottom: "8px", color: "#111" }}>무엇을 도와드릴까요?</h3>
        <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "24px" }}>안심이가 사장님의 궁금증을 정밀 분석해 드립니다.</p>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#9CA3AF", marginBottom: "8px" }}>상담 유형</label>
          <select style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "#fff", fontSize: "14px" }}>
            <option>건강 고민 & 제품 추천</option>
            <option>배송/결제 문의</option>
            <option>불편 사항 접수</option>
            <option>기타</option>
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#9CA3AF", marginBottom: "8px" }}>상담 내용</label>
          <textarea 
            style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #E2E8F0", minHeight: "160px", fontSize: "14px", resize: "none", outline: "none" }} 
            placeholder="궁금하신 내용을 자세히 적어주세요. 안심이가 꼼꼼히 확인하겠습니다!" 
          />
        </div>

        <button 
          className="shop-btn-hover"
          style={{ width: "100%", padding: "18px", background: "#1e293b", color: "#fff", border: "none", borderRadius: "14px", fontWeight: 800, fontSize: "16px" }}
        >
          안심이에게 메시지 남기기
        </button>
      </div>

      <div style={{ textAlign: "center", padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
           <div style={{ width: "40px", height: "1px", background: "#E2E8F0" }} />
           <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 600 }}>급한 용건은 메일로!</span>
           <div style={{ width: "40px", height: "1px", background: "#E2E8F0" }} />
        </div>
        <a 
          href="mailto:smagentalab@gmail.com" 
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#E5007E", fontWeight: 900, fontSize: "15px", textDecoration: "none" }}
        >
          📫 업무용 메일로 바로 연락하기
        </a>
      </div>
    </div>
  );
}

// ─── 장바구니 탭 (Cart Tab) ──────────────────────────────────────
function CartTab() {
  return (
    <div style={{ 
      padding: "80px 20px", textAlign: "center", minHeight: "80vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛒</div>
      <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#111", marginBottom: "8px" }}>장바구니가 비어있습니다</h2>
      <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "32px", lineHeight: 1.5 }}>
        안심이가 추천하는 건강한 아이템들을<br />장바구니에 담아보세요!
      </p>
      <button style={{
        background: "linear-gradient(135deg, #E5007E 0%, #FF4DA6 100%)",
        color: "#fff", border: "none", borderRadius: "14px",
        padding: "14px 32px", fontSize: "14px", fontWeight: 800, cursor: "pointer",
        boxShadow: "0 4px 15px rgba(229,0,126,0.3)"
      }}>
        인기 상품 보러가기
      </button>
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
export default function ShopClient({ initialProducts = [], initialBanners = [] }: { initialProducts?: any[], initialBanners?: any[] }) {
  const { data: session } = useSession();
  const logoUrl = useMemo(() => `/images/shop/logo.png?t=${Date.now()}`, []);
  const [activeTab, setActiveTab] = useState<"discovery" | "shop" | "cart" | "request" | "my">("discovery");
  const [activeSubPage, setActiveSubPage] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>(initialProducts.length > 0 ? initialProducts : MOCK_PRODUCTS);

  // 다중 프로필 상태
  const [petProfiles, setPetProfiles] = useState<PetProfile[]>([]);
  const [activePetId, setActivePetId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<PetProfile | null>(null);

  const activePet = petProfiles.find(p => p.id === activePetId) || petProfiles[0] || null;

  // 모달 열기 함수 (수정 시 profile 전달, 신규 등록 시 null)
  const openProfileModal = (profile: PetProfile | null = null) => {
    setEditingPet(profile);
    setIsProfileModalOpen(true);
  };


  const savePetProfile = async (profile: PetProfile, file?: File) => {
    let finalPhotoUrl = profile.photo_url;

    const user = session?.user as any;
    if (file && user?.id) {
      try {
        const processedBlob = await processImage(file);
        const fileName = `photo.jpg`;
        const filePath = `${user.id}/${profile.id}/${fileName}`;

        // 전용 통로(API)를 통해 보안 정책을 우회하여 업로드
        const formData = new FormData();
        formData.append("file", processedBlob, "photo.jpg");
        formData.append("bucket", "pet_profiles");
        formData.append("folder", `${user.id}/${profile.id}`);

        const response = await fetch("/api/shop/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "업로드 실패");

        finalPhotoUrl = result.url;
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("이미지 업로드 중 연구 오류가 발생했습니다. (0.1% 오차 발생!)");
      }
    }

    const updatedProfile = { ...profile, photo_url: finalPhotoUrl, updatedAt: Date.now() };

    // 2. Supabase DB 저장
    try {
      const user = session?.user as any;
      const { error: dbError } = await supabase
        .from("pet_profiles")
        .upsert({
          id: updatedProfile.id,
          owner_id: user?.id,
          name: updatedProfile.name,
          type: updatedProfile.type,
          birth_year: updatedProfile.birthYear,
          birth_month: updatedProfile.birthMonth,
          birth_day: updatedProfile.birthDay,
          breed: updatedProfile.breed,
          keywords: updatedProfile.keywords,
          photo_url: updatedProfile.photo_url,
          updated_at: new Date().toISOString(),
        });

      if (dbError) throw dbError;

      setPetProfiles(prev => {
        const exists = prev.find(p => p.id === updatedProfile.id);
        if (exists) return prev.map(p => p.id === updatedProfile.id ? updatedProfile : p);
        return [...prev, updatedProfile];
      });
      setActivePetId(updatedProfile.id);
      setIsProfileModalOpen(false);
      
      // 마이그레이션 안내 문구 (신규 등록 시)
      if (!profile.id.startsWith("pet-")) {
        alert(`${updatedProfile.name}의 정보가 안전하게 연구실로 옮겨졌습니다! 다른 아이도 추가해 보시겠어요?`);
      }
    } catch (err) {
      console.error("DB save failed:", err);
      // 오프라인/에러 시 로컬 스토리지 백업 (옵션)
      localStorage.setItem("magenta_pet_profiles_backup", JSON.stringify(updatedProfile));
    }
  };

  const deletePetProfile = (id: string) => {
    setPetProfiles(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem("magenta_pet_profiles", JSON.stringify(next));
      if (activePetId === id) setActivePetId(next[0]?.id || null);
      return next;
    });
  };

  // 데이터 로드 및 마이그레이션 (Supabase DB 우선)
  useEffect(() => {
    async function loadProfiles() {
      const user = session?.user as any;
      if (!user?.id) {
        // 비로그인 시 로컬 스토리지 사용
        const saved = localStorage.getItem("magenta_pet_profiles");
        if (saved) {
          const parsed = JSON.parse(saved);
          setPetProfiles(parsed);
          setActivePetId(parsed[0]?.id || null);
        }
        return;
      }

      // 1. Supabase DB에서 프로필 가져오기
      const { data, error } = await supabase
        .from("pet_profiles")
        .select("*")
        .eq("owner_id", user?.id)
        .order("updated_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const dbProfiles: PetProfile[] = data.map(p => ({
          id: p.id,
          name: p.name,
          type: p.type as "dog" | "cat",
          birthYear: p.birth_year,
          birthMonth: p.birth_month,
          birthDay: p.birth_day,
          breed: p.breed,
          keywords: p.keywords,
          photo_url: p.photo_url,
          updatedAt: new Date(p.updated_at).getTime(),
        }));
        setPetProfiles(dbProfiles);
        setActivePetId(dbProfiles[0].id);
      } else {
        // 2. DB에 데이터가 없으면 로컬 스토리지 데이터 마이그레이션 시도
        const oldPet = localStorage.getItem("magenta_pet_profile"); // 기존 단일 데이터
        const oldPets = localStorage.getItem("magenta_pet_profiles"); // 기존 다중 데이터
        
        if (oldPet || oldPets) {
          console.log("Migrating local data to Supabase...");
          let profilesToMigrate: any[] = [];
          
          if (oldPets) {
            profilesToMigrate = JSON.parse(oldPets);
          } else if (oldPet) {
            const single = JSON.parse(oldPet);
            profilesToMigrate = [{ ...single, id: "pet-legacy-" + Date.now() }];
          }

          if (profilesToMigrate.length > 0) {
            // Supabase로 일괄 마이그레이션 (upsert)
            for (const p of profilesToMigrate) {
              await supabase.from("pet_profiles").upsert({
                id: p.id || "pet-" + Date.now(),
                owner_id: user?.id,
                name: p.name,
                type: p.type,
                birth_year: p.birthYear,
                birth_month: p.birthMonth,
                birth_day: p.birthDay || 1,
                breed: p.breed,
                keywords: p.keywords || [],
                photo_url: p.photo_url,
                updated_at: new Date().toISOString(),
              });
            }
            
            // 이관 성공 알림 (사용자 경험)
            alert(`${profilesToMigrate[0].name}의 정보가 안전하게 연구실로 옮겨졌습니다! 다른 아이도 추가해 보시겠어요? 🐾`);
            
            // 로컬 스토리지 정리 (중복 마이그레이션 방지)
            localStorage.removeItem("magenta_pet_profile");
            localStorage.removeItem("magenta_pet_profiles");
            
            // 다시 로드
            loadProfiles();
          }
        }
      }
    }
    loadProfiles();
  }, [session]);

  const [banners, setBanners] = useState<any[]>(initialBanners);
  const [careGuides, setCareGuides] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const timestamp = Date.now();
        const dbProducts = data.map(p => ({
          ...p,
          image: p.image_url ? `${p.image_url}?t=${timestamp}` : p.image,
          originalPrice: p.original_price || p.originalPrice
        }));
        setProducts(dbProducts);
      }
    }

    async function fetchBanners() {
      const { data } = await supabase.from("shop_banners").select("*").order("order_index", { ascending: true });
      if (data) {
        const timestamp = Date.now();
        setBanners(data.map(b => ({
          ...b,
          image_url: b.image_url ? `${b.image_url}?t=${timestamp}` : null
        })));
      }
    }

    async function fetchCareGuides() {
      const { data } = await supabase.from("care_guides").select("*").order("order_index", { ascending: true });
      if (data) setCareGuides(data);
    }

    fetchProducts();
    fetchBanners();
    fetchCareGuides();
  }, []);

  // 윈도우 객체에 상태 제어 함수 노출 (서브컴포넌트 간 통신용)
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).setActiveSubPage = setActiveSubPage;
      (window as any).setActiveTab = setActiveTab;
      (window as any).setIsProfileModalOpen = setIsProfileModalOpen;
    }
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

      {/* 대화면 오버레이 서브페이지 (My 탭 전용) */}
      {activeTab === "my" && activeSubPage && (
        <div 
          className="shop-fade-up"
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "#F9FAFB", display: "flex", flexDirection: "column"
          }}
        >
          {/* 공통 헤더 */}
          <header style={{ 
            padding: "16px 20px", display: "flex", alignItems: "center", 
            background: "#fff", borderBottom: "1px solid #F3F4F6", gap: "12px" 
          }}>
            <button 
              onClick={() => setActiveSubPage(null)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 style={{ fontSize: "16px", fontWeight: 800, margin: 0 }}>
              {activeSubPage === "address" && "배송지 관리"}
              {activeSubPage === "research" && "내 연구 기록"}
              {activeSubPage === "loyalty" && "포인트/쿠폰"}
              {activeSubPage === "consultation" && "상담 내역"}
              {activeSubPage === "support" && "고객센터"}
            </h2>
          </header>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            {activeSubPage === "address" && <AddressSubPage />}
            {activeSubPage === "research" && <ResearchRecordsSubPage products={products} />}
            {activeSubPage === "loyalty" && <LoyaltySubPage />}
            {activeSubPage === "consultation" && <ConsultationSubPage />}
            {activeSubPage === "support" && <SupportSubPage />}
          </div>
        </div>
      )}

      {/* 탭 콘텐츠 */}
      <div style={{ overflowY: "auto", minHeight: "100vh" }}>
        {activeTab === "discovery" && <DiscoveryTab products={products} banners={banners} careGuides={careGuides} session={session} activePet={activePet} onOpenModal={() => openProfileModal(null)} logoUrl={logoUrl} />}
        {activeTab === "shop" && <ShopTab products={products} session={session} activePet={activePet} onOpenModal={() => openProfileModal(null)} logoUrl={logoUrl} />}
        {activeTab === "cart" && <CartTab />}
        {activeTab === "request" && <RequestTab />}
        {activeTab === "my" && (
          <MyTab 
            profiles={petProfiles} 
            activeId={activePetId} 
            onSelect={setActivePetId} 
            onOpenModal={() => openProfileModal(null)} 
            onEditModal={() => openProfileModal(activePet)}
            setActiveSubPage={setActiveSubPage} 
          />
        )}
      </div>

      {/* 공통 모달 */}
      <PetProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        onSave={savePetProfile}
        initialData={editingPet}
      />

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
