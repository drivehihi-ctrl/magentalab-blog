'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      title: isEn ? 'DM & Calorie Calculator' : isJa ? 'DM・カロリー計算機' : '습식 DM & 칼로리 계산기',
      desc: isEn ? 'Check exact moisture & calorie intake' : isJa ? '正確な水分・カロリー摂取量を計算' : '사료의 진짜 단백질 함량과 권장 칼로리 계산',
      link: isEn ? '/en/dm-calculator' : isJa ? '/ja/dm-calculator' : '/dm-calculator',
      tag: isEn ? 'NUTRITION' : isJa ? '栄養' : '영양·식단',
    },
    {
      icon: Activity,
      title: isEn ? 'BCS Obesity Diagnoser' : isJa ? 'BCS 肥満度診断' : 'BCS 체체중 & 비만도 진단',
      desc: isEn ? 'Evaluate body condition score 1-9' : isJa ? '体型スコア1〜9段階で肥満度を測定' : '우리 아이 현재 체형 스코어와 다이어트 목표',
      link: isEn ? '/en/bcs-calculator' : isJa ? '/ja/bcs-calculator' : '/bcs-calculator',
      tag: isEn ? 'HEALTH' : isJa ? '体型' : '체형·비만',
    },
    {
      icon: AlertTriangle,
      title: isEn ? 'Toxic Food Emergency Checker' : isJa ? '誤食・中毒緊急チェッカー' : '음식 독성 & 응급 처치 체커',
      desc: isEn ? 'Instant check for onion, garlic, chocolate' : isJa ? '양파・마늘・초콜릿 위험도 확인' : '양파, 마늘, 초콜릿 섭취 시 긴급 대처 가이드',
      link: isEn ? '/en/emergency-calculator' : isJa ? '/ja/emergency-calculator' : '/emergency-calculator',
      tag: isEn ? 'EMERGENCY' : isJa ? '緊急' : '응급·독성',
    },
    {
      icon: Bone,
      title: isEn ? 'Patella Joint Self-Diagnoser' : isJa ? 'パテラ（膝蓋骨）セルフ診断' : '슬개골 관절 건강 셀프 진단',
      desc: isEn ? 'Check limp & step risk level' : isJa ? '歩行異常と関節リスクをチェック' : '소형견 슬개골 탈구 단계별 증상 확인',
      link: isEn ? '/en/patella-diagnoser' : isJa ? '/ja/patella-diagnoser' : '/patella-diagnoser',
      tag: isEn ? 'JOINT' : isJa ? '関節' : '관절·슬개골',
    },
    {
      icon: Stethoscope,
      title: isEn ? 'Feline Cystitis (FIC) Checker' : isJa ? '猫の特発性膀胱炎（FIC）チェック' : '고양이 특발성 방광염(FIC) 진단',
      desc: isEn ? 'Identify frequent litter box visits & stress' : isJa ? '頻尿・血尿・ストレスサインを分析' : '빈뇨, 화장실 들락거림 등 방광염 위험 분석',
      link: isEn ? '/en/fic-diagnoser' : isJa ? '/ja/fic-diagnoser' : '/fic-diagnoser',
      tag: isEn ? 'CAT HEALTH' : isJa ? '猫の健康' : '고양이 방광',
    },
    {
      icon: DollarSign,
      title: isEn ? 'Petcare Lifetime Expense Calc' : isJa ? '生涯飼育費＆医療費計算' : '생애주기 펫 양육비 계산기',
      desc: isEn ? 'Estimate medical & supply budget' : isJa ? '年齢別・生涯の医療費と準備金を試算' : '나이별 숨은 병원비와 평생 필요 예산 산출',
      link: isEn ? '/en/petcare-expenses-calculator' : isJa ? '/ja/petcare-expenses-calculator' : '/petcare-expenses-calculator',
      tag: isEn ? 'BUDGET' : isJa ? '費用' : '양육비·예산',
    },
    {
      icon: Calendar,
      title: isEn ? 'Human Age Converter' : isJa ? '人間の年齢換算' : '반려동물 나이 → 사람 나이 환산',
      desc: isEn ? 'Convert cat/dog age to human equivalent' : isJa ? '愛犬・愛猫の年齢を人間の歳に換算' : '아이의 실제 생체 나이와 사람 연령 비교',
      link: isEn ? '/en/age-calculator' : isJa ? '/ja/age-calculator' : '/age-calculator',
      tag: isEn ? 'AGE' : isJa ? '年齢' : '나이·성장',
    },
  ];

  return (
    <section className="py-14 bg-white border-y border-rose-100/60 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#E5007E]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT: Ansim-i Character Panel ── */}
          <div className="w-full lg:w-[300px] lg:shrink-0">
            <div
              className="rounded-3xl overflow-hidden relative flex flex-col items-center text-center px-6 pt-8 pb-6"
              style={{
                background: 'linear-gradient(145deg, #f9e6f4 0%, #fce4f0 40%, #ffe4f4 100%)',
                border: '1px solid #f0c0df',
              }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#E5007E]/20 text-[#E5007E] text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm">
                <ShieldCheck className="w-3 h-3" />
                <span>
                  {isEn ? 'FREE DIAGNOSTIC TOOLS' : isJa ? '無料診断ツール' : '마젠타랩 무료 진단센터'}
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-xl font-extrabold text-[#1a1a2e] leading-snug mb-2">
                {isEn ? (
                  <>Pet Health <span className="text-[#E5007E]">Research Tools</span></>
                ) : isJa ? (
                  <>愛犬・愛猫の<span className="text-[#E5007E]">健康チェック</span></>
                ) : (
                  <>우리 아이 상태,<br /><span className="text-[#E5007E]">데이터로 확인하세요 🔬</span></>
                )}
              </h2>

              {/* Sub description */}
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-5">
                {isEn
                  ? 'Accurate vet-formula calculators by Ansim Research Team.'
                  : isJa
                  ? 'アンシム研究チームが開発した無料精密診断ツール。'
                  : '수석 연구원 안심이가 수의학 공식을 기반으로 제작한 7대 무료 정밀 진단 도구입니다.'}
              </p>

              {/* Ansim-i Character Image */}
              <div className="relative w-48 h-48 mx-auto" style={{ animation: 'float 5s ease-in-out infinite' }}>
                <Image
                  src="/images/wing.png"
                  alt="수석 연구원 안심이"
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>

              {/* Name badge */}
              <div className="mt-4 text-xs font-black text-[#E5007E] tracking-wide">
                {isEn ? '🐾 Ansim-i Senior Researcher' : isJa ? '🐾 アンシム 主任研究員' : '🐾 수석 연구원 안심이'}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Calculator Cards Grid ── */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {tools.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    href={item.link}
                    className="group p-5 rounded-2xl border border-rose-100 bg-white hover:border-[#E5007E]/30 hover:shadow-lg hover:shadow-[#E5007E]/8 transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {/* Icon — all magenta */}
                        <div className="w-9 h-9 rounded-xl bg-[#E5007E] flex items-center justify-center shadow-md shadow-[#E5007E]/20 group-hover:scale-110 transition-transform">
                          <Icon className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
                        </div>
                        {/* Tag badge */}
                        <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-[#E5007E] border border-rose-200/60 uppercase">
                          {item.tag}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-gray-900 mb-1.5 group-hover:text-[#E5007E] transition-colors leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs font-medium text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-0.5 text-xs font-extrabold text-[#E5007E] group-hover:translate-x-1 transition-transform pt-3 mt-3 border-t border-gray-100">
                      <span>{isEn ? 'Start Now' : isJa ? '今すぐ診断' : '지금 진단하기'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
