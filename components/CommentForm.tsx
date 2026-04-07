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
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        <p className="text-gray-600">관리자 승인 후 블로그에 표시됩니다.</p>
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
            댓글 등록하기
          </>
        )}
      </button>
      
      <p className="mt-4 text-[11px] text-gray-400 text-center leading-tight">
        비방, 욕설, 광고성 댓글은 삭제될 수 있습니다. <br />
        입력하신 이메일은 공개되지 않습니다.
      </p>
    </form>
  );
}
