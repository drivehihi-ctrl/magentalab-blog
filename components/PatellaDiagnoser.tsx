"use client";

import { useState } from "react";
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  RotateCcw, 
  ChevronRight, 
  Sparkles, 
  Heart, 
  Check,
  CheckSquare
} from "lucide-react";

type DogSize = "small" | "large";

interface Symptom {
  id: string;
  text: string;
}

const SYMPTOMS: Symptom[] = [
  { id: "s1", text: "걸을 때 가끔 다리를 절거나 뒤로 털어내는 행동을 한다" },
  { id: "s2", text: "다리를 만지면 깨갱거리며 예민하게 반응한다" },
  { id: "s3", text: "산책할 때 예전보다 쉽게 지치고 주저앉는다" },
  { id: "s4", text: "뒷모습을 보았을 때 다리 모양이 어색하거나 O자형이다" }
];

export default function PatellaDiagnoser() {
  const [dogSize, setDogSize] = useState<DogSize>("small");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);

  const handleSymptomToggle = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handleReset = () => {
    setDogSize("small");
    setAge("");
    setWeight("");
    setSelectedSymptoms([]);
    setShowResult(false);
  };

  const checkCount = selectedSymptoms.length;

  // 진단 결과 판정 기준 정의
  let resultLevel: "green" | "yellow" | "red" = "green";
  let resultTitle = "이상 없음 (초록)";
  let badgeClass = "bg-emerald-500 text-white shadow-emerald-500/30";
  let glassClass = "bg-emerald-500/5 backdrop-blur-xl border-emerald-500/20 shadow-emerald-500/5";
  let textClass = "text-emerald-700";
  let statusDesc = "현재 관절 및 슬개골 탈구 징후가 거의 보이지 않는 매우 정상적이고 건강한 상태입니다.";
  let actionGuide = "소형견은 선천적으로 슬개골 탈구가 발생하기 쉽습니다. 일상 속에서 침대나 소파에 미끄럼 방지 계단을 설치하고 발바닥 털을 짧게 관리하여 미끄러짐을 방지해 주세요. 꾸준하고 규칙적인 평지 산책을 통해 허벅지 근력을 기르는 것이 최고의 예방책입니다.";

  if (checkCount >= 3) {
    resultLevel = "red";
    resultTitle = "수의사 진료 필요 고위험 (빨강)";
    badgeClass = "bg-rose-500 text-white shadow-rose-500/30 animate-pulse";
    glassClass = "bg-rose-500/5 backdrop-blur-xl border-rose-500/20 shadow-rose-500/5";
    textClass = "text-rose-700";
    statusDesc = "관절 통증 및 슬개골 탈구 진행 가능성이 매우 높은 고위험군 단계입니다.";
    actionGuide = "다리를 저는 파행 행동과 통증 반응은 슬개골 탈구 2~3단계 이상으로 진행되었거나 십자인대 손상 등의 심각한 관절 적신호일 수 있습니다. 방치 시 십자인대 파열, 퇴행성 관절염 등 2차 만성 질환으로 발전해 큰 수술로 이어질 수 있으므로 빠른 시일 내에 동물병원 수의사의 정밀 엑스레이 진료를 강력히 권장합니다.";
  } else if (checkCount >= 1) {
    resultLevel = "yellow";
    resultTitle = "초기 관찰 단계 (노랑)";
    badgeClass = "bg-amber-500 text-white shadow-amber-500/30";
    glassClass = "bg-amber-500/5 backdrop-blur-xl border-amber-500/20 shadow-amber-500/5";
    textClass = "text-amber-700";
    statusDesc = "슬개골 탈구 초기 혹은 관절 무리 징후가 간헐적으로 포착되는 단계입니다.";
    actionGuide = "관절 연골 손상이나 인대 늘어남이 시작되는 과도기일 수 있습니다. 두 발로 서는 행동, 높은 곳에서 뛰어내리는 격렬한 수직 점프를 철저히 차단해 주세요. 관절의 압력을 최소화하기 위해 '체중 감량'을 최우선으로 진행하고, 연골 재생 및 염증 지연에 도움을 주는 관절 전용 영양 공급을 시작해야 하는 최적의 타이밍입니다.";
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-magenta-light text-magenta text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            안심이 자가진단 시리즈
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            슬개골 탈구 & 관절 건강 자가 진단기 🐾
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium max-w-md mx-auto">
            우리 아이의 걸음걸이와 관절 상태, 행동 변화를 통해 관절 건강 위험도를 10초 만에 무료로 진단해 보세요.
          </p>
        </div>

        {/* Diagnoser Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100 border border-gray-100/80 space-y-8">
          {!showResult ? (
            <div className="space-y-8">
              {/* 1. 견종 크기 토글 */}
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-magenta" />
                  1. 우리 아이의 견종 크기는 어떻게 되나요?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDogSize("small")}
                    className={`py-4 px-6 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-2 cursor-pointer ${
                      dogSize === "small"
                        ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-md shadow-magenta/5"
                        : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                    }`}
                    style={{ minHeight: "80px" }} // 피츠의 법칙: 충분히 큰 터치 영역
                  >
                    <span className="text-2xl">🐶</span>
                    <span className="text-sm sm:text-base">소형견 (10kg 미만)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDogSize("large")}
                    className={`py-4 px-6 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-2 cursor-pointer ${
                      dogSize === "large"
                        ? "border-magenta bg-magenta-light/20 text-magenta font-black shadow-md shadow-magenta/5"
                        : "border-gray-100 hover:border-gray-200 text-gray-500 font-bold bg-white"
                    }`}
                    style={{ minHeight: "80px" }} // 피츠의 법칙: 충분히 큰 터치 영역
                  >
                    <span className="text-2xl">🐕</span>
                    <span className="text-sm sm:text-base">중대형견 (10kg 이상)</span>
                  </button>
                </div>
              </div>

              {/* 2. 나이 및 몸무게 입력 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-800">
                    2. 아이의 나이 (살)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="예: 3"
                    min="0"
                    max="30"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-magenta focus:outline-none transition-colors font-bold text-gray-800 text-base"
                    style={{ minHeight: "56px" }} // 터치 영역 확대
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-800">
                    3. 아이의 몸무게 (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="예: 4.5"
                    step="0.1"
                    min="0"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-magenta focus:outline-none transition-colors font-bold text-gray-800 text-base"
                    style={{ minHeight: "56px" }} // 터치 영역 확대
                  />
                </div>
              </div>

              {/* 3. 증상 체크리스트 */}
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-magenta" />
                  4. 최근 아이에게 관찰된 증상을 모두 선택해 주세요.
                </label>
                <div className="space-y-3.5">
                  {SYMPTOMS.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom.id);
                    return (
                      <button
                        key={symptom.id}
                        type="button"
                        onClick={() => handleSymptomToggle(symptom.id)}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-4 active:scale-[0.99] cursor-pointer ${
                          isSelected
                            ? "border-magenta bg-magenta-light/10 text-gray-900 font-extrabold shadow-sm"
                            : "border-gray-100 hover:border-gray-200 text-gray-600 font-bold bg-white"
                        }`}
                        style={{ minHeight: "64px" }} // 모바일 엄지 닿기 쉬운 피츠의 법칙
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
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

              {/* 진단하기 버튼 */}
              <button
                type="button"
                onClick={() => setShowResult(true)}
                className="w-full py-4.5 bg-magenta text-white font-black text-base sm:text-lg rounded-2xl transition-all shadow-lg shadow-magenta/20 hover:bg-magenta/95 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                style={{ minHeight: "56px" }}
              >
                진단 결과 확인하기
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          ) : (
            // 결과 화면
            <div className="space-y-8">
              
              {/* 2026년형 글래스모피즘 결과 카드 */}
              <div className={`p-6 sm:p-8 rounded-3xl border-2 backdrop-blur-xl transition-all ${glassClass}`}>
                <div className="space-y-6">
                  
                  {/* 상단 타이틀 & 위험도 배지 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100/50 pb-5">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        관절 건강 진단 결과
                      </p>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                        자가진단 종합 판정
                      </h2>
                    </div>
                    <span className={`inline-flex px-4 py-2 rounded-full text-xs sm:text-sm font-black shadow-md w-fit ${badgeClass}`}>
                      {resultTitle}
                    </span>
                  </div>

                  {/* 세부 인적 정보 매칭 */}
                  <div className="grid grid-cols-3 gap-2 bg-white/50 backdrop-blur-sm p-3.5 rounded-2xl border border-white/80 text-xs sm:text-sm font-bold text-gray-600">
                    <div className="text-center border-r border-gray-100">
                      <span className="block text-gray-400 text-[10px] uppercase font-black tracking-wider mb-0.5">견종</span>
                      {dogSize === "small" ? "소형견" : "중대형견"}
                    </div>
                    <div className="text-center border-r border-gray-100">
                      <span className="block text-gray-400 text-[10px] uppercase font-black tracking-wider mb-0.5">나이</span>
                      {age ? `${age}살` : "-"}
                    </div>
                    <div className="text-center">
                      <span className="block text-gray-400 text-[10px] uppercase font-black tracking-wider mb-0.5">몸무게</span>
                      {weight ? `${weight}kg` : "-"}
                    </div>
                  </div>

                  {/* 상태 요약 설명 */}
                  <div className="space-y-2.5">
                    <h3 className={`text-base sm:text-lg font-black flex items-center gap-1.5 ${textClass}`}>
                      {resultLevel === "red" && <AlertTriangle className="w-5 h-5 animate-pulse" />}
                      {resultLevel === "yellow" && <AlertTriangle className="w-5 h-5" />}
                      {resultLevel === "green" && <ShieldCheck className="w-5 h-5" />}
                      {statusDesc}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed font-semibold whitespace-pre-line bg-white/30 p-4 rounded-2xl border border-white/35">
                      {actionGuide}
                    </p>
                  </div>
                </div>
              </div>

              {/* BOFU 퍼널 자사몰 제휴 배너 (제휴몰 정비 완료 시 주석 해제) */}
              {/* 
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-magenta via-[#9B0D50] to-[#7B0A40] text-white p-6 sm:p-8 shadow-xl shadow-magenta/10 border border-white/10 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-[#E5007E]/20 rounded-full blur-2xl translate-y-1/3 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/95 text-[10px] font-bold uppercase tracking-widest">
                    <Heart className="w-3 h-3 text-pink-300 fill-pink-300" />
                    관절 지연 스페셜 솔루션
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-extrabold tracking-tight leading-snug">
                      슬개골 탈구 예방과 진행 지연의 핵심은<br className="hidden sm:inline" />
                      <span className="text-yellow-300">‘체중 감량’</span>과 <span className="text-yellow-300">‘연골 영양 공급’</span>입니다.
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
                      우리 아이 슬개골 보호에 맞춤화된 초경량 매트와 연골 속부터 꽉 채워주는 관절 영양제로 다리 아픔을 지켜주세요.
                    </p>
                  </div>

                  <a 
                    href="https://petfair.yeogida-dog.com/offline/landing?pc_seq=1727"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 mt-2 px-6 py-4.5 bg-yellow-300 hover:bg-white text-[#6B0836] font-black text-sm sm:text-base rounded-2xl w-full transition-all group-hover:scale-[1.02] shadow-lg shadow-black/15 active:scale-95"
                    style={{ minHeight: "56px" }}
                  >
                    마젠타랩이 엄선한 슬개골 보호 초경량 매트 & 관절 기능성 영양제 보러가기 ➔
                  </a>
                </div>
              </div>
              */}

              {/* 다시 진단하기 버튼 */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-4.5 bg-white hover:bg-slate-50 border-2 border-slate-100 text-gray-500 font-bold text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                style={{ minHeight: "56px" }}
              >
                <RotateCcw className="w-4 h-4" />
                다시 진단하기
              </button>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
