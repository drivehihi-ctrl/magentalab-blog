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
  ChevronRight,
  TrendingUp
} from "lucide-react";

type PetType = "dog" | "cat";

type ThreatId = 
  | "milk_chocolate" | "dark_chocolate" | "grape" | "xylitol"
  | "onion_garlic" | "cat_chocolate" | "lilies" | "cat_grape";

interface ThreatInfo {
  id: ThreatId;
  name: string;
  icon: string;
  dangerDesc: string;
  inputUnit: string;
  unitWeightDesc: string;
}

interface SeverityLevel {
  level: "safe" | "caution" | "danger" | "critical";
  title: string;
  badgeClass: string;
  cardClass: string;
  textClass: string;
  glowClass: string;
  barColor: string;
  actionGuide: string;
}

interface EmergencyCalculatorProps {
  lang?: "ko" | "en" | "ja";
}

export default function EmergencyCalculator({ lang = "ko" }: EmergencyCalculatorProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- 핵심 상태 관리 ---
  const [petType, setPetType] = useState<PetType>("dog");
  const [breed, setBreed] = useState<string>("");
  const [weight, setWeight] = useState<string>("5.0");
  const [selectedThreat, setSelectedThreat] = useState<ThreatId>("milk_chocolate");
  const [amount, setAmount] = useState<string>("10");

  // --- 분석 출력 상태 ---
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [toxicityRatio, setToxicityRatio] = useState<number>(0);
  const [isValid, setIsValid] = useState<boolean>(true);

  // Multilingual translation dictionaries
  const dict = {
    ko: {
      title: "반려동물 중독 응급 계산기",
      desc: "강아지나 고양이가 먹지 말아야 할 독성 음식/성분을 먹었을 때, 몸무게와 유전적 특성을 고려하여 신속한 임상 위험도 및 처치 등급을 판단합니다.",
      badge: "Emergency Pet Tool v3.0",
      labelPetType: "1. 반려동물 종류 선택",
      dog: "강아지 (Dog)",
      cat: "고양이 (Cat)",
      labelBreed: "2. 품종(하위 분류) 선택",
      labelThreat: "3. 섭취한 물질(독성 성분) 선택",
      labelWeight: "현재 몸무게 (Weight)",
      labelAmount: "섭취량 (Amount)",
      weightError: "올바른 반려동물 몸무게(kg)와 섭취량(g)을 입력해 주세요.",
      btnCalculate: "즉시 응급 진단하기",
      btnAnalyzing: "실시간 독성 분석 중...",
      btnReset: "초기화",
      resultTitle: "EMERGENCY RESPONSE REPORT",
      resultIntro: "독성 판정 등급:",
      resultSub: "섭취했을 때",
      toxicityRatioChoco: "몸무게 1kg당 예상 테오브로민 검출량:",
      toxicityRatioXylitol: "몸무게 1kg당 자일리톨 예상 비율:",
      toxicityRatioOnion: "몸무게 1kg당 양파/파류 예상 비율:",
      actionGuideTitle: "상세 보호자 조치 가이드라인",
      catAlertTitle: "⚠️ 고양이 강제 구토 절대 금지 경고",
      catAlertDesc: "고양이는 해부학적 기도 구조상 보호자가 임의로 과산화수소 등을 사용하여 구토를 유발할 경우, 폐로 독극물이 넘어가 흡인성 폐렴을 초래하거나 식도에 강한 손상을 입어 즉사할 위험이 매우 높습니다. 절대로 가정 내에서 임의 구토 처치를 하지 마시고 즉시 동물병원 응급실로 방문하셔야 합니다.",
      cautionTitle: "YMYL Medical Disclaimer",
      cautionDesc: "\"본 계산기는 수의학 통계치에 기초하여 개발된 신속 자가 판단 도구이며, 개별 반려동물의 건강 상태 및 체질에 따라 소량 섭취로도 심각한 부작용이 발생할 수 있습니다. 계산 결과와 무관하게 독성 위험 성분 섭취 시 신속히 가까운 동물병원 응급실에 직접 전화하여 수의사의 전문적인 지시를 따르십시오.\"",
      loading: "반려동물 응급 계산기를 준비 중입니다...",
      unitG: "g",
      unitKg: "kg",
    },
    en: {
      title: "Pet Toxicity Emergency Calculator",
      desc: "If your cat or dog ingested toxic items, compute clinical hazard indexes and recommended responder tiers adjusted for weight and genetics.",
      badge: "Emergency Pet Tool v3.0",
      labelPetType: "1. Select Pet Type",
      dog: "Dog",
      cat: "Cat",
      labelBreed: "2. Select Breed (Genetic Profiles)",
      labelThreat: "3. Select Ingested Toxic Substance",
      labelWeight: "Current Weight",
      labelAmount: "Ingested Amount",
      weightError: "Please enter a valid weight (kg) and ingested amount (g).",
      btnCalculate: "Run Emergency Diagnosis",
      btnAnalyzing: "Analyzing Toxicity Profile...",
      btnReset: "Reset",
      resultTitle: "EMERGENCY RESPONSE REPORT",
      resultIntro: "Toxicity Rating Tier:",
      resultSub: "when ingested",
      toxicityRatioChoco: "Estimated Theobromine per kg of body weight:",
      toxicityRatioXylitol: "Estimated Xylitol ratio per kg of body weight:",
      toxicityRatioOnion: "Estimated Onion/Garlic ratio per kg of body weight:",
      actionGuideTitle: "Detailed Owner Action Guidelines",
      catAlertTitle: "⚠️ Crucial Warning: Do NOT Force Vomiting in Cats",
      catAlertDesc: "Forcing vomiting in cats via hydrogen peroxide or other methods poses severe risks of aspiration pneumonia or esophageal burns due to feline airways. Never induce vomiting at home; proceed immediately to an emergency clinic.",
      cautionTitle: "YMYL Medical Disclaimer",
      cautionDesc: "\"This calculator is a rapid screening tool based on veterinary statistics. Individual tolerance levels may vary. Regardless of results, consult a dynamic emergency vet immediately for professional clinical guidance upon ingestion of hazards.\"",
      loading: "Preparing emergency toxicity tool...",
      unitG: "g",
      unitKg: "kg",
    },
    ja: {
      title: "ペット中毒応急計算機",
      desc: "犬や猫が食べてはいけない毒性のある物質・誤食をした際、体重や遺伝的特性を考慮し、迅速に臨床リスクと緊急処置クラスを診断します。",
      badge: "Emergency Pet Tool v3.0",
      labelPetType: "1. ペットの種類の選択",
      dog: "犬 (Dog)",
      cat: "猫 (Cat)",
      labelBreed: "2. 品種（遺伝特性）の選択",
      labelThreat: "3. 誤食した物質（毒性成分）の選択",
      labelWeight: "現在の体重",
      labelAmount: "摂取量 (Amount)",
      weightError: "正しい体重(kg)と誤食量(g)を入力してください。",
      btnCalculate: "緊急診断を実行する",
      btnAnalyzing: "リアルタイム毒性分析中...",
      btnReset: "リセット",
      resultTitle: "EMERGENCY RESPONSE REPORT",
      resultIntro: "毒性判定クラス:",
      resultSub: "を誤食したとき",
      toxicityRatioChoco: "体重1kgあたりの予想テオブロミン検出量:",
      toxicityRatioXylitol: "体重1kgあたりのキシリトール予想割合:",
      toxicityRatioOnion: "体重1kgあたりのタマネギ/ネギ類予想割合:",
      actionGuideTitle: "飼い主様の詳細アクションガイドライン",
      catAlertTitle: "⚠️ 猫の強制催吐（吐かせる行為）厳禁警告",
      catAlertDesc: "猫は解剖学的な気道構造上、飼い主が自己判断で過酸化水素水などを用いて吐かせようとすると、気管や肺に毒物が入り込み誤嚥性肺炎を併発したり、食道に致命的な損傷を与え死亡する危険があります。決して自宅で処置せず、速やかに動物病院を受診してください。",
      cautionTitle: "YMYL Medical Disclaimer",
      cautionDesc: "「本計算機は、一般的な獣医学的統計データに基づいて作成された自己診断ツールです。個体差やアレルギー等により、極小量でも致命的な症状を誘発することがあります。診断結果に関わらず、危険な物質を誤食した場合は直ちにかかりつけまたは夜間救急病院の獣医師へご相談ください。」",
      loading: "ペット中毒緊急計算機をロードしています...",
      unitG: "g",
      unitKg: "kg",
    }
  };

  const t = dict[lang] || dict.ko;

  const DOG_THREATS: Record<string, ThreatInfo> = {
    milk_chocolate: {
      id: "milk_chocolate",
      name: lang === "ko" ? "밀크 초콜릿" : lang === "ja" ? "ミルクチョコレート" : "Milk Chocolate",
      icon: "🍫",
      dangerDesc: lang === "ko" 
        ? "초콜릿 내 테오브로민(Theobromine) 성분이 심장 및 중추신경계를 마비시킵니다. 밀크 초콜릿은 g당 약 2.0mg의 테오브로민이 함유되어 있습니다."
        : lang === "ja" 
        ? "チョコレートに含まれるテオブロミンが心臓と中枢神経に麻痺を誘発します。ミルクチョコレートは1gあたり約2.0mgのテオブロミンを含みます。"
        : "Theobromine in chocolate paralyzes the heart and central nervous system. Milk chocolate contains approx 2.0mg of theobromine per gram.",
      inputUnit: t.unitG,
      unitWeightDesc: lang === "ko" 
        ? "※ 얇은 판 초콜릿 1판은 약 34g, 초코파이 1개는 약 35g 입니다."
        : lang === "ja" 
        ? "※ 通常の板チョコ1枚は約34g、ココアパイ1個は約35gです。"
        : "* Standard chocolate bar is approx 34g."
    },
    dark_chocolate: {
      id: "dark_chocolate",
      name: lang === "ko" ? "다크 초콜릿" : lang === "ja" ? "ダークチョコレート" : "Dark Chocolate",
      icon: "🖤",
      dangerDesc: lang === "ko"
        ? "카카오 함량이 높아 테오브로민이 밀크 초콜릿의 7.5배 이상 함유되어 있습니다. g당 약 15.0mg 함유로 아주 소량으로도 치사량에 이릅니다."
        : lang === "ja"
        ? "カカオ含有量が高く、テオブロミンがミルクチョコの7.5倍以上含まれます。1gあたり約15.0mg含有で極少量でも致死量に達します。"
        : "Higher cacao content results in over 7.5 times the theobromine of milk chocolate (approx 15.0mg/g). Tiny amounts can be lethal.",
      inputUnit: t.unitG,
      unitWeightDesc: lang === "ko"
        ? "※ 카카오 72% 이상 다크 초콜릿 1개(조각)는 보통 약 5~8g 입니다."
        : lang === "ja"
        ? "※ カカオ72%以上のダークチョコ1かけらは約5〜8gです。"
        : "* One dark chocolate square is approx 5-8g."
    },
    grape: {
      id: "grape",
      name: lang === "ko" ? "포도 / 건포도" : lang === "ja" ? "ブドウ / レーズン" : "Grapes / Raisins",
      icon: "🍇",
      dangerDesc: lang === "ko"
        ? "포도의 미지의 성분이 급성 신부전(신장 기능 마비)을 일으킵니다. 체질에 따라 단 1알로도 요독증이 발생하여 치명적일 수 있습니다."
        : lang === "ja"
        ? "ブドウに含まれる未知の成分が急性腎不全（腎機能不全）を誘発します。個体差によっては1粒でも尿毒症になり極めて危険です。"
        : "Unknown compounds in grapes induce acute renal failure. Depending on individual sensitivity, even a single grape can cause fatal uremia.",
      inputUnit: t.unitG,
      unitWeightDesc: lang === "ko"
        ? "※ 보통 포도 1알은 약 5~8g, 건포도 1알은 약 1g 입니다."
        : lang === "ja"
        ? "※ 通常ブドウ1粒は約5〜8g、レーズン1粒は約1gです。"
        : "* Average grape is approx 5-8g, raisin is approx 1g."
    },
    xylitol: {
      id: "xylitol",
      name: lang === "ko" ? "자일리톨 (껌/캔디)" : lang === "ja" ? "キシリトール (ガム)" : "Xylitol (Gum/Candy)",
      icon: "🍬",
      dangerDesc: lang === "ko"
        ? "강아지의 인슐린 분비를 급격히 유도하여 심각한 급성 저혈당증(경련, 쇼크) 및 간 괴사(간부전)를 일으킵니다."
        : lang === "ja"
        ? "犬のインシュリン分泌を急激に刺激し、重篤な低血糖症（痙攣、ショック）や肝細胞壊死（肝不全）を引き起こします。"
        : "Triggers rapid insulin release, leading to severe acute hypoglycemia (seizures, coma) and acute hepatic necrosis.",
      inputUnit: t.unitG,
      unitWeightDesc: lang === "ko"
        ? "※ 자일리톨 껌 1알의 자일리톨 함량은 보통 약 0.5~1g 내외입니다."
        : lang === "ja"
        ? "※ キシリトールガム1粒の中身は通常約0.5〜1g程度です。"
        : "* Standard chewing gum pellet contains 0.5g to 1g of xylitol."
    }
  };

  const CAT_THREATS: Record<string, ThreatInfo> = {
    onion_garlic: {
      id: "onion_garlic",
      name: lang === "ko" ? "양파 및 파류" : lang === "ja" ? "タマネギ・ネギ類" : "Onions / Garlic",
      icon: "🧅",
      dangerDesc: lang === "ko"
        ? "양파, 파, 마늘의 알릴 프로필 디설파이드 성분이 고양이의 적혈구를 산화시켜 파괴하며, 심각한 용혈성 빈혈을 유발합니다."
        : lang === "ja"
        ? "タマネギやネギ、ニンニクに含まれるアリルプロピルジスルフィドが赤血球を酸化・破壊し、重篤な溶血性貧血を誘発します。"
        : "Allyl propyl disulfide inside onions, garlic, or chives oxidizes red blood cells, causing fatal hemolytic anemia.",
      inputUnit: t.unitG,
      unitWeightDesc: lang === "ko"
        ? "※ 고기 양념이나 국물에 들어있는 소량의 양파 즙으로도 빈혈이 발생합니다."
        : lang === "ja"
        ? "※ 肉料理のスープやソース等に含まれるごく少量のタマネギエキスでも貧血を招きます。"
        : "* Small trace amounts in soups or gravies can trigger toxic anemia."
    },
    cat_chocolate: {
      id: "cat_chocolate",
      name: lang === "ko" ? "초콜릿" : lang === "ja" ? "チョコレート" : "Chocolate",
      icon: "🍫",
      dangerDesc: lang === "ko"
        ? "테오브로민 성분에 의해 고양이에게 급성 구토, 부정맥, 발작을 유발합니다. 고양이는 쓴맛을 감지하지 못해 오섭취 시 다량 먹기 쉽습니다."
        : lang === "ja"
        ? "テオブロミン成分により猫に急性嘔吐、不整脈、発作を誘発します。猫は甘みを感じないため警戒せずに多量摂取するリスクがあります。"
        : "Theobromine triggers acute vomiting, cardiac arrhythmia, and seizures. Cats lack sweet taste buds and can easily consume toxic doses.",
      inputUnit: t.unitG,
      unitWeightDesc: lang === "ko"
        ? "※ 초콜릿 한 조각(약 5g)만으로도 몸무게 2~3kg 고양이에게 독성 반응이 옵니다."
        : lang === "ja"
        ? "※ チョコの1かけら（約5g）だけで体重2〜3kgの猫に毒性反応が現れます。"
        : "* A small 5g piece can trigger severe toxicity in a 3kg cat."
    },
    lilies: {
      id: "lilies",
      name: lang === "ko" ? "백합과 식물" : lang === "ja" ? "ユリ科の植物" : "Lilies",
      icon: "🪻",
      dangerDesc: lang === "ko"
        ? "[⚠️초응급] 백합은 잎 한 장, 꽃가루 한 톨의 극미량 섭취로도 36~72시간 내에 급성 신세뇨관 괴사 및 신부전을 유발하며 사망률이 50%를 상회합니다."
        : lang === "ja"
        ? "[⚠️超緊急] ユリは葉1枚、花粉1つといった極微量の摂取でも36〜72時間以内に急性腎不全を誘発し、致死率は50%を超えます。"
        : "[⚠️Emergency] Lily ingestion of a single leaf or pollen grain causes severe renal failure within 36-72 hours. Mortality rates exceed 50%.",
      inputUnit: lang === "ko" ? "g (또는 잎/꽃가루 개수)" : lang === "ja" ? "g（または葉/花粉の数）" : "g (or leaf count)",
      unitWeightDesc: lang === "ko"
        ? "※ 꽃병에 꽂힌 백합 꽃가루를 핥거나 물을 마시기만 해도 극도로 위험합니다."
        : lang === "ja"
        ? "※ 花瓶の水を飲むことや落ちた花粉を舐めるだけでも極めて危険です."
        : "* Drinking lily vase water or licking pollen is extremely lethal."
    },
    cat_grape: {
      id: "cat_grape",
      name: lang === "ko" ? "포도 / 건포도" : lang === "ja" ? "ブドウ / レーズン" : "Grapes / Raisins",
      icon: "🍇",
      dangerDesc: lang === "ko"
        ? "[⚠️초응급] 타르타르산 성분으로 인해 극소량으로도 고양이의 급성 신장 세포 파괴, 요독증 및 신부전 쇼크를 유발할 수 있습니다."
        : lang === "ja"
        ? "[⚠️超緊急] 酒石酸成分により極少量でも急性腎臓細胞破壊、尿毒症、腎不全ショックを引き起こす危険性があります。"
        : "[⚠️Emergency] Tartaric acid triggers acute kidney cell damage, uremia, and anaphylactic shock even in tiny quantities.",
      inputUnit: t.unitG,
      unitWeightDesc: lang === "ko"
        ? "※ 포도 한 알, 건포도 한 알이라도 절대로 먹여서는 안 됩니다."
        : lang === "ja"
        ? "※ ブドウ1粒、レーズン1粒でも絶対に与えてはいけません。"
        : "* Never feed even a single grape or raisin."
    }
  };

  const SEVERITIES: Record<string, SeverityLevel> = {
    safe: {
      level: "safe",
      title: lang === "ko" ? "안전 / 집에서 음수량 모니터링 단계 (MILD)" : lang === "ja" ? "安全 / 自宅観察推奨段階 (MILD)" : "Safe / Home Observation Stage (MILD)",
      badgeClass: "bg-emerald-500 text-white shadow-emerald-500/30",
      cardClass: "bg-emerald-950/20 border-emerald-500/30",
      textClass: "text-emerald-400",
      glowClass: "shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-500",
      barColor: "bg-emerald-500",
      actionGuide: lang === "ko"
        ? "통계적인 임상 독성 농도 이하로 추정되나, 개별 체질에 따라 가벼운 위장 장애(구토, 설사)가 발생할 수 있습니다. 당분간 아이의 컨디션을 지켜보고 충분히 수분을 섭취하도록 유도해 주세요."
        : lang === "ja"
        ? "統計的臨床中毒濃度以下と推定されますが、個体の体質により軽度の胃腸障害（嘔吐、下痢）が起こる可能性があります。安静にさせ十分な水分補給を行ってください。"
        : "Estimated below clinical toxic thresholds. However, minor gastrointestinal distress (vomiting, diarrhea) might occur. Monitor behaviors and promote hydration."
    },
    caution: {
      level: "caution",
      title: lang === "ko" ? "주의 / 수의사 유선 상담 권장 단계 (WARNING)" : lang === "ja" ? "注意 / 医師への相談推奨段階 (WARNING)" : "Caution / Veterinary Consultation (WARNING)",
      badgeClass: "bg-amber-500 text-white shadow-amber-500/30",
      cardClass: "bg-amber-950/20 border-amber-500/30",
      textClass: "text-amber-400",
      glowClass: "shadow-[0_0_20px_rgba(245,158,11,0.35)] border-amber-500 animate-pulse",
      barColor: "bg-amber-500",
      actionGuide: lang === "ko"
        ? "구토, 설사, 호흡수 증가 등 중독 증상이 발현될 수 있는 단계입니다. 섭취 후 2시간 이내라면 흡수 전 응급처치를 취할 수 있으므로, 신속히 인근 동물병원에 유선으로 내원 여부를 상담하시는 것을 추천합니다."
        : lang === "ja"
        ? "嘔吐、下痢、呼吸数の増加などの中毒症状が現れ始める可能性のある段階です。誤食後2時間以内であれば吸収前処置が可能なため、早急に最寄りの動物病院へご相談ください。"
        : "Toxicity signs like vomiting, diarrhea, or heavy breathing may occur. If within 2 hours of ingestion, decontamination is highly effective. Contact your local clinic immediately."
    },
    danger: {
      level: "danger",
      title: lang === "ko" ? "위험 / 즉각적인 병원 개입 요망 단계 (CRITICAL)" : lang === "ja" ? "危険 / 直ちに通院が必要な段階 (CRITICAL)" : "Danger / Urgent Veterinary Treatment (CRITICAL)",
      badgeClass: "bg-orange-500 text-white shadow-orange-500/30",
      cardClass: "bg-orange-950/20 border-orange-500/30",
      textClass: "text-orange-400",
      glowClass: "shadow-[0_0_22px_rgba(249,115,22,0.4)] border-orange-500",
      barColor: "bg-orange-500",
      actionGuide: lang === "ko"
        ? "생명과 직결되는 중독 현상이 본격적으로 발현될 수 있는 위험 용량입니다! 지체할 경우 심장 충격, 신부전, 용혈성 빈혈 등 돌이킬 수 없는 피해를 초래합니다. 즉시 근처 응급 진료가 가능한 동물병원으로 출발하세요."
        : lang === "ja"
        ? "生命にかかわる重篤な中毒症状が現れる危険量です。放置すると急性腎不全、溶血性貧血など回復不能な後遺症を残します。直ちに救急対応可能な動物病院へ向かってください。"
        : "Dangerous dosage prone to severe clinical poisoning. Can trigger kidney failures, heart shocks, or severe anemia. Transport your pet to an emergency hospital immediately."
    },
    critical: {
      level: "critical",
      title: lang === "ko" ? "치명 / 24시간 응급 쇼크 상태 단계 (LETHAL)" : lang === "ja" ? "致命的 / 24時間救急搬송が必要な段階 (LETHAL)" : "Lethal / Immediate Shock Emergency (LETHAL)",
      badgeClass: "bg-rose-600 text-white shadow-rose-600/30 animate-pulse",
      cardClass: "bg-rose-950/20 border-rose-500/30",
      textClass: "text-rose-400",
      glowClass: "shadow-[0_0_25px_rgba(225,29,72,0.5)] border-rose-600",
      barColor: "bg-rose-600",
      actionGuide: lang === "ko"
        ? "치사량에 도달하여 생명이 매우 급박한 극위험 단계입니다! 경련, 발작, 혼수 상태가 올 수 있습니다. 즉시 아이와 함께 먹다 남은 포장지 혹은 독성 물질 샘플을 들고 24시간 동물병원 응급실로 직행하셔야 합니다."
        : lang === "ja"
        ? "致死量に達しており、極めて生命が脅かされている段階です。痙攣、昏睡状態の恐れがあります。誤食した物質のパッケージ等を持参し、大至急24時間対応の救急動物病院へ駆け込んでください。"
        : "Lethal dose reached. Seizures, coma, or sudden cardiac arrest are imminent. Rush to a 24-hour veterinary emergency room immediately, bringing remnants of the hazard or packaging."
    }
  };

  const [resultSeverity, setResultSeverity] = useState<SeverityLevel>(SEVERITIES.safe);

  // 반려동물 타입 변경 시 성분 자동 동기화 및 초기화
  useEffect(() => {
    if (petType === "dog") {
      setSelectedThreat("milk_chocolate");
      setBreed(lang === "ko" ? "말티즈" : lang === "ja" ? "マルチーズ" : "Maltese");
    } else {
      setSelectedThreat("onion_garlic");
      setBreed(lang === "ko" ? "코리안 쇼트헤어 (믹스묘)" : lang === "ja" ? "ミックス猫 (雑種)" : "Domestic Shorthair");
    }
    setShowResult(false);
  }, [petType]);

  const triggerCalculation = async () => {
    const w = parseFloat(weight);
    const a = parseFloat(amount);

    if (isNaN(w) || w <= 0 || isNaN(a) || a < 0) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    setIsAnalyzing(true);
    setShowResult(false);

    setTimeout(async () => {
      let severity: SeverityLevel = SEVERITIES.safe;
      let ratio = 0;

      if (petType === "dog") {
        if (selectedThreat === "milk_chocolate" || selectedThreat === "dark_chocolate") {
          const theobromineFactor = selectedThreat === "milk_chocolate" ? 2.0 : 15.0;
          const totalTheobromine = a * theobromineFactor;
          ratio = Math.round((totalTheobromine / w) * 10) / 10;
          setToxicityRatio(ratio);

          if (ratio >= 100) {
            severity = SEVERITIES.critical;
          } else if (ratio >= 40) {
            severity = SEVERITIES.danger;
          } else if (ratio >= 20) {
            severity = SEVERITIES.caution;
          } else {
            severity = SEVERITIES.safe;
          }
        } else if (selectedThreat === "grape") {
          ratio = a;
          setToxicityRatio(ratio);
          if (a > 0) {
            severity = SEVERITIES.critical;
          } else {
            severity = SEVERITIES.safe;
          }
        } else if (selectedThreat === "xylitol") {
          const xylitolPerKg = a / w;
          ratio = Math.round(xylitolPerKg * 100) / 100;
          setToxicityRatio(ratio);
          if (a > 0) {
            if (xylitolPerKg >= 0.1) {
              severity = SEVERITIES.critical;
            } else {
              severity = SEVERITIES.danger;
            }
          } else {
            severity = SEVERITIES.safe;
          }
        }
      } else {
        if (selectedThreat === "onion_garlic") {
          const gPerKg = a / w;
          ratio = Math.round(gPerKg * 10) / 10;
          setToxicityRatio(ratio);
          if (a > 0) {
            if (gPerKg >= 5.0) {
              severity = SEVERITIES.critical;
            } else if (gPerKg >= 2.0) {
              severity = SEVERITIES.danger;
            } else {
              severity = SEVERITIES.caution;
            }
          } else {
            severity = SEVERITIES.safe;
          }
        } else if (selectedThreat === "cat_chocolate") {
          const totalTheobromine = a * 2.0;
          ratio = Math.round((totalTheobromine / w) * 10) / 10;
          setToxicityRatio(ratio);
          if (ratio >= 100) {
            severity = SEVERITIES.critical;
          } else if (ratio >= 60) {
            severity = SEVERITIES.danger;
          } else if (ratio >= 20) {
            severity = SEVERITIES.caution;
          } else {
            severity = SEVERITIES.safe;
          }
        } else if (selectedThreat === "lilies") {
          ratio = a;
          setToxicityRatio(ratio);
          if (a > 0) {
            severity = SEVERITIES.critical;
          } else {
            severity = SEVERITIES.safe;
          }
        } else if (selectedThreat === "cat_grape") {
          ratio = a;
          setToxicityRatio(ratio);
          if (a > 0) {
            severity = SEVERITIES.critical;
          } else {
            severity = SEVERITIES.safe;
          }
        }
      }

      setResultSeverity(severity);
      setIsAnalyzing(false);
      setShowResult(true);

      try {
        await fetch("/api/emergency-log", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pet_type: petType,
            breed: breed,
            weight: w,
            threat_id: selectedThreat,
            amount: a,
            toxicity_ratio: ratio,
            severity: severity.level
          })
        });
      } catch (err) {
        console.error("Log tracking error:", err);
      }
    }, 100);
  };

  const handleReset = () => {
    setWeight("5.0");
    setAmount("10");
    setShowResult(false);
  };

  if (!isMounted) {
    return (
      <div className="bg-slate-900 min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-magenta mx-auto"></div>
          <p className="text-slate-400 font-bold text-sm">{t.loading}</p>
        </div>
      </div>
    );
  }

  const activeThreatsList = petType === "dog" ? DOG_THREATS : CAT_THREATS;
  const activeThreatInfo = activeThreatsList[selectedThreat] || { name: "", dangerDesc: "", icon: "", unitWeightDesc: "" };

  const getGaugePercentage = () => {
    if (resultSeverity.level === "safe") return "w-1/4";
    if (resultSeverity.level === "caution") return "w-2/4";
    if (resultSeverity.level === "danger") return "w-3/4";
    return "w-full";
  };

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 relative overflow-hidden flex items-center justify-center">
      
      {/* 긴급 배경 분위기 조성 */}
      <div className="absolute top-10 right-10 w-[450px] h-[450px] rounded-full bg-rose-950/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-magenta/5 blur-[100px] pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto space-y-6 relative z-10">
        
        {/* 상단 타이틀 */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-mono tracking-widest uppercase animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t.title}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* 메인 계산기 폼 */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
          
          {/* STEP 1: 반려동물 종류 탭 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300 block">
              {t.labelPetType}
            </label>
            <div className="flex p-1.5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/5 w-full">
              <button
                type="button"
                onClick={() => setPetType("dog")}
                className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  petType === "dog"
                    ? "bg-white/15 text-white shadow-[0_4px_12px_rgba(255,255,255,0.05)] border border-white/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>🐶</span> {t.dog}
              </button>
              <button
                type="button"
                onClick={() => setPetType("cat")}
                className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  petType === "cat"
                    ? "bg-white/15 text-white shadow-[0_4px_12px_rgba(255,255,255,0.05)] border border-white/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>🐱</span> {t.cat}
              </button>
            </div>
          </div>

          {/* STEP 2: 품종 하위 분류 선택 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300 block">
              {t.labelBreed}
            </label>
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full h-14 px-4 bg-slate-900/60 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500/40 text-slate-200 font-semibold text-sm cursor-pointer"
            >
              {petType === "dog" ? (
                <>
                  <option value="Maltese">{lang === "ko" ? "말티즈" : lang === "ja" ? "マルチーズ" : "Maltese"}</option>
                  <option value="Poodle">{lang === "ko" ? "푸들" : lang === "ja" ? "プードル" : "Poodle"}</option>
                  <option value="Pomeranian">{lang === "ko" ? "포메라니안" : lang === "ja" ? "ポメラニアン" : "Pomeranian"}</option>
                  <option value="Chihuahua">{lang === "ko" ? "치와와" : lang === "ja" ? "チワワ" : "Chihuahua"}</option>
                  <option value="Shih Tzu">{lang === "ko" ? "시츄" : lang === "ja" ? "シーズー" : "Shih Tzu"}</option>
                  <option value="Golden Retriever">{lang === "ko" ? "골든 리트리버" : lang === "ja" ? "ゴールデンレトリバー" : "Golden Retriever"}</option>
                  <option value="Jindo">{lang === "ko" ? "진돗개" : lang === "ja" ? "珍島犬" : "Jindo"}</option>
                  <option value="Mixed Breed">{lang === "ko" ? "믹스견" : lang === "ja" ? "ミックス犬" : "Mixed Breed"}</option>
                  <option value="Other Dog Breed">{lang === "ko" ? "기타 견종" : lang === "ja" ? "その他の犬種" : "Other Breed"}</option>
                </>
              ) : (
                <>
                  <option value="Persian / Exotic">{lang === "ko" ? "페르시안 / 엑조틱 (유전적 다낭성 신장병 PKD 고위험군)" : lang === "ja" ? "ペルシャ / エキゾチック (PKD高リスク)" : "Persian / Exotic (High PKD risk)"}</option>
                  <option value="Maine Coon / Ragdoll">{lang === "ko" ? "메인쿤 / 렉돌 (유전적 비대성 심근증 HCM 고위험군)" : lang === "ja" ? "メインクーン / ラグドール (HCM高リスク)" : "Maine Coon / Ragdoll (High HCM risk)"}</option>
                  <option value="Siamese / Abyssinian">{lang === "ko" ? "샴 / 아비시니안 (유전적 용혈성 빈혈 소인 보유 품종)" : lang === "ja" ? "シャム / アビシニアン (溶血性貧血リスク)" : "Siamese / Abyssinian (Anemia risk)"}</option>
                  <option value="Russian Blue / British Shorthair">{lang === "ko" ? "러시안블루 / 브리티시 쇼트헤어" : lang === "ja" ? "ロシアンブルー / ブリティッシュショートヘア" : "Russian Blue / British Shorthair"}</option>
                  <option value="Domestic Shorthair">{lang === "ko" ? "코리안 쇼트헤어 (믹스묘)" : lang === "ja" ? "ミックス猫 (雑種)" : "Domestic Shorthair"}</option>
                  <option value="Other Cat Breed">{lang === "ko" ? "기타 / 혼종 묘" : lang === "ja" ? "その他の猫種" : "Other Breed"}</option>
                </>
              )}
            </select>
          </div>

          {/* STEP 3: 독성 물질 선택 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300 block">
              {t.labelThreat}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.values(activeThreatsList).map((item) => {
                const isSelected = selectedThreat === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedThreat(item.id);
                      setShowResult(false);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer h-24 ${
                      isSelected
                        ? "border-rose-600 bg-rose-950/20 text-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.2)] scale-105"
                        : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-2xl mb-1.5">{item.icon}</span>
                    <span className="text-xs font-black tracking-tight text-center leading-tight px-1">{item.name}</span>
                  </button>
                );
              })}
            </div>
            
            {activeThreatInfo.name && (
              <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl text-xs text-slate-400 leading-relaxed font-medium">
                💡 <strong className="text-slate-200">{activeThreatInfo.name} DANGER:</strong> {activeThreatInfo.dangerDesc}
              </div>
            )}
          </div>

          {/* STEP 4: 몸무게 및 섭취량 입력 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                <Weight className="w-4 h-4 text-rose-500" />
                {t.labelWeight}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => { setWeight(e.target.value); setShowResult(false); }}
                  placeholder="5.0"
                  className="w-full h-16 pl-5 pr-14 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500/40 text-slate-200 font-black text-lg"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                  {t.unitKg}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-500" />
                {t.labelAmount}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setShowResult(false); }}
                  placeholder="15"
                  className="w-full h-16 pl-5 pr-14 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500/40 text-slate-200 font-black text-lg"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                  {t.unitG}
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
              <span>{t.weightError}</span>
            </div>
          )}

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
                  {t.btnAnalyzing}
                </>
              ) : (
                <>
                  <Skull className="w-5 h-5 animate-pulse" />
                  {t.btnCalculate}
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="px-6 h-16 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl cursor-pointer border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t.btnReset}
            </button>
          </div>

          {/* 결과 표출 영역 */}
          <div
            className={`transition-all duration-500 transform ease-out ${
              showResult
                ? "opacity-100 translate-y-0 scale-100 max-h-[1200px]"
                : "opacity-0 -translate-y-4 scale-95 max-h-0 overflow-hidden pointer-events-none"
            }`}
          >
            <div className="border-t border-white/10 pt-6 space-y-6">
              
              <div className={`border rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden ${resultSeverity.cardClass} ${resultSeverity.glowClass}`}>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      {t.resultTitle}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base">
                        {t.resultIntro}
                      </span>
                    </div>
                  </div>
                  <span className={`inline-block text-xs font-black tracking-wider px-3.5 py-1.5 rounded-full ${resultSeverity.badgeClass}`}>
                    {resultSeverity.title}
                  </span>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400 font-bold px-1">
                      {lang === "ko" ? (
                        <>
                          <span>안전</span>
                          <span>주의</span>
                          <span>위험</span>
                          <span>치명</span>
                        </>
                      ) : lang === "ja" ? (
                        <>
                          <span>安全</span>
                          <span>注意</span>
                          <span>危険</span>
                          <span>致命</span>
                        </>
                      ) : (
                        <>
                          <span>Safe</span>
                          <span>Caution</span>
                          <span>Danger</span>
                          <span>Lethal</span>
                        </>
                      )}
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div className={`h-full rounded-full transition-all duration-700 ease-out ${getGaugePercentage()} ${resultSeverity.barColor}`} />
                    </div>
                  </div>

                  <div className="text-slate-300 space-y-1 font-medium text-sm sm:text-base">
                    {lang === "ko" && (
                      <p>
                        강아지/고양이 ({breed}) 무게 <strong className="text-white text-base sm:text-lg font-bold">{weight}kg</strong> 대비 {activeThreatInfo.name} <strong className="text-white text-base sm:text-lg font-bold">{amount}g</strong>을 {t.resultSub}
                      </p>
                    )}
                    {lang === "en" && (
                      <p>
                        For a {petType} ({breed}) weighing <strong className="text-white text-base sm:text-lg font-bold">{weight}kg</strong>, consuming <strong className="text-white text-base sm:text-lg font-bold">{amount}g</strong> of {activeThreatInfo.name}
                      </p>
                    )}
                    {lang === "ja" && (
                      <p>
                        ペット ({breed}) 体重 <strong className="text-white text-base sm:text-lg font-bold">{weight}kg</strong> に対して {activeThreatInfo.name} <strong className="text-white text-base sm:text-lg font-bold">{amount}g</strong> {t.resultSub}
                      </p>
                    )}
                    
                    {(selectedThreat === "milk_chocolate" || selectedThreat === "dark_chocolate" || selectedThreat === "cat_chocolate") && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-magenta" />
                        {t.toxicityRatioChoco} 
                        <strong className={`text-sm sm:text-base font-black ${resultSeverity.textClass}`}>{toxicityRatio} mg/kg</strong>
                      </p>
                    )}

                    {selectedThreat === "xylitol" && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-magenta" />
                        {t.toxicityRatioXylitol} 
                        <strong className={`text-sm sm:text-base font-black ${resultSeverity.textClass}`}>{toxicityRatio} g/kg</strong>
                      </p>
                    )}

                    {selectedThreat === "onion_garlic" && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-magenta" />
                        {t.toxicityRatioOnion} 
                        <strong className={`text-sm sm:text-base font-black ${resultSeverity.textClass}`}>{toxicityRatio} g/kg</strong>
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-rose-500" />
                      {t.actionGuideTitle}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                      {resultSeverity.actionGuide}
                    </p>
                  </div>
                </div>

              </div>

              {petType === "cat" && (
                <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-5 space-y-3 shadow-lg shadow-rose-950/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                    <p className="font-extrabold text-rose-300 text-sm tracking-wide">{t.catAlertTitle}</p>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-200 leading-relaxed font-bold">
                    {t.catAlertDesc}
                  </p>
                </div>
              )}

              <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <p className="font-bold text-slate-200 text-xs sm:text-sm uppercase tracking-wide">{t.cautionTitle}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic font-medium">
                  {t.cautionDesc}
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
