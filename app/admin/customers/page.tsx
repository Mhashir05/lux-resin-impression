import { formatOrderDate } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-[#1D1D1F]">Customers</h1>
        <span className="text-sm text-gray-500">{customers.length} total</span>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Signed up</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr className="border-t border-gray-100">
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-[#1D1D1F]">{customer.name}</td>
                  <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{customer.phone}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatOrderDate(customer.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{customer._count.orders}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${customer.id}`}
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
