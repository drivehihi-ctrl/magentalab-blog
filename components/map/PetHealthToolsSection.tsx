'use client';

import React from 'react';
import Link from 'next/link';
import { Calculator, Activity, HeartPulse, ShieldAlert, Zap, Stethoscope, ArrowRight, Sparkles } from 'lucide-react';

interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  badge: string;
  icon: React.ElementType;
  gradient: string;
  badgeBg: string;
}

const HEALTH_TOOLS: ToolItem[] = [
  {
    id: 'age',
    title: '나이 환산 계산기',
    subtitle: '사람 나이 환산 & 생애 주기 맞춤 케어',
    href: '/age-calculator',
    badge: '🔥 인기 1위',
    icon: Calculator,
    gradient: 'from-indigo-500 to-purple-600',
    badgeBg: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    id: 'bcs',
    title: 'BCS 비만도 진단',
    subtitle: '9단계 체형 평가 & 맞춤 다이어트 가이드',
    href: '/bcs-calculator',
    badge: '체형 케어',
    icon: Activity,
    gradient: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    id: 'patella',
    title: '슬개골 탈구 진단',
    subtitle: '1~4단계 관절 증상 체크 & 예방 수칙',
    href: '/patella-diagnoser',
    badge: '관절 건강',
    icon: HeartPulse,
    gradient: 'from-rose-500 to-pink-600',
    badgeBg: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  {
    id: 'dm',
    title: 'DM 척수증 진단',
    subtitle: '보행 장애 & 뒷다리 마비 신경 증상 체크',
    href: '/dm-calculator',
    badge: '신경 질환',
    icon: ShieldAlert,
    gradient: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'emergency',
    title: '응급 대처 계산기',
    subtitle: '초콜릿/이물 섭취 등 긴급 상황별 수칙',
    href: '/emergency-calculator',
    badge: '🚨 긴급 케어',
    icon: Zap,
    gradient: 'from-red-500 to-rose-700',
    badgeBg: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    id: 'fic',
    title: '고양이 방광염 진단',
    subtitle: '특발성 방광염 (FIC) 스트레스 지수 체크',
    badge: '🐱 고양이 전용',
    href: '/fic-diagnoser',
    icon: Stethoscope,
    gradient: 'from-blue-500 to-cyan-600',
    badgeBg: 'bg-blue-100 text-blue-700 border-blue-200',
  },
];

export default function PetHealthToolsSection() {
  return (
    <div className="space-y-4 font-sans">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E5007E]" />
            🐶 펫 헬스케어 셀프 진단 계산기
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            마젠타랩 AI가 알려주는 우리 아이 건강 상태 1분 셀프 체크
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {HEALTH_TOOLS.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative flex flex-col justify-between p-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-slate-50/50 to-gray-50 shadow-sm hover:shadow-md hover:border-[#E5007E]/30 transition-all duration-200 overflow-hidden"
            >
              {/* Top Row: Icon + Badge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tool.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tool.badgeBg}`}>
                    {tool.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-[#E5007E] transition-colors leading-tight">
                    {tool.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 line-clamp-2 leading-snug">
                    {tool.subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom Action Line */}
              <div className="mt-4 pt-2 border-t border-gray-100/80 flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#E5007E] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  진단해 보기
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
