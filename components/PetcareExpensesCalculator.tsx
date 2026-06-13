"use client";

import { useState, useMemo } from "react";
import { 
  Calculator, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  Info,
  PiggyBank,
  Coffee,
  Heart,
  Calendar,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

type PetType = "dog_small" | "dog_medium" | "dog_large" | "cat";
type FoodGrade = "normal" | "premium" | "medical";
type CareType = "shop" | "home";

// 생후 개월수 및 나이 연산 기준일 (현재: 2026년 6월)
const CURRENT_YEAR = 2026;
const CURRENT_MONTH = 6;

// 기본 양육비 테이블
const BASE_DEFAULTS = {
  dog_small: {
    food: { normal: 30000, premium: 60000, medical: 90000 },
    hygiene: 30000,
    care: { shop: 50000, home: 10000 },
    initCost: 500000
  },
  dog_medium: {
    food: { normal: 40000, premium: 80000, medical: 120000 },
    hygiene: 35000,
    care: { shop: 70000, home: 10000 },
    initCost: 500000
  },
  dog_large: {
    food: { normal: 60000, premium: 120000, medical: 180000 },
    hygiene: 40000,
    care: { shop: 100000, home: 10000 },
    initCost: 1000000
  },
  cat: {
    food: { normal: 30000, premium: 60000, medical: 90000 },
    hygiene: 30000,
    care: { shop: 60000, home: 10000 },
    initCost: 500000
  }
};

export default function PetcareExpensesCalculator() {
  const [petType, setPetType] = useState<PetType>("dog_small");
  
  // 나이 입력 모드: "direct" (직접 입력) | "birth" (출생연월 선택)
  const [ageMode, setAgeMode] = useState<"direct" | "birth">("direct");
  const [age, setAge] = useState<string>("3");
  const [birthYear, setBirthYear] = useState<string>("2023");
  const [birthMonth, setBirthMonth] = useState<string>("6");
  
  // 예상 수명 (기본값 15세, 슬라이더 조절)
  const [lifespan, setLifespan] = useState<number>(15);

  // 식비 등급 및 비용
  const [foodGrade, setFoodGrade] = useState<FoodGrade>("premium");
  const [foodCost, setFoodCost] = useState<number>(60000);

  // 위생용품비 (기본 3만 원, 2만 원~5만 원 조절 슬라이더)
  const [hygieneCost, setHygieneCost] = useState<number>(30000);

  // 미용/케어
  const [careType, setCareType] = useState<CareType>("shop");
  const [careCost, setCareCost] = useState<number>(50000);

  // 중성화 여부 (1세 미만 아기일 때 체크 옵션 활성화)
  const [isSpayed, setIsSpayed] = useState<boolean>(true);

  // 실시간 계산용 파싱 나이
  const computedAge = useMemo(() => {
    if (ageMode === "direct") {
      const parsed = parseInt(age);
      return isNaN(parsed) || parsed < 0 ? 0 : parsed;
    } else {
      const year = parseInt(birthYear) || CURRENT_YEAR;
      const month = parseInt(birthMonth) || CURRENT_MONTH;
      const diffYears = CURRENT_YEAR - year;
      const diffMonths = CURRENT_MONTH - month;
      const totalMonths = diffYears * 12 + diffMonths;
      return Math.max(0, Math.floor(totalMonths / 12));
    }
  }, [ageMode, age, birthYear, birthMonth]);

  // 축종/크기 변경 시 권장 및 기본 고정값 동기화
  const handlePetTypeChange = (type: PetType) => {
    setPetType(type);
    const defaults = BASE_DEFAULTS[type];
    setFoodCost(defaults.food[foodGrade]);
    setHygieneCost(defaults.hygiene);
    setCareCost(defaults.care[careType]);
  };

  // 식비 등급 변경 시 디폴트 바인딩
  const handleFoodGradeChange = (grade: FoodGrade) => {
    setFoodGrade(grade);
    setFoodCost(BASE_DEFAULTS[petType].food[grade]);
  };

  // 미용 타입 변경 시 디폴트 바인딩
  const handleCareTypeChange = (type: CareType) => {
    setCareType(type);
    setCareCost(BASE_DEFAULTS[petType].care[type]);
  };

  // 수의학 기준 생애주기별 의료비 상수 연산 시뮬레이션
  const medicalCalculation = useMemo(() => {
    const isDog = petType !== "cat";
    let lifetimeMedical = 0;
    
    // 현재 나이부터 예상 수명까지 매년 나이 먹어감에 따른 시뮬레이션
    for (let current = computedAge; current < lifespan; current++) {
      if (current < 1) {
        // 기초 접종기 (1세 미만)
        lifetimeMedical += (isDog ? 350000 : 250000) + (isSpayed ? 200000 : 0);
      } else if (current < 7) {
        // 성숙기 (1세 이상 ~ 7세 미만)
        lifetimeMedical += 300000;
      } else {
        // 노령기 (7세 이상)
        lifetimeMedical += 600000;
      }
    }

    // 현재 나이에 매칭되는 올해 월평균 의료비
    let monthlyMedical = 0;
    if (computedAge < 1) {
      monthlyMedical = Math.round(((isDog ? 350000 : 250000) + (isSpayed ? 200000 : 0)) / 12);
    } else if (computedAge < 7) {
      monthlyMedical = Math.round(300000 / 12); // 25,000원
    } else {
      monthlyMedical = Math.round(600000 / 12); // 50,000원
    }

    return {
      lifetimeMedical,
      monthlyMedical
    };
  }, [petType, computedAge, lifespan, isSpayed]);

  // 지출 최종 연산
  const remainingYears = useMemo(() => {
    return Math.max(1, lifespan - computedAge);
  }, [lifespan, computedAge]);

  const monthlyTotal = useMemo(() => {
    return foodCost + hygieneCost + careCost + medicalCalculation.monthlyMedical;
  }, [foodCost, hygieneCost, careCost, medicalCalculation.monthlyMedical]);

  const lifetimeTotal = useMemo(() => {
    const initialCost = BASE_DEFAULTS[petType].initCost;
    // 비의료비 평생 누계 + 평생 시뮬레이션 의료비 + 초기 용품비
    const lifetimeNonMedical = (foodCost + hygieneCost + careCost) * 12 * remainingYears;
    return lifetimeNonMedical + medicalCalculation.lifetimeMedical + initialCost;
  }, [petType, foodCost, hygieneCost, careCost, remainingYears, medicalCalculation.lifetimeMedical]);

  // 차트 가시화 비율 연산
  const chartPercents = useMemo(() => {
    const total = monthlyTotal || 1;
    return {
      food: Math.round((foodCost / total) * 100),
      hygiene: Math.round((hygieneCost / total) * 100),
      care: Math.round((careCost / total) * 100),
      medical: Math.round((medicalCalculation.monthlyMedical / total) * 100)
    };
  }, [monthlyTotal, foodCost, hygieneCost, careCost, medicalCalculation.monthlyMedical]);

  // SVG 도넛 차트 원주 계산
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // 약 314.16
  const chartStrokes = useMemo(() => {
    const total = monthlyTotal || 1;
    const foodS = (foodCost / total) * circumference;
    const hygieneS = (hygieneCost / total) * circumference;
    const careS = (careCost / total) * circumference;
    const medicalS = (medicalCalculation.monthlyMedical / total) * circumference;

    return {
      food: `${foodS} ${circumference - foodS}`,
      hygiene: `${hygieneS} ${circumference - hygieneS}`,
      care: `${careS} ${circumference - careS}`,
      medical: `${medicalS} ${circumference - medicalS}`,
      offsets: {
        food: 0,
        hygiene: circumference - foodS,
        care: circumference - foodS - hygieneS,
        medical: circumference - foodS - hygieneS - careS
      }
    };
  }, [monthlyTotal, foodCost, hygieneCost, careCost, medicalCalculation.monthlyMedical]);

  // 나이대별 필수 예방접종 달력 데이터 바인딩
  const vaccinationSchedule = useMemo(() => {
    const isDog = petType !== "cat";
    
    if (computedAge < 1) {
      return {
        stageName: "기초 접종기 (1세 미만 베이비)",
        desc: "면역 형성을 위한 첫 접종 단계로 평생 건강을 결정하는 가장 중요한 시기입니다.",
        items: isDog ? [
          { name: "DHPPL 종합백신 (1~5차)", period: "생후 6~14주 (2주 간격)", cost: 150000, detail: "홍역, 간염, 파보바이러스 등 필수 치명적 전염병 전방위 예방" },
          { name: "코로나 장염 & 켄넬코프 백신", period: "생후 8~12주", cost: 80000, detail: "단체 생활 및 산책 시 호흡기/소화기 바이러스 완벽 방어" },
          { name: "광견병 & 신종플루(인플루엔자) 예방주사", period: "생후 14~16주", cost: 120000, detail: "법정 인수공통 전염병 및 신종 호흡기 독감 예방" },
          { name: "종합 항체가 검사", period: "생후 16주 이후", cost: 50000, detail: "5차 접종 후 체내 면역 항체가 제대로 형성되었는지 최종 확인 검사" },
          ...(isSpayed ? [{ name: "선택형 중성화 수술", period: "생후 6~8개월 권장", cost: 200000, detail: "생식기 질환 예방 및 행동 교정을 위한 안전한 외과적 중성화" }] : [])
        ] : [
          { name: "고양이 종합백신 (FVRCP 1~3차)", period: "생후 6~12주 (3주 간격)", cost: 100000, detail: "범백혈구감소증, 허피스, 칼리시바이러스 3대 안심 예방" },
          { name: "광견병 백신 및 필수 예방주사", period: "생후 12~14주", cost: 50000, detail: "가출 및 묘주 물림 사고 방지를 위한 의무 항체 형성 접종" },
          { name: "종합 항체가 검사", period: "생후 14주 이후", cost: 50000, detail: "접종 완료 후 주요 치명 질환에 대한 체내 면역 수준 평가" },
          { name: "고양이 백혈병 백신 (FeLV)", period: "생후 12주 이후 (선택)", cost: 50000, detail: "다묘 가정 혹은 실외 노출 우려 묘의 백혈병 항체 획득" },
          ...(isSpayed ? [{ name: "선택형 중성화 수술", period: "생후 6~7개월 권장", cost: 200000, detail: "발정 스트레스 경감, 자궁축농증 및 전립선 질환 원천 예방" }] : [])
        ]
      };
    } else if (computedAge < 7) {
      return {
        stageName: "매년 추가 접종기 (1세 이상 ~ 7세 미만 성숙기)",
        desc: "튼튼한 성숙기 유지를 위해 매년 1회 면역 보강 추가 접종과 매월 내부외 기생충 관리가 권장됩니다.",
        items: [
          { name: "종합백신(DHPPL/FVRCP) 추가 접종", period: "매년 1회", cost: 40000, detail: "시간이 지남에 따라 소실되는 면역 항체 수치를 최고치로 유지" },
          { name: "광견병 & 켄넬코프(강아지) 추가 접종", period: "매년 1회", cost: 60000, detail: "단체 이용/호텔링 시 필수로 검증받아야 하는 예방 접종 완료증 갱신" },
          { name: "1년치 심장사상충 및 내외부 기생충 예방약", period: "매월 복용/바름 (연간)", cost: 200000, detail: "모기 매개 치명 심장사상충 및 진드기 매개 살인진드기병 원천 차단" }
        ]
      };
    } else {
      return {
        stageName: "노령기 집중 종합 검진기 (7세 이상 실버케어)",
        desc: "신체 기능 노화가 시작되는 시기로, 질환 조기 발견을 위한 혈액검사 및 영상 정밀 검진이 필수적입니다.",
        items: [
          { name: "실버 종합 혈액검사 (CBC & Chemistry 17종)", period: "매년 1회 권장", cost: 200000, detail: "간, 신장 기능 수치 및 전해질, 백혈구 적혈구 정밀 신체 장기 분석" },
          { name: "복부 초음파 & 흉부 엑스레이 영상 정밀 검사", period: "매년 1회 권장", cost: 250000, detail: "종양 조기 발견, 심장 비대증 판정 및 복부 주요 장기 형태 분석" },
          { name: "종합백신 및 광견병 매년 의무 접종", period: "매년 1회", cost: 50000, detail: "노화로 인한 저하된 면역계를 서포트하는 필수 기초 추가 접종" },
          { name: "노령 맞춤형 사상충 및 기생충 안전 처방", period: "연간 지속", cost: 100000, detail: "체력이 저하된 실버견/묘의 간부하를 줄이는 저자극성 기생충 차단" }
        ]
      };
    }
  }, [petType, computedAge, isSpayed]);

  // 리셋
  const handleReset = () => {
    setPetType("dog_small");
    setAgeMode("direct");
    setAge("3");
    setBirthYear("2023");
    setBirthMonth("6");
    setLifespan(15);
    setFoodGrade("premium");
    setFoodCost(60000);
    setHygieneCost(30000);
    setCareType("shop");
    setCareCost(50000);
    setIsSpayed(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#faf8f9] py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* 2026 트렌디 백그라운드 오라 장식 */}
      <div className="absolute top-[-5%] right-[-10%] w-[550px] h-[550px] rounded-full bg-magenta/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-15%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* 헤더 섹션 */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-magenta-light text-magenta text-xs font-black uppercase tracking-wider shadow-sm border border-magenta/10">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            안심 연구원 지출 진단 리포트
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            반려동물 평생 양육비 & 월간 유지비 계산기 💰
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-bold leading-relaxed">
            나이대별 수의학 필수 예방접종 비용과 생애 의료비 시뮬레이션을 탑재하여<br className="hidden sm:inline" />
            우리 아이 맞춤형 한 달 고정 유지비와 평생 지출의 정밀 진단서를 실시간 확인하세요.
          </p>
        </div>

        {/* 2컬럼 레이아웃 대시보드 (입력창 & 실시간 리포트) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 좌측: 입력 카드군 (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. 축종 및 크기 선택 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100/80 hover:shadow-md transition-shadow duration-300 space-y-4">
              <label className="text-base font-black text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-magenta-light text-magenta text-xs font-black">1</span>
                축종 및 반려동물 크기 선택
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(
                  [
                    { id: "dog_small", label: "소형견", icon: "🐶", desc: "10kg 미만" },
                    { id: "dog_medium", label: "중형견", icon: "🐕", desc: "10~25kg" },
                    { id: "dog_large", label: "대형견", icon: "🐩", desc: "25kg 이상" },
                    { id: "cat", label: "고양이", icon: "🐱", desc: "반려묘 전체" }
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePetTypeChange(item.id)}
                    className={`p-3.5 rounded-2xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      petType === item.id
                        ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                        : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                    }`}
                    style={{ minHeight: "95px" }}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-[13px] font-black">{item.label}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 나이 및 예상 수명 입력 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100/80 hover:shadow-md transition-shadow duration-300 space-y-5">
              <label className="text-base font-black text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-magenta-light text-magenta text-xs font-black">2</span>
                나이 및 예상 수명 설정
              </label>

              {/* 나이 입력 방식 전환 탭 */}
              <div className="flex border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setAgeMode("direct")}
                  className={`flex-1 pb-3 text-sm font-bold border-b-2 text-center cursor-pointer transition-all ${
                    ageMode === "direct"
                      ? "border-magenta text-magenta font-black"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  나이 직접 입력
                </button>
                <button
                  type="button"
                  onClick={() => setAgeMode("birth")}
                  className={`flex-1 pb-3 text-sm font-bold border-b-2 text-center cursor-pointer transition-all ${
                    ageMode === "birth"
                      ? "border-magenta text-magenta font-black"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  출생연월 선택
                </button>
              </div>

              {ageMode === "direct" ? (
                <div className="space-y-2">
                  <span className="text-sm font-bold text-gray-700">현재 나이 입력</span>
                  <div className="relative">
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="예: 3"
                      min="0"
                      max="30"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-magenta focus:ring-1 focus:ring-magenta focus:outline-none transition-all font-bold text-gray-800 text-base"
                      style={{ minHeight: "56px" }}
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">살</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-sm font-bold text-gray-700">출생 연도</span>
                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-magenta focus:outline-none font-bold text-gray-800 bg-white"
                      style={{ minHeight: "56px" }}
                    >
                      {Array.from({ length: 25 }, (_, i) => CURRENT_YEAR - i).map((yr) => (
                        <option key={yr} value={yr}>{yr}년</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-bold text-gray-700">출생 월</span>
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-magenta focus:outline-none font-bold text-gray-800 bg-white"
                      style={{ minHeight: "56px" }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>{m}월</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* 중성화 옵션 - 1세 미만일 때만 체크박스 노출 */}
              {computedAge < 1 && (
                <div className="p-4 bg-magenta-light/30 border border-magenta/10 rounded-2xl flex items-center justify-between transition-all duration-300">
                  <span className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    👶 1세 미만 기초 접종기에 중성화 수술을 하였거나 할 예정인가요?
                  </span>
                  <input
                    type="checkbox"
                    checked={isSpayed}
                    onChange={(e) => setIsSpayed(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-magenta focus:ring-magenta cursor-pointer"
                  />
                </div>
              )}

              {/* 예상 수명 슬라이더 */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-gray-700">목표 예상 수명</span>
                  <span className="text-magenta font-black text-base">{lifespan}세</span>
                </div>
                <input
                  type="range"
                  min={Math.max(1, computedAge + 1)}
                  max="35"
                  value={lifespan}
                  onChange={(e) => setLifespan(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-magenta"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>{Math.max(1, computedAge + 1)}세</span>
                  <span>20세</span>
                  <span>35세</span>
                </div>
              </div>
            </div>

            {/* 3. 월간 고정 지출 설정 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100/80 hover:shadow-md transition-shadow duration-300 space-y-6">
              <label className="text-base font-black text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-magenta-light text-magenta text-xs font-black">3</span>
                월간 고정 생활 지출비 조율
              </label>

              {/* 식비 등급 설정 */}
              <div className="space-y-3">
                <span className="text-sm font-bold text-gray-700">식사 사료/간식 품질</span>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { id: "normal", label: "일반형", val: "3만" },
                      { id: "premium", label: "프리미엄", val: "6만" },
                      { id: "medical", label: "처방식/생식", val: "9만" }
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
                      style={{ minHeight: "75px" }}
                    >
                      <span className="text-xs font-black">{item.label}</span>
                      <span className="text-[10px] text-gray-400 font-bold">{item.val} 원 기준</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 식비 미세 조율 슬라이더 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>식사 및 간식비 (월)</span>
                  <span className="text-gray-900 text-sm font-black">{foodCost.toLocaleString()} 원</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="400000"
                  step="5000"
                  value={foodCost}
                  onChange={(e) => setFoodCost(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-magenta"
                />
              </div>

              <div className="h-px bg-gray-100" />

              {/* 위생용품비 (배변패드, 고양이 모래 등 2만 원~5만 원 조절 슬라이더) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-gray-700">위생 용품비 (배변패드, 고양이 모래 등 / 월)</span>
                  <span className="text-magenta font-black">{hygieneCost.toLocaleString()} 원</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="50000"
                  step="2000"
                  value={hygieneCost}
                  onChange={(e) => setHygieneCost(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-magenta"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>2만 원</span>
                  <span>3.5만 원</span>
                  <span>5만 원</span>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* 미용/케어 방식 선택 */}
              <div className="space-y-3">
                <span className="text-sm font-bold text-gray-700">미용 및 위생 관리 방식</span>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { id: "shop", label: "전문 미용숍 케어", desc: "월 1회 전문점 목욕/미용" },
                      { id: "home", label: "홈케어 위주", desc: "셀프 목욕 및 기본 위생케어" }
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
                      style={{ minHeight: "75px" }}
                    >
                      <span className="text-xs font-black">{item.label}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 미용비 미세 조율 슬라이더 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>미용 및 케어 관리비 (월)</span>
                  <span className="text-gray-900 text-sm font-black">{careCost.toLocaleString()} 원</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250000"
                  step="5000"
                  value={careCost}
                  onChange={(e) => setCareCost(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-magenta"
                />
              </div>

            </div>
          </div>

          {/* 우측: 실시간 글래스모피즘 결과 리포트 (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
            
            {/* 글래스모피즘 결과 요약 카드 */}
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/40 bg-white/75 backdrop-blur-xl shadow-xl shadow-slate-100">
              
              {/* 은은한 네온 빛 무드 데코 */}
              <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-magenta/10 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-44 h-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                
                {/* 상단 헤더 */}
                <div className="flex items-center justify-between gap-4 border-b border-gray-150/40 pb-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                      LIFETIME EXPENSE ANALYTICS
                    </p>
                    <h2 className="text-lg font-black text-gray-900 mt-0.5">
                      지출 종합 진단서
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black bg-magenta-light text-magenta shadow-sm border border-magenta/10">
                    실시간 자동 갱신 ⚡
                  </span>
                </div>

                {/* 비용 요약 인포그래픽 */}
                <div className="space-y-4">
                  {/* 월 고정 지출 */}
                  <div className="bg-white/90 p-4.5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Coffee className="w-3.5 h-3.5 text-magenta" />
                        월간 고정 유지비
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-magenta">
                        {monthlyTotal.toLocaleString()}원
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold">의료비 포함</span>
                    </div>
                  </div>

                  {/* 평생 누적 예상 양육비 */}
                  <div className="bg-white/90 p-4.5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <PiggyBank className="w-3.5 h-3.5 text-indigo-500" />
                        평생 누적 예상 양육비
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-indigo-600">
                        {lifetimeTotal.toLocaleString()}원
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold">생애 총합 ({remainingYears}년)</span>
                    </div>
                  </div>
                </div>

                {/* 나이 시뮬레이터 요약 설명 */}
                <div className="bg-white/50 p-4 rounded-2xl border border-white/60 text-xs text-gray-500 leading-relaxed font-semibold">
                  <Info className="w-3.5 h-3.5 text-gray-400 inline-block mr-1 -mt-0.5" />
                  현재 나이 <span className="text-gray-900 font-black">{computedAge}세</span>부터 예상 수명 <span className="text-gray-900 font-black">{lifespan}세</span>까지의 시뮬레이션입니다. 초기 용품 정착금({petType === "dog_large" ? "100만 원" : "50만 원"})이 추가되었습니다.
                </div>

                {/* 차트 가시화 */}
                <div className="flex items-center gap-6 p-4 bg-white/40 border border-white/30 rounded-2xl">
                  {/* 도넛 차트 SVG */}
                  <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#E5007E"
                        strokeWidth="12"
                        strokeDasharray={chartStrokes.food}
                        strokeDashoffset={chartStrokes.offsets.food}
                        className="transition-all duration-500"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#0ea5e9"
                        strokeWidth="12"
                        strokeDasharray={chartStrokes.hygiene}
                        strokeDashoffset={chartStrokes.offsets.hygiene}
                        className="transition-all duration-500"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#6366f1"
                        strokeWidth="12"
                        strokeDasharray={chartStrokes.care}
                        strokeDashoffset={chartStrokes.offsets.care}
                        className="transition-all duration-500"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#f97316"
                        strokeWidth="12"
                        strokeDasharray={chartStrokes.medical}
                        strokeDashoffset={chartStrokes.offsets.medical}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">MONTHLY</span>
                      <span className="text-xs font-black text-gray-800">
                        {monthlyTotal >= 10000 ? `${(monthlyTotal/10000).toFixed(1)}만` : `${monthlyTotal.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  {/* 비율 브레이크다운 */}
                  <div className="flex-1 space-y-2 text-[10px] font-bold text-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-magenta" /> 식비 및 간식</span>
                      <span className="text-gray-900">{chartPercents.food}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500" /> 위생용품</span>
                      <span className="text-gray-900">{chartPercents.hygiene}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> 미용 및 위생</span>
                      <span className="text-gray-900">{chartPercents.care}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> 의료비 (자동)</span>
                      <span className="text-gray-900">{chartPercents.medical}%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* "우리 아이 나이 맞춤형 필수 예방접종 달력" */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-150/60 space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-magenta" />
                  올해 필수 예방접종 &amp; 케어 달력 📅
                </h3>
                <p className="text-xs text-gray-400 font-bold leading-normal">
                  현재 나이인 <span className="text-magenta font-black">{computedAge}세</span> 시점에 필수 권장되는 수의학 예방 케어 및 건강검진 비용 내역입니다.
                </p>
              </div>

              {/* 나이 그룹 표시 */}
              <div className="bg-magenta-light/30 px-3.5 py-2.5 rounded-2xl border border-magenta/10 flex items-center justify-between text-xs font-black text-magenta">
                <span>{vaccinationSchedule.stageName}</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded shadow-sm border border-magenta/5">권장</span>
              </div>

              {/* 설명 */}
              <p className="text-xs text-gray-500 leading-relaxed font-semibold whitespace-pre-line">
                💡 {vaccinationSchedule.desc}
              </p>

              {/* 접종 체크리스트 */}
              <div className="space-y-3.5 pt-2">
                {vaccinationSchedule.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-gray-100 rounded-2xl space-y-2 hover:border-gray-200 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-magenta mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-gray-900 leading-tight">{item.name}</h4>
                          <span className="text-[10px] text-gray-400 font-bold">{item.period}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-magenta flex-shrink-0">
                        ~ {(item.cost).toLocaleString()}원
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-semibold pl-6 border-l border-gray-200">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[10px] text-gray-400 leading-relaxed font-bold">
                * 예방접종 비용은 지역 및 동물병원 규모에 따라 상이할 수 있으며, 만 7세 이상 노령기는 주기적인 스크리닝이 아이의 갑작스러운 중증 의료비 폭탄을 방지하는 지름길입니다.
              </div>
            </div>

            {/* 다시 계산하기 버튼 */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-4.5 bg-white hover:bg-slate-50 border border-slate-200 text-gray-500 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-sm"
              style={{ minHeight: "56px" }}
            >
              <RotateCcw className="w-4 h-4" />
              다시 계산하기
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
