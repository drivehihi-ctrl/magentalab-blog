import type { Metadata } from "next";
import AgeCalculator from "@/components/AgeCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "ペット年齢の人間換算＆健康ライフステージ計算機 | マゼンタラボ",
  description: "愛犬・愛猫의年齢を人間年齢に素早く換算し、幼少期・成犬期・高齢シニア期に最適化された予防ケア情報を提供します。",
  keywords: ["ペットの人間年齢", "犬の年齢換算", "猫の年齢換算", "ペットライフステージ", "シニア犬ケア", "シニア猫ヘルス", "マゼンタラボ"],
  openGraph: {
    title: "ペット年齢の人間換상＆健康ライフステージ計算機 | マゼンタラボ",
    description: "誕生年月を入力するだけで、ペットの本当의 年齢を人間用へ換算し、最適な獣医ケアアドバイスを提示します。",
    url: "https://www.magentalabblog.com/ja/age-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "マゼンタラボ ペット年齢計算機",
      }
    ]
  }
};

export default async function AgeCalculatorPageJa() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for Age (ja):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <AgeCalculator lang="ja" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="age" lang="ja" />
        <RelatedPosts posts={relatedPosts} lang="ja" />
      </div>
    </div>
  );
}
