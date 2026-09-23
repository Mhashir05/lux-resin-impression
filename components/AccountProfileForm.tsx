"use client";

import { useState } from "react";

export default function AccountProfileForm({
  email,
  initialName,
  initialPhone,
  initialAddress,
}: {
  email: string;
  initialName: string;
  initialPhone: string;
  initialAddress: string;
}) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/customers/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Could not save changes");
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="border border-gray-100 rounded-2xl p-6 space-y-4">
      <h2 className="text-sm text-[#1D1D1F] font-medium">Profile</h2>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Email</label>
        <p className="text-sm text-gray-500">{email}</p>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Full name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#B8933E]"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#B8933E]"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Address</label>
        <textarea
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#B8933E] resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-md">{error}</p>}
      {saved && !error && <p className="text-sm text-green-600">Saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-[#1D1D1F] text-white text-sm px-6 py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
