"use client";

import { ArrowUp, ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import WhiteButton from "./WhiteButton";

const shopLinks = [
  { name: "Jewellery", href: "/jewellery" },
  { name: "Resin Art", href: "/resin-art" },
  { name: "Custom Order", href: "/custom-order" },
  { name: "About", href: "/about" },
];
const policyLinks = [
  { name: "Terms of Service", href: "/policies#terms" },
  { name: "Privacy Policy", href: "/policies#privacy" },
  { name: "Shipping Policy", href: "/policies#shipping" },
  { name: "Refund Policy", href: "/policies#refund" },
];



export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      setShowTop(scrolledToBottom);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className="relative overflow-hidden text-white px-6 pt-16 pb-8"
      style={{
        background: "linear-gradient(180deg, #201A18 0%, #14100E 100%)",
      }}
    >
      {/* Rose gold glow line on top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #E0B0A5 30%, #C99E8F 50%, #E0B0A5 70%, transparent 100%)",
        }}
      />
     <div className="absolute top-10 -left-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #E0B0A540 0%, transparent 85%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-0 -right-20 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #C99E8F35 0%, transparent 85%)", filter: "blur(50px)" }} />
      {/* CTA band */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-white/10">
        <div>
          <h3 className="text-2xl font-light">
            Have something{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #E0B0A5, #C99E8F)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              special
            </span>{" "}
            in mind?
          </h3>
          <p className="text-sm text-gray-400 mt-2">
            Message us and we'll bring your idea to life, one piece at a time.
          </p>
        </div>
        <WhiteButton><FaWhatsapp size={16} />
          Chat on WhatsApp</WhiteButton>
      </div>

      {/* Main grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 pt-12">
        {/* Brand + socials */}
        <div>
          <div className="text-lg tracking-wide mb-4">
            Lux{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #E0B0A5, #C99E8F)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Resin
            </span>{" "}
            Impression
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs mb-6">
            Handcrafted resin jewellery and art, made one at a time in Karachi, Pakistan.
          </p>
          <div className="flex gap-3">
            {[FaInstagram, FaWhatsapp].map((Icon, i) => (
              <button
                key={i}
                className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full cursor-pointer transition-all duration-300 hover:bg-white hover:border-white hover:text-[#C99E8F] hover:-translate-y-1"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* Shop links */}
        <div>
          <p className="text-xs tracking-[0.2em] text-[#E0B0A5] mb-4">SHOP</p>
          <ul className="space-y-3 text-sm text-gray-300">
            {shopLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-1 cursor-pointer transition-all duration-300 hover:text-[#E0B0A5] hover:translate-x-1"
                >
                  {link.name}
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policy links */}
        <div>
          <p className="text-xs tracking-[0.2em] text-[#E0B0A5] mb-4">LEGAL</p>
          <ul className="space-y-3 text-sm text-gray-300">
            {policyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-1 cursor-pointer transition-all duration-300 hover:text-[#E0B0A5] hover:translate-x-1"
                >
                  {link.name}
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs tracking-[0.2em] text-[#E0B0A5] mb-4">CONTACT</p>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <FaWhatsapp size={15} className="text-[#E0B0A5]" /> +92 300 0000000
            </li>
            <li className="flex items-center gap-2">
              <FaInstagram size={15} className="text-[#E0B0A5]" /> @luxresinimpression
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-[#E0B0A5]" /> Karachi, Pakistan
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
        <span>© {new Date().getFullYear()} Lux Resin Impression. All rights reserved.</span>
        <button
          onClick={scrollTop}
          className={`w-11 h-11 flex items-center justify-center border border-white/20 rounded-full cursor-pointer transition-all duration-500 hover:bg-white hover:border-white hover:text-[#C99E8F] hover:-translate-y-1 ${
            showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </footer>
  );
}