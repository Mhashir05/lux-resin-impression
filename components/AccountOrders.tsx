"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPKR, type OrderLine } from "../lib/orders";
import OrderStatusBadge from "./OrderStatusBadge";

export type AccountOrder = {
  id: string;
  orderNumber: string;
  dateLabel: string;
  totalLabel: string;
  status: string;
  lines: OrderLine[];
  unreadableLineCount: number;
  courier: {
    service: string | null;
    riderName: string | null;
    riderPhone: string | null;
    trackingId: string | null;
  } | null;
  history: { status: string; dateLabel: string }[];
};

export default function AccountOrders({ orders }: { orders: AccountOrder[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="border border-gray-100 rounded-2xl p-10 text-center">
        <p className="text-gray-500 mb-6">You haven&apos;t placed any orders yet.</p>
        <Link
          href="/products"
          className="inline-block bg-[#1D1D1F] text-white text-sm px-6 py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E]"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden">
      {orders.map((order) => {
        const expanded = expandedId === order.id;
        return (
          <div key={order.id}>
            <button
              type="button"
              onClick={() => setExpandedId(expanded ? null : order.id)}
              aria-expanded={expanded}
              className="w-full flex flex-wrap items-center justify-between gap-3 p-4 text-left cursor-pointer hover:bg-[#FBF8F2] transition-colors"
            >
              <div>
                <p className="text-sm text-[#1D1D1F] font-medium">{order.orderNumber}</p>
                <p className="text-xs text-gray-400">{order.dateLabel}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#1D1D1F]">{order.totalLabel}</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </button>

            {expanded && (
              <div className="px-4 pb-6 space-y-6">
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
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
                      {order.lines.map((line, i) => (
                        <tr key={i} className="border-t border-gray-100">
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
                      {order.unreadableLineCount > 0 && (
                        <tr className="border-t border-gray-100">
                          <td colSpan={4} className="px-4 py-3 text-xs text-[#9C6B4A]">
                            {order.unreadableLineCount === 1
                              ? "1 item"
                              : `${order.unreadableLineCount} items`}{" "}
                            on this order couldn&apos;t be read.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-3">Order status</p>
                  <ol className="space-y-4 border-l border-gray-200 pl-4">
                    {order.history.map((step, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#B8933E]" />
                        <p className="text-sm text-[#1D1D1F]">{step.status}</p>
                        <p className="text-xs text-gray-400">{step.dateLabel}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {order.courier && (
                  <div className="border border-[#B8933E]/30 rounded-xl p-4 bg-[#FBF8F2]">
                    <p className="text-sm text-[#1D1D1F] font-medium mb-2">Courier</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      {order.courier.service && (
                        <p>
                          Service: <span className="text-[#1D1D1F]">{order.courier.service}</span>
                        </p>
                      )}
                      {order.courier.riderName && (
                        <p>
                          Rider: <span className="text-[#1D1D1F]">{order.courier.riderName}</span>
                        </p>
                      )}
                      {order.courier.riderPhone && (
                        <p>
                          Phone:{" "}
                          <a
                            href={`tel:${order.courier.riderPhone}`}
                            className="text-[#B8933E] hover:underline"
                          >
                            {order.courier.riderPhone}
                          </a>
                        </p>
                      )}
                      {order.courier.trackingId && (
                        <p>
                          Tracking ID:{" "}
                          <span className="text-[#1D1D1F]">{order.courier.trackingId}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
