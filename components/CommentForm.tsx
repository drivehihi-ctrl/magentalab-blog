"use client";

import { useState } from "react";

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    content: "",
  });
  const [agreedToConsent, setAgreedToConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToConsent) {
      setErrorMessage("개인정보 수집 및 이용에 동의해주세요.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://magentalab.mycafe24.com"}/wp-json/wp/v2/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: postId,
          author_name: formData.author_name,
          author_email: formData.author_email,
          content: formData.content,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "댓글 등록 중 오류가 발생했습니다.");
      }

      setStatus("success");
      setFormData({ author_name: "", author_email: "", content: "" });
      setAgreedToConsent(false);
    } catch (err: any) {
      console.error("Comment submission error:", err);
      setStatus("error");
      setErrorMessage(err.message || "댓글 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  if (status === "success") {
    return (
      <div className="p-8 rounded-3xl bg-magenta-light/30 border-2 border-magenta/20 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-magenta rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-magenta/20">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="text-xl font-bold text-magenta mb-2">댓글이 등록되었습니다!</h4>
        <p className="text-gray-600 mb-2">관리자 승인 후 블로그에 표시됩니다.</p>
        <p className="text-magenta font-bold text-sm">입력하신 이메일로 '매주의 연구소 결과 PDF'를 발송해 드릴 예정입니다! ✨</p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-bold text-magenta hover:underline"
        >
          새 댓글 작성하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 rounded-4xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50">
      {/* Lead Magnet Banner */}
      <div className="mb-8 p-5 rounded-2xl bg-magenta-light/40 border border-magenta/10 flex items-center gap-4 animate-pulse">
        <div className="text-3xl">🎁</div>
        <div>
          <p className="text-sm md:text-base font-bold text-magenta-dark leading-tight">
            지금 댓글을 남겨주시면 <span className="underline decoration-2">‘매주의 연구소 결과 PDF’</span>를 보내드려요!
          </p>
          <p className="text-[11px] text-magenta/70 mt-1 font-medium">관리자 확인 후 입력하신 이메일로 자동 발송됩니다.</p>
        </div>
      </div>

      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-magenta rounded-full" />
        생각 나누기
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">이름</label>
          <input
            type="text"
            required
            placeholder="성함 또는 닉네임"
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            className="w-full px-5 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-magenta outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">이메일</label>
          <input
            type="email"
            required
            placeholder="example@email.com"
            value={formData.author_email}
            onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
            className="w-full px-5 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-magenta outline-none transition-all"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">내용</label>
        <textarea
          required
          rows={4}
          placeholder="소중한 의견을 남겨주세요."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-5 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-magenta outline-none transition-all resize-none"
        />
      </div>

      {/* Privacy Consent */}
      <div className="mb-6 px-1">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            required
            checked={agreedToConsent}
            onChange={(e) => setAgreedToConsent(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-gray-200 text-magenta focus:ring-magenta transition-all cursor-pointer"
          />
          <span className="text-xs md:text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
            [필수] 개인정보 수집 및 이용 동의 (이메일 마케팅 및 안내)
          </span>
        </label>
      </div>

      {status === "error" && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 italic">
          ⚠️ {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-4 bg-magenta hover:bg-magenta-dark disabled:bg-gray-300 text-white font-bold rounded-2xl shadow-lg shadow-magenta/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
      >
        {status === "submitting" ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            댓글 등록하고 PDF 받기
          </>
        )}
      </button>
      
      <p className="mt-4 text-[11px] text-gray-400 text-center leading-tight">
        비방, 욕설, 광고성 댓글은 삭제될 수 있습니다. <br />
        입력하신 이메일은 마케팅 활용 및 PDF 발송 목적으로만 사용됩니다.
      </p>
    </form>

  );
}
