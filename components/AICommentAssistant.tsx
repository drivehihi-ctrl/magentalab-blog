"use client";

import { useState } from "react";

interface AICommentAssistantProps {
  initialContext?: string;
  postTitle?: string;
  variant?: "admin" | "post";
}

export default function AICommentAssistant({ initialContext = "", postTitle = "", variant = "admin" }: AICommentAssistantProps) {
  const [context, setContext] = useState(initialContext);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPostVariant = variant === "post";

  const generateComment = async () => {
    const finalContext = context.trim() || postTitle;
    if (!finalContext) {
      alert("포스팅 주제를 입력해주세요! 정밀 분석이 필요합니다. 🧪");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const response = await fetch("/api/comment/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: finalContext }),
      });

      if (!response.ok) {
        throw new Error("API 연동 중 연구 오류가 발생했습니다. (GEMINI_FAIL)");
      }

      const data = await response.json();
      if (data.comments && Array.isArray(data.comments)) {
        setSuggestions(data.comments);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "댓글 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("댓글이 클립보드에 정밀하게 복사되었습니다! 📋");
  };

  return (
    <div className={`${isPostVariant ? "bg-gray-50 border-2 border-dashed border-gray-200" : "bg-white border border-gray-100 shadow-xl shadow-gray-200/50"} rounded-3xl p-6 md:p-8 max-w-2xl mx-auto my-12`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-10 h-10 ${isPostVariant ? "bg-white" : "bg-magenta"} rounded-xl flex items-center justify-center text-xl shadow-sm`}>
          {isPostVariant ? "✨" : "🤖"}
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900">
            {isPostVariant ? "안심이의 댓글 아이디어" : "안심이 AI 댓글 어시스턴트"}
          </h3>
          <p className="text-xs text-gray-500">
            {isPostVariant ? "포스팅 내용을 분석해 정성스러운 댓글 초안을 만들어 드릴까요?" : "포스팅 주제를 입력하면 사람 같은 다정한 댓글을 생성해 드립니다."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {!isPostVariant && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">포스팅 주제 또는 맥락</label>
            <input 
              type="text"
              placeholder="예: 밥 안먹는 고양이, 눈물 자국 고민 등"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-magenta outline-none transition-all text-sm"
            />
          </div>
        )}

        <button 
          onClick={generateComment}
          disabled={loading}
          className={`w-full py-4 ${isPostVariant ? "bg-gray-900" : "bg-magenta"} hover:opacity-90 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
             isPostVariant ? "✨ AI에게 댓글 추천받기 (제미나이 2.0)" : "✨ 제미나이 AI 정밀 분석 시작"
          )}
        </button>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-[11px] font-medium border border-red-100 italic">
            ⚠️ {error}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
            {suggestions.map((text, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-gray-100 relative group shadow-sm">
                <span className="absolute -top-2.5 left-4 bg-white px-2 py-0.5 rounded-full border border-gray-100 text-[9px] font-bold text-magenta uppercase tracking-widest">
                  Suggestion #{idx + 1}
                </span>
                <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-wrap">
                  {text}
                </p>
                <button 
                  onClick={() => copyToClipboard(text)}
                  className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-magenta hover:underline opacity-60 group-hover:opacity-100 transition-opacity"
                >
                  📋 이 내용으로 작성하기
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 text-[10px] text-gray-400 leading-tight">
        {isPostVariant ? 
          "* 팁: AI가 추천한 댓글을 복사해 아래 댓글창에 붙여넣어 보세요! 소중한 소통의 시작이 됩니다." :
          "* 팁: 생성된 댓글을 블로그 포스팅에 직접 작성하시면 마치 집사인 것처럼 소통을 유도할 수 있습니다."
        }
      </div>
    </div>
  );
}

