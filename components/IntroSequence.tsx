"use client";

import { motion } from "framer-motion";

type IntroSequenceProps = {
  greeting: string;
};

export default function IntroSequence({ greeting }: IntroSequenceProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1D1D1F]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xs tracking-[0.3em] text-[#B8933E] mb-4"
      >
        {greeting.toUpperCase()}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-3xl md:text-5xl font-light text-white"
      >
        Lux <span className="text-[#B8933E]">Resin</span> Impression
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="text-sm text-gray-400 mt-4"
      >
        Every piece, handcrafted to perfection
      </motion.p>
    </motion.div>
  );
}