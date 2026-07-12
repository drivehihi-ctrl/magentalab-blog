import type { Metadata } from "next";
import FicDiagnoser from "@/components/FicDiagnoser";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Feline FIC Cystitis & Stress Diagnoser | Magentalab",
  description: "Evaluate your cat's behavioral stress factors and Feline Idiopathic Cystitis (FIC) hazard levels. Veterinary-backed home stress care instructions.",
  keywords: ["feline idiopathic cystitis", "cat bladder stress diagnoser", "FIC index cat", "cat urination accident", "feline stress behaviors", "urinary tract infection cat", "Magentalab"],
  openGraph: {
    title: "Feline FIC Cystitis & Stress Diagnoser | Magentalab",
    description: "Self-screen your cat's stress factors and urinary health condition using our interactive behavioral questionnaire.",
    url: "https://www.magentalabblog.com/en/fic-diagnoser",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "Magentalab Feline FIC Diagnoser",
      }
    ]
  }
};

export default async function FicDiagnoserPageEn() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "en");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for FIC (en):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <FicDiagnoser lang="en" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="fic" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
