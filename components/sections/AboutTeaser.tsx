"use client";

import { motion } from "framer-motion";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { CountUp } from "@/components/ui/CountUp";
import { Magnetic } from "@/components/ui/Magnetic";
import { WordReveal } from "@/components/ui/WordReveal";
import { projects } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;

const STATEMENT = "I’m a software engineer focused on building reliable, scalable and user-centric web applications.";

const AREAS = ["Frontend architecture", "Backend APIs", "Databases", "Real-time systems", "AI-powered product experiences"];

const TILES = [
  { to: 1.5, decimals: 1, suffix: "+", label: "years of professional experience", color: "lime", wide: true },
  { to: projects.length, decimals: 0, suffix: "", label: "projects across web, AI and internal tools", color: "sky", wide: false },
  { to: 100, decimals: 0, suffix: "", label: "commits on the CoRover.ai site, of 107", color: "pink", wide: false },
];

/** Home teaser: a short statement and the areas I work in, beside three headline numbers. */
export function AboutTeaser() {
  return (
    <section aria-labelledby="about-teaser" className="py-20 sm:py-28">
      <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 id="about-teaser" className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            <span aria-hidden className="h-2 w-2 rounded-full bg-lime" />
            About
          </h2>
          <WordReveal text={STATEMENT} className="font-display text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.15]" />

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ staggerChildren: 0.06 }}
            aria-label="Areas I work in"
            className="mt-8 flex flex-wrap gap-2"
          >
            {AREAS.map((a) => (
              <motion.li
                key={a}
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: EASE }}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-fg/50 hover:bg-fg/[0.06]"
              >
                {a}
              </motion.li>
            ))}
          </motion.ul>

          <div className="mt-10">
            <Magnetic>
              <TransitionLink
                href="/about"
                label="About"
                color="lilac"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-7 font-semibold transition-colors hover:bg-fg hover:text-bg"
              >
                More about me <ArrowRightIcon size={16} />
              </TransitionLink>
            </Magnetic>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5">
          {TILES.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className={`flex flex-col-reverse justify-between gap-6 rounded-3xl p-6 text-ink transition-transform duration-500 hover:-translate-y-1 sm:p-7 ${t.wide ? "col-span-2" : ""}`}
              style={{ background: `var(--${t.color})`, minHeight: t.wide ? "11rem" : "10rem" }}
            >
              <dt className="max-w-[16rem] text-sm font-medium leading-snug opacity-80">{t.label}</dt>
              <dd className="font-display text-6xl font-extrabold leading-none tracking-tight sm:text-7xl">
                <CountUp to={t.to} decimals={t.decimals} suffix={t.suffix} />
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
