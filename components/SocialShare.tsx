"use client";

import { useState } from "react";
import { Facebook, Twitter, Link as LinkIcon, Check, Share2 } from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.origin + url : url;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

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
      icon: <Facebook size={18} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#1877F2] hover:text-white",
      borderColor: "hover:border-[#1877F2]",
    },
    {
      name: "Twitter",
      icon: <Twitter size={18} />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-[#1DA1F2] hover:text-white",
      borderColor: "hover:border-[#1DA1F2]",
    },
  ];

  return (
    <div className="flex flex-col gap-4 py-8">
      <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
        <Share2 size={12} className="text-magenta" />
        지식 공유하기
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
          <span className="text-sm font-bold">{copied ? "링크 복사됨!" : "링크 복사"}</span>
        </button>
      </div>
    </div>
  );
}
