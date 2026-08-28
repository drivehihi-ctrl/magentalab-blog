"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Heart, 
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Sparkle,
  Activity
} from "lucide-react";

interface LifeStageInfo {
  stageName: string;
  minHumanAge: number;
  maxHumanAge: number;
  colorClass: string;
  badgeClass: string;
  desc: string;
  tips: string[];
}

interface AgeCalculatorProps {
  lang?: "ko" | "en" | "ja";
}

export default function AgeCalculator({ lang = "ko" }: AgeCalculatorProps) {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);

  // 입력 폼 상태 관리
  const [petType, setPetType] = useState<"dog" | "cat">("dog");
  const [dogSize, setDogSize] = useState<"small" | "medium" | "large">("small");
  const [birthYear, setBirthYear] = useState<string>("2023");
  const [birthMonth, setBirthMonth] = useState<string>("6");

  // 애니메이션 제어용 상태
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  // 최종 도출된 계산 값 저장 상태
  const [computedPetAge, setComputedPetAge] = useState<{ years: number; months: number }>({ years: 0, months: 0 });
  const [computedHumanAge, setComputedHumanAge] = useState<number>(0);

  // Multilingual translation dictionaries
  const dict = {
    ko: {
      title: "반려동물 나이 계산기 & 생애주기 가이드",
      desc: "반려동물의 종류, 체격, 출생 연월을 기반으로 사람 나이 환산 참고값과 생애주기를 안내합니다.",
      badge: "생애주기 계산기",
      labelPetType: "반려동물 종류",
      dog: "강아지 (Dog)",
      cat: "고양이 (Cat)",
      labelDogSize: "견종 크기 분류",
      sizeSmall: "소형견",
      sizeSmallDesc: "10kg 미만",
      sizeMedium: "중형견",
      sizeMediumDesc: "10~25kg",
      sizeLarge: "대형견",
      sizeLargeDesc: "25kg 초과",
      labelBirth: "출생 연월 선택",
      birthDesc: "정확한 출생 연월을 선택하면 개월 수에 비례한 사람 나이 참고값을 계산해 드립니다.",
      btnCalculate: "나이와 생애주기 확인하기",
      btnAnalyzing: "계산 중...",
      btnReset: "초기화",
      resultTitle: "나이 및 생애주기 안내",
      resultIntro: "올해 실제 나이 살 개월인 우리 아이는",
      resultMain: "인간 나이로 환산 시 입니다.",
      guideTitle: "맞춤형 생활 관리 가이드",
      guideSubtitle: "생활 관리 추천 수칙 4가지:",
      tipTitle: "잠깐! 알고 계셨나요?",
      tipDesc: "반려동물의 시간은 인간보다 약 5~7배 빠르게 흘러갑니다. 특히 대형견은 소형견보다 몸집이 크고 신진대사가 달라 노화 진행 속도가 훨씬 가파릅니다. 나이에 최적화된 올바른 보조 영양제 급여와 식단 관리가 건강 수명을 최대 3년 이상 연장할 수 있습니다.",
      years: "살",
      months: "개월",
      yearsUnit: "세",
      loading: "로딩 중입니다...",
      stages: {
        growth: {
          stageName: "성장기 (Growth / Junior)",
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
          desc: "세심한 밀착 케어와 만성 질환 예방관리가 최우선시되는 노후 실버 단계입니다.",
          tips: [
            "관절 통증 완화와 연골 보호를 위해 콘드로이친, 글루코사민, 초록입홍합 성분의 영양제를 필수로 급여하세요.",
            "신장 및 간 기능 저하 여부를 체크하기 위해 최소 6개월 주기로 동물병원 혈액/검뇨 검사를 진행하세요.",
            "치매(인지기능장애증후군)를 방지하기 위해 노즈워크 놀이와 가벼운 후각 자극 산책을 꾸준히 이어 가세요.",
            "체온 조절 능력이 저하되므로 실내 온도를 항상 따뜻하게 유지하고, 푹신한 정형외과용 메모리폼 쿠션을 제공하세요."
          ]
        }
      }
    },
    en: {
      title: "Pet Age Calculator & Life Stage Guide",
      desc: "Calculates approximate human age equivalents and life stages based on your pet's species, breed size, and exact age.",
      badge: "Life Stage Calculator",
      labelPetType: "Pet Type",
      dog: "Dog",
      cat: "Cat",
      labelDogSize: "Breed Size Classification",
      sizeSmall: "Small Dog",
      sizeSmallDesc: "Under 10kg",
      sizeMedium: "Medium Dog",
      sizeMediumDesc: "10 to 25kg",
      sizeLarge: "Large Dog",
      sizeLargeDesc: "Over 25kg",
      labelBirth: "Select Date of Birth",
      birthDesc: "Select the exact birth year and month for a more accurate human age estimate.",
      btnCalculate: "Check Age & Life Stage",
      btnAnalyzing: "Calculating...",
      btnReset: "Reset",
      resultTitle: "Age & Life Stage Guide",
      resultIntro: "Your pet, currently years and months old,",
      resultMain: "is equivalent to a human aged years old.",
      guideTitle: "Tailored Lifestyle Guide",
      guideSubtitle: "4 Recommended Lifestyle Rules:",
      tipTitle: "Did You Know?",
      tipDesc: "A pet's time flows approximately 5 to 7 times faster than a human's. Large breeds age much quicker due to metabolism and size constraints. Providing age-appropriate food and antioxidants can extend their healthy lifespan by up to 3 years.",
      years: " years",
      months: " months",
      yearsUnit: " years old",
      loading: "Loading...",
      stages: {
        growth: {
          stageName: "Growth / Junior",
          desc: "The first developmental phase of life where basic physical stamina and immune systems are established.",
          tips: [
            "Feed high-protein and high-calcium kitten/puppy specific formulas rich in colostrum and L-lysine.",
            "Carefully follow vaccination schedules at 3 to 4 months of age.",
            "Expose them to different sounds, environments, and new stimuli daily for healthy socialization.",
            "Provide safe chew toys to relieve teething pain and protect erupting permanent teeth."
          ]
        },
        maturity: {
          stageName: "Adult / Active",
          desc: "A healthy prime adult stage where bodily functions peak and energy levels are highest.",
          tips: [
            "Monitor calories and weights post-neutering as metabolic rates drop, leading to obesity risks.",
            "Ensure at least 30 minutes of energy release daily (outdoor walks for dogs, wand toys for cats).",
            "Establish daily teeth brushing routines and dental chews to prevent early periodontal diseases.",
            "Schedule annual checkups, core vaccine boosters, and heartworm preventatives."
          ]
        },
        matureAdulthood: {
          stageName: "Mature / Middle-aged",
          desc: "A transition stage where cellular aging slowly begins and moderate energy declines occur.",
          tips: [
            "Install pet stairs near couches/beds to prevent joint diseases (patellar luxation, disc herniation).",
            "Incorporate antioxidants like Vitamin C, Vitamin E, and Coenzyme Q10 into their diet.",
            "Switch to senior-friendly diets with high digestibility and dietary fiber suited for slower digestion.",
            "Schedule annual blood panels and abdominal ultrasounds even if they appear healthy."
          ]
        },
        senior: {
          stageName: "Senior / Geriatric",
          desc: "A golden age where comprehensive close care and chronic disease management are top priorities.",
          tips: [
            "Feed joint supplements containing chondroitin, glucosamine, and green-lipped mussel.",
            "Run geriatric blood and urine panels every 6 months to monitor renal and liver functions.",
            "Perform nosework and light sniffing walks to prevent cognitive dysfunction syndrome (dementia).",
            "Keep rooms warm as thermoregulation drops, and provide orthotic memory foam beds."
          ]
        }
      }
    },
    ja: {
      title: "ペット年齢計算機＆ライフステージガイド",
      desc: "動物の種類、体の大きさ、誕生年月を基に、人間の年齢換算参考値とライフステージをご案内します。",
      badge: "ライフステージ計算機",
      labelPetType: "ペットの種類",
      dog: "犬 (Dog)",
      cat: "猫 (Cat)",
      labelDogSize: "犬のサイズ分類",
      sizeSmall: "小型犬",
      sizeSmallDesc: "10kg 未満",
      sizeMedium: "中型犬",
      sizeMediumDesc: "10~25kg",
      sizeLarge: "大型犬",
      sizeLargeDesc: "25kg 超過",
      labelBirth: "誕生年月選択",
      birthDesc: "正確な誕生年月を選択すると、生月数に比例した人間の年齢参考値を計算します。",
      btnCalculate: "年齢とライフステージを確認する",
      btnAnalyzing: "計算中...",
      btnReset: "リセット",
      resultTitle: "年齢およびライフステージのご案内",
      resultIntro: "今年で実年齢が 歳 ヶ月になるうちの子は",
      resultMain: "人間の年齢に換算すると 歳になります。",
      guideTitle: "オーダーメイド生活管理ガイド",
      guideSubtitle: "生活管理の4つの推奨ルール:",
      tipTitle: "ご存知でしたか？",
      tipDesc: "ペットの時間は人間の約5〜7倍の速さで流れます。特に大型犬は小型犬よりも体が大きく代謝が異なるため、老化の進行が非常に早いです。年齢に最適化されたサプリメントや食事管理を行うことで、健康寿命を最大3年以上延ばすことができます。",
      years: "歳",
      months: "ヶ月",
      yearsUnit: "歳",
      loading: "ロード中...",
      stages: {
        growth: {
          stageName: "成長期 (Growth / Junior)",
          desc: "基礎体力と免疫システムが活発に形成される生涯の最初の段階です。",
          tips: [
            "成長期専用の高タンパク・高カルシウムフード（初乳成分やL-リジンが豊富）を与えてください。",
            "生後3〜4ヶ月頃の基礎予防接種（混合ワクチンなど）のスケジュールを厳守してください。",
            "適切な社会化教育のため、毎日様々な音、環境、新しい刺激を経験させてあげましょう。",
            "歯の生え変わり時期には、歯茎の痛みの緩和と永久歯の管理のために安全な噛むおもちゃを与えてください。"
          ]
        },
        maturity: {
          stageName: "成熟期 (Adult / Active)",
          desc: "身体機能がピークに達し、エネルギーが最も満ち溢れる健康な成犬・成猫段階です。",
          tips: [
            "去勢・避妊手術後は代謝量が減少し肥満になりやすいため、低カロリー食と体重管理が必要です。",
            "一日最低30分以上（犬は散歩、猫はおもちゃでの狩りごっこ）の運動が必須です。",
            "口腔環境が悪化しやすいため、一日1回の歯磨きやデンタルガムの給与を習慣化してください。",
            "年に1回の定期混合ワクチンの追加接種と、基本的なフィラリア予防を忘れないでください。"
          ]
        },
        matureAdulthood: {
          stageName: "中年期 (Mature / Middle-aged)",
          desc: "細胞の老化がゆっくり始まり、緩やかな活動量の低下が見られる移行段階です。",
          tips: [
            "関節疾患（膝蓋骨脱구、椎間板ヘルニア）予防のため、ソファやベッドの横にペット用スロープを設置してください。",
            "細胞の酸化を防ぐため、ビタミンC、ビタミンE、コエンザイムQ10などの抗酸化物質を補給してください。",
            "消化機能の低下に合わせ、消化吸収率が高く繊維質が豊富なシニア専用フードへの移行を検討してください。",
            "外見上は健康に見えても、年に1回は血液検査や腹部超音波検査を受けることをお勧めします。"
          ]
        },
        senior: {
          stageName: "高齢期 (Senior / Geriatric)",
          desc: "細やかなケアと慢性疾患の予防・管理が最優先されるシニア・シルバー段階です。",
          tips: [
            "関節痛の緩和と軟骨保護のため、コンドロイチン、グルコサミン、緑イ貝配合のサプリメントを与えてください。",
            "腎臓や肝臓の機能低下をチェックするため、最低6ヶ月周期で動物病院で血液・尿検査を行ってください。",
            "認知症（認知機能障害症候群）を予防するため、ノーズワーク遊びや軽い散歩を続けてください。",
            "体温調節能力が低下するため、室温を常に暖かく保ち、体圧分散のメモリフォームベッドを用意してください。"
          ]
        }
      }
    }
  };

  const t = dict[lang] || dict.ko;

  // 생애주기 분류 정보 생성기
  const getLifeStages = () => {
    return {
      growth: {
        stageName: t.stages.growth.stageName,
        minHumanAge: 0,
        maxHumanAge: 19,
        colorClass: "from-sky-500/20 to-blue-500/20 border-blue-200/50 text-blue-900",
        badgeClass: "bg-blue-500 text-white shadow-blue-500/20",
        desc: t.stages.growth.desc,
        tips: t.stages.growth.tips
      },
      maturity: {
        stageName: t.stages.maturity.stageName,
        minHumanAge: 20,
        maxHumanAge: 39,
        colorClass: "from-emerald-500/20 to-teal-500/20 border-emerald-200/50 text-emerald-900",
        badgeClass: "bg-emerald-500 text-white shadow-emerald-500/20",
        desc: t.stages.maturity.desc,
        tips: t.stages.maturity.tips
      },
      matureAdulthood: {
        stageName: t.stages.matureAdulthood.stageName,
        minHumanAge: 40,
        maxHumanAge: 54,
        colorClass: "from-amber-500/20 to-orange-500/20 border-amber-200/50 text-amber-900",
        badgeClass: "bg-amber-500 text-white shadow-amber-500/20",
        desc: t.stages.matureAdulthood.desc,
        tips: t.stages.matureAdulthood.tips
      },
      senior: {
        stageName: t.stages.senior.stageName,
        minHumanAge: 55,
        maxHumanAge: 200,
        colorClass: "from-rose-500/20 to-pink-500/20 border-rose-200/50 text-rose-900",
        badgeClass: "bg-rose-500 text-white shadow-rose-500/20",
        desc: t.stages.senior.desc,
        tips: t.stages.senior.tips
      }
    };
  };

  const lifeStagesData = getLifeStages();
  const [currentStage, setCurrentStage] = useState<LifeStageInfo>(lifeStagesData.growth);

  // 연도 셀렉트 박스 아이템 생성 (2000년부터 현재년도까지)
  const yearsList = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => String(currentYear - i));
  const monthsList = Array.from({ length: 12 }, (_, i) => String(i + 1));

  // 계산 메인 엔진
  const calculateAge = () => {
    setIsAnalyzing(true);
    setShowResult(false);

    setTimeout(() => {
      const birthY = parseInt(birthYear);
      const birthM = parseInt(birthMonth);

      const diffMonths = Math.max(0, (currentYear - birthY) * 12 + (currentMonth - birthM));
      const petYears = Math.floor(diffMonths / 12);
      const petMonths = diffMonths % 12;

      setComputedPetAge({ years: petYears, months: petMonths });

      let humanAge = 0;

      if (petType === "cat") {
        if (diffMonths <= 12) {
          humanAge = diffMonths * (15 / 12);
        } else if (diffMonths <= 24) {
          humanAge = 15 + (diffMonths - 12) * ((24 - 15) / 12);
        } else {
          humanAge = 24 + (diffMonths - 24) * (4 / 12);
        }
      } else {
        if (dogSize === "small") {
          if (diffMonths <= 12) {
            humanAge = diffMonths * (15 / 12);
          } else if (diffMonths <= 24) {
            humanAge = 15 + (diffMonths - 12) * ((24 - 15) / 12);
          } else {
            humanAge = 24 + (diffMonths - 24) * (4 / 12);
          }
        } else if (dogSize === "medium") {
          if (diffMonths <= 12) {
            humanAge = diffMonths * (15 / 12);
          } else if (diffMonths <= 24) {
            humanAge = 15 + (diffMonths - 12) * ((24 - 15) / 12);
          } else {
            humanAge = 24 + (diffMonths - 24) * (5 / 12);
          }
        } else {
          if (diffMonths <= 12) {
            humanAge = diffMonths * (15 / 12); // AVMA typically uses 15 for year 1 across sizes
          } else if (diffMonths <= 24) {
            humanAge = 15 + (diffMonths - 12) * ((24 - 15) / 12);
          } else {
            humanAge = 24 + (diffMonths - 24) * (7.5 / 12);
          }
        }
      }

      const finalHumanAge = Math.max(0, Math.round(humanAge));
      setComputedHumanAge(finalHumanAge);

      const getDogLifeStage = (months: number, size: string) => {
        if (months < 12) return lifeStagesData.growth;
        if (months < 84) return lifeStagesData.maturity;
        if (size === "large") {
           if (months < 96) return lifeStagesData.matureAdulthood;
           return lifeStagesData.senior;
        } else {
           if (months < 120) return lifeStagesData.matureAdulthood;
           return lifeStagesData.senior;
        }
      };

      const getCatLifeStage = (months: number) => {
        if (months < 12) return lifeStagesData.growth;
        if (months < 84) return lifeStagesData.maturity;
        if (months < 120) return lifeStagesData.matureAdulthood;
        return lifeStagesData.senior;
      };

      let stage: LifeStageInfo;
      if (petType === "cat") {
        stage = getCatLifeStage(diffMonths);
      } else {
        stage = getDogLifeStage(diffMonths, dogSize);
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
            <span>{t.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
            {t.title}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {t.desc}
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
                <label className="text-sm font-bold text-slate-300 block">{t.labelPetType}</label>
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
                    {t.dog}
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
                    {t.cat}
                  </button>
                </div>
              </div>

              {/* 강아지일 경우 견종 크기 분류 노출 */}
              <div 
                className={`transition-all duration-300 overflow-hidden ${
                  petType === "dog" ? "max-h-[160px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                <div className="space-y-2.5 pt-1">
                  <label className="text-sm font-bold text-slate-300 block">{t.labelDogSize}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { size: "small", label: t.sizeSmall, desc: t.sizeSmallDesc },
                      { size: "medium", label: t.sizeMedium, desc: t.sizeMediumDesc },
                      { size: "large", label: t.sizeLarge, desc: t.sizeLargeDesc }
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
                  {t.labelBirth}
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
                          {y}{lang === "ko" ? "년" : lang === "ja" ? "年" : ""}
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
                          {m}{lang === "ko" ? "월" : lang === "ja" ? "月" : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3 mt-2">
                  <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                  <p className="text-xs text-slate-400 leading-normal font-medium">
                    {t.birthDesc}
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
                  {t.btnAnalyzing}
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  {t.btnCalculate}
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl cursor-pointer transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t.btnReset}
            </button>
          </div>

          {/* 결과 표출 카드 */}
          <div
            className={`transition-all duration-500 transform ease-out ${
              showResult
                ? "opacity-100 translate-y-0 scale-100 max-h-[1000px]"
                : "opacity-0 -translate-y-4 scale-95 max-h-0 overflow-hidden pointer-events-none"
            }`}
          >
            <div className="border-t border-white/10 pt-8 space-y-6">
              
              {/* 메인 결과 안내 보드 */}
              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-magenta/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="text-center mb-6">
                  <span className="text-xs font-black tracking-widest text-magenta uppercase bg-magenta-light/10 border border-magenta/20 px-3 py-1 rounded-full">
                    {t.resultTitle}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 섹션 1: 실제 나이 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col justify-center">
                    <p className="text-slate-400 text-xs sm:text-sm font-bold mb-1">
                      {lang === "ko" ? "실제 나이" : lang === "ja" ? "実年齢" : "Actual Age"}
                    </p>
                    <p className="text-white text-xl sm:text-2xl font-black">
                      {lang === "en" 
                        ? `${computedPetAge.years}yrs ${computedPetAge.months}mo` 
                        : `${computedPetAge.years}${t.years} ${computedPetAge.months}${t.months}`}
                    </p>
                  </div>

                  {/* 섹션 2: 사람 나이 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-magenta/20 rounded-full blur-xl pointer-events-none" />
                    <p className="text-slate-400 text-xs sm:text-sm font-bold mb-1">
                      {lang === "ko" ? "사람 나이 참고값" : lang === "ja" ? "人間の年齢参考値" : "Approx. Human Age"}
                    </p>
                    <p className="text-magenta drop-shadow-[0_0_8px_rgba(229,0,126,0.3)] text-2xl sm:text-3xl font-black">
                      {lang === "ko" ? `약 ${computedHumanAge}세` : lang === "ja" ? `約${computedHumanAge}歳` : `~${computedHumanAge} years`}
                    </p>
                  </div>

                  {/* 섹션 3: 생애주기 */}
                  <div className={`border rounded-2xl p-5 text-center flex flex-col justify-center ${currentStage.colorClass}`}>
                    <p className="opacity-70 text-xs sm:text-sm font-bold mb-1">
                      {lang === "ko" ? "현재 생애주기" : lang === "ja" ? "現在のライフステージ" : "Current Life Stage"}
                    </p>
                    <p className="text-xl sm:text-2xl font-black">
                      {currentStage.stageName.split(" (")[0]}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 mt-4 space-y-2">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-magenta">안내:</span> {lang === "ko" ? "사람 나이는 이해를 돕기 위한 대략적인 환산값입니다. 실제 노화 속도는 품종, 체격, 건강 상태에 따라 다를 수 있습니다." : lang === "ja" ? "人間の年齢は理解を助けるための大まかな換算値です。実際の老化の進行は、品種、体格、健康状態によって異なる場合があります。" : "Human age is an approximate equivalent to help understanding. Actual aging speed varies by breed, size, and health."}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-magenta">안내:</span> {lang === "ko" ? "크기와 품종에 따라 생애주기 전환 시점은 조금씩 다를 수 있으나, 전반적인 건강 관리에서는 참고용 사람 나이보다 실제 나이와 생애주기를 더 중요하게 봅니다." : lang === "ja" ? "体格や品種によってライフステージの移行時期は異なりますが、健康管理においては人間の年齢よりも実年齢とライフステージをより重視します。" : "Life stage transition times vary by size and breed, but for general healthcare, actual age and life stage are more important than human age equivalents."}
                  </p>
                </div>
              </div>

              {/* 맞춤형 수의학 가이드 솔루션 */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <h3 className="font-extrabold text-white text-base sm:text-lg">
                    🩺 {currentStage.stageName.split(" (")[0]} {t.guideTitle}
                  </h3>
                </div>

                <div className="space-y-4 text-slate-300">
                  <div className={`p-4 rounded-2xl border ${currentStage.colorClass} space-y-1.5`}>
                    <p className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                      <Sparkle className="w-4 h-4 text-magenta animate-pulse" />
                      {lang === "ko" ? "신체 주기 특징" : lang === "ja" ? "身体的特徴" : "Life Stage Characteristics"}
                    </p>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed">
                      {currentStage.desc}
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    <p className="font-bold text-slate-100 text-sm sm:text-base">{t.guideSubtitle}</p>
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
                    {t.tipTitle}
                  </p>
                  <p>
                    {t.tipDesc}
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

