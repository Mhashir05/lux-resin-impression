import CourierForm from "@/components/CourierForm";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import OrderStatusSelect from "@/components/OrderStatusSelect";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";
import {
  formatOrderDateTime,
  formatPKR,
  parseOrderLines,
  shortOrderId,
} from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    notFound();
  }

  const { lines, unreadable } = parseOrderLines(order.items);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link
        href="/admin/orders"
        className="text-sm text-gray-500 hover:text-[#B8933E] transition-colors"
      >
        &larr; All orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 mb-6">
        <div>
          <h1 className="text-2xl text-[#1D1D1F]">Order {shortOrderId(order.id)}</h1>
          <p className="text-xs text-gray-400 mt-1 break-all">{order.id}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-medium text-[#1D1D1F] mb-4">Customer</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-gray-400">Name</dt>
                <dd className="text-[#1D1D1F]">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Phone</dt>
                <dd className="text-[#1D1D1F]">{order.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Address</dt>
                <dd className="text-[#1D1D1F] whitespace-pre-line">{order.address}</dd>
              </div>
            </dl>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Unit price</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3 text-right">Line total</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-[#1D1D1F]">{line.name}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {formatPKR(line.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{line.quantity}</td>
                    <td className="px-4 py-3 text-gray-600 text-right whitespace-nowrap">
                      {formatPKR(line.lineTotal)}
                    </td>
                  </tr>
                ))}
                {unreadable > 0 && (
                  <tr className="border-t border-gray-100">
                    <td colSpan={4} className="px-4 py-3 text-xs text-[#9C6B4A]">
                      {unreadable === 1 ? "1 item" : `${unreadable} items`} on this order
                      could not be read. Check the order in the database.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td colSpan={3} className="px-4 py-3 text-[#1D1D1F] font-medium">
                    Total
                  </td>
                  <td className="px-4 py-3 text-[#1D1D1F] font-medium text-right whitespace-nowrap">
                    {formatPKR(order.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="space-y-6 h-fit">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-medium text-[#1D1D1F] mb-4">Status</h2>
            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-medium text-[#1D1D1F] mb-4">Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-gray-400">Payment method</dt>
                <dd className="text-[#1D1D1F]">
                  {(PAYMENT_METHOD_LABELS as Record<string, string | undefined>)[
                    order.paymentMethod
                  ] ?? order.paymentMethod}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Placed</dt>
                <dd className="text-[#1D1D1F]">{formatOrderDateTime(order.createdAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-medium text-[#1D1D1F] mb-4">Delivery / Courier</h2>
            <CourierForm
              orderId={order.id}
              initialCourierService={order.courierService ?? ""}
              initialRiderName={order.riderName ?? ""}
              initialRiderPhone={order.riderPhone ?? ""}
              initialTrackingId={order.trackingId ?? ""}
              bookedAtLabel={
                order.courierBookedAt ? formatOrderDateTime(order.courierBookedAt) : null
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
