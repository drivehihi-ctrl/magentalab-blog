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
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8 tracking-tight">
            We walk alongside your companion pets, Magentalab.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Magentalab Pet Research Lab studies better lives for companion animals through data and science.
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
            <p>
              Magentalab is not just about conveying simple information. We aim to be the ultimate companion guide for the happiness and wellness of your beloved family members.
            </p>
            <p>
              By leveraging global AI technologies, we analyze pet health information in-depth and share verified knowledge under strict editorial responsibility.
            </p>

            <h2>🔬 Our Three Main Research Pillars</h2>
            
            <p>
              <strong>🧬 Breed Archive</strong><br />
              We anatomically analyze breed-specific genetic traits, behavior, and activity levels to offer highly tailored information.
            </p>

            <p>
              <strong>🏥 Health Wiki</strong><br />
              We deliver immediate veterinary guidelines for daily emergency situations, nutritional imbalances, and chronic illnesses to empower pet parents.
            </p>

            <p>
              <strong>🌱 Life Science</strong><br />
              We study and suggest the latest veterinary trends and lifestyle habits to promote a healthy and joyful companion life.
            </p>

            <h2>🔍 Our Action Mechanisms (E-E-A-T)</h2>
            <ul>
              <li><strong>Experience:</strong> Represented by our chief researcher "Dachshund Ansim", we share practical pet care tips tested in everyday life.</li>
              <li><strong>Expertise:</strong> We quantify and explain complex veterinary nutrition data such as Dry Matter (DM) and Nitrogen-Free Extract (NFE) calculations.</li>
              <li><strong>Authoritativeness:</strong> We strictly adhere to YMYL guidelines to publish accurate anatomical and disease information.</li>
              <li><strong>Trust:</strong> Meticulous fact checks are executed before publishing, prioritizing pet health above all.</li>
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
