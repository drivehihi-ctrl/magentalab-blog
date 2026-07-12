import type { Metadata } from "next";
import DmCalculator from "@/components/DmCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "ペットフード乾物量(DM)栄養＆水分摂取量計算機 | マゼンタラボ",
  description: "キャットフード・ドッグフード表示の水分を除いた真の栄養構成比と、ペットの健康状態に適した1日の推奨飲水量を自動測定します。",
  keywords: ["フード乾物量計算", "犬の水分補給", "猫の飲水量", "キャットフード栄養基準", "ペット脱水予防", "マゼンタラボ"],
  openGraph: {
    title: "ペットフード乾物量(DM)栄養＆水分摂取量計算機 | マゼンタラボ",
    description: "製品ラベルから保証分析値を入力し、乾物基準(DM)への換算と個体ごとの理想的な必要水分量を調べます。",
    url: "https://www.magentalabblog.com/ja/dm-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "マゼンタラボ DM計算機",
      }
    ]
  }
};

export default async function DmCalculatorPageJa() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for DM (ja):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <DmCalculator lang="ja" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="dm" lang="ja" />
        <RelatedPosts posts={relatedPosts} lang="ja" />
      </div>
    </div>
  );
}
