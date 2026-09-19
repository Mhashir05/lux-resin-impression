import OrderStatusBadge from "@/components/OrderStatusBadge";
import { ORDER_STATUSES, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { formatOrderDate, formatPKR, shortOrderId } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { status: statusParam } = await searchParams;
  const activeStatus =
    typeof statusParam === "string" &&
    (ORDER_STATUSES as readonly string[]).includes(statusParam)
      ? statusParam
      : null;

  const allOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  const orders = activeStatus
    ? allOrders.filter((order) => order.status === activeStatus)
    : allOrders;

  const filters = [
    { label: "All", value: null, count: allOrders.length },
    ...ORDER_STATUSES.map((status) => ({
      label: status,
      value: status as string,
      count: allOrders.filter((order) => order.status === status).length,
    })),
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-[#1D1D1F]">Orders</h1>
        <span className="text-sm text-gray-500">
          {activeStatus ? `${orders.length} of ${allOrders.length}` : `${orders.length} total`}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => {
          const isActive = filter.value === activeStatus;
          return (
            <Link
              key={filter.label}
              href={
                filter.value
                  ? `/admin/orders?status=${encodeURIComponent(filter.value)}`
                  : "/admin/orders"
              }
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                isActive
                  ? "bg-[#1D1D1F] border-[#1D1D1F] text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#B8933E]"
              }`}
            >
              {filter.label} ({filter.count})
            </Link>
          );
        })}
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr className="border-t border-gray-100">
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  {activeStatus ? `No ${activeStatus} orders.` : "No orders yet."}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-[#1D1D1F] font-mono text-xs">
                    {shortOrderId(order.id)}
                  </td>
                  <td className="px-4 py-3 text-[#1D1D1F]">{order.customerName}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{order.phone}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatPKR(order.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {(PAYMENT_METHOD_LABELS as Record<string, string | undefined>)[
                      order.paymentMethod
                    ] ?? order.paymentMethod}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatOrderDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-[#B8933E] hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
