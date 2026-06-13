"use client";

import { useState, useEffect } from "react";
import { 
  Calculator, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Info,
  DollarSign,
  PiggyBank,
  Coffee,
  Heart,
  TrendingUp
} from "lucide-react";

type PetType = "dog_small" | "dog_medium" | "dog_large" | "cat";
type FoodGrade = "normal" | "premium" | "medical";
type CareType = "shop" | "home";

// 월간 고정 지출 디폴트 셋팅
const DEFAULT_VALUES = {
  dog_small: {
    food: { normal: 40000, premium: 70000, medical: 110000 },
    hygiene: 15000,
    care: { shop: 50000, home: 10000 },
    medical: 50000,
    initCost: 500000
  },
  dog_medium: {
    food: { normal: 60000, premium: 100000, medical: 150000 },
    hygiene: 25000,
    care: { shop: 70000, home: 10000 },
    medical: 60000,
    initCost: 500000
  },
  dog_large: {
    food: { normal: 90000, premium: 160000, medical: 240000 },
    hygiene: 35000,
    care: { shop: 100000, home: 10000 },
    medical: 70000,
    initCost: 1000000
  },
  cat: {
    food: { normal: 40000, premium: 70000, medical: 110000 },
    hygiene: 30000, // 모래 비용 등
    care: { shop: 60000, home: 10000 },
    medical: 50000,
    initCost: 500000
  }
};

export default function PetcareExpensesCalculator() {
  // 폼 입력 단계 상태 (밀러의 법칙: 1~3단계 순차 폼)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showResult, setShowResult] = useState<boolean>(false);

  // 입력 필드 상태
  const [petType, setPetType] = useState<PetType>("dog_small");
  const [age, setAge] = useState<string>("");
  const [lifespan, setLifespan] = useState<string>("15");

  // 월간 지출 상태 (실제 원화 가격)
  const [foodGrade, setFoodGrade] = useState<FoodGrade>("normal");
  const [foodCost, setFoodCost] = useState<number>(40000);

  const [hygieneCost, setHygieneCost] = useState<number>(15000);

  const [careType, setCareType] = useState<CareType>("shop");
  const [careCost, setCareCost] = useState<number>(50000);

  const [medicalCost, setMedicalCost] = useState<number>(50000);

  // 축종/크기 변경 시 기본값 동기화
  useEffect(() => {
    const defaults = DEFAULT_VALUES[petType];
    setFoodCost(defaults.food[foodGrade]);
    setHygieneCost(defaults.hygiene);
    setCareCost(defaults.care[careType]);
    setMedicalCost(defaults.medical);
  }, [petType]);

  // 식비 등급 변경 시 식비 기본값 동기화
  const handleFoodGradeChange = (grade: FoodGrade) => {
    setFoodGrade(grade);
    setFoodCost(DEFAULT_VALUES[petType].food[grade]);
  };

  // 케어 유형 변경 시 미용비 기본값 동기화
  const handleCareTypeChange = (type: CareType) => {
    setCareType(type);
    setCareCost(DEFAULT_VALUES[petType].care[type]);
  };

  const handleNextStep = () => {
    if (step < 3) setStep((step + 1) as any);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((step - 1) as any);
  };

  // 계산하기 핸들러
  const handleCalculate = () => {
    setShowResult(true);
  };

  // 초기화 핸들러
  const handleReset = () => {
    setStep(1);
    setPetType("dog_small");
    setAge("");
    setLifespan("15");
    setFoodGrade("normal");
    setFoodCost(40000);
    setHygieneCost(15000);
    setCareType("shop");
    setCareCost(50000);
    setMedicalCost(50000);
    setShowResult(false);
  };

  // 계산 연산 로직
  const monthlyTotal = foodCost + hygieneCost + careCost + medicalCost;
  
  const currentAge = Math.max(0, parseInt(age) || 0);
  const targetLifespan = Math.max(currentAge + 1, parseInt(lifespan) || 15);
  const remainingYears = Math.max(1, targetLifespan - currentAge);

  const initialCost = DEFAULT_VALUES[petType].initCost;
  const lifetimeTotal = (monthlyTotal * 12 * remainingYears) + initialCost;

  // SVG 도넛 차트를 위한 수치 계산
  const totalExpenses = monthlyTotal || 1; // 0 분모 방어
  const foodPercent = Math.round((foodCost / totalExpenses) * 100);
  const hygienePercent = Math.round((hygieneCost / totalExpenses) * 100);
  const carePercent = Math.round((careCost / totalExpenses) * 100);
  const medicalPercent = Math.round((medicalCost / totalExpenses) * 100);

  // SVG 원주 계산 (반지름 r=50)
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // 314.159

  // 각 항목의 도넛 대시 오프셋 누적 계산
  const foodStroke = (foodCost / totalExpenses) * circumference;
  const hygieneStroke = (hygieneCost / totalExpenses) * circumference;
  const careStroke = (careCost / totalExpenses) * circumference;
  const medicalStroke = (medicalCost / totalExpenses) * circumference;

  const foodOffset = 0;
  const hygieneOffset = circumference - foodStroke;
  const careOffset = circumference - foodStroke - hygieneStroke;
  const medicalOffset = circumference - foodStroke - hygieneStroke - careStroke;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-magenta-light text-magenta text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            안심 연구원 리포트
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            반려동물 평생 양육비 & 유지비 계산기 💰
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium max-w-md mx-auto">
            밀러의 법칙에 의거한 3단계 그룹 지출 정보 입력을 통해 한 달 유지비와 평생 지출 부담 및 비중 차트를 진단해보세요.
          </p>
        </div>

        {/* main Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100 border border-gray-100/80 space-y-8">
          
          {/* 단계 표시 인디케이터 */}
          {!showResult && (
            <div className="flex items-center justify-between border-b border-gray-50 pb-5">
              <span className="text-xs font-black text-magenta uppercase tracking-widest bg-magenta-light/40 px-3 py-1 rounded-full">
                Step {step} / 3
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((s) => (
                  <div 
                    key={s} 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      step === s ? "w-6 bg-magenta" : "w-2 bg-gray-200"
                    }`} 
                  />
                ))}
              </div>
            </div>
          )}

          {!showResult ? (
            <div className="space-y-8">
              
              {/* Step 1: 기본 정보 입력 */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* 축종/크기 선택 */}
                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-800">
                      1. 반려동물 축종 및 크기 선택
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(
                        [
                          { id: "dog_small", label: "소형견", icon: "🐶", desc: "10kg 미만" },
                          { id: "dog_medium", label: "중형견", icon: "🐕", desc: "10~25kg" },
                          { id: "dog_large", label: "대형견", icon: "🐩", desc: "25kg 초과" },
                          { id: "cat", label: "고양이", icon: "🐱", desc: "반려묘 전체" }
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPetType(item.id)}
                          className={`p-3.5 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                            petType === item.id
                              ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                              : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                          }`}
                          style={{ minHeight: "90px" }}
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-[13px]">{item.label}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 나이 및 수명 설정 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-gray-800">
                        2. 현재 나이 (세)
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="예: 2"
                        min="0"
                        max="30"
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-magenta focus:outline-none transition-colors font-bold text-gray-800 text-base"
                        style={{ minHeight: "56px" }}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-gray-800">
                        3. 예상 수명 목표 (세)
                      </label>
                      <input
                        type="number"
                        value={lifespan}
                        onChange={(e) => setLifespan(e.target.value)}
                        placeholder="기본값 15세"
                        min="1"
                        max="35"
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-magenta focus:outline-none transition-colors font-bold text-gray-800 text-base"
                        style={{ minHeight: "56px" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: 식사 & 위생 지출 */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* 식사 사료/간식 등급 */}
                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-800">
                      4. 사료 및 간식 등급 선택
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(
                        [
                          { id: "normal", label: "일반형", desc: "마트/일반 사료" },
                          { id: "premium", label: "프리미엄", desc: "유기농/홀리스틱" },
                          { id: "medical", label: "처방식/생식", desc: "특수 질환용/동결건조" }
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleFoodGradeChange(item.id)}
                          className={`p-3 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            foodGrade === item.id
                              ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                              : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                          }`}
                          style={{ minHeight: "76px" }}
                        >
                          <span className="text-sm font-black">{item.label}</span>
                          <span className="text-[10px] text-gray-400 font-normal leading-tight">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 식사비 슬라이더 조절 */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-black">
                      <span className="text-gray-800">식사비용 조율 (월)</span>
                      <span className="text-magenta">{foodCost.toLocaleString()} 원</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="600000"
                      step="5000"
                      value={foodCost}
                      onChange={(e) => setFoodCost(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-magenta"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                      <span>1만 원</span>
                      <span>30만 원</span>
                      <span>60만 원</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100/60 my-2" />

                  {/* 위생용품비 슬라이더 조절 */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-black">
                      <span className="text-gray-800">위생 용품 (배변패드, 모래 등 / 월)</span>
                      <span className="text-magenta">{hygieneCost.toLocaleString()} 원</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="150000"
                      step="5000"
                      value={hygieneCost}
                      onChange={(e) => setHygieneCost(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-magenta"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                      <span>5천 원</span>
                      <span>7.5만 원</span>
                      <span>15만 원</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: 미용 & 의료비 지출 */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* 미용 & 위생 케어 */}
                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-800">
                      5. 미용 및 위생 케어 방식
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          { id: "shop", label: "전문 미용숍 이용", desc: "월 1회 전문점 케어" },
                          { id: "home", label: "홈케어 위주", desc: "목욕/발톱 셀프 케어" }
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleCareTypeChange(item.id)}
                          className={`p-3.5 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            careType === item.id
                              ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                              : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                          }`}
                          style={{ minHeight: "76px" }}
                        >
                          <span className="text-sm font-black">{item.label}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 미용 지출 슬라이더 조절 */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-black">
                      <span className="text-gray-800">미용/위생 관리비 조율 (월)</span>
                      <span className="text-magenta">{careCost.toLocaleString()} 원</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="300000"
                      step="5000"
                      value={careCost}
                      onChange={(e) => setCareCost(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-magenta"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                      <span>0 원</span>
                      <span>15만 원</span>
                      <span>30만 원</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100/60 my-2" />

                  {/* 의료비 & 보험료 슬라이더 조절 */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-black">
                      <span className="text-gray-800">예방 의료비 / 보험 저축액 (월)</span>
                      <span className="text-magenta">{medicalCost.toLocaleString()} 원</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="300000"
                      step="5000"
                      value={medicalCost}
                      onChange={(e) => setMedicalCost(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-magenta"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                      <span>5천 원</span>
                      <span>15만 원</span>
                      <span>30만 원</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 폼 전송/이동 컨트롤 */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 py-4 bg-slate-100 text-gray-600 font-black rounded-2xl hover:bg-slate-150 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    style={{ minHeight: "56px" }}
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[3]" />
                    이전으로
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 py-4 bg-magenta text-white font-black rounded-2xl shadow-lg shadow-magenta/15 hover:bg-magenta/95 hover:shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    style={{ minHeight: "56px" }}
                  >
                    다음 단계
                    <ChevronRight className="w-5 h-5 stroke-[3]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCalculate}
                    className="flex-1 py-4 bg-magenta text-white font-black rounded-2xl shadow-lg shadow-magenta/15 hover:bg-magenta/95 hover:shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    style={{ minHeight: "56px" }}
                  >
                    <Calculator className="w-5 h-5" />
                    지출 계산하기
                  </button>
                )}
              </div>
            </div>
          ) : (
            // 결과창 화면 (글래스모피즘 + SVG 파이도넛차트 + 게이지바)
            <div className="space-y-8 animate-fadeIn">
              
              {/* 2026년형 글래스모피즘 종합 결과 카드 */}
              <div className="bg-magenta-light/20 backdrop-blur-xl border border-magenta/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-magenta/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                
                <div className="relative z-10 space-y-5">
                  <div className="border-b border-magenta/5 pb-4">
                    <p className="text-xs font-black text-magenta uppercase tracking-widest">
                      반려동물 생애 지출 시뮬레이션
                    </p>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                      종합 지출 분석 결과 리포트
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 월간 유지비 */}
                    <div className="bg-white/60 p-4.5 rounded-2xl border border-white/80 space-y-1 shadow-sm">
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Coffee className="w-3.5 h-3.5 text-magenta" />
                        월간 고정 유지비
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-magenta">
                        {monthlyTotal.toLocaleString()}원
                      </p>
                    </div>

                    {/* 평생 누적 양육비 */}
                    <div className="bg-white/60 p-4.5 rounded-2xl border border-white/80 space-y-1 shadow-sm">
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <PiggyBank className="w-3.5 h-3.5 text-indigo-500" />
                        평생 누적 예상 양육비
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-indigo-600">
                        {lifetimeTotal.toLocaleString()}원
                      </p>
                    </div>
                  </div>

                  {/* 보조 안내 텍스트 */}
                  <div className="bg-white/40 p-4 rounded-xl border border-white/50 text-xs text-gray-500 leading-relaxed font-semibold">
                    <Info className="w-3.5 h-3.5 text-gray-400 inline-block mr-1 -mt-0.5" />
                    본 진단은 현재 나이 {currentAge}세에서부터 목표 예상 수명 {targetLifespan}세까지 총 {remainingYears}년 동안의 누적 유지비를 기초로 계산되었습니다. 대형견의 경우 평균 초기 입양 및 케어 용품 비용(100만 원), 소형견/중형견/고양이는 초기 용품비(50만 원)가 기본 가산되어 합산되었습니다.
                  </div>
                </div>
              </div>

              {/* 시각화 섹션: SVG 도넛 차트 & 바 게이지 */}
              <div className="border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-6">
                <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-1.5">
                  <TrendingUp className="w-5 h-5 text-magenta" />
                  항목별 지출 비율 및 세부 지표
                </h3>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  
                  {/* 좌측: SVG 도넛 차트 */}
                  <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      {/* 식사비 (마젠타) */}
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#E5007E"
                        strokeWidth="12"
                        strokeDasharray={`${foodStroke} ${circumference - foodStroke}`}
                        strokeDashoffset={foodOffset}
                        className="transition-all duration-500"
                      />
                      {/* 위생 용품비 (스카이블루) */}
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#0ea5e9"
                        strokeWidth="12"
                        strokeDasharray={`${hygieneStroke} ${circumference - hygieneStroke}`}
                        strokeDashoffset={hygieneOffset}
                        className="transition-all duration-500"
                      />
                      {/* 미용 케어비 (인디고) */}
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#6366f1"
                        strokeWidth="12"
                        strokeDasharray={`${careStroke} ${circumference - careStroke}`}
                        strokeDashoffset={careOffset}
                        className="transition-all duration-500"
                      />
                      {/* 예방 의료비 (오렌지) */}
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#f97316"
                        strokeWidth="12"
                        strokeDasharray={`${medicalStroke} ${circumference - medicalStroke}`}
                        strokeDashoffset={medicalOffset}
                        className="transition-all duration-500"
                      />
                    </svg>

                    {/* 도넛 중앙의 총 월간 유지비 안내 */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">월 고정</span>
                      <span className="text-sm font-black text-gray-800">
                        {monthlyTotal >= 10000 ? `${(monthlyTotal/10000).toFixed(1)}만` : `${monthlyTotal.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  {/* 우측: 범례 및 지출 게이지 바 */}
                  <div className="flex-1 w-full space-y-4">
                    {/* 식사비 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-3 h-3 rounded-full bg-magenta flex-shrink-0" />
                          식비 및 간식
                        </span>
                        <span className="text-gray-900">{foodCost.toLocaleString()}원 ({foodPercent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                        <div 
                          className="h-full bg-magenta rounded-full transition-all duration-500" 
                          style={{ width: `${foodPercent}%` }} 
                        />
                      </div>
                    </div>

                    {/* 위생 용품 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-3 h-3 rounded-full bg-sky-500 flex-shrink-0" />
                          위생 용품
                        </span>
                        <span className="text-gray-900">{hygieneCost.toLocaleString()}원 ({hygienePercent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                        <div 
                          className="h-full bg-sky-500 rounded-full transition-all duration-500" 
                          style={{ width: `${hygienePercent}%` }} 
                        />
                      </div>
                    </div>

                    {/* 미용 & 위생 케어 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0" />
                          미용 &amp; 위생케어
                        </span>
                        <span className="text-gray-900">{careCost.toLocaleString()}원 ({carePercent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                          style={{ width: `${carePercent}%` }} 
                        />
                      </div>
                    </div>

                    {/* 의료비 & 보험 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
                          의료비 &amp; 보험
                        </span>
                        <span className="text-gray-900">{medicalCost.toLocaleString()}원 ({medicalPercent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                        <div 
                          className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                          style={{ width: `${medicalPercent}%` }} 
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* 다시 계산하기 버튼 */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-4.5 bg-white hover:bg-slate-50 border-2 border-slate-100 text-gray-500 font-bold text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                style={{ minHeight: "56px" }}
              >
                <RotateCcw className="w-4 h-4" />
                다시 계산하기
              </button>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
