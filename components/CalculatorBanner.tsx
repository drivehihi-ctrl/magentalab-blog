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
}

export default function CalculatorBanner({ 
  content = "", 
  title = "", 
  postId,
  forceType,
  excludeType,
  isRandom = false
}: CalculatorBannerProps) {
  const [selected, setSelected] = useState<CalculatorType>("bcs");
  const [isMounted, setIsMounted] = useState(false);

  // 사용자가 명시적으로 전달한 텍스트 및 전용 라벨 매핑
  const bannerData: Record<CalculatorType, {
    url: string;
    icon: React.ReactNode;
    tag: string;
    textBeforeButton: string;
    buttonText: string;
    textAfterButton: string;
    bgClass: string;
  }> = {
    bcs: {
      url: "/bcs-calculator",
      icon: <Activity className="w-5 h-5 text-magenta" />,
      tag: "체중 상태 & 사료 그람수 분석",
      textBeforeButton: "우리 아이의 정확한 체중 상태와 오늘 먹여야 할 사료의 정확한 그람(g) 수가 궁금하다면? ",
      buttonText: "마젠타랩 반려동물 비만도 및 다이어트 칼로리 계산기 ➔",
      textAfterButton: " 링크를 통해 10초 만에 무료로 진단해 보세요.",
      bgClass: "from-magenta/5 to-pink-500/5 border-magenta/20"
    },
    age: {
      url: "/age-calculator",
      icon: <Calendar className="w-5 h-5 text-indigo-500" />,
      tag: "생애주기 & 인간 나이 진단",
      textBeforeButton: "우리 아이의 태어난 연월만 입력하면 인간 나이 환산은 물론, 현재 생애주기에 딱 맞춘 응급 건강 관리 팁까지 그래픽 카드로 즉시 진단해 드립니다. ",
      buttonText: "안심이 수석연구원의 펫 인간 나이 환산 및 생애주기 진단기 가기 ➔",
      textAfterButton: " 링크를 클릭해 10초 만에 무료로 확인해 보세요.",
      bgClass: "from-indigo-500/5 to-purple-500/5 border-indigo-500/20"
    },
    dm: {
      url: "/dm-calculator",
      icon: <Droplets className="w-5 h-5 text-sky-500" />,
      tag: "사료 건물(DM) & 하루 음수 요구량",
      textBeforeButton: "사료 뒷면의 영양성분표만 보고 속으셨나요? 수분을 뺀 진짜 고단백 사료 판정법과, 우리 아이 몸무게에 맞는 정확한 필수 음수량을 10초 만에 확인해 보세요. ",
      buttonText: "안심이 수석연구원의 초보 집사용 사료 DM 성분 및 음수량 계산기 가기 ➔",
      textAfterButton: " 링크를 통해 지금 무료로 계산해 볼 수 있습니다.",
      bgClass: "from-sky-500/5 to-blue-500/5 border-sky-500/20"
    },
    emergency: {
      url: "/emergency-calculator",
      icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      tag: "🚨 반려동물 중독 응급 계산기",
      textBeforeButton: "🚨 지금 아이가 위험 음식을 먹어서 당황하셨나요? 몸무게와 먹은 양만 입력하면 위험 단계를 즉시 4단계 등급과 게이지로 진단해 드립니다. ",
      buttonText: "안심이 수석연구원의 반려동물 중독 응급 계산기 가기 ➔",
      textAfterButton: " 링크를 통해 10초 만에 무료로 고위험 여부를 판단해 보세요.",
      bgClass: "from-rose-500/5 to-red-500/5 border-rose-500/20"
    },
    expenses: {
      url: "/Petcareexpenses",
      icon: <Coins className="w-5 h-5 text-amber-500" />,
      tag: "💰 반려동물 평생 양육비 계산기",
      textBeforeButton: "우리 아이 평생 키우는데 비용이 얼마나 들까요? 사료 등급, 위생용품, 의료비 시뮬레이션으로 평생 유지비와 지출 비중을 10초 만에 확인해 보세요. ",
      buttonText: "안심이 수석연구원의 강아지 / 고양이 평생 양육비 계산기 가기 ➔",
      textAfterButton: " 링크를 클릭해 지금 무료로 지출 구조를 진단해 보세요.",
      bgClass: "from-amber-500/5 to-yellow-500/5 border-amber-500/20"
    },
    patella: {
      url: "/patella",
      icon: <Bone className="w-5 h-5 text-emerald-500" />,
      tag: "🦴 슬개골 탈구 & 관절 자가진단",
      textBeforeButton: "우리 아이 걷는 모습이 평소와 다르게 절뚝거리나요? 걷는 자세와 행동 패턴만으로 슬개골 탈구 위험 단계를 10초 만에 체크해 보세요. ",
      buttonText: "안심이 수석연구원의 강아지 슬개골 탈구 & 관절 자가 진단기 가기 ➔",
      textAfterButton: " 링크를 클릭해 지금 즉시 무료로 진단해 볼 수 있습니다.",
      bgClass: "from-emerald-500/5 to-teal-500/5 border-emerald-500/20"
    },
    fic: {
      url: "/FIC",
      icon: <Activity className="w-5 h-5 text-purple-500" />,
      tag: "🐱 고양이 스트레스 & FIC 방광염 진단",
      textBeforeButton: "최근 이사나 모래 교체 후 고양이가 화장실 실수를 하나요? 영역 동물 고양이의 스트레스 수준과 FIC 방광염 위험 단계를 10초 만에 확인해 보세요. ",
      buttonText: "안심이 수석연구원의 고양이 FIC 방광염 및 스트레스 진단기 가기 ➔",
      textAfterButton: " 링크를 통해 무료로 진단할 수 있습니다.",
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
      // 본문과 타이틀을 합쳐 소문자로 통일하여 키워드 매칭 분석
      const textToAnalyze = (title + " " + content).toLowerCase();

      // 각 계산기 테마별 키워드 매칭 개수 카운트 함수
      const getScore = (keywords: string[]) => {
        return keywords.reduce((score, kw) => {
          const regex = new RegExp(kw, "gi");
          const matches = textToAnalyze.match(regex);
          return score + (matches ? matches.length : 0);
        }, 0);
      };

      const scores = {
        emergency: getScore([
          "초콜릿", "다크초콜릿", "밀크초콜릿", "포도", "건포도", "자일리톨", 
          "독성 물질", "음독", "치사량", "응급실", "응급 처치", "먹으면 안 되는", 
          "피해야 할 음식", "치명적인", "양파", "대파", "쪽파", "마늘", 
          "먹었을 때", "삼켰을 때", "초콜렛", "중독 증상", "동물병원 응급"
        ]),
        dm: getScore([
          "음수량", "식수", "탈수 증상", "조단백", "조지방", "수분 함량", 
          "건물 기준", "dm 성분", "등록성분", "영양성분표", "음수 요구량", 
          "건식 사료", "탄수화물 함량", "조회분"
        ]),
        bcs: getScore([
          "비만", "과체중", "다이어트", "체중 조절", "체중 감량", "몸무게", 
          "뚱냥", "뚱견", "이상적 체중", "칼로리 계산", "칼로리 요구량", 
          "rer 계산", "der 계산", "bcs 단계", "비만도"
        ]),
        age: getScore([
          "인간 나이", "사람 나이", "생애주기", "성장기", "노령기", "성숙기", 
          "아깽이", "퍼피", "시니어견", "시니어묘", "반려견 수명", "노화", 
          "개월 수", "태어난 연월", "생애 주기"
        ]),
        expenses: getScore([
          "양육비", "유지비", "키우는 비용", "병원비", "사료비", "고정 지출", 
          "누적 양육비", "용품비", "예방 접종비", "의료비 시뮬레이션", "평생 비용"
        ]),
        patella: getScore([
          "슬개골", "탈구", "슬개골 탈구", "관절", "다리", "절뚝", "다리를 절", 
          "뒷다리", "절뚝거림", "십자인대", "쓸개골", "수술비", "영양제"
        ]),
        fic: getScore([
          "방광염", "특발성 방광염", "fic", "고양이 화장실", "배변 실수", 
          "소변 울음", "스트레스 지수", "뇨의", "혈뇨", "슬러지", "오버그루밍"
        ])
      };

      // 가장 점수가 높은 카테고리를 최종 매칭
      let sel: CalculatorType = "bcs"; // 매칭되지 않는 경우의 기본값은 비만도 계산기

      if (postId === "1682") {
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

  const data = bannerData[selected];

  return (
    <div className={`my-10 p-6 md:p-8 rounded-3xl border bg-gradient-to-br ${data.bgClass} space-y-4 shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-center gap-2">
        {data.icon}
        <span className="text-xs font-black tracking-wider text-gray-800 uppercase bg-white px-3 py-1 rounded-full shadow-sm">
          {data.tag}
        </span>
      </div>
      
      <div className="text-sm md:text-base text-gray-800 leading-relaxed font-bold">
        <span>{data.textBeforeButton}</span>
        <Link 
          href={data.url}
          className="inline-block mx-1.5 px-3 py-1.5 bg-magenta text-white text-xs md:text-sm font-black rounded-xl hover:bg-magenta/95 active:scale-95 transition-all shadow-md shadow-magenta/10"
        >
          {data.buttonText}
        </Link>
        <span>{data.textAfterButton}</span>
      </div>
    </div>
  );
}
