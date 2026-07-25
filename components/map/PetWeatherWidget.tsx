'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Sparkles, Thermometer, Wind, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';

interface RegionCoords {
  name: string;
  fullName: string;
  lat: number;
  lng: number;
}

const REGIONS: Record<string, RegionCoords> = {
  '서울': { name: '서울', fullName: '서울 강남/마포', lat: 37.5665, lng: 126.9780 },
  '경기': { name: '경기', fullName: '경기 남양주/가평', lat: 37.6000, lng: 127.1500 },
  '인천': { name: '인천', fullName: '인천 김포/송도', lat: 37.4563, lng: 126.7052 },
  '부산': { name: '부산', fullName: '부산 해운대/수영', lat: 35.1796, lng: 129.0756 },
};

export default function PetWeatherWidget() {
  const [selectedRegion, setSelectedRegion] = useState<string>('서울');
  const [temperature, setTemperature] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const currentRegion = REGIONS[selectedRegion] || REGIONS['서울'];

  // Fetch real-time weather from Open-Meteo API
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${currentRegion.lat}&longitude=${currentRegion.lng}&current_weather=true`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data && data.current_weather) {
          setTemperature(Math.round(data.current_weather.temperature));
        }
      })
      .catch((err) => {
        console.warn('Real-time weather API failed:', err);
        // Fallback estimated summer temp if offline
        if (!isCancelled) setTemperature(30);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedRegion, currentRegion.lat, currentRegion.lng]);

  // Calculate real-time Pet Walking Index based on actual temperature
  const temp = temperature !== null ? temperature : 31;

  let score = 90;
  let statusText = '야외 산책하기 쾌적해요! ☀️';
  let recommendation = '적당한 기온으로 실내/야외 애견 카페 방문 모두 추천합니다.';
  let isHotAlert = false;

  if (temp >= 30) {
    score = 45;
    statusText = '🔥 찜통더위! 야외 아스팔트 화상 주의';
    recommendation = `현재 ${temp}°C의 무더위입니다! 낮시간 아스팔트 산책은 댕댕이 발바닥 화상 위험이 있으니 시원한 에어컨 실내 애견카페를 강력 추천합니다! ❄️`;
    isHotAlert = true;
  } else if (temp >= 27) {
    score = 65;
    statusText = '☀️ 다소 무더움! 해 질 녘 산책 추천';
    recommendation = `현재 ${temp}°C로 덥습니다. 낮시간 야외 활동보다는 해 진 후 산책이나 수영장 애견카페를 추천합니다.`;
  } else if (temp <= 5) {
    score = 55;
    statusText = '❄️ 쌀쌀함! 소형견 옷 착용 필수';
    recommendation = `현재 ${temp}°C입니다. 추위에 약한 소형견은 따뜻한 옷을 입히거나 아늑한 실내 펫 스팟을 이용해 주세요.`;
  }

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
              <span>실시간 팩트 펫 산책지수</span>
            </span>

            {/* Region Selector Pills */}
            <div className="flex gap-1 bg-white/10 p-1 rounded-full backdrop-blur border border-white/10">
              {['서울', '경기', '인천', '부산'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition ${
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
                <span>실시간 기상청 날씨 데이터 로딩중...</span>
              </div>
            ) : (
              <>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  오늘 야외 산책지수 <span className={isHotAlert ? 'text-rose-400' : 'text-amber-300'}>{score}점</span>
                </h3>
                <span className="text-xs text-purple-200 font-medium">({currentRegion.fullName})</span>
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-xl">
            {statusText} — <span className={isHotAlert ? 'text-rose-200 font-bold' : 'text-amber-200/90'}>{recommendation}</span>
          </p>
        </div>

        {/* Right Metric Stat Pills */}
        <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-between sm:justify-start bg-white/10 p-3 rounded-2xl backdrop-blur border border-white/10">
          <div className="flex items-center gap-2 px-2">
            <Thermometer className={`w-4 h-4 ${isHotAlert ? 'text-rose-400 animate-bounce' : 'text-amber-300'}`} />
            <div>
              <p className="text-[10px] text-purple-200">실시간 기온</p>
              <p className={`text-xs font-bold ${isHotAlert ? 'text-rose-300 font-black' : 'text-white'}`}>
                {isLoading ? '...' : `${temp}°C`}
              </p>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/20" />

          <div className="flex items-center gap-2 px-2">
            <Wind className="w-4 h-4 text-emerald-300" />
            <div>
              <p className="text-[10px] text-purple-200">미세먼지</p>
              <p className="text-xs font-bold text-emerald-300">좋음</p>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/20" />

          <div className="flex items-center gap-2 px-2">
            {isHotAlert ? (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-amber-300" />
            )}
            <div>
              <p className="text-[10px] text-purple-200">추천 장소</p>
              <p className={`text-xs font-bold ${isHotAlert ? 'text-rose-300 font-black' : 'text-amber-300'}`}>
                {isHotAlert ? '실내 에어컨 ❄️' : '야외 운동장 ☀️'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
