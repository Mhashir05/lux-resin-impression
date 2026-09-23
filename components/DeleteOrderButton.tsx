"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteOrderButton({
  orderId,
  orderNumber,
  status,
}: {
  orderId: string;
  orderNumber: string;
  status: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Only a New order can be deleted — omit the control entirely for anything
  // else rather than showing a disabled button.
  if (status !== "New") return null;

  const canDelete = confirmText === orderNumber;

  async function handleDelete() {
    if (!canDelete) return;
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Could not delete order");
      }
      router.push("/admin/orders");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete order");
      setDeleting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 text-sm text-red-600 border border-red-200 px-4 py-2 rounded-md cursor-pointer hover:bg-red-50"
      >
        <Trash2 size={15} />
        Delete order
      </button>
    );
  }

  return (
    <div className="border border-red-200 rounded-md p-4 space-y-3 bg-red-50">
      <p className="text-sm text-red-700 flex items-start gap-2">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        This permanently deletes order {orderNumber}. Type the order number to confirm.
      </p>
      <input
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder={orderNumber}
        aria-label="Type the order number to confirm deletion"
        className="w-full border border-red-300 rounded-md px-3 py-2 text-sm bg-white"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={!canDelete || deleting}
          className="flex-1 text-sm text-white bg-red-600 px-4 py-2 rounded-md cursor-pointer transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? "Deleting..." : "Delete permanently"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setConfirmText("");
            setError("");
          }}
          disabled={deleting}
          className="text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-md cursor-pointer hover:bg-white disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
