import { Metadata } from "next";
import { getPosts } from "@/lib/wp";
import Link from "next/link";
import RelatedPosts from "@/components/RelatedPosts";

export const metadata: Metadata = {
  title: "About Ansim | Magentalab",
  description: "Introducing Magentalab's mascot and chief researcher, Ansim.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/about-ansim",
    languages: {
      'ko-KR': 'https://www.magentalabblog.com/about-ansim',
      'en-US': 'https://www.magentalabblog.com/en/about-ansim',
      'ja-JP': 'https://www.magentalabblog.com/ja/about-ansim',
    },
  },
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
            Meet Our Senior Researcher
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4">
            "I am Ansim, the pet researcher."
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
              alt="Magentalab Senior Researcher Ansim Dachshund Mascot" 
              className="rounded-3xl w-full mb-8 shadow-md"
            />
            <p>
              Hello! I am Ansim, the Chief Researcher of the Magentalab Pet Research Lab, and a Dachshund.
            </p>
            <p>
              Pet parents' worries are endless, and pets' pain has no voice. "Why do they scoot?", "Why are their eyes getting cloudy?" Ansim stands here as Magentalab's mascot to help find scientific answers to those questions.
            </p>

            <h3>🐾 Ansim's Research Profile</h3>
            <ul>
              <li><strong>Name:</strong> Ansim</li>
              <li><strong>Title:</strong> Chief Researcher at Magentalab</li>
              <li><strong>Breed:</strong> Dachshund <i>(Legs are short, so I hold a magnifying glass to inspect closer.)</i></li>
              <li><strong>Research Fields:</strong>
                <ul>
                  <li>Pet behavioral psychology analysis & behavioral correction prescriptions.</li>
                  <li>Precision Dry Matter (DM) and Nitrogen-Free Extract (NFE) calculations up to 0.1%.</li>
                  <li>Decoding emotional communication between pet parents and pets.</li>
                </ul>
              </li>
              <li><strong>Motto:</strong> "Facts are non-negotiable. Veterinary nutrition that allows not even a 0.1% margin of error."</li>
            </ul>

            <hr />

            <h3>🌟 Ansim's Mission</h3>
            <p>
              We aim to build a companion life where pet parents can trust and feel relieved.
            </p>
            <ol>
              <li><strong>Evidence-Based:</strong> No rumors. We write articles strictly based on veterinary research papers and verified clinical data.</li>
              <li><strong>Pet Parent-Centric:</strong> Translating difficult medical terms to match pet parents' perspectives and daily needs.</li>
              <li><strong>QoL Improvement:</strong> Raising the Quality of Life (QoL) of both pets and parents by even 0.1%.</li>
            </ol>

            <hr />

            <h3>💬 A Word from Ansim</h3>
            <blockquote>
              <p>
                "Sometimes, love can get lost in confusion. Is this routing correct? Is this prescription safe? Ansim wants to relieve your anxiety with precise data."
              </p>
              <p>
                "I'll look lower and closer with my short legs, staying by your side as a reliable companion. Stay safe with Magentalab!"
              </p>
            </blockquote>
          </div>
          
          <RelatedPosts posts={relatedPosts} lang="en" />
          
          {/* CTA / Footer */}
          <div className="mt-20 pt-12 border-t border-gray-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Have questions for Researcher Ansim?
            </h3>
            <div className="flex justify-center">
              <a 
                href="mailto:smagentalab@gmail.com"
                className="px-10 py-4 bg-magenta hover:bg-magenta/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-magenta/20 transform hover:-translate-y-1"
              >
                Send Email to Lab
              </a>
            </div>
          </div>
        </div>
      </main>
    </article>
  );
}
