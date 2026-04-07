import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-magenta flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-magenta/20 transition-transform group-hover:scale-110">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Magentalab
            </h1>
            <p className="text-xs font-medium text-magenta tracking-widest uppercase">
              반려동물 연구소
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
          <Link href="/" className="hover:text-magenta transition-colors">블로그</Link>
          <Link href="/about" className="hover:text-magenta transition-colors">연구소 소개</Link>
          <a href="#" className="hover:text-magenta transition-colors">파트너십</a>
          <a href="#" className="px-5 py-2.5 bg-magenta text-white rounded-full hover:bg-magenta/90 transition-all shadow-md shadow-magenta/10 hover:shadow-lg">
            문의하기
          </a>
        </nav>
      </div>
    </header>
  );
}
