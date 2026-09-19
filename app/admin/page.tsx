import Link from "next/link";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const newOrders = await prisma.order.count({ where: { status: "New" } });
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <main className="min-h-screen bg-[#FBF8F2]">
      <div className="px-6 py-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <p className="text-xs text-gray-400 mb-1">Total Products</p>
            <p className="text-3xl font-medium text-[#1D1D1F]">{totalProducts}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <p className="text-xs text-gray-400 mb-1">Total Orders</p>
            <p className="text-3xl font-medium text-[#1D1D1F]">{totalOrders}</p>
          </div>
          <div className="bg-white border border-[#B8933E]/30 rounded-2xl p-6">
            <p className="text-xs text-gray-400 mb-1">New Orders</p>
            <p className="text-3xl font-medium text-[#B8933E]">{newOrders}</p>
          </div>
        </div>

        <div className="flex gap-3 mb-10">
          <Link
            href="/admin/products"
            className="bg-[#1D1D1F] text-white text-sm px-5 py-2.5 rounded-full"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="border border-gray-200 text-[#1D1D1F] text-sm px-5 py-2.5 rounded-full"
          >
            Manage Orders
          </Link>
        </div>

        <div>
          <h2 className="text-sm font-medium text-[#1D1D1F] mb-4">Recent Orders</h2>
          <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-100">
            {recentOrders.length === 0 ? (
              <p className="p-6 text-sm text-gray-400">No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm text-[#1D1D1F]">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#1D1D1F]">PKR {order.totalAmount}</p>
                    <span className="text-xs text-[#B8933E]">{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}