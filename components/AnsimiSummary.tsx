import Image from "next/image";

interface AnsimiSummaryProps {
  excerpt: string;
  categoryNames: string[];
}

export default function AnsimiSummary({ excerpt, categoryNames }: AnsimiSummaryProps) {
  // Determine empathy message based on categories
  let empathyMessage = "우리 아이와 함께하는 행복한 시간, 안심이가 늘 곁에서 도울게요! 🐾";
  
  if (categoryNames.some(c => c.includes('건강') || c.includes('질병'))) {
    empathyMessage = "우리 아이 건강 정보, 꼼꼼히 챙겨서 오랫동안 행복하게 함께해요! 안심이가 응원할게요. 🏥✨";
  } else if (categoryNames.some(c => c.includes('푸드') || c.includes('음식'))) {
    empathyMessage = "맛있는 거 먹을 때가 제일 행복하죠! 건강한 간식으로 아이의 웃음꽃을 피워주세요. 🥗❤️";
  } else if (categoryNames.some(c => c.includes('생활') || c.includes('훈련'))) {
    empathyMessage = "아이가 더 편안해하는 법, 차근차근 배우다 보면 어느새 마음이 통해 있을 거예요! 🏠🤝";
  }

  // Handle empty excerpt
  const displayExcerpt = excerpt || "이 게시글의 핵심 연구 데이터를 확인해 보세요. 반려동물을 위한 가치 있는 정보가 준비되어 있습니다.";

  return (
    <aside 
      className="mb-12 p-6 md:p-8 rounded-3xl bg-magenta-light/30 border border-magenta/10 shadow-sm relative overflow-hidden"
      aria-label="안심 연구원의 돋보기 요약"
    >
      {/* Decorative magnifying glass icon in background */}
      <div className="absolute top-4 right-4 text-magenta/5 text-8xl font-black pointer-events-none transform rotate-12">
        🔍
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
        {/* Ansim-i Avatar */}
        <div className="flex-shrink-0">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white p-2 shadow-sm border border-magenta/5 overflow-hidden">
            <Image
              src="/images/ansimi-researcher2.png"
              alt="안심 연구원"
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
              안심 연구원의 <span className="text-magenta">돋보기 요약</span>
            </h3>
          </div>

          <div 
            className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 font-medium font-sans prose-sm max-w-none"
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
