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

interface PatellaDiagnoserProps {
  lang?: "ko" | "en" | "ja";
}

export default function PatellaDiagnoser({ lang = "ko" }: PatellaDiagnoserProps) {
  const [dogSize, setDogSize] = useState<DogSize>("small");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
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

  const isInputValid = parsedAge !== null && parsedWeight !== null;

  // Multilingual Dictionaries
  const dict = {
    ko: {
      badge: "안심이 보행 증상 기반 위험도 평가 시리즈",
      title: "슬개골 탈구 & 관절 건강 위험 신호 확인 도구 🐾",
      desc: "아이의 나이, 체중, 견종 유형과 행동 증상을 유기적으로 반영하여 관절 위험 점수와 참고용 평가 리포트를 실시간으로 확인하고 맞춤 가이드를 받아보세요.",
      step1: "견종 유형을 선택해 주세요",
      smallDog: "소형견",
      smallDogDesc: "10kg 미만 (말티즈, 토이푸들 등)",
      largeDog: "중대형견",
      largeDogDesc: "10kg 이상 (리트리버, 진돗개 등)",
      step2: "나이와 몸무게를 입력해 주세요",
      labelAge: "아이의 나이",
      unitAge: "살",
      gasanAge: "관절 노화 가산점 +5점 대상",
      labelWeight: "아이의 몸무게",
      unitWeight: "kg",
      gasanWeight: "무릎 과하중 가산점 +10점 대상",
      step3: "최근 관찰된 행동 증상을 선택해 주세요 (중복 가능)",
      inputAlert: "아이의 나이와 몸무게를 정확히 입력하시면 실시간 결과 리포트가 완성됩니다.",
      btnMobileReport: "실시간 분석 리포트 보러가기",
      placeholderTitle: "위험도 참고 리포트 대기 중",
      placeholderDesc: "왼쪽 입력창에 견종 크기, 나이, 몸무게를 정확히 입력하시면 실시간 관절 분석 보고서가 자동으로 로드됩니다.",
      reportTitle: "REAL-TIME DIAGNOSIS REPORT",
      reportSub: "관절 위험도 분석",
      gaugeLabel: "종합 관절 위험 지수",
      unitPoints: "점",
      gaugeLow: "안전 (10점 미만)",
      gaugeMid: "주의 (10~24점)",
      gaugeHigh: "위험 (25점 이상)",
      breakdownTitle: "점수 획득 상세 내역",
      breakdownSymptom: "1. 증상 체크리스트",
      breakdownAge: "2. 나이 가산점",
      breakdownWeight: "3. 몸무게 가산점",
      btnReset: "다시 진단하기",
      resultGreenTitle: "이상 없음 (초록)",
      resultGreenDesc: "👍 관절 건강 상태가 양호합니다",
      resultGreenGuide: "현재 {ageVal}세인 우리 아이는 관절 상태가 매우 건강합니다. {weightVal}kg의 적정 체중을 잘 유지하고 계시네요. 소형견/중대형견 유전 질환 예방을 위해 무리한 점프만 자제시켜 주세요.",
      resultYellowTitle: "초기 관찰 단계 (노랑)",
      resultYellowDesc: "⚠️ 주의 필요! 초기 관찰 및 관리 시작 단계",
      resultYellowGuide: "주의가 필요한 초기 단계입니다. 현재 {ageVal}세로 관절 노화가 진행 중이거나, {weightVal}kg의 하중이 슬개골을 압박하고 있을 가능성이 큽니다. 높은 곳에서 뛰어내리는 행동을 즉시 금지하고 관절 집중 영양 공급을 시작해야 하는 골든타임입니다.",
      resultRedTitle: "수의사 진료 필요 고위험 (빨강)",
      resultRedDesc: "🚨 즉각적인 조치가 필요한 고위험 상태",
      resultRedGuide: "즉각적인 조치가 필요한 고위험 상태입니다! {ageVal}세의 나이와 {weightVal}kg의 몸무게는 현재 무릎 연골에 심각한 무리를 주고 있으며, 선택하신 증상들로 보아 슬개골 탈구 3기 이상 혹은 십자인대 손상이 진행 중일 확률이 매우 높습니다. 아이가 통증을 숨기고 있을 수 있으니 지체하지 말고 동물병원에서 엑스레이 검사를 받으세요.",
    },
    en: {
      badge: "Ansim-i AI Screening Series",
      title: "Patellar Luxation & Joint Health Screener 🐾",
      desc: "Evaluate joint hazard rates and view precision analysis logs adjusting dog age, weight, sizing, and symptoms in real time.",
      step1: "Select Dog Sizing Tiers",
      smallDog: "Small Dog",
      smallDogDesc: "Under 10kg (Maltese, Toy Poodle, etc.)",
      largeDog: "Medium/Large Dog",
      largeDogDesc: "10kg or over (Retriever, Jindo, etc.)",
      step2: "Enter Age and Weight",
      labelAge: "Dog's Age",
      unitAge: "yrs",
      gasanAge: "Joint aging multiplier +5 applied",
      labelWeight: "Dog's Weight",
      unitWeight: "kg",
      gasanWeight: "Knee overload multiplier +10 applied",
      step3: "Select Observed Clinical Signs (Multiple Choice)",
      inputAlert: "Please fill out age and weight to display real-time results.",
      btnMobileReport: "View Real-time Report",
      placeholderTitle: "Waiting for Diagnostic Reports",
      placeholderDesc: "Enter your dog's size, age, and weight to automatically load joint analytics report.",
      reportTitle: "REAL-TIME DIAGNOSIS REPORT",
      reportSub: "Joint Risk Analysis",
      gaugeLabel: "Aggregate Joint Risk Index",
      unitPoints: "pts",
      gaugeLow: "Safe (< 10 pts)",
      gaugeMid: "Caution (10-24 pts)",
      gaugeHigh: "Danger (25+ pts)",
      breakdownTitle: "Score Breakdown",
      breakdownSymptom: "1. Symptom Checklist",
      breakdownAge: "2. Age Multiplier",
      breakdownWeight: "3. Weight Multiplier",
      btnReset: "Reset Screener",
      resultGreenTitle: "Normal (Green)",
      resultGreenDesc: "👍 Joint health is in good condition",
      resultGreenGuide: "At {ageVal} years old, your dog's joint health is very clean. Weight is ideal at {weightVal}kg. Avoid high jumps to prevent genetic risk factor triggers.",
      resultYellowTitle: "Early Monitoring Tiers (Yellow)",
      resultYellowDesc: "⚠️ Caution! Early monitoring and care recommended",
      resultYellowGuide: "Early caution phase. Currently at {ageVal} years old, joint aging might be advancing or {weightVal}kg weight loads could compress the kneecap. Avoid high jumps and begin joint supplement interventions.",
      resultRedTitle: "High Risk - Consult Vet (Red)",
      resultRedDesc: "🚨 High risk requiring immediate veterinary care",
      resultRedGuide: "High risk status! The age of {ageVal} and {weightVal}kg weight loads are heavily straining knee cartilage. Current symptoms imply Grade 3+ patellar luxation or cruciate ligament damage. Get X-ray exams immediately as dogs mask pain.",
    },
    ja: {
      badge: "アンシムAI精密自己診断シリーズ",
      title: "膝蓋骨脱臼＆関節健康自己診断 🐾",
      desc: "愛犬の年齢、体重、犬種タイプと行動変化を総合的に分析し、関節疾患のリスクレベルと診断レポートをリアルタイムでお届けします。",
      step1: "犬種タイプを選択してください",
      smallDog: "小型犬",
      smallDogDesc: "10kg未満（マルチーズ、トイプードルなど）",
      largeDog: "中・大型犬",
      largeDogDesc: "10kg以上（レトリバー、柴犬など）",
      step2: "年齢と体重を入力してください",
      labelAge: "愛犬の年齢",
      unitAge: "歳",
      gasanAge: "関節老化加算+5点の対象",
      labelWeight: "愛犬의 体重",
      unitWeight: "kg",
      gasanWeight: "膝への負荷加算+10点の対象",
      step3: "最近見られる行動の変化をチェック（複数選択可）",
      inputAlert: "年齢と体重を正しく入力すると、リアルタイム診断レポートが表示されます。",
      btnMobileReport: "診断レポートを確認する",
      placeholderTitle: "リアルタイム診断書待機中",
      placeholderDesc: "犬種のサイズ、年齢、体重を入力すると、リアルタイム関節分析レポートが自動的に生成されます。",
      reportTitle: "REAL-TIME DIAGNOSIS REPORT",
      reportSub: "関節リスク分析",
      gaugeLabel: "総合関節リスク指数",
      unitPoints: "点",
      gaugeLow: "安全 (10点未満)",
      gaugeMid: "注意 (10〜24点)",
      gaugeHigh: "危険 (25点以上)",
      breakdownTitle: "判定スコア詳細",
      breakdownSymptom: "1. 症状チェックリスト",
      breakdownAge: "2. 年齢加算値",
      breakdownWeight: "3. 体重加算値",
      btnReset: "もう一度診断する",
      resultGreenTitle: "異常なし (緑)",
      resultGreenDesc: "👍 関절状態は極めて健康です",
      resultGreenGuide: "現在{ageVal}歳の愛犬は関節状態が非常に良好です。体重{weightVal}kgの適正体重が維持されています。遺伝性疾患予防のため無理なジャンプ等は控えさせてください。",
      resultYellowTitle: "初期観察推奨レベル (黄)",
      resultYellowDesc: "⚠️ 要注意！初期観察・ケアの開始段階",
      resultYellowGuide: "注意が必要な初期段階です。現在{ageVal}歳で関節老化が進行しているか、{weightVal}kgの体重負荷が膝蓋骨を圧迫している恐れがあります。高い場所からの飛び降りを防ぎ、関節用サプリ等の摂取を開始してください。",
      resultRedTitle: "医師の診療が必要な高リスク (赤)",
      resultRedDesc: "🚨 直ちに対処が必要な高リスク状態",
      resultRedGuide: "直ちに対処が必要な危険レベルです。{ageVal}歳の年齢と{weightVal}kgの体重は現在膝軟骨に重大な負担を与えており、膝蓋骨脱臼グレード3以上または十字靭帯損傷の疑いがあります。痛みを隠している可能性があるため、速やかに受診してください。",
    }
  };

  const t = dict[lang] || dict.ko;

  const SYMPTOMS: Symptom[] = [
    {
      id: "s1",
      text: lang === "ko" 
        ? "걸을 때 가끔 다리를 절거나 뒤로 털어내는 행동을 한다" 
        : lang === "ja" 
        ? "歩くときに時々足をひきずったり、後ろ足をピクッと蹴り上げる動作をする" 
        : "Occasionally limps or kicks/shakes one hind leg backward while walking"
    },
    {
      id: "s2",
      text: lang === "ko" 
        ? "다리를 만지면 깨갱거리며 예민하게 반응한다" 
        : lang === "ja" 
        ? "足を触るとキャンと鳴いたり、嫌がって触らせない" 
        : "Yelps or reacts defensively when you touch their hind legs"
    },
    {
      id: "s3",
      text: lang === "ko" 
        ? "산책할 때 예전보다 쉽게 지치고 주저앉는다" 
        : lang === "ja" 
        ? "お散歩のときに以前よりすぐ疲れて座り込んでしまう" 
        : "Tires easily during walks and frequently sits down to rest"
    },
    {
      id: "s4",
      text: lang === "ko" 
        ? "뒷모습을 보았을 때 다리 모양이 어색하거나 O자형이다" 
        : lang === "ja" 
        ? "後ろから見たときに歩き方が不自然だったり、足がO脚に見える" 
        : "Leg skeleton appears bow-legged (O-shape) or walk is awkward from behind"
    }
  ];

  // 실시간 다면적 위험도 점수 연산
  const { totalScore, baseScore, ageScore, weightScore } = useMemo(() => {
    if (!isInputValid) {
      return { totalScore: 0, baseScore: 0, ageScore: 0, weightScore: 0 };
    }

    const base = selectedSymptoms.length * 10;
    const ageBonus = (parsedAge ?? 0) >= 7 ? 5 : 0;

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

    if (totalScore < 10) {
      const template = t.resultGreenGuide;
      const parsedGuide = template.replace("{ageVal}", String(ageVal)).replace("{weightVal}", String(weightVal));
      return {
        level: "green" as const,
        title: t.resultGreenTitle,
        badgeClass: "bg-emerald-500 text-white shadow-emerald-500/20 border border-emerald-400/20",
        glassClass: "bg-emerald-500/5 border-emerald-500/25 shadow-emerald-500/5",
        textClass: "text-emerald-500",
        barClass: "bg-emerald-500",
        statusDesc: t.resultGreenDesc,
        actionGuide: parsedGuide
      };
    } else if (totalScore >= 10 && totalScore <= 24) {
      const template = t.resultYellowGuide;
      const parsedGuide = template.replace("{ageVal}", String(ageVal)).replace("{weightVal}", String(weightVal));
      return {
        level: "yellow" as const,
        title: t.resultYellowTitle,
        badgeClass: "bg-amber-500 text-white shadow-amber-500/20 border border-amber-400/20",
        glassClass: "bg-amber-500/5 border-amber-500/25 shadow-amber-500/5",
        textClass: "text-amber-500",
        barClass: "bg-amber-500",
        statusDesc: t.resultYellowDesc,
        actionGuide: parsedGuide
      };
    } else {
      const template = t.resultRedGuide;
      const parsedGuide = template.replace("{ageVal}", String(ageVal)).replace("{weightVal}", String(weightVal));
      return {
        level: "red" as const,
        title: t.resultRedTitle,
        badgeClass: "bg-rose-500 text-white shadow-rose-500/20 border border-rose-400/20 animate-pulse",
        glassClass: "bg-rose-500/5 border-rose-500/25 shadow-rose-500/5",
        textClass: "text-rose-500",
        barClass: "bg-rose-500",
        statusDesc: t.resultRedDesc,
        actionGuide: parsedGuide
      };
    }
  }, [isInputValid, totalScore, parsedAge, parsedWeight, dogSize, t]);

  const handleReset = () => {
    setDogSize("small");
    setAge("");
    setWeight("");
    setSelectedSymptoms([]);
    setHasInteracted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToResult = () => {
    setHasInteracted(true);
    const resultElement = document.getElementById("diagnosis-result-card");
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f9] py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-magenta/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-magenta-light/40 blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* 헤더 섹션 */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-magenta-light text-magenta text-xs font-black uppercase tracking-wider shadow-sm border border-magenta/10">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            {t.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-bold leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* 2컬럼 레이아웃 대시보드 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 좌측: 입력 카드군 */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. 견종 크기 선택 카드 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 space-y-4">
              <label className="text-base font-black text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-magenta-light text-magenta text-xs font-black">1</span>
                {t.step1}
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
                  <span className="text-sm sm:text-base">{t.smallDog}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{t.smallDogDesc}</span>
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
                  <span className="text-sm sm:text-base">{t.largeDog}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{t.largeDogDesc}</span>
                </button>
              </div>
            </div>

            {/* 2. 나이 및 몸무게 입력 카드 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 space-y-5">
              <label className="text-base font-black text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-magenta-light text-magenta text-xs font-black">2</span>
                {t.step2}
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">{t.labelAge}</span>
                    {parsedAge !== null && parsedAge >= 7 && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded font-black">
                        {t.gasanAge}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => { setAge(e.target.value); setHasInteracted(true); }}
                      placeholder="3"
                      min="0"
                      max="30"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-magenta focus:ring-1 focus:ring-magenta focus:outline-none transition-all font-bold text-gray-800 text-base"
                      style={{ minHeight: "56px" }}
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">{t.unitAge}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">{t.labelWeight}</span>
                    {parsedWeight !== null && (
                      ((dogSize === "small" && parsedWeight >= 5) || (dogSize === "large" && parsedWeight >= 25)) ? (
                        <span className="text-[10px] bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded font-black">
                          {t.gasanWeight}
                        </span>
                      ) : null
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => { setWeight(e.target.value); setHasInteracted(true); }}
                      placeholder="4.5"
                      step="0.1"
                      min="0.1"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-magenta focus:ring-1 focus:ring-magenta focus:outline-none transition-all font-bold text-gray-800 text-base"
                      style={{ minHeight: "56px" }}
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">{t.unitWeight}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 증상 체크리스트 카드 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 space-y-4">
              <label className="text-base font-black text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-magenta-light text-magenta text-xs font-black">3</span>
                {t.step3}
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

            {!isInputValid && (
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-amber-700 text-xs sm:text-sm font-bold flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                {t.inputAlert}
              </div>
            )}

            {isInputValid && (
              <button
                type="button"
                onClick={scrollToResult}
                className="lg:hidden w-full py-4.5 bg-magenta text-white font-black text-base rounded-2xl transition-all shadow-lg shadow-magenta/20 hover:bg-magenta/95 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                style={{ minHeight: "56px" }}
              >
                {t.btnMobileReport}
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </button>
            )}
          </div>

          {/* 우측: 실시간 결과 카드 */}
          <div id="diagnosis-result-card" className="lg:col-span-5 space-y-6 lg:sticky lg:top-8 scroll-mt-6">
            
            <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border backdrop-blur-xl transition-all duration-500 ${
              isInputValid 
                ? (diagnosisResult?.glassClass + " shadow-xl shadow-slate-100 bg-white/70")
                : "bg-white/40 border-dashed border-gray-300 shadow-none"
            }`}>
              
              {isInputValid && (
                <div className={`absolute -right-20 -top-20 w-44 h-44 rounded-full opacity-20 blur-3xl pointer-events-none transition-colors duration-500 ${
                  diagnosisResult?.level === "green" ? "bg-emerald-400" :
                  diagnosisResult?.level === "yellow" ? "bg-amber-400" : "bg-rose-400"
                }`} />
              )}

              {!isInputValid ? (
                <div className="py-16 px-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-3xl animate-bounce">
                    📊
                  </div>
                  <h3 className="text-lg font-black text-gray-800">
                    {t.placeholderTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 font-bold leading-relaxed max-w-xs mx-auto">
                    {t.placeholderDesc}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between gap-4 border-b border-gray-100/50 pb-5">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {t.reportTitle}
                      </p>
                      <h2 className="text-xl font-black text-gray-900 mt-1">
                        {t.reportSub}
                      </h2>
                    </div>
                    <span className={`inline-flex px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm transition-all duration-500 ${diagnosisResult?.badgeClass}`}>
                      {diagnosisResult?.title}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-gray-400">{t.gaugeLabel}</span>
                      <span className="text-2xl font-black text-gray-950 flex items-baseline gap-0.5">
                        <span className={`text-3xl transition-colors duration-500 ${diagnosisResult?.textClass}`}>
                          {totalScore}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">/ 55 {t.unitPoints}</span>
                      </span>
                    </div>
                    
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ease-out ${diagnosisResult?.barClass}`}
                        style={{ width: `${(totalScore / 55) * 100}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-1 text-[9px] font-bold text-gray-400">
                      <div className="text-left border-l border-gray-200 pl-1">{t.gaugeLow}</div>
                      <div className="text-left border-l border-gray-200 pl-1">{t.gaugeMid}</div>
                      <div className="text-left border-l border-gray-200 pl-1">{t.gaugeHigh}</div>
                    </div>
                  </div>

                  <div className="bg-white/60 rounded-2xl p-4 border border-white/60 space-y-2.5 text-xs font-bold text-gray-600">
                    <p className="text-[10px] font-black text-gray-400 tracking-wider">{t.breakdownTitle}</p>
                    <div className="flex justify-between">
                      <span>{t.breakdownSymptom} ({selectedSymptoms.length})</span>
                      <span className="text-gray-900">+{baseScore} {t.unitPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.breakdownAge} ({parsedAge} {t.unitAge})</span>
                      <span className="text-gray-900">+{ageScore} {t.unitPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.breakdownWeight} ({parsedWeight} {t.unitWeight})</span>
                      <span className="text-gray-900">+{weightScore} {t.unitPoints}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className={`text-base font-black flex items-center gap-1.5 transition-colors duration-500 ${diagnosisResult?.textClass}`}>
                      {diagnosisResult?.statusDesc}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed font-semibold whitespace-pre-line bg-white/60 p-4 rounded-2xl border border-white/40 transition-all duration-300">
                      {diagnosisResult?.actionGuide}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-4.5 bg-white hover:bg-slate-50 border border-slate-200 text-gray-500 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-sm"
                    style={{ minHeight: "56px" }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t.btnReset}
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

