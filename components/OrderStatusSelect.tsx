"use client";

import { ORDER_STATUSES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Status is a free string in the database; keep an unrecognised stored value
  // selectable instead of silently showing the first option.
  const options: string[] = (ORDER_STATUSES as readonly string[]).includes(status)
    ? [...ORDER_STATUSES]
    : [status, ...ORDER_STATUSES];

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const previous = status;
    setStatus(next);
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.error === "string" && data.error
            ? data.error
            : "Could not update status"
        );
      }
      router.refresh();
    } catch (err) {
      setStatus(previous);
      setError(err instanceof Error ? err.message : "Could not update status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <select
        value={status}
        onChange={handleChange}
        disabled={saving}
        aria-label="Order status"
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {saving && <p className="text-xs text-gray-400 mt-2">Saving...</p>}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
