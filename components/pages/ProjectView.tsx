"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { ChapterNav } from "@/components/project/ChapterNav";
import { ProjectHero } from "@/components/project/ProjectHero";
import { StackedScreens } from "@/components/project/StackedScreens";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowRightIcon, ArrowUpRightIcon, GitHubIcon, PlusIcon } from "@/components/ui/Icons";
import { CountUp } from "@/components/ui/CountUp";
import { PulseFlow } from "@/components/ui/PulseFlow";
import { SmartLink } from "@/components/ui/SmartLink";
import { VelocityMarquee } from "@/components/ui/VelocityMarquee";
import { WordReveal } from "@/components/ui/WordReveal";
import { getProjectUrls, type Project } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** A numbered chapter: sticky title on the left, content on the right. */
function Chapter({ id, n, title, color, children }: { id: string; n: number; title: string; color: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-4 border-t border-line py-20 sm:py-28">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="font-display text-sm font-bold tabular-nums" style={{ color: `var(--${color})` }}>
                {String(n).padStart(2, "0")}
              </p>
              <h2 id={`${id}-h`} className="font-display mt-3 text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl">
                {title}
              </h2>
            </Reveal>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

function Problems({ items, color }: { items: NonNullable<Project["challenges"]>; color: string }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className="border-t border-line">
      {items.map((c, i) => {
        const on = open === i;
        return (
          <li key={c.title} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setOpen(on ? -1 : i)}
                className="group flex w-full items-center gap-5 py-6 text-left"
              >
                <span className="font-display w-8 shrink-0 text-sm font-bold tabular-nums" style={{ color: `var(--${color})` }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display flex-1 text-2xl font-bold leading-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">
                  {c.title}
                </span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: on ? 135 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line"
                >
                  <PlusIcon size={18} />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-8 pl-[3.25rem] leading-relaxed text-muted">{c.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

export function ProjectView({ project: p, next }: { project: Project; next: Project }) {
  const urls = getProjectUrls(p.slug);
  const color = p.color;
  const shots = (p.screens ?? []).filter((s) => !s.video);
  const lead = p.overview?.[0] ?? p.tagline;
  const rest = p.overview?.slice(1) ?? [];

  const meta = [
    p.role && { k: "Role", v: p.role },
    p.period && { k: "When", v: p.period },
    { k: "Type", v: p.kind },
  ].filter(Boolean) as { k: string; v: string }[];

  const chapters = [
    { id: "overview", label: "Overview" },
    shots.length > 0 && { id: "product", label: "Product" },
    { id: "highlights", label: "Highlights" },
    p.features && { id: "inside", label: "Inside" },
    p.stats && { id: "numbers", label: "Numbers" },
    p.architecture && { id: "platform", label: "Platform" },
    p.flows && { id: "flows", label: "Flows" },
    p.challenges && { id: "problems", label: "Problems" },
    p.decisions && { id: "decisions", label: "Decisions" },
  ].filter(Boolean) as { id: string; label: string }[];
  const num = (id: string) => chapters.findIndex((c) => c.id === id) + 1;

  const pill = "inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:-translate-y-0.5";

  return (
    <article>
      <ProjectHero project={p} />
      <ChapterNav chapters={chapters} color={color} />

      {/* Overview */}
      <Chapter id="overview" n={num("overview")} title="Overview" color={color}>
        <WordReveal text={lead} className="font-display text-3xl font-semibold leading-[1.15] sm:text-4xl lg:text-[2.6rem]" />
        {rest.map((t, i) => (
          <Reveal key={t} delay={i * 0.06} className="mt-6 max-w-2xl">
            <p className="text-lg leading-relaxed text-muted">{t}</p>
          </Reveal>
        ))}

        <Reveal className="mt-12">
          <dl className="grid grid-cols-1 border-y border-line sm:grid-cols-3">
            {meta.map((m, i) => (
              <div key={m.k} className={`flex flex-col-reverse gap-1 border-line py-5 ${i > 0 ? "sm:border-l sm:pl-6" : ""}`}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{m.k}</dt>
                <dd className="font-semibold">{m.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-10">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">Stack</h3>
          <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
            {p.stack.map((t) => (
              <li key={t} className="rounded-full border border-line px-4 py-1.5 text-sm font-medium transition-colors hover:border-fg/50">
                {t}
              </li>
            ))}
            {p.stackPlaceholder && (
              <li className="rounded-full border border-dashed border-coral px-4 py-1.5 text-sm font-medium text-coral">[ADD TECH STACK]</li>
            )}
          </ul>
        </Reveal>

        {(urls.live || urls.github) && (
          <Reveal className="mt-10 flex flex-wrap gap-3">
            {urls.live && (
              <SmartLink href={urls.live} label={`${p.name} live site`} className={`${pill} text-ink`} style={{ background: `var(--${color})` }}>
                <ArrowUpRightIcon size={16} /> Visit live site
              </SmartLink>
            )}
            {urls.github && (
              <SmartLink href={urls.github} label={`${p.name} source on GitHub`} className={`${pill} border border-line hover:bg-fg/10`}>
                <GitHubIcon size={16} /> Source code
              </SmartLink>
            )}
          </Reveal>
        )}
      </Chapter>

      {/* Product: pinned deck of screens */}
      {shots.length > 0 && (
        <section id="product" aria-labelledby="product-h" className="scroll-mt-4 border-t border-line pt-20 sm:pt-28">
          <div className="container-page">
            <Reveal>
              <p className="font-display text-sm font-bold tabular-nums" style={{ color: `var(--${color})` }}>
                {String(num("product")).padStart(2, "0")}
              </p>
              <h2 id="product-h" className="font-display mt-3 text-4xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
                The product
              </h2>
              {p.screensNote && <p className="mt-4 max-w-xl text-muted">{p.screensNote}</p>}
            </Reveal>
          </div>
          <div className="mt-10">
            <StackedScreens shots={shots} color={color} />
          </div>
        </section>
      )}

      <Chapter id="highlights" n={num("highlights")} title="Highlights" color={color}>
        <ol>
          {p.points.map((pt, i) => (
            <Reveal key={pt} delay={i * 0.04}>
              <li className="group grid grid-cols-[2.5rem_1fr] gap-4 border-t border-line py-7 transition-colors last:border-b hover:border-fg/40">
                <span className="font-display text-lg font-bold tabular-nums" style={{ color: `var(--${color})` }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-xl font-medium leading-snug transition-transform duration-500 group-hover:translate-x-1.5 sm:text-2xl">{pt}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Chapter>

      {p.features && (
        <Chapter id="inside" n={num("inside")} title="What's inside" color={color}>
          <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
            {p.features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 2) * 0.06}>
                <div className="h-full border-b border-r border-line p-7 transition-colors hover:bg-fg/[0.03]">
                  <h3 className="font-display text-xl font-bold leading-tight">{f.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Chapter>
      )}

      {p.stats && (
        <Chapter id="numbers" n={num("numbers")} title="Numbers" color={color}>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
            {p.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05} className="min-w-0">
                {/* Each cell is its own size container, so the numeral scales to the width it is given */}
                <div className="flex flex-col-reverse gap-3 border-t border-line pt-5" style={{ containerType: "inline-size" }}>
                  <dt className="text-sm leading-snug text-muted">{s.label}</dt>
                  <dd
                    className="font-display font-extrabold leading-none tracking-tight"
                    style={{ color: `var(--${color})`, fontSize: "clamp(2.25rem, 21cqw, 4.5rem)" }}
                  >
                    <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
          {p.statsNote && <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">{p.statsNote}</p>}
        </Chapter>
      )}

      {p.architecture && (
        <Chapter id="platform" n={num("platform")} title="How the platform works" color={color}>
          {p.architectureNote && (
            <Reveal className="mb-10">
              <p className="rounded-2xl border border-line px-5 py-4 text-sm leading-relaxed text-muted">
                <span className="font-semibold text-fg">A note on attribution. </span>
                {p.architectureNote}
              </p>
            </Reveal>
          )}
          <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
            {p.architecture.map((a, i) => (
              <Reveal key={a.title} delay={(i % 2) * 0.06}>
                <div className="h-full border-b border-r border-line p-7 transition-colors hover:bg-fg/[0.03]">
                  <h3 className="font-display text-xl font-bold leading-tight">{a.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{a.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Chapter>
      )}

      {p.flows && (
        <Chapter id="flows" n={num("flows")} title="How it flows" color={color}>
          <div className="space-y-10">
            {p.flows.map((f) => (
              <Reveal key={f.title}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">{f.title}</h3>
                <PulseFlow steps={f.steps} fill={`var(--${color})`} idleClass="border border-line" label={f.title} />
              </Reveal>
            ))}
          </div>
        </Chapter>
      )}

      {p.challenges && (
        <Chapter id="problems" n={num("problems")} title="Problems I ran into" color={color}>
          <Problems items={p.challenges} color={color} />
        </Chapter>
      )}

      {p.decisions && (
        <Chapter id="decisions" n={num("decisions")} title="Decisions" color={color}>
          <dl>
            {p.decisions.map((d, i) => (
              <Reveal key={d.q} delay={i * 0.05}>
                <div className="grid grid-cols-1 gap-3 border-t border-line py-7 last:border-b md:grid-cols-[14rem_1fr] md:gap-10">
                  <dt className="font-display text-xl font-bold leading-snug">{d.q}</dt>
                  <dd className="leading-relaxed text-muted">{d.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Chapter>
      )}

      {/* Next project */}
      <TransitionLink
        href={`/work/${next.slug}`}
        label={next.name}
        color={next.color}
        data-cursor="Next"
        className="group relative block overflow-hidden py-16 text-ink sm:py-24"
        style={{ background: `var(--${next.color})` }}
      >
        <div className="container-page mb-6 flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-70">Next project</p>
          <span aria-hidden className="grid h-14 w-14 place-items-center rounded-full bg-ink text-[#f4f1ea] transition-transform duration-300 group-hover:-rotate-45 group-hover:scale-110">
            <ArrowRightIcon size={26} />
          </span>
        </div>
        <span className="sr-only">{next.name}</span>
        <VelocityMarquee speed={-4}>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} aria-hidden className="font-display mr-12 whitespace-nowrap text-[clamp(4rem,13vw,12rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
              {next.name}
              <span className="mx-10 inline-block h-[0.14em] w-[0.14em] rounded-full bg-ink align-middle" />
            </span>
          ))}
        </VelocityMarquee>
      </TransitionLink>
    </article>
  );
}
