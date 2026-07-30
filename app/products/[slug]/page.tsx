"use client";

import { useState, use } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { products } from "../../../data/products";
import { ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);

  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="px-6 pt-16 pb-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4 min-w-0">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center text-[8px] text-gray-400 cursor-pointer transition-all duration-300 ${
                    activeImage === index
                      ? "bg-gray-200 ring-2 ring-[#B8933E]"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {img.split("—")[1] || img}
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="w-full min-w-0 aspect-square bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 text-sm">
              {product.images[activeImage]}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-xs tracking-[0.2em] text-gray-400 mb-3">
              {product.category.toUpperCase()}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F]">
              {product.name}
            </h1>
            <p className="text-xl text-gray-700 mt-4">PKR {product.price}</p>

            <span className="inline-block mt-4 text-xs text-[#B8933E] border border-[#B8933E]/30 rounded-full px-3 py-1">
              {product.availability}
            </span>

            <p className="mt-6 text-gray-500 leading-relaxed">
              {product.description}
            </p>

            {/* Customization box — only for Crafted to Order */}
            {product.availability === "Crafted to Order" && (
              <div className="mt-8">
                <label className="text-sm text-[#1D1D1F] block mb-2">
                  Customization details <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  placeholder="Tell us how you'd like this piece — colours, names, a photo to include, size..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E] resize-none"
                />
                <p className="text-xs text-gray-400 mt-2">
                  We&apos;ll confirm the details and lead time before crafting.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-8 space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-[#1D1D1F] text-white text-sm py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E]">
                <ShoppingBag size={16} />
                Add to cart
              </button>
              <button className="w-full text-sm text-gray-500 border border-gray-200 py-3 rounded-full cursor-pointer transition-all duration-300 hover:border-[#B8933E] hover:text-[#B8933E]">
                Prefer to chat? Order on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}