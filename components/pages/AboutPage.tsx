"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { CountUp } from "@/components/ui/CountUp";
import { Magnetic } from "@/components/ui/Magnetic";
import { SplitText } from "@/components/ui/SplitText";
import { Tilt } from "@/components/ui/Tilt";
import { projects, type Project } from "@/data/projects";
import { site } from "@/data/site";
import { skillGroups } from "@/data/skills";

const EASE = [0.22, 1, 0.36, 1] as const;
const COLORS = ["lime", "sky", "pink", "lilac", "butter", "mint"] as const;
const pad = (n: number) => String(n).padStart(2, "0");

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Reveal for list items, so the <li> itself animates and the list markup stays valid. */
function RevealLi({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.li
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.li>
  );
}

/** A small section label with a coloured dot, used above each block. */
function Eyebrow({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
      <span aria-hidden className="h-2 w-2 rounded-full bg-lime" />
      {children}
    </h2>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** Start of a period like "Sep – Oct 2026" or "Jan 2026 – Present", as a sortable number. Undated projects sort as 0. */
function startOf(period?: string): number {
  if (!period) return 0;
  const m = MONTHS.findIndex((x) => period.includes(x));
  const y = period.match(/\d{4}/);
  return y ? Number(y[0]) * 12 + Math.max(0, m) : 0;
}
const newestFirst = (a: Project, b: Project) => startOf(b.period) - startOf(a.period);

const AT_COROVER = new Set(["corover", "whatsapp-platform", "grse-dashboard", "builder-v2", "bharatgpt", "corover-bot-widget", "hdfc-translator", "kanha-ai"]);

const PRINCIPLES = [
  { t: "Understand the system, not just the screen.", c: "lilac" },
  { t: "Treat performance and accessibility as features.", c: "butter" },
  { t: "Use AI where it earns its place.", c: "mint" },
];

const FACTS = [
  { to: 1.5, decimals: 1, suffix: "+", label: "years in the industry" },
  { to: projects.length, decimals: 0, suffix: "", label: "projects shipped or in progress" },
  { to: 100, decimals: 0, suffix: "", label: "of 107 commits on the CoRover.ai site" },
];

/** One entry on the timeline: a coloured dot on the rail, the dates, the project and what it is. */
function Entry({ project: p, delay }: { project: Project; delay: number }) {
  return (
    <RevealLi delay={delay} className="relative pb-10 pl-8 last:pb-0 sm:pl-10">
      <span aria-hidden className="absolute left-0 top-2 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-bg" style={{ background: `var(--${p.color})` }} />
      <TransitionLink href={`/work/${p.slug}`} label={p.name} color={p.color} data-cursor="Open" className="group block">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{p.period ?? p.kind}</p>
        <p className="font-display mt-1.5 flex items-center gap-3 text-2xl font-bold leading-tight transition-transform duration-300 group-hover:translate-x-1.5 sm:text-3xl">
          {p.name}
          <ArrowRightIcon size={20} className="-translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        </p>
        <p className="mt-2 line-clamp-2 max-w-xl leading-relaxed text-muted">{p.tagline}</p>
      </TransitionLink>
    </RevealLi>
  );
}

export function AboutPage() {
  const atCorover = projects.filter((p) => AT_COROVER.has(p.slug)).sort(newestFirst);
  const onMyOwn = projects.filter((p) => !AT_COROVER.has(p.slug)).sort(newestFirst);
  const photo = site.profileImage;

  return (
    <div className="pt-32 sm:pt-40">
      {/* Intro */}
      <section aria-labelledby="about-title" className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1 id="about-title" className="font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.9] tracking-tight">
            <SplitText text="About" />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: EASE }}
            className="font-display mt-8 max-w-2xl text-[clamp(1.5rem,3vw,2.4rem)] font-semibold leading-[1.18]"
          >
            I’m a software engineer focused on building reliable, scalable and user-centric web applications. I enjoy understanding systems beyond simply making
            the UI work.
          </motion.p>

          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8, ease: EASE }}
            className="mt-10 grid max-w-2xl grid-cols-3 border-t border-line"
          >
            {FACTS.map((f, i) => (
              <div key={f.label} className={`flex flex-col-reverse gap-2 pt-5 ${i > 0 ? "border-l border-line pl-4 sm:pl-6" : ""}`}>
                <dt className="text-xs leading-snug text-muted sm:text-sm">{f.label}</dt>
                <dd className="font-display text-4xl font-extrabold leading-none tracking-tight sm:text-5xl">
                  <CountUp to={f.to} decimals={f.decimals} suffix={f.suffix} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
          className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none"
        >
          <Tilt>
            <div className="relative">
              {/* a block of colour sits behind the portrait, offset like a shadow */}
              <span aria-hidden className="absolute -bottom-3 -right-3 left-3 top-3 rounded-[2rem] bg-lilac" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-surface">
                {photo ? (
                  <Image
                    src={photo}
                    alt={`Portrait of ${site.fullName}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="object-cover object-[50%_20%]"
                  />
                ) : (
                  <span aria-hidden className="font-display absolute inset-0 grid place-items-center bg-lilac text-[14rem] font-extrabold text-ink">
                    {site.name.charAt(0)}
                  </span>
                )}
                <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-ink/85 px-4 py-3 text-[#f4f1ea] backdrop-blur">
                  <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime" />
                  <p className="text-sm font-medium leading-snug">
                    {site.role}
                    <span className="block text-xs opacity-70">
                      at {site.company} since {site.since}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Tilt>
        </motion.div>
      </section>

      {/* Experience */}
      <section aria-labelledby="exp" className="container-page mt-32 grid grid-cols-1 gap-10 sm:mt-44 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow id="exp">Experience</Eyebrow>
              <p className="font-display mt-6 text-5xl font-extrabold leading-none tracking-tight sm:text-6xl">{site.company}</p>
              <p className="mt-3 text-lg font-medium">{site.role}</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-muted">{site.since} – Present</p>
              <p className="mt-6 max-w-xs leading-relaxed text-muted">Everything below is work I did here. Open any entry for the full case study.</p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ol className="relative ml-1.5 border-l border-line" aria-label={`Projects at ${site.company}`}>
            {atCorover.map((p, i) => (
              <Entry key={p.slug} project={p} delay={(i % 3) * 0.05} />
            ))}
          </ol>

          {onMyOwn.length > 0 && (
            <div className="mt-14">
              <Reveal>
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted">On my own</p>
              </Reveal>
              <ol className="relative ml-1.5 border-l border-dashed border-line" aria-label="Personal projects">
                {onMyOwn.map((p) => (
                  <Entry key={p.slug} project={p} delay={0} />
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>

      {/* Toolkit */}
      <section aria-labelledby="skills" className="container-page mt-32 sm:mt-44">
        <Reveal>
          <Eyebrow id="skills">Toolkit</Eyebrow>
        </Reveal>
        <div className="mt-8 border-t border-line">
          {skillGroups.map((g, i) => {
            const c = COLORS[i % COLORS.length];
            return (
              <Reveal key={g.name}>
                <div className="grid grid-cols-1 gap-4 border-b border-line py-7 md:grid-cols-[14rem_1fr] md:gap-10">
                  <h3 className="font-display flex items-center gap-3 text-2xl font-bold">
                    <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: `var(--${c})` }} />
                    {g.name}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {g.skills.map((s) => (
                      <motion.li
                        key={s}
                        whileHover={{ y: -3, backgroundColor: `var(--${c})`, color: "var(--ink)" }}
                        className="rounded-full border border-line px-4 py-2 text-sm font-semibold"
                      >
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* How I work */}
      <section aria-labelledby="how" className="container-page mt-32 sm:mt-44">
        <Reveal>
          <Eyebrow id="how">How I work</Eyebrow>
        </Reveal>
        <ol className="mt-8 border-t border-line">
          {PRINCIPLES.map((p, i) => (
            <RevealLi key={p.t} className="group relative overflow-hidden border-b border-line">
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100"
                style={{ background: `var(--${p.c})` }}
              />
              <div className="relative grid grid-cols-[3rem_1fr] items-baseline gap-4 px-2 py-9 transition-colors duration-300 group-hover:text-ink sm:grid-cols-[5rem_1fr] sm:px-6 sm:py-12">
                <span className="font-display text-xl font-bold tabular-nums opacity-50">{pad(i + 1)}</span>
                <p className="font-display text-3xl font-bold leading-[1.08] tracking-tight transition-transform duration-500 group-hover:translate-x-2 sm:text-5xl lg:text-6xl">
                  {p.t}
                </p>
              </div>
            </RevealLi>
          ))}
        </ol>
      </section>

      {/* Closing */}
      <section aria-labelledby="closing" className="container-page my-32 sm:my-44">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] bg-lime p-8 text-ink sm:flex-row sm:items-center sm:p-12">
            <h2 id="closing" className="font-display max-w-xl text-4xl font-extrabold leading-[1] tracking-tight sm:text-5xl">
              Want to build something together?
            </h2>
            <Magnetic>
              <TransitionLink
                href="/contact"
                label="Contact"
                color="coral"
                data-cursor="Say hi"
                className="inline-flex h-14 items-center gap-2 rounded-full bg-ink px-8 text-base font-semibold text-[#f4f1ea] transition-transform hover:-translate-y-0.5"
              >
                Get in touch <ArrowRightIcon size={18} />
              </TransitionLink>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
