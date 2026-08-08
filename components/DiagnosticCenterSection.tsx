'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Activity, 
  AlertTriangle, 
  Bone, 
  Stethoscope, 
  DollarSign, 
  Calendar, 
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface DiagnosticCenterProps {
  lang?: 'ko' | 'en' | 'ja';
}

export default function DiagnosticCenterSection({ lang = 'ko' }: DiagnosticCenterProps) {
  const isEn = lang === 'en';
  const isJa = lang === 'ja';

  const tools = [
    {
      icon: Calculator,
      color: 'from-pink-500 to-rose-500',
      bgLight: 'bg-rose-50 border-rose-200/80',
      iconBg: 'bg-rose-500 text-white',
      title: isEn ? 'DM & Calorie Calculator' : isJa ? 'DM・カロリー計算機' : '습식 DM & 칼로리 계산기',
      desc: isEn ? 'Check exact moisture & calorie intake' : isJa ? '正確な水分・カロリー摂取量を計算' : '사료의 진짜 단백질 함량과 권장 칼로리 계산',
      link: isEn ? '/en/dm-calculator' : isJa ? '/ja/dm-calculator' : '/dm-calculator',
      tag: isEn ? 'NUTRITION' : isJa ? '栄養' : '영양·식단',
    },
    {
      icon: Activity,
      color: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50 border-amber-200/80',
      iconBg: 'bg-amber-500 text-white',
      title: isEn ? 'BCS Obesity Diagnoser' : isJa ? 'BCS 肥満度診断' : 'BCS 체체중 & 비만도 진단',
      desc: isEn ? 'Evaluate body condition score 1-9' : isJa ? '体型スコア1〜9段階で肥満度を測定' : '우리 아이 현재 체형 스코어와 다이어트 목표',
      link: isEn ? '/en/bcs-calculator' : isJa ? '/ja/bcs-calculator' : '/bcs-calculator',
      tag: isEn ? 'HEALTH' : isJa ? '체형' : '체형·비만',
    },
    {
      icon: AlertTriangle,
      color: 'from-red-500 to-rose-600',
      bgLight: 'bg-red-50 border-red-200/80',
      iconBg: 'bg-red-500 text-white',
      title: isEn ? 'Toxic Food Emergency Checker' : isJa ? '誤食・中毒緊急チェッカー' : '음식 독성 & 응급 처치 체커',
      desc: isEn ? 'Instant check for onion, garlic, chocolate' : isJa ? '양파・마늘・초콜릿 위험도 확인' : '양파, 마늘, 초콜릿 섭취 시 긴급 대처 가이드',
      link: isEn ? '/en/emergency-calculator' : isJa ? '/ja/emergency-calculator' : '/emergency-calculator',
      tag: isEn ? 'EMERGENCY' : isJa ? '緊急' : '응급·독성',
    },
    {
      icon: Bone,
      color: 'from-blue-500 to-indigo-500',
      bgLight: 'bg-blue-50 border-blue-200/80',
      iconBg: 'bg-blue-500 text-white',
      title: isEn ? 'Patella Joint Self-Diagnoser' : isJa ? 'パテラ（膝蓋骨）セルフ診断' : '슬개골 관절 건강 셀프 진단',
      desc: isEn ? 'Check limp & step risk level' : isJa ? '歩행 이상 및 관절 위험도 체크' : '소형견 슬개골 탈구 단계별 증상 확인',
      link: isEn ? '/en/patella-diagnoser' : isJa ? '/ja/patella-diagnoser' : '/patella-diagnoser',
      tag: isEn ? 'JOINT' : isJa ? '関節' : '관절·슬개골',
    },
    {
      icon: Stethoscope,
      color: 'from-purple-500 to-indigo-600',
      bgLight: 'bg-purple-50 border-purple-200/80',
      iconBg: 'bg-purple-500 text-white',
      title: isEn ? 'Feline Cystitis (FIC) Checker' : isJa ? '猫の特発性膀胱炎（FIC）チェック' : '고양이 특발성 방광염(FIC) 진단',
      desc: isEn ? 'Identify frequent litter box visits & stress' : isJa ? '頻尿・血尿・ストレスサインを分析' : '빈뇨, 화장실 들락거림 등 방광염 위험 분석',
      link: isEn ? '/en/fic-diagnoser' : isJa ? '/ja/fic-diagnoser' : '/fic-diagnoser',
      tag: isEn ? 'CAT HEALTH' : isJa ? '猫の健康' : '고양이 방광',
    },
    {
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50 border-emerald-200/80',
      iconBg: 'bg-emerald-500 text-white',
      title: isEn ? 'Petcare Lifetime Expense Calc' : isJa ? '生涯飼육費＆医療費計算' : '생애주기 펫 양육비 계산기',
      desc: isEn ? 'Estimate medical & supply budget' : isJa ? '年齢別・生涯の医療費と準備金を試算' : '나이별 숨은 병원비와 평생 필요 예산 산출',
      link: isEn ? '/en/petcare-expenses-calculator' : isJa ? '/ja/petcare-expenses-calculator' : '/petcare-expenses-calculator',
      tag: isEn ? 'BUDGET' : isJa ? '費用' : '양육비·예산',
    },
    {
      icon: Calendar,
      color: 'from-cyan-500 to-blue-600',
      bgLight: 'bg-cyan-50 border-cyan-200/80',
      iconBg: 'bg-cyan-500 text-white',
      title: isEn ? 'Human Age Converter' : isJa ? '人間の年齢換算' : '반려동물 나이 ➔ 사람 나이 환산',
      desc: isEn ? 'Convert cat/dog age to human equivalent' : isJa ? '愛犬・愛猫の年齢を人間の歳に換算' : '아이의 실제 생체 나이와 사람 연령 비교',
      link: isEn ? '/en/age-calculator' : isJa ? '/ja/age-calculator' : '/age-calculator',
      tag: isEn ? 'AGE' : isJa ? '年齢' : '나이·성장',
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-white via-rose-50/40 to-white border-y border-rose-100 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 border border-rose-200 text-[#E5007E] text-[11px] font-black tracking-widest uppercase shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {isEn
                ? 'FREE DIAGNOSTIC TOOLS'
                : isJa
                ? '無料診断・計算ツール'
                : '마젠타랩 무료 진단센터'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e] tracking-tight leading-snug">
            {isEn ? (
              <>
                <span className="text-[#E5007E]">Pet Research Tools</span> for Health & Data
              </>
            ) : isJa ? (
              <>
                愛犬・愛猫の<span className="text-[#E5007E]">健康＆データ無料診断</span>
              </>
            ) : (
              <>
                우리 아이 상태, <span className="text-[#E5007E]">데이터로 지금 확인해보세요 🔬</span>
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">
            {isEn
              ? "Accurate veterinary formula calculators & self-assessment tools developed by Ansim Research Team."
              : isJa
              ? "アンシム研究チームが開発した獣医学計算機とセルフチェックツールで、愛犬・愛猫の健康をすぐ診断。"
              : "수석 연구원 안심이가 수의학 공식을 기반으로 제작한 7대 무료 정밀 진단 및 계산 도구입니다."}
          </p>
        </div>

        {/* Diagnostic Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tools.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.link}
                className={`group p-5 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white/90 backdrop-blur-sm ${item.bgLight} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`w-10 h-10 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-md shadow-rose-500/10 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black tracking-wider px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase border border-gray-200/60">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-gray-900 mb-1.5 group-hover:text-[#E5007E] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs font-medium text-gray-500 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-extrabold text-[#E5007E] group-hover:translate-x-1 transition-transform pt-2 border-t border-gray-100">
                  <span>
                    {isEn ? 'Start Test' : isJa ? '今すぐ診断' : '지금 진단하기'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
