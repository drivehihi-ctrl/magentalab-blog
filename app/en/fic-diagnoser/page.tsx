import type { Metadata } from "next";
import FicDiagnoser from "@/components/FicDiagnoser";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";
import SeoArticle from "@/components/SeoArticle";

export const metadata: Metadata = {
  title: "Feline FIC Cystitis & Stress Risk Checker | Magentalab",
  description: "Evaluate your cat's behavioral stress factors and Feline Idiopathic Cystitis (FIC) hazard levels. Veterinary-backed home stress care instructions.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/fic-diagnoser",
    languages: {
      ko: "https://www.magentalabblog.com/fic-diagnoser",
      en: "https://www.magentalabblog.com/en/fic-diagnoser",
      ja: "https://www.magentalabblog.com/ja/fic-diagnoser",
    },
  },
  keywords: ["feline idiopathic cystitis", "cat bladder stress diagnoser", "FIC index cat", "cat urination accident", "feline stress behaviors", "urinary tract infection cat", "Magentalab"],
  openGraph: {
    title: "Feline FIC Cystitis & Stress Risk Checker | Magentalab",
    description: "Self-screen your cat's stress factors and urinary health condition using our interactive behavioral questionnaire.",
    url: "https://www.magentalabblog.com/en/fic-diagnoser",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "Magentalab Feline FIC Risk Checker",
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

      <SeoArticle title="What Is Feline Idiopathic Cystitis (FIC), a Common Cause of Lower Urinary Tract Disease in Cats?">
        <p>
          Feline lower urinary tract disease (FLUTD) does not refer to a single specific disease. Rather, it is an umbrella term for a range of disorders affecting the bladder and urethra. Among these, <strong>feline idiopathic cystitis (FIC)</strong> is one of the most commonly diagnosed causes, and several studies have reported that it accounts for approximately 55–65% of cats presenting with signs of FLUTD.
        </p>
        <p>
          The term “idiopathic” means that no clear underlying cause, such as urinary stones, bacterial infection, or a tumor, can be identified to explain the signs. For this reason, FIC is often diagnosed after other possible causes have been ruled out through tests such as urinalysis and diagnostic imaging.
        </p>
        <p>
          The exact cause of FIC has not been identified as a single factor. Current veterinary understanding is that it is a <strong>multifactorial condition involving stress and environmental factors, nervous system and hormonal stress responses, and changes in bladder sensation and protective function.</strong>
        </p>
        <p>
          Cats can be sensitive to changes in their environment and to social tension. Moving to a new home, the arrival of a new family member or pet, conflict with other cats, changes in daily routines, and changes to the litter box environment can all act as stressors for some cats.
        </p>
        <p>
          However, this does not simply mean that “stress causes cystitis.” Not every stressful event leads to FIC, and individual cats differ in how they respond to stress and in their risk of developing the condition. In cats with recurrent FIC, <strong>environmental enrichment and multimodal environmental modification</strong> aimed at stabilizing the home environment and reducing stressors can be important components of management.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Easy-to-Miss Signs of Feline Lower Urinary Tract Disease</h3>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>Urinating outside the litter box:</strong> If a cat that normally uses the litter box suddenly urinates on a bed, blanket, sofa, or floor, it should not automatically be interpreted as “acting out.” Possible causes include bladder or urethral pain, frequent urges to urinate, discomfort with the litter box environment, or behavioral factors. A sudden change in urination habits is a reason to consider whether a urinary tract problem may be present.</li>
          <li><strong>Excessive licking of the genital area or lower abdomen:</strong> Repeated licking around the genitals or lower abdomen more often than usual may be associated with discomfort or pain involving the bladder or urethra. If over-grooming continues to the point of hair loss, urinary tract disease should be considered alongside skin disease and behavioral causes.</li>
          <li><strong>Frequent litter box visits with only small amounts of urine:</strong> Entering the litter box more often than usual, straining for long periods, producing smaller urine clumps, or passing only small amounts of urine can be important signs of lower urinary tract disease. Some cats may cry or appear uncomfortable while urinating, and blood may also be visible in the urine.</li>
        </ul>
        <p className="mt-4">
          These signs alone cannot confirm FIC. Urinary stones, urethral obstruction, urinary tract infection, and other conditions can produce similar signs, so veterinary evaluation is recommended if the symptoms recur or become more severe.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">🚨 In Male Cats, Inability to Urinate Is an Emergency</h3>
        <p>
          Male cats have a longer and narrower urethra than female cats, which places them at greater risk of <strong>urethral obstruction</strong>. Inflammation associated with FIC, urethral spasm, urethral plugs, or urinary stones can block the urethra and prevent urine from being passed normally.
        </p>
        <p>
          If a cat repeatedly enters the litter box and strains but <strong>produces little or no urine, do not wait to see whether the problem resolves on its own.</strong>
        </p>
        <p>
          A complete urethral obstruction can severely affect kidney function and lead to life-threatening complications such as elevated blood potassium, acid-base disturbances, and uremia. Therefore, if a male cat repeatedly assumes a urination posture but no urine is actually being produced, <strong>contact an emergency veterinary clinic immediately and seek veterinary care.</strong>
        </p>
        <p>
          Treatment for urethral obstruction depends on the cat’s overall condition and the severity of the blockage. Stabilization with intravenous fluids and correction of electrolyte abnormalities may be required, and in many cases the obstruction is relieved using a urinary catheter under sedation or anesthesia.
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>Veterinary Note:</strong> This self-check feature is intended only as a reference tool to help identify the possibility of feline lower urinary tract disease based on urination behaviors observed by the owner. It cannot diagnose FIC, urinary stones, urinary tract infection, or urethral obstruction. In particular, if a cat repeatedly strains but passes no urine or only a very small amount, especially when accompanied by pain, vomiting, or lethargy, this may be an emergency. Seek veterinary care immediately regardless of the self-check result.
        </p>
      </SeoArticle>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="fic" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
