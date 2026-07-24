'use client';

import React, { useState } from 'react';
import { MessageCircle, Check } from 'lucide-react';

declare global {
  interface Window {
    Kakao?: any;
  }
}

interface KakaoShareButtonProps {
  placeName: string;
  categoryName: string;
  address: string;
  imageUrl?: string;
  description?: string;
  placeId: string;
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || 'c7850585b1a0e91017128dcf19fc6a25';

export default function KakaoShareButton({
  placeName,
  categoryName,
  address,
  imageUrl,
  description,
  placeId,
}: KakaoShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleKakaoShare = () => {
    if (typeof window === 'undefined') return;

    const shareUrl = `https://www.magentalabblog.com/map/place/${placeId}`;
    const defaultImage = imageUrl || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80';
    const descText = description ? description.substring(0, 80) : `${address} 에 위치한 대표 ${categoryName} 스팟입니다.`;

    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }

      try {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `[마젠타랩 펫 맵] 🐶 이번 주말 여기 어때? ${placeName}`,
            description: `📍 ${address} (${categoryName})\n"${descText}"`,
            imageUrl: defaultImage,
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: '펫 맵에서 상세보기',
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
          ],
        });
        return;
      } catch (err) {
        console.warn('Kakao Share API failed, fallback to Web Share or Clipboard:', err);
      }
    }

    // Fallback: Copy Link
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleKakaoShare}
      className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-extrabold text-sm sm:text-base rounded-2xl transition shadow-md shadow-amber-200/50 group"
      aria-label="카카오톡으로 공유하기"
    >
      <MessageCircle className="w-5 h-5 fill-[#191919] stroke-none group-hover:scale-110 transition-transform" />
      <span>{copied ? '상세 링크 복사 완료!' : '카카오톡으로 친구에게 공유하기'}</span>
      {copied && <Check className="w-4 h-4 text-emerald-600 ml-1" />}
    </button>
  );
}
