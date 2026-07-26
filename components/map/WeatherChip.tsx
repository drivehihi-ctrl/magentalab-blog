'use client';

import React, { useState, useEffect } from 'react';
import { Thermometer, X, ChevronDown } from 'lucide-react';

interface WeatherData {
  region: string;
  temp: number;
  apparentTemp: number;
  humidity: number;
  score: number;
  statusText: string;
  isHotAlert: boolean;
}

export default function WeatherChip() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('서울');

  const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '강원', '제주'];

  useEffect(() => {
    fetch(`/api/weather?region=${encodeURIComponent(selectedRegion)}`)
      .then((res) => res.json())
      .then((data) => { if (data.success && data.data) setWeather(data.data); })
      .catch(() => {});
  }, [selectedRegion]);

  const score = weather?.score ?? '–';
  const isHot = weather?.isHotAlert ?? false;

  return (
    <div className="relative">
      {/* Chip button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-sm border transition-all ${
          isHot
            ? 'bg-rose-500/90 text-white border-rose-400/50'
            : 'bg-emerald-500/90 text-white border-emerald-400/50'
        }`}
      >
        <Thermometer className="w-3.5 h-3.5" />
        <span>산책지수 {score}점</span>
        <span>{isHot ? '🔥' : '🌿'}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="absolute top-10 right-0 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-4 space-y-3 z-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-800">🌡️ 기상청 펫 산책지수</span>
            <button onClick={() => setExpanded(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Region selector */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="inline-flex gap-1">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${
                    selectedRegion === r ? 'bg-[#E5007E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {weather ? (
            <div className="space-y-2">
              <div className={`text-center py-2 rounded-xl ${isHot ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                <p className={`text-2xl font-black ${isHot ? 'text-rose-600' : 'text-emerald-600'}`}>{weather.score}점</p>
                <p className="text-[11px] text-gray-600 mt-0.5">{weather.region}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-[10px] text-gray-400">기온 (체감)</p>
                  <p className="text-xs font-bold text-gray-800">{weather.temp}°C ({weather.apparentTemp}°C)</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-[10px] text-gray-400">습도</p>
                  <p className="text-xs font-bold text-gray-800">{weather.humidity}%</p>
                </div>
              </div>
              <p className={`text-[11px] font-semibold text-center rounded-xl py-2 ${isHot ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {isHot ? '🏠 실내 애견카페 추천' : '🌳 야외 반려공원 추천'}
              </p>
            </div>
          ) : (
            <div className="text-center py-4 text-xs text-gray-400">날씨 정보 로딩중...</div>
          )}
        </div>
      )}
    </div>
  );
}
