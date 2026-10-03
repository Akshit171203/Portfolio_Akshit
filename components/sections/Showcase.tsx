"use client";

import { motion } from "framer-motion";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;
const FEATURED = 5;

/** Column spans on a 12-column grid (md and up): two wide cards, then three equal ones. */
const SPAN = ["md:col-span-7", "md:col-span-5", "md:col-span-4", "md:col-span-4", "md:col-span-4"];

/** A compact grid of the featured projects. The full list lives on /work. */
export function Showcase() {
  const featured = projects.slice(0, FEATURED);
  return (
    <section aria-labelledby="showcase-title" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
          <h2 id="showcase-title" className="font-display text-[clamp(2.25rem,5.5vw,4.25rem)] font-bold leading-none tracking-tight">
            Selected work
          </h2>
          <p aria-hidden className="font-display pb-1 text-base font-semibold tabular-nums sm:text-lg">
            {String(featured.length).padStart(2, "0")}
            <span className="text-muted"> / {String(projects.length).padStart(2, "0")}</span>
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-12">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} big={i < 2} delay={(i % 3) * 0.08} className={SPAN[i]} />
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-4"
        >
          <TransitionLink
            href="/work"
            label="Work"
            color="lime"
            data-cursor="All"
            className="font-display group flex items-center justify-between gap-4 rounded-3xl border border-line px-6 py-5 text-xl font-bold transition-colors hover:bg-fg hover:text-bg sm:px-8 sm:text-2xl"
          >
            <span>See all {projects.length} projects</span>
            <ArrowRightIcon size={26} className="transition-transform duration-300 group-hover:translate-x-1" />
          </TransitionLink>
        </motion.div>
      </div>
    </section>
  );
}
