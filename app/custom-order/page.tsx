"use client";

import Footer from "../../components/Footer";

export default function CustomOrderPage() {
  const whatsappLink =
    "https://wa.me/923000000000?text=Hi!%20I'd%20like%20a%20custom%20quote%20for%20a%20resin%20piece.%20Here's%20what%20I%20have%20in%20mind:%20";

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
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="text-sm text-[#1D1D1F] block mb-2">WhatsApp number</label>
            <input
              type="tel"
              placeholder="+92 3XX XXXXXXX"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-[#1D1D1F] block mb-2">What would you like made?</label>
            <textarea
              rows={4}
              placeholder="Description"
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
              onClick={() => window.open(whatsappLink, "_blank")}
              className="w-full text-sm text-gray-500 border border-gray-200 py-3 rounded-full cursor-pointer transition-all duration-300 hover:border-[#B8933E] hover:text-[#B8933E]"
            >
              Prefer to chat? Get a quote on WhatsApp
            </button>
            <button className="w-full bg-[#1D1D1F] text-white text-sm py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E]">
              Send request
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}