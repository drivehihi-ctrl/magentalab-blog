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

interface BCSInfo {
  score: number;
  title: string;
  level: "low" | "ideal" | "warn" | "danger";
  levelText: string;
  description: string;
  solution: string;
}

interface BCSCalculatorProps {
  lang?: "ko" | "en" | "ja";
}

export default function BCSCalculator({ lang = "ko" }: BCSCalculatorProps) {


  // 입력 폼 상태 관리
  const [petType, setPetType] = useState<"dog" | "cat">("dog");
  const [ageType, setAgeType] = useState<"month" | "year">("year");
  const [ageValue, setAgeValue] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [status, setStatus] = useState<string>("dog_neutered");
  const [bcs, setBcs] = useState<number>(5);
  
  // 계산 결과 상태
  const [rer, setRer] = useState<number>(0);
  const [der, setDer] = useState<number>(0);
  const [feedGrams, setFeedGrams] = useState<number>(0);
  const [isValid, setIsValid] = useState<boolean>(true);

  // Multilingual translation dictionaries
  const dict = {
    ko: {
      title: "반려동물 비만도(BCS) & 칼로리 계산기",
      desc: "아이의 체중, 건강 상태 및 체형(BCS 9단계) 정보를 바탕으로 하루에 필요한 예상 필요 열량 요구량(DER)과 일일 사료 급여량을 산출합니다.",
      badge: "체형 평가 참고 가이드",
      labelPetType: "반려동물 종류",
      dog: "강아지 (Dog)",
      cat: "고양이 (Cat)",
      labelAge: "반려동물 나이",
      unitYears: "세(Years)",
      unitMonths: "개월(Months)",
      unitAgeYears: "살",
      unitAgeMonths: "개월",
      labelWeight: "현재 체중",
      weightError: "올바른 체중(0보다 큰 숫자)을 입력해 주세요.",
      labelStatus: "중성화 및 건강 상태",
      statusDescPrefix: "💡 ",
      labelBcs: "비만도 단계 (BCS: Body Condition Score)",
      bcsDesc: "1~9단계 표준 척도",
      bcsLow: "매우마름 (1)",
      bcsIdeal: "정상 (5)",
      bcsObese: "고도비만 (9)",
      btnReset: "설정 초기화",
      resultTitle: "평가 결과 안내",
      resultGuide: "일일 열량 가이드",
      dogGuide: "댕댕이",
      catGuide: "야옹이",
      rerLabel: "기초대사량 (RER)",
      derLabel: "일일 필요 대사량 (DER)",
      feedLabel: "일일 권장 사료 급여량",
      feedUnit: "g / 하루",
      feedDesc: "* 평균 건식 사료 열량(3,500 kcal/kg) 기준으로 환산된 양입니다.",
      bcsLabel: "비만 진단 척도",
      solTitle: "수의학 다이어트 및 식단 솔루션",
      warnDiet: "체중 감량 다이어트 프로그램 가이드라인이 필요합니다.",
      rulesTitle: "1단계씩 서서히 줄여나가는 안전 다이어트 4대 규칙:",
      rule1Title: "사료량 제한: ",
      rule1Desc: "권장 다이어트 급여량인 g을 초과하지 않도록 주방 저울을 사용하여 g단위로 칼로리를 정확히 제한해 주세요.",
      rule2Title: "간식 제한: ",
      rule2Desc: "하루 전체 섭취 칼로리의 5% 이하로 완전히 제한하거나, 건조 동결 간식을 저칼로리 야채류(브로콜리, 단호박 등 소량)로 대체하여 칼로리 밀도를 낮추십시오.",
      rule3Title: "안전한 관절 보호: ",
      rule3Desc: "몸무게가 실리는 과도한 달리기나 높은 곳에서 뛰어내리는 운동은 무리가 옵니다. 평지 위주의 가벼운 산책(강아지)이나 부드러운 유도식 사냥 놀이(고양이)를 하루 2~3회에 나누어 조금씩 유도하세요.",
      rule4Title: "처방식 사료 검토: ",
      rule4Desc: "필요시 식이섬유가 풍부하고 포만감이 유지되는 다이어트 전용 포뮬러 사료로 교체하는 것을 수의사와 상담해 보시는 것을 권장합니다.",
      thinTitle: "체중 및 영양소 보충이 필요합니다.",
      thinRule1Title: "소실 근육 보완: ",
      thinRule1Desc: "양질의 단백질 및 건강한 지방 함량이 높은 고에너지 퍼피/키튼 혹은 활력 증진용 사료의 비중을 늘려 소모 칼로리를 메워 줍니다.",
      thinRule2Title: "소화 부담 완화: ",
      thinRule2Desc: "급작스러운 사료 증량은 설사나 구토를 유발합니다. 하루 급여 빈도를 3~4회로 늘려 조금씩 위장에 부담이 가지 않도록 소량 분할 급여하세요.",
      idealTitle: "이상적인 체형이 유지 중입니다.",
      idealDesc: "에 맞게 균형 잡힌 정량 급여를 유지해 주시고, 주기적인 체중 측정으로 비만으로 넘어가지 않게 유지해 주세요.",
      idealTip: "신체 나이와 관절 유연성에 알맞은 수준의 기초 산책과 캣타워 놀이를 병행하면 근골격계 건강에 가장 이상적입니다.",
      cautionTitle: "📌 알아두세요!",
      cautionDesc: "본 계산 결과는 미국반려동물비만치료협회(APOP) 및 세계소동물수의사회(WSAVA)의 표준 임상 지표를 기초로 설계되었습니다. 단, 개별 동물의 기저 질환, 임신 여부 등에 따라 최적 에너지량이 다를 수 있으므로 치료 목적의 정밀 설계는 반드시 주치의 수의사와 상의하시기 바랍니다.",
      loading: "계산기를 불러오는 중입니다...",
    },
    en: {
      title: "Pet Obesity (BCS) & Calorie Calculator",
      desc: "Calculate precise targeted daily energy requirements (DER) and food portions based on weight, clinical status, and body condition scores (BCS 9-step scale).",
      badge: "Veterinary Standard Algorithm Self-Diagnosis",
      labelPetType: "Pet Type",
      dog: "Dog",
      cat: "Cat",
      labelAge: "Pet Age",
      unitYears: "Years",
      unitMonths: "Months",
      unitAgeYears: " years",
      unitAgeMonths: " months",
      labelWeight: "Current Weight",
      weightError: "Please enter a valid weight (number greater than 0).",
      labelStatus: "Neutered & Health Status",
      statusDescPrefix: "💡 ",
      labelBcs: "Body Condition Score (BCS)",
      bcsDesc: "1 to 9 Standard Scale",
      bcsLow: "Very Thin (1)",
      bcsIdeal: "Ideal (5)",
      bcsObese: "Severely Obese (9)",
      btnReset: "Reset Settings",
      resultTitle: "Diagnosis Result Analysis",
      resultGuide: "Daily Calorie Guide",
      dogGuide: "Dog's",
      catGuide: "Cat's",
      rerLabel: "Resting Energy Requirement (RER)",
      derLabel: "Daily Energy Requirement (DER)",
      feedLabel: "Recommended Daily Food Intake",
      feedUnit: "g / day",
      feedDesc: "* Portions calculated based on average dry kibble energy density (3,500 kcal/kg).",
      bcsLabel: "Obesity Score Scale",
      solTitle: "Veterinary Diet & Nutrition Solution",
      warnDiet: "A targeted weight loss diet program is highly recommended.",
      rulesTitle: "4 Rules for a Safe and Gradual Weight Loss:",
      rule1Title: "Portion Control: ",
      rule1Desc: "Do not exceed the recommended diet portions of g. Use a kitchen scale to measure daily portions accurately.",
      rule2Title: "Treat Restriction: ",
      rule2Desc: "Limit treats to less than 5% of daily calories, or replace commercial treats with low-calorie vegetables like small pieces of broccoli or pumpkin.",
      rule3Title: "Joint Protection: ",
      rule3Desc: "Avoid high-impact jumping or running as it strains joints. Opt for light flat-ground walks (dogs) or gentle indoor play (cats) split into 2-3 sessions daily.",
      rule4Title: "Prescription Diets: ",
      rule4Desc: "Consult your veterinarian about prescription weight management diets containing high fiber to keep your pet feeling full.",
      thinTitle: "Weight and nutrient supplementation is needed.",
      thinRule1Title: "Muscle Recovery: ",
      thinRule1Desc: "Increase high-quality protein and nutrient-dense foods (e.g., puppy/kitten or active formulas) to meet energy gaps.",
      thinRule2Title: "Digestive Ease: ",
      thinRule2Desc: "Avoid sudden food increases as they cause diarrhea or vomiting. Feed smaller portions split into 3-4 meals daily.",
      idealTitle: "A very healthy body shape is being maintained.",
      idealDesc: "Keep standard portion feeding at the recommended amount to prevent shifting into overweight levels.",
      idealTip: "Pairing balanced meals with regular play sessions or walks suitable for their age is ideal for muscular health.",
      cautionTitle: "📌 Please Note!",
      cautionDesc: "Results are based on standard clinical algorithms from APOP and WSAVA. However, since optimal energy needs vary by pre-existing conditions, pregnancy, etc., seek veterinary advice for specific diet treatment plans.",
      loading: "Loading Calculator...",
    },
    ja: {
      title: "ペット肥満度(BCS)＆カロリー計算機",
      desc: "ペットの体重、健康状態、体型（BCS 9段階）データに基づいて、一日に必要な予想必要カロリー要求量（DER）と一日の推奨フード給与量を算出します。",
      badge: "体型評価参考ガイド",
      labelPetType: "ペットの種類",
      dog: "犬 (Dog)",
      cat: "猫 (Cat)",
      labelAge: "ペットの年齢",
      unitYears: "年(Years)",
      unitMonths: "ヶ月(Months)",
      unitAgeYears: "歳",
      unitAgeMonths: "ヶ月",
      labelWeight: "現在の体重",
      weightError: "正しい体重（0より大きい数値）を入力してください。",
      labelStatus: "去勢・避妊および健康状態",
      statusDescPrefix: "💡 ",
      labelBcs: "肥満度段階 (BCS: Body Condition Score)",
      bcsDesc: "1〜9段階標準スケール",
      bcsLow: "痩せすぎ (1)",
      bcsIdeal: "正常 (5)",
      bcsObese: "極度肥満 (9)",
      btnReset: "リセット",
      resultTitle: "診断結果の分析",
      resultGuide: "一日カロリーガイド",
      dogGuide: "愛犬の",
      catGuide: "愛猫の",
      rerLabel: "安静時エネルギー要求量 (RER)",
      derLabel: "一日必要エネルギー量 (DER)",
      feedLabel: "一日の推奨フード給与量",
      feedUnit: "g / 日",
      feedDesc: "* 平均的なドライフード熱量(3,500 kcal/kg)を基準に換算された値です。",
      bcsLabel: "肥満診断基準",
      solTitle: "獣医学的ダイエット＆食事ソリューション",
      warnDiet: "体重減量ダイエットプログラムのガイドラインが必要です。",
      rulesTitle: "1段階ずつゆっくり減らしていく安全なダイエットの4大原則:",
      rule1Title: "給与量の制限: ",
      rule1Desc: "推奨ダイエット給与量であるgを超えないよう、キッチンスケール等を用いてg単位でカロリーを厳密に制限してください。",
      rule2Title: "おやつの制限: ",
      rule2Desc: "おやつは一日の摂取カロリーの5%以下にするか、フリーズドライおやつを低カロリーの野菜類（ブロッコリーやカボチャ等）に置き換えてください。",
      rule3Title: "関節の保護: ",
      rule3Desc: "体重が負荷になる過度なランニングや高所からのジャンプは関節を痛めます。平地での軽い散歩（犬）や、適度なキャットトイ遊び（猫）を一日2〜3回に分けて行ってください。",
      rule4Title: "療法食の検討: ",
      rule4Desc: "必要に応じて繊維質が豊富で満腹感が得られる減量用療法食への切り替えを獣医師と相談してください。",
      thinTitle: "体重および栄養素の補給が必要です。",
      thinRule1Title: "筋肉量の補強: ",
      thinRule1Desc: "良質なタンパク質と脂質が豊富な高栄養パピー・キトン用、または活動犬用フードの比率を増やして不足分を補います。",
      thinRule2Title: "消化不良の防止: ",
      thinRule2Desc: "急なフード増量は下痢や嘔吐の原因になります。一日の給与頻度を3〜4回に増やし、胃腸に負担をかけないよう少量ずつ分けて与えてください。",
      idealTitle: "非常に健康的な標準体型を維持しています。",
      idealDesc: "に合わせ、バランスの取れた定量を給与し、定期的な体重チェックで肥満を予防してください。",
      idealTip: "年齢と関節の柔軟性に合わせた軽い散歩やキャットタワー遊びを行うと、骨格の維持に最適です。",
      cautionTitle: "📌 ご注意ください！",
      cautionDesc: "本計算結果は、APOPおよびWSAVAの臨床基準に準拠していますが、個々のペットの既往症、妊娠状態などによってエネルギー要求量が異なる場合があるため、医療目的の計画は必ず獣医師にご相談ください。",
      loading: "計算機をロードしています...",
    }
  };

  const t = dict[lang] || dict.ko;

  // 상태 계수 매핑
  const DOG_STATUS_FACTORS: Record<string, { label: string; factor: number; desc: string }> = {
    dog_neutered: { 
      label: lang === "ko" ? "중성화 완료 (성견)" : lang === "ja" ? "去勢・避妊済 (成犬)" : "Neutered Adult Dog", 
      factor: 1.6, 
      desc: lang === "ko" ? "기본적인 에너지 요구량을 가진 건강한 성견" : lang === "ja" ? "基本的なエネルギー要求量を持つ健康な成犬" : "Healthy adult dog with baseline energy needs" 
    },
    dog_intact: { 
      label: lang === "ko" ? "미중성화 (성견)" : lang === "ja" ? "未去勢・未避妊 (成犬)" : "Intact Adult Dog", 
      factor: 1.8, 
      desc: lang === "ko" ? "중성화를 하지 않아 활동 대사량이 비교적 높은 성견" : lang === "ja" ? "性ホルモン等の影響で代謝率が比較的高い成犬" : "Intact adult dog with relatively higher metabolic rates" 
    },
    dog_obese_prone: { 
      label: lang === "ko" ? "비만 경향 / 중성화 후 관리" : lang === "ja" ? "肥満傾向 / 去勢・避妊後管理" : "Obese Prone / Post-Neutering Care", 
      factor: 1.4, 
      desc: lang === "ko" ? "살이 찌기 쉬운 체질이거나 중성화 수술 후 초기 관리 단계" : lang === "ja" ? "太りやすい体質、または去勢・避妊後の初期ウェイト管理段階" : "Prone to weight gain or in the initial stages of post-neutering management" 
    },
    dog_active: { 
      label: lang === "ko" ? "활동량 많음 / 일하는 개" : lang === "ja" ? "活動的 / ワーキングドッグ" : "Highly Active / Working Dog", 
      factor: 2.0, 
      desc: lang === "ko" ? "하루 1시간 이상 활발하게 산책하거나 훈련받는 활동견" : lang === "ja" ? "一日1時間以上活発に散歩やトレーニングを行う活動犬" : "Dogs training or walking actively for more than 1 hour daily" 
    },
    dog_senior: { 
      label: lang === "ko" ? "노령기 / 비활동적" : lang === "ja" ? "高齢期 / 非活動的" : "Senior / Inactive Dog", 
      factor: 1.4, 
      desc: lang === "ko" ? "나이가 많아 대사율이 감소했거나 활동량이 적은 아이" : lang === "ja" ? "年齢が高く代謝率が低下した、または運動量が少ない犬" : "Older dogs with slower metabolic rates or lower physical activity" 
    },
    dog_diet: { 
      label: lang === "ko" ? "집중 다이어트 필요" : lang === "ja" ? "集中ダイエットが必要" : "Intensive Weight Loss", 
      factor: 1.0, 
      desc: lang === "ko" ? "체중 감량을 위해 칼로리 제한이 시급한 과체중/비만 단계" : lang === "ja" ? "減量のためにカロリー制限が最優先される段階" : "Strict calorie restriction needed for weight loss" 
    },
  };

  const CAT_STATUS_FACTORS: Record<string, { label: string; factor: number; desc: string }> = {
    cat_neutered: { 
      label: lang === "ko" ? "중성화 완료 (성묘)" : lang === "ja" ? "去勢・避妊済 (成猫)" : "Neutered Adult Cat", 
      factor: 1.2, 
      desc: lang === "ko" ? "실내에서 생활하는 평범한 대사량의 성묘" : lang === "ja" ? "室内で生活する標準的な代謝量の成猫" : "Indoor adult cats with average metabolic rates" 
    },
    cat_intact: { 
      label: lang === "ko" ? "미중성화 (성묘)" : lang === "ja" ? "未去勢・未避妊 (成猫)" : "Intact Adult Cat", 
      factor: 1.4, 
      desc: lang === "ko" ? "중성화를 하지 않아 메이팅 에너지 등이 작동하는 성묘" : lang === "ja" ? "ホルモン影響でエネルギー要求量が少し高い成猫" : "Intact adult cats with naturally higher energy requirements" 
    },
    cat_obese_prone: { 
      label: lang === "ko" ? "비만 경향 / 중성화 후 관리" : lang === "ja" ? "肥満傾向 / 去勢・避妊後管理" : "Obese Prone / Post-Neutering Care", 
      factor: 1.0, 
      desc: lang === "ko" ? "움직임이 적고 식탐이 많아 쉽게 살찌는 고양이" : lang === "ja" ? "運動量が少なく、食欲旺盛で太りやすい猫" : "Inactive cats with high appetites prone to weight gain" 
    },
    cat_active: { 
      label: lang === "ko" ? "활동량 많음 / 활발한 아이" : lang === "ja" ? "活動的 / 活発な猫" : "Highly Active Cat", 
      factor: 1.6, 
      desc: lang === "ko" ? "우다다를 자주 하거나 활동 반경이 넓은 아깽이 혹은 활발한 묘" : lang === "ja" ? "活発に走り回る、または運動量の多い成猫や子猫" : "Energetic cats or kittens with high physical activity" 
    },
    cat_senior: { 
      label: lang === "ko" ? "노령기 / 비활동적" : lang === "ja" ? "高齢期 / 非活動的" : "Senior / Inactive Cat", 
      factor: 1.1, 
      desc: lang === "ko" ? "나이가 들어 잠이 많아지고 활동량이 극히 감소한 묘" : lang === "ja" ? "高齢により睡眠時間が増え、活動量が著しく低下した猫" : "Older cats sleeping more and having low physical output" 
    },
    cat_diet: { 
      label: lang === "ko" ? "집중 다이어트 필요" : lang === "ja" ? "集中ダイエットが必要" : "Intensive Weight Loss", 
      factor: 0.8, 
      desc: lang === "ko" ? "체중 감량을 위해 엄격한 식단 제한이 필요한 과체중/비만 단계" : lang === "ja" ? "減量のために厳密な食事制限が必要な段階" : "Strict dietary constraints necessary for weight reduction" 
    },
  };

  const BCS_DATA: Record<number, BCSInfo> = {
    1: {
      score: 1,
      title: lang === "ko" ? "극심한 저체중 (Severe Emaciation)" : lang === "ja" ? "極度な痩せすぎ (Severe Emaciation)" : "Severe Emaciation",
      level: "danger",
      levelText: lang === "ko" ? "매우 위험 (저체중)" : lang === "ja" ? "極度な危険 (痩せすぎ)" : "Danger (Severe Underweight)",
      description: lang === "ko" ? "갈비뼈, 골반뼈 등이 멀리서도 뚜렷하게 보이며 몸 전체에 체지방이 전혀 느껴지지 않는 매우 야윈 상태입니다." : lang === "ja" ? "肋骨や腰の骨が遠目にもはっきりと突き出て見え、触れても脂肪層が全く感じられない極度に痩せた状態です。" : "Ribs, pelvis, and lumbar vertebrae are easily visible from a distance. No palpable body fat.",
      solution: lang === "ko" ? "질병이 원인일 수 있으므로 먼저 수의사의 정밀 진단을 권장합니다. 소화가 잘 되는 단백질과 에너지 함량이 높은 특수 영양 사료를 소량씩 자주 급여하여 소실된 근육량과 지방을 점진적으로 복구해야 합니다." : lang === "ja" ? "疾患が原因の可能性があるため、獣医師による精密検査を推奨します。消化しやすいタンパク質と高カロリーフードを少量ずつ頻回に分けて与え、徐々に筋肉量と脂肪を戻していきます。" : "May indicate underlying illness. Seek immediate veterinary diagnostics. Feed highly digestible protein and high-density nutritional recovery diets in small, frequent portions."
    },
    2: {
      score: 2,
      title: lang === "ko" ? "심한 저체중 (Very Thin)" : lang === "ja" ? "重度の痩せすぎ (Very Thin)" : "Very Thin",
      level: "warn",
      levelText: lang === "ko" ? "경계 (저체중)" : lang === "ja" ? "警戒 (痩せすぎ)" : "Warning (Underweight)",
      description: lang === "ko" ? "갈비뼈가 뼈 모양 그대로 쉽게 만져지고 보이며, 옆에서 볼 때 허리 라인이 깊숙이 들어가 겉보기에도 매우 말라 보입니다." : lang === "ja" ? "肋骨の形が簡単に触れ分かり、横から見たときにウエストが深くくびれて見え、一目でかなり痩せていると分かります。" : "Ribs are easily felt and visible with no palpable fat. Waistline is deeply tucked.",
      solution: lang === "ko" ? "현재 권장 칼로리보다 10~15% 정도 식사량을 늘려주세요. 위장에 무리가 가지 않는 고영양 포뮬러의 사료나 습식 캔 사료를 활용하여 체중을 서서히 올리는 대사 관리가 필요합니다." : lang === "ja" ? "現在の給与カロリーより10〜15%ほど食事量を増やしてください。消化器に負担をかけない高栄養フードやウェットフードを活用して少しずつ体重を増やします。" : "Increase food intake by 10-15% above standard requirements. Use high-nutrition formulas or wet food to ease digestion while gradually building body weight."
    },
    3: {
      score: 3,
      title: lang === "ko" ? "저체중 (Thin)" : lang === "ja" ? "痩せぎみ (Thin)" : "Thin",
      level: "warn",
      levelText: lang === "ko" ? "주의 (저체중)" : lang === "ja" ? "注意 (痩せぎみ)" : "Caution (Underweight)",
      description: lang === "ko" ? "갈비뼈가 쉽게 만져지며, 위에서 보았을 때 허리 굴곡이 뚜렷하게 좁아져 보입니다. 지방이 부족한 상태입니다." : lang === "ja" ? "肋骨が簡単に触れ、上から見たときにウエストのくびれがはっきりと細くなっています。脂肪層が不足している状態です。" : "Ribs are easily felt. Waist is clearly visible and narrowed. Body fat is insufficient.",
      solution: lang === "ko" ? "일일 에너지 급여량이 권장 수준보다 부족할 수 있습니다. 간식을 건강한 육류 위주로 추가해 주거나, 평소 먹는 사료의 양을 하루에 5~10% 정도씩 증량하여 최적 체형으로 올려주세요." : lang === "ja" ? "一日の給与量が推奨される必要エネルギーに届いていない可能性があります。良質な肉類ベースのおやつを少し追加するか、通常のフードを5〜10%増量してください。" : "Daily intake might be slightly below requirements. Add healthy meat-based treats or increase daily portions by 5-10%."
    },
    4: {
      score: 4,
      title: lang === "ko" ? "약간 마름 (Underweight)" : lang === "ja" ? "やや痩せ (Underweight)" : "Underweight",
      level: "ideal",
      levelText: lang === "ko" ? "정상 범위" : lang === "ja" ? "正常範囲" : "Normal Range",
      description: lang === "ko" ? "갈비뼈가 얇은 지방층에 덮여 부드럽게 만져지며, 위에서 볼 때 자연스러운 허리 라인이 뚜렷하게 나타납니다." : lang === "ja" ? "肋骨が薄い脂肪層に覆われ、優しく触れると分かります。上から見たときに緩やかなウエストラインが残っています。" : "Ribs are felt under a thin layer of fat. A natural waistline is clearly visible.",
      solution: lang === "ko" ? "이상적인 체형에 거의 도달했습니다. 무리하게 식사량을 늘리기보다는 양질의 단백질 급여와 근육량을 키우는 규칙적인 놀이/산책을 통해 건강 상태를 확립해 주세요." : lang === "ja" ? "理想体型にほぼ近づいています。無理に食事量を増やすのではなく、良質なタンパク質の摂取と筋肉量を維持する適度な運動・散歩を続けてください。" : "Almost ideal. Avoid increasing portions drastically. Secure lean muscle development through high-quality protein and routine daily exercise/play."
    },
    5: {
      score: 5,
      title: lang === "ko" ? "이상적인 체중 (Ideal)" : lang === "ja" ? "理想的 (Ideal)" : "Ideal",
      level: "ideal",
      levelText: lang === "ko" ? "이상적 (정상)" : lang === "ja" ? "理想的 (正常)" : "Ideal",
      description: lang === "ko" ? "갈비뼈가 적절한 지방층 아래로 쉽게 만져집니다. 위에서 볼 때 골반 앞쪽 허리가 아름답게 잘록하고 복부 팽팽함이 적절합니다." : lang === "ja" ? "肋骨が適度な脂肪層の下に容易に触れます。上から見たときに骨盤の手前が綺麗にくびれており、お腹のハリも適度です。" : "Ribs can be felt easily under moderate fat coverage. Waist is well-proportioned and abdomen is tucked.",
      solution: lang === "ko" ? "훌륭합니다! 완벽한 비율과 최상의 신체 상태를 유지하고 계십니다. 현재의 건강한 식습관, 급여량(사료 및 간식의 밸런스), 그리고 규칙적인 활동량을 꾸준히 유지할 수 있도록 모니터링만 계속해 주세요." : lang === "ja" ? "素晴らしいです！完璧な体型と健康状態が維持されています。現在の食事量（おやつとのバランス）と適度な運動量をキープし、現状のライフスタイルを維持してください。" : "Excellent! Your pet is in pristine condition. Maintain the current feeding amount, balance treats, and continue current exercise routines."
    },
    6: {
      score: 6,
      title: lang === "ko" ? "과체중 초입 (Overweight)" : lang === "ja" ? "過体重の初期 (Overweight)" : "Slightly Overweight",
      level: "warn",
      levelText: lang === "ko" ? "주의 (과체중)" : lang === "ja" ? "注意 (過体重)" : "Caution (Overweight)",
      description: lang === "ko" ? "갈비뼈 위에 약간 더 두꺼운 지방층이 덮여 손끝에 힘을 주어 눌러야 느껴집니다. 위에서 볼 때 허리선이 다소 평평하고 뭉툭해 보입니다." : lang === "ja" ? "肋骨の上にやや厚めの脂肪層が乗り、指先で少し押さないと肋骨に触れません。上から見るとくびれが平坦でやや丸みを帯びています。" : "Ribs are felt only with slight finger pressure. Waistline is flat and slightly rounded.",
      solution: lang === "ko" ? "이상적인 기준 대비 약 5~10% 체중이 초과된 상태입니다. 과도한 무설탕/탄수화물 간식을 전면 중단하고, 하루 산책 및 장난감 놀이 시간을 약 10분씩 늘려 체지방률 상승을 초기에 차단해야 합니다." : lang === "ja" ? "理想体重より約5〜10%超過した状態です。余分な高カロリーおやつを控え、毎日の散歩や遊びの時間を10分ほど増やして初期の管理を行ってください。" : "Body weight is 5-10% over ideal. Discontinue high-carb treats. Increase exercise or interactive play by 10 minutes daily to curb early fat accumulation."
    },
    7: {
      score: 7,
      title: lang === "ko" ? "과체중 (Heavy)" : lang === "ja" ? "過体重 (Heavy)" : "Overweight",
      level: "warn",
      levelText: lang === "ko" ? "경계 (과체중)" : lang === "ja" ? "警戒 (過体重)" : "Warning (Overweight)",
      description: lang === "ko" ? "갈비뼈가 상당히 두꺼운 지방층에 덮여 만지기 어렵습니다. 옆에서 보았을 때 복부가 아래로 처져 있고 허리 굴곡을 거의 찾아보기 힘듭니다." : lang === "ja" ? "肋骨がかなり厚い脂肪層に覆われ、容易に触れません。横から見ると下腹部が少し垂れており、くびれがほぼ消失しています。" : "Ribs are hard to feel under a thick fat layer. Abdomen is noticeably sagged, waist is barely visible.",
      solution: lang === "ko" ? "본격적인 관리가 시급한 골든타임입니다! 간식은 하루 총 섭취 칼로리의 5% 이하로 완전히 제한하고, 계산 결과에 맞춘 일일 권장량(다이어트 기준 계수 적용)을 지키며 점진적인 식단 관리를 시작해 주세요." : lang === "ja" ? "本格的な減量管理が必要なタイミングです。おやつを一日の総カロリーの5%以下に徹底制限し、計算結果に基づく目標値（ダイエット係数を適用）での給与管理を開始してください。" : "Time to step up management. Restrict treats to below 5% of daily calories, apply the calorie target computed (diet factor), and restrict portions."
    },
    8: {
      score: 8,
      title: lang === "ko" ? "비만 (Obese)" : lang === "ja" ? "肥満 (Obese)" : "Obese",
      level: "danger",
      levelText: lang === "ko" ? "위험 (비만)" : lang === "ja" ? "危険 (肥満)" : "Danger (Obese)",
      description: lang === "ko" ? "두꺼운 지방층에 갈비뼈가 완전히 묻혀 있어 만질 수 없습니다. 허리가 아예 불룩하고 척추 부위와 꼬리 기부에도 지방이 만져집니다." : lang === "ja" ? "厚い脂肪層により肋骨が完全に埋もれており、触ることができません。お腹全体が丸く膨らみ、背骨や尻尾の付け根にも脂肪が蓄積しています。" : "Ribs are not palpable under thick fat coverage. Waist is absent, abdomen is distended, fat deposits exist around spine/tail base.",
      solution: lang === "ko" ? "관절염, 당뇨, 심장 질환, 췌장염 등 합병증 발병 확률이 극도로 급증합니다. 고섬유질·저지방 포뮬러의 '체중 감량 전용 사료'로 전환을 고려하고, 무릎에 무리가 가지 않도록 수중 운동이나 아주 부드러운 가벼운 평지 산책부터 차근차근 병행해 주어야 합니다." : lang === "ja" ? "関節炎、糖尿病、心臓疾患、膵炎などの合併症リスクが急上昇します。高繊維質・低脂質の「減量用療法食」への切り替えを検討し、足腰に負担のない穏やかな散歩から始めてください。" : "Elevates risks of arthritis, diabetes, heart disease, and pancreatitis. Consider high-fiber, low-fat weight-loss diets. Exercise gently to protect joints (hydrotherapy or gentle short walks)."
    },
    9: {
      score: 9,
      title: lang === "ko" ? "고도 비만 (Severely Obese)" : lang === "ja" ? "高度肥満 (Severely Obese)" : "Severely Obese",
      level: "danger",
      levelText: lang === "ko" ? "매우 위험 (고도비만)" : lang === "ja" ? "極めて危険 (高度肥満)" : "Severe Danger (Severely Obese)",
      description: lang === "ko" ? "흉부, 복부, 등, 꼬리 주변에 거대한 지방층이 축적되어 있습니다. 움직임이 눈에 띄게 둔하고 관절에 심각한 통증을 유발할 수 있습니다." : lang === "ja" ? "胸、お腹、背中、尻尾周辺に非常に分厚い脂肪が蓄積しています。動きが明らかに鈍くなり、関節に強い負荷と痛みが伴うリスクがあります。" : "Massive fat deposits accumulate along chest, spine, abdomen, and tail. Mobility is highly restricted.",
      solution: lang === "ko" ? "수의사와의 긴밀한 협조 아래 철저히 통제된 다이어트 식단을 실행해야 합니다. 급여 제한(다이어트 요구량 엄수), 탄수화물 위주 간식의 절대 금지, 그리고 슬개골/척추 보호를 위한 쿠션 환경 조성 등 전방위적인 신체 관리가 시급합니다." : lang === "ja" ? "かかりつけの獣医師の指導のもと、徹底した減量プログラムを実施する必要があります。給与量の制限（ダイエット要求量の厳守）、余分なおやつの排除、関節保護のためのクッション性の高い環境作りなど、即時の対策が必要です。" : "Requires immediate veterinary supervision. Strictly manage daily portions (diet targets), completely ban calorie-dense treats, and safeguard joints with carpet/ramps."
    }
  };

  // 동물 종류 선택 변경 시 상태 리셋 및 기본값 매핑
  useEffect(() => {
    if (petType === "dog") {
      setStatus("dog_neutered");
    } else {
      setStatus("cat_neutered");
    }
  }, [petType]);

  // 실시간 계산 로직
  useEffect(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      setIsValid(false);
      return;
    }
    setIsValid(true);

    const computedRer = 70 * Math.pow(w, 0.75);
    setRer(Math.round(computedRer * 10) / 10);

    let factor = 1.0;
    if (petType === "dog") {
      factor = DOG_STATUS_FACTORS[status]?.factor ?? 1.6;
    } else {
      factor = CAT_STATUS_FACTORS[status]?.factor ?? 1.2;
    }

    const computedDer = computedRer * factor;
    setDer(Math.round(computedDer * 10) / 10);

    // 사료 그람수 = DER / 3.5 (사료 칼로리 3,500 kcal/kg 기준)
    const computedFeedGrams = computedDer / 3.5;
    setFeedGrams(Math.round(computedFeedGrams));
  }, [weight, petType, status]);

  const handleWeightChange = (val: string) => {
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



  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 상단 인트로 영역 */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-magenta-light text-magenta text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* 폼 및 결과 컨테이너 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 좌측: 입력 폼 */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-6 sm:p-8 space-y-6">
            
            {/* 동물 선택 토글 */}
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-slate-700 block">{t.labelPetType}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPetType("dog")}
                  className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 text-base font-bold transition-all cursor-pointer ${
                    petType === "dog"
                      ? "border-magenta bg-magenta-light/20 text-magenta shadow-md shadow-magenta/5"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xl">🐶</span>
                  {t.dog}
                </button>
                <button
                  type="button"
                  onClick={() => setPetType("cat")}
                  className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 text-base font-bold transition-all cursor-pointer ${
                    petType === "cat"
                      ? "border-magenta bg-magenta-light/20 text-magenta shadow-md shadow-magenta/5"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xl">🐱</span>
                  {t.cat}
                </button>
              </div>
            </div>

            {/* 나이 및 현재 체중 입력 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 나이 */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                  <span>{t.labelAge}</span>
                  <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs">
                    <button
                      type="button"
                      onClick={() => setAgeType("year")}
                      className={`px-2 py-1 rounded-md font-medium transition-all ${
                        ageType === "year" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                      }`}
                    >
                      {t.unitYears}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgeType("month")}
                      className={`px-2 py-1 rounded-md font-medium transition-all ${
                        ageType === "month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                      }`}
                    >
                      {t.unitMonths}
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
                    {ageType === "year" ? t.unitAgeYears : t.unitAgeMonths}
                  </span>
                </div>
              </div>

              {/* 체중 */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Weight className="w-4 h-4 text-slate-400" />
                  {t.labelWeight}
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
                  <p className="text-xs text-rose-500 font-medium">{t.weightError}</p>
                )}
              </div>
            </div>

            {/* 중성화 및 건강 상태 선택 */}
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-slate-700 block">{t.labelStatus}</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-magenta/30 focus:border-magenta text-slate-800 font-semibold appearance-none cursor-pointer"
                >
                  {petType === "dog"
                    ? Object.entries(DOG_STATUS_FACTORS).map(([key, item]) => (
                        <option key={key} value={key} className="font-semibold py-2">
                          {item.label} (x{item.factor})
                        </option>
                      ))
                    : Object.entries(CAT_STATUS_FACTORS).map(([key, item]) => (
                        <option key={key} value={key} className="font-semibold py-2">
                          {item.label} (x{item.factor})
                        </option>
                      ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
              <p className="text-xs text-slate-400 pl-1">
                {t.statusDescPrefix} {petType === "dog" ? DOG_STATUS_FACTORS[status]?.desc : CAT_STATUS_FACTORS[status]?.desc}
              </p>
            </div>

            {/* BCS 단계 선택 */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-magenta" />
                  {t.labelBcs}
                </label>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> {t.bcsDesc}
                </span>
              </div>

              {/* BCS 슬라이더 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-1">
                  <span>{t.bcsLow}</span>
                  <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">{t.bcsIdeal}</span>
                  <span>{t.bcsObese}</span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="1"
                    max="9"
                    step="1"
                    value={bcs}
                    onChange={(e) => setBcs(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-magenta"
                  />
                </div>
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
                        BCS {bcs}: {currentBcsInfo.title}
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
                {t.btnReset}
              </button>
            </div>

          </div>

          {/* 우측: 계산 결과 & 다이어트 솔루션 */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 결과 종합 카드 */}
            <div className="bg-slate-900 rounded-3xl text-white shadow-xl p-6 sm:p-8 relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-48 h-48 bg-magenta opacity-10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t.resultTitle}</h3>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-2xl font-black text-white">
                      {lang === "ko" ? (
                        `${petType === "dog" ? t.dogGuide : t.catGuide} ${t.resultGuide}`
                      ) : lang === "ja" ? (
                        `${petType === "dog" ? t.dogGuide : t.catGuide} ${t.resultGuide}`
                      ) : (
                        `${petType === "dog" ? "Dog's" : "Cat's"} ${t.resultGuide}`
                      )}
                    </span>
                  </div>
                </div>

                {/* 결과 수치 보드 */}
                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  <div className="flex justify-between items-center bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                      <span className="text-xs font-bold">{t.rerLabel}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-sm sm:text-base text-white">
                        {isValid ? rer.toLocaleString() : "--"}
                      </span>
                      <span className="text-slate-400 text-xs ml-0.5">kcal</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-magenta" />
                      <span className="text-xs font-bold">{t.derLabel}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-base sm:text-lg text-white">
                        {isValid ? der.toLocaleString() : "--"}
                      </span>
                      <span className="text-slate-400 text-xs ml-0.5">kcal</span>
                    </div>
                  </div>

                  <div className="bg-magenta-light/10 border border-magenta/30 p-5 rounded-2xl text-center space-y-2 mt-2">
                    <p className="text-[11px] font-extrabold text-magenta uppercase tracking-wider">{t.feedLabel}</p>
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {isValid ? feedGrams : "--"}
                      </span>
                      <span className="text-slate-300 font-extrabold text-sm">{t.feedUnit}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {t.feedDesc}
                    </p>
                  </div>
                </div>

                {/* BCS 비주얼 슬라이드 바 */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>{t.bcsLabel}</span>
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
                  {t.solTitle}
                </h4>
              </div>

              {bcs >= 6 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800">
                    <TrendingDown className="w-5 h-5 shrink-0 text-rose-500" />
                    <span className="text-xs font-bold leading-normal">
                      {t.warnDiet}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    <p className="font-bold text-slate-800">{t.rulesTitle}</p>
                    <ul className="space-y-2.5 pl-1">
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                        <span>
                          <strong>{t.rule1Title}</strong>
                          {lang === "ko" && `권장 다이어트 급여량인 ${feedGrams}g을 초과하지 않도록 주방 저울을 사용하여 g단위로 칼로리를 정확히 제한해 주세요.`}
                          {lang === "ja" && `推奨ダイエット給与量である${feedGrams}gを超えないよう、キッチンスケール等を用いてg단위(g単位)でカロリー를 厳密に制限してください。`}
                          {lang === "en" && `Do not exceed the recommended diet portions of ${feedGrams}g. Use a kitchen scale to measure daily portions accurately.`}
                        </span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                        <span>
                          <strong>{t.rule2Title}</strong>{t.rule2Desc}
                        </span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                        <span>
                          <strong>{t.rule3Title}</strong>{t.rule3Desc}
                        </span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                        <span>
                          <strong>{t.rule4Title}</strong>{t.rule4Desc}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : bcs <= 3 ? (
                <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  <div className="flex items-center gap-2 p-3.5 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 mb-2">
                    <Info className="w-5 h-5 shrink-0 text-amber-500" />
                    <span className="text-xs font-bold">{t.thinTitle}</span>
                  </div>
                  <ul className="space-y-2.5 pl-1">
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                      <span>
                        <strong>{t.thinRule1Title}</strong>{t.thinRule1Desc}
                      </span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                      <span>
                        <strong>{t.thinRule2Title}</strong>{t.thinRule2Desc}
                      </span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 mb-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                    <span className="text-xs font-bold">{t.idealTitle}</span>
                  </div>
                  <ul className="space-y-2.5 pl-1">
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span>
                        {lang === "ko" && (
                          <>
                            <strong>일일 권장 사료 {feedGrams}g</strong>{t.idealDesc}
                          </>
                        )}
                        {lang === "ja" && (
                          <>
                            <strong>一日の推奨フード給与量 {feedGrams}g</strong>{t.idealDesc}
                          </>
                        )}
                        {lang === "en" && (
                          <>
                            <strong>{feedGrams}g of daily recommended portions</strong> {t.idealDesc}
                          </>
                        )}
                      </span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span>
                        {t.idealTip}
                      </span>
                    </li>
                  </ul>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-500 text-xs leading-relaxed space-y-1">
                <p className="font-extrabold text-slate-700">{t.cautionTitle}</p>
                <p>{t.cautionDesc}</p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
