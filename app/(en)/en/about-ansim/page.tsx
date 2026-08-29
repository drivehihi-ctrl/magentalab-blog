import { Metadata } from "next";
import { getPosts } from "@/lib/wp";
import Link from "next/link";
import RelatedPosts from "@/components/RelatedPosts";

export const metadata: Metadata = {
  title: "About Ansim",
  description: "Introducing Ansim, Magentalab's mascot and a guide for pet parents.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/about-ansim",
    languages: {
      'ko-KR': 'https://www.magentalabblog.com/about-ansim',
      'en-US': 'https://www.magentalabblog.com/en/about-ansim',
      'ja-JP': 'https://www.magentalabblog.com/ja/about-ansim',
    },
  },
  openGraph: {
    title: "About Ansim",
    description: "Introducing Ansim, Magentalab's mascot and a guide for pet parents.",
    url: "https://www.magentalabblog.com/en/about-ansim",
    type: "website",
    siteName: "Magentalab",
    images: [{ url: "/images/favicon.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Ansim",
    description: "Introducing Ansim, Magentalab's mascot and a guide for pet parents.",
    images: ["/images/favicon.png"]
  }
};

export default async function EnAboutAnsimPage() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "en");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch posts for English About Ansim:", error);
  }

  return (
    <article className="pb-24">
      {/* Page Header */}
      <header className="relative pt-16 pb-24 bg-white border-b border-gray-100 overflow-hidden text-center">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link 
            href="/en" 
            className="inline-flex items-center gap-2 mb-10 text-sm font-bold text-magenta uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to Home
          </Link>
          
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest">
            About Ansim
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4">
            What kind of researcher is Ansim?
          </h1>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-magenta/5 blur-3xl opacity-30 transform translate-y-1/2" />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-4xl mt-12">
        <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-2xl shadow-gray-200/50 border border-gray-100">
          <div className="wp-content prose prose-lg md:prose-xl prose-magenta max-w-none text-gray-700 leading-relaxed font-normal mb-16">
            <img 
              src="https://magentalab.mycafe24.com/wp-content/uploads/2026/04/33-17-1024x572.jpeg" 
              alt="Magentalab Ansim Dachshund Mascot" 
              className="rounded-3xl w-full mb-8 shadow-md"
            />
            
            <p>Have you ever felt lost while reading complex veterinary articles online when your pet is acting differently? "What does this actually mean for my pet?" Ansim was created for those exact moments—to stand by pet parents and break down complicated information into easy-to-understand terms.</p>
            
            <h2>What Ansim Does</h2>
            <p>Ansim is Magentalab's <strong>Dachshund researcher mascot</strong>, created to explain pet health and lifestyle information from a pet parent's perspective. She is not a real veterinarian or medical professional, and she does not diagnose illnesses or prescribe treatments.</p>
            <p>Instead, Ansim takes on the following roles:</p>
            <ul>
              <li>Translates difficult veterinary data into everyday language that pet parents can easily understand.</li>
              <li>Compares different research and guidelines to organize the context clearly.</li>
              <li>Distinguishes between minor daily symptoms and situations that absolutely require emergency veterinary care.</li>
            </ul>

            <h2>What sources are referenced?</h2>
            <p>When explaining pet health and lifestyle information, Magentalab prioritizes authoritative veterinary guidelines, government agency data, and peer-reviewed research. We create content based on reliable resources from organizations such as the AAHA, WSAVA, Merck Veterinary Manual, and the FDA.</p>

            <h2>How should calculators and risk checkers be used?</h2>
            <p>The various calculators and risk checkers provided by Magentalab are intended solely as <strong>reference tools</strong> for pet parents to understand and track their pet's condition. They cannot replace a physical exam or diagnosis by a real veterinarian, and a single result should never be used to determine a specific disease.</p>

            <h2>Ansim's Promise</h2>
            <p>We honestly say when we don't know something. If new evidence is confirmed, we review the content and make necessary updates. Above all, because a life is more important than an online search, guiding you to a vet clinic without delay during emergencies will always be our top priority.</p>
          </div>
          
          
          
          {/* CTA / Footer */}
          <div className="mt-20 pt-12 border-t border-gray-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Have questions for Ansim?
            </h3>
            <div className="flex justify-center">
              <a 
                href="mailto:smagentalab@gmail.com"
                className="px-10 py-4 bg-magenta hover:bg-magenta/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-magenta/20 transform hover:-translate-y-1"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </main>
    </article>
  );
}
