"use client";

import Link from "next/link";
import { useState } from "react";
import Footer from "../../components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(
        typeof data.message === "string"
          ? data.message
          : "If that email exists, we've sent a password reset link."
      );
    } catch (err) {
      console.error(err);
      setMessage("Could not send the reset link. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 pt-24 pb-24 max-w-sm mx-auto">
        <h1 className="text-2xl font-medium text-[#1D1D1F] mb-2 text-center">
          Reset your <span className="text-[#B8933E]">password</span>
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {message ? (
          <p className="text-sm text-[#1D1D1F] bg-[#FBF8F2] border border-[#B8933E]/30 rounded-xl px-4 py-3 text-center">
            {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1D1D1F] text-white text-sm py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-sm text-gray-500 text-center mt-6">
          <Link href="/login" className="text-[#B8933E] hover:underline">
            Back to log in
          </Link>
        </p>
      </section>
      <Footer />
    </main>
  );
}
