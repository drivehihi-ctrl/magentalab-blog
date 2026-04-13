import Image from "next/image";
import Link from "next/link";

const PRODUCTS = [
  {
    id: 1,
    name: "[안심 건강] 고농축 오메가-3 연구소 에디션",
    price: "34,000원",
    category: "영양제",
    image: "https://images.unsplash.com/photo-1550572017-edb418de4315?q=80&w=600&auto=format&fit=crop",
    desc: "안심이 팀이 엄선한 고순도 오메가-3로 아이들의 피모와 면역력을 챙겨주세요.",
    badge: "추천",
    review: "정말 깨끗한 원료만 담았어요!"
  },
  {
    id: 2,
    name: "[안심 편안] 스트레스 완화 릴렉스 껌",
    price: "18,900원",
    category: "간식/껌",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop",
    desc: "천연 유래 성분으로 산책 후나 천둥 소리에 놀란 아이들을 차분하게 도와줍니다.",
    badge: "인기",
    review: "기호성까지 완벽하게 잡았습니다."
  },
  {
    id: 3,
    name: "[안심 청결] 저자극 포스트-바이오틱스 샴푸",
    price: "22,000원",
    category: "위생용품",
    image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=600&auto=format&fit=crop",
    desc: "민감한 피부를 가진 아이들을 위해 연구소에서 직접 테스트한 저자극 포뮬러입니다.",
    badge: "신상품",
    review: "피부 장벽까지 생각한 샴푸예요."
  }
];

export default function ShopPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-magenta/10 text-magenta text-xs font-bold uppercase tracking-widest mb-6">
                Magenta Mall Open
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                안심이가 연구하고 <br />
                <span className="text-magenta">마젠타랩</span>이 보증합니다.
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                시중의 흔한 상품이 아닌, 우리 아이들의 건강과 행복을 위해 
                과학적으로 검증된 제품들만 까다롭게 골랐습니다.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a href="#products" className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-xl">
                  상품 둘러보기
                </a>
                <Link href="/about" className="px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all">
                  연구소 철학 보기
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] mx-auto animate-float">
                <Image
                  src="/images/ansimi-researcher2.png"
                  alt="Researcher Ansim-i"
                  fill
                  className="object-contain"
                />
              </div>
              {/* Decorative background circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-magenta/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="products" className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">현재 연구소 추천 상품</h2>
              <p className="text-gray-500">마젠타랩 연구팀이 직접 테스트하고 검증한 리스트입니다.</p>
            </div>
            <div className="hidden md:block">
              <span className="text-sm font-bold text-magenta uppercase tracking-widest">Total 3 items</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-magenta/5 transition-all duration-500 hover:-translate-y-2">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {product.badge && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-magenta text-white text-[10px] font-bold rounded-lg uppercase tracking-widest z-10">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-magenta uppercase tracking-widest px-2 py-0.5 bg-magenta/5 rounded-md italic">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-magenta transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                    {product.desc}
                  </p>
                  
                  {/* Ansimi Review Box */}
                  <div className="mb-8 p-4 bg-gray-50 rounded-2xl relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Ansim-i Review</div>
                    </div>
                    <p className="text-xs font-bold text-gray-700 italic">" {product.review} "</p>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-magenta/10 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-magenta" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-2xl font-black text-gray-900">{product.price}</span>
                    <button className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-magenta transition-all shadow-lg shadow-gray-200">
                      구매하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-gray-900 py-20 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">마젠타랩은 '판매'보다 '안전'에 집중합니다.</h2>
          <p className="text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            저희가 판매하는 모든 제품은 연구소의 까다로운 검수 절차를 거친 제품입니다. 
            만약 아이들이 거부하거나 품질에 문제가 있다면, 100% 안심하고 문의해 주세요.
          </p>
          <div className="flex justify-center gap-8 text-sm font-bold uppercase tracking-widest text-magenta">
            <span>Official Guarantee</span>
            <span>Safety First</span>
            <span>Eco-Friendly</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-magenta/10 rounded-full blur-3xl" />
      </section>
    </div>
  );
}
