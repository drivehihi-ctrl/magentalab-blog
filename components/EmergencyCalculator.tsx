"use client";

import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  RotateCcw, 
  HelpCircle, 
  Weight, 
  Sparkles, 
  Activity,
  Heart,
  Skull,
  Search
} from "lucide-react";

// 위험 성분 유형 인터페이스
type ThreatType = "milk_chocolate" | "dark_chocolate" | "grape" | "xylitol";

interface ThreatInfo {
  id: ThreatType;
  name: string;
  icon: string;
  dangerDesc: string;
  inputUnit: string;
  unitWeightDesc: string;
}

const THREATS: Record<ThreatType, ThreatInfo> = {
  milk_chocolate: {
    id: "milk_chocolate",
    name: "밀크 초콜릿",
    icon: "🍫",
    dangerDesc: "초콜릿 내 테오브로민(Theobromine) 성분이 심장 및 중추신경계를 마비시킵니다. 밀크 초콜릿은 g당 약 2.0mg의 테오브로민이 함유되어 있습니다.",
    inputUnit: "g (그램)",
    unitWeightDesc: "※ 얇은 가나 초콜릿 1판은 약 34g, 초코파이 1개는 약 35g 입니다."
  },
  dark_chocolate: {
    id: "dark_chocolate",
    name: "다크 초콜릿",
    icon: "🖤",
    dangerDesc: "카카오 함량이 높아 테오브로민이 밀크 초콜릿의 7.5배 이상 함유되어 있습니다. g당 약 15.0mg 함유로 아주 소량으로도 치사량에 이릅니다.",
    inputUnit: "g (그램)",
    unitWeightDesc: "※ 카카오 72% 이상 다크 초콜릿 1개(조각)는 보통 약 5~8g 입니다."
  },
  grape: {
    id: "grape",
    name: "포도 / 건포도",
    icon: "🍇",
    dangerDesc: "포도의 미지의 성분이 급성 신부전(신장 기능 마비)을 일으킵니다. 체질에 따라 단 1알로도 요독증이 발생하여 치명적일 수 있습니다.",
    inputUnit: "g (그램)",
    unitWeightDesc: "※ 보통 포도 1알은 약 5~8g, 건포도 1알은 약 1g 입니다."
  },
  xylitol: {
    id: "xylitol",
    name: "자일리톨 (껌/캔디)",
    icon: "🍬",
    dangerDesc: "강아지의 인슐린 분비를 급격히 유도하여 심각한 급성 저혈당증(경련, 쇼크) 및 간 괴사(간부전)를 일으킵니다.",
    inputUnit: "g (그램)",
    unitWeightDesc: "※ 자일리톨 껌 1알의 자일리톨 함량은 보통 약 0.5~1g 내외입니다."
  }
};

interface SeverityLevel {
  level: "safe" | "caution" | "danger";
  title: string;
  badgeClass: string;
  cardClass: string;
  textClass: string;
  glowClass: string;
  actionGuide: string;
}

const SEVERITIES: Record<SeverityLevel["level"], SeverityLevel> = {
  safe: {
    level: "safe",
    title: "안전 / 관찰 요망 (MILD)",
    badgeClass: "bg-emerald-500 text-white shadow-emerald-500/30",
    cardClass: "bg-emerald-950/20 border-emerald-500/30",
    textClass: "text-emerald-400",
    glowClass: "shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-500 animate-pulse",
    actionGuide: "통계적인 독성 농도(20mg/kg) 이하로 추정되나, 초콜릿 내 카페인이나 기타 성분으로 인해 구토, 설사 등 경미한 위장 장애가 발생할 수 있습니다. 24시간 동안 구토 여부를 관찰해 주세요."
  },
  caution: {
    level: "caution",
    title: "주의 / 경고 단계 (WARNING)",
    badgeClass: "bg-amber-500 text-white shadow-amber-500/30",
    cardClass: "bg-amber-950/20 border-amber-500/30",
    textClass: "text-amber-400",
    glowClass: "shadow-[0_0_20px_rgba(245,158,11,0.35)] border-amber-500 animate-bounce-slow",
    actionGuide: "구토, 설사, 과호흡, 심박수 상승 등 독성 증상이 나타날 수 있는 농도입니다. 먹은 시간으로부터 2시간 이내라면 흡수되기 전에 구토 유발 처치 등이 권장되므로 동물병원에 긴급 연락 후 방어적 조치를 조율하세요."
  },
  danger: {
    level: "danger",
    title: "즉시 병원 방문 고위험 (CRITICAL)",
    badgeClass: "bg-rose-600 text-white shadow-rose-600/30 animate-pulse",
    cardClass: "bg-rose-950/20 border-rose-500/30",
    textClass: "text-rose-400",
    glowClass: "shadow-[0_0_25px_rgba(225,29,72,0.5)] border-rose-600 animate-pulse",
    actionGuide: "생명이 매우 위태로운 치사 수준의 독성 농도입니다! 즉시 인근 동물병원 응급실로 방문하셔야 합니다. 지체될 경우 근육 경련, 발작, 혼수, 신부전 및 사망에 이를 수 있습니다. (먹다 남은 포장지를 가지고 바로 내원하세요!)"
  }
};

export default function EmergencyCalculator() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- 입력 상태 관리 (피츠의 법칙에 부합하도록 시각적으로 인지하기 쉬운 기본값 세팅) ---
  const [weight, setWeight] = useState<string>("5.0");
  const [selectedThreat, setSelectedThreat] = useState<ThreatType>("milk_chocolate");
  const [amount, setAmount] = useState<string>("10");

  // --- 출력 상태 관리 ---
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  // 연산 최종 수치
  const [toxicityRatio, setToxicityRatio] = useState<number>(0); // 초콜릿인 경우 mg/kg
  const [resultSeverity, setResultSeverity] = useState<SeverityLevel>(SEVERITIES.safe);
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleWeightChange = (val: string) => {
    const regex = /^\d*\.?\d*$/;
    if (regex.test(val)) setWeight(val);
  };

  const handleAmountChange = (val: string) => {
    const regex = /^\d*\.?\d*$/;
    if (regex.test(val)) setAmount(val);
  };

  const triggerCalculation = () => {
    const w = parseFloat(weight);
    const a = parseFloat(amount);

    if (isNaN(w) || w <= 0 || isNaN(a) || a < 0) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    setIsAnalyzing(true);
    setShowResult(false);

    // 0.5초의 마이크로 진동 로딩 애니메이션 후 노출
    setTimeout(() => {
      let severity: SeverityLevel = SEVERITIES.safe;
      let ratio = 0;

      if (selectedThreat === "milk_chocolate" || selectedThreat === "dark_chocolate") {
        // 초콜릿 계산 공식
        const theobromineFactor = selectedThreat === "milk_chocolate" ? 2.0 : 15.0;
        const totalTheobromine = a * theobromineFactor;
        ratio = Math.round((totalTheobromine / w) * 10) / 10; // mg/kg
        setToxicityRatio(ratio);

        if (ratio >= 40) {
          severity = SEVERITIES.danger;
        } else if (ratio >= 20) {
          severity = SEVERITIES.caution;
        } else {
          severity = SEVERITIES.safe;
        }
      } else if (selectedThreat === "grape") {
        // 포도 (건포도 포함) 공식: 섭취량이 존재하면 무조건 고위험
        setToxicityRatio(a);
        if (a > 0) {
          severity = SEVERITIES.danger; // 급성 신부전 위험
        } else {
          severity = SEVERITIES.safe;
        }
      } else if (selectedThreat === "xylitol") {
        // 자일리톨 공식: 1kg당 0.1g 이상 고위험, 그 미만은 주의
        const xylitolPerKg = a / w;
        setToxicityRatio(Math.round(xylitolPerKg * 100) / 100); // g/kg

        if (a > 0) {
          if (xylitolPerKg >= 0.1) {
            severity = SEVERITIES.danger; // 저혈당 발작 및 간 괴사
          } else {
            severity = SEVERITIES.caution; // 저혈당 관찰
          }
        } else {
          severity = SEVERITIES.safe;
        }
      }

      setResultSeverity(severity);
      setIsAnalyzing(false);
      setShowResult(true);
    }, 500);
  };

  const handleReset = () => {
    setWeight("5.0");
    setSelectedThreat("milk_chocolate");
    setAmount("10");
    setShowResult(false);
  };

  if (!isMounted) {
    return (
      <div className="bg-slate-900 min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-magenta mx-auto"></div>
          <p className="text-slate-400 font-bold text-sm">응급 계산기를 실행 중입니다...</p>
        </div>
      </div>
    );
  }

  const activeThreatInfo = THREATS[selectedThreat];

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 relative overflow-hidden flex items-center justify-center">
      
      {/* 긴박감을 주는 응급 비주얼 연출: 후방의 붉은 네온 그라데이션 */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-rose-950/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-magenta/10 blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto space-y-6 relative z-10">
        
        {/* 상단 경고 헤더 */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-mono tracking-widest uppercase animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Veterinary Tool v2.6</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            강아지 초콜릿/위험 성분 응급 계산기
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            강아지가 먹지 말아야 할 대표적인 위험 성분들을 삼켰을 때, 
            몸무게 대비 임상 치사 용량을 대조하여 신속한 처치 레벨을 판별합니다.
          </p>
        </div>

        {/* 메인 폼 카드 (제이콥의 법칙에 기초한 직관적인 대시보드 뼈대) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
          
          {/* STEP 1: 독성 물질 선택 (피츠의 법칙: 누르기 쉬운 거대 카드 선택자) */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300 block">
              1. 섭취한 음식(유독 물질) 선택
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.values(THREATS) as ThreatInfo[]).map((item) => {
                const isSelected = selectedThreat === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedThreat(item.id);
                      setShowResult(false);
                    }}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer h-24 ${
                      isSelected
                        ? "border-rose-600 bg-rose-950/20 text-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.2)] scale-105"
                        : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-2xl mb-1.5">{item.icon}</span>
                    <span className="text-xs font-bold tracking-tight">{item.name}</span>
                  </button>
                );
              })}
            </div>
            
            {/* 선택된 독성 음식 상세 설명 박스 */}
            <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl text-xs text-slate-400 leading-relaxed font-medium">
              💡 <strong className="text-slate-200">{activeThreatInfo.name} DANGER:</strong> {activeThreatInfo.dangerDesc}
            </div>
          </div>

          {/* STEP 2: 무게 및 섭취량 입력 (피츠의 법칙: 오작동을 막기 위한 거대 입력 인풋) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 몸무게 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                <Weight className="w-4 h-4 text-rose-500" />
                강아지 무게 (Weight)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  placeholder="예: 5.0"
                  className="w-full h-16 pl-5 pr-14 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500/40 text-slate-200 font-black text-lg"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                  kg
                </span>
              </div>
            </div>

            {/* 섭취량 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-500" />
                대략적인 섭취량 (Amount)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="예: 15"
                  className="w-full h-16 pl-5 pr-14 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500/40 text-slate-200 font-black text-lg"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                  g
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 leading-normal pl-1.5">
            {activeThreatInfo.unitWeightDesc}
          </div>

          {!isValid && (
            <div className="flex items-center gap-1.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>올바른 강아지 몸무게(kg)와 먹은 섭취량(g) 수치를 입력해 주세요.</span>
            </div>
          )}

          {/* STEP 3: 거대한 실행 버튼 (피츠의 법칙 최우선 요소: 전체 가로폭의 응급 진단 버튼) */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={triggerCalculation}
              disabled={isAnalyzing}
              className="flex-grow h-16 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-[0.99] transition-all text-white font-black text-lg rounded-2xl cursor-pointer shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2.5"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  AI 응급 독성 분석 중...
                </>
              ) : (
                <>
                  <Skull className="w-5 h-5 animate-pulse" />
                  응급 진단 분석하기
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="px-6 h-16 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl cursor-pointer border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </button>
          </div>

          {/* 결과 표출 영역 (진동 및 네온 펄스 애니메이션 적용) */}
          <div
            className={`transition-all duration-500 transform ease-out ${
              showResult
                ? "opacity-100 translate-y-0 scale-100 max-h-[1000px]"
                : "opacity-0 -translate-y-4 scale-95 max-h-0 overflow-hidden pointer-events-none"
            }`}
          >
            <div className="border-t border-white/10 pt-6 space-y-6">
              
              {/* 신호등 결과 알림 보드 */}
              <div className={`border rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden ${resultSeverity.cardClass} ${resultSeverity.glowClass}`}>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      EMERGENCY RESPONSE REPORT
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${resultSeverity.badgeClass}`} />
                      <span className="font-extrabold text-white text-base">
                        독성 평가 레벨:
                      </span>
                    </div>
                  </div>
                  <span className={`inline-block text-xs font-black tracking-wider px-3.5 py-1 rounded-full ${resultSeverity.badgeClass}`}>
                    {resultSeverity.title}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="text-slate-300 space-y-1 font-medium">
                    <p className="text-sm">
                      강아지 몸무게 <strong className="text-white text-base font-bold">{weight}kg</strong> 대비 
                      {activeThreatInfo.name} <strong className="text-white text-base font-bold">{amount}g</strong>을 섭취했을 때
                    </p>
                    
                    {/* 초콜릿인 경우 테오브로민 수치 표시 */}
                    {(selectedThreat === "milk_chocolate" || selectedThreat === "dark_chocolate") && (
                      <p className="text-xs text-slate-400 mt-1">
                        ➔ 몸무게 1kg당 예상 테오브로민 검출량: 
                        <strong className={`text-base font-black ml-1.5 ${resultSeverity.textClass}`}>{toxicityRatio} mg/kg</strong>
                      </p>
                    )}

                    {/* 자일리톨 수치 표시 */}
                    {selectedThreat === "xylitol" && (
                      <p className="text-xs text-slate-400 mt-1">
                        ➔ 몸무게 1kg당 자일리톨 섭취 비율: 
                        <strong className={`text-base font-black ml-1.5 ${resultSeverity.textClass}`}>{toxicityRatio} g/kg</strong>
                      </p>
                    )}
                  </div>

                  {/* 대응 조치 지침 */}
                  <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-rose-500" />
                      상세 보호자 조치 지침
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                      {resultSeverity.actionGuide}
                    </p>
                  </div>
                </div>

              </div>

              {/* YMYL 필수 가이드 배너 영역 */}
              <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <p className="font-bold text-slate-200 text-xs sm:text-sm uppercase tracking-wide">YMYL Medical Warning</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic font-medium">
                  &quot;본 계산기는 수의학적 통계 수치에 기반한 임시 진단 툴이며, 강아지의 체질에 따라 소량으로도 치명적일 수 있습니다. 증상 발현 여부와 관계없이 치명적 물질 음독 시 즉시 동물병원 응급실 방문 및 수의사 전화를 권장합니다.&quot;
                </p>
              </div>



            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
