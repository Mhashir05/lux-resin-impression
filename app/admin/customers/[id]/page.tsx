import OrderStatusBadge from "@/components/OrderStatusBadge";
import { formatOrderDate, formatPKR } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { orders: { orderBy: { createdAt: "desc" } } },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link
        href="/admin/customers"
        className="text-sm text-gray-500 hover:text-[#B8933E] transition-colors"
      >
        &larr; All customers
      </Link>

      <h1 className="text-2xl text-[#1D1D1F] mt-4 mb-6">{customer.name}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-sm font-medium text-[#1D1D1F] mb-4">
              Orders ({customer.orders.length})
            </h2>
            <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.length === 0 ? (
                    <tr className="border-t border-gray-100">
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    customer.orders.map((order) => (
                      <tr key={order.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-[#1D1D1F] font-mono text-xs">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {formatOrderDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-right whitespace-nowrap">
                          {formatPKR(order.totalAmount)}
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
        </div>

        <div className="space-y-6 h-fit">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-medium text-[#1D1D1F] mb-4">Profile</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-gray-400">Email</dt>
                <dd className="text-[#1D1D1F]">{customer.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Phone</dt>
                <dd className="text-[#1D1D1F]">{customer.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Address</dt>
                <dd className="text-[#1D1D1F] whitespace-pre-line">{customer.address}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Signed up</dt>
                <dd className="text-[#1D1D1F]">{formatOrderDate(customer.createdAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
