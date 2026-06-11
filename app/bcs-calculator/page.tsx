"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Info, 
  AlertTriangle, 
  Heart, 
  Sparkles, 
  RotateCcw, 
  Weight, 
  CheckCircle2,
  TrendingDown
} from "lucide-react";

// 강아지 상태 계수 매핑
const DOG_STATUS_FACTORS: Record<string, { label: string; factor: number; desc: string }> = {
  dog_neutered: { label: "중성화 완료 (성견)", factor: 1.6, desc: "기본적인 에너지 요구량을 가진 건강한 성견" },
  dog_intact: { label: "미중성화 (성견)", factor: 1.8, desc: "중성화를 하지 않아 활동 대사량이 비교적 높은 성견" },
  dog_obese_prone: { label: "비만 경향 / 중성화 후 관리", factor: 1.4, desc: "살이 찌기 쉬운 체질이거나 중성화 수술 후 초기 관리 단계" },
  dog_active: { label: "활동량 많음 / 일하는 개", factor: 2.0, desc: "하루 1시간 이상 활발하게 산책하거나 훈련받는 활동견" },
  dog_senior: { label: "노령기 / 비활동적", factor: 1.4, desc: "나이가 많아 대사율이 감소했거나 활동량이 적은 아이" },
  dog_diet: { label: "집중 다이어트 필요", factor: 1.0, desc: "체중 감량을 위해 칼로리 제한이 시급한 과체중/비만 단계" },
};

// 고양이 상태 계수 매핑
const CAT_STATUS_FACTORS: Record<string, { label: string; factor: number; desc: string }> = {
  cat_neutered: { label: "중성화 완료 (성묘)", factor: 1.2, desc: "실내에서 생활하는 평범한 대사량 of 성묘" },
  cat_intact: { label: "미중성화 (성묘)", factor: 1.4, desc: "중성화를 하지 않아 메이팅 에너지 등이 작동하는 성묘" },
  cat_obese_prone: { label: "비만 경향 / 중성화 후 관리", factor: 1.0, desc: "움직임이 적고 식탐이 많아 쉽게 살찌는 고양이" },
  cat_active: { label: "활동량 많음 / 활발한 아이", factor: 1.6, desc: "우다다를 자주 하거나 활동 반경이 넓은 아깽이 혹은 활발한 묘" },
  cat_senior: { label: "노령기 / 비활동적", factor: 1.1, desc: "나이가 들어 잠이 많아지고 활동량이 극히 감소한 묘" },
  cat_diet: { label: "집중 다이어트 필요", factor: 0.8, desc: "체중 감량을 위해 엄격한 식단 제한이 필요한 과체중/비만 단계" },
};

interface BCSInfo {
  score: number;
  title: string;
  level: "low" | "ideal" | "warn" | "danger";
  levelText: string;
  description: string;
  solution: string;
}

const BCS_DATA: Record<number, BCSInfo> = {
  1: {
    score: 1,
    title: "극심한 저체중 (Severe Emaciation)",
    level: "danger",
    levelText: "매우 위험 (저체중)",
    description: "갈비뼈, 골반뼈 등이 멀리서도 뚜렷하게 보이며 몸 전체에 체지방이 전혀 느껴지지 않는 매우 야윈 상태입니다.",
    solution: "질병이 원인일 수 있으므로 먼저 수의사의 정밀 진단을 권장합니다. 소화가 잘 되는 단백질과 에너지 함량이 높은 특수 영양 사료를 소량씩 자주 급여하여 소실된 근육량과 지방을 점진적으로 복구해야 합니다."
  },
  2: {
    score: 2,
    title: "심한 저체중 (Very Thin)",
    level: "warn",
    levelText: "경계 (저체중)",
    description: "갈비뼈가 뼈 모양 그대로 쉽게 만져지고 보이며, 옆에서 볼 때 허리 라인이 깊숙이 들어가 겉보기에도 매우 말라 보입니다.",
    solution: "현재 권장 칼로리보다 10~15% 정도 식사량을 늘려주세요. 위장에 무리가 가지 않는 고영양 포뮬러의 사료나 습식 캔 사료를 활용하여 체중을 서서히 올리는 대사 관리가 필요합니다."
  },
  3: {
    score: 3,
    title: "저체중 (Thin)",
    level: "warn",
    levelText: "주의 (저체중)",
    description: "갈비뼈가 쉽게 만져지며, 위에서 보았을 때 허리 굴곡이 뚜렷하게 좁아져 보입니다. 지방이 부족한 상태입니다.",
    solution: "일일 에너지 급여량이 권장 수준보다 부족할 수 있습니다. 간식을 건강한 육류 위주로 추가해 주거나, 평소 먹는 사료의 양을 하루에 5~10% 정도씩 증량하여 최적 체형으로 올려주세요."
  },
  4: {
    score: 4,
    title: "약간 마름 (Underweight)",
    level: "ideal",
    levelText: "정상 범위",
    description: "갈비뼈가 얇은 지방층에 덮여 부드럽게 만져지며, 위에서 볼 때 자연스러운 허리 라인이 뚜렷하게 나타납니다.",
    solution: "이상적인 체형에 거의 도달했습니다. 무리하게 식사량을 늘리기보다는 양질의 단백질 급여와 근육량을 키우는 규칙적인 놀이/산책을 통해 건강 상태를 확립해 주세요."
  },
  5: {
    score: 5,
    title: "이상적인 체중 (Ideal)",
    level: "ideal",
    levelText: "이상적 (정상)",
    description: "갈비뼈가 적절한 지방층 아래로 쉽게 만져집니다. 위에서 볼 때 골반 앞쪽 허리가 아름답게 잘록하고 복부 팽팽함이 적절합니다.",
    solution: "훌륭합니다! 완벽한 비율과 최상의 신체 상태를 유지하고 계십니다. 현재의 건강한 식습관, 급여량(사료 및 간식의 밸런스), 그리고 규칙적인 활동량을 꾸준히 유지할 수 있도록 모니터링만 계속해 주세요."
  },
  6: {
    score: 6,
    title: "과체중 초입 (Overweight)",
    level: "warn",
    levelText: "주의 (과체중)",
    description: "갈비뼈 위에 약간 더 두꺼운 지방층이 덮여 손끝에 힘을 주어 눌러야 느껴집니다. 위에서 볼 때 허리선이 다소 평평하고 뭉툭해 보입니다.",
    solution: "이상적인 기준 대비 약 5~10% 체중이 초과된 상태입니다. 과도한 무설탕/탄수화물 간식을 전면 중단하고, 하루 산책 및 장난감 놀이 시간을 약 10분씩 늘려 체지방률 상승을 초기에 차단해야 합니다."
  },
  7: {
    score: 7,
    title: "과체중 (Heavy)",
    level: "warn",
    levelText: "경계 (과체중)",
    description: "갈비뼈가 상당히 두꺼운 지방층에 덮여 만지기 어렵습니다. 옆에서 보았을 때 복부가 아래로 처져 있고 허리 굴곡을 거의 찾아보기 힘듭니다.",
    solution: "본격적인 관리가 시급한 골든타임입니다! 간식은 하루 총 섭취 칼로리의 5% 이하로 완전히 제한하고, 계산 결과에 맞춘 일일 권장량(다이어트 기준 계수 적용)을 지키며 점진적인 식단 관리를 시작해 주세요."
  },
  8: {
    score: 8,
    title: "비만 (Obese)",
    level: "danger",
    levelText: "위험 (비만)",
    description: "두꺼운 지방층에 갈비뼈가 완전히 묻혀 있어 만질 수 없습니다. 허리가 아예 불룩하고 척추 부위와 꼬리 기부에도 지방이 만져집니다.",
    solution: "관절염, 당뇨, 심장 질환, 췌장염 등 합병증 발병 확률이 극도로 급증합니다. 고섬유질·저지방 포뮬러의 '체중 감량 전용 사료'로 전환을 고려하고, 무릎에 무리가 가지 않도록 수중 운동이나 아주 부드러운 가벼운 평지 산책부터 차근차근 병행해 주어야 합니다."
  },
  9: {
    score: 9,
    title: "고도 비만 (Severely Obese)",
    level: "danger",
    levelText: "매우 위험 (고도비만)",
    description: "흉부, 복부, 등, 꼬리 주변에 거대한 지방층이 축적되어 있습니다. 움직임이 눈에 띄게 둔하고 관절에 심각한 통증을 유발할 수 있습니다.",
    solution: "수의사와의 긴밀한 협조 아래 철저히 통제된 다이어트 식단을 실행해야 합니다. 급여 제한(다이어트 요구량 엄수), 탄수화물 위주 간식의 절대 금지, 그리고 슬개골/척추 보호를 위한 쿠션 환경 조성 등 전방위적인 신체 관리가 시급합니다."
  }
};

export default function BcsCalculatorPage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // 컴포넌트 마운트 완료 시 플래그 설정 및 타이틀 지정
  useEffect(() => {
    setIsMounted(true);
    document.title = "반려동물 비만도(BCS) 및 다이어트 칼로리 계산기 | 마젠타랩";
  }, []);

  // 입력 폼 상태 관리
  const [petType, setPetType] = useState<"dog" | "cat">("dog");
  const [ageType, setAgeType] = useState<"month" | "year">("year");
  const [ageValue, setAgeValue] = useState<string>("3");
  const [weight, setWeight] = useState<string>("5.0");
  const [status, setStatus] = useState<string>("dog_neutered");
  const [bcs, setBcs] = useState<number>(5);
  
  // 계산 결과 상태
  const [rer, setRer] = useState<number>(0);
  const [der, setDer] = useState<number>(0);
  const [feedGrams, setFeedGrams] = useState<number>(0);
  const [isValid, setIsValid] = useState<boolean>(true);

  // 동물 종류 선택 변경 시 상태 리셋 및 기본값 매핑
  useEffect(() => {
    if (petType === "dog") {
      setStatus("dog_neutered");
    } else {
      setStatus("cat_neutered");
    }
  }, [petType]);

  // 실시간 계산 로직 (0.1초 미만 즉시 실행)
  useEffect(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      setIsValid(false);
      return;
    }
    setIsValid(true);

    // 1. 기초대사량 (RER) 공식 = 70 * (체중)^0.75
    const computedRer = 70 * Math.pow(w, 0.75);
    setRer(Math.round(computedRer * 10) / 10);

    // 2. 상태 계수 가져오기
    let factor = 1.0;
    if (petType === "dog") {
      factor = DOG_STATUS_FACTORS[status]?.factor ?? 1.6;
    } else {
      factor = CAT_STATUS_FACTORS[status]?.factor ?? 1.2;
    }

    // 3. 일일 필요 에너지 (DER) = RER * factor
    const computedDer = computedRer * factor;
    setDer(Math.round(computedDer * 10) / 10);

    // 4. 사료 그람수 = DER / 3.5 (사료 칼로리 3,500 kcal/kg 기준, 즉 3.5 kcal/g)
    const computedFeedGrams = computedDer / 3.5;
    setFeedGrams(Math.round(computedFeedGrams));
  }, [weight, petType, status]);

  // 입력값 폼 검증/포맷팅 핸들러
  const handleWeightChange = (val: string) => {
    // 숫자와 소수점만 허용
    const regex = /^\d*\.?\d*$/;
    if (regex.test(val)) {
      setWeight(val);
    }
  };

  const handleAgeChange = (val: string) => {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 0) {
      setAgeValue(val);
    } else if (val === "") {
      setAgeValue("");
    }
  };

  const handleReset = () => {
    setPetType("dog");
    setAgeType("year");
    setAgeValue("3");
    setWeight("5.0");
    setStatus("dog_neutered");
    setBcs(5);
  };

  // 비만 상태 스타일 테마
  const currentBcsInfo = BCS_DATA[bcs] || BCS_DATA[5];
  const getThemeColors = (level: BCSInfo["level"]) => {
    switch (level) {
      case "ideal":
        return {
          bg: "bg-emerald-50 border-emerald-200",
          text: "text-emerald-800",
          badge: "bg-emerald-500 text-white",
          border: "border-emerald-500",
          accent: "emerald",
          accentColor: "bg-emerald-600"
        };
      case "warn":
        return {
          bg: "bg-amber-50 border-amber-200",
          text: "text-amber-800",
          badge: "bg-amber-500 text-white",
          border: "border-amber-500",
          accent: "amber",
          accentColor: "bg-amber-600"
        };
      case "danger":
        return {
          bg: "bg-rose-50 border-rose-200",
          text: "text-rose-800",
          badge: "bg-rose-500 text-white",
          border: "border-rose-500",
          accent: "rose",
          accentColor: "bg-rose-600"
        };
      default:
        return {
          bg: "bg-slate-50 border-slate-200",
          text: "text-slate-800",
          badge: "bg-slate-500 text-white",
          border: "border-slate-500",
          accent: "slate",
          accentColor: "bg-slate-600"
        };
    }
  };

  const themeColors = getThemeColors(currentBcsInfo.level);

  // 하이드레이션 오류 방지: 마운트 완료 전에는 스켈레톤 로더 렌더링
  if (!isMounted) {
    return (
      <div className="bg-slate-50 min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-magenta mx-auto"></div>
          <p className="text-slate-500 font-bold text-sm">계산기를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 상단 인트로 영역 */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-magenta-light text-magenta text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>수의학 표준 알고리즘 기반 자가진단</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            반려동물 비만도(BCS) & 칼로리 계산기
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            아이의 체중, 건강 상태 및 체형(BCS 9단계) 정보를 바탕으로 
            하루에 필요한 정밀 칼로리 요구량(DER)과 일일 사료 급여량을 산출합니다.
          </p>
        </div>

        {/* 폼 및 결과 컨테이너 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 좌측: 입력 폼 (lg:grid-cols-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-6 sm:p-8 space-y-6">
            
            {/* 동물 선택 토글 */}
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-slate-700 block">반려동물 종류</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPetType("dog")}
                  className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 text-base font-bold transition-all ${
                    petType === "dog"
                      ? "border-magenta bg-magenta-light/20 text-magenta shadow-md shadow-magenta/5"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xl">🐶</span>
                  강아지 (Dog)
                </button>
                <button
                  type="button"
                  onClick={() => setPetType("cat")}
                  className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 text-base font-bold transition-all ${
                    petType === "cat"
                      ? "border-magenta bg-magenta-light/20 text-magenta shadow-md shadow-magenta/5"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xl">🐱</span>
                  고양이 (Cat)
                </button>
              </div>
            </div>

            {/* 나이 및 현재 체중 입력 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 나이 */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                  <span>반려동물 나이</span>
                  <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs">
                    <button
                      type="button"
                      onClick={() => setAgeType("year")}
                      className={`px-2 py-1 rounded-md font-medium transition-all ${
                        ageType === "year" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                      }`}
                    >
                      세(Years)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgeType("month")}
                      className={`px-2 py-1 rounded-md font-medium transition-all ${
                        ageType === "month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                      }`}
                    >
                      개월(Months)
                    </button>
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={ageValue}
                    onChange={(e) => handleAgeChange(e.target.value)}
                    placeholder="예: 3"
                    className="w-full pl-4 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-magenta/30 focus:border-magenta text-slate-800 font-semibold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                    {ageType === "year" ? "살" : "개월"}
                  </span>
                </div>
              </div>

              {/* 체중 */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Weight className="w-4 h-4 text-slate-400" />
                  현재 체중
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={weight}
                    onChange={(e) => handleWeightChange(e.target.value)}
                    placeholder="예: 5.4"
                    className="w-full pl-4 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-magenta/30 focus:border-magenta text-slate-800 font-semibold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                    kg
                  </span>
                </div>
                {!isValid && (
                  <p className="text-xs text-rose-500 font-medium">올바른 체중(0보다 큰 숫자)을 입력해 주세요.</p>
                )}
              </div>
            </div>

            {/* 중성화 및 건강 상태 선택 */}
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-slate-700 block">중성화 및 건강 상태</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-magenta/30 focus:border-magenta text-slate-800 font-semibold appearance-none cursor-pointer"
                >
                  {petType === "dog"
                    ? Object.entries(DOG_STATUS_FACTORS).map(([key, item]) => (
                        <option key={key} value={key} className="font-semibold py-2">
                          {item.label} (계수: {item.factor})
                        </option>
                      ))
                    : Object.entries(CAT_STATUS_FACTORS).map(([key, item]) => (
                        <option key={key} value={key} className="font-semibold py-2">
                          {item.label} (계수: {item.factor})
                        </option>
                      ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
              <p className="text-xs text-slate-400 pl-1">
                💡 {petType === "dog" ? DOG_STATUS_FACTORS[status]?.desc : CAT_STATUS_FACTORS[status]?.desc}
              </p>
            </div>

            {/* BCS 단계 선택 */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-magenta" />
                  비만도 단계 (BCS: Body Condition Score)
                </label>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> 1~9단계 표준 척도
                </span>
              </div>

              {/* BCS 슬라이더 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-1">
                  <span>매우마름 (1)</span>
                  <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">정상 (5)</span>
                  <span>고도비만 (9)</span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="1"
                    max="9"
                    step="1"
                    value={bcs}
                    onChange={(e) => setBcs(parseInt(e.target.value))}
                    onInput={(e) => setBcs(parseInt((e.target as HTMLInputElement).value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-magenta"
                    style={{ WebkitAppearance: "slider-horizontal" }}
                  />
                </div>
                {/* 1-9까지 빠른 버튼 */}
                <div className="grid grid-cols-9 gap-1.5">
                  {Array.from({ length: 9 }).map((_, i) => {
                    const score = i + 1;
                    const isSelected = bcs === score;
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setBcs(score)}
                        className={`py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${
                          isSelected
                            ? "bg-magenta text-white shadow-md shadow-magenta/20 scale-110"
                            : "bg-white text-slate-400 border border-slate-200/60 hover:bg-slate-100 hover:text-slate-600"
                        }`}
                      >
                        {score}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 현재 선택된 BCS 상태 상세 정보 박스 */}
              <div className={`p-5 rounded-2xl border-2 transition-all duration-300 ${themeColors.bg}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <AlertTriangle className={`w-5 h-5 ${themeColors.text}`} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-800 text-sm sm:text-base">
                        BCS {bcs}단계: {currentBcsInfo.title}
                      </span>
                      <span className={`text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full uppercase ${themeColors.badge}`}>
                        {currentBcsInfo.levelText}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {currentBcsInfo.description}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* 리셋 버튼 */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                설정 초기화
              </button>
            </div>

          </div>

          {/* 우측: 계산 결과 & 다이어트 솔루션 (lg:grid-cols-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 결과 종합 카드 */}
            <div className="bg-slate-900 rounded-3xl text-white shadow-xl p-6 sm:p-8 relative overflow-hidden border border-slate-800">
              
              {/* 장식용 배경 그라데이션 */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-magenta opacity-10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">진단 결과 분석</h3>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-3xl font-black text-white">
                      {petType === "dog" ? "댕댕이" : "야옹이"} 일일 열량 가이드
                    </span>
                  </div>
                </div>

                {/* 결과 수치 보드 */}
                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  {/* RER */}
                  <div className="flex justify-between items-center bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                      <span className="text-xs font-bold">기초대사량 (RER)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-sm sm:text-base text-white">
                        {isValid ? rer.toLocaleString() : "--"}
                      </span>
                      <span className="text-slate-400 text-xs ml-0.5">kcal</span>
                    </div>
                  </div>

                  {/* DER */}
                  <div className="flex justify-between items-center bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-magenta" />
                      <span className="text-xs font-bold">일일 필요 대사량 (DER)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-base sm:text-lg text-white">
                        {isValid ? der.toLocaleString() : "--"}
                      </span>
                      <span className="text-slate-400 text-xs ml-0.5">kcal</span>
                    </div>
                  </div>

                  {/* 사료 그람수 */}
                  <div className="bg-magenta-light/10 border border-magenta/30 p-5 rounded-2xl text-center space-y-2 mt-2">
                    <p className="text-[11px] font-extrabold text-magenta uppercase tracking-wider">일일 권장 사료 급여량</p>
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {isValid ? feedGrams : "--"}
                      </span>
                      <span className="text-slate-300 font-extrabold text-sm">g / 하루</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      * 평균 건식 사료 열량(3,500 kcal/kg) 기준으로 환산된 양입니다.
                    </p>
                  </div>
                </div>

                {/* BCS 비주얼 슬라이드 바 */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>비만 진단 척도</span>
                    <span className={`font-black uppercase ${currentBcsInfo.level === 'ideal' ? 'text-emerald-400' : currentBcsInfo.level === 'warn' ? 'text-amber-400' : 'text-rose-400'}`}>
                      {currentBcsInfo.title.split(" (")[0]}
                    </span>
                  </div>
                  <div className="grid grid-cols-9 gap-1 h-3 rounded-full bg-slate-800 p-0.5 overflow-hidden">
                    {Array.from({ length: 9 }).map((_, i) => {
                      const step = i + 1;
                      let stepColor = "bg-slate-700";
                      if (step === bcs) {
                        if (currentBcsInfo.level === "ideal") stepColor = "bg-emerald-500";
                        else if (currentBcsInfo.level === "warn") stepColor = "bg-amber-500";
                        else stepColor = "bg-rose-500";
                      } else if (step < bcs) {
                        // 지나간 채우기 컬러
                        stepColor = "bg-slate-800/80";
                      }
                      return (
                        <div
                          key={step}
                          className={`rounded-sm transition-all duration-300 ${stepColor}`}
                        />
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* 동적 관리/다이어트 솔루션 카드 */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-6 sm:p-8 space-y-4">
              
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Heart className="w-5 h-5 text-rose-500" />
                <h4 className="font-extrabold text-slate-800 text-base">
                  💡 수의학 다이어트 및 식단 솔루션
                </h4>
              </div>

              {/* BCS 6단계 이상 (과체중 / 비만 상태) 일 때의 솔루션 */}
              {bcs >= 6 ? (
                <div className="space-y-4">
                  {/* 경고 알림 바 */}
                  <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800">
                    <TrendingDown className="w-5 h-5 shrink-0 text-rose-500" />
                    <span className="text-xs font-bold leading-normal">
                      체중 감량 다이어트 프로그램 가이드라인이 필요합니다.
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    <p className="font-bold text-slate-800">1단계씩 서서히 줄여나가는 안전 다이어트 4대 규칙:</p>
                    <ul className="space-y-2.5 pl-1">
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                        <span>
                          <strong>사료량 제한:</strong> 권장 다이어트 급여량인 <strong className="text-rose-600">{feedGrams}g</strong>을 초과하지 않도록 주방 저울을 사용하여 g단위로 칼로리를 정확히 제한해 주세요.
                        </span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                        <span>
                          <strong>간식 제한:</strong> 하루 전체 섭취 칼로리의 5% 이하로 완전히 제한하거나, 건조 동결 간식을 저칼로리 야채류(브로콜리, 단호박 등 소량)로 대체하여 칼로리 밀도를 낮추십시오.
                        </span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                        <span>
                          <strong>안전한 관절 보호:</strong> 몸무게가 실리는 과도한 달리기나 높은 곳에서 뛰어내리는 운동은 무리가 옵니다. 평지 위주의 가벼운 산책(강아지)이나 부드러운 유도식 사냥 놀이(고양이)를 하루 2~3회에 나누어 조금씩 유도하세요.
                        </span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                        <span>
                          <strong>처방식 사료 검토:</strong> 필요시 식이섬유가 풍부하고 포만감이 유지되는 다이어트 전용 포뮬러 사료로 교체하는 것을 수의사와 상담해 보시는 것을 권장합니다.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : bcs <= 3 ? (
                // 저체중 상태(BCS 1~3) 일 때의 솔루션
                <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  <div className="flex items-center gap-2 p-3.5 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 mb-2">
                    <Info className="w-5 h-5 shrink-0 text-amber-500" />
                    <span className="text-xs font-bold">체중 및 영양소 보충이 필요합니다.</span>
                  </div>
                  <ul className="space-y-2.5 pl-1">
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                      <span>
                        <strong>소실 근육 보완:</strong> 양질의 단백질 및 건강한 지방 함량이 높은 고에너지 퍼피/키튼 혹은 활력 증진용 사료의 비중을 늘려 소모 칼로리를 메워 줍니다.
                      </span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                      <span>
                        <strong>소화 부담 완화:</strong> 급작스러운 사료 증량은 설사나 구토를 유발합니다. 하루 급여 빈도를 3~4회로 늘려 조금씩 위장에 부담이 가지 않도록 소량 분할 급여하세요.
                      </span>
                    </li>
                  </ul>
                </div>
              ) : (
                // 정상 상태(BCS 4~5) 일 때의 솔루션
                <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 mb-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                    <span className="text-xs font-bold">아주 건강한 정상 체형이 유지 중입니다.</span>
                  </div>
                  <ul className="space-y-2.5 pl-1">
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span>
                        <strong>일일 권장 사료 {feedGrams}g</strong>에 맞게 균형 잡힌 정량 급여를 유지해 주시고, 주기적인 체중 측정으로 비만으로 넘어가지 않게 유지해 주세요.
                      </span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span>
                        신체 나이와 관절 유연성에 알맞은 수준의 기초 산책과 캣타워 놀이를 병행하면 근골격계 건강에 가장 이상적입니다.
                      </span>
                    </li>
                  </ul>
                </div>
              )}

              {/* 기본 수의학 건강 팁 */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-500 text-xs leading-relaxed space-y-1">
                <p className="font-extrabold text-slate-700">📌 알아두세요!</p>
                <p>본 계산 결과는 미국반려동물비만치료협회(APOP) 및 세계소동물수의사회(WSAVA)의 표준 임상 지표를 기초로 설계되었습니다. 단, 개별 동물의 기저 질환, 임신 여부 등에 따라 최적 에너지량이 다를 수 있으므로 치료 목적의 정밀 설계는 반드시 주치의 수의사와 상의하시기 바랍니다.</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
