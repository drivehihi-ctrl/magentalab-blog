"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, Heart, Info, CheckCircle2 } from "lucide-react";

export default function AskAnsimiPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consent) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }
    
    setStatus("submitting");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  if (status === "success") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl shadow-magenta/5 text-center border border-magenta/10">
          <div className="w-20 h-20 bg-magenta/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-magenta w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">고민이 접수되었습니다!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            보내주신 소중한 고민은 안심 연구원이 꼼꼼히 읽어본 후, <br />
            블로그 포스팅이나 이메일을 통해 답변해 드릴게요. 조금만 기다려주세요! ✨
          </p>
          <button 
            onClick={() => setStatus("idle")}
            className="w-full py-4 bg-magenta text-white font-bold rounded-2xl shadow-lg shadow-magenta/20 hover:bg-magenta/90 transition-all active:scale-95"
          >
            추가 질문하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-magenta/10 text-magenta rounded-full font-bold text-xs uppercase tracking-widest mb-6">
          <Heart size={14} className="fill-magenta" /> Community Space
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
          안심이에게 <span className="text-magenta">물어보세요!</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed text-sm md:text-base font-medium">
          반려동물과 함께하며 느꼈던 고민, 궁금증, 혹은 사소한 걱정거리라도 괜찮아요. 
          안심 연구원이 과학적 근거와 따뜻한 마음을 담아 답변해 드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Left: Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-magenta/10 group">
            <Image 
              src="/images/like.png" 
              alt="Ansimi researcher" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
              <p className="text-white font-bold italic text-lg leading-tight lg:leading-normal">
                "혼자 고민하지 마세요. <br />우리가 함께 해결해 나갈게요."
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info size={18} className="text-magenta" /> 
              어떻게 진행되나요?
            </h3>
            <ul className="space-y-4">
              {[
                { title: "고민 접수", desc: "아래 폼을 통해 사연을 남겨주세요." },
                { title: "연구원 검토", desc: "안심 연구원이 최신 문헌과 데이터를 분석합니다." },
                { title: "답변 공개", desc: "익명으로 블로그 포스팅이나 메일로 답변합니다." }
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-none w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                    0{i+1}
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900 leading-none mb-1">{step.title}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-magenta/5 border-t-4 border-t-magenta">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">성함 / 닉네임</label>
                <input 
                  required
                  type="text" 
                  placeholder="예: 안심맘"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-magenta/20 transition-all font-medium text-gray-900 placeholder:text-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">이메일 주소</label>
                <input 
                  required
                  type="email" 
                  placeholder="answer@example.com"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-magenta/20 transition-all font-medium text-gray-900 placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">아이의 종류 및 나이</label>
              <input 
                required
                type="text" 
                placeholder="예: 3살 다크서클이 매력적인 푸들"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-magenta/20 transition-all font-medium text-gray-900 placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">고민 상담 내용</label>
              <textarea 
                required
                rows={5}
                placeholder="구체적으로 적어주실수록 더 정확한 도움을 드릴 수 있어요."
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-magenta/20 transition-all font-medium text-gray-900 placeholder:text-gray-300 resize-none"
              />
            </div>

            {/* Consent Checkbox */}
            <div className="bg-gray-50 p-6 rounded-2xl flex items-start gap-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setConsent(!consent)}>
              <div className="flex-none pt-0.5">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${consent ? 'bg-magenta border-magenta' : 'border-gray-300'}`}>
                  {consent && <CheckCircle2 size={12} className="text-white" />}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-800">개인정보 수집 및 상담 내용 활용 동의 (필수)</p>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  남겨주신 내용은 익명화 처리 후 블로그 콘텐츠로 활용될 수 있으며, <br />
                  답변 알림을 위해 성함과 이메일 주소를 수집합니다.
                </p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={status === "submitting"}
              className="w-full py-5 bg-magenta text-white text-lg font-black rounded-2xl shadow-xl shadow-magenta/20 hover:bg-magenta/90 hover:-translate-y-1 transition-all disabled:bg-gray-200 disabled:translate-y-0 flex items-center justify-center gap-3"
            >
              {status === "submitting" ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>질문 보내기 <Send size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
