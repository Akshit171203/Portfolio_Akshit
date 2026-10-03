"use client";

import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/hooks";

type Shot = { src: string; alt: string; caption: string; ratio?: number };

const pad = (n: number) => String(n).padStart(2, "0");

/** One screenshot in a browser frame. The frame takes the image's own proportions, so wide crops stay whole. */
function Frame({ shot, priority, pinned }: { shot: Shot; priority?: boolean; pinned?: boolean }) {
  const r = shot.ratio ?? 1.6;
  return (
    <div
      className="shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#1b1b19] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.7)]"
      style={{
        width: pinned ? `min(calc(${r} * 58dvh), 86vw)` : "82vw",
        maxWidth: pinned ? undefined : "34rem",
      }}
    >
      <div aria-hidden className="flex items-center gap-1.5 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b4a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffd75e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#86e3b5]" />
      </div>
      <div className="relative bg-black" style={{ aspectRatio: String(r) }}>
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          priority={priority}
          sizes={pinned ? "(min-width: 1100px) 1100px, 86vw" : "82vw"}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

function Pinned({ shots, color, title, note }: { shots: Shot[]; color: string; title: string; note?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const travel = useMotionValue(0);
  const [length, setLength] = useState(0);
  const [index, setIndex] = useState(0);
  const n = shots.length;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const t = Math.max(0, el.scrollWidth - window.innerWidth);
      travel.set(t);
      setLength(t);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [travel]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform([scrollYProgress, travel], ([p, t]: number[]) => -p * t);
  useMotionValueEvent(scrollYProgress, "change", (v) => setIndex(Math.min(n - 1, Math.max(0, Math.round(v * (n - 1))))));

  return (
    <div ref={ref} style={{ height: `calc(100dvh + ${Math.round(length * 0.8)}px)` }} className="relative">
      <div className="sticky top-0 flex h-dvh flex-col justify-between overflow-hidden py-8 sm:py-10">
        <div className="container-page flex flex-wrap items-end justify-between gap-4">
          <h2 id="product-h" className="font-display text-4xl font-extrabold leading-none tracking-tight sm:text-6xl">
            {title}
          </h2>
          {note && <p className="max-w-sm text-sm leading-relaxed text-white/60">{note}</p>}
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-center gap-6 px-[7vw] will-change-transform">
          {shots.map((s, i) => (
            <Frame key={s.src} shot={s} priority={i === 0} pinned />
          ))}
        </motion.div>

        <div className="container-page">
          <div className="flex items-baseline gap-4 text-sm sm:text-base">
            <span className="font-display text-lg font-bold tabular-nums" style={{ color: `var(--${color})` }}>
              {pad(index + 1)}
              <span className="text-white/40"> / {pad(n)}</span>
            </span>
            <p aria-live="polite" className="text-white/80">
              {shots[index].caption}
            </p>
          </div>
          <div aria-hidden className="mt-4 h-[3px] overflow-hidden rounded-full bg-white/15">
            <motion.div className="h-full origin-left rounded-full" style={{ scaleX: scrollYProgress, background: `var(--${color})` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Strip({ shots, color, title, note }: { shots: Shot[]; color: string; title: string; note?: string }) {
  return (
    <div className="py-16">
      <div className="container-page mb-8">
        <h2 id="product-h" className="font-display text-4xl font-extrabold leading-none tracking-tight">
          {title}
        </h2>
        {note && <p className="mt-3 text-sm leading-relaxed text-white/60">{note}</p>}
      </div>
      <ol className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8">
        {shots.map((s, i) => (
          <li key={s.src} className="snap-center">
            <Frame shot={s} />
            <p className="mt-3 flex max-w-[82vw] gap-3 text-sm sm:max-w-[34rem]">
              <span className="font-display font-bold" style={{ color: `var(--${color})` }}>
                {pad(i + 1)}
              </span>
              <span className="text-white/70">{s.caption}</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * The product as a film strip on a dark stage: pinned while you scroll, it slides sideways one screenshot at a time.
 * Small screens and reduced-motion users get a swipeable row instead.
 */
export function Showreel({ shots, color, note }: { shots: Shot[]; color: string; note?: string }) {
  const wide = useMediaQuery("(min-width: 768px)");
  const reduce = useReducedMotion();
  const title = "The product";
  return (
    <section id="product" aria-labelledby="product-h" className="bg-[#141412] text-[#f3f0e8]">
      {!wide || reduce ? <Strip shots={shots} color={color} title={title} note={note} /> : <Pinned shots={shots} color={color} title={title} note={note} />}
    </section>
  );
}
