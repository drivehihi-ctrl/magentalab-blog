import type { Metadata } from "next";
import FicDiagnoser from "@/components/FicDiagnoser";
import CalculatorBanner from "@/components/CalculatorBanner";

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

export default function FicDiagnoserPageEn() {
  return (
    <div className="bg-slate-50 pb-20">
      <FicDiagnoser lang="en" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="fic" lang="en" />
      </div>
    </div>
  );
}
