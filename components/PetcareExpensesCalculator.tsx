"use client";

import { useState, useMemo } from "react";
import { 
  RotateCcw, 
  Sparkles, 
  Info,
  PiggyBank,
  Coffee,
  Calendar,
  CheckCircle2
} from "lucide-react";

type PetType = "dog_small" | "dog_medium" | "dog_large" | "cat";
type FoodGrade = "normal" | "premium" | "medical";
type CareType = "shop" | "home";

// 생후 개월수 및 나이 연산 기준일 (현재: 2026년 6월)
const CURRENT_YEAR = 2026;
const CURRENT_MONTH = 6;

// 국가별/축종별 실질 시장 물가 (사료, 위생용품, 미용, 초기용품 정착비 반영)
const getBaseDefaults = (locale: string) => {
  if (locale === "en") {
    // 미국 시장 실질 물가 (USD 기준)
    return {
      dog_small: {
        food: { normal: 40, premium: 80, medical: 120 },
        hygiene: 30,
        care: { shop: 80, home: 15 },
        initCost: 600
      },
      dog_medium: {
        food: { normal: 55, premium: 110, medical: 160 },
        hygiene: 35,
        care: { shop: 100, home: 15 },
        initCost: 600
      },
      dog_large: {
        food: { normal: 80, premium: 160, medical: 240 },
        hygiene: 40,
        care: { shop: 140, home: 15 },
        initCost: 1200
      },
      cat: {
        food: { normal: 40, premium: 80, medical: 120 },
        hygiene: 30,
        care: { shop: 75, home: 15 },
        initCost: 600
      }
    };
  } else if (locale === "ja") {
    // 일본 시장 실질 물가 (JPY 기준)
    return {
      dog_small: {
        food: { normal: 4000, premium: 8000, medical: 12000 },
        hygiene: 3000,
        care: { shop: 6000, home: 1000 },
        initCost: 50000
      },
      dog_medium: {
        food: { normal: 5000, premium: 10000, medical: 15000 },
        hygiene: 3500,
        care: { shop: 8000, home: 1000 },
        initCost: 50000
      },
      dog_large: {
        food: { normal: 7500, premium: 15000, medical: 22000 },
        hygiene: 4000,
        care: { shop: 12000, home: 1000 },
        initCost: 100000
      },
      cat: {
        food: { normal: 4000, premium: 8000, medical: 12000 },
        hygiene: 3000,
        care: { shop: 7000, home: 1000 },
        initCost: 50000
      }
    };
  } else {
    // 한국 시장 실질 물가 (KRW 기준)
    return {
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
  }
};

interface PetcareExpensesCalculatorProps {
  lang?: "ko" | "en" | "ja";
}

export default function PetcareExpensesCalculator({ lang = "ko" }: PetcareExpensesCalculatorProps) {
  const [petType, setPetType] = useState<PetType>("dog_small");
  
  // 나이 입력 모드: "direct" (직접 입력) | "birth" (출생연월 선택)
  const [ageMode, setAgeMode] = useState<"direct" | "birth">("direct");
  const [age, setAge] = useState<string>("3");
  const [birthYear, setBirthYear] = useState<string>("2023");
  const [birthMonth, setBirthMonth] = useState<string>("6");
  
  // 예상 수명 (기본값 15세, 슬라이더 조절)
  const [lifespan, setLifespan] = useState<number>(15);

  // 로케일 기반 기본 물가 테이블 로드
  const DEFAULTS = useMemo(() => getBaseDefaults(lang), [lang]);

  // 식비 등급 및 비용 (로케일별 초기값 동적 바인딩)
  const [foodGrade, setFoodGrade] = useState<FoodGrade>("premium");
  const [foodCost, setFoodCost] = useState<number>(DEFAULTS.dog_small.food.premium);

  // 위생용품비 (로케일별 초기값 동적 바인딩)
  const [hygieneCost, setHygieneCost] = useState<number>(DEFAULTS.dog_small.hygiene);

  // 미용/케어
  const [careType, setCareType] = useState<CareType>("shop");
  const [careCost, setCareCost] = useState<number>(DEFAULTS.dog_small.care.shop);

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

  // Multilingual Dictionaries (한글 혼입 완벽 디버깅 버전)
  const dict = {
    ko: {
      badge: "안심 연구원 지출 분석 리포트",
      title: "반려동물 평생 양육비 & 월간 유지비 계산기 💰",
      desc: "나이대별 수의학 예방접종 예시 비용과 생애 의료비 시뮬레이션을 탑재하여 우리 아이 맞춤형 한 달 고정 유지비와 평생 지출의 비용 분석서를 실시간 확인하세요.",
      labelSelectType: "축종 및 반려동물 크기 선택",
      dogSmall: "소형견",
      dogSmallDesc: "10kg 미만",
      dogMedium: "중형견",
      dogMediumDesc: "10~25kg",
      dogLarge: "대형견",
      dogLargeDesc: "25kg 이상",
      cat: "고양이",
      catDesc: "반려묘 전체",
      labelAgeSetup: "나이 및 예상 수명 설정",
      ageModeDirect: "나이 직접 입력",
      ageModeBirth: "출생연월 선택",
      labelAgeDirect: "현재 나이 입력",
      unitAge: "살",
      labelBirthYear: "출생 연도",
      unitYear: "년",
      labelBirthMonth: "출생 월",
      unitMonth: "월",
      neuteredQuestion: "👶 1세 미만 기초 접종기에 중성화 수술을 하였거나 할 예정인가요?",
      labelTargetLifespan: "목표 예상 수명",
      unitLifespan: "세",
      labelExpensesSetup: "월간 고정 생활 지출비 조율",
      labelFoodQuality: "식사 사료/간식 품질",
      foodNormal: "일반형",
      foodPremium: "프리미엄",
      foodMedical: "처방식/생식",
      unitWon: "원",
      unitWonDesc: "원 기준",
      sliderFoodLabel: "식사 및 간식비 (월)",
      sliderHygieneLabel: "위생 용품비 (배변패드, 고양이 모래 등 / 월)",
      unitTenThousand: "만 원",
      labelCareType: "미용 및 위생 관리 방식",
      careShop: "전문 미용숍 케어",
      careShopDesc: "월 1회 전문점 목욕/미용",
      careHome: "홈케어 위주",
      careHomeDesc: "셀프 목욕 및 기본 위생케어",
      sliderCareLabel: "미용 및 케어 관리비 (월)",
      reportTitle: "지출 분석 리포트",
      reportRealtime: "실시간 자동 갱신 ⚡",
      reportMonthlyTotal: "월간 고정 유지비",
      reportMonthlyMedical: "의료비 포함",
      reportLifetimeTotal: "평생 누적 예상 양육비",
      reportLifetimePeriod: "생애 총합 ({remainingYears}년)",
      simulationInfo: "현재 나이 {computedAge}세부터 예상 수명 {lifespan}세까지의 시뮬레이션입니다. 초기 용품 정착금({initCostText})이 추가되었습니다.",
      largeCostText: "100만 원",
      normalCostText: "50만 원",
      chartLabelMonthly: "MONTHLY",
      chartFood: "식비 및 간식",
      chartHygiene: "위생용품",
      chartCare: "미용 및 위생",
      chartMedical: "의료비 (자동)",
      calendarTitle: "올해 예방접종 예시 & 케어 달력 📅",
      calendarDesc: "현재 나이인 {computedAge}세를 기준으로, 담당 수의사 판단에 따라 주기적으로 관리되는 예방 케어 및 건강검진 예상 비용 내역입니다.",
      calendarTag: "권장",
      calendarDisclaimer: "* 예방접종 비용은 지역 및 동물병원 규모에 따라 상이할 수 있습니다. 위 일정은 일반적인 예시이며, 실제 접종 필요성과 주기 등은 아이의 종, 접종 이력, 생활 환경, 담당 수의사의 판단에 따라 달라질 수 있습니다. 시니어 전환 시점은 종, 생활환경 등에 따라 다르며, 주기적인 건강 스크리닝이 중증 의료비 부담 경감에 도움이 됩니다.",
      btnReset: "다시 계산하기",
      statDisclaimer: "농림축산식품부 2025 동물복지 국민의식조사 참고 / 실제 비용은 개체 및 생활방식에 따라 다름",
    },
    en: {
      badge: "Ansim-i Expense Assessment",
      title: "Pet Lifetime Expense & Monthly Maintenance Calculator 💰",
      desc: "Simulate lifetime medical fees and recommended veterinary vaccinations. View real-time diagnostics of monthly spending and total lifetime investments.",
      labelSelectType: "Select Pet Type & Sizing",
      dogSmall: "Small Dog",
      dogSmallDesc: "Under 10kg",
      dogMedium: "Medium Dog",
      dogMediumDesc: "10 to 25kg",
      dogLarge: "Large Dog",
      dogLargeDesc: "Over 25kg",
      cat: "Cat",
      catDesc: "All Cats",
      labelAgeSetup: "Set Age & Lifespan",
      ageModeDirect: "Direct Input",
      ageModeBirth: "Birth Month/Year",
      labelAgeDirect: "Enter Age",
      unitAge: "yrs",
      labelBirthYear: "Birth Year",
      unitYear: "",
      labelBirthMonth: "Birth Month",
      unitMonth: "",
      neuteredQuestion: "👶 Has your pet under 1 yr been spayed/neutered or planned to be?",
      labelTargetLifespan: "Target Lifespan",
      unitLifespan: "yrs",
      labelExpensesSetup: "Adjust Monthly Living Expenses",
      labelFoodQuality: "Food / Treats Grade",
      foodNormal: "Standard",
      foodPremium: "Premium",
      foodMedical: "Medical/Raw",
      unitWon: "",
      unitWonDesc: "",
      sliderFoodLabel: "Food & Treats (Monthly)",
      sliderHygieneLabel: "Hygiene Supplies (Pads, Litter, etc. / Monthly)",
      unitTenThousand: "",
      labelCareType: "Grooming & Hygiene Care Style",
      careShop: "Professional Salon Care",
      careShopDesc: "Salon bath/cut once a month",
      careHome: "Home Care Oriented",
      careHomeDesc: "Self baths and basic hygiene care",
      sliderCareLabel: "Grooming & Care Expense (Monthly)",
      reportTitle: "Financial Analysis Report",
      reportRealtime: "Live Updated ⚡",
      reportMonthlyTotal: "Monthly Maintenance Cost",
      reportMonthlyMedical: "Incl. medical simulator",
      reportLifetimeTotal: "Est. Cumulative Lifetime Cost",
      reportLifetimePeriod: "Total for {remainingYears} yrs",
      simulationInfo: "Simulated from current age {computedAge} to lifespan {lifespan}. Initial equipment fees ({initCostText}) are added.",
      largeCostText: "$600",
      normalCostText: "$300",
      chartLabelMonthly: "MONTHLY",
      chartFood: "Food & Treats",
      chartHygiene: "Hygiene Pads/Litter",
      chartCare: "Grooming & Care",
      chartMedical: "Medical (Simulated)",
      calendarTitle: "Recommended Veterinary Vaccine & Care Calendar 📅",
      calendarDesc: "Recommended medical screening schedules and vaccines tailored for your pet at {computedAge} years old.",
      calendarTag: "Recommended",
      calendarDisclaimer: "* Vaccine fees vary depending on location and clinics. Regular checkups for senior pets (7+ yrs) prevent sudden heavy medical costs.",
      btnReset: "Reset Calculator",
      statDisclaimer: "Reference: MAFRA 2025 Animal Welfare Survey / Actual costs vary by individual and lifestyle",
    },
    ja: {
      badge: "アンシム経費診断レポート",
      title: "ペットの生涯飼育費＆月間維持費計算機 💰",
      desc: "年齢別の獣医学적필수예방접종비용과생애의료비시뮬레이션을組み込み、愛犬・愛猫に合わせた月간코스트와생애총액의진단레포트를제시합니다.",
      labelSelectType: "動物の種類とサイズを選択",
      dogSmall: "小型犬",
      dogSmallDesc: "10kg未満",
      dogMedium: "中型犬",
      dogMediumDesc: "10〜25kg",
      dogLarge: "大型犬",
      dogLargeDesc: "25kg以上",
      cat: "猫",
      catDesc: "猫全般",
      labelAgeSetup: "年齢＆予想寿命の設定",
      ageModeDirect: "年齢を直接入力",
      ageModeBirth: "誕生年月を選択",
      labelAgeDirect: "現在の年齢を入力",
      unitAge: "歳",
      labelBirthYear: "誕生年",
      unitYear: "年",
      labelBirthMonth: "誕生月",
      unitMonth: "月",
      neuteredQuestion: "👶 1歳未満의기초접종기에避妊・去勢手術を行いましたか？（予定含む）",
      labelTargetLifespan: "目標とする予想寿命",
      unitLifespan: "歳",
      labelExpensesSetup: "月間固定生活費의조정",
      labelFoodQuality: "食事・おやつの品質",
      foodNormal: "スタンダード",
      foodPremium: "プレミアム",
      foodMedical: "療法食/生食",
      unitWon: "",
      unitWonDesc: "",
      sliderFoodLabel: "食事・おやつ代（月）",
      sliderHygieneLabel: "衛生用品代（トイレシート、猫砂など / 月）",
      unitTenThousand: "",
      labelCareType: "トリミング・ケア方法",
      careShop: "サロンでのトリミング",
      careShopDesc: "月1回サロンでシャンプー・カット",
      careHome: "自宅でのセルフケア",
      careHomeDesc: "自宅でシャンプーや基本ケア",
      sliderCareLabel: "トリミング・ケア代（月）",
      reportTitle: "飼育費分析レポート",
      reportRealtime: "リアルタイム自動更新 ⚡",
      reportMonthlyTotal: "月間の維持費",
      reportMonthlyMedical: "医療費込み",
      reportLifetimeTotal: "生涯累計의추정사육비",
      reportLifetimePeriod: "生涯計（残り{remainingYears}年）",
      simulationInfo: "現在の年齢{computedAge}歳から寿命{lifespan}歳までのシミュレーションです。初期の飼育ケージ・用品代（{initCostText}）が追加されました。",
      largeCostText: "約5万円",
      normalCostText: "約10万円",
      chartLabelMonthly: "MONTHLY",
      chartFood: "フード・おやつ",
      chartHygiene: "トイレ・衛生用品",
      chartCare: "ケア・トリミング",
      chartMedical: "医療費（自動計算）",
      calendarTitle: "今年の必須予防接種＆ケアカレンダー 📅",
      calendarDesc: "現在の年齢{computedAge}歳時点で推奨される獣医学적케어항목및건강검진비용의목표입니다.",
      calendarTag: "推奨",
      calendarDisclaimer: "* 予防接種などの費用は地域や動物病院によって異なる場合があります。7歳以上の高齢期は定期的検査を受けることで、急な医療費負担を防げます。",
      btnReset: "もう一度計算する",
      statDisclaimer: "出典: 農林畜産食品部 2025 動物福祉国民意識調査 / 実際の費用は個体や生活様式により異なります",
    }
  };

  // 일본어 딕셔너리 내 한글 섞임 현상 정밀 정정 완료
  dict.ja.desc = "年齢別の獣医学的必須予防接種費用と生涯医療費シミュレーションを組み込み、愛犬・愛猫に合わせた月間コストと生涯総額の診断レポートを提示します。";
  dict.ja.neuteredQuestion = "👶 1歳未満の基礎接種期に避妊・去勢手術を行いましたか？（予定含む）";
  dict.ja.labelExpensesSetup = "月間固定生活費の調整";
  dict.ja.reportLifetimeTotal = "生涯累計の推定飼育費";
  dict.ja.calendarDesc = "現在の年齢{computedAge}歳時点で推奨される獣医学的ケア項目および健康診断費用の目安です。";

  const t = dict[lang] || dict.ko;

  // 로케일별 실질 화폐 심볼 및 포맷터 함수
  const formatCurrency = (amount: number) => {
    if (lang === "en") {
      return `$${amount.toLocaleString()}`;
    } else if (lang === "ja") {
      return `¥${amount.toLocaleString()}`;
    } else {
      return `${amount.toLocaleString()}원`;
    }
  };

  // 슬라이더 눈금 범위 및 라벨의 로케일별 정밀 조율
  const sliderConfig = useMemo(() => {
    if (lang === "en") {
      return {
        food: { min: 10, max: 350, step: 5 },
        hygiene: { min: 10, max: 80, step: 2, ticks: ["$10", "$45", "$80"] },
        care: { min: 0, max: 250, step: 5 }
      };
    } else if (lang === "ja") {
      return {
        food: { min: 1000, max: 35000, step: 500 },
        hygiene: { min: 1000, max: 8000, step: 200, ticks: ["¥1,000", "¥4,500", "¥8,000"] },
        care: { min: 0, max: 25000, step: 500 }
      };
    } else {
      return {
        food: { min: 10000, max: 400000, step: 5000 },
        hygiene: { min: 20000, max: 50000, step: 2000, ticks: ["2만 원", "3.5만 원", "5만 원"] },
        care: { min: 0, max: 250000, step: 5000 }
      };
    }
  }, [lang]);

  // 축종/크기 변경 시 권장 및 기본 고정값 동기화
  const handlePetTypeChange = (type: PetType) => {
    setPetType(type);
    const defaults = DEFAULTS[type];
    setFoodCost(defaults.food[foodGrade]);
    setHygieneCost(defaults.hygiene);
    setCareCost(defaults.care[careType]);
  };

  // 식비 등급 변경 시 디폴트 바인딩
  const handleFoodGradeChange = (grade: FoodGrade) => {
    setFoodGrade(grade);
    setFoodCost(DEFAULTS[petType].food[grade]);
  };

  // 미용 타입 변경 시 디폴트 바인딩
  const handleCareTypeChange = (type: CareType) => {
    setCareType(type);
    setCareCost(DEFAULTS[petType].care[type]);
  };

  // 수의학 기준 생애주기별 의료비 상수 연산 시뮬레이션 (국가별 실질 의료 물가 반영)
  const medicalCalculation = useMemo(() => {
    const isDog = petType !== "cat";
    let lifetimeMedical = 0;
    
    // 국가별 연도별 의료비 평균 책정
    const getYearlyMedicalCost = (age: number) => {
      if (lang === "en") {
        // 미국 의료비 (USD 기준)
        if (age < 1) return (isDog ? 400 : 300) + (isSpayed ? 250 : 0);
        if (age < 7) return 350;
        return 700;
      } else if (lang === "ja") {
        // 일본 의료비 (JPY 기준)
        if (age < 1) return (isDog ? 40000 : 30000) + (isSpayed ? 25000 : 0);
        if (age < 7) return 35000;
        return 70000;
      } else {
        // 한국 의료비 (KRW 기준)
        if (age < 1) return (isDog ? 350000 : 250000) + (isSpayed ? 200000 : 0);
        if (age < 7) return 300000;
        return 600000;
      }
    };

    for (let current = computedAge; current < lifespan; current++) {
      lifetimeMedical += getYearlyMedicalCost(current);
    }

    const monthlyMedical = Math.round(getYearlyMedicalCost(computedAge) / 12);

    return {
      lifetimeMedical,
      monthlyMedical
    };
  }, [petType, computedAge, lifespan, isSpayed, lang]);

  // 지출 최종 연산
  const remainingYears = useMemo(() => {
    return Math.max(1, lifespan - computedAge);
  }, [lifespan, computedAge]);

  const monthlyTotal = useMemo(() => {
    return foodCost + hygieneCost + careCost + medicalCalculation.monthlyMedical;
  }, [foodCost, hygieneCost, careCost, medicalCalculation.monthlyMedical]);

  const lifetimeTotal = useMemo(() => {
    const initialCost = DEFAULTS[petType].initCost;
    const lifetimeNonMedical = (foodCost + hygieneCost + careCost) * 12 * remainingYears;
    return lifetimeNonMedical + medicalCalculation.lifetimeMedical + initialCost;
  }, [petType, foodCost, hygieneCost, careCost, remainingYears, medicalCalculation.lifetimeMedical, DEFAULTS]);

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

  // 나이대별 예방접종 예시 달력 데이터 바인딩 (실제 미국, 일본, 한국 병원비 스케일 반영)
  const vaccinationSchedule = useMemo(() => {
    const isDog = petType !== "cat";
    
    // 로케일별 의료비용 상수 가져오기
    const getVaccineCost = (key: string) => {
      const costs: Record<"ko" | "en" | "ja", Record<string, number>> = {
        ko: { dhppl: 150000, kennel: 80000, rabies: 120000, titer: 50000, spay: 200000, fvrcp: 100000, felv: 50000, annual_booster: 40000, annual_rabies: 60000, annual_parasite: 200000, silver_cbc: 200000, silver_echo: 250000, silver_vaccine: 50000, silver_parasite: 100000 },
        en: { dhppl: 180, kennel: 90, rabies: 130, titer: 60, spay: 250, fvrcp: 120, felv: 60, annual_booster: 50, annual_rabies: 70, annual_parasite: 240, silver_cbc: 250, silver_echo: 300, silver_vaccine: 60, silver_parasite: 120 },
        ja: { dhppl: 15000, kennel: 8000, rabies: 12000, titer: 5000, spay: 20000, fvrcp: 10000, felv: 5000, annual_booster: 4000, annual_rabies: 6000, annual_parasite: 20000, silver_cbc: 20000, silver_echo: 25000, silver_vaccine: 5000, silver_parasite: 10000 }
      };
      return costs[lang]?.[key] || costs.ko[key];
    };

    if (computedAge < 1) {
      return {
        stageName: lang === "ko" ? "기초 접종기 (1세 미만 베이비)" : lang === "ja" ? "基礎接種期 (1歳未満ベビー)" : "Primary Vaccine Stage (<1 yr)",
        desc: lang === "ko" 
          ? "면역 형성을 위한 첫 접종 단계로 평생 건강을 결정하는 가장 중요한 시기입니다." 
          : lang === "ja" 
          ? "免疫形成のための最初期ワクチン期間で、一生の健康状態を決定付ける極めて重要な時期です。" 
          : "Initial vaccinations for immune development. Critical stage that outlines lifelong wellness.",
        items: isDog ? [
          { 
            name: lang === "ko" ? "DHPPL 종합백신 (1~5차)" : lang === "ja" ? "DHPPL混合ワクチン (1〜5回)" : "DHPPL Core Vaccine (Doses 1-5)", 
            period: lang === "ko" ? "생후 6~14주 (2주 간격)" : lang === "ja" ? "生後6〜14週 (2週間隔)" : "6-14 weeks old (2-wk interval)", 
            cost: getVaccineCost("dhppl"), 
            detail: lang === "ko" ? "홍역, 간염, 파보바이러스 등 필수 치명적 전염병 전방위 예방" : lang === "ja" ? "ジステンパー、肝炎、パボウイルス等の主要感染症予防" : "Immunization for distemper, infectious hepatitis, parvo, etc." 
          },
          { 
            name: lang === "ko" ? "코로나 장염 & 켄넬코프 백신" : lang === "ja" ? "コロナ腸炎＆ケンネルコフ" : "Coronavirus Enteritis & Kennel Cough", 
            period: lang === "ko" ? "생후 8~12주" : lang === "ja" ? "生後8〜12週" : "8-12 weeks old", 
            cost: getVaccineCost("kennel"), 
            detail: lang === "ko" ? "단체 생활 및 산책 시 호흡기/소화기 바이러스 완벽 방어" : lang === "ja" ? "集団活動や散歩時の呼吸器・消化器ウイルス防御" : "Defense against respiratory and digestive system viruses." 
          },
          { 
            name: lang === "ko" ? "광견병 & 신종플루(인플루엔자) 예방주사" : lang === "ja" ? "狂犬病＆犬インフルエンザ" : "Rabies & Canine Influenza", 
            period: lang === "ko" ? "생후 14~16주" : lang === "ja" ? "生後14〜16週" : "14-16 weeks old", 
            cost: getVaccineCost("rabies"), 
            detail: lang === "ko" ? "법정 인수공통 전염병 및 신종 호흡기 독감 예방" : lang === "ja" ? "法定伝染病およびインフルエンザ感染対策" : "Mandatory legal rabies shot and flu prevention." 
          },
          { 
            name: lang === "ko" ? "종합 항체가 검사" : lang === "ja" ? "抗体価検査" : "Antibody Titer Test", 
            period: lang === "ko" ? "생후 16주 이후" : lang === "ja" ? "生後16週以降" : "16 weeks old+", 
            cost: getVaccineCost("titer"), 
            detail: lang === "ko" ? "5차 접종 후 체내 면역 항체가 제대로 형성되었는지 최종 확인 검사" : lang === "ja" ? "各種ワクチン接種後に十分な抗体が作られたか確認する検査" : "Confirm whether antibodies successfully developed post-doses." 
          },
          ...(isSpayed ? [{ 
            name: lang === "ko" ? "선택형 중성화 수술" : lang === "ja" ? "避妊・去勢手術" : "Elective Spay/Neuter", 
            period: lang === "ko" ? "생후 6~8개월 권장" : lang === "ja" ? "生後6〜8ヶ月推奨" : "6-8 months old recommended", 
            cost: getVaccineCost("spay"), 
            detail: lang === "ko" ? "생식기 질환 예방 및 행동 교정을 위한 안전한 외과적 중성화" : lang === "ja" ? "生殖器疾患の予防および行動抑制のための外科的措置" : "Surgical procedures for behavior adjustments and disease prevention." 
          }] : [])
        ] : [
          { 
            name: lang === "ko" ? "고양이 종합백신 (FVRCP 1~3차)" : lang === "ja" ? "猫3種混合ワクチン (FVRCP 1〜3回)" : "FVRCP Core Feline Vaccine (Doses 1-3)", 
            period: lang === "ko" ? "생후 6~12주 (3주 간격)" : lang === "ja" ? "生後6〜12週 (3週間隔)" : "6-12 weeks old (3-wk interval)", 
            cost: getVaccineCost("fvrcp"), 
            detail: lang === "ko" ? "범백혈구감소증, 허피스, 칼리시바이러스 3대 안심 예방" : lang === "ja" ? "猫汎白血球減少症、ヘルペス、カリシウイルスの3大予防" : "Preventing panleukopenia, herpesvirus, and calicivirus." 
          },
          { 
            name: lang === "ko" ? "광견병 백신 및 필수 예방주사" : lang === "ja" ? "狂犬病ワクチン" : "Rabies Vaccine", 
            period: lang === "ko" ? "생후 12~14주" : lang === "ja" ? "生後12〜14週" : "12-14 weeks old", 
            cost: getVaccineCost("rabies"), 
            detail: lang === "ko" ? "가출 및 묘주 물림 사고 방지를 위한 의무 항체 형성 접종" : lang === "ja" ? "万が一の脱走や噛みつき事故を想定した義務予防接種" : "Compulsory immunization for outdoor exposure safety." 
          },
          { 
            name: lang === "ko" ? "종합 항체가 검사" : lang === "ja" ? "抗体価検査" : "Antibody Titer Test", 
            period: lang === "ko" ? "생후 14주 이후" : lang === "ja" ? "生後14週以降" : "14 weeks old+", 
            cost: getVaccineCost("titer"), 
            detail: lang === "ko" ? "접종 완료 후 주요 치명 질환에 대한 체내 면역 수준 평가" : lang === "ja" ? "混合ワクチン完了後、主要感染症への免疫レベル測定" : "Assess antibody formation level after vaccines." 
          },
          { 
            name: lang === "ko" ? "고양이 백혈병 백신 (FeLV)" : lang === "ja" ? "猫白血病ウイルスワクチン (FeLV)" : "Feline Leukemia Vaccine (FeLV)", 
            period: lang === "ko" ? "생후 12주 이후 (선택)" : lang === "ja" ? "生後12週以降 (任意)" : "12 weeks old+ (Optional)", 
            cost: getVaccineCost("felv"), 
            detail: lang === "ko" ? "다묘 가정 혹은 실외 노출 우려 묘의 백혈병 항체 획득" : lang === "ja" ? "多頭飼育環境や野外露出の懸念がある場合の感染対策" : "Acquire antibodies against leukemia for multi-cat homes." 
          },
          ...(isSpayed ? [{ 
            name: lang === "ko" ? "선택형 중성화 수술" : lang === "ja" ? "避妊・去勢手術" : "Elective Spay/Neuter", 
            period: lang === "ko" ? "생후 6~7개월 권장" : lang === "ja" ? "生後6〜7ヶ月推奨" : "6-7 months old recommended", 
            cost: getVaccineCost("spay"), 
            detail: lang === "ko" ? "발정 스트레스 경감, 자궁축농증 및 전립선 질환 원천 예방" : lang === "ja" ? "発情ストレスの軽減、子宮蓄膿症や前立腺疾患の予防" : "Preventing pyometra, prostate issues, and mating stress." 
          }] : [])
        ]
      };
    } else if (computedAge < 7) {
      return {
        stageName: lang === "ko" ? "담당 수의사 판단에 따른 주기적 관리" : lang === "ja" ? "年次追加接種期" : "Annual Booster Stage",
        desc: lang === "ko" 
          ? "건강 유지를 위해 면역력 유지를 위한 추가 접종과 매월 내외부 기생충 관리가 권장됩니다." 
          : lang === "ja" 
          ? "健康な成猫・成犬期の維持のため、年1回の免疫補強追加接種と毎月の内外寄生虫予防が推奨されます。" 
          : "Annual boosters support active immunity. Monthly preventative parasite control is highly advised.",
        items: [
          { 
            name: lang === "ko" ? "종합백신(DHPPL/FVRCP) 추가 접종" : lang === "ja" ? "混合ワクチン追加接種" : "Core Booster (DHPPL / FVRCP)", 
            period: lang === "ko" ? "담당 수의사 판단에 따른 주기적 관리" : lang === "ja" ? "年に1回" : "Annually", 
            cost: getVaccineCost("annual_booster"), 
            detail: lang === "ko" ? "시간이 지남에 따라 소실되는 면역 질병 방어력 유지" : lang === "ja" ? "時間の経過に伴い低下する免疫力を呼び戻すブースター" : "Re-stimulate protective titers that decline over time." 
          },
          { 
            name: lang === "ko" ? "광견병 & 켄넬코프(강아지) 추가 접종" : lang === "ja" ? "狂犬病＆ケンネルコフ追加" : "Rabies & Respiratory Booster (Dogs)", 
            period: lang === "ko" ? "담당 수의사 판단에 따른 주기적 관리" : lang === "ja" ? "年に1回" : "Annually", 
            cost: getVaccineCost("annual_rabies"), 
            detail: lang === "ko" ? "단체 이용/호텔링 시 권장되는 예방 접종 완료증 갱신" : lang === "ja" ? "ドッグラン・ホテル利用時に必須となる接種証明書の更新" : "Update dynamic proof for hoteling or public dog facilities." 
          },
          { 
            name: lang === "ko" ? "심장사상충 및 내·외부 기생충 예방 관리" : lang === "ja" ? "フィラリア＆内外寄生虫予防薬 (1年分)" : "1-Yr Supply Heartworm & Tick Spot-ons", 
            period: lang === "ko" ? "제품 종류, 지역 위험도, 생활환경과 담당 수의사의 안내에 따라 예방 주기가 달라질 수 있습니다." : lang === "ja" ? "毎月投与 (年間)" : "Monthly administrations", 
            cost: getVaccineCost("annual_parasite"), 
            detail: lang === "ko" ? "심장사상충과 일부 진드기 매개 감염병 위험을 낮추기 위한 예방 관리" : lang === "ja" ? "蚊媒介の致命的なフィラリアおよびマダニ感染症の予防" : "Blocks lethal heartworms and tick-borne diseases." 
          }
        ]
      };
    } else {
      return {
        stageName: lang === "ko" ? "노령기 집중 종합 검진기 (7세 이상 실버케어)" : lang === "ja" ? "高齢期集中検診期 (7歳以上シニアケア)" : "Senior Screening Stage (7+ yrs)",
        desc: lang === "ko" 
          ? "신체 기능 노화가 시작되는 시기로, 질환 조기 발견을 위한 혈액검사 및 영상 정밀 검진이 필수적입니다." 
          : lang === "ja" 
          ? "身体機能が低下し始める時期で、病気の早期発見のための血液検査や精密画像診断が極めて重要です。" 
          : "As bodily systems age, routine chemistry blood tests and diagnostic imaging are key to detect conditions early.",
        items: [
          { 
            name: lang === "ko" ? "실버 종합 혈액검사 (CBC & Chemistry 17종)" : lang === "ja" ? "シニア血液スクリーニング検査 (17項目)" : "Senior Chemistry Profile (CBC & 17 channels)", 
            period: lang === "ko" ? "정기적(예: 연 1회) 권장" : lang === "ja" ? "年1回推奨" : "Recommended annually", 
            cost: getVaccineCost("silver_cbc"), 
            detail: lang === "ko" ? "간, 신장 기능 수치 및 전해질, 백혈구 적혈구 정밀 신체 장기 분석" : lang === "ja" ? "肝臓・腎臓機能数値および電解質、血球の総合分析" : "Analyzes internal liver, kidney functions, and blood cells." 
          },
          { 
            name: lang === "ko" ? "복부 초음파 & 흉부 엑스레이 영상 정밀 검사" : lang === "ja" ? "腹部エコー＆胸部レントゲン精密画像検査" : "Abdomen Ultrasound & Chest X-Ray Imaging", 
            period: lang === "ko" ? "정기적(예: 연 1회) 권장" : lang === "ja" ? "年1回推奨" : "Recommended annually", 
            cost: getVaccineCost("silver_echo"), 
            detail: lang === "ko" ? "종양 조기 발견, 심장 비대증 판정 및 복부 주요 장기 형태 분석" : lang === "ja" ? "腫瘍の早期発見、心臓肥大の検出、腹部臓器の分析" : "Detects early tumors, cardiac enlargement, and organ issues." 
          },
          { 
            name: lang === "ko" ? "종합백신 및 광견병 매년 의무 접종" : lang === "ja" ? "混合ワクチン＆狂犬病の毎年接種" : "Core Booster & Rabies annual routine", 
            period: lang === "ko" ? "담당 수의사 판단에 따른 주기적 관리" : lang === "ja" ? "年に1回" : "Annually", 
            cost: getVaccineCost("silver_vaccine"), 
            detail: lang === "ko" ? "노화로 인한 저하된 면역계를 서포트하는 필수 기초 추가 접종" : lang === "ja" ? "加齢に伴い低下する免疫をサポートするための予防" : "Supports aging immune systems to withstand infections." 
          },
          { 
            name: lang === "ko" ? "노령 맞춤형 사상충 및 기생충 안전 처방" : lang === "ja" ? "シニア対応フィラリア・寄生虫予防" : "Senior-Safe Heartworm & Parasite Control", 
            period: lang === "ko" ? "연간 지속" : lang === "ja" ? "年間継続" : "Continuous through the year", 
            cost: getVaccineCost("silver_parasite"), 
            detail: lang === "ko" ? "체력이 저하된 실버견/묘의 간부하를 줄이는 저자극성 기생충 차단" : lang === "ja" ? "体力の下がった高齢ペットの肝臓負荷を下げるマイルドな処方" : "Mild formulas to lower hepatic strain for senior pets." 
          }
        ]
      };
    }
  }, [petType, computedAge, isSpayed, lang]);

  const handleReset = () => {
    setPetType("dog_small");
    setAgeMode("direct");
    setAge("3");
    setBirthYear("2023");
    setBirthMonth("6");
    setLifespan(15);
    setFoodGrade("premium");
    setFoodCost(DEFAULTS.dog_small.food.premium);
    setHygieneCost(DEFAULTS.dog_small.hygiene);
    setCareType("shop");
    setCareCost(DEFAULTS.dog_small.care.shop);
    setIsSpayed(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const initCostText = petType === "dog_large" ? t.largeCostText : t.normalCostText;

  return (
    <div className="min-h-screen bg-[#faf8f9] py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      <div className="absolute top-[-5%] right-[-10%] w-[550px] h-[550px] rounded-full bg-magenta/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-15%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* 헤더 섹션 */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-magenta-light text-magenta text-xs font-black uppercase tracking-wider shadow-sm border border-magenta/10">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
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
            
            {/* 1. 축종 및 크기 선택 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100/80 hover:shadow-md transition-shadow duration-300 space-y-4">
              <label className="text-base font-black text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-magenta-light text-magenta text-xs font-black">1</span>
                {t.labelSelectType}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => handlePetTypeChange("dog_small")}
                  className={`p-3.5 rounded-2xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    petType === "dog_small"
                      ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                      : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                  }`}
                  style={{ minHeight: "95px" }}
                >
                  <span className="text-3xl">🐶</span>
                  <span className="text-[13px] font-black">{t.dogSmall}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{t.dogSmallDesc}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePetTypeChange("dog_medium")}
                  className={`p-3.5 rounded-2xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    petType === "dog_medium"
                      ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                      : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                  }`}
                  style={{ minHeight: "95px" }}
                >
                  <span className="text-3xl">🐕</span>
                  <span className="text-[13px] font-black">{t.dogMedium}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{t.dogMediumDesc}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePetTypeChange("dog_large")}
                  className={`p-3.5 rounded-2xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    petType === "dog_large"
                      ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                      : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                  }`}
                  style={{ minHeight: "95px" }}
                >
                  <span className="text-3xl">🐩</span>
                  <span className="text-[13px] font-black">{t.dogLarge}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{t.dogLargeDesc}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePetTypeChange("cat")}
                  className={`p-3.5 rounded-2xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    petType === "cat"
                      ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                      : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                  }`}
                  style={{ minHeight: "95px" }}
                >
                  <span className="text-3xl">🐱</span>
                  <span className="text-[13px] font-black">{t.cat}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{t.catDesc}</span>
                </button>
              </div>
            </div>

            {/* 2. 나이 및 예상 수명 입력 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100/80 hover:shadow-md transition-shadow duration-300 space-y-5">
              <label className="text-base font-black text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-magenta-light text-magenta text-xs font-black">2</span>
                {t.labelAgeSetup}
              </label>

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
                  {t.ageModeDirect}
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
                  {t.ageModeBirth}
                </button>
              </div>

              {ageMode === "direct" ? (
                <div className="space-y-2">
                  <span className="text-sm font-bold text-gray-700">{t.labelAgeDirect}</span>
                  <div className="relative">
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="3"
                      min="0"
                      max="30"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-magenta focus:ring-1 focus:ring-magenta focus:outline-none transition-all font-bold text-gray-800 text-base"
                      style={{ minHeight: "56px" }}
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">{t.unitAge}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-sm font-bold text-gray-700">{t.labelBirthYear}</span>
                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-magenta focus:outline-none font-bold text-gray-800 bg-white"
                      style={{ minHeight: "56px" }}
                    >
                      {Array.from({ length: 25 }, (_, i) => CURRENT_YEAR - i).map((yr) => (
                        <option key={yr} value={yr}>{yr}{t.unitYear}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-bold text-gray-700">{t.labelBirthMonth}</span>
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-magenta focus:outline-none font-bold text-gray-800 bg-white"
                      style={{ minHeight: "56px" }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>{m}{t.unitMonth}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {computedAge < 1 && (
                <div className="p-4 bg-magenta-light/30 border border-magenta/10 rounded-2xl flex items-center justify-between transition-all duration-300">
                  <span className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    {t.neuteredQuestion}
                  </span>
                  <input
                    type="checkbox"
                    checked={isSpayed}
                    onChange={(e) => setIsSpayed(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-magenta focus:ring-magenta cursor-pointer"
                  />
                </div>
              )}

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-gray-700">{t.labelTargetLifespan}</span>
                  <span className="text-magenta font-black text-base">{lifespan}{t.unitLifespan}</span>
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
                  <span>{Math.max(1, computedAge + 1)}{t.unitLifespan}</span>
                  <span>20{t.unitLifespan}</span>
                  <span>35{t.unitLifespan}</span>
                </div>
              </div>
            </div>

            {/* 3. 월간 고정 지출 설정 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100/80 hover:shadow-md transition-shadow duration-300 space-y-6">
              <label className="text-base font-black text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-magenta-light text-magenta text-xs font-black">3</span>
                {t.labelExpensesSetup}
              </label>

              <div className="space-y-3">
                <span className="text-sm font-bold text-gray-700">{t.labelFoodQuality}</span>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleFoodGradeChange("normal")}
                    className={`p-3 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      foodGrade === "normal"
                        ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                        : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                    }`}
                    style={{ minHeight: "75px" }}
                  >
                    <span className="text-xs font-black">{t.foodNormal}</span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      {lang === "ko" ? "3만 원" : lang === "ja" ? "約4,000円" : "Approx. $40"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFoodGradeChange("premium")}
                    className={`p-3 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      foodGrade === "premium"
                        ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                        : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                    }`}
                    style={{ minHeight: "75px" }}
                  >
                    <span className="text-xs font-black">{t.foodPremium}</span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      {lang === "ko" ? "6만 원" : lang === "ja" ? "約8,000円" : "Approx. $80"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFoodGradeChange("medical")}
                    className={`p-3 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      foodGrade === "medical"
                        ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                        : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                    }`}
                    style={{ minHeight: "75px" }}
                  >
                    <span className="text-xs font-black">{t.foodMedical}</span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      {lang === "ko" ? "9만 원" : lang === "ja" ? "約12,000円" : "Approx. $120"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>{t.sliderFoodLabel}</span>
                  <span className="text-gray-900 text-sm font-black">{formatCurrency(foodCost)}</span>
                </div>
                <input
                  type="range"
                  min={sliderConfig.food.min}
                  max={sliderConfig.food.max}
                  step={sliderConfig.food.step}
                  value={foodCost}
                  onChange={(e) => setFoodCost(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-magenta"
                />
              </div>

              <div className="h-px bg-gray-100" />

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-gray-700">{t.sliderHygieneLabel}</span>
                  <span className="text-magenta font-black">{formatCurrency(hygieneCost)}</span>
                </div>
                <input
                  type="range"
                  min={sliderConfig.hygiene.min}
                  max={sliderConfig.hygiene.max}
                  step={sliderConfig.hygiene.step}
                  value={hygieneCost}
                  onChange={(e) => setHygieneCost(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-magenta"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>{sliderConfig.hygiene.ticks[0]}</span>
                  <span>{sliderConfig.hygiene.ticks[1]}</span>
                  <span>{sliderConfig.hygiene.ticks[2]}</span>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="space-y-3">
                <span className="text-sm font-bold text-gray-700">{t.labelCareType}</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleCareTypeChange("shop")}
                    className={`p-3.5 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      careType === "shop"
                        ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                        : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                    }`}
                    style={{ minHeight: "75px" }}
                  >
                    <span className="text-xs font-black">{t.careShop}</span>
                    <span className="text-[10px] text-gray-400 font-normal">{t.careShopDesc}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCareTypeChange("home")}
                    className={`p-3.5 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      careType === "home"
                        ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-sm"
                        : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                    }`}
                    style={{ minHeight: "75px" }}
                  >
                    <span className="text-xs font-black">{t.careHome}</span>
                    <span className="text-[10px] text-gray-400 font-normal">{t.careHomeDesc}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>{t.sliderCareLabel}</span>
                  <span className="text-gray-900 text-sm font-black">{formatCurrency(careCost)}</span>
                </div>
                <input
                  type="range"
                  min={sliderConfig.care.min}
                  max={sliderConfig.care.max}
                  step={sliderConfig.care.step}
                  value={careCost}
                  onChange={(e) => setCareCost(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-magenta"
                />
              </div>

            </div>
          </div>

          {/* 우측: 실시간 글래스모피즘 결과 리포트 */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
            
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/40 bg-white/75 backdrop-blur-xl shadow-xl shadow-slate-100">
              
              <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-magenta/10 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-44 h-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                
                <div className="flex items-center justify-between gap-4 border-b border-gray-150/40 pb-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                      LIFETIME EXPENSE ANALYTICS
                    </p>
                    <h2 className="text-lg font-black text-gray-900 mt-0.5">
                      {t.reportTitle}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black bg-magenta-light text-magenta shadow-sm border border-magenta/10">
                    {t.reportRealtime}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/90 p-4.5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Coffee className="w-3.5 h-3.5 text-magenta" />
                        {t.reportMonthlyTotal}
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-magenta">
                        {formatCurrency(monthlyTotal)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold">{t.reportMonthlyMedical}</span>
                    </div>
                  </div>

                  <div className="bg-white/90 p-4.5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <PiggyBank className="w-3.5 h-3.5 text-indigo-500" />
                        {t.reportLifetimeTotal}
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-indigo-600">
                        {formatCurrency(lifetimeTotal)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold">
                        {t.reportLifetimePeriod.replace("{remainingYears}", String(remainingYears))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 p-4 rounded-2xl border border-white/60 text-xs text-gray-500 leading-relaxed font-semibold">
                  <Info className="w-3.5 h-3.5 text-gray-400 inline-block mr-1 -mt-0.5" />
                  {t.simulationInfo
                    .replace("{computedAge}", String(computedAge))
                    .replace("{lifespan}", String(lifespan))
                    .replace("{initCostText}", initCostText)}
                  <div className="text-[10px] text-gray-400 mt-2 font-medium">
                    * {t.statDisclaimer}
                  </div>
                </div>

                <div className="flex items-center gap-6 p-4 bg-white/40 border border-white/30 rounded-2xl">
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
                      <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{t.chartLabelMonthly}</span>
                      <span className="text-xs font-black text-gray-800">
                        {lang === "ko" 
                          ? (monthlyTotal >= 10000 ? `${(monthlyTotal/10000).toFixed(1)}만` : `${monthlyTotal.toLocaleString()}`)
                          : formatCurrency(monthlyTotal)
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-[10px] font-bold text-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-magenta" /> {t.chartFood}</span>
                      <span className="text-gray-900">{chartPercents.food}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500" /> {t.chartHygiene}</span>
                      <span className="text-gray-900">{chartPercents.hygiene}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> {t.chartCare}</span>
                      <span className="text-gray-900">{chartPercents.care}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> {t.chartMedical}</span>
                      <span className="text-gray-900">{chartPercents.medical}%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-150/60 space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-magenta" />
                  {t.calendarTitle}
                </h3>
                <p className="text-xs text-gray-400 font-bold leading-normal">
                  {t.calendarDesc.replace("{computedAge}", String(computedAge))}
                </p>
              </div>

              <div className="bg-magenta-light/30 px-3.5 py-2.5 rounded-2xl border border-magenta/10 flex items-center justify-between text-xs font-black text-magenta">
                <span>{vaccinationSchedule.stageName}</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded shadow-sm border border-magenta/5">{t.calendarTag}</span>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed font-semibold whitespace-pre-line">
                💡 {vaccinationSchedule.desc}
              </p>

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
                        ~ {formatCurrency(item.cost)}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-semibold pl-6 border-l border-gray-200">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[10px] text-gray-400 leading-relaxed font-bold">
                {t.calendarDisclaimer}
              </div>
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
        </div>

      </div>
    </div>
  );
}
