"use client";

import { useState } from "react";
import Footer from "../../components/Footer";

const WHATSAPP_NUMBER = "923000000000";

// Skip-the-form chat starter — deliberately generic, not built from the
// fields below (that's what "Send request" is for).
const GENERIC_WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi! I'd like a custom quote for a resin piece. Here's what I have in mind: "
)}`;

export default function CustomOrderPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const handleSendRequest = () => {
    if (!name.trim() || !description.trim()) {
      alert("Please tell us your name and what you'd like made.");
      return;
    }

    // No file-upload backend for the reference image, and a wa.me link can't
    // pre-attach a file anyway — the photo gets sent once the chat opens.
    const message = [
      "Hi! I'd like a custom quote for a resin piece.",
      "",
      `Name: ${name.trim()}`,
      phone.trim() ? `Contact number: ${phone.trim()}` : null,
      `What I have in mind: ${description.trim()}`,
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-white">

      <section className="px-6 pt-20 pb-24 max-w-2xl mx-auto">
        {/* Heading */}
        <p className="text-xs tracking-[0.25em] text-[#B8933E] mb-3">COMMISSIONS</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] leading-tight">
          Tell us what to pour for <span className="text-[#B8933E]">you</span>.
        </h1>
        <p className="mt-4 text-gray-500 leading-relaxed">
          Wedding keepsakes, name pieces, bouquet preservation, wall art sized to your
          room. Send us the idea and we&apos;ll reply with a quote and timeline within 24 hours.
        </p>

        {/* Form */}
        <div className="mt-10 space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm text-[#1D1D1F] block mb-2">Your name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="text-sm text-[#1D1D1F] block mb-2">WhatsApp number</label>
            <input
              type="tel"
              placeholder="+92 3XX XXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-[#1D1D1F] block mb-2">What would you like made?</label>
            <textarea
              rows={4}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E] resize-none"
            />
          </div>

          {/* Reference image */}
          <div>
            <label className="text-sm text-[#1D1D1F] block mb-2">
              Reference image <span className="text-gray-400">(optional)</span>
            </label>
            <div className="border border-dashed border-gray-300 rounded-xl px-4 py-8 text-center cursor-pointer hover:border-[#B8933E] transition-colors">
              <p className="text-sm text-gray-400">Drop an image here</p>
              <p className="text-xs text-gray-400 mt-1">or browse — JPG or PNG, up to 10 MB</p>
            </div>
          </div>

          {/* Price note */}
          <p className="text-xs text-gray-400 border-t border-gray-100 pt-4">
            Standard pieces have a fixed price. For custom work and personalisations,
            the final price may vary — we&apos;ll always confirm the full quote with you before starting.
          </p>

          {/* Submit */}
          <div className="pt-4 space-y-3">
            <button
              onClick={() => window.open(GENERIC_WHATSAPP_LINK, "_blank")}
              className="w-full text-sm text-gray-500 border border-gray-200 py-3 rounded-full cursor-pointer transition-all duration-300 hover:border-[#B8933E] hover:text-[#B8933E]"
            >
              Prefer to chat? Get a quote on WhatsApp
            </button>
            <button
              onClick={handleSendRequest}
              className="w-full bg-[#1D1D1F] text-white text-sm py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E]"
            >
              Send request
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}