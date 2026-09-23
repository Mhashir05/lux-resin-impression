"use client";

import { COURIER_SERVICES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CourierForm({
  orderId,
  initialCourierService,
  initialRiderName,
  initialRiderPhone,
  initialTrackingId,
  bookedAtLabel,
}: {
  orderId: string;
  initialCourierService: string;
  initialRiderName: string;
  initialRiderPhone: string;
  initialTrackingId: string;
  bookedAtLabel: string | null;
}) {
  const router = useRouter();
  const [courierService, setCourierService] = useState(initialCourierService);
  const [riderName, setRiderName] = useState(initialRiderName);
  const [riderPhone, setRiderPhone] = useState(initialRiderPhone);
  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Courier is free text in the database; keep an unrecognised stored value
  // selectable instead of silently showing the first option.
  const options: string[] = (COURIER_SERVICES as readonly string[]).includes(courierService)
    ? [...COURIER_SERVICES]
    : courierService
    ? [courierService, ...COURIER_SERVICES]
    : [...COURIER_SERVICES];

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courierService, riderName, riderPhone, trackingId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.error === "string" && data.error
            ? data.error
            : "Could not save courier details"
        );
      }
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save courier details");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {bookedAtLabel && (
        <p className="text-xs text-gray-400">Booked {bookedAtLabel}</p>
      )}

      <div>
        <label className="block text-sm text-gray-600 mb-1">Courier service</label>
        <select
          value={courierService}
          onChange={(e) => setCourierService(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">Not booked yet</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Rider name</label>
        <input
          value={riderName}
          onChange={(e) => setRiderName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Rider phone</label>
        <input
          value={riderPhone}
          onChange={(e) => setRiderPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Tracking ID</label>
        <input
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-md">{error}</p>
      )}
      {saved && !error && (
        <p className="text-xs text-green-600">Saved.</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="text-white px-4 py-2 rounded-full text-sm disabled:opacity-50 cursor-pointer"
        style={{ background: "linear-gradient(90deg, #B8933E, #E0B0A5)" }}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
