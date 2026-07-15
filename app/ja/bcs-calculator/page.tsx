import type { Metadata } from "next";
import BCSCalculator from "@/components/BCSCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "ペットの肥満度(BCS)＆ダイエットカロリー計算機 | マゼンタラボ",
  description: "犬・猫の体重、去勢避妊有無、活動量、BCS 9段階を元に、1日の推奨カロリー(DER/RER)と適正な給餌量(g)を自動計算します。獣医学的食事療法標準。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/bcs-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/bcs-calculator",
      en: "https://www.magentalabblog.com/en/bcs-calculator",
      ja: "https://www.magentalabblog.com/ja/bcs-calculator",
    },
  },
  keywords: ["ペット肥満度計算", "犬カロリー計算", "猫カロリー計算", "犬のダイエット", "猫のダイエット", "RER計算機", "DER計算機", "BCS 9段階", "キャットフード計算", "マゼンタラボ"],
  openGraph: {
    title: "ペットの肥満度(BCS)＆ダイエットカロリー計算機 | マゼンタラボ",
    description: "愛犬・愛猫の体型(BCS 9段階)に合わせた、1日の目標消費カロリーと給餌量を無料リアルタイム判定。",
    url: "https://www.magentalabblog.com/ja/bcs-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "マゼンタラボ ペットBCS計算機",
      }
    ]
  }
};

export default async function BcsCalculatorPageJa() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for BCS (ja):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <BCSCalculator lang="ja" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="bcs" lang="ja" />
        <RelatedPosts posts={relatedPosts} lang="ja" />
      </div>
    </div>
  );
}
