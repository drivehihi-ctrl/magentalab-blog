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

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '186380c4d2f6974b4c29d1be55963a4a';

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

    const shareUrl = `https://map.magentalabblog.com/place/${placeId}`;
    const externalUrl = `kakaotalk://web/openExternal?url=${encodeURIComponent(shareUrl)}`;
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
            title: `[마젠타랩 펫 맵] 🐶 우리 아이와 함께 가볼까? ${placeName}`,
            description: `📍 ${address} (${categoryName})\n"${descText}"`,
            imageUrl: defaultImage,
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
              androidExecutionParams: `placeId=${placeId}`,
              iosExecutionParams: `placeId=${placeId}`,
            },
          },
          buttons: [
            {
              title: '펫 맵에서 상세보기',
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
                androidExecutionParams: `placeId=${placeId}`,
                iosExecutionParams: `placeId=${placeId}`,
              },
            },
          ],
        });
        return;
      } catch (err) {
        console.warn('Kakao Share API failed:', err);
      }
    }

    // 2. Web Share API Fallback
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `[마젠타랩 펫 맵] ${placeName}`,
        text: `📍 ${address} (${categoryName})`,
        url: shareUrl,
      }).catch((err) => console.log('Web Share cancelled or failed:', err));
      return;
    }

    // 3. Clipboard Fallback
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        alert('공유 링크가 복사되었습니다! 카카오톡 대화방에 붙여넣어 공유하세요.');
      }).catch(() => {
        alert(`링크 주소: ${shareUrl}`);
      });
    }
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
