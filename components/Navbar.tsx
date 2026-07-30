"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const navLinks = [
  { name: "Jewellery", href: "/jewellery" },
  { name: "Resin Art", href: "/resin-art" },
  { name: "Custom Order", href: "/custom-order" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const [show, setShow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu whenever the page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href="/" className="text-lg tracking-wide text-[#1D1D1F]">
          Lux <span className="text-[#B8933E]">Resin</span> Impression
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return isActive ? (
              <span key={link.name} className="text-[#B8933E] cursor-default">
                {link.name}
              </span>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="cursor-pointer transition-colors duration-300 hover:text-[#B8933E]"
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right side: Cart (desktop) + Hamburger (mobile) */}
        <Link
            href="/cart"
            className="relative flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] hover:text-white hover:border-[#B8933E]"
          >
            <div className="relative">
              <ShoppingBag size={16} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#B8933E] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart ({totalItems})</span>
          </Link>

          {/* Hamburger button — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 text-[#1D1D1F] cursor-pointer"
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 pb-6 gap-4 border-t border-gray-100 pt-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return isActive ? (
              <span key={link.name} className="text-[#B8933E] text-sm">
                {link.name}
              </span>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-gray-600 transition-colors duration-300 hover:text-[#B8933E]"
              >
                {link.name}
              </Link>
            );
          })}
          
        </div>
      </div>
    </nav>
  );
}