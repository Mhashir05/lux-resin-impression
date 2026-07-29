"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
      <Link href="/" className="text-lg tracking-wide text-[#1D1D1F]">
        Lux <span className="text-[#B8933E]">Resin</span> Impression
      </Link>
      <button className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#B8933E] hover:text-white hover:border-[#B8933E] cursor-pointer">
        <ShoppingBag size={16} />
        Cart (0)
      </button>
    </header>
  );
}