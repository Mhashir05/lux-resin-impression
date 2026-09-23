// Brand-neutral pair: green for gateway-confirmed, grey for anything Ammi
// still needs to reconcile by hand.
const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-gray-100 text-gray-500",
};

export default function PaymentStatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500";
  const label = status === "paid" ? "Paid" : "Unpaid";

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap ${style}`}
    >
      {label}
    </span>
  );
}
