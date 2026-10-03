"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, GitHubIcon } from "@/components/ui/Icons";
import { CountUp } from "@/components/ui/CountUp";
import { PulseFlow } from "@/components/ui/PulseFlow";
import { SmartLink } from "@/components/ui/SmartLink";
import { SplitText } from "@/components/ui/SplitText";
import { Tilt } from "@/components/ui/Tilt";
import { getProjectUrls, type Project } from "@/data/projects";
import { ProductTour } from "./ProductTour";

const EASE = [0.22, 1, 0.36, 1] as const;

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

/** The active section is the last one whose heading has crossed 35% of the viewport height. */
function useScrollSpy(ids: string[]) {
  const key = ids.join("|"); // stable dependency: the array itself is new on every render
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const list = key.split("|");
    let frame = 0;
    const compute = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current = list[0];
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);
  return active;
}

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <Reveal>
      <h2 id={id} className="font-display mb-8 scroll-mt-28 text-4xl font-bold leading-none sm:text-5xl">
        {children}
      </h2>
    </Reveal>
  );
}

export function ProjectView({ project: p, next }: { project: Project; next: Project }) {
  const urls = getProjectUrls(p.slug);
  const color = p.color;

  const sections = [
    p.overview && { id: "overview", label: "Overview" },
    p.screens && { id: "tour", label: "Product tour" },
    { id: "highlights", label: "Highlights" },
    p.features && { id: "inside", label: "What's inside" },
    p.stats && { id: "numbers", label: "Numbers" },
    p.flows && { id: "flows", label: "How it flows" },
    p.challenges && { id: "problems", label: "Problems" },
    p.decisions && { id: "decisions", label: "Decisions" },
  ].filter(Boolean) as { id: string; label: string }[];
  const active = useScrollSpy(sections.map((s) => s.id));

  const meta = [
    p.role && { k: "Role", v: p.role },
    p.period && { k: "When", v: p.period },
    { k: "Type", v: p.kind },
  ].filter(Boolean) as { k: string; v: string }[];

  const cta =
    "inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-[#f4f1ea] transition-transform hover:-translate-y-0.5";

  return (
    <article>
      {/* Header */}
      <header className="relative overflow-hidden pb-14 pt-32 text-ink sm:pt-40" style={{ background: `var(--${color})` }}>
        <motion.span
          aria-hidden
          className="font-display pointer-events-none absolute -bottom-24 -right-6 select-none text-[24rem] font-extrabold leading-none opacity-[0.1]"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 0.1 }}
          transition={{ duration: 1, ease: EASE }}
        >
          {p.name.charAt(0)}
        </motion.span>
        <div className="container-page relative">
          <TransitionLink href="/work" label="Work" color="lime" className="inline-flex items-center gap-2 text-sm font-semibold">
            <ArrowLeftIcon size={16} /> All work
          </TransitionLink>
          <h1 className="font-display mt-6 text-[clamp(2.75rem,9vw,8rem)] font-extrabold leading-[0.95]">
            <SplitText text={p.name} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
            className="mt-6 max-w-2xl text-xl font-medium leading-snug sm:text-2xl"
          >
            {p.tagline}
          </motion.p>
          {(urls.live || urls.github) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7, ease: EASE }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {urls.live && (
                <SmartLink href={urls.live} label={`${p.name} live site`} className={cta}>
                  <ArrowUpRightIcon size={16} /> Live site
                </SmartLink>
              )}
              {urls.github && (
                <SmartLink href={urls.github} label={`${p.name} source on GitHub`} className={cta}>
                  <GitHubIcon size={16} /> Source code
                </SmartLink>
              )}
            </motion.div>
          )}
        </div>
      </header>

      {/* Body: sticky rail + content */}
      <div className="container-page grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-1">
            {meta.map((m) => (
              <div key={m.k} className="flex flex-col-reverse">
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{m.k}</dt>
                <dd className="font-semibold">{m.v}</dd>
              </div>
            ))}
          </dl>

          {(urls.live || urls.github) && (
            <div className="mt-8 flex flex-col gap-2">
              {urls.live && (
                <SmartLink
                  href={urls.live}
                  label={`${p.name} live site`}
                  className="group inline-flex h-12 items-center justify-between gap-2 rounded-full px-5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
                  style={{ background: `var(--${color})` }}
                >
                  Visit live site
                  <ArrowUpRightIcon size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </SmartLink>
              )}
              {urls.github && (
                <SmartLink
                  href={urls.github}
                  label={`${p.name} source on GitHub`}
                  className="inline-flex h-12 items-center justify-between gap-2 rounded-full border border-line px-5 text-sm font-semibold transition-colors hover:bg-fg/10"
                >
                  Source code <GitHubIcon size={16} />
                </SmartLink>
              )}
            </div>
          )}

          <h2 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-widest text-muted">Stack</h2>
          <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
            {p.stack.map((t) => (
              <li key={t} className="rounded-full border border-line px-3 py-1 text-xs font-semibold">
                {t}
              </li>
            ))}
            {p.stackPlaceholder && (
              <li className="rounded-full border border-dashed border-coral px-3 py-1 text-xs font-semibold text-coral">[ADD TECH STACK]</li>
            )}
          </ul>

          <nav aria-label="On this page" className="mt-10 hidden lg:block">
            <ol className="relative border-l border-line">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? "location" : undefined}
                    className={`relative -ml-px block border-l-2 py-1.5 pl-4 text-sm font-medium transition-colors ${
                      active === s.id ? "text-fg" : "border-transparent text-muted hover:text-fg"
                    }`}
                    style={active === s.id ? { borderColor: `var(--${color})` } : undefined}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0 space-y-24">
          {p.overview && (
            <section aria-labelledby="overview">
              <SectionTitle id="overview">Overview</SectionTitle>
              <div className="max-w-3xl space-y-5">
                {p.overview.map((t, i) => (
                  <Reveal key={t} delay={i * 0.06}>
                    <p className={i === 0 ? "font-display text-2xl font-semibold leading-snug sm:text-3xl" : "text-lg leading-relaxed text-muted"}>{t}</p>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {p.screens && (
            <section aria-labelledby="tour">
              <SectionTitle id="tour">Product tour</SectionTitle>
              <Reveal>
                <ProductTour screens={p.screens} color={color} />
              </Reveal>
              {p.screensNote && <p className="mt-6 text-sm text-muted">{p.screensNote}</p>}
            </section>
          )}

          <section aria-labelledby="highlights">
            <SectionTitle id="highlights">Highlights</SectionTitle>
            <ol>
              {p.points.map((pt, i) => (
                <Reveal key={pt} delay={i * 0.04}>
                  <li className="flex gap-5 border-t border-line py-6 last:border-b sm:gap-8">
                    <span className="font-display text-2xl font-bold tabular-nums" style={{ color: `var(--${color})` }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-lg font-medium leading-relaxed">{pt}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </section>

          {p.features && (
            <section aria-labelledby="inside">
              <SectionTitle id="inside">What&apos;s inside</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {p.features.map((f, i) => (
                  <Reveal key={f.title} delay={(i % 2) * 0.07}>
                    <Tilt className="h-full">
                      <div className="h-full rounded-3xl border border-line p-6">
                        <h3 className="font-display flex items-center gap-3 text-xl font-bold leading-tight">
                          <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: `var(--${color})` }} />
                          {f.title}
                        </h3>
                        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{f.body}</p>
                      </div>
                    </Tilt>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {p.stats && (
            <section aria-labelledby="numbers">
              <SectionTitle id="numbers">Numbers</SectionTitle>
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {p.stats.map((s, i) => (
                  <Reveal key={s.label} delay={i * 0.06}>
                    <Tilt className="h-full">
                      <div className="flex h-full flex-col-reverse justify-end gap-2 rounded-3xl p-6 text-ink" style={{ background: `var(--${i < 3 ? color : "sky"})` }}>
                        <span className="text-sm font-medium leading-snug">{s.label}</span>
                        <span className="font-display text-4xl font-bold sm:text-5xl">
                          <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                        </span>
                      </div>
                    </Tilt>
                  </Reveal>
                ))}
              </div>
              {p.statsNote && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{p.statsNote}</p>}
            </section>
          )}

          {p.flows && (
            <section aria-labelledby="flows">
              <SectionTitle id="flows">How it flows</SectionTitle>
              <div className="space-y-8">
                {p.flows.map((f) => (
                  <Reveal key={f.title}>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted">{f.title}</h3>
                    <PulseFlow steps={f.steps} fill={`var(--${color})`} idleClass="border border-line bg-surface" label={f.title} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {p.challenges && (
            <section aria-labelledby="problems">
              <SectionTitle id="problems">Problems I ran into</SectionTitle>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {p.challenges.map((c, i) => (
                  <Reveal key={c.title} delay={(i % 2) * 0.07}>
                    <Tilt className="h-full">
                      <div className="h-full rounded-3xl border border-line p-7">
                        <span className="font-display text-sm font-bold" style={{ color: `var(--${color})` }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display mt-3 text-2xl font-bold leading-tight">{c.title}</h3>
                        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{c.body}</p>
                      </div>
                    </Tilt>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {p.decisions && (
            <section aria-labelledby="decisions">
              <SectionTitle id="decisions">Decisions</SectionTitle>
              <dl>
                {p.decisions.map((d, i) => (
                  <Reveal key={d.q} delay={i * 0.05}>
                    <div className="grid grid-cols-1 gap-3 border-t border-line py-7 last:border-b md:grid-cols-[15rem_1fr] md:gap-10">
                      <dt className="font-display text-xl font-bold leading-snug">{d.q}</dt>
                      <dd className="leading-relaxed text-muted">{d.a}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>

      {/* Next project */}
      <TransitionLink
        href={`/work/${next.slug}`}
        label={next.name}
        color={next.color}
        data-cursor="Next"
        className="group relative block overflow-hidden py-20 text-ink sm:py-28"
        style={{ background: `var(--${next.color})` }}
      >
        <div className="container-page flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest opacity-70">Next project</p>
            <p className="font-display mt-4 text-[clamp(2.5rem,9vw,8rem)] font-extrabold leading-[0.95] transition-transform duration-500 group-hover:translate-x-4">
              {next.name}
            </p>
          </div>
          <span aria-hidden className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-ink text-[#f4f1ea] transition-transform duration-300 group-hover:-rotate-45 sm:h-24 sm:w-24">
            <ArrowRightIcon size={36} />
          </span>
        </div>
      </TransitionLink>
    </article>
  );
}
