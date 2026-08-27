"use client";

import { useState, useEffect } from "react";
import { 
  Droplets, 
  Dna, 
  CupSoda, 
  AlertCircle, 
  CheckCircle2, 
  Scale, 
  RotateCcw,
  Gauge
} from "lucide-react";

interface DmCalculatorProps {
  lang?: "ko" | "en" | "ja";
}

export default function DmCalculator({ lang = "ko" }: DmCalculatorProps) {


  // --- 1. 하루 필수 음수량 계산기 상태 ---
  const [petType, setPetType] = useState<"dog" | "cat">("cat");
  const [weight, setWeight] = useState<string>("4.5");
  const [computedWater, setComputedWater] = useState<number>(0);
  const [cupCount, setCupCount] = useState<number>(0);

  // --- 2. 사료 영양 성분 (DM) 계산기 상태 ---
  const [moisture, setMoisture] = useState<string>("10");
  const [crudeProtein, setCrudeProtein] = useState<string>("28");
  const [crudeFat, setCrudeFat] = useState<string>("14");
  const [crudeAshFiber, setCrudeAshFiber] = useState<string>("8"); // 조회분 + 조섬유 합산 권장

  // 영양 성분 연산 결과
  const [dryMatterPercent, setDryMatterPercent] = useState<number>(0);
  const [dmProtein, setDmProtein] = useState<number>(0);
  const [dmFat, setDmFat] = useState<number>(0);
  const [carboPercent, setCarboPercent] = useState<number>(0); 
  const [dmCarbo, setDmCarbo] = useState<number>(0);
  const [proteinRating, setProteinRating] = useState<"low" | "standard" | "premium">("standard");

  // 계산 유효성 플래그
  const [isWaterValid, setIsWaterValid] = useState<boolean>(true);
  const [isDmValid, setIsDmValid] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"all" | "water" | "dm">("all");

  // Multilingual translation dictionaries
  const dict = {
    ko: {
      title: "영양 성분(DM) & 하루 음수량 계산기",
      desc: "사료 패키지 뒷면의 등록 성분비를 건조 질량(DM) 기준으로 정밀 환산하고, 수의학 표준 알고리즘을 통한 일일 목표 음수량을 종이컵 시각화와 함께 산출합니다.",
      tabDashboard: "종합 분석 대시보드",
      tabWater: "음수량 계산기",
      tabDm: "사료 영양(DM) 계산기",
      waterTitle: "01. 하루 필수 음수량 진단 데이터",
      waterType: "반려동물 종류",
      waterCat: "🐱 고양이 (Cat)",
      waterDog: "🐶 강아지 (Dog)",
      waterWeight: "현재 체중 입력",
      waterWeightError: "올바른 체중(0보다 큰 숫자)을 입력해 주세요.",
      dmTitle: "02. 사료 등록성분표 (영양 분석 데이터)",
      dmDesc: "* 사료 포장지 뒷면에 적혀 있는 수치(%)를 입력하세요. 수분 함량을 뺀 건물 기준으로 자동 변환됩니다.",
      dmMoisture: "수분 (%)",
      dmProtein: "조단백 (%)",
      dmFat: "조지방 (%)",
      dmAshFiber: "조회분+조섬유 (%)",
      dmError: "성분비 합산값은 100%를 초과할 수 없으며 음수값은 허용되지 않습니다.",
      reset: "설정 리셋",
      outputWaterTitle: "일일 권장 필수 음수량",
      outputCupTitle: "종이컵 환산 기준",
      outputCupDesc: "* 종이컵 1잔을 가득 채웠을 때(약 180ml)를 기초로 산정한 상대 비율 비주얼 가이드입니다.",
      outputDmPercent: "건조 건물 비율(DM)",
      outputDmCarbo: "대략적인 탄수화물(DM)",
      outputDmProtein: "실제 단백질 함량 (DM)",
      outputDmProteinMin: "최소 권장: 25%",
      outputDmProteinMax: "프리미엄 지향: 35%+",
      outputDmFat: "실제 지방 함량 (DM)",
      outputDmFatMin: "다이어트 권장: 9~15%",
      outputDmFatMax: "고에너지: 20%+",
      commentTitle: "성분 환산 코멘트",
      commentDefault: "올바른 사료 등록성분을 입력해 주시면 그에 따른 수의학 솔루션 분석 내용이 정밀하게 제공됩니다.",
      commentPremium: "고농축 단백질 사료로 활동성이 뛰어난 반려동물의 골격과 근력 형성에 매우 적합합니다. 다만 기저 신장 질환이 있는 아이는 주치의 수의사와 고단백 사료 급여 지속 여부를 조율하세요.",
      commentLow: "수분을 제외한 건물 내 단백질 비율이 수의학 최소 권장량인 30%를 하회하고 있습니다. 옥수수나 쌀 등 탄수화물 충전재 비중이 매우 높아 장기 급여 시 비만이나 당뇨병 유발 주의가 요구됩니다.",
      commentStandard: "표준 영양소 비율을 잘 충족하고 있는 일반 건강 유지식 사료입니다. 현재 영양 성분에 맞추어 정량 급여를 실시하고, 간식을 통한 추가 지방 섭취를 적절히 조절해 주세요.",
      badgeLow: "탄수화물 과다 사료 주의",
      badgePremium: "고단백 프리미엄 사료",
      badgeStandard: "균형 잡힌 성분 사료",
      loading: "계산기를 로드 중입니다...",
      labelApprox: "약",
      labelCupUnit: "잔",
    },
    en: {
      title: "Nutritional DM & Hydration Calculator",
      desc: "Accurately convert raw pet food ingredients to Dry Matter (DM) and compute daily targeted water intake based on veterinary formulas, visually displaying outcomes.",
      tabDashboard: "Integrated Dashboard",
      tabWater: "Water Intake Calculator",
      tabDm: "DM Nutrition Calculator",
      waterTitle: "01. Daily Target Hydration Data",
      waterType: "Pet Type",
      waterCat: "🐱 Cat",
      waterDog: "🐶 Dog",
      waterWeight: "Current Weight Input",
      waterWeightError: "Please enter a valid weight (number greater than 0).",
      dmTitle: "02. Guaranteed Analysis (Nutrition)",
      dmDesc: "* Input percentages shown on your pet food bag. They will be auto-calculated into Dry Matter.",
      dmMoisture: "Moisture (%)",
      dmProtein: "Crude Protein (%)",
      dmFat: "Crude Fat (%)",
      dmAshFiber: "Ash + Fiber (%)",
      dmError: "Sum of nutritional content cannot exceed 100%, and negative values are invalid.",
      reset: "Reset Settings",
      outputWaterTitle: "Recommended Daily Water Intake",
      outputCupTitle: "Paper Cup Equivalence",
      outputCupDesc: "* Visual scale calculated based on one fully filled paper cup (approx. 180ml).",
      outputDmPercent: "Dry Matter Ratio (DM)",
      outputDmCarbo: "Estimated Carbs (DM)",
      outputDmProtein: "Actual Protein (DM)",
      outputDmProteinMin: "Min Recommended: 25%",
      outputDmProteinMax: "Premium Target: 35%+",
      outputDmFat: "Actual Fat (DM)",
      outputDmFatMin: "Diet Target: 9~15%",
      outputDmFatMax: "High Energy: 20%+",
      commentTitle: "Nutritional Diagnosis Comment",
      commentDefault: "Input proper guaranteed analysis to get detailed veterinary clinical analysis.",
      commentPremium: "This high-density protein food is excellent for active pets' muscle growth. However, if your pet has pre-existing kidney conditions, consult your vet.",
      commentLow: "The dry matter protein ratio falls below the veterinary recommended minimum of 30%. High starch fillers like corn or rice might lead to obesity or diabetes.",
      commentStandard: "This food meets standard nutritional ratios for general maintenance. Regulate portion sizes and additional fat treats accordingly.",
      badgeLow: "High Carb Warning",
      badgePremium: "High Protein Premium",
      badgeStandard: "Balanced Formulation",
      loading: "Loading Calculator...",
      labelApprox: "Approx.",
      labelCupUnit: "cups",
    },
    ja: {
      title: "栄養成分(DM)＆一日飲水量計算機",
      desc: "フードの登録成分比を水分を差し引いた乾物(DM)基準で自動換算し、獣医学公式に基づいた一日の目標水分摂取量を算出して分かりやすく表示します。",
      tabDashboard: "総合分析ダッシュボード",
      tabWater: "水分摂取量計算機",
      tabDm: "フード栄養(DM)計算機",
      waterTitle: "01. 一日目標水分摂取データ",
      waterType: "ペットの種類",
      waterCat: "🐱 猫 (Cat)",
      waterDog: "🐶 犬 (Dog)",
      waterWeight: "現在の体重入力",
      waterWeightError: "正しい体重（0より大きい数値）を入力してください。",
      dmTitle: "02. フード登録成分表 (栄養分析)",
      dmDesc: "* フードのパッケージ裏面に記載されている数値(%)を入力してください。水分を除いた乾物基準で自動計算されます。",
      dmMoisture: "水分 (%)",
      dmProtein: "粗タンパク質 (%)",
      dmFat: "粗脂肪 (%)",
      dmAshFiber: "粗灰分＋粗繊維 (%)",
      dmError: "成分比の合計値は100%を超えることはできず、負の数値は無効です。",
      reset: "リセット",
      outputWaterTitle: "推奨される一日水分摂取量",
      outputCupTitle: "紙コップ換算基準",
      outputCupDesc: "* 紙コップ1杯を満たした状態（約180ml）を基準に算定した視覚ガイドです。",
      outputDmPercent: "乾物比率 (DM)",
      outputDmCarbo: "炭水化物の目安 (DM)",
      outputDmProtein: "実質タンパク質含有量 (DM)",
      outputDmProteinMin: "最低推奨: 25%",
      outputDmProteinMax: "プレミアム目標: 35%+",
      outputDmFat: "実質脂肪含有量 (DM)",
      outputDmFatMin: "ダイエット推奨: 9~15%",
      outputDmFatMax: "高エネルギー: 20%+",
      commentTitle: "成分換算コメント",
      commentDefault: "正しい成分を入力すると、獣医臨床分析コメ​​ントが詳しく表示されます。",
      commentPremium: "高濃縮タンパク質フードで、活発なペットの骨格と筋肉の形成に非常に適しています。ただし、腎疾患のあるペットはかかりつけの獣医師と相談してください。",
      commentLow: "水分を除いた乾物内のタンパク質比率が、獣医学の最低推奨量である30%を下回っています。炭水化物の充填材の比率が非常に高く、肥満や糖尿病に注意が必要です。",
      commentStandard: "標準的な栄養素比率を十分に満たしている一般健康維持食フードです。現在の栄養成分に合わせて適正な給与量を実施し、おやつでの余分な脂肪摂取を抑えてください。",
      badgeLow: "炭水化物過多注意",
      badgePremium: "高タンパク質フード",
      badgeStandard: "バランス栄養フード",
      loading: "計算機をロードしています...",
      labelApprox: "約",
      labelCupUnit: "杯",
    }
  };

  const t = dict[lang] || dict.ko;

  // 실시간 음수량 계산
  useEffect(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      setIsWaterValid(false);
      return;
    }
    setIsWaterValid(true);

    // 고양이: 50ml/kg, 강아지: 60ml/kg (활동량 고려)
    const factor = petType === "cat" ? 50 : 60;
    const totalWater = w * factor;
    setComputedWater(Math.round(totalWater));

    // 종이컵 환산 (한국 표준 종이컵 가득 채웠을 때 약 180ml 기준)
    const cups = totalWater / 180;
    setCupCount(Math.round(cups * 10) / 10);
  }, [weight, petType]);

  // 실시간 사료 DM 계산
  useEffect(() => {
    const moist = parseFloat(moisture) || 0;
    const protein = parseFloat(crudeProtein) || 0;
    const fat = parseFloat(crudeFat) || 0;
    const ashFiber = parseFloat(crudeAshFiber) || 0;

    // 모든 입력이 0이거나 유효하지 않은 비율 체크
    if (moist >= 100 || moist < 0 || protein < 0 || fat < 0 || ashFiber < 0) {
      setIsDmValid(false);
      return;
    }

    const totalInput = moist + protein + fat + ashFiber;
    if (totalInput > 100) {
      setIsDmValid(false);
      return;
    }
    setIsDmValid(true);

    // 1. 건물(Dry Matter) 비율 = 100 - 수분
    const dm = 100 - moist;
    setDryMatterPercent(dm);

    if (dm > 0) {
      // 2. 실제 단백질 DM(%) = (조단백 / DM) * 100
      const actualProtein = (protein / dm) * 100;
      setDmProtein(Math.round(actualProtein * 10) / 10);

      // 3. 실제 지방 DM(%) = (조지방 / DM) * 100
      const actualFat = (fat / dm) * 100;
      setDmFat(Math.round(actualFat * 10) / 10);

      // 4. 대략적인 탄수화물 계산 = 100 - 수분 - 단백 - 지방 - 회분/섬유
      const estimatedCarbo = Math.max(0, 100 - moist - protein - fat - ashFiber);
      setCarboPercent(Math.round(estimatedCarbo * 10) / 10);
      setDmCarbo(Math.round((estimatedCarbo / dm) * 100 * 10) / 10);

      // 5. 단백질 등급 판정
      if (actualProtein < 30) {
        setProteinRating("low");
      } else if (actualProtein >= 35) {
        setProteinRating("premium");
      } else {
        setProteinRating("standard");
      }
    } else {
      setIsDmValid(false);
    }
  }, [moisture, crudeProtein, crudeFat, crudeAshFiber]);

  const handleReset = () => {
    setPetType("cat");
    setWeight("4.5");
    setMoisture("10");
    setCrudeProtein("28");
    setCrudeFat("14");
    setCrudeAshFiber("8");
  };

  // 등급 배지 스타일 매핑
  const getRatingBadge = (rating: typeof proteinRating) => {
    switch (rating) {
      case "low":
        return {
          text: t.badgeLow,
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_12px_rgba(239,68,68,0.15)]",
          bullet: "bg-rose-400"
        };
      case "premium":
        return {
          text: t.badgePremium,
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
          bullet: "bg-emerald-400"
        };
      default:
        return {
          text: t.badgeStandard,
          bg: "bg-sky-500/10 border-sky-500/30 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.15)]",
          bullet: "bg-sky-400"
        };
    }
  };

  const ratingInfo = getRatingBadge(proteinRating);

  return (
    <div className="bg-slate-950 min-h-screen py-12 px-4 sm:px-6 relative overflow-hidden flex items-center justify-center">
      
      {/* 테크니컬 디자인용 격자 무늬 배경 장식 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* 네온 마젠타 백그라운드 오라 */}
      <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-magenta/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto space-y-8 relative z-10">
        
        {/* 상단 타이틀 헤더 */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-magenta text-xs font-mono tracking-wider">
            <Gauge className="w-3.5 h-3.5" />
            <span>NUTRITION ANALYSIS ENGINE v2.6</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t.title}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* 대시보드 탭 컨트롤 */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-900 border border-white/5 rounded-xl text-sm font-bold text-slate-400">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "all" ? "bg-magenta text-white" : "hover:text-slate-200"}`}
            >
              {t.tabDashboard}
            </button>
            <button
              onClick={() => setActiveTab("water")}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "water" ? "bg-magenta text-white" : "hover:text-slate-200"}`}
            >
              {t.tabWater}
            </button>
            <button
              onClick={() => setActiveTab("dm")}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "dm" ? "bg-magenta text-white" : "hover:text-slate-200"}`}
            >
              {t.tabDm}
            </button>
          </div>
        </div>

        {/* 대시보드 콘텐츠 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ==================== INPUT PANELS (입력 영역) ==================== */}
          <div className={`lg:col-span-6 space-y-6 ${activeTab === "dm" ? "hidden lg:block lg:col-span-12" : activeTab === "water" ? "hidden lg:block lg:col-span-12" : ""}`}>
            
            {/* CHUNK 1: 음수량 입력 카드 */}
            {(activeTab === "all" || activeTab === "water") && (
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 space-y-5 backdrop-blur-md">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Droplets className="w-5 h-5 text-magenta" />
                  <h2 className="text-base font-black text-white uppercase tracking-wider">
                    {t.waterTitle}
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* 축종 토글 */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">{t.waterType}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPetType("cat")}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                          petType === "cat"
                            ? "border-magenta bg-magenta/10 text-magenta"
                            : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        {t.waterCat}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPetType("dog")}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                          petType === "dog"
                            ? "border-magenta bg-magenta/10 text-magenta"
                            : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        {t.waterDog}
                      </button>
                    </div>
                  </div>

                  {/* 몸무게 */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5" /> {t.waterWeight}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={weight}
                        onChange={(e) => {
                          const val = e.target.value;
                          const regex = /^\d*\.?\d*$/;
                          if (regex.test(val)) setWeight(val);
                        }}
                        placeholder="예: 5.4"
                        className="w-full pl-4 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-magenta focus:border-magenta text-slate-200 font-bold text-sm"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                        kg
                      </span>
                    </div>
                    {!isWaterValid && (
                      <p className="text-[11px] text-rose-400 font-medium">{t.waterWeightError}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CHUNK 2: DM 영양성분 입력 카드 */}
            {(activeTab === "all" || activeTab === "dm") && (
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 space-y-5 backdrop-blur-md">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Dna className="w-5 h-5 text-magenta" />
                  <h2 className="text-base font-black text-white uppercase tracking-wider">
                    {t.dmTitle}
                  </h2>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-400 leading-normal">
                    {t.dmDesc}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {/* 수분 */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400">{t.dmMoisture}</label>
                      <input
                        type="number"
                        value={moisture}
                        onChange={(e) => setMoisture(e.target.value)}
                        placeholder="기본값 10"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-slate-200 font-bold text-sm"
                      />
                    </div>
                    {/* 조단백 */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400">{t.dmProtein}</label>
                      <input
                        type="number"
                        value={crudeProtein}
                        onChange={(e) => setCrudeProtein(e.target.value)}
                        placeholder="예: 28"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-slate-200 font-bold text-sm"
                      />
                    </div>
                    {/* 조지방 */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400">{t.dmFat}</label>
                      <input
                        type="number"
                        value={crudeFat}
                        onChange={(e) => setCrudeFat(e.target.value)}
                        placeholder="예: 14"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-slate-200 font-bold text-sm"
                      />
                    </div>
                    {/* 조회분/조섬유 */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400">{t.dmAshFiber}</label>
                      <input
                        type="number"
                        value={crudeAshFiber}
                        onChange={(e) => setCrudeAshFiber(e.target.value)}
                        placeholder="예: 8"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-slate-200 font-bold text-sm"
                      />
                    </div>
                  </div>

                  {!isDmValid && (
                    <div className="flex items-center gap-1.5 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{t.dmError}</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 font-bold transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {t.reset}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ==================== OUTPUT PANELS (결과 출력 영역) ==================== */}
          <div className={`lg:col-span-6 space-y-6 ${activeTab === "dm" ? "lg:col-span-12" : activeTab === "water" ? "lg:col-span-12" : ""}`}>
            
            {/* CHUNK 3: 음수량 진단 결과 리포트 */}
            {(activeTab === "all" || activeTab === "water") && (
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-magenta/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    OUTPUT 01 // WATER REQUIREMENT REPORT
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400 text-sm font-medium">{t.outputWaterTitle}</span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {isWaterValid ? computedWater : "--"}
                      </span>
                      <span className="text-slate-400 font-bold text-sm ml-1">ml</span>
                    </div>
                  </div>

                  {/* 종이컵 환산 시각화 게이지 */}
                  <div className="bg-slate-950 border border-white/5 rounded-xl p-4 space-y-3.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <CupSoda className="w-4 h-4 text-magenta" />
                        {t.outputCupTitle}
                      </span>
                      <span className="text-white">{t.labelApprox} {isWaterValid ? cupCount : "--"} {t.labelCupUnit}</span>
                    </div>

                    {/* 물방울/종이컵 채워지기 시각화 */}
                    <div className="flex items-center gap-2 pt-1.5 justify-center">
                      {Array.from({ length: 6 }).map((_, idx) => {
                        const score = idx + 1;
                        let fillPercentage = 0;
                        if (cupCount >= score) {
                          fillPercentage = 100;
                        } else if (cupCount > score - 1) {
                          fillPercentage = (cupCount - (score - 1)) * 100;
                        }
                        
                        return (
                          <div key={idx} className="relative w-8 h-10 border border-white/10 rounded-md bg-slate-900 overflow-hidden flex items-end justify-center">
                            <div 
                              className="w-full bg-gradient-to-t from-indigo-600 to-sky-400 transition-all duration-1000"
                              style={{ height: `${isWaterValid ? fillPercentage : 0}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 font-bold z-10 select-none">
                              {score}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-slate-500 text-center">
                      {t.outputCupDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CHUNK 4: DM 영양 분석 결과 리포트 */}
            {(activeTab === "all" || activeTab === "dm") && (
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-5 relative overflow-hidden">
                
                {/* 판정 배지 (네온 플로팅) */}
                <div className="absolute top-6 right-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-black tracking-wide ${ratingInfo.bg} transition-all`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ratingInfo.bullet}`} />
                    {ratingInfo.text}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    OUTPUT 02 // DRY MATTER NUTRITION REPORT
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 border border-white/5 p-3 rounded-xl text-center">
                      <p className="text-[10px] font-bold text-slate-400">{t.outputDmPercent}</p>
                      <p className="text-xl font-extrabold text-white mt-1">
                        {isDmValid ? `${dryMatterPercent}%` : "--"}
                      </p>
                    </div>
                    <div className="bg-slate-950/50 border border-white/5 p-3 rounded-xl text-center">
                      <p className="text-[10px] font-bold text-slate-400">{t.outputDmCarbo}</p>
                      <p className="text-xl font-extrabold text-white mt-1">
                        {isDmValid ? `${dmCarbo}%` : "--"}
                      </p>
                    </div>
                  </div>

                  {/* 바 그래프식 함량 정보 비교 */}
                  <div className="space-y-3.5 bg-slate-950 border border-white/5 rounded-xl p-4">
                    {/* 단백질 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">{t.outputDmProtein}</span>
                        <span className="text-magenta">{isDmValid ? `${dmProtein}%` : "--"}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-magenta rounded-full transition-all duration-1000"
                          style={{ width: `${isDmValid ? Math.min(100, dmProtein * 1.5) : 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>{t.outputDmProteinMin}</span>
                        <span>{t.outputDmProteinMax}</span>
                      </div>
                    </div>

                    {/* 지방 */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">{t.outputDmFat}</span>
                        <span className="text-indigo-400">{isDmValid ? `${dmFat}%` : "--"}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${isDmValid ? Math.min(100, dmFat * 2.5) : 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>{t.outputDmFatMin}</span>
                        <span>{t.outputDmFatMax}</span>
                      </div>
                    </div>
                  </div>

                  {/* 수의학 가이드 솔루션 */}
                  <div className="bg-slate-950/80 border border-white/5 p-4 rounded-xl space-y-2 text-xs leading-relaxed text-slate-400">
                    <p className="font-bold text-slate-200 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-magenta" />
                      {t.commentTitle}
                    </p>
                    {isDmValid ? (
                      proteinRating === "premium" ? (
                        <p>{t.commentPremium}</p>
                      ) : proteinRating === "low" ? (
                        <p className="text-rose-300">{t.commentLow}</p>
                      ) : (
                        <p>{t.commentStandard}</p>
                      )
                    ) : (
                      <p>{t.commentDefault}</p>
                    )}
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

