"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, totalItems } = useCart();

  // Calculate total price
  const totalPrice = items.reduce((sum, item) => {
    const priceNum = Number(item.price.replace(/,/g, ""));
    return sum + priceNum * item.quantity;
  }, 0);

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="px-6 pt-16 pb-24 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-8">
        <span className="text-[#B8933E]">Cart</span>
        </h1>

        {items.length === 0 ? (
          // Empty cart
          <div className="text-center py-20">
            <p className="text-gray-500 mb-6">Your cart is empty.</p>
            <Link
              href="/products"
              className="inline-block bg-[#1D1D1F] text-white text-sm px-6 py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E]"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center gap-4 border border-gray-100 rounded-2xl p-4"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-[8px] text-gray-400 shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm text-[#1D1D1F]">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      PKR {item.price} × {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.slug)}
                    className="text-gray-400 cursor-pointer transition-colors duration-300 hover:text-red-500"
                    aria-label="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border border-gray-100 rounded-2xl p-6 h-fit">
              <h2 className="text-sm text-[#1D1D1F] font-medium mb-4">Order Summary</h2>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-base text-[#1D1D1F] font-medium border-t border-gray-100 pt-4 mt-4">
                <span>Total</span>
                <span>PKR {totalPrice.toLocaleString()}</span>
              </div>
              <Link
                href="/checkout"
                className="block text-center w-full bg-[#1D1D1F] text-white text-sm py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] mt-6"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}