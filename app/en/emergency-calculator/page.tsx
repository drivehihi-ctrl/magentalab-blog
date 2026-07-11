import type { Metadata } from "next";
import EmergencyCalculator from "@/components/EmergencyCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";

export const metadata: Metadata = {
  title: "Pet Poison Toxicity Emergency Calculator | Magentalab",
  description: "Assess toxicity risks for dogs and cats after ingesting chocolate, grapes, onions, or other harmful foods. Enter weight and dosage to find clinical guidelines.",
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

export default function EmergencyCalculatorPageEn() {
  return (
    <div className="bg-slate-50 pb-20">
      <EmergencyCalculator lang="en" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="emergency" lang="en" />
      </div>
    </div>
  );
}
