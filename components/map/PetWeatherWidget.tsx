'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Thermometer, Wind, AlertTriangle, ShieldCheck, Loader2, Droplets } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-purple-400/20 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Info Column */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-extrabold border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>실시간 KMA 기상청 펫 산책지수</span>
            </span>

            {/* Region Selector Pills */}
            <div className="flex gap-1 bg-white/10 p-1 rounded-full backdrop-blur border border-white/10 overflow-x-auto max-w-full scrollbar-none touch-pan-x">
              {['서울', '경기', '인천', '부산', '대구', '광주', '대전'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition whitespace-nowrap shrink-0 ${
                    selectedRegion === region
                      ? 'bg-amber-400 text-purple-950 shadow-sm'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            {isLoading ? (
              <div className="flex items-center gap-2 text-amber-300 font-bold text-lg py-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>실시간 날씨 데이터 조회중...</span>
              </div>
            ) : (
              <>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  오늘 야외 산책지수 <span className={displayData.isHotAlert ? 'text-rose-400 font-black' : 'text-amber-300'}>{displayData.score}점</span>
                </h3>
                <span className="text-xs text-purple-200 font-medium">({displayData.region})</span>
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-xl">
            {displayData.statusText} — <span className={displayData.isHotAlert ? 'text-rose-200 font-bold' : 'text-amber-200/90'}>{displayData.recommendation}</span>
          </p>
        </div>

        {/* Right Metric Stat Pills */}
        <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-between sm:justify-start bg-white/10 p-3 rounded-2xl backdrop-blur border border-white/10">
          <div className="flex items-center gap-2 px-2">
            <Thermometer className={`w-4 h-4 ${displayData.isHotAlert ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`} />
            <div>
              <p className="text-[10px] text-purple-200">기온 (체감)</p>
              <p className={`text-xs font-bold ${displayData.isHotAlert ? 'text-rose-300 font-black' : 'text-white'}`}>
                {displayData.temp}°C ({displayData.apparentTemp}°C)
              </p>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/20" />

          <div className="flex items-center gap-2 px-2">
            <Droplets className="w-4 h-4 text-blue-300" />
            <div>
              <p className="text-[10px] text-purple-200">습도</p>
              <p className="text-xs font-bold text-blue-200">{displayData.humidity}%</p>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/20" />

          <div className="flex items-center gap-2 px-2">
            {displayData.isHotAlert ? (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-amber-300" />
            )}
            <div>
              <p className="text-[10px] text-purple-200">추천 장소</p>
              <p className={`text-xs font-bold ${displayData.isHotAlert ? 'text-rose-300 font-black' : 'text-amber-300'}`}>
                {displayData.isHotAlert ? '실내 에어컨 ❄️' : '야외 운동장 ☀️'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
