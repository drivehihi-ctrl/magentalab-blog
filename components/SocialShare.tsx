"use client";

import { useState } from "react";
import { Link as LinkIcon, Check, Share2 } from "lucide-react";

// Inline Brand SVGs (Lucide 1.x does not include Brands)
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

interface SocialShareProps {
  url: string;
  title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.origin + url : url;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  // 현재 경로 혹은 url을 통해 언어 자동 감지
  let currentLang: "ko" | "en" | "ja" = "ko";
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
