import type { Metadata } from "next";
import EmergencyCalculator from "@/components/EmergencyCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "ペット誤食中毒症状応急判定シミュレーター | マゼンタラボ",
  description: "チョコレート、ネギ類、ブドウ、キシリトールなど犬・猫の中毒物質誤食時に、体重と摂取量から危険レベルを判定し臨床ガイドを提供します。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/emergency-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/emergency-calculator",
      en: "https://www.magentalabblog.com/en/emergency-calculator",
      ja: "https://www.magentalabblog.com/ja/emergency-calculator",
    },
  },
  keywords: ["ペット誤食中毒", "犬のチョコレート中毒", "キシリトール犬誤食", "ペット危険食べ物", "猫中毒判定", "マゼンタラボ"],
  openGraph: {
    title: "ペット誤食中毒症状応急判定シミュレーター | マゼンタラボ",
    description: "誤食した成分量とペットの体重から、危険度判定（4段階）と家庭での初期応急処置情報を案内。",
    url: "https://www.magentalabblog.com/ja/emergency-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "マゼンタラボ 中毒応急計算機",
      }
    ]
  }
};

export default async function EmergencyCalculatorPageJa() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for Emergency (ja):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <EmergencyCalculator lang="ja" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="emergency" lang="ja" />
        <RelatedPosts posts={relatedPosts} lang="ja" />
      </div>
    </div>
  );
}
