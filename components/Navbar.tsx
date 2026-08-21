"use client";

import { AnimatePresence, motion } from "framer-motion";
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

const ease = [0.22, 1, 0.36, 1] as const;

type Phase = "enter" | "settled" | "expanding" | "revealing" | "complete";

export default function Navbar() {
  const [phase, setPhase] = useState<Phase>("enter");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { totalItems } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setReducedMotion(true);
      setPhase("complete");
      return;
    }

    const timers = [
      setTimeout(() => setPhase("settled"), 400),
      setTimeout(() => setPhase("expanding"), 450),
      setTimeout(() => setPhase("revealing"), 950),
      setTimeout(() => setPhase("complete"), 1300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/policies") return null;

  const expanded = reducedMotion || phase === "expanding" || phase === "revealing" || phase === "complete";
  const showContent = reducedMotion || phase === "revealing" || phase === "complete";

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-50 px-4"
      style={{ top: scrolled ? 12 : 16, transition: "top 0.4s ease" }}
    >
      <motion.div
        initial={reducedMotion ? false : { y: -60, opacity: 0, scale: 0.92 }}
        animate={{ y: 0, opacity: 1, scale: scrolled ? 0.98 : 1 }}
        transition={{ duration: 0.4, ease }}
        style={{ width: "calc(100vw - 32px)", maxWidth: 1100 }}
      >
        <motion.div
          className="relative mx-auto overflow-hidden border"
          initial={reducedMotion ? false : { width: 24, height: 24, borderRadius: 999 }}
          animate={
            expanded
              ? {
                  width: "100%",
                  height: "auto",
                  borderRadius: 22,
                  backgroundColor: scrolled ? "rgba(29,29,31,0.62)" : "rgba(29,29,31,0.52)",
                  borderColor: "rgba(255,255,255,0.18)",
                }
              : {
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  backgroundColor: "rgba(29,29,31,0.34)",
                  borderColor: "rgba(255,255,255,0.18)",
                }
          }
          transition={{ duration: 0.5, ease }}
          style={{
            backdropFilter: expanded ? "blur(26px)" : "blur(6px)",
            boxShadow: expanded
              ? "0 12px 40px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.15)"
              : "none",
          }}
        >
          <AnimatePresence>
            {phase === "expanding" && !reducedMotion && (
              <motion.div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.12, 0] }}
                transition={{ duration: 0.8, ease }}
              >
                <motion.div
                  className="absolute inset-y-0 w-1/3"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                  }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "220%" }}
                  transition={{ duration: 0.8, ease }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-2 sm:py-2.5">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.3, delay: showContent ? 0 : 0 }}
              className="min-w-0"
            >
              <Link
                href="/"
                className="block truncate text-sm sm:text-base tracking-wide text-white"
              >
                Lux <span className="text-[#B8933E]">Resin</span> Impression
              </Link>
            </motion.div>

            <div className="hidden md:flex items-center gap-1 text-[13px] text-gray-300 shrink-0">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={reducedMotion ? false : { opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={
                      showContent
                        ? { opacity: 1, y: 0, filter: "blur(0px)" }
                        : { opacity: 0, y: 8, filter: "blur(4px)" }
                    }
                    transition={{ duration: 0.25, delay: showContent ? 0.1 + i * 0.05 : 0 }}
                  >
                    {isActive ? (
                      <span className="px-3 py-2 block text-[#E0B0A5]">{link.name}</span>
                    ) : (
                      <Link
                        href={link.href}
                        className="px-3 py-2 block rounded-[10px] transition-all duration-200 hover:bg-white/[0.08] hover:text-[#E0B0A5] hover:-translate-y-px whitespace-nowrap"
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="flex items-center gap-3 shrink-0"
              initial={reducedMotion ? false : { opacity: 0, y: 6, scale: 0.94 }}
              animate={
                showContent
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 6, scale: 0.94 }
              }
              transition={{ duration: 0.3, delay: showContent ? 0.3 : 0 }}
            >
              <Link
                href="/cart"
                className="hidden md:inline-flex relative items-center gap-2 text-sm text-white px-4 py-2 rounded-full whitespace-nowrap"
                style={{ background: "linear-gradient(90deg, #B8933E, #E0B0A5)" }}
              >
                <ShoppingBag size={15} />
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#1D1D1F] text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden flex items-center justify-center w-9 h-9 text-white cursor-pointer"
                aria-label="Menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </motion.div>
          </div>

          <motion.div
            className="md:hidden overflow-hidden"
            initial={false}
            animate={{ height: menuOpen ? "auto" : 0 }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="flex flex-col px-6 pb-5 gap-1 border-t border-white/10 pt-3">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : 6 }}
                    transition={{ duration: 0.25, delay: menuOpen ? i * 0.05 : 0 }}
                  >
                    {isActive ? (
                      <span className="block py-2 text-sm text-[#E0B0A5]">{link.name}</span>
                    ) : (
                      <Link
                        href={link.href}
                        className="block py-2 text-sm text-gray-300 transition-colors duration-200 hover:text-[#E0B0A5]"
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
              <Link
                href="/cart"
                className="mt-2 text-sm text-white px-4 py-2 rounded-full text-center"
                style={{ background: "linear-gradient(90deg, #B8933E, #E0B0A5)" }}
              >
                Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}