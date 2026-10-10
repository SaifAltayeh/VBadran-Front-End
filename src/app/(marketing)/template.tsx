"use client";

import { motion, useReducedMotion } from "framer-motion";

import { ease } from "@/lib/utils";

export default function MarketingTemplate({ children }: { children: React.ReactNode }) {
  const reduce = Boolean(useReducedMotion());
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
    >
      {children}
    </motion.div>
  );
}
