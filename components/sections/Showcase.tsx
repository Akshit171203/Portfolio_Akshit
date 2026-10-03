"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { projects, type Project } from "@/data/projects";
import { useMediaQuery } from "@/lib/hooks";

function Card({ project: p, index, pinned }: { project: Project; index: number; pinned: boolean }) {
  const shot = p.screens?.[0];
  return (
    <TransitionLink
      href={`/work/${p.slug}`}
      label={p.name}
      color={p.color}
      data-cursor="View"
      style={{ background: `var(--${p.color})` }}
      className={`group relative flex shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] p-7 text-ink sm:p-9 ${
        pinned ? `h-[62vh] max-h-[34rem] ${shot ? "w-[min(88vw,50rem)]" : "w-[min(80vw,30rem)]"}` : "min-h-[26rem] w-full"
      }`}
    >
      <span aria-hidden className="font-display pointer-events-none absolute -right-4 -top-8 text-[11rem] font-extrabold leading-none opacity-[0.12] transition-transform duration-500 group-hover:-translate-x-3 group-hover:translate-y-3 group-hover:rotate-6">
        {String(index + 1).padStart(2, "0")}
      </span>
      {shot && (
        <div aria-hidden className="pointer-events-none absolute -right-10 top-24 hidden w-[56%] rotate-[-4deg] overflow-hidden rounded-2xl border border-ink/20 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.5)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[-2deg] md:block">
          <Image src={shot.src} alt="" width={2880} height={1800} sizes="500px" className="block h-auto w-full" />
        </div>
      )}
      <div className="relative">
        <p className="text-sm font-semibold opacity-70">{p.period ?? p.kind}</p>
        <h3 className="font-display mt-3 text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-[1]">{p.name}</h3>
        <p className={`mt-4 text-[0.9375rem] leading-relaxed ${shot ? "max-w-xs" : "max-w-sm"}`}>{p.tagline}</p>
      </div>
      <div className="relative flex items-end justify-between gap-4">
        <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
          {p.stack.slice(0, 3).map((t) => (
            <li key={t} className="rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold">{t}</li>
          ))}
        </ul>
        <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink text-lime transition-transform duration-300 group-hover:-rotate-45 group-hover:scale-110">
          <ArrowRightIcon size={22} />
        </span>
      </div>
    </TransitionLink>
  );
}

/**
 * Vertical scrolling drives a horizontal track while the section is pinned (md+ only).
 * Small screens and reduced-motion users get a plain vertical list instead.
 */
export function Showcase() {
  const wide = useMediaQuery("(min-width: 768px)");
  const reduce = useReducedMotion();
  const pinned = wide && !reduce;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const count = useTransform(scrollYProgress, (v) => String(Math.min(projects.length, Math.floor(v * projects.length) + 1)).padStart(2, "0"));

  useEffect(() => {
    const el = trackRef.current;
    if (!pinned || !el) return;
    const measure = () => setDist(Math.max(0, el.scrollWidth - window.innerWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="showcase-title"
      className="relative"
      style={pinned ? { height: `calc(100vh + ${dist}px)` } : { padding: "6rem 0" }}
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : ""}>
        <div className="container-page mb-8 flex items-end justify-between gap-6 sm:mb-10">
          <h2 id="showcase-title" className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-none">
            Selected work
          </h2>
          {pinned && (
            <p aria-hidden className="font-display pb-2 text-xl font-semibold tabular-nums">
              <motion.span>{count}</motion.span>
              <span className="text-muted"> / {String(projects.length).padStart(2, "0")}</span>
            </p>
          )}
        </div>

        {pinned ? (
          <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 pl-[max(1.25rem,calc((100vw-76rem)/2+2rem))] pr-24">
            {projects.map((p, i) => (
              <Card key={p.slug} project={p} index={i} pinned />
            ))}
            <TransitionLink
              href="/work"
              label="Work"
              color="lime"
              data-cursor="All"
              className="font-display flex h-[62vh] max-h-[34rem] w-[min(70vw,22rem)] shrink-0 flex-col items-start justify-end rounded-[2rem] border border-line p-9 text-4xl font-bold transition-colors hover:bg-fg hover:text-bg"
            >
              See all work
              <ArrowRightIcon size={36} className="mt-4" />
            </TransitionLink>
          </motion.div>
        ) : (
          <div className="container-page flex flex-col gap-4">
            {projects.map((p, i) => (
              <Card key={p.slug} project={p} index={i} pinned={false} />
            ))}
          </div>
        )}

        {pinned && (
          <div aria-hidden className="container-page mt-8">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-1 origin-left rounded-full bg-fg" />
          </div>
        )}
      </div>
    </section>
  );
}
