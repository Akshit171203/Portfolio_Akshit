"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SplitText } from "@/components/ui/SplitText";
import { projects, type Project } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

type FilterId = "all" | "products" | "sites";

/** Which filter each project belongs to. Anything not listed counts as a product. */
const SITES = new Set(["corover", "bharatgpt", "corover-bot-widget"]);
const groupOf = (slug: string): FilterId => (SITES.has(slug) ? "sites" : "products");

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "products", label: "Products" },
  { id: "sites", label: "Sites & widgets" },
];

/** One project as a slim row: numbers on the left, the story in the middle, a thumbnail on the right. */
function Row({ project: p, index }: { project: Project; index: number }) {
  const coverSrc = p.cover ?? (p.screens?.find((x) => !x.video) ?? p.screens?.[0])?.src;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.55, ease: EASE }}
      className="border-b border-line first:border-t"
    >
      <TransitionLink
        href={`/work/${p.slug}`}
        label={p.name}
        color={p.color}
        data-cursor="Open"
        className="group relative grid grid-cols-1 items-center gap-5 overflow-hidden px-1 py-7 sm:px-4 md:grid-cols-[5.5rem_1fr_14rem] md:gap-8 lg:grid-cols-[6rem_1fr_16rem]"
      >
        {/* the project colour washes in on hover, with a bar down the left edge */}
        <span
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `color-mix(in srgb, var(--${p.color}) 16%, transparent)` }}
        />
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1 origin-center scale-y-0 transition-transform duration-500 group-hover:scale-y-100"
          style={{ background: `var(--${p.color})` }}
        />

        <div className="relative order-2 flex items-baseline gap-4 md:order-none md:block">
          <p className="font-display inline-grid h-10 min-w-10 place-items-center rounded-full px-3 text-base font-extrabold tabular-nums text-ink" style={{ background: `var(--${p.color})` }}>
            {pad(index + 1)}
          </p>
          <p className="text-xs font-semibold uppercase leading-snug tracking-[0.14em] text-muted md:mt-3">{p.period ?? "—"}</p>
        </div>

        <div className="relative order-3 min-w-0 md:order-none">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{p.kind}</p>
          <h2 className="font-display mt-2 text-3xl font-extrabold leading-[1] tracking-tight transition-transform duration-500 group-hover:translate-x-1.5 sm:text-4xl">
            {p.name}
          </h2>
          <p className="mt-3 line-clamp-2 max-w-xl leading-relaxed text-muted">{p.tagline}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {p.stack.slice(0, 4).map((t) => (
              <li key={t} className="rounded-full border border-line px-2.5 py-1 text-xs font-medium">
                {t}
              </li>
            ))}
            {p.stackPlaceholder && <li className="rounded-full border border-dashed border-coral px-2.5 py-1 text-xs font-medium text-coral">[ADD TECH STACK]</li>}
          </ul>
        </div>

        <div className="relative order-1 md:order-none">
          {/* a block of the project colour sits behind the thumbnail, offset like a shadow */}
          <span aria-hidden className="absolute -bottom-2 -right-2 left-2 top-2 rounded-xl transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" style={{ background: `var(--${p.color})` }} />
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-surface transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1">
            {coverSrc ? (
              <Image src={coverSrc} alt="" fill sizes="(min-width: 768px) 256px, 90vw" className="object-cover object-top" />
            ) : (
              <span aria-hidden className="font-display absolute inset-0 grid place-items-center text-7xl font-extrabold text-ink" style={{ background: `var(--${p.color})` }}>
                {p.name.charAt(0)}
              </span>
            )}
          </div>
          <span
            aria-hidden
            className="absolute -right-2 -top-3 hidden h-10 w-10 place-items-center rounded-full bg-ink text-lime opacity-0 transition-all duration-300 group-hover:opacity-100 md:grid md:group-hover:-rotate-45"
          >
            <ArrowRightIcon size={18} />
          </span>
        </div>
      </TransitionLink>
    </motion.li>
  );
}

export function WorkList() {
  const [filter, setFilter] = useState<FilterId>("all");
  const count = (id: FilterId) => (id === "all" ? projects.length : projects.filter((p) => groupOf(p.slug) === id).length);
  const visible = projects.map((p, index) => ({ p, index })).filter(({ p }) => filter === "all" || groupOf(p.slug) === filter);

  return (
    <div className="pt-32 sm:pt-40">
      <div className="container-page">
        <h1 className="font-display flex items-start gap-3 text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.9] tracking-tight">
          <SplitText text="Work" />
          <motion.sup
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
            className="mt-[0.4em] text-[0.22em] font-bold tabular-nums text-muted"
          >
            ({pad(projects.length)})
          </motion.sup>
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-8 pb-24 sm:mt-16 sm:pb-32 lg:grid-cols-12 lg:gap-14">
          {/* filters: pills on small screens, a sticky rail on large ones */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <p className="mb-4 hidden text-xs font-semibold uppercase tracking-[0.2em] text-muted lg:block">Show</p>
              <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:border-t lg:border-line">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={filter === f.id}
                    onClick={() => setFilter(f.id)}
                    className="group/f relative flex h-10 items-center justify-between gap-4 rounded-full border border-line px-4 text-sm font-semibold transition-colors aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg lg:h-auto lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:py-4 lg:text-base lg:text-muted lg:hover:text-fg lg:aria-pressed:bg-transparent lg:aria-pressed:text-fg"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="hidden h-2 w-2 rounded-full bg-lime opacity-0 transition-opacity group-aria-pressed/f:opacity-100 lg:block"
                      />
                      {f.label}
                    </span>
                    <span className="tabular-nums opacity-60">{pad(count(f.id))}</span>
                  </button>
                ))}
              </div>
              <p className="mt-6 hidden max-w-[14rem] text-sm leading-relaxed text-muted lg:block">Open any project for the case study: what I built, how it works and the problems I ran into.</p>
            </div>
          </aside>

          <ul className="lg:col-span-9">
            <AnimatePresence mode="popLayout">
              {visible.map(({ p, index }) => (
                <Row key={p.slug} project={p} index={index} />
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  );
}
