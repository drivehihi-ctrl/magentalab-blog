import type { Metadata } from "next";
import PatellaRisk Checker from "@/components/PatellaRisk Checker";
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

import SeoArticle from "@/components/SeoArticle";

export default async function PatellaRisk CheckerPageEn() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "en");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for Patella (en):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <PatellaRisk Checker lang="en" />
      
      <SeoArticle title="What Is Patellar Luxation, a Common Condition in Small Dogs?">
        <p>
          Patellar luxation is a <strong>relatively common orthopedic condition in small-breed dogs</strong>, including Maltese, Pomeranians, Chihuahuas, and Miniature Poodles. However, it does not occur in every small dog, and the level of risk varies by breed and individual.
        </p>
        <p>
          The patella is a small bone located at the front of the knee. Normally, it moves within a groove at the end of the femur called the <strong>trochlear groove</strong>. Patellar luxation occurs when the patella moves out of its normal position toward either the inside or outside of the knee. In small dogs, <strong>medial patellar luxation (MPL)</strong>, in which the patella moves toward the inside of the knee, is particularly common.
        </p>
        <p>
          Patellar luxation should not be viewed simply as a condition caused by a shallow groove in the knee. Non-traumatic patellar luxation is influenced by genetic and developmental factors, and may involve a combination of abnormalities in the shape and angulation of the femur and tibia, the position of the tibial tuberosity, and the alignment of the extensor mechanism extending from the quadriceps through the patella and patellar tendon.
        </p>
        <p>
          Repeated slipping on smooth floors or jumping down from elevated surfaces may place additional stress on the joints or increase the risk of injury in dogs that already have knee or joint problems. However, these environmental factors alone cannot be said to cause patellar luxation or necessarily make it progress rapidly. Maintaining an appropriate body weight and reducing repeated slipping or excessive jumping may help support joint health.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">How Is Patellar Luxation Graded from I to IV?</h3>
        <p className="mb-4">
          The grade of patellar luxation is not determined simply by observing how a dog walks. Instead, <strong>a veterinarian evaluates the position of the patella and whether it can be luxated and returned to its normal position through orthopedic palpation.</strong>
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2 text-sm sm:text-base">
          <li><strong>Grade I:</strong> The patella normally remains within the trochlear groove but can be manually luxated during examination. When pressure is released, it returns to its normal position on its own. Clinical signs may be absent or occur only intermittently, so owners may not notice anything unusual.</li>
          <li><strong>Grade II:</strong> The patella may luxate spontaneously during movement or can be manually displaced, and it may remain out of position for a period of time. It may return to its normal position when the dog extends the leg or changes posture. A characteristic <strong>“skipping gait,”</strong> in which the dog suddenly carries a hind leg for a few steps while walking, may occur.</li>
          <li><strong>Grade III:</strong> The patella remains luxated most of the time but can still be manually returned to its normal position. However, it may luxate again easily. If the condition persists for a long period, abnormalities in the alignment of the femur or tibia and deformities of the limb may develop. Persistent gait abnormalities or lameness may be observed.</li>
          <li><strong>Grade IV:</strong> The patella is permanently luxated and is difficult or impossible to manually return to the normal trochlear groove. This is the most severe grade. Significant skeletal deformity and abnormal gait may be present, although the degree of pain and walking ability can vary between individual dogs.</li>
        </ul>

        <p className="mt-4">
          Not every dog with patellar luxation requires surgery. <strong>Mild cases without clinical signs may be managed with regular monitoring.</strong> Surgical correction may be considered when there is repeated lameness or pain, when the luxation is severe, or when skeletal deformity and joint damage are progressing.
        </p>
        <p className="mt-4">
          Repeated displacement of the patella from the trochlear groove can damage joint cartilage over time and contribute to the development of osteoarthritis. It may also place additional stress on other structures within the knee. Some dogs may also develop cranial cruciate ligament disease. Therefore, if a dog repeatedly shows an abnormal gait or frequently carries one hind leg while walking, it is better to seek an orthopedic evaluation rather than attempting to determine the grade at home.
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-6 font-medium text-sm">
          ⚠️ <strong>Veterinary Note:</strong> This self-check tool is intended only as a reference to help identify the possibility of patellar luxation based on gait and signs observed by the owner. It cannot confirm the diagnosis or determine the grade of patellar luxation. Diagnosis and grading are primarily based on an orthopedic palpation examination performed by a veterinarian. Radiographs may additionally be used to assess bone shape and alignment, joint changes, and surgical planning. If symptoms recur or your dog shows pain, persistent lameness, or reduced weight-bearing on a limb, veterinary evaluation is recommended.
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="patella" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
