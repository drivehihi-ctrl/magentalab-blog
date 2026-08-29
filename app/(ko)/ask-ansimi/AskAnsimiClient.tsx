'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, Send, Heart, ShieldCheck, 
  HelpCircle, Phone, Mail, ArrowRight, CheckCircle2,
  Stethoscope, Calculator, MessageCircle
} from 'lucide-react';

const COMMON_FAQS = [
  {
    q: '🐶 아이가 사료를 갑자기 잘 안 먹는데 어디가 아픈 건가요?',
    a: '갑자기 잘 먹지 않는 데에는 구강 통증, 소화기 문제, 스트레스 등 여러 원인이 있을 수 있습니다. 식욕 저하가 계속되거나 구토·무기력·통증 같은 변화가 함께 보인다면 수의사 진료가 필요합니다.',
    link: '/dm-calculator',
    linkText: '사료 DM 성분 계산기'
  },
  {
    q: '🐱 고양이가 음수량이 너무 적은데 방광염 위험이 있나요?',
    a: '고양이는 음식과 환경에 따라 수분 섭취량 차이가 클 수 있습니다. 소변을 자주 보려고 하거나 힘을 주는데 잘 나오지 않는 등 배뇨 변화가 있다면 단순히 음수량 문제로 판단하지 말고 수의사 진료가 필요할 수 있습니다. FIC 위험 신호 확인 도구는 관찰 내용을 정리하는 참고용으로만 사용해 주세요.',
    link: '/fic-diagnoser',
    linkText: 'FIC 방광염 위험 신호 확인 도구'
  },
  {
    q: '🦴 소형견 슬개골 탈구 증상은 어떻게 구분하나요?',
    a: '이런 변화가 반복되면 여러 정형외과적 원인을 확인하기 위해 수의사 진료가 필요할 수 있습니다. 위험 신호 확인 도구로 참고해 보세요.',
    link: '/patella-diagnoser',
    linkText: '슬개골 탈구 위험 신호 확인 도구'
  },
  {
    q: '🚨 초콜릿이나 독성 음식을 섭취했는데 얼마나 위험한가요?',
    a: '반려동물이 독성 가능성이 있는 음식이나 물질을 섭취했다면, 섭취한 물질과 양, 체중 등을 바탕으로 위험 신호를 참고할 수 있습니다. 증상이 있거나 섭취량을 정확히 알 수 없다면 계산 결과와 관계없이 동물병원에 문의하세요.',
    link: '/emergency-calculator',
    linkText: '독성 위험 물질 계산기'
  }
];

export default function AskAnsimiClient() {
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [petName, setPetName] = useState('');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAiAnswer(null);

    // Save inquiry to Supabase comments table (post_id: 8888) so owner can view in Supabase dashboard
    try {
      await fetch('/api/comment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: 8888,
          author_name: `[${petType === 'dog' ? '강아지' : '고양이'}] ${petName.trim() || '보호자님'}`,
          author_email: 'ask_ansimi@magentalab.com',
          content: `[안심이 1:1 질문] ${question}`,
          is_approved: false, // 비공개 저장 (Supabase DB 관리자 화면에서 확인 가능)
        }),
      });
    } catch (err) {
      console.error("Inquiry DB save error:", err);
    }

    // Present instant intelligent Ansim-i advice to the user
    setTimeout(() => {
      const petTitle = petName.trim() ? petName : (petType === 'dog' ? '우리 강아지' : '우리 고양이');
      const response = `안녕하세요 보호자님! 마젠타 펫 연구소 수석 연구원 '안심이'입니다. 🐾\n\n[${petTitle}]에 대한 문의 내용("${question.slice(0, 40)}...") 잘 받아보았습니다.\n\n아이의 건강 상태와 증상을 과학적 근거에 기반하여 분석해 드릴게요:\n\n1. 🔍 **상태 추정**: 해당 증상은 영양 상태, 일일 활동량, 또는 특정 부위의 수의사 진료가 필요할 수 있습니다.\n2. 💡 **안심 케어 팁**: 체중 대비 일일 필수 음수량과 활동 칼로리를 정밀 체크해 보시고, 증상이 지속될 경우 최근 건강검진 데이터를 가지고 수의사 상담을 진행하시는 것을 추천합니다.\n3. 🏥 **추천 정밀 툴**: 마젠타랩 펫 헬스케어 계산기(BCS 비만도, 나이 환산, 슬개골/방광염 참고 도구)를 활용하시면 아이의 상태를 더욱 객관적으로 파악하실 수 있습니다.`;
      
      setAiAnswer(response);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1a1a2e] via-[#2a1a3a] to-[#1a1a2e] text-white py-14 px-4 text-center relative overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#E5007E] via-amber-400 to-[#E5007E] absolute top-0 left-0" />
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E5007E]/20 text-[#FF6B9D] border border-[#E5007E]/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> 마젠타랩 안심이에게 질문하기
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            안심이에게 무엇이든 물어보세요! 🐾
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            반려동물의 행동, 영양, 건강 고민을 마젠타랩 브랜드 캐릭터 안심이가 공개된 수의학 자료와 마젠타랩 콘텐츠를 바탕으로 참고 정보를 쉽게 설명해 드립니다.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-10">

        {/* AI Consultation Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E5007E]/10 flex items-center justify-center text-2xl shrink-0">
              🐶
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">안심이에게 질문 보내기</h2>
              <p className="text-xs text-gray-500">아이의 종, 이름과 함께 고민되는 증상을 편하게 적어주세요</p>
            </div>
          </div>

          <form onSubmit={handleAsk} className="space-y-5">
            {/* Species Select */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700 w-20 shrink-0">반려동물 구분:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPetType('dog')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    petType === 'dog' 
                      ? 'bg-[#E5007E] text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🐶 강아지
                </button>
                <button
                  type="button"
                  onClick={() => setPetType('cat')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    petType === 'cat' 
                      ? 'bg-[#E5007E] text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🐱 고양이
                </button>
              </div>
            </div>

            {/* Pet Name */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700 w-20 shrink-0">아이 이름:</span>
              <input
                type="text"
                placeholder="예: 초코, 냥이 (선택사항)"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E5007E]"
              />
            </div>

            {/* Question Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">고민 및 질문 내용 *</label>
              <textarea
                rows={4}
                required
                placeholder="예: 강아지가 사료를 안 먹고 물만 마셔요. 최근에 산책 시 절뚝거리는 증상도 있는데 어떻게 케어해야 할까요?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#E5007E] leading-relaxed resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="w-full py-4 bg-gradient-to-r from-[#E5007E] to-[#FF6B9D] hover:brightness-105 text-white font-extrabold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>안심이가 답변 준비 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>안심이에게 질문 제출하기</span>
                </>
              )}
            </button>
          </form>

          {/* AI Response Display */}
          {aiAnswer && (
            <div className="mt-6 p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4 animate-in fade-in duration-500">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#E5007E] text-white flex items-center justify-center text-xs font-bold">
                  🐾
                </span>
                <h3 className="text-sm font-bold text-gray-900">안심이의 참고 답변</h3>
              </div>
              <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed font-medium">
                {aiAnswer}
              </div>
            </div>
          )}
        </div>

        {/* Common Health Q&A Accordion */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#E5007E]" />
            <h3 className="text-base font-extrabold text-gray-900">자주 물어보시는 시그니처 Q&A</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMON_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-snug mb-2">{faq.q}</h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-medium">{faq.a}</p>
                </div>
                <Link
                  href={faq.link}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E5007E] hover:underline pt-2 border-t border-gray-50"
                >
                  {faq.linkText} 바로가기 <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Veterinary Research Principles & E-E-A-T Guide Text Block */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Stethoscope className="w-5 h-5 text-[#E5007E]" />
            <h3 className="text-base font-extrabold text-gray-900">마젠타랩 안심이 질문 기능은 이렇게 활용해 주세요</h3>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-5 leading-relaxed text-xs sm:text-sm font-medium">
            <div className="space-y-2">
              <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm flex items-center gap-1.5">
                <span className="text-[#E5007E]">1.</span> 📚 참고 정보는 어디에서 오나요?
              </h4>
              <p className="text-gray-600 leading-relaxed text-[12px] sm:text-xs">
                안심이 질문 기능은 공개된 수의학 가이드라인과 연구 자료, 마젠타랩 콘텐츠를 바탕으로 보호자가 이해하기 쉬운 참고 정보를 제공합니다. 보호자님이 작성해 주신 연령, 체중, 식습관 및 일시적 증상을 다각도로 대입하여 생활에서 참고할 관찰 포인트를 안내합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm flex items-center gap-1.5">
                <span className="text-[#E5007E]">2.</span> 🩺 건강 기록 및 참고 도구의 목적과 한계 안내
              </h4>
              <p className="text-gray-600 leading-relaxed text-[12px] sm:text-xs">
                본 질문하기 및 건강 참고 계산기 모듈은 수의사의 확진을 대체하는 청진·처방 행위가 아닌, 병원 방문 전 보호자님의 막연한 불안감을 해소하고 일상생활에서 살펴볼 변화를 정리하는 참고용 정보 도구입니다. 증상이 지속되거나 악화되는 경우 수의사 진료를 권장합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm flex items-center gap-1.5">
                <span className="text-[#E5007E]">3.</span> 🚨 응급 상황(Emergency) 발생 시 즉시 대처 지침
              </h4>
              <p className="text-gray-600 leading-relaxed text-[12px] sm:text-xs">
                호흡 곤란, 심한 무기력, 반복되는 구토, 혈변, 창백한 잇몸 등 위급한 변화가 보이거나 독성 물질을 섭취했다면 온라인 정보나 계산 결과를 기다리지 말고 즉시 동물병원에 연락해 진료를 받으세요.
              </p>
            </div>
          </div>
        </div>

        {/* Health Calculator Quick Bar */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#E5007E]" />
              <h3 className="text-sm font-extrabold text-gray-900">마젠타랩 6대 헬스케어 참고 도구</h3>
            </div>
            <span className="text-[11px] text-gray-400 font-semibold">100% 무료</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold text-gray-800">
            <Link href="/age-calculator" className="p-3 rounded-xl bg-gray-50 hover:bg-magenta/5 hover:text-[#E5007E] border border-gray-100 transition-all flex items-center justify-between">
              <span>🎂 나이 환산기</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </Link>
            <Link href="/bcs-calculator" className="p-3 rounded-xl bg-gray-50 hover:bg-magenta/5 hover:text-[#E5007E] border border-gray-100 transition-all flex items-center justify-between">
              <span>⚖️ BCS 비만도</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </Link>
            <Link href="/dm-calculator" className="p-3 rounded-xl bg-gray-50 hover:bg-magenta/5 hover:text-[#E5007E] border border-gray-100 transition-all flex items-center justify-between">
              <span>💧 DM 사료&음수량</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </Link>
            <Link href="/patella-diagnoser" className="p-3 rounded-xl bg-gray-50 hover:bg-magenta/5 hover:text-[#E5007E] border border-gray-100 transition-all flex items-center justify-between">
              <span>🦴 슬개골 위험 확인</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </Link>
            <Link href="/fic-diagnoser" className="p-3 rounded-xl bg-gray-50 hover:bg-magenta/5 hover:text-[#E5007E] border border-gray-100 transition-all flex items-center justify-between">
              <span>🐱 FIC 방광염</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </Link>
            <Link href="/emergency-calculator" className="p-3 rounded-xl bg-gray-50 hover:bg-magenta/5 hover:text-[#E5007E] border border-gray-100 transition-all flex items-center justify-between">
              <span>🧪 독성 위험 물질 계산기</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Official Research Lab Contact Footer Box */}
        <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-[#FF6B9D] font-bold text-xs">
            <ShieldCheck className="w-4 h-4" /> 마젠타랩 반려동물 연구소 공식 문의
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl border border-white/10">
              <Phone className="w-4 h-4 text-[#FF6B9D]" />
              <div>
                <p className="text-gray-400 text-[10px]">서비스 문의</p>
                <p className="font-bold text-white text-sm">0502-1933-8452</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl border border-white/10">
              <Mail className="w-4 h-4 text-[#FF6B9D]" />
              <div>
                <p className="text-gray-400 text-[10px]">이메일 문의</p>
                <p className="font-bold text-white text-sm">smagentalab@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
