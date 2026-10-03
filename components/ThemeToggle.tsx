"use client";

import { motion } from "framer-motion";
import { MoonIcon, SunIcon } from "@/components/ui/Icons";

/**
 * The theme lives on <html data-theme> (set before paint by the inline script in layout.tsx),
 * so there is no React state to hydrate. Both icons render and CSS shows the right one.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.classList.add("theme-transition");
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
    window.setTimeout(() => root.classList.remove("theme-transition"), 400);
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.85, rotate: 20 }}
      whileHover={{ rotate: 15 }}
      aria-label="Toggle light and dark theme"
      className="grid h-10 w-10 place-items-center rounded-full"
    >
      <SunIcon className="hidden [[data-theme=dark]_&]:block" />
      <MoonIcon className="block [[data-theme=dark]_&]:hidden" />
    </motion.button>
  );
}
