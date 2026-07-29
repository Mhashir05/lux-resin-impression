"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Brand shimmer sweep on page change */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, #B8933E, #E0B0A5, #B8933E, transparent)",
        }}
        initial={{ scaleX: 0, opacity: 1, transformOrigin: "left" }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Smooth fade + slight rise for the page content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}