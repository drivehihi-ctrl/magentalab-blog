import type { Metadata } from "next";
import EmergencyCalculator from "@/components/EmergencyCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Pet Poison Toxicity Emergency Calculator | Magentalab",
  description: "Assess toxicity risks for dogs and cats after ingesting chocolate, grapes, onions, or other harmful foods. Enter weight and dosage to find clinical guidelines.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/emergency-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/emergency-calculator",
      en: "https://www.magentalabblog.com/en/emergency-calculator",
      ja: "https://www.magentalabblog.com/ja/emergency-calculator",
    },
  },
  keywords: ["pet poison calculator", "dog chocolate toxicity", "onion poisoning dogs", "canine toxicity emergency", "harmful food list dogs", "feline toxicity index", "Magentalab"],
  openGraph: {
    title: "Pet Poison Toxicity Emergency Calculator | Magentalab",
    description: "Real-time veterinary toxicity level diagnostic screener based on pet weight and ingested dosage.",
    url: "https://www.magentalabblog.com/en/emergency-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "Magentalab Pet Toxicity Calculator",
      }
    ]
  }
};

export default async function EmergencyCalculatorPageEn() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "en");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for Emergency (en):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <EmergencyCalculator lang="en" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="emergency" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
