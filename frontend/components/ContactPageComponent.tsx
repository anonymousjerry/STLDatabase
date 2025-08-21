"use client";

import React, { useState } from "react";
import clsx from "clsx";

enum InquiryType {
  Advertise = "Advertise",
  Support = "Support",
  General = "General Inquiry",
  Press = "Press"
}

type FormData = { name: string; email: string; message: string };

const ContactPageComponent: React.FC = () => {
  const [type, setType] = useState<InquiryType | null>(null);
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
        <p>We’ve received your <strong>{type}</strong> message.</p>
        <p className="mt-2 text-gray-500">Expect our reply within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12 font-sans text-gray-800">
      
      {/* About Us */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
          About This Platform
        </h1>
        <p className="text-lg text-gray-600">
          A creative hub aggregating 3D models, empowering designers and enthusiasts alike.
        </p>
      </section>

      {/* How We Assist */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">How We Can Assist You</h2>
        <p className="text-gray-600">
          Select your inquiry type below to connect with the right team:
        </p>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li><strong>General Inquiries:</strong> Feedback or questions about our platform.</li>
          <li><strong>Technical Support:</strong> Issues with uploading/downloading or navigation.</li>
          <li><strong>Advertising & Partnerships:</strong> Promote your 3D models or brand.</li>
          <li><strong>Press & Media:</strong> Media inquiries, collaborations, press kits.</li>
        </ul>
      </section>

      {/* Inquiry Type Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {Object.values(InquiryType).map((it) => (
          <button
            key={it}
            onClick={() => setType(it)}
            className={clsx(
              "px-6 py-3 rounded-lg border text-lg font-medium transition-transform duration-200 ease-out",
              type === it
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:scale-105"
            )}
          >
            {it}
          </button>
        ))}
      </div>

      
      
      {/* Inquiry Form */}
      {type && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          
          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["name", "email"].map((field, idx) => (
              <div key={idx} className="relative">
                <input
                  name={field}
                  type={field === "email" ? "email" : "text"}
                  placeholder={field === "name" ? "Your Name" : "Your Email"}
                  value={form[field as keyof FormData]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value } as any)}
                  className="w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none px-1 py-2 transition-colors duration-300"
                  required
                />
              </div>
            ))}
          </div>

          <textarea
            name="message"
            rows={5}
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none px-1 py-2 transition-colors duration-300"
            required
          />

          {/* Submit Button with Ripple Effect */}
          <button
            type="submit"
            className="relative overflow-hidden w-full bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 rounded-lg font-semibold uppercase tracking-wide hover:from-green-500 hover:to-teal-600 transition"
          >
            Send {type} Message
            <span className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-500 ripple"></span>
          </button>
        </form>
      )}

      {/* Offices & Support Hours */}
      <section className="space-y-2 text-gray-600">
        <h3 className="text-2xl font-semibold">Offices & Support Hours</h3>
        <p><strong>Europe (EMEA):</strong> Vilnius, Lithuania</p>
        <p><strong>North America:</strong> Orlando, FL, USA</p>
        <p><strong>Email (Support):</strong> support@your3dsite.com</p>
        <p><strong>Partners & Vendors:</strong> info@your3dsite.com</p>
        <p className="italic">Support available Monday–Friday. Expect delays on weekends.</p>
      </section>

      <p className="text-center text-gray-600">
        Need help right away? <a href="/faq" className="text-blue-600 hover:underline">FAQ</a> • <a href="/help-center" className="text-blue-600 hover:underline">Help Center</a>
      </p>

      <div className="text-center">
        <a
          href="/newsletter"
          className="inline-block bg-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-pink-600 transition"
        >
          Subscribe for Updates
        </a>
      </div>
    </div>
  );
};

export default ContactPageComponent;
