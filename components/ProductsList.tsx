"use client";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import type { Product } from "../data/products";

export default function ProductsList({ products }: { products: Product[] }) {
  const { addToCart } = useCart();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.slug} className="border border-gray-100 rounded-2xl p-4 transition-shadow duration-300 hover:shadow-md">
          <Link href={`/products/${product.slug}`}>
            <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-300 text-xs cursor-pointer">
              {product.images[0]}
            </div>
          </Link>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm text-[#1D1D1F] cursor-pointer hover:text-[#B8933E] transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">PKR {product.price}</p>
          <span className="inline-block mt-2 mb-4 text-xs text-[#B8933E] border border-[#B8933E]/30 rounded-full px-3 py-1">
            {product.availability}
          </span>
          <button
            onClick={() =>
              addToCart({
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0],
              })
            }
            className="w-full flex items-center justify-center gap-2 bg-[#1D1D1F] text-white text-sm py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E]"
          >
            <ShoppingBag size={15} />
            Add to cart
          </button>
        </div>
      ))}
    </div>
  );
}