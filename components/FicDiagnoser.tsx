"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  Heart, 
  Sparkles, 
  RotateCcw, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Droplets,
  Calendar,
  Frown,
  Activity,
  ArrowRight
} from "lucide-react";

interface FicDiagnoserProps {
  lang?: "ko" | "en" | "ja";
}

export default function FicDiagnoser({ lang = "ko" }: FicDiagnoserProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 입력 폼 상태 관리
  const [age, setAge] = useState<string>("3");
  const [bodyType, setBodyType] = useState<"ideal" | "overweight" | "obese">("ideal");
  const [selectedBehavior, setSelectedBehavior] = useState<string[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string[]>([]);

  // 점수 및 결과 분석 상태
  const [score, setScore] = useState<number>(0);

  // Multilingual Dictionaries
  const dict = {
    ko: {
      badge: "안심이 수석연구원의 스트레스 정밀 검진",
      title: "고양이 스트레스 및 특발성 방광염(FIC) 자가 진단기",
      desc: "고양이의 나이, 체형 정보와 최근 영역 내 환경 변화, 행동 이상 징후를 바탕으로 스트레스 누적도를 정밀 분석하고 특발성 방광염(FIC) 위험도를 판정합니다.",
      loading: "진단 프로그램을 불러오는 중입니다...",
      profileTitle: "1. 반려묘 기본 프로필",
      labelAge: "현재 나이 (만 나이)",
      unitAge: "세",
      gasanAge: "💡 7세 이상 노령묘로 방광염 유발 계수 적용 (+10점 가산)",
      labelBody: "체형 상태",
      gasanBody: "💡 비만으로 인한 대사 스트레스 유발 계수 적용 (+10점 가산)",
      bodyIdeal: "정상 체형 (Ideal)",
      bodyOverweight: "과체중 (Overweight)",
      bodyObese: "비만 체형 (Obese)",
      behaviorTitle: "2. 주요 행동 시그널 (항목당 10점)",
      behaviorSub: "💡 아이가 최근 보여주고 있는 행동 변화를 선택해 주세요.",
      envTitle: "3. 최근 3개월 내 영역 및 환경 변화 (항목당 10점)",
      envSub: "💡 영역 동물인 고양이에게 환경 변화는 매우 큰 스트레스 요인입니다.",
      btnReset: "문항 전체 초기화",
      reportTitle: "실시간 스트레스 분석",
      reportSub: "스트레스 & FIC 위험 수준",
      scoreLabel: "FIC 위험 점수",
      scoreOutOf: "/ 90점",
      adviseTitle: "안심이 수석연구원 어드바이스",
      bannerTitle: "방광염 예방의 필수 요건",
      bannerDesc: "방광염 예방의 치명적인 열쇠는 바로 수분 섭취량입니다. 우리 아이의 몸무게에 맞는 정확한 필수 물 섭취량이 궁금하시다면 아래 마젠타랩 전용 계산기로 이동해 확인해 보세요.",
      bannerBtn: "마젠타랩 영양 & 음수량 계산기로 이동하기 ➔",
      cautionTitle: "📌 고양이 FIC 자가진단 유의 사항",
      cautionDesc: "본 자가진단 프로그램은 국제 고양이의학협회(ISFM) 및 미국의 고양이 임상진료 가이드라인을 근거로 제작되었습니다. 단, 방광염은 요로 결석, 세균성 감염 등 다른 신장 비뇨기계 질환과 증상이 유사하므로, 소변을 전혀 보지 못하거나 혈뇨를 누는 응급 징후 발견 시 즉시 병원 검사를 권장합니다.",
    },
    en: {
      badge: "Ansim-i Senior Researcher's Stress Assessment",
      title: "Feline Stress & Feline Idiopathic Cystitis (FIC) Screener",
      desc: "Analyze cumulative stress indices and determine FIC hazard levels based on feline ages, physical conditions, surrounding environments, and somatic warning flags.",
      loading: "Loading diagnostic tool...",
      profileTitle: "1. Feline Profiles",
      labelAge: "Current Age",
      unitAge: "yrs",
      gasanAge: "* Over 7 yrs: Senior multiplier applied (+10 score)",
      labelBody: "Physical Condition",
      gasanBody: "* Obese: Metabolism stress multiplier applied (+10 score)",
      bodyIdeal: "Normal weight (Ideal)",
      bodyOverweight: "Overweight",
      bodyObese: "Obese",
      behaviorTitle: "2. Key Behavior Signals (+10 points per flag)",
      behaviorSub: "Select any abnormal behavior shifts seen recently.",
      envTitle: "3. Environmental Shifts in past 3 months (+10 points per flag)",
      envSub: "Environmental shifts trigger extreme stress in territorial felines.",
      btnReset: "Reset Questions",
      reportTitle: "Stress Real-time Analytics",
      reportSub: "Stress & FIC Risk Index",
      scoreLabel: "FIC Risk Score",
      scoreOutOf: "/ 90 pts",
      adviseTitle: "Ansim-i's Research Advice",
      bannerTitle: "Essential Cystitis Prevention",
      bannerDesc: "The single most critical preventative key is proper water intake. Curious about target fluid goals tailored to weight? Visit our nutrients and hydration page.",
      bannerBtn: "Go to Nutrients & Hydration Page ➔",
      cautionTitle: "📌 Important FIC Diagnostic Disclaimers",
      cautionDesc: "This diagnostic screener is constructed based on ISFM guidelines. FIC shares symptomatic overlaps with urethral stones or bacterial infections. If your pet experiences anuria or hematuria, visit an emergency clinic immediately.",
    },
    ja: {
      badge: "アンシム副所長のストレス精密検診",
      title: "猫のストレス＆特発性膀胱炎(FIC)自己診断",
      desc: "猫の年齢、体型データと最近の飼育環境の変化、行動の異変に基づいて、ストレスの蓄積度を分析し、特発性膀胱炎（FIC）のリスクレベルを判定します。",
      loading: "自己診断プログラムをロードしています...",
      profileTitle: "1. 愛猫の基本プロファイル",
      labelAge: "現在の年齢",
      unitAge: "歳",
      gasanAge: "💡 7歳以上のシニア猫は、膀胱炎誘発係数が適用されます（+10点）",
      labelBody: "体型の状態",
      gasanBody: "💡 肥満による代謝ストレス係数が適用されます（+10点）",
      bodyIdeal: "理想的な体重 (Ideal)",
      bodyOverweight: "やや肥満 (Overweight)",
      bodyObese: "肥満体型 (Obese)",
      behaviorTitle: "2. 主な行動の異変（1項目につき10点）",
      behaviorSub: "💡 最近の愛猫に見られる行動の変化をチェックしてください。",
      envTitle: "3. 最近3ヶ月以内の環境の変化（1項目につき10点）",
      envSub: "💡 縄張り動物である猫にとって、環境変化は非常に大きなストレスです。",
      btnReset: "設問のリセット",
      reportTitle: "リアルタイム・ストレス分析",
      reportSub: "ストレス＆FIC危険度",
      scoreLabel: "FIC危険値",
      scoreOutOf: "/ 90点",
      adviseTitle: "アンシム副所長のアドバイス",
      bannerTitle: "膀胱炎予防に最も必要なこと",
      bannerDesc: "膀胱炎を予防する最大の鍵は「飲水量」です。愛猫の体重に応じた正確な一日の必要水分量を計算するには、以下の計算ページで確認できます。",
      bannerBtn: "マゼンタラボの栄養・飲水量計算機へ移動 ➔",
      cautionTitle: "📌 猫のFIC自己診断に関するご留意事項",
      cautionDesc: "当ツールは国際猫医学会(ISFM)および米国猫科実務家協会のガイドラインを参考にして設計されました。膀胱炎は尿石症や細菌感染など他の泌尿器疾患と症状が類似しています。排尿がない状態や血尿がある場合は、至急動物病院を受診してください。",
    }
  };

  const t = dict[lang] || dict.ko;

  const BEHAVIOR_SIGNALS = [
    {
      id: "b1",
      label: lang === "ko" ? "화장실 외 장소에 배변 실수" : lang === "ja" ? "トイレ以外の場所での排尿ミス" : "Urinating Outside Litter Box",
      desc: lang === "ko" ? "이불, 러그, 소파 등 낯선 곳에 소변을 봅니다." : lang === "ja" ? "布団、カーペット、ソファ等のいつもと違う場所に粗相します。" : "Urines on rugs, blankets, sofas, or unusual locations."
    },
    {
      id: "b2",
      label: lang === "ko" ? "소변을 볼 때 고통스러운 울음" : lang === "ja" ? "排尿時の痛そうな鳴き声" : "Vocalizing During Urination",
      desc: lang === "ko" ? "화장실 안에서 울거나 소변을 누며 불만스러운 소리를 냅니다." : lang === "ja" ? "トイレの中で鳴いたり、不快な声を発します。" : "Cries, meows, or voices complaints while attempting to urinate."
    },
    {
      id: "b3",
      label: lang === "ko" ? "소변 감자 크기가 눈에 띄게 감소" : lang === "ja" ? "尿の塊（おしっこ玉）のサイズ減少" : "Reduced Urine Clump Size",
      desc: lang === "ko" ? "감자 크기가 평소보다 작고 뭉치는 횟수가 줄었습니다." : lang === "ja" ? "おしっこの固まりがいつもより小さく、回数も減りました。" : "Urine clumps are noticeably smaller or less frequent."
    },
    {
      id: "b4",
      label: lang === "ko" ? "아랫배 부근의 과도한 오버 그루밍" : lang === "ja" ? "下腹部付近の過度なグルーミング" : "Excessive Grooming of Lower Abdomen",
      desc: lang === "ko" ? "방광 부근의 가려움이나 통증으로 배 털이 빠질 때까지 핥습니다." : lang === "ja" ? "膀胱周辺の痒みや不快感により、下腹部の毛が抜けるまで舐め続けます。" : "Licks the groin/belly area repeatedly due to regional discomfort."
    }
  ];

  const ENVIROMENT_CHANGES = [
    {
      id: "e1",
      label: lang === "ko" ? "최근 3개월 내 이사 또는 인테리어 변경" : lang === "ja" ? "引っ越しまたは模様替え" : "Recent Move or Remodeling",
      desc: lang === "ko" ? "고양이의 영역 환경이 통째로 바뀌거나 가구가 크게 이동했습니다." : lang === "ja" ? "猫の縄張り環境が完全に変わったり、家具の配置が大きく変更されました。" : "Territory layout rearranged or absolute household change in past 3 months."
    },
    {
      id: "e2",
      label: lang === "ko" ? "동거묘 영입 또는 새로운 가족 구성원 추가" : lang === "ja" ? "新しい同居猫や同居人の登場" : "New Cohabitant (Pet/Human)",
      desc: lang === "ko" ? "새로운 동물이나 사람이 집으로 유입되어 영역 긴장감이 올라갔습니다." : lang === "ja" ? "新しい動物や人間が増えたことで、縄張り内の緊張が高まっています。" : "New animal or person introduced, intensifying territorial friction."
    },
    {
      id: "e3",
      label: lang === "ko" ? "화장실 모래 종류 변경 또는 위치 이동" : lang === "ja" ? "トイレの砂の変更、場所の移動" : "Litter Brand/Type or Box Relocation",
      desc: lang === "ko" ? "사용하던 모래가 바뀌었거나 화장실의 위치가 낯선 곳으로 변했습니다." : lang === "ja" ? "使用している猫砂が変更されたり、トイレの位置が慣れない場所へ移動されました。" : "Switching litter texture/scents or moving litter boxes to unfamiliar spots."
    },
    {
      id: "e4",
      label: lang === "ko" ? "주변의 지속적인 탁한 소음 노출" : lang === "ja" ? "継続的な騒音・振動への露出" : "Ongoing Loud Noises or Vibrations",
      desc: lang === "ko" ? "외부 공사 소리, 진동, 진공청소기 등 고양이가 무서워하는 소음에 노출됩니다." : lang === "ja" ? "近隣の工事音、振動、掃除機等、猫が恐怖を感じる騒音にさらされています。" : "Exposed to construction noise, drilling, vacuum cleaners, or machinery."
    }
  ];

  // 실시간 점수 연산
  useEffect(() => {
    let total = 0;
    total += selectedBehavior.length * 10;
    total += selectedEnvironment.length * 10;

    const numAge = parseInt(age);
    const hasAgeGasan = !isNaN(numAge) && numAge >= 7;
    const hasBodyGasan = bodyType === "obese";
    
    if (hasAgeGasan || hasBodyGasan) {
      total += 10;
    }

    setScore(total);
  }, [age, bodyType, selectedBehavior, selectedEnvironment]);

  const toggleBehavior = (id: string) => {
    setSelectedBehavior(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleEnvironment = (id: string) => {
    setSelectedEnvironment(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setAge("3");
    setBodyType("ideal");
    setSelectedBehavior([]);
    setSelectedEnvironment([]);
  };

  // 판정 단계 반환
  const getDiagnosis = () => {
    if (score < 20) {
      return {
        level: "safe",
        badge: lang === "ko" ? "정상 - 안심 단계" : lang === "ja" ? "正常 - 安心レベル" : "Normal - Low Risk",
        badgeColor: "bg-emerald-500 text-white",
        textColor: "text-emerald-800",
        bgClass: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
        glassClass: "bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5",
        desc: lang === "ko" 
          ? "현재 우리 아이의 스트레스 지수는 매우 낮고 편안한 상태입니다. 환경 관리가 아주 잘 되고 계시네요! 다만 고양이는 영역 동물이므로 미세한 변화에도 방광 건강이 무너질 수 있으니 늘 세심하게 관찰해 주세요."
          : lang === "ja"
          ? "現在、愛猫のストレス指数は非常に低く、リラックスしている状態です。環境管理がしっかりと行われていますね。ただし、猫は環境の変化に敏感なため、些細な変化でも膀胱炎を引き起こすことがあります。引き続き観察を続けてください。"
          : "The current stress index is very low and your cat seems comfortable. Great environmental management! Keep in mind cats are sensitive to territorial details; continue routine observations."
      };
    } else if (score >= 20 && score <= 49) {
      return {
        level: "warn",
        badge: lang === "ko" ? "주의 - 초기 관리 단계" : lang === "ja" ? "注意 - 初期ケアが必要なレベル" : "Caution - Early Care Tiers",
        badgeColor: "bg-amber-500 text-white",
        textColor: "text-amber-800",
        bgClass: "from-amber-500/10 to-yellow-500/10 border-amber-500/20",
        glassClass: "bg-amber-500/10 border-amber-500/20 shadow-amber-500/5",
        desc: lang === "ko"
          ? "🚨 주의가 필요한 스트레스 축적 단계입니다. 최근 발생한 환경 변화나 미세한 행동 변화가 고양이의 방광 벽(글리코사미노글리كان 층)을 자극하고 있을 가능성이 큽니다. 화장실 갯수를 늘려주시고, 강제 음수 충전을 시작해야 하는 골든타임입니다."
          : lang === "ja"
          ? "🚨 注意が必要なストレス蓄積段階です。最近生じた環境の変化やわずかな行動の変化が、猫の膀胱壁（GAG層）を刺激している可能性があります。トイレの数を増やし、自主的な飲水を促すゴールデンタイムです。"
          : "Accumulated stress warrants careful attention. Recent spatial transitions may irritate the feline bladder wall (glycosaminoglycans layer). We recommend adding litter boxes and promoting hydration immediately."
      };
    } else {
      return {
        level: "danger",
        badge: lang === "ko" ? "위험 - FIC 의심 단계" : lang === "ja" ? "危険 - FIC（特발성 방광염）疑いレベル" : "High Risk - Suspected FIC",
        badgeColor: "bg-rose-500 text-white",
        textColor: "text-rose-800",
        bgClass: "from-rose-500/15 to-red-500/15 border-rose-500/20",
        glassClass: "bg-rose-500/10 border-rose-500/20 shadow-rose-500/5",
        desc: lang === "ko"
          ? "🛑 매우 위험한 고위험 상태입니다! 현재 누적된 환경 스트레스로 인해 '고양이 특발성 방광염(FIC)' 또는 요도 슬러지 폐색이 진행 중일 확률이 극도로 높습니다. 고양이가 소변을 보지 못하는 상태가 24시간 이상 지속되면 급성 신부전 및 요독증으로 생명이 위험할 수 있으니, 지체하지 말고 즉시 동물병원에서 초음파 및 엑스레이 검사를 받으세요."
          : lang === "ja"
          ? "🛑 非常に危険な高リスク状態です。蓄積された環境ストレスによって「猫特発性膀胱炎(FIC)」または尿道閉塞が進行している可能性が極めて高いです。排尿がない状態が24時間以上続くと急性腎不全や尿毒症を引き起こし致命的となります。直ちに動物病院を受診してください。"
          : "Critical high risk status! Feline Idiopathic Cystitis (FIC) or urethral obstructions may be active due to environmental stress. Inability to urinate for 24+ hours triggers acute kidney failure and uremia. Seek urgent veterinary diagnosis."
      };
    }
  };

  const diag = getDiagnosis();
  const nextCalculatorLink = lang === "ko" ? "/dm-calculator" : lang === "ja" ? "/ja/dm-calculator" : "/en/dm-calculator";

  if (!isMounted) {
    return (
      <div className="bg-slate-50 min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-magenta mx-auto"></div>
          <p className="text-slate-500 font-bold text-sm">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 상단 헤더 인트로 */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-magenta-light text-magenta text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t.title}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* 메인 콘텐츠 영역 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 좌측: 진단 검사 항목 */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-6 sm:p-8 space-y-8">
            
            {/* 기본 스펙 설정 (나이, 체형) */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-magenta" />
                {t.profileTitle}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {t.labelAge}
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      min="0"
                      max="30"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-magenta/30 focus:border-magenta text-slate-800 font-bold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">{t.unitAge}</span>
                  </div>
                  {parseInt(age) >= 7 && (
                    <span className="text-[10px] text-indigo-500 font-bold pl-1 block">{t.gasanAge}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-slate-400" />
                    {t.labelBody}
                  </label>
                  <div className="relative">
                    <select 
                      value={bodyType}
                      onChange={(e) => setBodyType(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-magenta/30 focus:border-magenta text-slate-800 font-bold appearance-none cursor-pointer"
                    >
                      <option value="ideal">{t.bodyIdeal}</option>
                      <option value="overweight">{t.bodyOverweight}</option>
                      <option value="obese">{t.bodyObese}</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</span>
                  </div>
                  {bodyType === "obese" && (
                    <span className="text-[10px] text-rose-500 font-bold pl-1 block">{t.gasanBody}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 행동 요인 체크 */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-magenta" />
                {t.behaviorTitle}
              </h3>
              <p className="text-xs text-slate-400 pl-1 -mt-2">{t.behaviorSub}</p>
              
              <div className="space-y-3">
                {BEHAVIOR_SIGNALS.map((item) => {
                  const isChecked = selectedBehavior.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleBehavior(item.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer ${
                        isChecked 
                          ? "border-magenta bg-magenta-light/20 text-slate-800 shadow-md shadow-magenta/5" 
                          : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 text-slate-600"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isChecked ? "bg-magenta border-magenta text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isChecked && <span className="text-xs font-black">✓</span>}
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-sm sm:text-base block">{item.label}</span>
                        <span className="text-xs text-slate-400 block font-medium leading-relaxed">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 환경 요인 체크 */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-magenta" />
                {t.envTitle}
              </h3>
              <p className="text-xs text-slate-400 pl-1 -mt-2">{t.envSub}</p>

              <div className="space-y-3">
                {ENVIROMENT_CHANGES.map((item) => {
                  const isChecked = selectedEnvironment.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleEnvironment(item.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer ${
                        isChecked 
                          ? "border-magenta bg-magenta-light/20 text-slate-800 shadow-md shadow-magenta/5" 
                          : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 text-slate-600"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isChecked ? "bg-magenta border-magenta text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isChecked && <span className="text-xs font-black">✓</span>}
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-sm sm:text-base block">{item.label}</span>
                        <span className="text-xs text-slate-400 block font-medium leading-relaxed">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 초기화 버튼 */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 font-bold transition-all cursor-pointer bg-none border-none outline-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.btnReset}
              </button>
            </div>

          </div>

          {/* 우측: 결과 리포트 */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 글래스모피즘 진단 카드 */}
            <div className={`rounded-3xl border shadow-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-500 bg-gradient-to-br ${diag.bgClass}`}>
              
              <div className="absolute top-0 right-0 w-56 h-56 bg-white/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-4000" />
              
              <div className="relative z-10 space-y-6">
                <div>
                  <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t.reportTitle}</h3>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-2xl font-black text-slate-850">
                      {t.reportSub}
                    </span>
                  </div>
                </div>

                {/* 실시간 연산 점수 보드 */}
                <div className="bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-2xl text-center space-y-3 shadow-inner">
                  <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest block">{t.scoreLabel}</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">
                      {score}
                    </span>
                    <span className="text-slate-500 font-extrabold text-base">{t.scoreOutOf}</span>
                  </div>
                  
                  <div className="flex justify-center pt-1">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-sm ${diag.badgeColor}`}>
                      {diag.badge}
                    </span>
                  </div>
                </div>

                {/* 닥스훈트 안심이 연구원 어드바이스 말풍선 */}
                <div className="space-y-3 bg-white/60 backdrop-blur-md border border-white/50 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 border-b border-white/60 pb-2.5">
                    <div className="w-7 h-7 bg-magenta text-white font-extrabold text-sm rounded-full flex items-center justify-center shadow-md shadow-magenta/10">
                      🐶
                    </div>
                    <span className="font-extrabold text-xs text-slate-800">{t.adviseTitle}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-bold">
                    {diag.desc}
                  </p>
                </div>

              </div>
            </div>

            {/* 수분 섭취량 유도 징검다리 배너 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-magenta">
                <Droplets className="w-5 h-5 animate-bounce" />
                <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">{t.bannerTitle}</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                {t.bannerDesc}
              </p>
              
              <Link 
                href={nextCalculatorLink}
                className="w-full flex items-center justify-between py-4 px-5 bg-gradient-to-r from-magenta to-pink-600 text-white rounded-2xl shadow-lg shadow-magenta/15 hover:shadow-xl transition-all font-black text-xs sm:text-sm active:scale-95 cursor-pointer group"
              >
                <span>{t.bannerBtn}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* 주의 사항 고지 */}
            <div className="bg-slate-50 border border-slate-200/50 p-4.5 rounded-2xl text-slate-500 text-[11px] leading-relaxed space-y-1">
              <p className="font-extrabold text-slate-700">{t.cautionTitle}</p>
              <p>{t.cautionDesc}</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
