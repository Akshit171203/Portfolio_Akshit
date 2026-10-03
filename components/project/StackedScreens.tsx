"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useMediaQuery } from "@/lib/hooks";

type Shot = { src: string; alt: string; caption: string };

function Frame({ shot, priority }: { shot: Shot; priority?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_90px_-40px_rgb(0_0_0/0.6)]">
      <div aria-hidden className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-coral" />
        <span className="h-2.5 w-2.5 rounded-full bg-butter" />
        <span className="h-2.5 w-2.5 rounded-full bg-mint" />
      </div>
      <div className="relative aspect-[8/5] bg-bg">
        <Image src={shot.src} alt={shot.alt} fill priority={priority} sizes="(min-width: 1100px) 1100px, 94vw" className="object-cover object-top" />
      </div>
    </div>
  );
}

function Card({ shot, i, n, progress, color }: { shot: Shot; i: number; n: number; progress: MotionValue<number>; color: string }) {
  const L = 0.92 / n; // scroll share per card
  const enter = i === 0 ? [0, 1] : [(i - 0.75) * L, i * L];
  const y = useTransform(progress, enter, i === 0 ? ["0%", "0%"] : ["115%", "0%"]);
  const last = i === n - 1;
  const scale = useTransform(progress, last ? [0, 1] : [i * L, (n - 1) * L], last ? [1, 1] : [1, 1 - 0.04 * (n - 1 - i)]);
  const dim = useTransform(progress, last ? [0, 1] : [i * L, (n - 1) * L], last ? [0, 0] : [0, 0.45]);

  return (
    <motion.figure
      style={{ y, scale, zIndex: i, top: `calc(10dvh + ${i * 16}px)` }}
      className="absolute inset-x-0 mx-auto w-[min(92vw,calc(68dvh*1.6),70rem)] origin-top will-change-transform"
    >
      <div className="relative">
        <Frame shot={shot} priority={i === 0} />
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 rounded-2xl bg-black" />
      </div>
      <figcaption className="mt-4 flex items-baseline gap-3 text-sm">
        <span className="font-display font-bold" style={{ color: `var(--${color})` }}>
          {String(i + 1).padStart(2, "0")}
        </span>
        <span className="text-muted">{shot.caption}</span>
      </figcaption>
    </motion.figure>
  );
}

function Pinned({ shots, color }: { shots: Shot[]; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = shots.length;
  const count = useTransform(scrollYProgress, (v) => String(Math.min(n, Math.floor(v / (0.92 / n)) + 1)).padStart(2, "0"));

  return (
    <div ref={ref} style={{ height: `${n * 62 + 38}dvh` }} className="relative">
      <div className="sticky top-0 h-dvh overflow-hidden">
        {shots.map((s, i) => (
          <Card key={s.src} shot={s} i={i} n={n} progress={scrollYProgress} color={color} />
        ))}
        <p aria-hidden className="font-display absolute bottom-8 left-6 text-sm font-semibold tabular-nums sm:left-10">
          <motion.span>{count}</motion.span>
          <span className="text-muted"> / {String(n).padStart(2, "0")}</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Screenshots as a deck: each one slides up over the last as you scroll, and the cards beneath shrink and dim.
 * Small screens and reduced-motion users get a plain list instead.
 */
export function StackedScreens({ shots, color }: { shots: Shot[]; color: string }) {
  const wide = useMediaQuery("(min-width: 768px)");
  const reduce = useReducedMotion();
  if (!wide || reduce) {
    return (
      <ol className="container-page space-y-12">
        {shots.map((s, i) => (
          <li key={s.src}>
            <Frame shot={s} />
            <p className="mt-3 flex gap-3 text-sm">
              <span className="font-display font-bold" style={{ color: `var(--${color})` }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-muted">{s.caption}</span>
            </p>
          </li>
        ))}
      </ol>
    );
  }
  return <Pinned shots={shots} color={color} />;
}
