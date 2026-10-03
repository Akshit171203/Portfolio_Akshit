"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

type Chapter = { id: string; label: string };

/** The active chapter is the last one whose heading has crossed 40% of the viewport height. */
function useActive(ids: string[]) {
  const key = ids.join("|");
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const list = key.split("|");
    let frame = 0;
    const compute = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let cur = list[0];
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      }
      setActive(cur);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);
  return active;
}

/** Slim chapter index fixed to the right edge. Appears once the hero has been scrolled past. */
export function ChapterNav({ chapters, color }: { chapters: Chapter[]; color: string }) {
  const active = useActive(chapters.map((c) => c.id));
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * 1.1));

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label="Chapters"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.35 }}
          className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
        >
          <ol className="flex flex-col items-end gap-3">
            {chapters.map((c) => {
              const on = active === c.id;
              return (
                <li key={c.id}>
                  <a href={`#${c.id}`} aria-current={on ? "location" : undefined} className="group flex items-center gap-3 py-0.5">
                    <span
                      className={`text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                        on ? "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 2xl:translate-x-0 2xl:opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
                      }`}
                    >
                      {c.label}
                    </span>
                    <span
                      aria-hidden
                      className="block h-1.5 rounded-full transition-all duration-300"
                      style={{ width: on ? 28 : 10, background: on ? `var(--${color})` : "var(--line)" }}
                    />
                  </a>
                </li>
              );
            })}
          </ol>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
