'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, ArrowRight, Building2, Phone, Mail, FileText, Sparkles } from 'lucide-react';

interface AboutEEATFeaturesProps {
  lang?: 'ko' | 'en' | 'ja';
}

export default function AboutEEATFeatures({ lang = 'ko' }: AboutEEATFeaturesProps) {
  const isEn = lang === 'en';
  const isJa = lang === 'ja';

  const mapTitle = isEn 
    ? "🗺️ Real-Time Pet-Friendly Map Science (Magenta Pet Map)"
    : isJa 
    ? "🗺️ リアルタイム犬同伴可能ペットマップ (Magenta Pet Map)"
    : "🗺️ 실시간 펫 프렌들리 지도 라이프 사이언스 (마젠타 펫 맵)";

  const mapDesc = isEn
    ? "Discover pet-friendly restaurants, cafes, parks, and 24-hour emergency vet clinics across the country in real time through Magentalab's location-based smart map service."
    : isJa
    ? "全国のペット同伴可能なレストラン、カフェ、公園、24時間応急動物病院の情報をリアルタイムで探せるマゼンタラボのスマートマップをご体験ください。"
    : "전국의 애견동반 식당, 펫 프렌들리 카페, 24시 응급 동물병원, 산책 공원 정보를 실시간으로 탐색할 수 있는 마젠타랩의 위치 기반 스마트 지도를 경험해 보세요.";

  const mapBtnText = isEn ? "Explore Pet Map Live ➔" : isJa ? "ペットマップを見る ➔" : "실시간 펫 맵 바로가기 ➔";
  const mapLink = isEn ? "/en" : isJa ? "/ja" : "/map";

  const trustTitle = isEn
    ? "🏢 Magentalab Pet Research Lab Official Governance & Transparency"
    : isJa
    ? "🏢 マゼンタラボペット研究所 公式ガバナンス＆透明性保証"
    : "🏢 마젠타랩 반려동물 연구소 공식 정보 및 투명성 보증";

  return (
    <div className="space-y-8 my-12 pt-8 border-t border-gray-100">

      {/* 2. Magenta Pet Map Service Card */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#2a1a3a] to-[#1a1a2e] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden space-y-4">
        <div className="h-1 w-full bg-gradient-to-r from-[#E5007E] via-amber-400 to-[#E5007E] absolute top-0 left-0" />
        
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#E5007E]/20 text-[#FF6B9D] border border-[#E5007E]/30 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Life Science Map Service
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
          {mapTitle}
        </h3>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
          {mapDesc}
        </p>

        <div className="pt-2">
          <Link
            href={mapLink}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E5007E] hover:bg-[#c0006a] text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg transition-all active:scale-95"
          >
            <MapPin className="w-4 h-4" />
            <span>{mapBtnText}</span>
          </Link>
        </div>
      </div>

      {/* 3. Official Lab E-E-A-T Governance & Transparency Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <ShieldCheck className="w-5 h-5 text-[#E5007E]" />
          <h3 className="text-sm sm:text-base font-extrabold text-gray-900">{trustTitle}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-gray-700">
          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <Building2 className="w-4 h-4 text-[#E5007E] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-gray-900">소재지 & 사업자 정보</p>
              <p className="text-gray-600 leading-relaxed">
                경기도 김포시 김포한강11로255번길 149, 112동 701호<br />
                대표이사: 김범준 | 사업자등록번호: 448-07-03101<br />
                통신판매업 신고: 제 2025-경기김포-1339호
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <Phone className="w-4 h-4 text-[#E5007E] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-gray-900">공식 연락처 & 호스팅 정보</p>
              <p className="text-gray-600 leading-relaxed">
                대표 전화: 0502-1933-8452<br />
                이메일: smagentalab@gmail.com<br />
                호스팅 제공자: Vercel Inc. / (주)가비아
              </p>
            </div>
          </div>
        </div>

        {/* Policy Links for Compliance */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-gray-500">
          <div className="flex items-center gap-4">
            <Link href={isEn ? "/en/privacy" : isJa ? "/ja/privacy" : "/privacy"} className="hover:text-[#E5007E] transition-colors flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#E5007E]" />
              <span>{isEn ? "Privacy Policy" : isJa ? "個人情報処理方針" : "개인정보처리방침"}</span>
            </Link>
            <span className="text-gray-200">|</span>
            <Link href={isEn ? "/en/terms" : isJa ? "/ja/terms" : "/terms"} className="hover:text-[#E5007E] transition-colors flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#E5007E]" />
              <span>{isEn ? "Terms of Service" : isJa ? "利用規約" : "이용약관"}</span>
            </Link>
          </div>
          <span className="text-[10px] text-gray-400">© 2026 Magentalab. All Rights Reserved.</span>
        </div>
      </div>

    </div>
  );
}
