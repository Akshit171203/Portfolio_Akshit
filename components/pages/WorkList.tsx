"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SplitText } from "@/components/ui/SplitText";
import { projects, type Project } from "@/data/projects";
import { useMediaQuery } from "@/lib/hooks";

function Row({ project: p, index, onPreview }: { project: Project; index: number; onPreview: (src: string | null) => void }) {
  const [active, setActive] = useState(false);
  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden border-t border-line last:border-b"
      style={{ color: active ? "var(--ink)" : undefined }}
      onMouseEnter={() => {
        setActive(true);
        onPreview(p.screens?.[0]?.src ?? null);
      }}
      onMouseLeave={() => {
        setActive(false);
        onPreview(null);
      }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 origin-bottom"
        style={{ background: `var(--${p.color})` }}
        initial={false}
        animate={{ scaleY: active ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
      />
      <TransitionLink
        href={`/work/${p.slug}`}
        label={p.name}
        color={p.color}
        data-cursor="Open"
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className="relative z-10 flex items-center gap-4 px-2 py-7 sm:gap-8 sm:px-6 sm:py-9"
      >
        <span className="w-7 shrink-0 text-sm font-semibold tabular-nums opacity-60">{String(index + 1).padStart(2, "0")}</span>
        <span className="min-w-0 flex-1">
          <motion.span
            animate={{ x: active ? 12 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="font-display block text-[clamp(1.75rem,5vw,4.25rem)] font-bold leading-none"
          >
            {p.name}
          </motion.span>
          <span className="mt-3 block max-w-xl text-sm leading-relaxed opacity-75 sm:text-base">{p.tagline}</span>
        </span>
        <span className="hidden text-right text-sm font-medium opacity-70 md:block">{p.period ?? p.kind}</span>
        <motion.span
          aria-hidden
          animate={{ rotate: active ? -45 : 0, scale: active ? 1.1 : 1 }}
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border ${active ? "border-ink/40" : "border-line"}`}
        >
          <ArrowRightIcon size={20} />
        </motion.span>
      </TransitionLink>
    </motion.li>
  );
}

export function WorkList() {
  const hoverable = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [preview, setPreview] = useState<string | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.4 });

  return (
    <div
      className="pt-36 sm:pt-44"
      onPointerMove={(e) => {
        x.set(e.clientX + 28);
        y.set(e.clientY - 120);
      }}
    >
      <div className="container-page">
        <h1 className="font-display text-[clamp(3.5rem,14vw,12rem)] font-extrabold leading-[0.9]">
          <SplitText text="Work" />
        </h1>
        <p className="mb-14 mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Production sites, internal tools and one full-stack product. Open any of them for the short version.
        </p>
        <ul>
          {projects.map((p, i) => (
            <Row key={p.slug} project={p} index={i} onPreview={setPreview} />
          ))}
        </ul>
      </div>

      {/* Floating screenshot that follows the cursor over projects that have one */}
      {hoverable && (
        <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-30" style={{ x, y }}>
          <AnimatePresence>
            {preview && (
              <motion.div
                key={preview}
                initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-[24rem] overflow-hidden rounded-xl border border-ink/20 bg-surface shadow-[0_30px_60px_-20px_rgb(0_0_0/0.5)]"
              >
                <Image src={preview} alt="" width={2880} height={1800} sizes="384px" className="block h-auto w-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
