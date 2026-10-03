"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowDownIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/Icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { SmartLink } from "@/components/ui/SmartLink";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { isPlaceholder } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Tech chips that float around the deck. `top`/`left` are inside the deck box. */
const chips = [
  { label: "React", color: "bg-sky", top: "-4%", left: "62%", depth: 38 },
  { label: "TypeScript", color: "bg-lilac", top: "52%", left: "-12%", depth: 52 },
  { label: "Node.js", color: "bg-mint", top: "88%", left: "66%", depth: 30 },
  { label: "AI", color: "bg-coral", top: "14%", left: "-6%", depth: 60 },
];

/** Where each card in the deck sits (percent of the deck box), its tilt, and how far it drifts with the cursor. */
const layout = [
  { x: 0, y: 0, rot: -7, depth: 14 },
  { x: 13, y: 22, rot: -1, depth: 26 },
  { x: 26, y: 44, rot: 5, depth: 40 },
];

function Chip({ chip, index, mx, my }: { chip: (typeof chips)[number]; index: number; mx: MotionValue<number>; my: MotionValue<number> }) {
  const x = useTransform(mx, (v) => v * chip.depth);
  const y = useTransform(my, (v) => v * chip.depth);
  return (
    <motion.div
      style={{ x, y, top: chip.top, left: chip.left }}
      className="absolute z-20"
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.1 + index * 0.09, type: "spring", stiffness: 220, damping: 14 }}
    >
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, index % 2 ? 3 : -3, 0] }}
        transition={{ duration: 4 + index * 0.6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.15, rotate: -6 }}
        className={`rounded-full px-5 py-2.5 font-display text-lg font-semibold text-ink shadow-[0_8px_0_0_rgb(0_0_0/0.18)] ${chip.color}`}
      >
        {chip.label}
      </motion.div>
    </motion.div>
  );
}

/** A fanned stack of real project screenshots. It drifts with the cursor, and each card links to its case study. */
function Deck({ mx, my }: { mx: MotionValue<number>; my: MotionValue<number> }) {
  const picks = projects
    .slice(0, 3)
    .map((p) => ({ p, shot: p.screens?.find((s) => !s.video) ?? p.screens?.[0] }))
    .filter((x) => x.shot);

  return (
    <div className="relative hidden h-[min(28rem,58vh)] w-full max-w-[26rem] lg:block">
      {picks.map(({ p, shot }, i) => (
        <DeckCard key={p.slug} index={i} mx={mx} my={my}>
          <TransitionLink
            href={`/work/${p.slug}`}
            label={p.name}
            color={p.color}
            data-cursor="View"
            className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#141412] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]"
          >
            <span className="flex items-center gap-2 px-3.5 py-2.5" aria-hidden>
              <span className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#ff6b4a]" />
                <span className="h-2 w-2 rounded-full bg-[#ffd75e]" />
                <span className="h-2 w-2 rounded-full bg-[#86e3b5]" />
              </span>
              <span className="ml-auto rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold text-ink" style={{ background: `var(--${p.color})` }}>
                {p.name}
              </span>
            </span>
            <span className="relative block aspect-[16/10] bg-black">
              <Image src={shot!.src} alt={`${p.name}: ${shot!.caption}`} fill priority={i === 2} sizes="360px" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
            </span>
          </TransitionLink>
        </DeckCard>
      ))}
      {chips.map((c, i) => (
        <Chip key={c.label} chip={c} index={i} mx={mx} my={my} />
      ))}
    </div>
  );
}

function DeckCard({ index, mx, my, children }: { index: number; mx: MotionValue<number>; my: MotionValue<number>; children: React.ReactNode }) {
  const l = layout[index];
  const x = useTransform(mx, (v) => v * l.depth);
  const y = useTransform(my, (v) => v * l.depth);
  return (
    <motion.div
      style={{ x, y, left: `${l.x}%`, top: `${l.y}%`, zIndex: index + 1 }}
      className="absolute w-[72%]"
      initial={{ opacity: 0, y: 80, rotate: l.rot + 8 }}
      animate={{ opacity: 1, rotate: l.rot }}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
      transition={{ delay: 0.5 + index * 0.12, duration: 0.9, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function RevealLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em] lg:whitespace-nowrap">
      <motion.span className="block" initial={{ y: "115%", rotate: 4 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 0.9, delay, ease: EASE }}>
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const spotX = useSpring(useMotionValue(-400), { stiffness: 120, damping: 24 });
  const spotY = useSpring(useMotionValue(-400), { stiffness: 120, damping: 24 });
  const spot = useMotionTemplate`radial-gradient(520px circle at ${spotX}px ${spotY}px, var(--spot), transparent 65%)`;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const deckY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const emailHref = isPlaceholder(site.email) ? site.email : `mailto:${site.email}`;
  const icon = "grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:bg-fg hover:text-bg";

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh items-center overflow-hidden pb-24 pt-32"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
        spotX.set(e.clientX - r.left);
        spotY.set(e.clientY - r.top);
      }}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spot }} />

      <div className="container-page relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <motion.div className="lg:col-span-8" style={{ y: textY, opacity: textOpacity }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line px-4 py-2 text-sm font-medium"
          >
            <span className="relative flex h-2.5 w-2.5">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-lime"
                animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
            </span>
            {site.name} · {site.role} at {site.company}
          </motion.p>

          <h1 id="hero-title" className="font-display text-[clamp(2rem,3.9vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
            <RevealLine delay={0.15}>Building scalable products</RevealLine>
            <RevealLine delay={0.27}>at the intersection of</RevealLine>
            <RevealLine delay={0.39}>
              software engineering{" "}
              <motion.span className="relative inline-block" animate={{ rotate: [0, -4, 3, 0] }} transition={{ delay: 1.4, duration: 1.2, ease: "easeInOut" }}>
                <span className="relative z-10 rounded-[0.2em] bg-lime px-[0.18em] text-ink">& AI</span>
              </motion.span>
            </RevealLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
            className="mt-7 max-w-lg text-lg leading-relaxed text-muted"
          >
            Full Stack Software Engineer building production-ready web applications with React, Next.js, TypeScript, Node.js, PostgreSQL and modern AI technologies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <TransitionLink href="/work" label="Work" color="lime" className="inline-flex h-12 items-center gap-2 rounded-full bg-fg px-7 text-[0.9375rem] font-semibold text-bg">
                View Work <ArrowDownIcon size={16} className="-rotate-90" />
              </TransitionLink>
            </Magnetic>
            <Magnetic>
              <TransitionLink href="/contact" label="Contact" color="coral" className="inline-flex h-12 items-center rounded-full border border-line px-7 text-[0.9375rem] font-semibold transition-colors hover:bg-fg/10">
                Let’s Connect
              </TransitionLink>
            </Magnetic>
            <span aria-hidden className="mx-1 hidden h-8 w-px bg-line sm:block" />
            <SmartLink href={site.github} label="GitHub" className={icon}><GitHubIcon /></SmartLink>
            <SmartLink href={site.linkedin} label="LinkedIn" className={icon}><LinkedInIcon /></SmartLink>
            <SmartLink href={emailHref} label="Email" className={icon}><MailIcon /></SmartLink>
          </motion.div>
        </motion.div>

        {/* Decorative fan of real screenshots; each card is also a link to its case study. */}
        <motion.div className="flex w-full justify-end lg:col-span-4" style={{ y: deckY }}>
          <Deck mx={mx} my={my} />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        aria-hidden
        className="container-page absolute inset-x-0 bottom-7 mx-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted"
      >
        Scroll
        <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDownIcon size={14} />
        </motion.span>
      </motion.p>
    </section>
  );
}
