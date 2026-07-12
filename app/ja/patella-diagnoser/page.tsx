import type { Metadata } from "next";
import PatellaDiagnoser from "@/components/PatellaDiagnoser";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "犬の膝蓋骨脱臼(パテラ)＆関節健康チェック | マゼンタラボ",
  description: "犬の歩行姿勢や行動シグナルから、膝蓋骨脱臼(パテラ)リスクをセルフチェックし、獣医師推奨の関節ケア対策を紹介します。",
  keywords: ["犬の膝蓋骨脱臼パテラ", "犬関節健康セルフチェック", "犬が後ろ足をあげる", "小型犬関節炎予防", "マゼンタラボ"],
  openGraph: {
    title: "犬の膝蓋骨脱臼(パテラ)＆関節健康チェック | マゼンタラボ",
    description: "愛犬の跛行サインと歩き方からパテラ発症の重症リスク（グレード1-4）を簡易判定します。",
    url: "https://www.magentalabblog.com/ja/patella-diagnoser",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "マゼンタラボ 犬パテラ診断器",
      }
    ]
  }
};

export default async function PatellaDiagnoserPageJa() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for Patella (ja):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <PatellaDiagnoser lang="ja" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="patella" lang="ja" />
        <RelatedPosts posts={relatedPosts} lang="ja" />
      </div>
    </div>
  );
}
