"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Container from "@/components/Container";
import HeaderMain from "@/components/HeaderMain";
import Footer from "@/components/Footer";
import { Shield, Eye, Lock, Users, Database, Globe, Bell, FileText, Mail, ExternalLink } from "lucide-react";

const PrivacyPolicyPage = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  // if (sessionStatus === "unauthenticated") {
  //   return null; // Will redirect
  // }

  return (
    <>
      <Container>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Enhanced Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Your privacy is our priority. Learn how we protect and handle your information.
              </p>
              <div className="mt-6 inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      About This Policy
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      3DDatabase respects your privacy and is committed to protecting your personal
                      information. This Privacy Policy explains how we collect, use, and safeguard your data when you use
                      our website 3DDatabase.com.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    1. Information We Collect
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                  We may collect the following types of information when you visit or interact with the Site:
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Name, email address, login details, and any information you choose to provide when creating an account or contacting us.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Usage Data</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      IP address, browser type, operating system, referral URLs, pages viewed, and time spent on the Site.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cookies & Tracking</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      We use cookies and similar tools to improve functionality, personalize your experience, and analyze traffic.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    2. How We Use Your Information
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                  We may use your information to:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Provide and improve our services and user experience",
                    "Respond to inquiries and support requests",
                    "Customize and personalize content",
                    "Monitor Site performance and security",
                    "Display relevant advertisements and affiliate links",
                    "Comply with legal obligations"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    3. Sharing of Information
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                  We do not sell your personal information. However, we may share limited data with:
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title: "Service Providers",
                      description: "Hosting, analytics, advertising, and other third-party partners who help operate our Site."
                    },
                    {
                      title: "Legal Compliance",
                      description: "If required by law or to protect our rights, safety, and property."
                    },
                    {
                      title: "Business Transfers",
                      description: "In the event of a merger, acquisition, or sale of assets."
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                      <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    4. Cookies and Tracking
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                  We use cookies and third-party tracking technologies (such as Google Analytics and advertising
                  networks) to:
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {[
                    "Understand how users interact with the Site",
                    "Serve targeted advertisements and affiliate product recommendations",
                    "Improve navigation and functionality"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Note:</strong> You may disable cookies in your browser settings, but some features of the Site may not function
                    properly.
                  </p>
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
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  3DDatabase contains links to third-party websites (including affiliate links). We are not responsible for
                  the privacy practices or content of these external sites. We encourage you to review their policies.
                </p>
              </div>

              {/* Section 6 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    6. Data Security
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  We take reasonable technical and organizational measures to protect your data from unauthorized
                  access, disclosure, or misuse. However, no system is 100% secure, and we cannot guarantee absolute
                  protection.
                </p>
              </div>

              {/* Section 7 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    7. Your Privacy Rights
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                  Depending on your location, you may have rights such as:
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {[
                    "Accessing, correcting, or deleting your personal data",
                    "Opting out of marketing communications",
                    "Withdrawing consent for data processing"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-700">
                  <p className="text-gray-700 dark:text-gray-300">
                    To exercise these rights, please contact us at:{" "}
                    <a href="mailto:privacy@3ddatabase.com" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium">
                      privacy@3ddatabase.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    8. Children&apos;s Privacy
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Our Site is not intended for children under 13, and we do not knowingly collect personal information
                  from them.
                </p>
              </div>

              {/* Section 9 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    9. Updates to This Policy
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  We may update this Privacy Policy from time to time. The updated version will be posted on this page
                  with a revised effective date.
                </p>
              </div>

              {/* Section 10 - Contact */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 shadow-xl text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold">
                    10. Contact Us
                  </h2>
                </div>
                <p className="text-blue-100 mb-6 text-lg">
                  If you have questions or concerns about this Privacy Policy, you can reach us at:
                </p>
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                  <h3 className="text-xl font-semibold mb-4">3DDatabase</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-200" />
                      <span className="text-blue-100">
                        <strong>Email:</strong>{" "}
                        <a href="mailto:privacy@3ddatabase.com" className="underline hover:text-white transition-colors">
                          privacy@3ddatabase.com
                        </a>
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="w-5 h-5 text-blue-200" />
                      <span className="text-blue-100">
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
                  <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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

export default PrivacyPolicyPage;
