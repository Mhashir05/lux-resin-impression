"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Only follow a same-site relative path — an absolute/external redirect
// target from the URL could be used to send a logged-in user off-site.
function safeRedirectTarget(redirectTo: string | null): string {
  if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
    return redirectTo;
  }
  return "/";
}

export default function CustomerLoginForm({ redirectTo }: { redirectTo: string | null }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const res = await signIn("customer", { email, password, redirect: false });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push(safeRedirectTarget(redirectTo));
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-[#1D1D1F]">
            Lux <span className="text-[#B8933E]">Resin</span> Impression
          </h1>
          <p className="text-sm text-gray-500 mt-2">Log in to your account</p>
        </div>

        <div className="border border-gray-100 rounded-2xl p-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#1D1D1F] text-white text-sm py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-xs text-gray-400 text-center">
            <Link href="/forgot-password" className="text-[#B8933E] hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#B8933E] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
