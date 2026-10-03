"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** One switch that makes every Framer Motion animation respect prefers-reduced-motion. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
