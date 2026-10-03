"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { Tilt } from "@/components/ui/Tilt";

type Screen = { src: string; alt: string; caption: string };

const INTERVAL = 5000;

/**
 * Interactive screenshot viewer: one large browser frame, a thumbnail strip underneath.
 * Advances on its own while on screen, and stops for good as soon as the visitor takes over.
 */
export function ProductTour({ screens, color }: { screens: Screen[]; color: string }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [dir, setDir] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px" });
  const reduce = useReducedMotion();
  const n = screens.length;
  const running = auto && inView && !reduce;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setDir(1);
      setI((v) => (v + 1) % n);
    }, INTERVAL);
    return () => clearInterval(t);
  }, [running, n]);

  const go = (next: number) => {
    setAuto(false);
    setDir(next > i ? 1 : -1);
    setI((next + n) % n);
  };

  const cur = screens[i];

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="carousel"
      aria-label="Product screenshots"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
    >
      <Tilt max={2}>
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_80px_-35px_rgb(0_0_0/0.5)]">
          <div aria-hidden className="flex items-center gap-1.5 border-b border-line px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-coral" />
            <span className="h-2.5 w-2.5 rounded-full bg-butter" />
            <span className="h-2.5 w-2.5 rounded-full bg-mint" />
            <span className="ml-3 truncate rounded-full bg-fg/[0.06] px-3 py-0.5 text-[0.6875rem] font-medium text-muted">{cur.caption}</span>
          </div>
          <div className="relative aspect-[8/5] overflow-hidden bg-bg">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={cur.src}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60, scale: 1.02 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image src={cur.src} alt={cur.alt} fill sizes="(min-width: 1024px) 900px, 100vw" className="object-cover object-top" priority={i === 0} />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-3 right-3 flex gap-2">
              {[
                { label: "Previous screenshot", d: -1, Icon: ArrowLeftIcon },
                { label: "Next screenshot", d: 1, Icon: ArrowRightIcon },
              ].map(({ label, d, Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  onClick={() => go(i + d)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-ink/90 text-[#f4f1ea] backdrop-blur transition-transform hover:scale-110"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Tilt>

      <p aria-live="polite" className="mt-4 min-h-6 text-sm text-muted">
        <span className="font-semibold text-fg">{String(i + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")} · {cur.caption}
      </p>

      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {screens.map((s, idx) => {
          const on = idx === i;
          return (
            <li key={s.src}>
              <button
                type="button"
                aria-label={`Show: ${s.caption}`}
                aria-current={on}
                onClick={() => go(idx)}
                className={`group relative block w-full overflow-hidden rounded-lg border transition-all ${on ? "border-transparent" : "border-line opacity-60 hover:opacity-100"}`}
                style={on ? { boxShadow: `0 0 0 2px var(--${color})` } : undefined}
              >
                <span className="relative block aspect-[8/5]">
                  <Image src={s.src} alt="" fill sizes="160px" className="object-cover object-top" />
                </span>
                {on && running && (
                  <motion.span
                    key={`${i}-bar`}
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1 origin-left"
                    style={{ background: `var(--${color})` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
