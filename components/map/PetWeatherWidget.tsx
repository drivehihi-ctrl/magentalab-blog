'use client';

import React, { useState } from 'react';
import { Sun, CloudSun, Sparkles, MapPin, Thermometer, Wind } from 'lucide-react';

interface CityWeather {
  cityName: string;
  score: number;
  temp: number;
  fineDust: '좋음' | '보통' | '나쁨';
  statusText: string;
  recommendation: string;
}

const WEATHER_DATA: Record<string, CityWeather> = {
  '서울': {
    cityName: '서울 강남/마포',
    score: 95,
    temp: 22,
    fineDust: '좋음',
    statusText: '야외 애견 운동장 뛰놀기 최적! ☀️',
    recommendation: '오늘은 미세먼지가 적고 쾌적해요! 야외 루프탑 카페나 넓은 잔디 공원 방문을 강력 추천합니다.',
  },
  '경기': {
    cityName: '경기 남양주/가평',
    score: 98,
    temp: 21,
    fineDust: '좋음',
    statusText: '자연 속 애견 카페 최고 날씨 🌿',
    recommendation: '자연 울타리 계곡 애견 카페나 가평 대형 야외 운동장에 다녀오기 완벽한 날씨입니다!',
  },
  '인천': {
    cityName: '인천 김포/송도',
    score: 92,
    temp: 23,
    fineDust: '좋음',
    statusText: '바람 솔솔 반려견 산책 지수 굿! 🍃',
    recommendation: '김포 애견 동반 카페나 송도 공원 산책 후 실내/야외 테라스에서 쉬어가기 좋습니다.',
  },
  '부산': {
    cityName: '부산 해운대/수영',
    score: 94,
    temp: 24,
    fineDust: '좋음',
    statusText: '해변 산책 & 테라스 애견카페 최고 🌊',
    recommendation: '바다 바람과 함께 야외 테라스석이 마련된 펫 동반 식당을 둘러보기 좋은 기온입니다.',
  },
};

export default function PetWeatherWidget() {
  const [selectedRegion, setSelectedRegion] = useState<string>('서울');
  const weather = WEATHER_DATA[selectedRegion] || WEATHER_DATA['서울'];

  return (
    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-purple-400/20 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Info Column */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-extrabold border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>실시간 펫 산책지수</span>
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
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              오늘 야외 산책지수 <span className="text-amber-300">{weather.score}점</span>
            </h3>
            <span className="text-xs text-purple-200 font-medium">({weather.cityName})</span>
          </div>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-xl">
            {weather.statusText} — <span className="text-amber-200/90">{weather.recommendation}</span>
          </p>
        </div>

        {/* Right Metric Stat Pills */}
        <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-between sm:justify-start bg-white/10 p-3 rounded-2xl backdrop-blur border border-white/10">
          <div className="flex items-center gap-2 px-2">
            <Thermometer className="w-4 h-4 text-amber-300" />
            <div>
              <p className="text-[10px] text-purple-200">기온</p>
              <p className="text-xs font-bold text-white">{weather.temp}°C</p>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/20" />

          <div className="flex items-center gap-2 px-2">
            <Wind className="w-4 h-4 text-emerald-300" />
            <div>
              <p className="text-[10px] text-purple-200">미세먼지</p>
              <p className="text-xs font-bold text-emerald-300">{weather.fineDust}</p>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/20" />

          <div className="flex items-center gap-2 px-2">
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <div>
              <p className="text-[10px] text-purple-200">야외활동</p>
              <p className="text-xs font-bold text-amber-300">최상 🔥</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
