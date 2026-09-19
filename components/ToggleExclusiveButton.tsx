"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ToggleExclusiveButton({
  productId,
  productName,
  isExclusive,
}: {
  productId: string;
  productName: string;
  isExclusive: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isExclusive: !isExclusive }),
      });
      if (!res.ok) throw new Error("Update failed");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update product. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isExclusive}
      aria-label={`Exclusive: ${productName}`}
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 cursor-pointer ${
        isExclusive ? "bg-[#B8933E]" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          isExclusive ? "translate-x-4.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
