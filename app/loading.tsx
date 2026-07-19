import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-6">
        {/* 안심이 연구원 캐릭터 둥둥 뜨는 애니메이션 */}
        <div className="relative w-32 h-32 animate-float">
          <Image
            src="/images/ansimi-researcher2.png"
            alt="안심이 연구원 로딩 중"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* 핑크색 스피너 */}
        <div className="w-10 h-10 border-4 border-magenta-light border-t-magenta rounded-full animate-spin" />
        
        {/* 로딩 안내 문구 */}
        <div className="text-center px-4">
          <p className="text-gray-900 font-bold text-lg mb-1">안심이 연구원이 정보를 분석하고 있어요</p>
          <p className="text-gray-500 text-sm font-medium">Analyzing / 情報分析中</p>
          <p className="text-gray-400 text-xs mt-1">잠시만 기다려주세요...</p>
        </div>
      </div>
    </div>
  );
}
