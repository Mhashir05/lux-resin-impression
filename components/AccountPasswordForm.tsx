"use client";

import { useState } from "react";

export default function AccountPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Could not change password");
      }
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gray-100 rounded-2xl p-6 space-y-4">
      <h2 className="text-sm text-[#1D1D1F] font-medium">Change Password</h2>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Current password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#B8933E]"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">New password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#B8933E]"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Confirm new password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#B8933E]"
        />
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-md">{error}</p>}
      {saved && !error && <p className="text-sm text-green-600">Password updated.</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-[#1D1D1F] text-white text-sm px-6 py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Change password"}
      </button>
    </form>
  );
}
