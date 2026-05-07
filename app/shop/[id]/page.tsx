import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Star, Share2, Heart, ShoppingCart } from "lucide-react";
import type { Metadata } from "next";
import ProductReviews from "@/components/ProductReviews";
import AddToCartButton from "@/components/AddToCartButton";

// 1시간마다 데이터 갱신 (ISR)
export const revalidate = 3600; 

async function getProduct(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "상품을 찾을 수 없습니다 | 마젠타몰",
      description: "해당 상품이 삭제되었거나 존재하지 않습니다.",
    };
  }

  const title = `${product.name} | 마젠타몰`;
  const description = product.seo_description || product.description || `${product.brand}의 ${product.name} 제품을 마젠타몰에서 만나보세요.`;
  const url = `https://www.magentalabblog.com/shop/${id}`;

  return {
    title,
    description,
    keywords: product.tags || [],
    alternates: {
      canonical: `/shop/${id}`,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: product.image_url || "/images/favicon.png",
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image_url || "/images/favicon.png"],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">상품 정보를 찾을 수 없습니다.</h1>
        <p className="text-gray-500 mb-8 text-sm">해당 상품이 삭제되었거나 잘못된 경로입니다.<br/>(ID: {id})</p>
        <Link href="/shop" className="px-6 py-3 bg-magenta text-white font-bold rounded-xl shadow-lg shadow-magenta/20 transition-transform active:scale-95">
          샵으로 돌아가기
        </Link>
      </div>
    );
  }

  const discountRate = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100) 
    : 0;

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* 모바일 헤더 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link href="/shop" className="p-2 -ml-2 text-gray-400 hover:text-magenta transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-magenta transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-magenta transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto md:pt-8 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* 상품 이미지 */}
          <div className="relative aspect-square w-full md:rounded-3xl overflow-hidden bg-gray-50">
            <Image
              src={product.image_url || "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&q=80"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.badge && (
              <div className="absolute top-6 left-6 bg-magenta text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest shadow-lg shadow-magenta/30">
                {product.badge}
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="px-5 py-6 md:px-0 flex flex-col">
            <div className="text-gray-400 text-sm font-bold tracking-tight mb-2">
              {product.brand || "마젠타랩"}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-black text-gray-900">{product.rating || "5.0"}</span>
                <span className="text-xs text-gray-400 font-medium">({product.review_count || 0})</span>
              </div>
              <div className="h-3 w-px bg-gray-200" />
              <div className="text-xs font-bold text-magenta tracking-wide">
                {product.tag || "연구소 추천"}
              </div>
            </div>

            <div className="mb-8">
              {product.original_price && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-400 line-through font-medium">
                    {product.original_price.toLocaleString()}원
                  </span>
                  <span className="text-sm text-red-500 font-black">
                    {discountRate}% OFF
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-900">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-lg font-bold text-gray-900">원</span>
              </div>
            </div>

            {/* 상세 설명 요약 */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-8">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {product.description || "이 제품은 마젠타랩 반려동물 연구소에서 직접 테스트하고 검증한 아이템입니다. 아이들의 건강과 행복을 위해 가장 안전한 성분과 소재를 사용했습니다."}
              </p>
            </div>

            {/* 배송 정보 */}
            <div className="space-y-3 mb-auto pb-8 border-b border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold">배송비</span>
                <span className="text-gray-900 font-bold">3,000원 (50,000원 이상 구매 시 무료)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold">배송안내</span>
                <span className="text-gray-900 font-bold">평일 오후 2시 이전 주문 시 당일 발송</span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 섹션 (상세 이미지 + 리뷰) */}
        <div className="mt-12 px-5 md:px-0">
          <div className="border-b border-gray-100 flex gap-8 mb-8 sticky top-[60px] bg-white/90 backdrop-blur-md z-40">
            <button className="pb-4 border-b-2 border-magenta text-sm font-black text-gray-900 tracking-wider">상세정보</button>
            <a href="#reviews" className="pb-4 text-sm font-bold text-gray-400 tracking-wider hover:text-gray-600 transition-colors">리뷰 ({product.review_count || 0})</a>
            <button className="pb-4 text-sm font-bold text-gray-400 tracking-wider hover:text-gray-600 transition-colors">Q&A</button>
          </div>
          
          {/* 상세 이미지 영역 */}
          <div className="space-y-4 mb-20">
            {(product.detail_images && product.detail_images.length > 0) ? (
              product.detail_images.map((img: string, idx: number) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={`${product.name} 상세설명 ${idx + 1}`} 
                  className="w-full h-auto block rounded-xl md:rounded-3xl shadow-sm"
                  loading="lazy"
                />
              ))
            ) : (
              <div className="py-24 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                <div className="text-4xl mb-4">🧪</div>
                <p className="text-gray-400 text-sm font-black tracking-tight">마젠타 연구소에서 상세 정보를 정밀 분석 중입니다.</p>
              </div>
            )}
          </div>

          {/* ⭐ 실제 리뷰 섹션 */}
          <ProductReviews productId={String(product.id)} />
        </div>
      </div>

      {/* 하단 구매 플로팅 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-4 pb-safe md:pb-6">
        <div className="max-w-5xl mx-auto flex gap-3">
          <AddToCartButton product={product} />
          <button className="flex-1 h-14 bg-magenta text-white rounded-2xl font-black text-lg shadow-xl shadow-magenta/20 active:scale-95 transition-transform">
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
}
