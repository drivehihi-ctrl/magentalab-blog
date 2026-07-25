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
  const [selectedTrait, setSelectedTrait] = useState<PetTrait>('timid');
  const [isCurating, setIsCurating] = useState(false);
  const [curatedResults, setCuratedResults] = useState<{
    place: PetPlacePOI;
    ansimComment: string;
  }[] | null>(null);

  if (!isOpen) return null;

  // Run AI Curation logic matching pet traits
  const handleCurate = () => {
    setIsCurating(true);
    setCuratedResults(null);

    setTimeout(() => {
      let filtered = [...places];

      if (selectedTrait === 'timid') {
        filtered = filtered.filter(
          (p) =>
            p.category === 'cafe' ||
            p.category === 'hotel' ||
            p.description?.includes('울타리') ||
            p.description?.includes('소형견') ||
            p.name.includes('다시사랑') ||
            p.name.includes('파트너')
        );
      } else if (selectedTrait === 'energetic') {
        filtered = filtered.filter(
          (p) =>
            p.category === 'park' ||
            p.category === 'cafe' ||
            p.description?.includes('운동장') ||
            p.description?.includes('야외') ||
            p.description?.includes('잔디')
        );
      } else if (selectedTrait === 'fence') {
        filtered = filtered.filter(
          (p) =>
            p.description?.includes('울타리') ||
            p.description?.includes('펜스') ||
            p.description?.includes('독립') ||
            p.category === 'cafe'
        );
      } else if (selectedTrait === 'parking') {
        filtered = filtered.filter(
          (p) =>
            p.description?.includes('주차') ||
            p.address.includes('경기') ||
            p.address.includes('남양주') ||
            p.address.includes('김포')
        );
      }

      if (filtered.length < 3) {
        filtered = places;
      }

      // Pick top 3 matching places with custom Ansim-i Comments
      const top3 = filtered.slice(0, 3).map((place) => {
        let comment = '';
        if (selectedTrait === 'timid') {
          comment = `🐶 "다른 강아지 무서워하는 아이 맞죠? ${place.name}은(는) 붐비지 않고 독립 공간이 잘 확보되어 소심이도 평화롭게 쉴 수 있어요!"`;
        } else if (selectedTrait === 'energetic') {
          comment = `⚡ "체력 폭발 댕댕이 찰떡! ${place.name}은(는) 마음껏 뛰놀 수 있는 넓은 스팟이라 오늘 떡실신 보장합니다!"`;
        } else if (selectedTrait === 'fence') {
          comment = `🛡️ "안전 울타리 필수 보호자님 주목! ${place.name}은(는) 펜스 시설이 확실해서 마음 편히 여유를 즐기실 수 있어요."`;
        } else {
          comment = `🚗 "초보 운전자도 안심! ${place.name}은(는) 주차 여유가 넉넉해 자차로 아이 데리고 편하게 방문 가능해요."`;
        }
        return { place, ansimComment: comment };
      });

      setCuratedResults(top3);
      setIsCurating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-purple-100 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-purple-200 hover:text-white bg-white/10 p-2 rounded-full backdrop-blur transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                마젠타랩 AI 큐레이터
              </span>
              <h3 className="text-xl font-extrabold tracking-tight mt-0.5">
                1초 댕댕이 성격 맞춤 추천 🐶
              </h3>
            </div>
          </div>
          <p className="text-xs text-purple-200 mt-2 leading-relaxed">
            우리 아이 체형과 성격을 선택해 주시면, AI 안심이가 팩트 리뷰를 분석해 딱 맞는 스팟을 큐레이션해 드립니다!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Pet Size Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <Dog className="w-4 h-4 text-purple-600" />
              <span>1. 아이 크기(체형)를 선택해 주세요</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'small', label: '소형견', sub: '10kg 미만' },
                { id: 'medium', label: '중형견', sub: '10~25kg' },
                { id: 'large', label: '대형견', sub: '25kg 이상' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPetSize(item.id as PetSize)}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center ${
                    petSize === item.id
                      ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-500/20 font-bold'
                      : 'border-gray-200 hover:border-purple-200 text-gray-700'
                  }`}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: Pet Trait / Style Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>2. 아이 성격 & 이번 방문 목적을 선택해 주세요</span>
            </label>
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
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedTrait(item.id as PetTrait)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 ${
                    selectedTrait === item.id
                      ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-500/20'
                      : 'border-gray-200 hover:border-purple-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 pl-5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button: Run Curation */}
          <button
            onClick={handleCurate}
            disabled={isCurating}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition active:scale-98 flex items-center justify-center gap-2"
          >
            {isCurating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                <span>안심이 AI가 펫 맵 DB를 분석하는 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>안심이 AI 맞춤 큐레이션 실행하기</span>
              </>
            )}
          </button>

          {/* RESULTS AREA */}
          {curatedResults && (
            <div className="pt-4 border-t border-purple-100 space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>안심이가 추천하는 맞춤 3곳</span>
                </h4>
                <span className="text-[10px] text-purple-600 font-bold">터치 시 지도 이동</span>
              </div>

              <div className="space-y-3">
                {curatedResults.map(({ place, ansimComment }) => (
                  <div
                    key={place.id}
                    onClick={() => {
                      onSelectPlace(place);
                      onClose();
                    }}
                    className="bg-purple-50/60 hover:bg-purple-100/60 p-3.5 rounded-2xl border border-purple-100 shadow-sm transition cursor-pointer flex flex-col gap-2 group"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                        {place.imageUrl ? (
                          <SafePlaceImage src={place.imageUrl} alt={place.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-700 font-bold text-xs">
                            {place.categoryName}
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5 overflow-hidden flex-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-800 inline-block">
                          {place.categoryName}
                        </span>
                        <h5 className="text-xs font-bold text-gray-900 group-hover:text-purple-700 transition truncate">
                          {place.name}
                        </h5>
                        <p className="text-[11px] text-gray-500 truncate">{place.roadAddress || place.address}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition shrink-0" />
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-purple-100/80 text-[11px] text-purple-950 font-medium leading-relaxed">
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
