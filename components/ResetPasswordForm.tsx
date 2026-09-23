"use client";

import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordForm({ token }: { token: string | null }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Could not reset your password. Please check your connection.");
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-medium text-[#1D1D1F] mb-2">Invalid link</h1>
          <p className="text-sm text-gray-500 mb-6">
            This password reset link is missing its token.
          </p>
          <Link href="/forgot-password" className="text-[#B8933E] hover:underline text-sm">
            Request a new link
          </Link>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-medium text-[#1D1D1F] mb-2">Password updated</h1>
          <p className="text-sm text-gray-500 mb-6">
            Your password has been reset. You can now log in.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#1D1D1F] text-white text-sm px-6 py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E]"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-[#1D1D1F]">Choose a new password</h1>
        </div>

        <form onSubmit={handleSubmit} className="border border-gray-100 rounded-2xl p-6 space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D1D1F] text-white text-sm py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save new password"}
          </button>
        </form>
      </div>
    </main>
  );
}
