'use client';

import React, { useState } from 'react';
import { PetPlacePOI } from '@/lib/map/types';
import { Sparkles, X, Heart, Shield, Car, Zap, CheckCircle2, ArrowRight, RefreshCw, Dog } from 'lucide-react';
import SafePlaceImage from './SafePlaceImage';

interface AnsimPetCuratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: PetPlacePOI[];
  onSelectPlace: (place: PetPlacePOI) => void;
}

type PetSize = 'small' | 'medium' | 'large';
type PetTrait = 'timid' | 'energetic' | 'fence' | 'parking';

export default function AnsimPetCuratorModal({
  isOpen,
  onClose,
  places,
  onSelectPlace,
}: AnsimPetCuratorModalProps) {
  const [petSize, setPetSize] = useState<PetSize>('small');
  // Allow multiple selected traits
  const [selectedTraits, setSelectedTraits] = useState<PetTrait[]>(['energetic', 'parking']);
  const [isCurating, setIsCurating] = useState(false);
  const [curatedResults, setCuratedResults] = useState<{
    place: PetPlacePOI;
    ansimComment: string;
  }[] | null>(null);

  if (!isOpen) return null;

  const toggleTrait = (trait: PetTrait) => {
    setSelectedTraits((prev) => {
      if (prev.includes(trait)) {
        if (prev.length === 1) return prev; // Keep at least one trait selected
        return prev.filter((t) => t !== trait);
      } else {
        return [...prev, trait];
      }
    });
  };

  // Run AI Curation logic matching multiple pet traits
  const handleCurate = () => {
    setIsCurating(true);
    setCuratedResults(null);

    setTimeout(() => {
      let filtered = [...places];

      // Score each place based on how many selected traits it satisfies
      const scored = filtered.map((place) => {
        let score = 0;
        const text = (place.name + ' ' + place.description + ' ' + place.categoryName + ' ' + place.tags.join(' ')).toLowerCase();

        if (selectedTraits.includes('timid')) {
          if (place.category === 'cafe' || place.category === 'hotel' || text.includes('울타리') || text.includes('소형견') || text.includes('독립')) {
            score += 2;
          }
        }
        if (selectedTraits.includes('energetic')) {
          if (place.category === 'park' || text.includes('운동장') || text.includes('야외') || text.includes('잔디') || text.includes('뛰')) {
            score += 2;
          }
        }
        if (selectedTraits.includes('fence')) {
          if (text.includes('울타리') || text.includes('펜스') || text.includes('안전')) {
            score += 3;
          }
        }
        if (selectedTraits.includes('parking')) {
          if (text.includes('주차') || place.address.includes('경기') || place.address.includes('남양주') || place.address.includes('김포')) {
            score += 2;
          }
        }
        return { place, score };
      });

      // Sort by score descending
      scored.sort((a, b) => b.score - a.score);

      const top3 = scored.slice(0, 3).map(({ place }) => {
        const comments: string[] = [];
        if (selectedTraits.includes('energetic')) comments.push('넓은 운동장/잔디');
        if (selectedTraits.includes('parking')) comments.push('편한 주차 공간');
        if (selectedTraits.includes('fence')) comments.push('안전 울타리');
        if (selectedTraits.includes('timid')) comments.push('독립 공간');

        const traitSummary = comments.join(', ');
        const comment = `🐶 "${traitSummary} 조건 완벽 만족! ${place.name}은(는) 보호자님이 원하시는 맞춤 스팟입니다."`;

        return { place, ansimComment: comment };
      });

      setCuratedResults(top3);
      setIsCurating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1a2e]/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Hani-inspired Deep Navy Header */}
        <div className="bg-[#1a1a2e] text-white p-5 sm:p-6 relative border-b border-[#c9a64c]/30">
          <div className="h-[3px] w-full bg-gradient-to-r from-[#E5007E] via-[#c9a64c] to-[#E5007E] absolute top-0 left-0 right-0" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white bg-white/10 p-2 rounded-full backdrop-blur transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-[#c9a64c]/40 flex items-center justify-center text-[#c9a64c] shrink-0 shadow-xs">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#c9a64c]/20 text-[#c9a64c] border border-[#c9a64c]/30 inline-block">
                마젠타랩 AI 큐레이터 🐶
              </span>
              <h3 className="text-xl font-extrabold tracking-tight text-white mt-1">
                1초 댕댕이 성격 맞춤 추천
              </h3>
            </div>
          </div>
          <p className="text-xs text-gray-300 mt-2.5 leading-relaxed font-normal">
            우리 아이 체형과 필요한 조건을 선택해 주시면 (중복 선택 가능!), AI 안심이가 딱 맞는 스팟을 큐레이션해 드립니다!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* STEP 1: Pet Size Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-extrabold text-[#1a1a2e] flex items-center gap-1.5">
              <Dog className="w-4 h-4 text-[#E5007E]" />
              <span>1. 아이 크기(체형)를 선택해 주세요</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'small', label: '소형견', sub: '10kg 미만' },
                { id: 'medium', label: '중형견', sub: '10~25kg' },
                { id: 'large', label: '대형견', sub: '25kg 이상' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPetSize(item.id as PetSize)}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center cursor-pointer ${
                    petSize === item.id
                      ? 'border-[#1a1a2e] bg-[#faf6f0] text-[#1a1a2e] ring-2 ring-[#c9a64c]/40 font-extrabold shadow-2xs'
                      : 'border-gray-200 hover:border-[#1a1a2e]/30 text-gray-700'
                  }`}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[10px] text-gray-500 mt-1 font-medium">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: Pet Trait / Style Selection (Multiple Support!) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-[#1a1a2e] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#c9a64c]" />
                <span>2. 아이 성격 & 원하는 조건 선택 (중복 선택 가능!)</span>
              </label>
              <span className="text-[10px] text-[#E5007E] font-extrabold">다중 선택 가능 </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  id: 'timid',
                  icon: <Heart className="w-4 h-4 text-rose-500" />,
                  title: '소심견 / 독립공간 🙈',
                  desc: '다른 개 보면 짖고 겁많음',
                },
                {
                  id: 'energetic',
                  icon: <Zap className="w-4 h-4 text-amber-500" />,
                  title: '에너지 폭발 ⚡',
                  desc: '넓은 야외 잔디 뛰놀기',
                },
                {
                  id: 'fence',
                  icon: <Shield className="w-4 h-4 text-emerald-500" />,
                  title: '안전 울타리 필수 🛡️',
                  desc: '펜스 시설이 확실한 곳',
                },
                {
                  id: 'parking',
                  icon: <Car className="w-4 h-4 text-blue-500" />,
                  title: '주차하기 쉬운 곳 🚗',
                  desc: '자차 방문 넉넉한 주차장',
                },
              ].map((item) => {
                const isSelected = selectedTraits.includes(item.id as PetTrait);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleTrait(item.id as PetTrait)}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-1 relative cursor-pointer ${
                      isSelected
                        ? 'border-[#1a1a2e] bg-[#faf6f0] text-[#1a1a2e] ring-2 ring-[#c9a64c]/40 font-extrabold shadow-2xs'
                        : 'border-gray-200 hover:border-[#1a1a2e]/30 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#1a1a2e] shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 pl-5 font-medium">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button: Run Curation */}
          <button
            onClick={handleCurate}
            disabled={isCurating}
            className="w-full py-4 bg-[#1a1a2e] hover:bg-[#252542] text-[#c9a64c] font-black text-sm rounded-2xl shadow-lg border border-[#c9a64c]/30 transition transform hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isCurating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#c9a64c]" />
                <span>안심이 AI가 펫 맵 DB를 분석하는 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E5007E]" />
                <span>선택된 조건으로 맞춤 큐레이션 실행</span>
              </>
            )}
          </button>

          {/* RESULTS AREA */}
          {curatedResults && (
            <div className="pt-4 border-t border-gray-100 space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-[#1a1a2e] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>안심이가 추천하는 맞춤 3곳</span>
                </h4>
                <span className="text-[10px] text-gray-500 font-bold">터치 시 지도 이동</span>
              </div>

              <div className="space-y-3">
                {curatedResults.map(({ place, ansimComment }) => (
                  <div
                    key={place.id}
                    onClick={() => {
                      onSelectPlace(place);
                      onClose();
                    }}
                    className="bg-[#faf6f0] hover:bg-gray-100 p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs transition cursor-pointer flex flex-col gap-2 group"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative border border-gray-100">
                        {place.imageUrl ? (
                          <SafePlaceImage src={place.imageUrl} alt={place.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#faf6f0] text-[#1a1a2e] font-extrabold text-xs">
                            {place.categoryName}
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5 overflow-hidden flex-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#1a1a2e] text-[#c9a64c] inline-block">
                          {place.categoryName}
                        </span>
                        <h5 className="text-xs font-extrabold text-[#1a1a2e] group-hover:text-[#E5007E] transition truncate">
                          {place.name}
                        </h5>
                        <p className="text-[11px] text-gray-500 truncate">{place.roadAddress || place.address}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#E5007E] group-hover:translate-x-1 transition shrink-0" />
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-gray-200/60 text-[11px] text-[#1a1a2e] font-medium leading-relaxed">
                      {ansimComment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
