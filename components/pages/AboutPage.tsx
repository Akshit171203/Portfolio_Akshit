"use client";

import { motion } from "framer-motion";
import { TransitionLink } from "@/components/TransitionLink";
import { CountUp } from "@/components/ui/CountUp";
import { SplitText } from "@/components/ui/SplitText";
import { Tilt } from "@/components/ui/Tilt";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

const EASE = [0.22, 1, 0.36, 1] as const;
const COLORS = ["lime", "sky", "pink", "lilac", "butter", "mint"] as const;

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  { to: 1.5, decimals: 1, suffix: "+", label: "years of professional experience", color: "lime" },
  { to: 100, decimals: 0, suffix: "", label: "commits on the CoRover.ai website (of 107)", color: "sky" },
  { to: projects.length, decimals: 0, suffix: "", label: "projects across web, AI and internal tools", color: "pink" },
];

const principles = [
  { t: "Understand the system, not just the screen.", c: "lilac" },
  { t: "Treat performance and accessibility as features.", c: "butter" },
  { t: "Use AI where it earns its place.", c: "mint" },
];

export function AboutPage() {
  const atCorover = projects.filter((p) => ["corover", "whatsapp-platform", "grse-dashboard", "builder-v2", "bharatgpt", "corover-bot-widget", "hdfc-translator", "kanha-ai"].includes(p.slug));

  return (
    <div className="pt-36 sm:pt-44">
      <div className="container-page">
        <h1 className="font-display text-[clamp(3.5rem,14vw,12rem)] font-extrabold leading-[0.9]">
          <SplitText text="About" />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
          className="font-display mt-10 max-w-4xl text-[clamp(1.5rem,3.4vw,2.75rem)] font-semibold leading-[1.2]"
        >
          I’m a software engineer focused on building reliable, scalable and user-centric web applications. I
          enjoy understanding systems beyond simply making the UI work.
        </motion.p>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <Tilt>
                <div className="flex h-full flex-col-reverse justify-end gap-2 rounded-3xl p-7 text-ink" style={{ background: `var(--${s.color})` }}>
                  <span className="text-sm font-medium leading-snug">{s.label}</span>
                  <span className="font-display text-6xl font-bold">
                    <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                  </span>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>

        {/* Experience */}
        <section aria-labelledby="exp" className="mt-28">
          <Reveal>
            <h2 id="exp" className="mb-8 text-sm font-semibold uppercase tracking-widest text-muted">Experience</h2>
          </Reveal>
          <Reveal>
            <div className="rounded-[2rem] border border-line p-7 sm:p-10">
              <p className="text-sm font-semibold text-muted">January 2025 – Present</p>
              <p className="font-display mt-2 text-4xl font-bold sm:text-6xl">CoRover</p>
              <p className="mt-2 text-lg font-medium">Full Stack Web Developer</p>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Projects at CoRover">
                {atCorover.map((p) => (
                  <li key={p.slug}>
                    <motion.span whileHover={{ y: -3 }} className="inline-block">
                      <TransitionLink
                        href={`/work/${p.slug}`}
                        label={p.name}
                        color={p.color}
                        className="inline-block rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-transparent hover:text-ink"
                        style={{ ["--hover" as string]: `var(--${p.color})` }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = `var(--${p.color})`)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                      >
                        {p.name}
                      </TransitionLink>
                    </motion.span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* Skills */}
        <section aria-labelledby="skills" className="mt-28">
          <Reveal>
            <h2 id="skills" className="mb-8 text-sm font-semibold uppercase tracking-widest text-muted">Skills</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {skillGroups.map((g, i) => (
              <Reveal key={g.name} delay={(i % 2) * 0.07}>
                <div className="h-full rounded-3xl border border-line p-6 sm:p-7">
                  <h3 className="font-display flex items-center gap-3 text-2xl font-bold">
                    <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: `var(--${COLORS[i % COLORS.length]})` }} />
                    {g.name}
                  </h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {g.skills.map((s) => (
                      <motion.li
                        key={s}
                        whileHover={{ y: -4, rotate: -2, backgroundColor: `var(--${COLORS[i % COLORS.length]})`, color: "var(--ink)" }}
                        className="rounded-full bg-fg/[0.07] px-4 py-2 text-sm font-semibold"
                      >
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section aria-labelledby="how" className="mt-28">
          <Reveal>
            <h2 id="how" className="mb-8 text-sm font-semibold uppercase tracking-widest text-muted">How I work</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.08}>
                <Tilt>
                  <div className="flex min-h-56 flex-col justify-between rounded-3xl p-7 text-ink" style={{ background: `var(--${p.c})` }}>
                    <span className="font-display text-sm font-bold">{String(i + 1).padStart(2, "0")}</span>
                    <p className="font-display text-2xl font-bold leading-tight">{p.t}</p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
