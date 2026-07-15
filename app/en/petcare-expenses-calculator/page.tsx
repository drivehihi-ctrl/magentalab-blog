import type { Metadata } from "next";
import PetcareExpensesCalculator from "@/components/PetcareExpensesCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Pet Lifetime Cost & Monthly Budget Simulator | Magentalab",
  description: "Calculate the monthly maintenance and cumulative lifetime cost of raising dogs and cats. Custom simulator for food grades and vet healthcare schedules.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/petcare-expenses-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/petcare-expenses-calculator",
      en: "https://www.magentalabblog.com/en/petcare-expenses-calculator",
      ja: "https://www.magentalabblog.com/ja/petcare-expenses-calculator",
    },
  },
  keywords: ["pet cost calculator", "cost of owning a dog", "cat budget simulator", "pet monthly expenses", "lifetime pet cost", "puppy vaccines price", "Magentalab"],
  openGraph: {
    title: "Pet Lifetime Cost & Monthly Budget Simulator | Magentalab",
    description: "Simulate lifetime expenditures and monthly maintenance fees for food, grooming, and veterinary care.",
    url: "https://www.magentalabblog.com/en/petcare-expenses-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "Magentalab Pet Expenses Simulator",
      }
    ]
  }
};

export default async function PetcareExpensesCalculatorPageEn() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "en");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for Petcare Expenses (en):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <PetcareExpensesCalculator lang="en" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="expenses" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
