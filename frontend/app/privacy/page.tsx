"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Container from "@/components/Container";
import HeaderMain from "@/components/HeaderMain";
import Footer from "@/components/Footer";

const PrivacyPolicyPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <>
      <HeaderMain />
      <Container>
        <div className="min-h-screen bg-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-600">
                Effective Date: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-gray-700 leading-relaxed">
                  3DDatabase ("we," "our," or "us") respects your privacy and is committed to protecting your personal
                  information. This Privacy Policy explains how we collect, use, and safeguard your data when you use
                  our website 3DDatabase.com (the "Site").
                </p>
              </div>

              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-gray-700 mb-4">
                  We may collect the following types of information when you visit or interact with the Site:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Personal Information</strong> (if you create an account or contact us): name, email address, login details, and
                    any information you choose to provide.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> IP address, browser type, operating system, referral URLs, pages viewed, and time
                    spent on the Site.
                  </li>
                  <li>
                    <strong>Cookies & Tracking Technologies:</strong> We use cookies and similar tools to improve functionality,
                    personalize your experience, and analyze traffic.
                  </li>
                </ul>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 mb-4">
                  We may use your information to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Provide and improve our services and user experience.</li>
                  <li>Respond to inquiries and support requests.</li>
                  <li>Customize and personalize content.</li>
                  <li>Monitor Site performance and security.</li>
                  <li>Display relevant advertisements and affiliate links.</li>
                  <li>Comply with legal obligations.</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. Sharing of Information
                </h2>
                <p className="text-gray-700 mb-4">
                  We do not sell your personal information. However, we may share limited data with:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Service Providers:</strong> Hosting, analytics, advertising, and other third-party partners who help operate our
                    Site.
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> If required by law or to protect our rights, safety, and property.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets.
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Cookies and Tracking
                </h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and third-party tracking technologies (such as Google Analytics and advertising
                  networks) to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Understand how users interact with the Site.</li>
                  <li>Serve targeted advertisements and affiliate product recommendations.</li>
                  <li>Improve navigation and functionality.</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  You may disable cookies in your browser settings, but some features of the Site may not function
                  properly.
                </p>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Third-Party Links
                </h2>
                <p className="text-gray-700">
                  3DDatabase contains links to third-party websites (including affiliate links). We are not responsible for
                  the privacy practices or content of these external sites. We encourage you to review their policies.
                </p>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Data Security
                </h2>
                <p className="text-gray-700">
                  We take reasonable technical and organizational measures to protect your data from unauthorized
                  access, disclosure, or misuse. However, no system is 100% secure, and we cannot guarantee absolute
                  protection.
                </p>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Your Privacy Rights
                </h2>
                <p className="text-gray-700 mb-4">
                  Depending on your location, you may have rights such as:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Accessing, correcting, or deleting your personal data.</li>
                  <li>Opting out of marketing communications.</li>
                  <li>Withdrawing consent for data processing.</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  To exercise these rights, please contact us at:{" "}
                  <a href="mailto:privacy@3ddatabase.com" className="text-blue-600 hover:text-blue-800 underline">
                    privacy@3ddatabase.com
                  </a>
                </p>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Children's Privacy
                </h2>
                <p className="text-gray-700">
                  Our Site is not intended for children under 13, and we do not knowingly collect personal information
                  from them.
                </p>
              </section>

              {/* Section 9 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. Updates to This Policy
                </h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. The updated version will be posted on this page
                  with a revised effective date.
                </p>
              </section>

              {/* Section 10 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. Contact Us
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have questions or concerns about this Privacy Policy, you can reach us at:
                </p>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3DDatabase</h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Email:</strong>{" "}
                      <a href="mailto:privacy@3ddatabase.com" className="text-blue-600 hover:text-blue-800 underline">
                        privacy@3ddatabase.com
                      </a>
                    </p>
                    <p>
                      <strong>Website:</strong>{" "}
                      <a href="https://3ddatabase.com" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                        https://3ddatabase.com
                      </a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Last Updated */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
