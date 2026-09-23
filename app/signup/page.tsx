"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "../../components/Footer";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, address }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong.");
        setLoading(false);
        return;
      }

      const signInRes = await signIn("customer", { email, password, redirect: false });
      if (signInRes?.error) {
        // Account was created; only the automatic sign-in failed — send them
        // to log in manually rather than losing the account they just made.
        router.push("/login");
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Could not create your account. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 pt-24 pb-24 max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-[#1D1D1F] mb-2 text-center">
          Create an <span className="text-[#B8933E]">account</span>
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Already have an account?{" "}
          <Link href="/login" className="text-[#B8933E] hover:underline">
            Log in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-md">{error}</p>
          )}

          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
          />
          <input
            type="tel"
            placeholder="WhatsApp number — +92 3XX XXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
          />
          <textarea
            rows={3}
            placeholder="Delivery address — house, street, area, city"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E] resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D1D1F] text-white text-sm py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </section>
      <Footer />
    </main>
  );
}
