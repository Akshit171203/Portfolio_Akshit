"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Custom cursor for mouse users only. Grows over anything interactive, and shows a label over
 * elements marked with data-cursor="Label". Touch devices and keyboards are untouched.
 */
export function Cursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 45, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 600, damping: 45, mass: 0.35 });
  const [mode, setMode] = useState({ label: "", hover: false, visible: false });

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      const interactive = t?.closest("a, button, [role=link], input, textarea");
      setMode({ label: labelled?.dataset.cursor ?? "", hover: Boolean(labelled || interactive), visible: true });
    };
    const leave = () => setMode((m) => ({ ...m, visible: false }));
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  const size = mode.label ? 92 : mode.hover ? 52 : 14;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100]" style={{ x: sx, y: sy }}>
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-fg text-bg"
        animate={{ width: size, height: size, opacity: !mode.visible ? 0 : mode.label ? 1 : mode.hover ? 0.22 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        {mode.label && <span className="text-sm font-semibold">{mode.label}</span>}
      </motion.div>
    </motion.div>
  );
}
