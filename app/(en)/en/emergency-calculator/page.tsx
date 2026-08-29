import type { Metadata } from "next";
import EmergencyCalculator from "@/components/EmergencyCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Pet Poison Toxicity Emergency Calculator | Magentalab",
  description: "Assess medical risk and action levels for dogs and cats after ingesting chocolate, grapes, onions, or other harmful foods. Enter weight and dosage for clinical guidelines.",
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
    description: "Veterinary risk assessment and action level screener based on pet weight and ingested substance.",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Poison Toxicity Emergency Calculator | Magentalab",
    description: "Veterinary risk assessment and action level screener based on pet weight and ingested substance.",
    images: ["/images/favicon.png"],
  }
};

import SeoArticle from "@/components/SeoArticle";

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
      
      <SeoArticle title="Toxicity in Dogs and Cats: Rapid Action Matters">
        <p>
          Foods and plants that are safe for humans can cause serious poisoning in dogs and cats. Common hazards include <strong>theobromine and caffeine in chocolate, grapes and raisins, Allium plants such as onions and garlic, xylitol, and certain lilies that are highly toxic to cats.</strong>
        </p>
        <p>
          If a pet has ingested a potentially dangerous substance, the most important step is not to wait for symptoms to appear but to <strong>contact a veterinary clinic as soon as possible.</strong> The severity of poisoning can vary considerably depending on the type and concentration of the substance, the amount consumed, the pet’s body weight, the time since ingestion, and any symptoms already present.
        </p>
        <p>
          For substances such as chocolate or xylitol, the amount consumed relative to body weight (mg/kg) can be important when assessing risk. However, not every poisoning can be evaluated with a simple dose calculation. In cases such as grape or raisin ingestion or lily exposure in cats, where a safe dose cannot be reliably predicted, <strong>veterinary advice is warranted even when the amount appears small.</strong>
        </p>
        <p>
          Treatment for poisoning does not automatically mean inducing vomiting. For certain substances that were ingested recently, a veterinarian may consider inducing vomiting or using other forms of gastrointestinal decontamination. However, depending on the substance and the animal’s condition, inducing vomiting may actually be dangerous. Rather than attempting treatment on your own, it is important to identify the product or plant involved, the estimated amount consumed, the approximate time of ingestion, and your pet’s body weight, and provide this information to the veterinary clinic.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Signs of Poisoning from Common Hazardous Substances</h3>
        <ul className="list-disc list-inside space-y-2 mt-2 text-sm sm:text-base">
          <li><strong>Chocolate and cocoa:</strong> Chocolate contains methylxanthines known as theobromine and caffeine. Cocoa powder, baking chocolate, and dark chocolate with a high cocoa content generally contain higher concentrations of methylxanthines. Poisoning may cause vomiting, diarrhea, restlessness, increased thirst, rapid breathing, a fast or abnormal heart rhythm, tremors, and seizures. Severe cases can be life-threatening. Risk should be assessed by considering <strong>the type of chocolate, the amount consumed, and the pet’s body weight</strong> together.</li>
          <li><strong>Grapes and raisins:</strong> Grapes and raisins can cause <strong>acute kidney injury (AKI)</strong> in some dogs. Recent research has identified tartaric acid as a likely major toxic factor, but its concentration varies among grapes and individual sensitivity also differs, making it difficult to predict an exact toxic dose. If a dog eats grapes or raisins, it is therefore best not to assume that a small amount is automatically safe.</li>
          <li><strong>Onions, garlic, and other Allium plants:</strong> Onions, garlic, green onions, chives, and related plants contain organosulfur compounds that can cause oxidative damage to red blood cells. In sufficient amounts, ingestion may result in <strong>hemolytic anemia</strong>, with signs such as lethargy, loss of appetite, vomiting, pale gums, and rapid breathing. Cats are known to be particularly sensitive to Allium toxicity.</li>
          <li><strong>Lilies, especially in cats:</strong> True lilies of the genus Lilium and daylilies of the genus Hemerocallis are particularly dangerous to cats. Not only the flowers and leaves but even <strong>ingestion of pollen or water from a vase can lead to severe acute kidney injury.</strong> If a cat has been exposed to these lilies, it is important to contact a veterinary clinic immediately even if no symptoms are present. Not every plant with “lily” in its common name has the same kidney toxicity, so identifying the exact plant is also important.</li>
          <li><strong>Xylitol in dogs:</strong> Xylitol can trigger rapid insulin release in dogs and cause <strong>severe hypoglycemia.</strong> Signs may include vomiting, lethargy, weakness or unsteadiness, tremors, and seizures. Some dogs exposed to larger amounts may also develop severe liver injury or liver failure. Xylitol can be found not only in gum and candy but also in certain sugar-free foods, toothpaste, medications, and supplements, so checking ingredient labels is important.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">🚨 What to Do If You Suspect Poisoning</h3>
        <p>
          If you suspect that your pet has ingested a toxic substance, <strong>do not wait for symptoms to appear—contact a veterinary clinic immediately.</strong> If possible, have the product packaging or ingredient list available, or take a photo of the plant involved. Providing the estimated amount consumed, the approximate time of ingestion, and your pet’s body weight can help the veterinary team assess the situation.
        </p>
        <p>
          <strong>Do not attempt to force vomiting on your own using salt water, medications, or other home remedies.</strong> Using hydrogen peroxide to induce vomiting in cats is particularly dangerous. In dogs, 3% hydrogen peroxide may be used in certain situations under direct veterinary guidance, but it is not appropriate for every type of poisoning. Incorrect use can lead to gastrointestinal injury, aspiration, or other complications. It should only be given when a veterinarian provides specific instructions.
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>Veterinary Note:</strong> Toxicity risk calculations are intended only as a reference to help assess the urgency of a possible poisoning. They cannot confirm that an exposure is safe and cannot replace veterinary care. Toxic substances differ in their hazardous dose, absorption rate, and treatment, and some exposures—such as grapes, raisins, and lilies—cannot be reliably judged by calculations alone. If your pet has ingested a hazardous substance, or if you are unsure whether an exposure occurred but poisoning is possible, contact a veterinary clinic as soon as possible.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="emergency" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
