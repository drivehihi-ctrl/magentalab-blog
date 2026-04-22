"use client";

import { useState } from "react";

interface AICommentAssistantProps {
  initialContext?: string;
  postTitle?: string;
  variant?: "admin" | "post";
}

interface AISuggestion {
  nickname: string;
  content: string;
}

export default function AICommentAssistant({ initialContext = "", postTitle = "", variant = "admin" }: AICommentAssistantProps) {
  const [context, setContext] = useState(initialContext);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
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

  const copyToClipboard = (nickname: string, content: string) => {
    const fullText = `닉네임: ${nickname}\n내용: ${content}`;
    navigator.clipboard.writeText(fullText);
    alert(`[${nickname}] 님의 댓글이 클립보드에 정밀하게 복사되었습니다! 📋`);
  };

  return (
    <div className={`${isPostVariant ? "bg-gray-50 border-2 border-dashed border-gray-200" : "bg-white border border-gray-100 shadow-xl shadow-gray-200/50"} rounded-3xl p-6 md:p-8 max-w-2xl mx-auto my-12`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 ${isPostVariant ? "bg-white" : "bg-magenta"} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
          {isPostVariant ? "✨" : "🏭"}
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            {isPostVariant ? "안심이의 댓글 아이디어" : "안심이 AI 댓글 공장 (Persona Beta)"}
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            {isPostVariant ? "포스팅 내용을 분석해 정성스러운 댓글 초안을 만들어 드릴까요?" : "한 번의 클릭으로 5명의 서로 다른 집사님 댓글을 찍어냅니다."}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {!isPostVariant && (
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-[0.2em]">포스팅 주제 또는 맥락</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="예: 밥 안먹는 고양이, 눈물 자국 고민 등"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-magenta outline-none transition-all text-sm font-medium shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">🧪</div>
            </div>
          </div>
        )}

        <button 
          onClick={generateComment}
          disabled={loading}
          className={`w-full py-5 ${isPostVariant ? "bg-gray-900" : "bg-magenta"} hover:brightness-110 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(229,0,126,0.3)] transition-all active:scale-[0.97] flex items-center justify-center gap-3 text-base`}
        >
          {loading ? (
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
             isPostVariant ? "✨ AI에게 댓글 추천받기" : "🚀 5인 5색 댓글 공장 가동하기"
          )}
        </button>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-[11px] font-bold border border-red-100 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-[1px] flex-1 bg-gray-100" />
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">생성된 페르소나 댓글</span>
              <div className="h-[1px] flex-1 bg-gray-100" />
            </div>

            {suggestions.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-100 relative group hover:border-magenta/30 hover:shadow-lg hover:shadow-magenta/5 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-xs shadow-inner">👤</div>
                    <span className="text-sm font-black text-gray-800">
                      {item.nickname}
                    </span>
                  </div>
                  <span className="bg-gray-50 text-[9px] font-bold text-gray-400 px-2 py-0.5 rounded-md uppercase">
                    Persona #{idx + 1}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 font-medium italic">
                  "{item.content}"
                </p>

                <button 
                  onClick={() => copyToClipboard(item.nickname, item.content)}
                  className="w-full py-2.5 rounded-xl bg-gray-50 text-magenta font-bold text-[11px] hover:bg-magenta hover:text-white transition-all flex items-center justify-center gap-2 border border-magenta/10"
                >
                  📋 닉네임 + 내용 복사하기
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 pt-5 border-t border-gray-100 text-[10px] text-gray-400 font-medium text-center leading-relaxed">
        {isPostVariant ? 
          "* AI가 분석한 추천 댓글입니다. 자유롭게 수정해서 사용해 보세요!" :
          "💡 생성된 닉네임과 댓글을 복사해 블로그에 작성해 보세요. \n북적북적 활기찬 연구소 분위기를 0.1% 정밀하게 연출할 수 있습니다."
        }
      </div>
    </div>
  );
}

