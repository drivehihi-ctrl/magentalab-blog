"use client";

import { useState } from "react";
import { Link as LinkIcon, Check, Share2, MessageCircle } from "lucide-react";

// Inline Brand SVGs
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C6.477 3 2 6.477 2 10.767c0 2.775 1.83 5.21 4.582 6.602l-1.168 4.303c-.083.307.262.556.529.378l5.127-3.418c.306.024.617.036.93.036 5.523 0 10-3.477 10-7.767C22 6.477 17.523 3 12 3z"/>
  </svg>
);

interface SocialShareProps {
  url: string;
  title: string;
  lang?: "ko" | "en" | "ja";
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || 'c7850585b1a0e91017128dcf19fc6a25';

export default function SocialShare({ url, title, lang }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.origin + url : `https://www.magentalabblog.com${url}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  let currentLang: "ko" | "en" | "ja" = lang || "ko";
  if (!lang) {
    if (typeof window !== "undefined") {
      if (window.location.pathname.startsWith("/ja/")) {
        currentLang = "ja";
      } else if (window.location.pathname.startsWith("/en/")) {
        currentLang = "en";
      }
    } else {
      if (url.startsWith("/ja/")) {
        currentLang = "ja";
      } else if (url.startsWith("/en/")) {
        currentLang = "en";
      }
    }
  }

  const textMap = {
    ko: {
      share: "지식 공유하기",
      copy: "링크 복사",
      copied: "링크 복사됨!",
    },
    en: {
      share: "Share Knowledge",
      copy: "Copy Link",
      copied: "Link Copied!",
    },
    ja: {
      share: "知識を共有する",
      copy: "リンクをコピー",
      copied: "コピー完了!",
    },
  };

  const currentText = textMap[currentLang] || textMap.ko;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleKakaoShare = () => {
    if (typeof window !== "undefined" && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }
      try {
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: title,
            description: "마젠타랩(Magentalab) 반려동물 연구소에서 유용한 소식을 확인해보세요!",
            imageUrl: "https://www.magentalabblog.com/images/favicon.png",
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: "마젠타랩에서 읽기",
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
          ],
        });
        return;
      } catch (e) {
        console.warn("Kakao share failed:", e);
      }
    }
    handleCopy();
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: <FacebookIcon />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#1877F2] hover:text-white",
      borderColor: "hover:border-[#1877F2]",
    },
    {
      name: "Twitter (X)",
      icon: <TwitterIcon />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-[#000000] hover:text-white",
      borderColor: "hover:border-[#000000]",
    },
  ];

  return (
    <div className="flex flex-col gap-4 py-8">
      <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
        <Share2 size={12} className="text-magenta" />
        {currentText.share}
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* KakaoTalk 1-Second Share Button */}
        <button
          onClick={handleKakaoShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-[#FEE500] bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 font-bold text-sm"
          aria-label="KakaoTalk Share"
        >
          <KakaoIcon />
          <span>카카오톡</span>
        </button>

        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${link.color} ${link.borderColor}`}
            aria-label={`Share on ${link.name}`}
          >
            {link.icon}
            <span className="text-sm font-bold">{link.name}</span>
          </a>
        ))}

        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
            copied 
              ? "bg-green-500 border-green-500 text-white" 
              : "bg-white border-gray-100 text-gray-700 hover:border-magenta hover:text-magenta"
          }`}
        >
          {copied ? <Check size={18} /> : <LinkIcon size={18} />}
          <span className="text-sm font-bold">{copied ? currentText.copied : currentText.copy}</span>
        </button>
      </div>
    </div>
  );
}
