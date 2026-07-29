"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const navLinks = [
  { name: "Jewellery", href: "/products" },
  { name: "Resin Art", href: "/products" },
  { name: "Custom Order", href: "/custom-order" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href="/" className="text-lg tracking-wide text-[#1D1D1F]">
          Lux <span className="text-[#B8933E]">Resin</span> Impression
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="cursor-pointer transition-colors duration-300 hover:text-[#B8933E]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Cart */}
        <button className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] hover:text-white hover:border-[#B8933E]">
          <ShoppingBag size={16} />
          Cart (0)
        </button>
      </div>
    </nav>
  );
}