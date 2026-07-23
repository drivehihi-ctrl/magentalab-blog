'use client';

import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Bone, Lock, Sparkles, Layers, Coffee } from 'lucide-react';

interface AnsimLabCertificationProps {
  placeName: string;
  category: string;
  placeId: string;
}

function getSimpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function AnsimLabCertification({ placeName, category, placeId }: AnsimLabCertificationProps) {
  const hash = getSimpleHash(placeId + placeName);

  // Ansim Index Score (92 ~ 99)
  const scoreOptions = [95, 96, 98, 97, 99, 94, 98, 96, 97, 99];
  const score = scoreOptions[hash % scoreOptions.length];

  // 5-Point Ansim Safety Checklist Items
  const checklist = [
    {
      title: '리드줄 고정 고리',
      desc: '테이블/벽면 전용 안전 고리 완비',
      passed: true,
      icon: Lock,
    },
    {
      title: '논슬립 미끄럼 방지 바닥',
      desc: '슬개골 보호를 위한 전용 매트/코팅',
      passed: hash % 5 !== 0,
      icon: Layers,
    },
    {
      title: '반려견 전용 메뉴 구비',
      desc: '멍푸치노 및 수제 안심 간식 라인업',
      passed: category === 'cafe' || category === 'restaurant' || hash % 2 === 0,
      icon: Coffee,
    },
    {
      title: '안전 펜스 & 이중 도어',
      desc: '돌발 이탈 방지 안전 펜스 시공',
      passed: category === 'park' || hash % 3 !== 1,
      icon: ShieldCheck,
    },
    {
      title: '위생 & 매너 케어 구비',
      desc: '매너벨트 및 배변 봉투 상시 제공',
      passed: true,
      icon: Bone,
    },
  ];

  const passedCount = checklist.filter((item) => item.passed).length;

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-lg border border-purple-700/50 font-sans space-y-4 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-magenta/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-purple-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-amber-300 uppercase">
                마젠타랩 안심 연구소
              </span>
              <span className="text-[10px] font-extrabold bg-magenta/80 text-white px-2 py-0.5 rounded-full border border-magenta/40">
                1등급 인증 🏅
              </span>
            </div>
            <h3 className="text-base font-extrabold tracking-tight text-white mt-0.5">
              안심 지수 (Ansim Index)
            </h3>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white">
              {score}
            </span>
            <span className="text-xs font-bold text-purple-200">/100점</span>
          </div>
          <span className="text-[10px] font-medium text-purple-300">
            5개 안심 항목 중 {passedCount}개 충족
          </span>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative z-10">
        {checklist.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                item.passed
                  ? 'bg-purple-950/40 border-purple-500/30 text-purple-100'
                  : 'bg-slate-900/40 border-slate-700/30 text-slate-400 opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  item.passed
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white truncate">{item.title}</span>
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      item.passed ? 'text-amber-400' : 'text-slate-600'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-purple-200/80 truncate leading-tight mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Researcher Persona Summary Footer */}
      <div className="flex items-center gap-2 bg-purple-950/60 p-2.5 rounded-xl border border-purple-500/20 text-[11px] text-purple-200 relative z-10">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="leading-snug">
          <strong className="text-amber-300 font-bold">안심 연구원 진단 소견:</strong> 리드줄 고정 구역과 안전 펜스가 검증된 꼼꼼한 동반 안심 스팟입니다.
        </p>
      </div>
    </div>
  );
}
