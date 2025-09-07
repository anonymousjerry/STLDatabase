"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Container from "@/components/Container";
import HeaderMain from "@/components/HeaderMain";
import Footer from "@/components/Footer";
import { FileText, Shield, Users, Lock, Globe, ExternalLink, AlertTriangle, Scale, Mail, CheckCircle, Clock } from "lucide-react";

const TermsOfServicePage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   // If user is not authenticated, redirect to login
  //   if (sessionStatus === "unauthenticated") {
  //     router.replace("/login");
  //   }
  // }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-400"></div>
      </div>
    );
  }

  // if (sessionStatus === "unauthenticated") {
  //   return null; // Will redirect
  // }

  return (
    <>
      <Container>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Enhanced Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6 shadow-lg">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-blue-700 dark:from-white dark:via-green-200 dark:to-blue-200 bg-clip-text text-transparent mb-4">
                Terms of Service
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Please read these terms carefully before using our services.
              </p>
              <div className="mt-6 inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
                <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Effective Date: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-12">
              {/* Introduction Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      Welcome to 3DDatabase
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      Welcome to 3DDatabase. By accessing or using our website, you agree
                      to be bound by these Terms of Service. Please read them carefully.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    1. Use of the Site
                  </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <Users className="w-5 h-5 text-white" />,
                      title: "Age Requirement",
                      description: "You must be at least 13 years old to use this Site."
                    },
                    {
                      icon: <Shield className="w-5 h-5 text-white" />,
                      title: "Lawful Use",
                      description: "You agree to use the Site only for lawful purposes and in compliance with all applicable laws and regulations."
                    },
                    {
                      icon: <AlertTriangle className="w-5 h-5 text-white" />,
                      title: "Prohibited Activities",
                      description: "You may not use the Site to distribute harmful code, spam, or engage in abusive behavior."
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    2. Accounts
                  </h2>
                </div>
                <div className="space-y-4">
                  {[
                    "To access certain features, you may be required to create an account.",
                    "You are responsible for maintaining the confidentiality of your login information and for all activities under your account.",
                    "We reserve the right to suspend or terminate accounts that violate these Terms."
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    3. Content
                  </h2>
                </div>
                <div className="space-y-4">
                  {[
                    "All content provided on the Site is for informational purposes only.",
                    "We do not guarantee the accuracy, completeness, or reliability of any content.",
                    "User-submitted content must not infringe on intellectual property rights or violate laws. By submitting content, you grant us a non-exclusive, worldwide license to use and display it on the Site."
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    4. Intellectual Property
                  </h2>
                </div>
                <div className="space-y-4">
                  {[
                    "The Site and its original content, features, and functionality are owned by 3DDatabase and are protected by intellectual property laws.",
                    "You may not copy, distribute, or exploit content without prior written consent, except as permitted under fair use."
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    5. Third-Party Links
                  </h2>
                </div>
                <div className="space-y-4">
                  {[
                    "Our Site may contain links to third-party websites. We are not responsible for their content, practices, or policies.",
                    "Use of third-party sites is at your own risk."
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 6 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    6. Disclaimer of Warranties
                  </h2>
                </div>
                <div className="space-y-4">
                  {[
                    "The Site is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied.",
                    "We do not warrant that the Site will be uninterrupted, secure, or error-free."
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 7 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    7. Limitation of Liability
                  </h2>
                </div>
                <div className="space-y-4">
                  {[
                    "To the fullest extent permitted by law, 3DDatabase shall not be liable for any damages arising from your use of the Site.",
                    "This includes indirect, incidental, consequential, or punitive damages."
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 8 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    8. Indemnification
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  You agree to indemnify and hold harmless 3DDatabase, its affiliates, and employees from any claims,
                  damages, or expenses resulting from your use of the Site or violation of these Terms.
                </p>
              </div>

              {/* Section 9 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    9. Changes to These Terms
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  We may update these Terms from time to time. The updated version will be posted on this page with a
                  revised effective date. Continued use of the Site constitutes acceptance of any changes.
                </p>
              </div>

              {/* Section 10 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    10. Governing Law
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  These Terms are governed by and construed in accordance with the laws of the United States.
                </p>
              </div>

              {/* Section 11 - Contact */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 shadow-xl text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold">
                    11. Contact Us
                  </h2>
                </div>
                <p className="text-green-100 mb-6 text-lg">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                  <h3 className="text-xl font-semibold mb-4">3DDatabase</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-green-200" />
                      <span className="text-green-100">
                        <strong>Email:</strong>{" "}
                        <a href="mailto:legal@3ddatabase.com" className="underline hover:text-white transition-colors">
                          legal@3ddatabase.com
                        </a>
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="w-5 h-5 text-green-200" />
                      <span className="text-green-100">
                        <strong>Website:</strong>{" "}
                        <a href="https://3ddatabase.com" className="underline hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                          https://3ddatabase.com
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Last updated: {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default TermsOfServicePage;
