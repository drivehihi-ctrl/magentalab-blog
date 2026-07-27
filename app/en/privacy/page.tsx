import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Magentalab",
  description: "Privacy Policy for Magentalab Companion Animal Research Center.",
  alternates: {
    canonical: "https://www.magentalabblog.com/en/privacy",
    languages: {
      'ko-KR': 'https://www.magentalabblog.com/privacy',
      'en-US': 'https://www.magentalabblog.com/en/privacy',
      'ja-JP': 'https://www.magentalabblog.com/ja/privacy',
    },
  },
};

export default function PrivacyPage() {
  return (
    <div className="pb-24">
      {/* Page Header */}
      <header className="relative pt-24 pb-20 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-magenta-light text-magenta text-xs font-bold uppercase tracking-widest">
            LEGAL
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Privacy<span className="text-magenta"> Policy</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm">
          <div className="prose prose-magenta max-w-none text-gray-600 leading-relaxed font-sans">
            <p className="mb-8">
              Magentalab Companion Animal Research Center (hereinafter referred to as the "Center") establishes and discloses the following privacy policy guidelines in order to protect the personal information of the data subjects and to handle related complaints quickly and smoothly in accordance with the Personal Information Protection Act.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">1. Purpose of Processing Personal Information</h2>
            <p className="mb-6">
              The Center processes personal information for the following purposes and does not use it for purposes other than these.
              <br />- Homepage member registration and management: Confirmation of intent to register, identification, maintenance of membership status, various announcements and notices, etc.
              <br />- Service Provision: Content provision, customized service provision, identity authentication, etc.
              <br />- Complaint Handling: Identification of complainants, contact for investigation, notification of processing results, etc.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">2. Processing and Retention Period of Personal Information</h2>
            <p className="mb-6">
              The Center processes and retains personal information within the personal information retention and use period according to laws and regulations or agreed upon when collecting personal information from the data subject.
              <br />- Homepage registration and management: Until withdrawal from the website
              <br />- Goods or Service Provision: Until completion of service supply and completion of payment/settlement
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">3. Collected Personal Information Items</h2>
            <p className="mb-6">
              The Center processes the following personal information items:
              <br />- Required items: Name, User ID, Password, Address, Phone number, Email address
              <br />- Automatically generated and collected items during internet service use: IP address, cookies, service usage logs, visit logs, etc.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">4. Google AdSense & Third-Party Cookie Policy</h2>
            <p className="mb-6">
              This website uses Google AdSense, a third-party advertising service provided by Google LLC.
              <br />- Google and third-party vendors use cookies to serve ads based on a user's prior visits to this website or other websites on the Internet.
              <br />- Users may opt out of personalized advertising by visiting Google Ads Settings (<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-magenta underline">www.google.com/settings/ads</a>).
              <br />- Alternatively, users can opt out of third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-magenta underline">www.aboutads.info</a>.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">5. Destruction Procedure and Method of Personal Information</h2>

            <p className="mb-6">
              The Center destroys the personal information without delay when the personal information becomes unnecessary, such as the expiration of the retention period or the achievement of the processing purpose.
              <br />- Destruction Method: Electronic files are destroyed using technical methods that cannot reproduce the records, and paper documents are shredded or incinerated.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">6. Rights of Users and Legal Representatives and How to Exercise Them</h2>
            <p className="mb-6">
              The data subject may exercise the right to request access to, correction of, deletion of, or suspension of processing of personal information at any time from the Center.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">7. Measures to Secure the Safety of Personal Information</h2>
            <p className="mb-6">
              The Center takes administrative measures (establishment of internal management plans), technical measures (access authority management, security program installation), and physical measures (access control) to ensure the safety of personal information.
            </p>

            <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">8. Privacy Officer</h2>

            <p className="mb-6">
              The Center designates a privacy officer to take overall responsibility for the processing of personal information, and to handle related complaints and remedy damages as follows.
              <br />- Email: smagentalab@gmail.com
            </p>

            <p className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400">
              This policy will be implemented from April 22, 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
