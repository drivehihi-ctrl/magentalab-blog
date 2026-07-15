import type { Metadata } from "next";
import PatellaDiagnoser from "@/components/PatellaDiagnoser";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Dog Patella Luxation & Orthopedic Screener | Magentalab",
  description: "Self-assess patella luxation risk grades for dogs based on walking postures and behavioral patterns. Clinical joint management guidelines.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/patella-diagnoser",
    languages: {
      ko: "https://www.magentalabblog.com/patella-diagnoser",
      en: "https://www.magentalabblog.com/en/patella-diagnoser",
      ja: "https://www.magentalabblog.com/ja/patella-diagnoser",
    },
  },
  keywords: ["dog patella luxation calculator", "canine joint health screening", "dog limping test", "patellar subluxation", "small dog orthopedic care", "Magentalab"],
  openGraph: {
    title: "Dog Patella Luxation & Orthopedic Screener | Magentalab",
    description: "Assess patella luxation and joint health risk stages instantly with clinical walking sign lists.",
    url: "https://www.magentalabblog.com/en/patella-diagnoser",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "Magentalab Dog Patella Screener",
      }
    ]
  }
};

export default async function PatellaDiagnoserPageEn() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "en");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for Patella (en):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <PatellaDiagnoser lang="en" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="patella" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
