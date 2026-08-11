import type { Metadata } from "next";
import DmCalculator from "@/components/DmCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Dry Matter (DM) Nutrition & Hydration Calculator | Magentalab",
  description: "Uncover real nutrition percentages of your pet's pet food and compute the recommended daily water intake for dogs and cats.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/dm-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/dm-calculator",
      en: "https://www.magentalabblog.com/en/dm-calculator",
      ja: "https://www.magentalabblog.com/ja/dm-calculator",
    },
  },
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

import SeoArticle from "@/components/SeoArticle";

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
      
      <SeoArticle title="Why Is It Important to Convert Pet Food Nutrients to a Dry Matter (DM) Basis?">
        <p>
          Pet food packaging displays registered nutrient values or nutritional information such as crude protein, crude fat, crude fiber, and moisture in accordance with applicable labeling standards. However, most nutrient values shown on the package are presented on an <strong>as-fed basis, meaning the moisture contained in the food is included in the reported values.</strong>
        </p>
        <p>
          Because of this, directly comparing the numbers printed on packages can be misleading when the foods have very different moisture contents.
        </p>
        <p>
          For example, wet food generally contains a large amount of moisture, while dry food contains considerably less. Even if the protein percentage shown on a wet-food label appears lower than that of a dry food, the proportion of protein in the actual solid portion after moisture is excluded may be higher.
        </p>
        <p>
          For foods with different moisture contents, converting the values to a <strong>dry matter basis is useful for comparing the nutrient density of protein, fat, carbohydrates, and other nutrients.</strong>
        </p>
        <p>
          A dry matter basis does not mean physically removing all water from the food before feeding it. Instead, it is a calculation that excludes moisture and expresses each nutrient as a proportion of the remaining solid matter, treating that solid portion as 100%.
        </p>
        <p>
          Therefore, when comparing products with substantially different moisture levels, such as dry food, wet food, and freeze-dried food, it is more appropriate to consider <strong>values converted to a dry matter basis in addition to the figures printed on the package.</strong>
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Why Daily Hydration Matters for Dogs and Cats</h3>
        <p>
          Adequate water intake is essential for maintaining normal bodily functions in dogs and cats. Water is necessary for circulation, temperature regulation, digestion, and metabolism, and it also plays an important role in normal kidney and urinary tract function.
        </p>
        <p>
          However, <strong>drinking more water does not necessarily prevent kidney failure, cystitis, or urinary stones.</strong> These conditions can be influenced by many factors, including age, genetics, diet, urine characteristics, and underlying disease. Even so, appropriate water intake is important for maintaining normal hydration, and it may be an important part of managing certain urinary tract conditions.
        </p>
        <p>
          The amount of water a healthy dog or cat needs each day varies according to body weight, activity level, environmental temperature, type of food, and overall health. As a general reference, <strong>a total daily water intake of around 40–60 mL per kilogram of body weight</strong> is often used, but this should not be treated as a fixed target for every pet.
        </p>
        <p>
          This daily water intake includes <strong>not only water consumed directly from a bowl, but also moisture contained in wet food and other foods.</strong>
        </p>
        <p>
          Because wet food contains a substantial amount of moisture, pets that primarily eat wet food may appear to drink less from their water bowls. In contrast, pets eating dry food obtain less water from their meals and therefore need to meet a larger proportion of their water requirements by drinking directly.
        </p>
        <p>
          Cats may show less spontaneous drinking behavior than dogs, and some cats may benefit from environmental strategies that encourage adequate water intake. These may include placing water bowls in several locations, replacing the water frequently with fresh water, using a water fountain if the cat prefers it, or incorporating wet food into the diet.
        </p>
        <p>
          However, eating dry food does not automatically mean that every cat is chronically dehydrated, and wet food or additional water supplementation is not mandatory for every pet. <strong>What matters is evaluating total water intake from both food and drinking water together with the individual pet’s health status.</strong>
        </p>
        <p>
          If a pet suddenly begins drinking much more water than usual or produces a noticeably larger volume of urine, this should not simply be interpreted as “good hydration.” Excessive thirst and urination can occur with a variety of health conditions, including kidney disease, diabetes mellitus, and endocrine disorders. If these changes persist, veterinary evaluation is recommended.
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>Veterinary Note:</strong> Daily water requirements are general reference values and can vary according to body weight, diet type, activity level, environmental temperature, pregnancy or lactation, and health status. Pets with chronic kidney disease, heart disease, urinary stones, or other urinary tract disorders may require hydration management that differs from general recommendations. If you are comparing the nutrient composition of a therapeutic diet or changing water intake or diet for the purpose of managing a medical condition, follow your veterinarian’s guidance.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="dm" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
