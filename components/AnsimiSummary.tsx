import Image from "next/image";

interface AnsimiSummaryProps {
  excerpt: string;
  categoryNames: string[];
  lang?: "ko" | "en" | "ja";
}

export default function AnsimiSummary({ excerpt, categoryNames, lang = "ko" }: AnsimiSummaryProps) {
  // Localization dictionaries
  const defaults = {
    ko: {
      defaultExcerpt: "이 게시글의 핵심 연구 데이터를 확인해 보세요.",
      titlePre: "안심 연구원의 ",
      titlePost: "돋보기 요약",
      empathyDefault: "우리 아이와 함께하는 행복한 시간, 안심이가 늘 곁에서 도울게요! 🐾",
      empathyHealth: "우리 아이 건강 정보, 꼼꼼히 챙겨서 오랫동안 행복하게 함께해요! 안심이가 응원할게요. 🏥✨",
      empathyFood: "맛있는 거 먹을 때가 제일 행복하죠! 건강한 간식으로 아이의 웃음꽃을 피워주세요. 🥗❤️",
      empathyBehavior: "아이가 더 편안해하는 법, 차근차근 배우다 보면 어느새 마음이 통해 있을 거예요! 🏠🤝"
    },
    en: {
      defaultExcerpt: "Check out the key research data of this article.",
      titlePre: "Ansim's ",
      titlePost: "Quick Summary",
      empathyDefault: "Happy times with your companion animal, Ansim will always be by your side to help! 🐾",
      empathyHealth: "Let's keep our companion's health details in check to stay happy together for a long time! Ansim is rooting for you. 🏥✨",
      empathyFood: "Eating delicious food brings the most joy! Light up your companion's day with healthy snacks. 🥗❤️",
      empathyBehavior: "Learning how to make your companion feel more comfortable will build a deeper bond before you know it! 🏠🤝"
    },
    ja: {
      defaultExcerpt: "この記事の主要な研究データを確認してみましょう。",
      titlePre: "アンシム研究員の",
      titlePost: "虫眼鏡要約",
      empathyDefault: "うちの子と共にする幸せな時間、アンシムがいつもそばでサポートします！ 🐾",
      empathyHealth: "うちの子の健康情報を細かくチェックして、末永く幸せに暮らしましょう！アンシムが応援します。 🏥✨",
      empathyFood: "美味しいものを食べる時が一番幸せですよね！健康的なおやつでうちの子の笑顔を咲かせてください。 🥗❤️",
      empathyBehavior: "うちの子がもっと快適に過ごせる方法を少しずつ学んでいけば、いつの間にか心が通じ合っているはずです！ 🏠🤝"
    }
  };

  const text = defaults[lang] || defaults.ko;

  // Handle manual empathy message via separator in excerpt
  let displayExcerpt = excerpt || text.defaultExcerpt;
  let manualEmpathyMessage = "";

  // Common explicit separators: [공감], [Empathy], [共感], [message], [summary], ---, <hr /> or standalone line break separators
  // NOTE: Inline em-dashes (\u2014) inside normal English sentences are preserved and NOT split.
  const separatorPattern = /\[(?:공감|empathy|共感|message|summary)\]|(?:\r?\n)\s*(?:---|—|–|<\s*hr\s*\/?>)\s*(?:\r?\n)/i;
  
  if (excerpt && separatorPattern.test(excerpt)) {
    const parts = excerpt.split(separatorPattern);
    displayExcerpt = parts[0]
      .replace(/안심이의\s*|공감\s*|한마디\s*|[:：]\s*$|Empathy\s*|共感\s*/gi, "")
      .trim();
    
    if (parts.length > 1 && parts[parts.length - 1].trim()) {
      manualEmpathyMessage = parts[parts.length - 1]
        .replace(/<[^>]*>?/gm, "") 
        .replace(/&nbsp;/g, " ")    
        .replace(/&#8220;|&#8221;/g, '"') 
        .replace(/&#8216;|&#8217;/g, "'") 
        .replace(/&#8230;/g, "...")        
        .replace(/^[:：\s]*|한마디\s*[:：]\s*/g, "") 
        .trim();
    }
  }

  // Determine empathy message based on categories (Fallback)
  let automatedEmpathyMessage = text.empathyDefault;
  
  const isHealth = categoryNames.some(c => 
    c.includes('건강') || c.includes('질병') || 
    c.includes('Health') || c.includes('Disease') || 
    c.includes('健康') || c.includes('疾病')
  );
  
  const isFood = categoryNames.some(c => 
    c.includes('푸드') || c.includes('음식') || 
    c.includes('Food') || c.includes('Nutrition') || 
    c.includes('フード') || c.includes('栄養')
  );
  
  const isBehavior = categoryNames.some(c => 
    c.includes('생활') || c.includes('훈련') || 
    c.includes('Behavior') || c.includes('Training') || 
    c.includes('しつけ') || c.includes('ライフスタイル')
  );

  if (isHealth) {
    automatedEmpathyMessage = text.empathyHealth;
  } else if (isFood) {
    automatedEmpathyMessage = text.empathyFood;
  } else if (isBehavior) {
    automatedEmpathyMessage = text.empathyBehavior;
  }

  const empathyMessage = manualEmpathyMessage || automatedEmpathyMessage;

  return (
    <aside 
      className="mb-12 p-6 md:p-8 rounded-3xl bg-magenta-light/30 border border-magenta/10 shadow-sm relative overflow-hidden"
      aria-label="Ansim's Quick Summary"
    >
      <div className="absolute top-4 right-4 text-magenta/5 text-8xl font-black pointer-events-none transform rotate-12">
        🔍
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
        {/* Ansim-i Avatar */}
        <div className="flex-shrink-0">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white p-2 shadow-sm border border-magenta/5 overflow-hidden">
            <Image
              src="/images/like.png"
              alt="Ansim"
              fill
              className="object-contain p-1"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-magenta font-black text-lg">🔍</span>
            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">
              {text.titlePre}<span className="text-magenta">{text.titlePost}</span>
            </h3>
          </div>

          <div 
            className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 font-medium whitespace-pre-wrap font-sans prose-sm max-w-none prose-p:my-1"
            dangerouslySetInnerHTML={{ __html: displayExcerpt }}
          />

          {/* Empathy Box */}
          <div className="bg-white/60 rounded-2xl p-4 border border-white/40">
            <p className="text-xs md:text-sm text-magenta-dark font-bold font-sans italic flex items-center gap-2">
              <span className="text-xl">“</span>
              {empathyMessage}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

