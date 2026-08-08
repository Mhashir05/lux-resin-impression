"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type IntroSequenceProps = {
  greeting: string;
};

export default function IntroSequence({ greeting }: IntroSequenceProps) {
  const [stage, setStage] = useState<"intro" | "moving" | "done">("intro");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("moving"), 1800);
    const t2 = setTimeout(() => setStage("done"), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (stage === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      initial={{ backgroundColor: "#000000" }}
      animate={{ backgroundColor: stage === "moving" ? "rgba(0,0,0,0)" : "#000000" }}
      transition={{ duration: 0.8 }}
    >
      {/* Greeting + tagline — fade out when moving */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: stage === "moving" ? 0 : 1,
          y: 0,
        }}
        transition={{ duration: 0.6, delay: stage === "moving" ? 0 : 0.2 }}
        className="text-xs tracking-[0.3em] text-[#B8933E] mb-4"
      >
        {greeting.toUpperCase()}
      </motion.p>

      {/* Brand — moves to navbar position */}
      <motion.div
        animate={{
          scale: stage === "moving" ? 0.34 : 1,
          x: stage === "moving" ? "-33vw" : 0,
          y: stage === "moving" ? "-46vh" : 0,
        }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        className="text-3xl md:text-5xl font-light text-white"
      >
        Lux <span className="text-[#B8933E]">Resin</span> Impression
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === "moving" ? 0 : 1 }}
        transition={{ duration: 0.6, delay: stage === "moving" ? 0 : 0.9 }}
        className="text-sm text-gray-400 mt-4"
      >
        Every piece, handcrafted to perfection
      </motion.p>
    </motion.div>
  );
}