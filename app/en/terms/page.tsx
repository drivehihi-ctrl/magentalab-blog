import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Magentalab",
  description: "Terms of Service for Magentalab Companion Animal Research Center.",
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
              These Terms of Service aim to regulate the general conditions of use and operation of the services provided by "Magentalab Companion Animal Research Center" (hereinafter referred to as the "Center").
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 2 (Definition of Terms)</h2>
            <div className="mb-6">
              Definitions of major terms used in these Terms are as follows:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Member: An individual who has agreed to these Terms, provided personal information to complete registration, and established a contract of use with the Center to utilize the services.</li>
                <li>Contract of Use: The agreement established between the Center and a member regarding the use of the services.</li>
                <li>Member ID (hereinafter "ID"): A unique combination of letters and numbers assigned to each member for member identification and service usage.</li>
                <li>Password: A combination of letters and numbers chosen by the member to verify identity and protect membership rights.</li>
                <li>Operator: The administrator responsible for opening and running the service website.</li>
                <li>Cancellation: The act of a member terminating the contract of use.</li>
              </ul>
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 3 (Rules Outside These Terms)</h2>
            <p className="mb-6">
              The operator may notify operational policies separately if necessary, and if these Terms overlap with the operational policies, the operational policies shall take precedence.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 4 (Establishment of Contract of Use)</h2>
            <p className="mb-6">
              1. The contract of use is established upon the operator's approval of the registration application and agreement to the terms by a person wishing to use the Center.
              <br />2. A person wishing to register as a member expresses consent to these Terms by reading them and selecting "I agree" during the site registration process.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 5 (Application for Service Use)</h2>
            <p className="mb-6">
              1. A user wishing to register and use the Center must provide general information requested by the Center (User ID, password, nickname, etc.).
              <br />2. Members who steal someone else's information or register false information without registering their true details cannot claim any rights regarding the use of the Center and may be punished according to relevant laws.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 6 (Obligations of the Operator)</h2>
            <p className="mb-6">
              1. The operator shall process opinions or complaints raised by users as quickly as possible if they are recognized as justifiable.
              <br />2. The operator shall make every effort to repair or restore equipment immediately in the event of failure or loss for continuous and stable service provision.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 7 (Obligations of Members)</h2>
            <p className="mb-6">
              1. Members must comply with the provisions defined in these Terms, regulations set by the operator, announcements, and operational policies, and must not engage in acts that interfere with the Center's business or damage the Center's reputation.
              <br />2. Members may not transfer or donate their service usage rights or other contract of use status to others without the explicit consent of the Center.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 8 (Service Hours)</h2>
            <p className="mb-6">
              As a rule, service hours are 24 hours a day, 365 days a year, unless there is a special operational or technical obstacle. However, services may be temporarily suspended on days or hours designated by the Center for system regular inspection, etc.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 9 (Copyright of Posts)</h2>
            <p className="mb-6">
              1. The copyright of posts published by members in the service belongs to the author member.
              <br />2. Users shall not use information obtained through the Center's services for commercial purposes or make third parties use it by reproduction, transmission, publication, distribution, broadcasting, or other methods without the prior consent of the Center.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">Article 10 (Indemnification)</h2>
            <p className="mb-6">
              The operator is not responsible for any inability to provide services due to natural disasters or equivalent force majeure, nor for service use obstacles caused by the member's fault.
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
