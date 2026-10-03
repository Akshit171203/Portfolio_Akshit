"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/Icons";
import { projects, type Project } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;
const FEATURED = 5;

/** Column spans on a 12-column grid (md and up): two wide cards, then three equal ones. */
const SPAN = ["md:col-span-7", "md:col-span-5", "md:col-span-4", "md:col-span-4", "md:col-span-4"];

function Card({ project: p, index }: { project: Project; index: number }) {
  // a still screenshot, not the video poster (a poster can be a blank first frame)
  const shot = p.screens?.find((x) => !x.video) ?? p.screens?.[0];
  const big = index < 2;
  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: EASE }}
      className={SPAN[index]}
    >
      <TransitionLink
        href={`/work/${p.slug}`}
        label={p.name}
        color={p.color}
        data-cursor="View"
        style={{ background: `var(--${p.color})` }}
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl text-ink transition-transform duration-500 hover:-translate-y-1 ${big ? "min-h-[24rem]" : "min-h-[22rem]"}`}
      >
        <div className="flex items-start justify-between gap-4 p-6 pb-0 sm:p-7 sm:pb-0">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
              <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <span aria-hidden> · </span>
              {p.period ?? p.kind}
            </p>
            <h3 className={`font-display mt-3 font-extrabold leading-[0.98] tracking-tight ${big ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}>{p.name}</h3>
            {big && <p className="mt-3 line-clamp-2 max-w-md text-[0.9375rem] leading-snug opacity-80">{p.tagline}</p>}
          </div>
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-lime transition-transform duration-300 group-hover:-rotate-45 group-hover:scale-110"
          >
            <ArrowUpRightIcon size={18} />
          </span>
        </div>

        <ul className="mt-4 flex flex-wrap gap-1.5 px-6 sm:px-7" aria-label="Tech stack">
          {p.stack.slice(0, big ? 4 : 3).map((t) => (
            <li key={t} className="rounded-full bg-ink/10 px-2.5 py-1 text-xs font-semibold">
              {t}
            </li>
          ))}
        </ul>

        {/* the screenshot peeks up from the bottom edge */}
        {shot ? (
          <div aria-hidden className="relative mx-6 mt-5 min-h-40 flex-1 overflow-hidden rounded-t-xl border border-b-0 border-ink/20 bg-black shadow-[0_-20px_50px_-20px_rgb(0_0_0/0.45)] sm:mx-7">
            <Image
              src={shot.src}
              alt=""
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
            />
          </div>
        ) : (
          <span aria-hidden className="font-display pointer-events-none absolute -bottom-10 -right-2 select-none text-[11rem] font-extrabold leading-none opacity-[0.12]">
            {p.name.charAt(0)}
          </span>
        )}
      </TransitionLink>
    </motion.li>
  );
}

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
            <Card key={p.slug} project={p} index={i} />
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
