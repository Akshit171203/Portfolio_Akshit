"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

/** Counts from 0 to `to` the first time it scrolls into view. */
export function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const value = useMotionValue(0);
  const fmt = (v: number) =>
    `${v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  const text = useTransform(value, fmt);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, to, value]);

  return (
    <span ref={ref}>
      {/* Final value is in the DOM for crawlers and screen readers; the animation is decorative. */}
      <span className="sr-only">{fmt(to)}</span>
      <motion.span aria-hidden>{text}</motion.span>
    </span>
  );
}
