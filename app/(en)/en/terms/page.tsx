import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Magentalab",
  description: "Terms of Service for Magentalab Companion Animal Research Center.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/terms",
    languages: {
      'ko-KR': 'https://www.magentalabblog.com/terms',
      'en-US': 'https://www.magentalabblog.com/en/terms',
      'ja-JP': 'https://www.magentalabblog.com/ja/terms',
    },
  },
};

export default function TermsPage() {
  return (
    <div className="pb-24">
      {/* Page Header */}
      <header className="relative pt-24 pb-20 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest">
            LEGAL
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Terms of<span className="text-magenta"> Service</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm">
          <div className="prose prose-magenta max-w-none text-gray-600 leading-relaxed font-sans">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">Article 1 (Purpose)</h2>
            <p className="mb-6">
              These Terms of Service aim to regulate the general conditions of use and operation of the services, information, and tools provided by "Magentalab Companion Animal Research Center" (hereinafter referred to as the "Center"), as well as the rights, obligations, and responsibilities between the users and the Center.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 2 (Nature of Service and Medical Disclaimer)</h2>
            <div className="mb-6">
              This website is an <b>informational blog</b> providing general information and reference calculation tools regarding the health, nutrition, and lifestyle of companion animals.
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>The information on this website is provided for general educational and reference purposes and does not replace veterinary diagnosis or treatment decisions for an individual animal. Users should seek veterinary care when an individual health decision is required.</li>
              </ul>
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 3 (Non-Membership Operation)</h2>
            <p className="mb-6">
              The Center does not provide standard membership registration (requiring name, address, password, etc.) or paid payment features. Anyone can freely view published content and use reference tools without charge.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 4 (Copyright of Content and Restrictions on Use)</h2>
            <p className="mb-6">
              1. The copyright and intellectual property rights for all content, designs, calculator logic, etc., created by the Center belong to the Center.
              <br />2. Users shall not use information obtained through the Center's services for commercial purposes by reproduction, transmission, publication, distribution, broadcasting, or other methods, nor allow third parties to use it without the Center's prior consent.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 5 (Suspension and Modification of Services)</h2>
            <p className="mb-6">
              The operator may temporarily suspend or change the provision of services in the event of unavoidable operational or technical reasons, such as regular system inspections, equipment replacement, or communication disruption.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 6 (Indemnification)</h2>
            <p className="mb-6">
              1. The operator is exempt from responsibility regarding service provision if services cannot be provided due to natural disasters or equivalent force majeure.
              <br />2. The operator is not responsible for any service use obstacles caused by the user's fault.
              <br />3. Information and calculation results are provided based on the sources available at the time of publication or update and may not reflect every individual animal or later changes in external data. Important medical decisions should not be made from online information alone and should be confirmed with a veterinarian.
            </p>

            <p className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400">
              These Terms will be implemented from April 22, 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
