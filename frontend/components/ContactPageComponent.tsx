"use client";

import React, { useState } from "react";

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
    // send data to backend...
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="max-w-lg mx-auto py-20 text-center">
      <h2 className="text-3xl font-bold mb-4">Thank you!</h2>
      <p>We’ve received your {type?.toLowerCase()} inquiry. Expect a response within 24 hours.</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-semibold text-center">Contact Us</h1>
      <p className="text-center text-gray-600">
        Whether you're looking to advertise, report an issue, ask a question, or collaborate—select below or use the form.
      </p>

      {/* Type Selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {Object.values(InquiryType).map((it) => (
          <button
            key={it}
            onClick={() => setType(it)}
            className={`px-5 py-2 rounded-lg border transition ${
              type === it ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
            }`}
          >
            {it}
          </button>
        ))}
      </div>

      {/* Contact Options */}
      {type && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded shadow">
            <span className="text-2xl">💬</span>
            <div>
              <p className="font-medium">Chat with Us</p>
              <button className="text-blue-600 hover:underline">Start Chat</button>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded shadow">
            <span className="text-2xl">📧</span>
            <div>
              <p className="font-medium">Email Support</p>
              <a href={`mailto:support@3d-database.com?subject=${type}%20Inquiry`} className="text-blue-600 hover:underline">
                support@3d-database.com
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Form */}
      {type && (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded px-4 py-2 focus:ring focus:ring-blue-200"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded px-4 py-2 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <textarea
            name="message"
            rows={6}
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border rounded px-4 py-2 focus:ring focus:ring-blue-200"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            Send {type} Message
          </button>
        </form>
      )}

      {/* Extra Resources */}
      <div className="text-center text-gray-600 space-y-2">
        <p>Need help instantly?</p>
        <a href="/faq" className="text-blue-600 hover:underline">Visit our FAQ</a> • 
        <a href="/help-center" className="text-blue-600 hover:underline"> Help Center</a>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-8">
        <a
          href="/newsletter"
          className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition"
        >
          Subscribe for Updates
        </a>
      </div>
    </div>
  );
};

export default ContactPageComponent;
