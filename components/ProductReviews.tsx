"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface Review {
  id: number;
  author_name: string;
  rating: number;
  content: string;
  created_at: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 폼 상태
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function fetchReviews() {
    setLoading(true);
    const res = await fetch(`/api/shop/reviews?product_id=${productId}`);
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  }

  useEffect(() => { fetchReviews(); }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      alert("닉네임과 리뷰 내용을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/shop/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, author_name: authorName, rating, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAuthorName("");
      setRating(5);
      setContent("");
      setShowForm(false);
      fetchReviews();
      alert("✅ 리뷰가 등록되었습니다. 감사합니다! 🐾");
    } catch (err: any) {
      alert("❌ 등록 실패: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div id="reviews" className="pt-20 border-t border-gray-100 mb-20">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            리뷰 <span className="text-magenta">{reviews.length}</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium">마젠타 연구소 사장님들의 생생한 연구 기록입니다.</p>
        </div>
        {avgRating && (
          <div className="flex items-center gap-6 bg-gray-50 px-6 py-4 rounded-2xl">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-gray-900">{avgRating}</span>
              <div className="flex text-amber-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.round(Number(avgRating)) ? "fill-current" : ""}`} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 리뷰 작성 버튼 */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mb-8 py-4 border-2 border-dashed border-magenta/30 rounded-2xl text-magenta font-bold text-sm hover:bg-magenta/5 transition-all active:scale-[0.98]"
        >
          ✏️ 리뷰 작성하기
        </button>
      )}

      {/* 리뷰 작성 폼 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <h3 className="text-base font-black text-gray-900 mb-4">리뷰 작성</h3>

          {/* 별점 */}
          <div className="flex items-center gap-1 mb-4">
            <span className="text-sm font-bold text-gray-600 mr-2">별점</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                className="p-0.5"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    s <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* 닉네임 */}
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="닉네임 (예: 보리맘)"
            className="w-full mb-3 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-magenta bg-white"
            maxLength={20}
          />

          {/* 내용 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="제품 사용 후기를 솔직하게 남겨주세요 🐾"
            className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-magenta bg-white resize-none"
            rows={4}
            maxLength={500}
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-magenta text-white rounded-xl text-sm font-black shadow-lg shadow-magenta/20 active:scale-95 transition-transform disabled:opacity-50"
            >
              {submitting ? "등록 중..." : "리뷰 등록하기"}
            </button>
          </div>
        </form>
      )}

      {/* 리뷰 목록 */}
      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">리뷰를 불러오는 중...</div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-gray-400 text-sm font-bold">아직 등록된 리뷰가 없어요.</p>
          <p className="text-gray-300 text-xs mt-2">첫 번째 리뷰를 남겨보세요!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map((rev, i) => (
            <div key={rev.id} className="pb-8 border-b border-gray-50">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs text-magenta font-black">
                    {rev.author_name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900">{rev.author_name}</div>
                    <div className="flex text-amber-400 mt-0.5">
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {new Date(rev.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed font-medium pl-10">{rev.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
