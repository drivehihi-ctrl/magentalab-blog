"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Droplets, Calendar, ShieldAlert, Coins, Bone } from "lucide-react";

export type CalculatorType = "emergency" | "dm" | "bcs" | "age" | "expenses" | "patella" | "fic";

interface CalculatorBannerProps {
  content?: string;
  title?: string;
  postId?: string;
  forceType?: CalculatorType;
  excludeType?: CalculatorType;
  isRandom?: boolean;
  lang?: "ko" | "en" | "ja";
}

export default function CalculatorBanner({ 
  content = "", 
  title = "", 
  postId,
  forceType,
  excludeType,
  isRandom = false,
  lang = "ko"
}: CalculatorBannerProps) {
  const [selected, setSelected] = useState<CalculatorType>("bcs");
  const [isMounted, setIsMounted] = useState(false);

  // 다국어 라우트 매핑 헬퍼
  const getUrl = (type: CalculatorType) => {
    if (lang === "ko") {
      const koMap: Record<CalculatorType, string> = {
        bcs: "/bcs-calculator",
        age: "/age-calculator",
        dm: "/dm-calculator",
        emergency: "/emergency-calculator",
        expenses: "/petcare-expenses-calculator",
        patella: "/patella-diagnoser",
        fic: "/fic-diagnoser"
      };
      return koMap[type];
    } else {
      const globalTypeMap: Record<CalculatorType, string> = {
        bcs: "bcs-calculator",
        age: "age-calculator",
        dm: "dm-calculator",
        emergency: "emergency-calculator",
        expenses: "petcare-expenses-calculator",
        patella: "patella-diagnoser",
        fic: "fic-diagnoser"
      };
      return `/${lang}/${globalTypeMap[type]}`;
    }
  };

  // 사용자가 명시적으로 전달한 텍스트 및 전용 라벨 매핑 (다국어 딕셔너리)
  const dict = {
    ko: {
      bcs: {
        tag: "체중 상태 & 사료 그람수 분석",
        textBefore: "우리 아이의 정확한 체중 상태와 오늘 먹여야 할 사료의 정확한 그람(g) 수가 궁금하다면? ",
        button: "마젠타랩 반려동물 비만도 및 다이어트 칼로리 계산기 ➔",
        textAfter: " 링크를 통해 무료로 확인해 보세요."
      },
      age: {
        tag: "생애주기 & 인간 나이 진단",
        textBefore: "우리 아이의 태어난 연월만 입력하면 인간 나이 환산은 물론, 현재 생애주기에 딱 맞춘 응급 건강 관리 팁까지 그래픽 카드로 즉시 진단해 드립니다. ",
        button: "안심이 수석연구원의 펫 인간 나이 환산 및 생애주기 참고 도구 가기 ➔",
        textAfter: " 링크를 클릭해 무료로 확인해 보세요."
      },
      dm: {
        tag: "사료 건물(DM) & 하루 음수 요구량",
        textBefore: "사료 뒷면의 영양성분표만 보고 속으셨나요? 수분을 뺀 진짜 고단백 사료 판정법과, 우리 아이 몸무게에 맞는 정확한 필수 음수량을 확인해 보세요. ",
        button: "안심이 수석연구원의 초보 집사용 사료 DM 성분 및 음수량 계산기 가기 ➔",
        textAfter: " 링크를 통해 지금 무료로 계산해 볼 수 있습니다."
      },
      emergency: {
        tag: "🧪 독성 위험 물질 계산기",
        textBefore: "🚨 지금 아이가 위험 음식이나 독성 성분을 먹어서 당황하셨나요? 몸무게와 먹은 양만 입력하면 위험 단계를 즉시 4단계 등급과 게이지로 진단해 드립니다. ",
        button: "안심이 수석연구원의 독성 위험 물질 계산기 가기 ➔",
        textAfter: " 링크를 통해 무료로 고위험 여부를 확인해 보세요."
      },
      expenses: {
        tag: "💰 반려동물 평생 양육비 계산기",
        textBefore: "우리 아이 평생 키우는데 비용이 얼마나 들까요? 사료 등급, 위생용품, 의료비 시뮬레이션으로 평생 유지비와 지출 비중을 확인해 보세요. ",
        button: "안심이 수석연구원의 강아지 / 고양이 평생 양육비 계산기 가기 ➔",
        textAfter: " 링크를 클릭해 지금 무료로 지출 구조를 진단해 보세요."
      },
      patella: {
        tag: "🦴 슬개골 탈구 & 관절 자가진단",
        textBefore: "우리 아이 걷는 모습이 평소와 다르게 절뚝거리나요? 걷는 자세와 행동 패턴만으로 슬개골 탈구 위험 단계를 체크해 보세요. ",
        button: "안심이 수석연구원의 강아지 슬개골 탈구 & 관절 위험 확인 도구 가기 ➔",
        textAfter: " 링크를 클릭해 지금 즉시 무료로 진단해 볼 수 있습니다."
      },
      fic: {
        tag: "🐱 고양이 스트레스 & FIC 방광염 진단",
        textBefore: "최근 이사나 모래 교체 후 고양이가 화장실 실수를 하나요? 영역 동물 고양이의 스트레스 수준과 FIC 방광염 위험 단계를 확인해 보세요. ",
        button: "안심이 수석연구원의 고양이 FIC 방광염 및 스트레스 요인 확인 가기 ➔",
        textAfter: " 링크를 통해 무료로 진단할 수 있습니다."
      }
    },
    en: {
      bcs: {
        tag: "Obesity (BCS) & Daily Calories",
        textBefore: "Want to calculate your pet's precise daily calories (RER/DER) and recommended kibble size (g)? ",
        button: "Open BCS & Daily Calorie Calculator ➔",
        textAfter: " Try it for free in just 10 seconds."
      },
      age: {
        tag: "Lifespan & Human Age Calculator",
        textBefore: "Convert your pet's age to human years and read essential health prevention tips corresponding to their life stage. ",
        button: "Open Pet Human Age & Lifespan Calculator ➔",
        textAfter: " View your customized lifespan diagnostics."
      },
      dm: {
        tag: "Dry Matter (DM) & Daily Water Intake",
        textBefore: "Not sure about real nutrition ratios on back labels? Identify actual dry matter protein levels and optimal daily water requirements. ",
        button: "Open DM Nutrition & Hydration Calculator ➔",
        textAfter: " Get your free nutritional evaluation instantly."
      },
      emergency: {
        tag: "🧪 Pet Toxicity Calculator",
        textBefore: "🚨 Did your dog or cat ingest potentially dangerous foods? Input weight and dosage to screen toxicity hazard levels immediately. ",
        button: "Open Pet Toxicity Calculator ➔",
        textAfter: " Verify hazard ratings for chocolates, onions, grapes, etc."
      },
      expenses: {
        tag: "💰 Pet Lifetime Cost Simulator",
        textBefore: "Curious about the cumulative cost of raising your companion? Adjust food quality, pads, and veterinary schedules. ",
        button: "Open Pet Lifetime Cost Calculator ➔",
        textAfter: " View interactive annual projections for free."
      },
      patella: {
        tag: "🦴 Patella Luxation & Joint Screener",
        textBefore: "Is your pet limping or showing awkward hind leg postures? Self-assess orthopedic risks based on clinical indicators. ",
        button: "Open Patella Luxation Screener ➔",
        textAfter: " Obtain recommended physical exercise tips."
      },
      fic: {
        tag: "🐱 Feline FIC Cystitis Diagnoser",
        textBefore: "Is your cat experiencing urinary issues after home changes? Check behavioral stress levels and FIC bladder concerns. ",
        button: "Open Feline FIC Cystitis & Stress Diagnoser ➔",
        textAfter: " Receive home stress care manuals."
      }
    },
    ja: {
      bcs: {
        tag: "肥満度 (BCS) ＆ ダイエットカロリー",
        textBefore: "愛犬・愛猫の理想的な体重や、1日に必要な推奨給餌量（g）を診断します。 ",
        button: "BCS肥満度＆推奨カロリー計算機を開く ➔",
        textAfter: " 10秒で正確な摂取エネルギー量が分かります。"
      },
      age: {
        tag: "ライフステージ＆人間換算年齢",
        textBefore: "誕生月を入力するだけで、ペットの年齢を人間用に換算し、ステージごとの予防接種スケジュールを提示します。 ",
        button: "ペットの人間年齢換算＆ステージ診断を開く ➔",
        textAfter: " 生涯のケアスケジュールを無料で作成します。"
      },
      dm: {
        tag: "フード乾物量 (DM) ＆ 水分必要量",
        textBefore: "パッケージ裏の成分表示に惑わされていませんか？本当のタンパク質量と、体重別の1日水分量を調べます。 ",
        button: "フードDM値＆推奨飲水量計算機を開く ➔",
        textAfter: " 愛用のフード情報を入力するだけ。"
      },
      emergency: {
        tag: "🧪 ペット中毒危険度計算機",
        textBefore: "🚨 チョコレートやネギ類、ブドウなどの危険食品を誤食しましたか？危険レベルを4段階で判定します。 ",
        button: "ペット中毒危険度計算機を開く ➔",
        textAfter: " 直ちに動物病院への来院が必要かチェックします。"
      },
      expenses: {
        tag: "💰 生涯飼育費シミュレーター",
        textBefore: "ペットを一生涯育てるのに必要な総額は？フード品質や医療費の推移を含め見通しを立てます。 ",
        button: "ペット生涯飼育費＆月間維持費計算機を開く ➔",
        textAfter: " 10秒でグラフを含むレポートを自動生成します。"
      },
      patella: {
        tag: "🦴 膝蓋骨脱臼（パテラ）自己診断",
        textBefore: "愛犬が後ろ足を浮かせて歩くなど、関節の異常がみられますか？歩行姿勢から膝蓋骨の異常リスクを評価します。 ",
        button: "膝蓋骨脱臼（パテラ）関節セルフ診断を開く ➔",
        textAfter: " 自宅でできる初期関節保護法を提案します。"
      },
      fic: {
        tag: "🐱 猫のFIC膀胱炎ストレス診断",
        textBefore: "引っ越しや猫砂の変更後、トイレ以外에서의 排尿トラブルはありませんか？ストレス状態を数値化します。 ",
        button: "猫の特発性膀胱炎（FIC）＆ストレス診断を開く ➔",
        textAfter: " 心理的負担を下げる環境づくりのヒントを提供します。"
      }
    }
  };

  const currentDict = dict[lang] || dict.ko;

  const bannerDesign: Record<CalculatorType, {
    icon: React.ReactNode;
    bgClass: string;
  }> = {
    bcs: {
      icon: <Activity className="w-5 h-5 text-magenta" />,
      bgClass: "from-magenta/5 to-pink-500/5 border-magenta/20"
    },
    age: {
      icon: <Calendar className="w-5 h-5 text-indigo-500" />,
      bgClass: "from-indigo-500/5 to-purple-500/5 border-indigo-500/20"
    },
    dm: {
      icon: <Droplets className="w-5 h-5 text-sky-500" />,
      bgClass: "from-sky-500/5 to-blue-500/5 border-sky-500/20"
    },
    emergency: {
      icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      bgClass: "from-rose-500/5 to-red-500/5 border-rose-500/20"
    },
    expenses: {
      icon: <Coins className="w-5 h-5 text-amber-500" />,
      bgClass: "from-amber-500/5 to-yellow-500/5 border-amber-500/20"
    },
    patella: {
      icon: <Bone className="w-5 h-5 text-emerald-500" />,
      bgClass: "from-emerald-500/5 to-teal-500/5 border-emerald-500/20"
    },
    fic: {
      icon: <Activity className="w-5 h-5 text-purple-500" />,
      bgClass: "from-purple-500/5 to-indigo-500/5 border-purple-500/20"
    }
  };

  useEffect(() => {
    setIsMounted(true);

    if (forceType) {
      setSelected(forceType);
    } else if (isRandom) {
      const keys: CalculatorType[] = ["emergency", "dm", "bcs", "age", "expenses", "patella", "fic"];
      const filtered = keys.filter(k => k !== excludeType);
      const randomIndex = Math.floor(Math.random() * filtered.length);
      setSelected(filtered[randomIndex]);
    } else {
      const textToAnalyze = (title + " " + content).toLowerCase();

      // 다국어 키워드 딕셔너리 정의
      const getScore = (koKeywords: string[], enKeywords: string[], jaKeywords: string[]) => {
        let score = 0;
        const targetKeywords = lang === "en" ? enKeywords : (lang === "ja" ? jaKeywords : koKeywords);
        
        // 추가로 공통적으로 매칭될 수 있는 영문 약어나 핵심어는 언어 무관하게 보조 집계
        const allKeywords = [...targetKeywords];
        
        allKeywords.forEach(kw => {
          if (!kw) return;
          const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
          const matches = textToAnalyze.match(regex);
          score += matches ? matches.length : 0;
        });
        return score;
      };

      const scores = {
        emergency: getScore(
          ["초콜릿", "다크초콜릿", "밀크초콜릿", "포도", "건포도", "자일리톨", "독성 물질", "음독", "치사량", "응급실", "응급 처치", "먹으면 안 되는", "피해야 할 음식", "양파", "대파", "쪽파", "마늘", "중독 증상", "동물병원 응급"],
          ["chocolate", "grape", "raisin", "xylitol", "poison", "toxic", "emergency", "onion", "garlic", "ingest", "should not eat"],
          ["チョコレート", "ブドウ", "レーズン", "キシリトール", "中毒", "誤食", "応急", "ネギ", "ニンニク", "救急"]
        ),
        dm: getScore(
          ["음수량", "식수", "탈수 증상", "조단백", "조지방", "수분 함량", "건물 기준", "dm 성분", "등록성분", "영양성분표", "음수 요구량", "건식 사료", "탄수화물 함량", "조회분"],
          ["dry matter", "dm", "moisture", "crude protein", "crude fat", "water requirement", "hydration", "ash", "kibble", "water intake"],
          ["乾物量", "水分量", "飲水量", "水分必要量", "粗蛋白質", "粗脂肪", "ドライフード", "水分含有量"]
        ),
        bcs: getScore(
          ["비만", "과체중", "다이어트", "체중 조절", "체중 감량", "몸무게", "뚱냥", "뚱견", "이상적 체중", "칼로리 계산", "칼로리 요구량", "rer 계산", "der 계산", "bcs 단계", "비만도"],
          ["obesity", "overweight", "diet", "weight control", "calories", "rer", "der", "bcs", "fat dog", "fat cat"],
          ["肥満", "過体重", "ダイエット", "体重管理", "カロリー", "理想体重", "bcs"]
        ),
        age: getScore(
          ["인간 나이", "사람 나이", "생애주기", "성장기", "노령기", "성숙기", "아깽이", "퍼피", "시니어견", "시니어묘", "반려견 수명", "노화", "개월 수", "태어난 연월", "생애 주기"],
          ["human age", "lifespan", "life stage", "puppy", "kitten", "senior", "months", "aging", "birth year"],
          ["人間年齢", "換算年齢", "ライフステージ", "寿命", "子犬", "子猫", "シニア"]
        ),
        expenses: getScore(
          ["양육비", "유지비", "키우는 비용", "병원비", "사료비", "고정 지출", "누적 양육비", "용품비", "예방 접종비", "의료비 시뮬레이션", "평생 비용"],
          ["cost", "expense", "lifetime cost", "veterinary cost", "food cost", "annual projection", "spending"],
          ["飼育費", "生涯費用", "維持費", "医療費", "病院代", "フード代"]
        ),
        patella: getScore(
          ["슬개골", "탈구", "슬개골 탈구", "관절", "다리", "절뚝", "다리를 절", "뒷다리", "절뚝거림", "십자인대", "쓸개골", "수술비", "영양제"],
          ["patella", "luxation", "limping", "joint", "hind leg", "orthopedic", "knee cap"],
          ["膝蓋骨", "パテラ", "脱臼", "関節", "後ろ足", "跛行"]
        ),
        fic: getScore(
          ["방광염", "특발성 방광염", "fic", "고양이 화장실", "배변 실수", "소변 울음", "스트레스 지수", "뇨의", "혈뇨", "슬러지", "오버그루밍"],
          ["cystitis", "urinary", "bladder", "stress level", "inappropriate urination", "feline fic", "feline cystitis"],
          ["膀胱炎", "特発性膀胱炎", "尿路", "尿石", "血尿", "排尿"]
        )
      };

      let sel: CalculatorType = "bcs";

      // 특정 포스트 수동 예외 처리 (한국어/영어/일본어)
      const isExpensesPost = postId === "1682" || title.toLowerCase().includes("expenses") || title.toLowerCase().includes("양육비") || title.toLowerCase().includes("費用");
      
      if (isExpensesPost) {
        sel = "expenses";
      } else {
        let maxScore = 0;
        (Object.entries(scores) as [CalculatorType, number][]).forEach(([key, val]) => {
          if (val > maxScore) {
            maxScore = val;
            sel = key;
          }
        });
      }
      setSelected(sel);
    }
  }, [content, title, postId, forceType, excludeType, isRandom]);

  if (!isMounted) {
    return null;
  }

  const design = bannerDesign[selected];
  const item = currentDict[selected];

  return (
    <div className={`my-10 p-6 md:p-8 rounded-3xl border bg-gradient-to-br ${design.bgClass} space-y-4 shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-center gap-2">
        {design.icon}
        <span className="text-xs font-black tracking-wider text-gray-800 uppercase bg-white px-3 py-1 rounded-full shadow-sm">
          {item.tag}
        </span>
      </div>
      
      <div className="text-sm md:text-base text-gray-800 leading-relaxed font-bold">
        <span>{item.textBefore}</span>
        <Link 
          href={getUrl(selected)}
          className="inline-block mx-1.5 px-3 py-1.5 bg-magenta text-white text-xs md:text-sm font-black rounded-xl hover:bg-magenta/95 active:scale-95 transition-all shadow-md shadow-magenta/10"
        >
          {item.button}
        </Link>
        <span>{item.textAfter}</span>
      </div>
    </div>
  );
}
