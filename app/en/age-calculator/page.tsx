import type { Metadata } from "next";
import AgeCalculator from "@/components/AgeCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Pet Age to Human Years Calculator | Magentalab",
  description: "Easily convert your puppy, kitten, or senior dog/cat's age into human years and receive life stage specific healthcare tips.",
  keywords: ["pet age converter", "dog age in human years", "cat age in human years", "puppy age chart", "senior pet care", "pet lifespan", "puppy milestones", "Magentalab"],
  openGraph: {
    title: "Pet Age to Human Years Calculator | Magentalab",
    description: "Enter your pet's birth year and month to translate their age to human years and get veterinary recommendations.",
    url: "https://www.magentalabblog.com/en/age-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "Magentalab Pet Age Calculator",
      }
    ]
  }
};

export default async function AgeCalculatorPageEn() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "en");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for Age (en):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <AgeCalculator lang="en" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="age" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
