import type { OrderStatus } from "@/lib/constants";

// Brand palette only: gold, rose, ink and neutral grey.
const STATUS_STYLES: Record<OrderStatus, string> = {
  New: "bg-[#B8933E]/10 text-[#B8933E]",
  Confirmed: "bg-[#E0B0A5]/30 text-[#9C6B4A]",
  Shipped: "bg-[#1D1D1F]/10 text-[#1D1D1F]",
  Delivered: "bg-[#B8933E] text-white",
  Cancelled: "bg-gray-100 text-gray-500",
};

// Status is a free string in the database, so an unknown value gets the
// neutral style instead of breaking the page.
export default function OrderStatusBadge({ status }: { status: string }) {
  const style =
    (STATUS_STYLES as Record<string, string | undefined>)[status] ??
    "bg-gray-100 text-gray-500";

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap ${style}`}
    >
      {status}
    </span>
  );
}
