"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Container from "@/components/Container";
import HeaderMain from "@/components/HeaderMain";
import Footer from "@/components/Footer";

const TermsOfServicePage = () => {
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
                Terms of Service
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
                  Welcome to 3DDatabase ("we," "our," or "us"). By accessing or using our website (the "Site"), you agree
                  to be bound by these Terms of Service. Please read them carefully.
                </p>
              </div>

              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Use of the Site
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>You must be at least 13 years old to use this Site.</li>
                  <li>You agree to use the Site only for lawful purposes and in compliance with all applicable laws and regulations.</li>
                  <li>You may not use the Site to distribute harmful code, spam, or engage in abusive behavior.</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Accounts
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>To access certain features, you may be required to create an account.</li>
                  <li>You are responsible for maintaining the confidentiality of your login information and for all activities under your account.</li>
                  <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. Content
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>All content provided on the Site is for informational purposes only.</li>
                  <li>We do not guarantee the accuracy, completeness, or reliability of any content.</li>
                  <li>User-submitted content must not infringe on intellectual property rights or violate laws. By submitting content, you grant us a non-exclusive, worldwide license to use and display it on the Site.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Intellectual Property
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>The Site and its original content, features, and functionality are owned by 3DDatabase and are protected by intellectual property laws.</li>
                  <li>You may not copy, distribute, or exploit content without prior written consent, except as permitted under fair use.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Third-Party Links
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Our Site may contain links to third-party websites. We are not responsible for their content, practices, or policies.</li>
                  <li>Use of third-party sites is at your own risk.</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Disclaimer of Warranties
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>The Site is provided "as is" without warranties of any kind, express or implied.</li>
                  <li>We do not warrant that the Site will be uninterrupted, secure, or error-free.</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Limitation of Liability
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>To the fullest extent permitted by law, 3DDatabase shall not be liable for any damages arising from your use of the Site.</li>
                  <li>This includes indirect, incidental, consequential, or punitive damages.</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Indemnification
                </h2>
                <p className="text-gray-700">
                  You agree to indemnify and hold harmless 3DDatabase, its affiliates, and employees from any claims,
                  damages, or expenses resulting from your use of the Site or violation of these Terms.
                </p>
              </section>

              {/* Section 9 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. Changes to These Terms
                </h2>
                <p className="text-gray-700">
                  We may update these Terms from time to time. The updated version will be posted on this page with a
                  revised effective date. Continued use of the Site constitutes acceptance of any changes.
                </p>
              </section>

              {/* Section 10 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. Governing Law
                </h2>
                <p className="text-gray-700">
                  These Terms are governed by and construed in accordance with the laws of the United States.
                </p>
              </section>

              {/* Section 11 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  11. Contact Us
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3DDatabase</h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Email:</strong>{" "}
                      <a href="mailto:legal@3ddatabase.com" className="text-blue-600 hover:text-blue-800 underline">
                        legal@3ddatabase.com
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

export default TermsOfServicePage;
