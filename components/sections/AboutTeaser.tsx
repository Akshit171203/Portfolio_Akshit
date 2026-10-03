"use client";

import { motion } from "framer-motion";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { CountUp } from "@/components/ui/CountUp";
import { Magnetic } from "@/components/ui/Magnetic";
import { WordReveal } from "@/components/ui/WordReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const STATEMENT = "I’m a software engineer focused on building reliable, scalable and user-centric web applications.";

const AREAS = ["Frontend architecture", "Backend APIs", "Databases", "Real-time systems", "AI-powered product experiences"];

// Each figure is the verified count shown on that project's own page (git blame, commit logs, Cloudflare).
const FIGURES = [
  { to: 81, decimals: 0, suffix: "M+", label: "monthly unique visitors on the CoRover.ai site (Cloudflare-observed)", color: "lime" },
  { to: 34600, decimals: 0, suffix: "+", label: "lines of BuilderV2 code written by me, of about 281,500", color: "sky" },
  { to: 130, decimals: 0, suffix: "+", label: "API endpoints consumed by the WhatsApp platform’s two frontends", color: "pink" },
];

/** Home teaser: a statement, three figures in a ledger, and the areas I work in as a numbered list. */
export function AboutTeaser() {
  return (
    <section aria-labelledby="about-teaser" className="pb-6 pt-20 sm:pb-10 sm:pt-28">
      <div className="container-page">
        <div className="mb-8 flex items-center justify-between gap-6">
          <h2 id="about-teaser" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            <span aria-hidden className="h-2 w-2 rounded-full bg-lime" />
            About
          </h2>
          <Magnetic>
            <TransitionLink href="/about" label="About" color="lilac" className="group inline-flex items-center gap-2 text-sm font-semibold">
              <span className="underline-offset-4 group-hover:underline">More about me</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border border-line transition-all duration-300 group-hover:-rotate-45 group-hover:border-transparent group-hover:bg-fg group-hover:text-bg">
                <ArrowRightIcon size={14} />
              </span>
            </TransitionLink>
          </Magnetic>
        </div>

        <WordReveal text={STATEMENT} className="font-display max-w-5xl text-[clamp(1.9rem,4.4vw,3.9rem)] font-semibold leading-[1.1] tracking-tight" />

        {/* The figures: one ledger, hairline dividers, no filled tiles */}
        <dl className="mt-14 grid grid-cols-1 divide-y divide-line overflow-hidden rounded-[2rem] border border-line sm:mt-20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {FIGURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="group relative flex flex-col justify-between gap-10 p-7 transition-colors duration-500 hover:bg-fg/[0.03] sm:min-h-[13rem] sm:p-9"
            >
              <dt className="flex items-start gap-3 text-sm leading-snug text-muted">
                <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-150" style={{ background: `var(--${f.color})` }} />
                {f.label}
              </dt>
              <dd className="font-display text-6xl font-extrabold leading-none tracking-tight sm:text-7xl">
                <CountUp to={f.to} decimals={f.decimals} suffix={f.suffix} />
              </dd>
            </motion.div>
          ))}
        </dl>

        {/* Where I work, as a numbered list */}
        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ staggerChildren: 0.07 }}
          aria-label="Areas I work in"
          className="mt-10 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-5"
        >
          {AREAS.map((area, i) => (
            <motion.li
              key={area}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.55, ease: EASE }}
              className="group border-t border-line py-5 transition-colors duration-300 hover:border-fg"
            >
              <span className="font-display text-xs font-semibold tracking-[0.2em] text-muted transition-colors group-hover:text-fg">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-[1.0625rem] font-semibold leading-snug">{area}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
