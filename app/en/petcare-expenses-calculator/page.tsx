import type { Metadata } from "next";
import PetcareExpensesCalculator from "@/components/PetcareExpensesCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";
import SeoArticle from "@/components/SeoArticle";

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

      <SeoArticle title="How Much Does It Cost to Care for a Dog or Cat Over a Lifetime?">
        <p>
          Before welcoming a pet into your family, it is important to think not only about love and companionship, but also about whether you are <strong>financially prepared to care for that animal throughout its entire life</strong>. Caring for a pet involves ongoing expenses, including food and treats, hygiene supplies, vaccinations and health checkups, grooming, and medical treatment.
        </p>
        <p>
          According to the <strong>2025 Animal Welfare Public Awareness Survey</strong> published by South Korea’s Ministry of Agriculture, Food and Rural Affairs, the average monthly cost of caring for one companion animal was approximately <strong>KRW 121,000</strong>. By species, the average was about <strong>KRW 135,000 for dogs</strong> and <strong>KRW 92,000 for cats</strong>, while the overall average monthly veterinary expense was approximately <strong>KRW 37,000</strong>.
        </p>
        <p>
          If current prices were assumed to remain unchanged and this monthly average were simply multiplied over 15 years, the overall average would amount to approximately KRW 21.78 million. However, this is only a rough reference obtained by extrapolating the current monthly survey figure. Actual lifetime costs can vary substantially depending on the type and size of the pet, the food it eats, living environment, health status, use of veterinary services, and changes in prices over time.
        </p>
        <p>
          This calculator is a <strong>reference tool designed to break down the often-vague concept of “pet ownership costs” into individual expense categories</strong> for both prospective and current pet owners. By entering food and treat expenses, hygiene supplies such as waste products or cat litter, grooming and routine care costs, and medical expenses such as vaccinations and health examinations, users can estimate monthly spending and long-term cumulative costs.
        </p>
        <p>
          The calculation does not guarantee future expenses. Its purpose is to help owners think ahead about the budget they may need based on their current spending level.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Pet Care Costs Can Change Across Life Stages</h3>
        <p>
          The cost of caring for a pet does not remain constant throughout its lifetime.
        </p>
        <p>
          During the <strong>growth stage, including puppyhood and kittenhood</strong>, expenses may be concentrated around vaccinations, parasite prevention, and health examinations. Depending on the owner’s choice and veterinary advice, one-time expenses such as spaying or neutering may also occur. Initial purchases of essential items such as harnesses, carriers, litter boxes, food bowls, and bedding should also be considered.
        </p>
        <p>
          During <strong>adulthood</strong>, recurring expenses such as food, treats, waste supplies or cat litter, and preventive care generally make up a larger share of the budget. However, veterinary expenses may rise if a pet develops skin disease, dental problems, injuries, or other illnesses.
        </p>
        <p>
          During the <strong>senior stage</strong>, pets may require more frequent health monitoring, and some may become more likely to develop conditions such as chronic kidney disease, joint disease, cardiovascular disease, dental disease, or tumors. As a result, spending on diagnostic tests, medications, therapeutic diets, and treatment may increase compared with earlier life stages.
        </p>
        <p>
          The age at which the senior stage begins is not the same for every pet. In dogs especially, the timing of aging varies considerably according to breed, body size, and expected lifespan, so it is not appropriate to classify every dog as senior based on a single fixed age.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Prepare for Unexpected Veterinary Expenses</h3>
        <p>
          Average monthly ownership costs alone cannot account for every possible expense. Unexpected situations such as surgery for patellar luxation or cranial cruciate ligament disease, tumor diagnosis and treatment, dental care, emergency visits, or hospitalization can result in significantly higher veterinary bills than usual.
        </p>
        <p>
          For this reason, it may be worthwhile to set aside <strong>a separate budget specifically for unexpected veterinary expenses</strong> in addition to routine living costs. Options include saving a fixed amount each month for pet medical expenses or considering pet insurance after comparing coverage limits, deductibles, exclusions, and other policy terms.
        </p>
        <p>
          Whichever approach you choose, the important point is to consider <strong>not only the current monthly cost of caring for a pet, but also the long-term expenses that may arise throughout the animal’s life</strong> before bringing one into your family.
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>Cost Notice:</strong> Results from this calculator are estimates based on the costs entered by the user and publicly available statistics on pet ownership expenses. They do not guarantee actual future spending. Real-world costs may vary considerably depending on food prices, regional veterinary fees, grooming and household supply costs, inflation, and the individual pet’s health. Unexpected veterinary expenses, including emergency care, hospitalization, surgery, and treatment for chronic disease, may substantially exceed the calculator’s estimate, so maintaining an additional financial reserve should be considered.
        </p>
      </SeoArticle>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="expenses" lang="en" />
        <RelatedPosts posts={relatedPosts} lang="en" />
      </div>
    </div>
  );
}
