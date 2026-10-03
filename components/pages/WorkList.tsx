"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SplitText } from "@/components/ui/SplitText";
import { projects } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;

type FilterId = "all" | "products" | "sites";

/** Which filter each project belongs to. Anything not listed counts as a product. */
const SITES = new Set(["corover", "bharatgpt", "corover-bot-widget", "hdfc-translator"]);
const groupOf = (slug: string): FilterId => (SITES.has(slug) ? "sites" : "products");

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "products", label: "Products" },
  { id: "sites", label: "Sites & widgets" },
];

export function WorkList() {
  const [filter, setFilter] = useState<FilterId>("all");
  const count = (id: FilterId) => (id === "all" ? projects.length : projects.filter((p) => groupOf(p.slug) === id).length);
  const visible = projects.map((p, index) => ({ p, index })).filter(({ p }) => filter === "all" || groupOf(p.slug) === filter);

  return (
    <div className="pt-32 sm:pt-40">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.9] tracking-tight">
            <SplitText text="Work" />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: EASE }}
            className="max-w-sm pb-2 leading-relaxed text-muted"
          >
            {projects.length} projects across products, internal tools and company sites. Open any one for the case study.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
          role="group"
          aria-label="Filter projects"
          className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6"
        >
          {FILTERS.map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors ${
                  on ? "border-fg bg-fg text-bg" : "border-line hover:border-fg/50"
                }`}
              >
                {f.label}
                <span className={`tabular-nums ${on ? "opacity-70" : "text-muted"}`}>{String(count(f.id)).padStart(2, "0")}</span>
              </button>
            );
          })}
        </motion.div>

        <ul className="mt-6 grid grid-cols-1 gap-3 pb-24 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 sm:pb-32">
          <AnimatePresence mode="popLayout">
            {visible.map(({ p, index }, i) => (
              <ProjectCard key={p.slug} project={p} index={index} tagline delay={(i % 3) * 0.06} />
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
