"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Sparkles, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Heart, 
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Sparkle
} from "lucide-react";

// 생애주기 분류 기준 인터페이스
interface LifeStageInfo {
  stageName: string;
  minHumanAge: number;
  maxHumanAge: number;
  colorClass: string;
  badgeClass: string;
  desc: string;
  tips: string[];
}

const LIFE_STAGES: Record<string, LifeStageInfo> = {
  growth: {
    stageName: "성장기 (Growth / Junior)",
    minHumanAge: 0,
    maxHumanAge: 19,
    colorClass: "from-sky-500/20 to-blue-500/20 border-blue-200/50 text-blue-900",
    badgeClass: "bg-blue-500 text-white shadow-blue-500/20",
    desc: "기초 체력과 면역 시스템이 활발하게 형성되는 생애 첫 단계입니다.",
    tips: [
      "성장기 전용 고단백·고칼슘 사료(초유 성분 및 L-라이신 풍부)를 급여해 주세요.",
      "생후 3~4개월 시기의 기초 예방접종(종합백신 등) 일정을 철저히 지켜야 합니다.",
      "올바른 사회화 교육을 위해 매일 다양한 소리, 환경, 낯선 자극을 경험하도록 유도하세요.",
      "이갈이 시기에는 잇몸 통증 완화와 영구치 관리를 위해 안전한 터그/치석 토이를 제공해 주세요."
    ]
  },
  maturity: {
    stageName: "성숙기 (Adult / Active)",
    minHumanAge: 20,
    maxHumanAge: 39,
    colorClass: "from-emerald-500/20 to-teal-500/20 border-emerald-200/50 text-emerald-900",
    badgeClass: "bg-emerald-500 text-white shadow-emerald-500/20",
    desc: "신체 기능이 절정에 달하고 에너지가 가장 넘치는 건강한 성년 단계입니다.",
    tips: [
      "중성화 수술 이후 대사량이 감소해 비만이 되기 쉬우므로 저칼로리 식단과 체중 관리가 필요합니다.",
      "하루 최소 30분 이상(강아지는 야외 산책, 고양이는 낚싯대 사냥 놀이)의 에너지 해소가 필수적입니다.",
      "구강 건강이 나빠지기 시작하므로 하루 1회 칫솔질 및 플라그 제거 껌 급여를 루틴화해 주세요.",
      "매년 1회 정기 종합 백신 추가 접종 및 기본적인 심장사상충 예방을 잊지 마세요."
    ]
  },
  matureAdulthood: {
    stageName: "장년기 (Mature / Middle-aged)",
    minHumanAge: 40,
    maxHumanAge: 54,
    colorClass: "from-amber-500/20 to-orange-500/20 border-amber-200/50 text-amber-900",
    badgeClass: "bg-amber-500 text-white shadow-amber-500/20",
    desc: "세포 노화가 천천히 시작되며 완만한 에너지 감소가 포착되는 전환 단계입니다.",
    tips: [
      "관절 질환(슬개골 탈구, 척추 디스크) 예방을 위해 소파/침대 밑에 전용 미끄럼 방지 계단을 설치하세요.",
      "세포 산화 방지를 위해 비타민 C, 비타민 E, 코엔자임 Q10 등 항산화 영양 공급에 신경 써 주어야 합니다.",
      "소화 기능 저하에 맞춰 소화 흡수율이 높고 식이섬유가 풍부한 장년기 전용 사료로 전환을 검토하세요.",
      "외관상 질병이 보이지 않더라도 1년에 한 번 정밀 혈액 검사 및 복부 초음파 검진을 권장합니다."
    ]
  },
  senior: {
    stageName: "노령기 (Senior / Geriatric)",
    minHumanAge: 55,
    maxHumanAge: 200,
    colorClass: "from-rose-500/20 to-pink-500/20 border-rose-200/50 text-rose-900",
    badgeClass: "bg-rose-500 text-white shadow-rose-500/20",
    desc: "세심한 밀착 케어와 만성 질환 예방관리가 최우선시되는 노후 실버 단계입니다.",
    tips: [
      "관절 통증 완화와 연골 보호를 위해 콘드로이친, 글루코사민, 초록입홍합 성분의 영양제를 필수로 급여하세요.",
      "신장 및 간 기능 저하 여부를 체크하기 위해 최소 6개월 주기로 동물병원 혈액/검뇨 검사를 진행하세요.",
      "치매(인지기능장애증후군)를 방지하기 위해 노즈워크 놀이와 가벼운 후각 자극 산책을 꾸준히 이어 가세요.",
      "체온 조절 능력이 저하되므로 실내 온도를 항상 따뜻하게 유지하고, 푹신한 정형외과용 메모리폼 쿠션을 제공하세요."
    ]
  }
};

export default function AgeCalculator() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // 로컬 컴퓨터 날짜 기준으로 자동 설정하여 Hydration 불일치 원천 차단
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(6);

  useEffect(() => {
    setIsMounted(true);
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
  }, []);

  // 입력 폼 상태 관리
  const [petType, setPetType] = useState<"dog" | "cat">("dog");
  const [dogSize, setDogSize] = useState<"small" | "medium" | "large">("small");
  
  // 기본 출생일 3년 전으로 세팅
  const [birthYear, setBirthYear] = useState<string>("2023");
  const [birthMonth, setBirthMonth] = useState<string>("6");

  // 애니메이션 제어용 상태
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  // 최종 도출된 계산 값 저장 상태
  const [computedPetAge, setComputedPetAge] = useState<{ years: number; months: number }>({ years: 0, months: 0 });
  const [computedHumanAge, setComputedHumanAge] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<LifeStageInfo>(LIFE_STAGES.growth);

  // 연도 셀렉트 박스 아이템 생성 (2000년부터 현재년도까지)
  const yearsList = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => String(currentYear - i));
  const monthsList = Array.from({ length: 12 }, (_, i) => String(i + 1));

  // 계산 메인 엔진
  const calculateAge = () => {
    setIsAnalyzing(true);
    setShowResult(false);

    // 0.6초간의 마이크로 로딩 애니메이션 실행 후 결과 노출
    setTimeout(() => {
      const birthY = parseInt(birthYear);
      const birthM = parseInt(birthMonth);

      // 개월 수 차이 계산
      const diffMonths = Math.max(0, (currentYear - birthY) * 12 + (currentMonth - birthM));
      const petYears = Math.floor(diffMonths / 12);
      const petMonths = diffMonths % 12;

      setComputedPetAge({ years: petYears, months: petMonths });

      let humanAge = 0;

      if (petType === "cat") {
        // 고양이 계산 공식 (개월 수 기반 선형 보간)
        if (diffMonths <= 1) {
          // 0~1개월: 0세 ~ 1세 선형 매핑
          humanAge = diffMonths * 1;
        } else if (diffMonths <= 3) {
          // 1~3개월: 1세 ~ 5세 선형 매핑
          humanAge = 1 + (diffMonths - 1) * ((5 - 1) / (3 - 1));
        } else if (diffMonths <= 6) {
          // 3~6개월: 5세 ~ 10세 선형 매핑
          humanAge = 5 + (diffMonths - 3) * ((10 - 5) / (6 - 3));
        } else if (diffMonths <= 12) {
          // 6~12개월: 10세 ~ 15세 선형 매핑
          humanAge = 10 + (diffMonths - 6) * ((15 - 10) / (12 - 6));
        } else if (diffMonths <= 24) {
          // 12~24개월: 15세 ~ 24세 선형 매핑
          humanAge = 15 + (diffMonths - 12) * ((24 - 15) / (24 - 12));
        } else {
          // 2년 이후: 1년당 +4세 추가
          humanAge = 24 + (diffMonths - 24) * (4 / 12);
        }
      } else {
        // 강아지 계산 공식 (크기별 차등 계산)
        if (dogSize === "small") {
          // 소형견 (<10kg)
          if (diffMonths <= 12) {
            humanAge = diffMonths * (15 / 12); // 1년 = 15세
          } else if (diffMonths <= 24) {
            humanAge = 15 + (diffMonths - 12) * ((24 - 15) / (24 - 12)); // 2년 = 24세
          } else {
            humanAge = 24 + (diffMonths - 24) * (4 / 12); // 2년 이후 1년당 +4세
          }
        } else if (dogSize === "medium") {
          // 중형견 (10~25kg)
          if (diffMonths <= 12) {
            humanAge = diffMonths * (15 / 12); // 1년 = 15세
          } else if (diffMonths <= 24) {
            humanAge = 15 + (diffMonths - 12) * ((24 - 15) / (24 - 12)); // 2년 = 24세
          } else {
            humanAge = 24 + (diffMonths - 24) * (5 / 12); // 2년 이후 1년당 +5세
          }
        } else {
          // 대형견 (>25kg)
          if (diffMonths <= 12) {
            humanAge = diffMonths * (12 / 12); // 1년 = 12세
          } else if (diffMonths <= 24) {
            humanAge = 12 + (diffMonths - 12) * ((22 - 12) / (24 - 12)); // 2년 = 22세
          } else {
            humanAge = 22 + (diffMonths - 24) * (7.5 / 12); // 2년 이후 1년당 +7.5세
          }
        }
      }

      // 최종 인간 나이 반올림 처리
      const finalHumanAge = Math.max(0, Math.round(humanAge * 10) / 10);
      setComputedHumanAge(finalHumanAge);

      // 생애주기 판정 단계 지정
      let stage: LifeStageInfo = LIFE_STAGES.growth;
      if (finalHumanAge >= 55) {
        stage = LIFE_STAGES.senior;
      } else if (finalHumanAge >= 40) {
        stage = LIFE_STAGES.matureAdulthood;
      } else if (finalHumanAge >= 20) {
        stage = LIFE_STAGES.maturity;
      } else {
        stage = LIFE_STAGES.growth;
      }

      setCurrentStage(stage);
      setIsAnalyzing(false);
      setShowResult(true);
    }, 600);
  };

  const handleReset = () => {
    setPetType("dog");
    setDogSize("small");
    setBirthYear("2023");
    setBirthMonth("6");
    setShowResult(false);
  };

  if (!isMounted) {
    return (
      <div className="bg-slate-900 min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-magenta mx-auto"></div>
          <p className="text-slate-400 font-bold text-sm">로딩 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen py-12 px-4 sm:px-6 relative overflow-hidden flex items-center justify-center">
      
      {/* 글래스모피즘 전용 백그라운드 구체 데코레이션 */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-magenta/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto space-y-8 relative z-10">
        
        {/* 상단 텍스트 설명 영역 */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-magenta-light/10 text-magenta border border-magenta/20 text-xs font-semibold tracking-wide backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026년형 프리미엄 스마트 진단엔진</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
            반려동물 인간 나이 & 생애주기 진단기
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            축종, 체형 크기, 정확한 출생일(개월 수) 데이터를 기반으로 
            수의학 표준 나이 변환 공식 및 최적의 신체 생애주기 가이드를 실시간 계산합니다.
          </p>
        </div>

        {/* 메인 보드 (글래스모피즘 적용 카드) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-6 sm:p-8 space-y-8">
          
          {/* 입력 양식 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 왼쪽 컬럼: 기본 사항 선택 */}
            <div className="space-y-6">
              
              {/* 축종 선택 */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-300 block">반려동물 종류</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPetType("dog")}
                    className={`flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border transition-all cursor-pointer font-bold ${
                      petType === "dog"
                        ? "border-magenta/40 bg-magenta/15 text-magenta shadow-[0_0_15px_rgba(229,0,126,0.15)]"
                        : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">🐶</span>
                    강아지 (Dog)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPetType("cat")}
                    className={`flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border transition-all cursor-pointer font-bold ${
                      petType === "cat"
                        ? "border-magenta/40 bg-magenta/15 text-magenta shadow-[0_0_15px_rgba(229,0,126,0.15)]"
                        : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">🐱</span>
                    고양이 (Cat)
                  </button>
                </div>
              </div>

              {/* 강아지일 경우 견종 크기 분류 노출 (마이크로 인터랙션 애니메이션 적용) */}
              <div 
                className={`transition-all duration-300 overflow-hidden ${
                  petType === "dog" ? "max-h-[160px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                <div className="space-y-2.5 pt-1">
                  <label className="text-sm font-bold text-slate-300 block">견종 크기 분류</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { size: "small", label: "소형견", desc: "10kg 미만" },
                      { size: "medium", label: "중형견", desc: "10~25kg" },
                      { size: "large", label: "대형견", desc: "25kg 초과" }
                    ].map((item) => (
                      <button
                        key={item.size}
                        type="button"
                        onClick={() => setDogSize(item.size as any)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          dogSize === item.size
                            ? "border-magenta/40 bg-magenta/15 text-magenta"
                            : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-xs font-bold">{item.label}</span>
                        <span className="text-[10px] opacity-60 mt-0.5">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* 오른쪽 컬럼: 출생 연월 선택 */}
            <div className="space-y-6">
              
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-magenta" />
                  출생 연월 선택
                </label>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* 연도 드롭다운 */}
                  <div className="relative">
                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="w-full pl-4 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-magenta/30 focus:border-magenta/40 text-slate-200 font-bold appearance-none cursor-pointer text-sm"
                    >
                      {yearsList.map((y) => (
                        <option key={y} value={y} className="bg-slate-900 text-slate-200 font-bold">
                          {y}년
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* 월 드롭다운 */}
                  <div className="relative">
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="w-full pl-4 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-magenta/30 focus:border-magenta/40 text-slate-200 font-bold appearance-none cursor-pointer text-sm"
                    >
                      {monthsList.map((m) => (
                        <option key={m} value={m} className="bg-slate-900 text-slate-200 font-bold">
                          {m}월
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3 mt-2">
                  <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                  <p className="text-xs text-slate-400 leading-normal font-medium">
                    정확한 출생 연월을 선택하면 개월 수 비례에 따라 수의학 보간법을 적용해 인간 나이로 오차 없이 미세 정산됩니다.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* 액션 버튼 그룹 */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={calculateAge}
              disabled={isAnalyzing}
              className="flex-1 py-4 bg-magenta text-white font-extrabold text-base rounded-2xl cursor-pointer hover:bg-magenta/90 active:scale-[0.98] transition-all shadow-lg shadow-magenta/20 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI 생애분석 중...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  생애주기 진단하기
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl cursor-pointer transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </button>
          </div>

          {/* 결과 표출 카드 (마이크로 전환 애니메이션 적용) */}
          <div
            className={`transition-all duration-500 transform ease-out ${
              showResult
                ? "opacity-100 translate-y-0 scale-100 max-h-[1000px]"
                : "opacity-0 -translate-y-4 scale-95 max-h-0 overflow-hidden pointer-events-none"
            }`}
          >
            <div className="border-t border-white/10 pt-8 space-y-6">
              
              {/* 메인 진단 결과 보드 */}
              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-magenta/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-4 text-center">
                  <span className="text-xs font-black tracking-widest text-magenta uppercase bg-magenta-light/10 border border-magenta/20 px-3 py-1 rounded-full">
                    진단 결과서
                  </span>
                  
                  <div className="space-y-2">
                    <p className="text-slate-300 text-sm sm:text-base font-bold">
                      올해 실제 나이 <strong className="text-white text-lg font-black">{computedPetAge.years}살 {computedPetAge.months}개월</strong>인 우리 아이는
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-normal tracking-tight">
                      인간 나이로 환산 시{" "}
                      <span className="text-magenta drop-shadow-[0_0_8px_rgba(229,0,126,0.3)]">
                        {computedHumanAge}세
                      </span>{" "}
                      <span className="text-slate-300">
                        [{currentStage.stageName.split(" (")[0]}]
                      </span>
                      입니다.
                    </h2>
                  </div>
                </div>

                {/* 생애주기 비주얼 슬라이드바 */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>성장기 (~19세)</span>
                    <span>성숙기 (20~39세)</span>
                    <span>장년기 (40~54세)</span>
                    <span>노령기 (55세~)</span>
                  </div>
                  
                  {/* 슬라이드 트랙 */}
                  <div className="h-3 rounded-full bg-slate-950 p-0.5 overflow-hidden flex relative">
                    {/* 게이지 바 */}
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 via-amber-500 to-rose-500 transition-all duration-1000"
                      style={{ width: `${Math.min(100, (computedHumanAge / 80) * 100)}%` }}
                    />
                    {/* 현재 마커 핀 */}
                    <div 
                      className="absolute top-0.5 -mt-1 w-5 h-5 rounded-full border-2 border-white bg-magenta shadow-md shadow-magenta/50 -translate-x-1/2 transition-all duration-1000"
                      style={{ left: `${Math.min(100, (computedHumanAge / 80) * 100)}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* 맞춤형 수의학 가이드 솔루션 */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <h3 className="font-extrabold text-white text-base sm:text-lg">
                    🩺 {currentStage.stageName.split(" (")[0]} 맞춤형 영양 & 건강 솔루션
                  </h3>
                </div>

                <div className="space-y-4 text-slate-300">
                  <div className={`p-4 rounded-2xl border ${currentStage.colorClass} space-y-1.5`}>
                    <p className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                      <Sparkle className="w-4 h-4 text-magenta animate-pulse" />
                      신체 주기 특징
                    </p>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed">
                      {currentStage.desc}
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    <p className="font-bold text-slate-100 text-sm sm:text-base">💡 수의사 추천 건강 관리 수칙 4가지:</p>
                    <ul className="space-y-3 text-xs sm:text-sm font-medium">
                      {currentStage.tips.map((tip, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start">
                          <CheckCircle className="w-4 h-5 shrink-0 text-magenta mt-0.5" />
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 주의사항 */}
                <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl text-slate-400 text-xs leading-relaxed space-y-1.5">
                  <p className="font-bold text-slate-200 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-magenta" />
                    잠깐! 알고 계셨나요?
                  </p>
                  <p>
                    반려동물의 시간은 인간보다 약 5~7배 빠르게 흘러갑니다. 
                    특히 대형견은 소형견보다 몸집이 크고 신진대사가 달라 노화 진행 속도가 훨씬 가파릅니다. 
                    나이에 최적화된 올바른 보조 영양제 급여와 식단 관리가 건강 수명을 최대 3년 이상 연장할 수 있습니다.
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
