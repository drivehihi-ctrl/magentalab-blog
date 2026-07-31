'use client';

import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, CheckCircle2, XCircle, Sparkles, LogIn, ChevronDown, ChevronUp, Lock, Layers, Coffee, Bone, Check, UserCheck, Heart, Zap, Car } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';

interface AnsimLabCertificationProps {
  placeName: string;
  category: string;
  placeId: string;
}

const QUESTIONS = [
  {
    id: 1,
    title: '리드줄 고정 고리가 있나요?',
    desc: '테이블이나 벽면에 강아지 리드줄을 걸 수 있는 전용 고리가 있는지 확인해 주세요.',
    icon: Lock,
  },
  {
    id: 2,
    title: '강아지가 걸어다니기에 바닥이 미끄럽지 않나요?',
    desc: '슬개골 보호를 위한 논슬립 코팅이나 매트가 깔려 있는지 확인해 주세요.',
    icon: Layers,
  },
  {
    id: 3,
    title: '반려견 전용 메뉴/간식이 있나요?',
    desc: '멍푸치노나 강아지 전용 수제 간식이 준비되어 있는지 확인해 주세요.',
    icon: Coffee,
  },
  {
    id: 4,
    title: '안전 펜스가 설치되어 있나요?',
    desc: '문이 열릴 때 강아지가 뛰어쳐나가지 않게 펜스나 이중문이 있는지 확인해 주세요.',
    icon: ShieldCheck,
  },
  {
    id: 5,
    title: '매너벨트/배변봉투가 비치되어 있나요?',
    desc: '매장 내에 매너벨트나 배변 봉투 등 비상 위생 용품이 구비되어 있는지 확인해 주세요.',
    icon: Bone,
  },
  {
    id: 6,
    title: '독립공간이 있는가?',
    desc: '소심한 아이도 편하게 쉴 수 있는 분리된 개별 룸이나 독립공간이 있는지 확인해 주세요.',
    icon: Heart,
  },
  {
    id: 7,
    title: '넓은 야외 잔디가 있는가?',
    desc: '에너지 넘치는 아이가 마음껏 뛰어놀 수 있는 야외 잔디나 운동장이 있는지 확인해 주세요.',
    icon: Zap,
  },
  {
    id: 8,
    title: '주차하기 쉬운가?',
    desc: '자차 방문 시 편하게 주차할 수 있는 넉넉한 전용 주차장이 있는지 확인해 주세요.',
    icon: Car,
  },
];

export default function AnsimLabCertification({ placeName, category, placeId }: AnsimLabCertificationProps) {
  const { data: session } = useSession();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userBadgeEarned, setUserBadgeEarned] = useState(false);
  const [cumulativeScore, setCumulativeScore] = useState<number | null>(null);
  const [totalEvaluationsCount, setTotalEvaluationsCount] = useState<number>(0);



  // Fetch cumulative evaluations for this place
  useEffect(() => {
    fetch(`/api/map/evaluations?placeId=${encodeURIComponent(placeId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.averageScore !== null) {
          setCumulativeScore(data.averageScore);
          setTotalEvaluationsCount(data.totalEvaluations || 0);
        }
      })
      .catch(() => {});

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`ansim_eval_${placeId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSubmittedScore(parsed.score);
          setAnswers(parsed.answers);
          setHasSubmitted(true);
          setUserBadgeEarned(true);
        } catch (e) {}
      }

      // Auto open evaluation form if user just logged in to evaluate this place
      if (session?.user) {
        const pendingPlaceId = localStorage.getItem('ansim_pending_eval_place');
        if (pendingPlaceId === placeId) {
          setIsFormOpen(true);
          localStorage.removeItem('ansim_pending_eval_place');
        }
      }
    }
  }, [placeId, session?.user]);


  const handleToggleAnswer = (questionId: number, val: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === val ? null : val,
    }));
  };

  const handleStartEvaluation = () => {
    if (!session?.user) {
      setShowLoginModal(true);
    } else {
      setIsFormOpen(true);
    }
  };

  const handleSubmitEvaluation = async () => {
    const answeredKeys = Object.keys(answers).filter((k) => answers[Number(k)] !== null);
    if (answeredKeys.length < 8) {
      alert('8가지 질문에 모두 답해주시면 감사하겠습니다! 😊');
      return;
    }

    const yesCount = Object.values(answers).filter((v) => v === true).length;
    const calculatedScore = 60 + yesCount * 5; // 60 ~ 100 score range

    setSubmittedScore(calculatedScore);
    setHasSubmitted(true);
    setUserBadgeEarned(true);
    setIsFormOpen(false);

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `ansim_eval_${placeId}`,
        JSON.stringify({
          score: calculatedScore,
          answers,
          date: new Date().toISOString(),
          user: session?.user?.name || '안심 연구원',
        })
      );
    }

    // Submit to server API
    try {
      const res = await fetch('/api/map/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId,
          score: calculatedScore,
          answers,
          userId: (session?.user as any)?.id || session?.user?.email || 'anonymous',
        }),
      });
      const data = await res.json();
      if (data && data.averageScore !== undefined) {
        setCumulativeScore(data.averageScore);
        setTotalEvaluationsCount(data.totalEvaluations || 1);
      }
    } catch (e) {}
  };


  return (
    <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-purple-700/50 font-sans space-y-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-magenta/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-purple-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-amber-300 uppercase">
                마젠타랩 안심 연구소
              </span>
              {userBadgeEarned && (
                <span className="text-[10px] font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 px-2 py-0.5 rounded-full shadow-sm animate-pulse flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  안심 연구원 뱃지 획득 🏅
                </span>
              )}
            </div>
            <h3 className="text-base font-extrabold tracking-tight text-white mt-0.5">
              안심 지수 (Ansim Index) 현장 제보
            </h3>
          </div>
        </div>

        {(hasSubmitted || cumulativeScore !== null) && (
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white">
                {cumulativeScore !== null ? cumulativeScore : submittedScore}
              </span>
              <span className="text-xs font-bold text-purple-200">/100점</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {totalEvaluationsCount > 0 ? `${totalEvaluationsCount}명의 연구원 제보 누적` : '내 제보 반영 완료'}
            </span>
          </div>
        )}

      </div>

      {/* Main Call To Action Banner */}
      {!isFormOpen && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3 relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                {placeName}에 방문하셨나요?
              </p>
              <p className="text-xs text-purple-200/90 leading-relaxed mt-1">
                직접 8가지 안심 항목을 체크하고 제보하시면 <strong className="text-amber-300">[안심 수석 연구원 🏅]</strong> 뱃지를 수여해 드립니다!
              </p>
            </div>
          </div>

          <button
            onClick={handleStartEvaluation}
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-purple-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Award className="w-4 h-4" />
            <span>{hasSubmitted ? '내 안심 지수 평가 수정하기 ✍️' : '안심 8대 체크리스트 평가 참여하기 ✍️'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Interactive Form Section */}
      {isFormOpen && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-purple-400/30 space-y-4 relative z-10 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              현장 안심 8대 체크리스트 작성
            </h4>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-purple-300 hover:text-white flex items-center gap-1"
            >
              닫기 <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {QUESTIONS.map((q) => {
              const IconComp = q.icon;
              const currentVal = answers[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-purple-950/50 p-3 rounded-xl border border-purple-500/20 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white">{q.title}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-purple-200/70 pl-8 leading-snug">{q.desc}</p>

                  <div className="flex items-center gap-2 pl-8 pt-1">
                    <button
                      onClick={() => handleToggleAnswer(q.id, true)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        currentVal === true
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 font-black'
                          : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>예 👍</span>
                    </button>

                    <button
                      onClick={() => handleToggleAnswer(q.id, false)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        currentVal === false
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 font-black'
                          : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>아니오 👎</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSubmitEvaluation}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>안심 연구원에 제보 제출하고 뱃지 획득 🚀</span>
          </button>
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                안심 연구원 평가 로그인 🐾
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                안심 연구소 현장 제보에 참여하시려면 소셜 로그인이 필요합니다.<br />
                제보 완료 시 <strong className="text-purple-600">[안심 수석 연구원 🏅]</strong> 뱃지를 수여해 드립니다!
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') localStorage.setItem('ansim_pending_eval_place', placeId);
                  const currentUrl = typeof window !== 'undefined' ? window.location.href : '/map';
                  signIn('kakao', { callbackUrl: currentUrl });
                }}
                className="w-full py-3 bg-[#FEE500] hover:bg-[#FDD800] text-[#3C1E1E] font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>카카오 1초 간편 로그인</span>
              </button>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined') localStorage.setItem('ansim_pending_eval_place', placeId);
                  const currentUrl = typeof window !== 'undefined' ? window.location.href : '/map';
                  signIn('google', { callbackUrl: currentUrl });
                }}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                <span>구글 계정으로 로그인</span>
              </button>
            </div>


            <button
              onClick={() => setShowLoginModal(false)}
              className="text-xs text-gray-400 hover:text-gray-600 pt-1 underline"
            >
              다음에 할게요
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
