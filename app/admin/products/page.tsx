import DeleteProductButton from "@/components/DeleteProductButton";
import ToggleExclusiveButton from "@/components/ToggleExclusiveButton";
import { prisma } from "@/lib/prisma";
import { Pencil } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { exclusive } = await searchParams;
  const exclusiveOnly = exclusive === "true";

  const [totalCount, exclusiveCount, products] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isExclusive: true } }),
    prisma.product.findMany({
      where: exclusiveOnly ? { isExclusive: true } : undefined,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const filters = [
    { label: "All Products", href: "/admin/products", count: totalCount, active: !exclusiveOnly },
    {
      label: "Exclusive Products",
      href: "/admin/products?exclusive=true",
      count: exclusiveCount,
      active: exclusiveOnly,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-[#1D1D1F]">Products</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {exclusiveOnly ? `${products.length} of ${totalCount}` : `${products.length} total`}
          </span>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center text-sm text-white px-4 py-2 rounded-full whitespace-nowrap"
            style={{ background: "linear-gradient(90deg, #B8933E, #E0B0A5)" }}
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => (
          <Link
            key={filter.label}
            href={filter.href}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter.active
                ? "bg-[#1D1D1F] border-[#1D1D1F] text-white"
                : "bg-white border-gray-200 text-gray-600 hover:border-[#B8933E]"
            }`}
          >
            {filter.label} ({filter.count})
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Availability</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Exclusive</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr className="border-t border-gray-100">
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  {exclusiveOnly ? "No exclusive products yet." : "No products yet."}
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.id} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-md" />
                  )}
                </td>
                <td className="px-4 py-3 text-[#1D1D1F]">{product.name}</td>
                <td className="px-4 py-3 text-gray-600">{product.category}</td>
                <td className="px-4 py-3 text-gray-600">PKR {product.price}</td>
                <td className="px-4 py-3 text-gray-600">{product.availability}</td>
                <td className="px-4 py-3">
                  {product.featured ? (
                    <span className="text-[#B8933E] text-xs">Yes</span>
                  ) : (
                    <span className="text-gray-400 text-xs">No</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ToggleExclusiveButton
                    productId={product.id}
                    productName={product.name}
                    isExclusive={product.isExclusive}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-gray-600 hover:text-[#B8933E]"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteProductButton
                      productId={product.id}
                      productName={product.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}