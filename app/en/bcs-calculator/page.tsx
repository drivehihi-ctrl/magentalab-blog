import type { Metadata } from "next";
import BCSCalculator from "@/components/BCSCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Pet BCS & Diet Calorie Calculator | Magentalab",
  description: "Calculate your dog or cat's daily recommended calories (DER/RER) and kibble feeding amounts based on current weight, neutering status, activity, and BCS 9-step obesity grade.",
  keywords: ["pet obesity calculator", "dog calorie calculator", "cat calorie calculator", "dog diet", "cat diet", "RER calculator", "DER calculator", "BCS 9 steps", "pet food calculator", "Magentalab"],
  openGraph: {
    title: "Pet BCS & Diet Calorie Calculator | Magentalab",
    description: "Get real-time insights on your pet's body condition score (BCS 9-steps), daily energy requirement, and daily food guide.",
    url: "https://www.magentalabblog.com/en/bcs-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "Magentalab Pet BCS Calculator",
      }
    ]
  }
};

export default async function BcsCalculatorPageEn() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "en");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for BCS (en):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <BCSCalculator lang="en" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="bcs" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
