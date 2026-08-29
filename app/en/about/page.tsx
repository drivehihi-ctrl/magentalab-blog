import { Metadata } from "next";
import { getPosts } from "@/lib/wp";
import { notFound } from "next/navigation";
import RelatedPosts from "@/components/RelatedPosts";
import AboutEEATFeatures from "@/components/AboutEEATFeatures";

export const metadata: Metadata = {
  title: "About Magentalab | Magentalab",
  description: "Introducing Magentalab's mission and content creation principles, which started from pet parents' questions.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/about",
    languages: {
      'ko-KR': 'https://www.magentalabblog.com/about',
      'en-US': 'https://www.magentalabblog.com/en/about',
      'ja-JP': 'https://www.magentalabblog.com/ja/about',
    },
  },
  openGraph: {
    title: "About Magentalab | Magentalab",
    description: "Introducing Magentalab's mission and content creation principles, which started from pet parents' questions.",
    url: "https://www.magentalabblog.com/en/about",
    type: "website",
    siteName: "Magentalab",
    images: [{ url: "/images/favicon.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Magentalab | Magentalab",
    description: "Introducing Magentalab's mission and content creation principles, which started from pet parents' questions.",
    images: ["/images/favicon.png"]
  }
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
            Magentalab Begins with Pet Parents' Questions
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            If you live with a pet, you've probably stayed up late searching for answers that never seem clear. Magentalab started from those exact, earnest questions.
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
            
            <h2>Why was Magentalab created?</h2>
            <p>There's a lot of information on the internet, but it's hard to know if it's safe to apply to your own pet right away. Magentalab isn't just a place that gathers a lot of information. Our goal is to help pet parents understand difficult health, nutrition, and behavioral information, and to help distinguish between what can be monitored at home and what requires an immediate vet visit.</p>
            
            <h2>How do we verify our data?</h2>
            <p>When creating content about diseases, nutrition, or behavior, we always prioritize authoritative veterinary guidelines, government agency data, and peer-reviewed research. We don't rely on past posts as our sole starting point for facts; we adhere to the principle of constantly verifying current evidence.</p>

            <h2>How are articles created?</h2>
            <p>Our content starts with the actual worries and questions of pet parents. We research a wide range of professional materials, compare different sources of evidence, and explain them in language that pet parents can easily understand. During this process, we carefully review to ensure there are no highly dangerous self-treatment methods or overly definitive statements.</p>

            <h2>The limits of medical information</h2>
            <p>All content and calculator tools on Magentalab are for educational and reference purposes only. An accurate diagnosis and treatment for an individual animal must always be conducted through an in-person consultation with your attending veterinarian. If you observe emergency signs in your pet, visiting a veterinary clinic always takes precedence over online information or calculator results.</p>

            <h2>How do we fix incorrect information?</h2>
            <p>Veterinary medicine is constantly advancing. When new guidelines are published, better evidence is confirmed, or an error is discovered through valuable reader feedback, Magentalab swiftly re-verifies the content and makes transparent updates.</p>
            
            <h2>Who runs this site?</h2>
            <p>Magentalab is an information platform operated to support the healthy daily lives of pets. For inquiries regarding service usage or suggestions, you can always reach us through the official contact information at the bottom of the site.</p>
          </div>

          <AboutEEATFeatures lang="en" />
          <RelatedPosts posts={relatedPosts} lang="en" />
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="container mx-auto px-4 max-w-4xl mt-24">
        <div className="p-12 rounded-4xl bg-gray-900 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Join us on our journey.</h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto">
              Partnership proposals are always welcome.
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
