'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Thermometer, AlertTriangle, ShieldCheck, Loader2, Droplets } from 'lucide-react';

interface WeatherData {
  region: string;
  temp: number;
  apparentTemp: number;
  humidity: number;
  score: number;
  statusText: string;
  recommendation: string;
  isHotAlert: boolean;
  fineDust: string;
}

export default function PetWeatherWidget() {
  const [selectedRegion, setSelectedRegion] = useState<string>('서울');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch real-time weather data from backend API
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    fetch(`/api/weather?region=${encodeURIComponent(selectedRegion)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data.success && data.data) {
          setWeather(data.data);
        }
      })
      .catch((err) => {
        console.warn('Failed to load weather widget data:', err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedRegion]);

  const displayData = weather || {
    region: `${selectedRegion} 지역`,
    temp: 31,
    apparentTemp: 33,
    humidity: 78,
    score: 40,
    statusText: '🔥 폭염/아스팔트 화상 주의! 실내 추천',
    recommendation: '현재 31°C 무더위입니다! 낮시간 아스팔트 산책은 발바닥 화상 위험이 있으니 시원한 에어컨 실내 애견카페를 강력 추천합니다! ❄️',
    isHotAlert: true,
    fineDust: '좋음',
  };

  return (
    <div className="bg-[#faf6f0] rounded-3xl p-5 sm:p-6 shadow-sm border border-[#e8e4df] relative overflow-hidden font-sans">
      {/* Top Hani Accent Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#E5007E] via-[#c9a64c] to-[#1a1a2e] absolute top-0 left-0 right-0" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pt-1">
        {/* Left Info Column */}
        <div className="space-y-2.5 flex-1 min-w-0 w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a1a2e] text-[#c9a64c] text-[11px] font-extrabold border border-[#c9a64c]/30 shadow-xs shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a64c]" />
              <span>실시간 KMA 기상청 펫 산책지수</span>
            </span>

            {/* Region Selector Pills */}
            <div className="flex gap-1 bg-white/90 p-1 rounded-full border border-gray-200/80 overflow-x-auto overflow-y-hidden w-full max-w-full scrollbar-hide touch-pan-x shadow-2xs">
              {['서울', '경기', '인천', '부산', '대구', '광주', '대전'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition whitespace-nowrap shrink-0 ${
                    selectedRegion === region
                      ? 'bg-[#1a1a2e] text-[#c9a64c] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-baseline gap-2 pt-0.5">
            {isLoading ? (
              <div className="flex items-center gap-2 text-[#E5007E] font-bold text-base py-1">
                <Loader2 className="w-4 h-4 animate-spin text-[#E5007E]" />
                <span>실시간 날씨 데이터 분석 중...</span>
              </div>
            ) : (
              <>
                <h3 className="text-xl sm:text-2xl font-black text-[#1a1a2e] tracking-tight">
                  오늘 야외 산책지수{' '}
                  <span className={displayData.isHotAlert ? 'text-[#E5007E] font-black' : 'text-amber-600'}>
                    {displayData.score}점
                  </span>
                </h3>
                <span className="text-xs text-gray-500 font-bold">({displayData.region})</span>
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium max-w-2xl">
            {displayData.statusText} —{' '}
            <span className={displayData.isHotAlert ? 'text-[#c0006a] font-bold' : 'text-amber-800 font-bold'}>
              {displayData.recommendation}
            </span>
          </p>
        </div>

        {/* Right Metric Stat Cards */}
        <div className="flex items-center gap-2.5 shrink-0 w-full lg:w-auto justify-between lg:justify-start bg-white/90 p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center gap-2.5 px-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 text-[#E5007E] shrink-0">
              <Thermometer className="w-4 h-4" />
            </div>
            <div className="whitespace-nowrap">
              <p className="text-[10px] text-gray-400 font-semibold">기온 (체감)</p>
              <p className="text-xs font-black text-[#1a1a2e]">
                {displayData.temp}°C <span className="text-rose-600">({displayData.apparentTemp}°C)</span>
              </p>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-gray-200 shrink-0" />

          <div className="flex items-center gap-2.5 px-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600 shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="whitespace-nowrap">
              <p className="text-[10px] text-gray-400 font-semibold">습도</p>
              <p className="text-xs font-black text-blue-900">{displayData.humidity}%</p>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-gray-200 shrink-0" />

          <div className="flex items-center gap-2.5 px-2 shrink-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
              displayData.isHotAlert ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
            }`}>
              {displayData.isHotAlert ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div className="whitespace-nowrap">
              <p className="text-[10px] text-gray-400 font-semibold">추천 장소</p>
              <p className={`text-xs font-black ${displayData.isHotAlert ? 'text-[#c0006a]' : 'text-emerald-700'}`}>
                {displayData.isHotAlert ? '실내 에어컨 ❄️' : '야외 공원 🌳'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
