import { Metadata } from "next";
import { getPosts } from "@/lib/wp";
import RelatedPosts from "@/components/RelatedPosts";

export const metadata: Metadata = {
  title: "About Us | Magentalab",
  description: "Introduction to the mission and research fields of Magentalab Pet Research Lab.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/about",
  },
};

export default async function EnAboutPage() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "en");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch posts for English About:", error);
  }

  return (
    <div className="pb-24">
      {/* Page Header */}
      <header className="relative pt-24 pb-32 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest mb-6">
            ABOUT US
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.2] mb-8 tracking-tight">
            Researching Tomorrow for Pets with Data and Love, Magentalab
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium italic">
            "Why should we study the language of our pets?"
          </p>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-magenta/5 rounded-l-full blur-3xl opacity-30 transform translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-magenta/5 rounded-r-full blur-3xl opacity-20 transform -translate-x-1/2" />
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-4xl shadow-2xl shadow-magenta/5 border border-gray-100 p-8 md:p-16">
          <div className="wp-content prose prose-lg md:prose-xl prose-magenta max-w-none text-gray-700 leading-relaxed font-normal mb-12">
            <img 
              src="https://magentalab.mycafe24.com/wp-content/uploads/2026/04/Magentalab_logo_We_202604050029.jpeg" 
              alt="Magentalab Lab" 
              className="rounded-3xl w-full mb-8 shadow-md"
            />
            <p>
              The Magentalab Pet Research Institute is not just a place that lists random information. In a flood of pet information, we were founded to provide the "verified medical knowledge" and "practical lifestyle solutions" that pet parents need the most.
            </p>
            <p>
              We utilize global AI technology to rapidly collect vast amounts of worldwide veterinary data, publishing the most accurate and heartwarming content through the precise Editorial Responsibility of our Lead Researcher.
            </p>

            <h2>🔬 Magentalab’s 3 Core Research Areas</h2>
            
            <p>
              <strong>① Precise Breed Analysis (Breed Archive)</strong><br />
              Beyond simple physical traits, we analyze genetic characteristics, behavioral personalities, and anatomical risks based on activity levels to propose optimal care solutions tailored to each breed.
            </p>

            <p>
              <strong>② Disease Prevention and Health Encyclopedia (Health Wiki)</strong><br />
              We meticulously organize disease mechanisms and emergency prevention guidelines so that pet parents can access immediate medical clues during moments of panic in daily life (such as urinary abnormalities, acute poisoning, or joint diseases).
            </p>

            <p>
              <strong>③ Pet Life Science (Life Science)</strong><br />
              From information on pet-friendly infrastructures where you can travel together to the latest nutritional trends, we scientifically research ways to elevate the quality of life you share with your pet.
            </p>

            <h2>💖 Magentalab’s Behavioral Governance (E-E-A-T)</h2>
            <ul>
              <li><strong>Experience:</strong> Through the eyes of our mascot and Lead Researcher, Ansimi the Dachshund, we deeply capture the realistic nursing concerns and behavioral contexts that actual pet parents face in their daily lives.</li>
              <li><strong>Expertise:</strong> Based on advanced data analysis tools and veterinary Dry Matter (DM) conversion formulas, we precisely reverse-calculate Nitrogen-Free Extract (NFE) and essential daily water requirements to build absolute numerical reliability in our information.</li>
              <li><strong>Authoritativeness:</strong> We strictly comply with Google's YMYL (Your Money or Your Life) standards, aiming to serve as the standard technical guide for managing pet health scores and urinary/endocrine diseases.</li>
              <li><strong>Trust:</strong> We consider the life and health of pets as our absolute highest priority, promising to connect you only with flawless, verified knowledge that has passed our strict Fact Check.</li>
            </ul>

            <h2>🧪 Magentalab’s 3-Step Content Screening Protocol</h2>
            <p>
              To meet the reliability standards of Google search engines and AI answer overviews, all knowledge reports from Magentalab are published only after consistently passing the following 3-step screening protocol:
            </p>
            <ul>
              <li><strong>[API Collection]</strong> Real-time traffic analysis of global medical academic metrics and AAFCO feeding guidelines.</li>
              <li><strong>[Fact Check]</strong> Removal of AI draft text slop and correction for the absolute integrity of veterinary clinical metrics.</li>
              <li><strong>[Human Intervention]</strong> Insights drawn from actual pet parents' experiences and the optimization of intuitive structured data (Schema).</li>
            </ul>
          </div>

          <RelatedPosts posts={relatedPosts} lang="en" />
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="container mx-auto px-4 max-w-4xl mt-24">
        <div className="p-12 rounded-4xl bg-gray-900 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Join us on our journey forward.</h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto">
              Partnership proposals and inquiries are always welcome.
            </p>
            <div className="flex justify-center">
              <a 
                href="mailto:smagentalab@gmail.com"
                className="px-10 py-4 bg-magenta hover:bg-magenta/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-magenta/20"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-magenta/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
