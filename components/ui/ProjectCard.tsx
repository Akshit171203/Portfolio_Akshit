"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import type { Project } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  project: Project;
  /** Position shown on the card (01, 02 …). */
  index: number;
  /** A larger card with a bigger title, a tagline and four chips. */
  big?: boolean;
  /** Show the tagline even on small cards (useful when there is no screenshot to carry the card). */
  tagline?: boolean;
  /** Reveal delay in seconds. */
  delay?: number;
  className?: string;
};

/**
 * A project as a coloured card: number and period, name, a few stack chips and a cropped screenshot
 * peeking up from the bottom edge. Projects without a screenshot get a ghost initial instead.
 */
export function ProjectCard({ project: p, index, big = false, tagline = false, delay = 0, className }: Props) {
  // a still screenshot, not the video poster (a poster can be a blank first frame)
  const shot = p.screens?.find((x) => !x.video) ?? p.screens?.[0];
  const showTagline = big || (tagline && !shot);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
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
            {showTagline && <p className="mt-3 line-clamp-3 max-w-md text-[0.9375rem] leading-snug opacity-80">{p.tagline}</p>}
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
          {p.stackPlaceholder && <li className="rounded-full border border-dashed border-ink/40 px-2.5 py-1 text-xs font-semibold">[ADD TECH STACK]</li>}
        </ul>

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
