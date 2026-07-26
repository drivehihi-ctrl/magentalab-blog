'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Thermometer, X, ChevronDown } from 'lucide-react';

interface WeatherData {
  region: string;
  temp: number;
  apparentTemp: number;
  humidity: number;
  score: number;
  isHotAlert: boolean;
}

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '강원', '제주'];
const DEFAULT_POS = { x: 16, y: 80 }; // default: top-left below header

export default function WeatherChip() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('서울');

  // Drag state
  const [pos, setPos] = useState(DEFAULT_POS);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const hasDragged = useRef(false);
  const chipRef = useRef<HTMLDivElement>(null);

  // Restore saved position from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weatherChipPos');
      if (saved) {
        const p = JSON.parse(saved);
        // Clamp to viewport
        const maxX = window.innerWidth - 160;
        const maxY = window.innerHeight - 56;
        setPos({
          x: Math.max(0, Math.min(p.x, maxX)),
          y: Math.max(0, Math.min(p.y, maxY)),
        });
      }
    } catch {}
  }, []);

  // Fetch weather
  useEffect(() => {
    fetch(`/api/weather?region=${encodeURIComponent(selectedRegion)}`)
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data) setWeather(d.data); })
      .catch(() => {});
  }, [selectedRegion]);

  // ─── Mouse drag ───
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    hasDragged.current = false;
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    setIsDragging(true);

    const onMove = (me: MouseEvent) => {
      const dx = me.clientX - dragStart.current.mx;
      const dy = me.clientY - dragStart.current.my;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;
      const nx = Math.max(0, Math.min(dragStart.current.px + dx, window.innerWidth - 160));
      const ny = Math.max(0, Math.min(dragStart.current.py + dy, window.innerHeight - 56));
      setPos({ x: nx, y: ny });
    };

    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      // Save position
      setPos((p) => {
        localStorage.setItem('weatherChipPos', JSON.stringify(p));
        return p;
      });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [pos]);

  // ─── Touch drag ───
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    hasDragged.current = false;
    dragStart.current = { mx: t.clientX, my: t.clientY, px: pos.x, py: pos.y };

    const onMove = (te: TouchEvent) => {
      const tt = te.touches[0];
      const dx = tt.clientX - dragStart.current.mx;
      const dy = tt.clientY - dragStart.current.my;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        hasDragged.current = true;
        te.preventDefault();
      }
      const nx = Math.max(0, Math.min(dragStart.current.px + dx, window.innerWidth - 160));
      const ny = Math.max(0, Math.min(dragStart.current.py + dy, window.innerHeight - 56));
      setPos({ x: nx, y: ny });
    };

    const onEnd = () => {
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      setPos((p) => {
        localStorage.setItem('weatherChipPos', JSON.stringify(p));
        return p;
      });
    };

    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  }, [pos]);

  const handleClick = () => {
    // Only toggle expand if it wasn't a drag
    if (!hasDragged.current) {
      setExpanded((prev) => !prev);
    }
  };

  const score = weather?.score ?? '–';
  const isHot = weather?.isHotAlert ?? false;

  return (
    <div
      ref={chipRef}
      style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999, userSelect: 'none', touchAction: 'none' }}
    >
      {/* Chip */}
      <button
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={handleClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border transition-all cursor-grab active:cursor-grabbing ${
          isDragging ? 'opacity-80 scale-105' : ''
        } ${
          isHot
            ? 'bg-rose-500/90 text-white border-rose-400/50'
            : 'bg-emerald-500/90 text-white border-emerald-400/50'
        }`}
        title="드래그해서 이동 가능"
      >
        <Thermometer className="w-3.5 h-3.5" />
        <span>산책지수 {score}점</span>
        <span>{isHot ? '🔥' : '🌿'}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded panel */}
      {expanded && !isDragging && (
        <div className="absolute top-10 left-0 w-64 bg-white/97 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-4 space-y-3">
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
