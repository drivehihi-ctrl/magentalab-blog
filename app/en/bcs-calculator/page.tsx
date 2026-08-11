import type { Metadata } from "next";
import BCSCalculator from "@/components/BCSCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Pet BCS & Diet Calorie Calculator | Magentalab",
  description: "Calculate your dog or cat's daily recommended calories (DER/RER) and kibble feeding amounts based on current weight, neutering status, activity, and BCS 9-step obesity grade.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/bcs-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/bcs-calculator",
      en: "https://www.magentalabblog.com/en/bcs-calculator",
      ja: "https://www.magentalabblog.com/ja/bcs-calculator",
    },
  },
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

import SeoArticle from "@/components/SeoArticle";

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
      
      <SeoArticle title="What is the Body Condition Score (BCS) for Dogs and Cats?">
        <p>
          The Body Condition Score (BCS) is a standardized assessment method widely used in veterinary clinics to evaluate the body fat and overall shape of dogs and cats. Relying solely on a scale's weight can make it difficult to accurately determine whether a pet is underweight, at a normal weight, or overweight. This is because the ideal weight varies greatly depending on the animal's skeletal size, breed, and body type.
        </p>
        <p>
          BCS is evaluated by visually observing the entire body shape and physically palpating the ribs, spine, and waist area to check the thickness of the fat layer. The commonly used 9-point BCS scale categorizes body types from a score of 1 (severely underweight) to 9 (severely obese).
        </p>
        <p>
          Generally, a BCS of 4 to 5 out of 9 is considered the ideal range. In an ideal body shape, the ribs do not protrude excessively but can be easily felt. When viewed from above, the waistline is clearly visible, and when viewed from the side, the abdomen shows an appropriate tuck.
        </p>
        <p>
          However, since the ideal BCS can be evaluated differently depending on the pet's species, age, breed, muscle mass, and overall health status, it is highly recommended to receive a physical examination by a veterinarian for an accurate assessment.
        </p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Why are Diet and Calorie Control (DER/RER) Important?</h3>
        <p>
          Pet obesity is not just a cosmetic issue; it is a critical health problem that increases the risk of multiple diseases and significantly degrades the quality of life. Excessive body weight increases the strain on joints and ligaments, and is closely associated with an elevated risk or worsening of orthopedic conditions, such as osteoarthritis.
        </p>
        <p>
          Furthermore, obesity is linked to an increased risk of insulin resistance and diabetes mellitus, particularly in cats, and can place additional burdens on the respiratory and cardiovascular systems of pets. Therefore, maintaining an ideal body weight is not simply about managing appearance, but a crucial element of long-term health management.
        </p>
        <p>
          Notably, if an overweight or obese cat suddenly stops eating or is subjected to an excessively rapid calorie restriction, excessive amounts of body fat can mobilize to the liver, leading to a life-threatening condition known as Feline Hepatic Lipidosis (fatty liver). Since this is a severe disease that requires immediate treatment, weight loss in obese cats must never be rushed.
        </p>
        <p>
          For safe weight loss, instead of arbitrarily slashing their current food intake, it is vital to establish an initial daily calorie goal that considers their target weight, current BCS, activity level, neuter/spay status, and age.
        </p>
        <p>
          RER (Resting Energy Requirement) is an estimated value of the basic energy required to sustain life when the pet is resting. Using this as a baseline, the actual daily feeding calories (DER) can be adjusted based on activity level, life stage, and weight loss objectives.
        </p>
        <p>
          The calculated calories should not be treated as an absolute value, but rather as a starting point for weight management. You must regularly monitor actual weight changes and BCS, and adjust the feeding amount accordingly to safely approach the target weight.
        </p>
        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>Medical Disclaimer:</strong> This calculator was developed referencing veterinary materials on pet body condition assessment and energy requirements provided by WSAVA, AAHA, and APOP. However, the calculated results are general reference values. The actual energy requirement may vary depending on the individual pet's breed, age, activity level, neuter/spay status, muscle mass, and underlying conditions such as hypothyroidism, Cushing's syndrome, or diabetes. In particular, drastic dietary restrictions in obese cats can increase the risk of hepatic lipidosis. We strongly recommend consulting with your primary veterinarian before initiating any weight loss program.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="bcs" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
