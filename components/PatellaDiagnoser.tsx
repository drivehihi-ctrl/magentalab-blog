"use client";

import { useState, useMemo } from "react";
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  RotateCcw, 
  ChevronRight, 
  Sparkles, 
  Heart, 
  Check,
  CheckSquare,
  Info
} from "lucide-react";

type DogSize = "small" | "large";

interface Symptom {
  id: string;
  text: string;
}

const SYMPTOMS: Symptom[] = [
  { id: "s1", text: "걸을 때 가끔 다리를 절거나 뒤로 털어내는 행동을 한다" },
  { id: "s2", text: "다리를 만지면 깨갱거리며 예민하게 반응한다" },
  { id: "s3", text: "산책할 때 예전보다 쉽게 지치고 주저앉는다" },
  { id: "s4", text: "뒷모습을 보았을 때 다리 모양이 어색하거나 O자형이다" }
];

export default function PatellaDiagnoser() {
  const [dogSize, setDogSize] = useState<DogSize>("small");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  
  // 사용자가 진단 가이드를 보거나 상호작용하기 시작했는지 여부
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const handleSymptomToggle = (id: string) => {
    setHasInteracted(true);
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  // 나이와 몸무게 파싱
  const parsedAge = useMemo(() => {
    if (!age) return null;
    const val = parseInt(age);
    return isNaN(val) || val < 0 ? null : val;
  }, [age]);

  const parsedWeight = useMemo(() => {
    if (!weight) return null;
    const val = parseFloat(weight);
    return isNaN(val) || val <= 0 ? null : val;
  }, [weight]);

  // 입력이 모두 유효한지 검사
  const isInputValid = parsedAge !== null && parsedWeight !== null;

  // 실시간 다면적 위험도 점수 연산
  const { totalScore, baseScore, ageScore, weightScore } = useMemo(() => {
    if (!isInputValid) {
      return { totalScore: 0, baseScore: 0, ageScore: 0, weightScore: 0 };
    }

    // 1. 기본 점수 (선택된 항목당 10점, 최대 40점)
    const base = selectedSymptoms.length * 10;

    // 2. 나이 가산점 (7세 이상일 경우 퇴행성 노화 가산점 +5점)
    const ageBonus = (parsedAge ?? 0) >= 7 ? 5 : 0;

    // 3. 몸무게 가산점 (소형견 5kg 이상 또는 중대형견 25kg 이상일 경우 무릎 과하중 비만 가산점 +10점)
    let weightBonus = 0;
    if (dogSize === "small" && (parsedWeight ?? 0) >= 5) {
      weightBonus = 10;
    } else if (dogSize === "large" && (parsedWeight ?? 0) >= 25) {
      weightBonus = 10;
    }

    return {
      baseScore: base,
      ageScore: ageBonus,
      weightScore: weightBonus,
      totalScore: base + ageBonus + weightBonus
    };
  }, [isInputValid, selectedSymptoms.length, parsedAge, parsedWeight, dogSize]);

  // 점수별 결과 판정 및 개인화된 상태 설명 문구 세팅
  const diagnosisResult = useMemo(() => {
    if (!isInputValid) return null;

    const ageVal = parsedAge ?? 0;
    const weightVal = parsedWeight ?? 0;
    const dogSizeText = dogSize === "small" ? "소형견" : "중대형견";

    if (totalScore < 10) {
      return {
        level: "green" as const,
        title: "이상 없음 (초록)",
        badgeClass: "bg-emerald-500 text-white shadow-emerald-500/20 border border-emerald-400/20",
        glassClass: "bg-emerald-500/5 border-emerald-500/25 shadow-emerald-500/5",
        textClass: "text-emerald-500",
        barClass: "bg-emerald-500",
        statusDesc: "👍 관절 건강 상태가 양호합니다",
        actionGuide: `현재 ${ageVal}세인 우리 아이는 관절 상태가 매우 건강합니다. ${weightVal}kg의 적정 체중을 잘 유지하고 계시네요. ${dogSizeText} 유전 질환 예방을 위해 무리한 점프만 자제시켜 주세요.`
      };
    } else if (totalScore >= 10 && totalScore <= 24) {
      return {
        level: "yellow" as const,
        title: "초기 관찰 단계 (노랑)",
        badgeClass: "bg-amber-500 text-white shadow-amber-500/20 border border-amber-400/20",
        glassClass: "bg-amber-500/5 border-amber-500/25 shadow-amber-500/5",
        textClass: "text-amber-500",
        barClass: "bg-amber-500",
        statusDesc: "⚠️ 주의 필요! 초기 관찰 및 관리 시작 단계",
        actionGuide: `주의가 필요한 초기 단계입니다. 현재 ${ageVal}세로 관절 노화가 진행 중이거나, ${weightVal}kg의 하중이 슬개골을 압박하고 있을 가능성이 큽니다. 높은 곳에서 뛰어내리는 행동을 즉시 금지하고 관절 집중 영양 공급을 시작해야 하는 골든타임입니다.`
      };
    } else {
      return {
        level: "red" as const,
        title: "수의사 진료 필요 고위험 (빨강)",
        badgeClass: "bg-rose-500 text-white shadow-rose-500/20 border border-rose-400/20 animate-pulse",
        glassClass: "bg-rose-500/5 border-rose-500/25 shadow-rose-500/5",
        textClass: "text-rose-500",
        barClass: "bg-rose-500",
        statusDesc: "🚨 즉각적인 조치가 필요한 고위험 상태",
        actionGuide: `🚨 즉각적인 조치가 필요한 고위험 상태입니다! ${ageVal}세의 나이와 ${weightVal}kg의 몸무게는 현재 무릎 연골에 심각한 무리를 주고 있으며, 선택하신 증상들로 보아 슬개골 탈구 3기 이상 혹은 십자인대 손상이 진행 중일 확률이 매우 높습니다. 아이가 통증을 숨기고 있을 수 있으니 지체하지 말고 동물병원에서 엑스레이 검사를 받으세요.`
      };
    }
  }, [isInputValid, totalScore, parsedAge, parsedWeight, dogSize]);

  // 다시 진단하기
  const handleReset = () => {
    setDogSize("small");
    setAge("");
    setWeight("");
    setSelectedSymptoms([]);
    setHasInteracted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 결과 영역으로 부드럽게 스크롤
  const scrollToResult = () => {
    setHasInteracted(true);
    const resultElement = document.getElementById("diagnosis-result-card");
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f9] py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* 2026 트렌디 배경 오라 구체 (유려한 글래스모피즘 효과 극대화) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-magenta/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-magenta-light/40 blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* 헤더 섹션 */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-magenta-light text-magenta text-xs font-black uppercase tracking-wider shadow-sm border border-magenta/10">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            안심이 AI 정밀 자가진단 시리즈
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            슬개골 탈구 & 관절 건강 자가 진단기 🐾
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-bold leading-relaxed">
            아이의 나이, 체중, 견종 유형과 행동 증상을 유기적으로 반영하여<br className="hidden sm:inline" />
            관절 위험 점수와 정밀 분석 리포트를 실시간으로 확인하고 맞춤 가이드를 받아보세요.
          </p>
        </div>

        {/* 2컬럼 레이아웃 대시보드 (제이콥의 법칙에 기초한 폼 + 실시간 리포트) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 좌측: 입력 카드군 (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. 견종 크기 선택 카드 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 space-y-4">
              <label className="text-base font-black text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-magenta-light text-magenta text-xs font-black">1</span>
                견종 유형을 선택해 주세요
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setDogSize("small"); setHasInteracted(true); }}
                  className={`py-4 px-6 rounded-2xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    dogSize === "small"
                      ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                      : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                  }`}
                  style={{ minHeight: "90px" }}
                >
                  <span className="text-3xl">🐶</span>
                  <span className="text-sm sm:text-base">소형견</span>
                  <span className="text-[10px] text-gray-400 font-medium">10kg 미만 (말티즈, 토이푸들 등)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setDogSize("large"); setHasInteracted(true); }}
                  className={`py-4 px-6 rounded-2xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    dogSize === "large"
                      ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                      : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                  }`}
                  style={{ minHeight: "90px" }}
                >
                  <span className="text-3xl">🐕</span>
                  <span className="text-sm sm:text-base">중대형견</span>
                  <span className="text-[10px] text-gray-400 font-medium">10kg 이상 (리트리버, 진돗개 등)</span>
                </button>
              </div>
            </div>

            {/* 2. 나이 및 몸무게 입력 카드 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 space-y-5">
              <label className="text-base font-black text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-magenta-light text-magenta text-xs font-black">2</span>
                나이와 몸무게를 입력해 주세요
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">아이의 나이</span>
                    {parsedAge !== null && parsedAge >= 7 && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded font-black">
                        관절 노화 가산점 +5점 대상
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => { setAge(e.target.value); setHasInteracted(true); }}
                      placeholder="예: 3"
                      min="0"
                      max="30"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-magenta focus:ring-1 focus:ring-magenta focus:outline-none transition-all font-bold text-gray-800 text-base"
                      style={{ minHeight: "56px" }}
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">살</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">아이의 몸무게</span>
                    {parsedWeight !== null && (
                      ((dogSize === "small" && parsedWeight >= 5) || (dogSize === "large" && parsedWeight >= 25)) ? (
                        <span className="text-[10px] bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded font-black">
                          무릎 과하중 가산점 +10점 대상
                        </span>
                      ) : null
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => { setWeight(e.target.value); setHasInteracted(true); }}
                      placeholder="예: 4.5"
                      step="0.1"
                      min="0.1"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-magenta focus:ring-1 focus:ring-magenta focus:outline-none transition-all font-bold text-gray-800 text-base"
                      style={{ minHeight: "56px" }}
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 증상 체크리스트 카드 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 space-y-4">
              <label className="text-base font-black text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-magenta-light text-magenta text-xs font-black">3</span>
                최근 관찰된 행동 증상을 선택해 주세요 (중복 가능)
              </label>
              
              <div className="space-y-3">
                {SYMPTOMS.map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom.id);
                  return (
                    <button
                      key={symptom.id}
                      type="button"
                      onClick={() => handleSymptomToggle(symptom.id)}
                      className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-300 flex items-start gap-4 active:scale-[0.99] cursor-pointer ${
                        isSelected
                          ? "border-magenta/50 bg-magenta-light/20 text-gray-900 font-bold shadow-sm"
                          : "border-gray-100 hover:border-gray-200 text-gray-600 font-semibold bg-white"
                      }`}
                      style={{ minHeight: "64px" }}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                        isSelected 
                          ? "border-magenta bg-magenta text-white" 
                          : "border-gray-300 bg-white"
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm sm:text-[15px] leading-relaxed">{symptom.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 모바일 화면에서 아래 결과 카드로 스무스하게 연결해 주는 플로팅 가이드 버튼 */}
            {!isInputValid && (
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-amber-700 text-xs sm:text-sm font-bold flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                아이의 나이와 몸무게를 정확히 입력하시면 실시간 결과 리포트가 완성됩니다.
              </div>
            )}

            {isInputValid && (
              <button
                type="button"
                onClick={scrollToResult}
                className="lg:hidden w-full py-4.5 bg-magenta text-white font-black text-base rounded-2xl transition-all shadow-lg shadow-magenta/20 hover:bg-magenta/95 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                style={{ minHeight: "56px" }}
              >
                실시간 분석 리포트 보러가기
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </button>
            )}
          </div>

          {/* 우측: 실시간 글래스모피즘 결과 카드 및 BOFU (lg:col-span-5) */}
          <div id="diagnosis-result-card" className="lg:col-span-5 space-y-6 lg:sticky lg:top-8 scroll-mt-6">
            
            {/* 실시간 2026 글래스모피즘 결과 리포트 */}
            <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border backdrop-blur-xl transition-all duration-500 ${
              isInputValid 
                ? (diagnosisResult?.glassClass + " shadow-xl shadow-slate-100 bg-white/70")
                : "bg-white/40 border-dashed border-gray-300 shadow-none"
            }`}>
              
              {/* 카드 내부 우아한 그라데이션 광채 장식 */}
              {isInputValid && (
                <div className={`absolute -right-20 -top-20 w-44 h-44 rounded-full opacity-20 blur-3xl pointer-events-none transition-colors duration-500 ${
                  diagnosisResult?.level === "green" ? "bg-emerald-400" :
                  diagnosisResult?.level === "yellow" ? "bg-amber-400" : "bg-rose-400"
                }`} />
              )}

              {!isInputValid ? (
                // 입력 대기 시 플레이스홀더 UI
                <div className="py-16 px-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-3xl animate-bounce">
                    📊
                  </div>
                  <h3 className="text-lg font-black text-gray-800">
                    실시간 정밀 진단서 대기 중
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 font-bold leading-relaxed max-w-xs mx-auto">
                    왼쪽 입력창에 견종 크기, 나이, 몸무게를 정확히 입력하시면 실시간 관절 분석 보고서가 자동으로 로드됩니다.
                  </p>
                </div>
              ) : (
                // 실시간 리포트 활성화 UI
                <div className="space-y-6">
                  
                  {/* 상단 타이틀 & 위험도 배지 */}
                  <div className="flex items-center justify-between gap-4 border-b border-gray-100/50 pb-5">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        REAL-TIME DIAGNOSIS REPORT
                      </p>
                      <h2 className="text-xl font-black text-gray-900 mt-1">
                        관절 위험도 분석
                      </h2>
                    </div>
                    <span className={`inline-flex px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm transition-all duration-500 ${diagnosisResult?.badgeClass}`}>
                      {diagnosisResult?.title}
                    </span>
                  </div>

                  {/* 2026 트렌디 스코어 게이지 & 수치 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-gray-400">종합 관절 위험 지수</span>
                      <span className="text-2xl font-black text-gray-950 flex items-baseline gap-0.5">
                        <span className={`text-3xl transition-colors duration-500 ${diagnosisResult?.textClass}`}>
                          {totalScore}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">/ 55점</span>
                      </span>
                    </div>
                    
                    {/* 게이지바 */}
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ease-out ${diagnosisResult?.barClass}`}
                        style={{ width: `${(totalScore / 55) * 100}%` }}
                      />
                    </div>

                    {/* 위험 점수 분할표 */}
                    <div className="grid grid-cols-3 gap-1 pt-1 text-[9px] font-bold text-gray-400">
                      <div className="text-left border-l border-gray-200 pl-1">안전 (10점 미만)</div>
                      <div className="text-left border-l border-gray-200 pl-1">주의 (10~24점)</div>
                      <div className="text-left border-l border-gray-200 pl-1">위험 (25점 이상)</div>
                    </div>
                  </div>

                  {/* 점수 산출 브레이크다운 상세 (실시간 유기적 분석 디테일) */}
                  <div className="bg-white/60 rounded-2xl p-4 border border-white/60 space-y-2.5 text-xs font-bold text-gray-600">
                    <p className="text-[10px] font-black text-gray-400 tracking-wider">점수 획득 상세 내역</p>
                    <div className="flex justify-between">
                      <span>1. 증상 체크리스트 ({selectedSymptoms.length}개 선택)</span>
                      <span className="text-gray-900">+{baseScore}점</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2. 나이 가산점 ({parsedAge}살 기준)</span>
                      <span className="text-gray-900">+{ageScore}점</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3. 몸무게 가산점 ({dogSize === "small" ? "소형견" : "중대형견"} / {parsedWeight}kg 기준)</span>
                      <span className="text-gray-900">+{weightScore}점</span>
                    </div>
                  </div>

                  {/* 상태 요약 및 개인화 가이드 문구 */}
                  <div className="space-y-3">
                    <h3 className={`text-base font-black flex items-center gap-1.5 transition-colors duration-500 ${diagnosisResult?.textClass}`}>
                      {diagnosisResult?.statusDesc}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed font-semibold whitespace-pre-line bg-white/60 p-4 rounded-2xl border border-white/40 transition-all duration-300">
                      {diagnosisResult?.actionGuide}
                    </p>
                  </div>

                  {/* BOFU 전환 퍼널 배너 (옐로우/레드 단계에서 더 도드라지는 비주얼) */}
                  {(diagnosisResult?.level === "yellow" || diagnosisResult?.level === "red") && (
                    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-magenta via-[#c2006b] to-[#8f004f] text-white p-5.5 sm:p-6.5 shadow-lg shadow-magenta/10 border border-white/10 group transition-all duration-500 ${
                      diagnosisResult?.level === "red" ? "ring-2 ring-rose-500 ring-offset-2 ring-offset-rose-50" : ""
                    }`}>
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                      <div className="absolute bottom-0 left-1/2 w-36 h-36 bg-[#E5007E]/20 rounded-full blur-xl translate-y-1/3 pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col gap-3.5">
                        <div className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/95 text-[10px] font-black uppercase tracking-wider">
                          <Heart className="w-3 h-3 text-pink-300 fill-pink-300 animate-pulse" />
                          관절 손상 정지 스페셜 솔루션
                        </div>
                        
                        <div className="space-y-1.5">
                          <h4 className="text-[15px] sm:text-base font-extrabold tracking-tight leading-snug">
                            슬개골 탈구 예방과 진행 지연의 핵심은<br />
                            <span className="text-yellow-300">‘체중 감량’</span>과 <span className="text-yellow-300">‘연골 영양 공급’</span>입니다.
                          </h4>
                          <p className="text-[11px] sm:text-xs text-white/85 leading-relaxed font-semibold">
                            우리 아이 슬개골 보호에 맞춤화된 초경량 매트와 연골 속부터 꽉 채워주는 관절 영양제로 다리 아픔을 예방해 주세요.
                          </p>
                        </div>

                        <a 
                          href="https://petfair.yeogida-dog.com/offline/landing?pc_seq=1727"
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 mt-1 px-5 py-3.5 bg-yellow-300 hover:bg-white text-[#6B0836] font-black text-xs sm:text-sm rounded-xl w-full transition-all group-hover:scale-[1.01] shadow-md shadow-black/10 active:scale-[0.99] cursor-pointer"
                        >
                          슬개골 매트 & 관절 기능성 영양제 보러가기 ➔
                        </a>
                      </div>
                    </div>
                  )}

                  {/* 다시 진단하기 버튼 */}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-4.5 bg-white hover:bg-slate-50 border border-slate-200 text-gray-500 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-sm"
                    style={{ minHeight: "56px" }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    다시 진단하기
                  </button>
                  
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
