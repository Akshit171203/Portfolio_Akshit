"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useState, type ReactNode } from "react";
import { ChapterNav } from "@/components/project/ChapterNav";
import { ProjectHero } from "@/components/project/ProjectHero";
import { Showreel } from "@/components/project/Showreel";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowRightIcon, ArrowUpRightIcon, GitHubIcon, PlusIcon } from "@/components/ui/Icons";
import { CountUp } from "@/components/ui/CountUp";
import { PulseFlow } from "@/components/ui/PulseFlow";
import { SmartLink } from "@/components/ui/SmartLink";
import { VelocityMarquee } from "@/components/ui/VelocityMarquee";
import { WordReveal } from "@/components/ui/WordReveal";
import { getProjectUrls, projects, type Project } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

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

/** Full-width section header: a numbered pill and a big title. */
function Head({ n, title, id, color, tone = "text-fg" }: { n: number; title: string; id: string; color: string; tone?: string }) {
  return (
    <div className="mb-12 sm:mb-16">
      <Reveal>
        <span
          aria-hidden
          className="grid h-7 min-w-7 w-fit place-items-center rounded-full px-2 text-xs font-bold tabular-nums text-ink"
          style={{ background: `var(--${color})`, boxShadow: tone === "text-ink" ? "0 0 0 2px var(--ink)" : undefined }}
        >
          {pad(n)}
        </span>
        <h2 id={id} className={`font-display mt-5 text-5xl font-extrabold leading-[0.9] tracking-tight sm:text-7xl ${tone}`}>
          {title}
        </h2>
      </Reveal>
    </div>
  );
}

function Section({ id, className = "", children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`scroll-mt-4 py-24 sm:py-32 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

/** Row sizes (out of 4 columns) that always fill complete rows, for any number of tiles. */
function bentoSpans(count: number): number[] {
  const cycle = [
    [2, 1, 1],
    [1, 2, 1],
    [1, 1, 2],
  ];
  const out: number[] = [];
  let left = count;
  let c = 0;
  while (left >= 3) {
    out.push(...cycle[c++ % 3]);
    left -= 3;
  }
  if (left === 2) out.push(2, 2);
  if (left === 1) out.push(4);
  return out;
}

const SPAN: Record<number, string> = { 1: "", 2: "md:col-span-2", 4: "md:col-span-2 lg:col-span-4" };

function Bento({ items, color }: { items: { title: string; body: string }[]; color: string }) {
  const spans = bentoSpans(items.length);
  const tones = [
    { cls: "text-ink", style: { background: `var(--${color})` } },
    { cls: "bg-surface", style: undefined },
    { cls: "border border-line", style: undefined },
    { cls: "bg-[#141412] text-[#f3f0e8]", style: undefined },
  ];
  return (
    <div className="grid grid-flow-dense grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((f, i) => {
        const t = tones[i % tones.length];
        const muted = i % 4 === 1 || i % 4 === 2 ? "text-muted" : "opacity-75";
        const wide = spans[i] > 1;
        return (
          <Reveal key={f.title} delay={(i % 4) * 0.05} className={SPAN[spans[i]]}>
            <div
              className={`relative flex h-full min-h-[14rem] flex-col justify-end overflow-hidden rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-8 ${t.cls}`}
              style={t.style}
            >
              {/* a big ghost numeral fills the space above the text on purpose */}
              <span
                aria-hidden
                className="font-display pointer-events-none absolute -right-2 -top-4 select-none font-extrabold leading-none tabular-nums opacity-[0.12] sm:-top-6"
                style={{ fontSize: wide ? "clamp(9rem, 17vw, 15rem)" : "clamp(7rem, 11vw, 10rem)" }}
              >
                {pad(i + 1)}
              </span>
              <h3 className={`font-display relative font-bold leading-[1.05] ${wide ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"}`}>{f.title}</h3>
              <p className={`relative mt-4 leading-relaxed ${wide ? "max-w-xl text-lg" : "text-[0.9375rem]"} ${muted}`}>{f.body}</p>
            </div>
          </Reveal>
        );
      })}
    </div>
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
              <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)} className="group flex w-full items-center gap-5 py-6 text-left">
                <span className="font-display w-8 shrink-0 text-sm font-bold tabular-nums" style={{ color: `var(--${color})` }}>
                  {pad(i + 1)}
                </span>
                <span className="font-display flex-1 text-2xl font-bold leading-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">{c.title}</span>
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
  const index = projects.findIndex((x) => x.slug === p.slug);
  const shots = (p.screens ?? []).filter((s) => !s.video);
  const lead = p.overview?.[0] ?? p.tagline;
  const rest = p.overview?.slice(1) ?? [];

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });

  const chapters = [
    { id: "overview", label: "Story" },
    shots.length > 0 && { id: "product", label: "Product" },
    { id: "highlights", label: "Highlights" },
    p.features && { id: "inside", label: "Inside" },
    p.stats && { id: "numbers", label: "Numbers" },
    p.architecture && { id: "platform", label: "Built on" },
    p.flows && { id: "flows", label: "Flows" },
    p.challenges && { id: "problems", label: "Problems" },
    p.decisions && { id: "decisions", label: "Decisions" },
  ].filter(Boolean) as { id: string; label: string }[];
  const num = (id: string) => chapters.findIndex((c) => c.id === id) + 1;

  const pill = "inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:-translate-y-0.5";
  const stack = [...p.stack, ...(p.stackPlaceholder ? ["[ADD TECH STACK]"] : [])];

  const specs = [
    p.role && { k: "Role", v: p.role },
    p.period && { k: "When", v: p.period },
    { k: "Type", v: p.kind },
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <article>
      <motion.div aria-hidden style={{ scaleX: progress, background: `var(--${color})` }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left" />
      <ProjectHero project={p} index={index} total={projects.length} />
      <ChapterNav chapters={chapters} color={color} />

      {/* Story */}
      <Section id="overview" className="pt-20 sm:pt-28">
        <dl className="mb-20 grid grid-cols-1 gap-8 border-b border-line pb-12 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr]">
          {specs.map((s) => (
            <Reveal key={s.k}>
              <div className="flex flex-col-reverse gap-2">
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{s.k}</dt>
                <dd className="text-lg font-semibold leading-snug">{s.v}</dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <h2 id="overview-h" className="sr-only">
          Story
        </h2>
        <WordReveal text={lead} className="font-display max-w-5xl text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.6rem]" />
        {rest.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-14">
            {rest.map((t, i) => (
              <Reveal key={t} delay={i * 0.08}>
                <p className="text-lg leading-relaxed text-muted">{t}</p>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      {/* Stack as a ticker */}
      <div className="overflow-hidden py-6 text-ink" style={{ background: `var(--${color})` }} aria-label={`Stack: ${stack.join(", ")}`}>
        <VelocityMarquee speed={-3}>
          {Array.from({ length: 2 }, (_, k) =>
            stack.map((t) => (
              <span key={`${k}-${t}`} aria-hidden className="font-display flex items-center whitespace-nowrap text-3xl font-extrabold tracking-tight sm:text-5xl">
                {t}
                <span className="mx-8 text-2xl sm:mx-12 sm:text-4xl">✦</span>
              </span>
            )),
          )}
        </VelocityMarquee>
      </div>

      {/* Product */}
      {shots.length > 0 && <Showreel shots={shots} color={color} note={p.screensNote} />}

      {/* Highlights */}
      <Section id="highlights">
        <Head n={num("highlights")} id="highlights-h" title="Highlights" color={color} />
        <ol className="border-t border-line">
          {p.points.map((pt, i) => (
            <Reveal key={pt}>
              <li className="group relative overflow-hidden border-b border-line">
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100"
                  style={{ background: `var(--${color})` }}
                />
                <div className="relative grid grid-cols-[2.5rem_1fr] gap-4 px-2 py-8 transition-colors duration-300 group-hover:text-ink sm:grid-cols-[4rem_1fr] sm:px-6 sm:py-10">
                  <span className="font-display text-lg font-bold tabular-nums opacity-50">{pad(i + 1)}</span>
                  <p className="text-xl font-medium leading-snug transition-transform duration-500 group-hover:translate-x-2 sm:text-2xl lg:text-[1.7rem]">{pt}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        {(urls.live || urls.github) && (
          <Reveal className="mt-12 flex flex-wrap gap-3">
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
      </Section>

      {/* Inside */}
      {p.features && (
        <Section id="inside" className="pt-0 sm:pt-0">
          <Head n={num("inside")} id="inside-h" title="What's inside" color={color} />
          <Bento items={p.features} color={color} />
        </Section>
      )}

      {/* Numbers */}
      {p.stats && (
        <section id="numbers" aria-labelledby="numbers-h" className="scroll-mt-4 py-24 text-ink sm:py-32" style={{ background: `var(--${color})` }}>
          <div className="container-page">
            <Head n={num("numbers")} id="numbers-h" title="By the numbers" color={color} tone="text-ink" />
            <dl className="grid grid-cols-2 lg:grid-cols-4 [&>*]:border-t [&>*]:border-ink/25 lg:[&>*:not(:first-child)]:border-l lg:[&>*]:pl-6 lg:[&>*:first-child]:pl-0">
              {p.stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.06} className="min-w-0 py-6 pr-4 lg:py-10">
                  <div className="flex flex-col-reverse gap-3" style={{ containerType: "inline-size" }}>
                    <dt className="text-sm font-medium leading-snug opacity-75">{s.label}</dt>
                    <dd className="font-display font-extrabold leading-none tracking-tight" style={{ fontSize: "clamp(2.5rem, 24cqw, 6rem)" }}>
                      <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
            {p.statsNote && <p className="mt-10 max-w-2xl text-sm leading-relaxed opacity-75">{p.statsNote}</p>}
          </div>
        </section>
      )}

      {/* Built on */}
      {p.architecture && (
        <Section id="platform">
          <Head n={num("platform")} id="platform-h" title="What it's built on" color={color} />
          {p.architectureNote && (
            <Reveal className="mb-10">
              <p className="max-w-3xl rounded-2xl border border-line px-5 py-4 text-sm leading-relaxed text-muted">
                <span className="font-semibold text-fg">A note on attribution. </span>
                {p.architectureNote}
              </p>
            </Reveal>
          )}
          <div className="grid grid-cols-1 border-l border-t border-line md:grid-cols-2">
            {p.architecture.map((a, i) => (
              <Reveal key={a.title} delay={(i % 2) * 0.06}>
                <div className="h-full border-b border-r border-line p-7 transition-colors hover:bg-fg/[0.03] sm:p-9">
                  <p className="font-display text-sm font-bold tabular-nums" style={{ color: `var(--${color})` }}>
                    {pad(i + 1)}
                  </p>
                  <h3 className="font-display mt-4 text-2xl font-bold leading-tight">{a.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{a.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Flows */}
      {p.flows && (
        <section id="flows" aria-labelledby="flows-h" className="scroll-mt-4 bg-[#141412] py-24 text-[#f3f0e8] sm:py-32">
          <div className="container-page">
            <Head n={num("flows")} id="flows-h" title="How it flows" color={color} />
            <div className="space-y-12">
              {p.flows.map((f) => (
                <Reveal key={f.title}>
                  <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">{f.title}</h3>
                  <PulseFlow steps={f.steps} fill={`var(--${color})`} idleClass="border border-white/20" label={f.title} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Problems and decisions */}
      {p.challenges && (
        <Section id="problems">
          <Head n={num("problems")} id="problems-h" title="Problems I ran into" color={color} />
          <Problems items={p.challenges} color={color} />
        </Section>
      )}

      {p.decisions && (
        <Section id="decisions" className={p.challenges ? "pt-0 sm:pt-0" : ""}>
          <Head n={num("decisions")} id="decisions-h" title="Decisions" color={color} />
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {p.decisions.map((d, i) => (
              <Reveal key={d.q} delay={(i % 2) * 0.06}>
                <div className="h-full rounded-3xl bg-surface p-7 sm:p-9">
                  <span aria-hidden className="block h-1 w-12 rounded-full" style={{ background: `var(--${color})` }} />
                  <dt className="font-display mt-6 text-2xl font-bold leading-snug">{d.q}</dt>
                  <dd className="mt-3 leading-relaxed text-muted">{d.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Section>
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
