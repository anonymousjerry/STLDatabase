"use client";

import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane, FaUser, FaComment, FaBuilding, FaGlobe } from "react-icons/fa";
import toast from "react-hot-toast";
import { isValidEmailAddressFormat } from "@/lib/utils";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  website?: string;
  adType?: string;
  budget?: string;
}

const ContactPageComponent = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "",
    website: "",
    adType: "",
    budget: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdFields, setShowAdFields] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Show ad fields if subject is related to advertising
    if (name === 'subject') {
      setShowAdFields(value.includes('Advertisement') || value.includes('Ad'));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!isValidEmailAddressFormat(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.subject.trim()) {
      toast.error("Please select a subject");
      return false;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return false;
    }
    if (formData.message.length < 10) {
      toast.error("Message must be at least 10 characters long");
      return false;
    }

    // Additional validation for ad inquiries
    if (showAdFields) {
      if (!formData.company?.trim()) {
        toast.error("Please enter your company name");
        return false;
      }
      if (!formData.adType?.trim()) {
        toast.error("Please select an advertisement type");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual contact form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const successMessage = showAdFields 
        ? "Thank you for your advertisement inquiry! Our team will review your request and get back to you within 24 hours."
        : "Thank you for your message! We'll get back to you soon.";
      
      toast.success(successMessage);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        company: "",
        website: "",
        adType: "",
        budget: "",
      });
      setShowAdFields(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email Us",
      details: "support@3dmodelpro.com",
      description: "Send us an email anytime"
    },
    {
      icon: FaPhone,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 6pm"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      details: "123 3D Street, Tech City",
      description: "Innovation District, TC 12345"
    },
    {
      icon: FaClock,
      title: "Business Hours",
      details: "Monday - Friday",
      description: "8:00 AM - 6:00 PM EST"
    }
  ];

  const subjectOptions = [
    { value: "", label: "Select a subject" },
    { value: "General Inquiry", label: "General Inquiry" },
    { value: "Technical Support", label: "Technical Support" },
    { value: "Advertisement Inquiry", label: "Advertisement Inquiry" },
    { value: "Partnership Opportunity", label: "Partnership Opportunity" },
    { value: "Feature Request", label: "Feature Request" },
    { value: "Bug Report", label: "Bug Report" },
    { value: "Other", label: "Other" }
  ];

  const adTypeOptions = [
    { value: "", label: "Select advertisement type" },
    { value: "Banner Advertisement", label: "Banner Advertisement" },
    { value: "Sponsored Model Listing", label: "Sponsored Model Listing" },
    { value: "Newsletter Advertisement", label: "Newsletter Advertisement" },
    { value: "Featured Category Placement", label: "Featured Category Placement" },
    { value: "Custom Campaign", label: "Custom Campaign" }
  ];

  const budgetOptions = [
    { value: "", label: "Select budget range" },
    { value: "$100 - $500", label: "$100 - $500" },
    { value: "$500 - $1,000", label: "$500 - $1,000" },
    { value: "$1,000 - $2,500", label: "$1,000 - $2,500" },
    { value: "$2,500 - $5,000", label: "$2,500 - $5,000" },
    { value: "$5,000+", label: "$5,000+" },
    { value: "Custom", label: "Custom Budget" }
  ];

  return (
    <div className="min-h-screen bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor">
      {/* Hero Section */}
      <div className="bg-custom-light-maincolor text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Have questions about our 3D models? Need support? Want to advertise? We're here to help you find the perfect 3D printing models and grow your business.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-custom-light-titlecolor dark:text-custom-dark-titlecolor mb-6">
                Let's Connect
              </h2>
              <p className="text-lg text-custom-light-textcolor dark:text-custom-dark-textcolor mb-8">
                We're passionate about 3D printing and always excited to hear from our community. 
                Whether you have a question, suggestion, want to advertise, or just want to say hello, we'd love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-white dark:bg-custom-dark-containercolor rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-custom-light-maincolor rounded-lg flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-custom-light-titlecolor dark:text-custom-dark-titlecolor">
                      {info.title}
                    </h3>
                    <p className="text-custom-light-maincolor font-medium">
                      {info.details}
                    </p>
                    <p className="text-sm text-custom-light-textcolor dark:text-custom-dark-textcolor">
                      {info.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Advertisement Info */}
            <div className="bg-gradient-to-r from-custom-light-maincolor to-purple-600 rounded-lg p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Advertise with 3D Model Pro</h3>
              <p className="text-gray-200 mb-4">
                Reach thousands of 3D printing enthusiasts and professionals. Our platform offers various advertising opportunities:
              </p>
              <ul className="space-y-2 text-gray-200">
                <li>• Banner advertisements on high-traffic pages</li>
                <li>• Sponsored model listings</li>
                <li>• Newsletter advertising</li>
                <li>• Featured category placements</li>
                <li>• Custom campaign solutions</li>
              </ul>
            </div>

            {/* Additional Info */}
            <div className="bg-white dark:bg-custom-dark-containercolor rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-custom-light-titlecolor dark:text-custom-dark-titlecolor mb-4">Why Choose 3D Model Pro?</h3>
              <ul className="space-y-2 text-custom-light-textcolor dark:text-custom-dark-textcolor">
                <li>• Curated collection of high-quality 3D models</li>
                <li>• Expert support and guidance</li>
                <li>• Fast response times</li>
                <li>• Community-driven platform</li>
                <li>• Growing user base of 3D printing enthusiasts</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-custom-dark-containercolor rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-custom-light-titlecolor dark:text-custom-dark-titlecolor mb-6">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-custom-light-textcolor dark:text-custom-dark-textcolor mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-custom-light-textcolor dark:text-custom-dark-textcolor mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-custom-light-textcolor dark:text-custom-dark-textcolor mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  {subjectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Advertisement-specific fields */}
              {showAdFields && (
                <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-custom-light-maincolor">
                  <h3 className="text-lg font-semibold text-custom-light-titlecolor dark:text-custom-dark-titlecolor">
                    Advertisement Details
                  </h3>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-custom-light-textcolor dark:text-custom-dark-textcolor mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaBuilding className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-custom-light-textcolor dark:text-custom-dark-textcolor mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaGlobe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="https://your-website.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="adType" className="block text-sm font-medium text-custom-light-textcolor dark:text-custom-dark-textcolor mb-2">
                      Advertisement Type *
                    </label>
                    <select
                      id="adType"
                      name="adType"
                      value={formData.adType}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {adTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-custom-light-textcolor dark:text-custom-dark-textcolor mb-2">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {budgetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-custom-light-textcolor dark:text-custom-dark-textcolor mb-2">
                  Message *
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <FaComment className="h-5 w-5 text-gray-400 mt-1" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                    placeholder={showAdFields ? "Tell us about your advertising goals, target audience, and campaign details..." : "Tell us more about your inquiry..."}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-custom-light-maincolor hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-custom-light-textcolor dark:text-custom-dark-textcolor">
                {showAdFields 
                  ? "We'll review your advertisement inquiry and get back to you within 24 hours with a customized proposal."
                  : "We typically respond within 24 hours during business days."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPageComponent;
