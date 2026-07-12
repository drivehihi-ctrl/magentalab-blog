import type { Metadata } from "next";
import DmCalculator from "@/components/DmCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Dry Matter (DM) Nutrition & Hydration Calculator | Magentalab",
  description: "Uncover real nutrition percentages of your pet's pet food and compute the recommended daily water intake for dogs and cats.",
  keywords: ["dry matter calculator", "dog water intake calculator", "cat water intake calculator", "pet food nutrition analysis", "carb content in kibble", "pet hydration guide", "Magentalab"],
  openGraph: {
    title: "Dry Matter (DM) Nutrition & Hydration Calculator | Magentalab",
    description: "Convert guaranteed analysis to Dry Matter basis and calculate the ideal daily water intake for your dog or cat.",
    url: "https://www.magentalabblog.com/en/dm-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "Magentalab Dry Matter Calculator",
      }
    ]
  }
};

export default async function DmCalculatorPageEn() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "en");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for DM (en):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <DmCalculator lang="en" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="dm" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
