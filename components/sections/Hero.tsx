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
import { useRef } from "react";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowDownIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/Icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { SmartLink } from "@/components/ui/SmartLink";
import { site } from "@/data/site";
import { isPlaceholder } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const chips = [
  { label: "React", color: "bg-sky", top: "6%", left: "4%", depth: 38 },
  { label: "Next.js", color: "bg-fg text-bg", top: "0%", left: "46%", depth: 24 },
  { label: "TypeScript", color: "bg-lilac", top: "38%", left: "20%", depth: 52 },
  { label: "Node.js", color: "bg-mint", top: "34%", left: "68%", depth: 30 },
  { label: "PostgreSQL", color: "bg-butter", top: "78%", left: "2%", depth: 44 },
  { label: "AI", color: "bg-coral", top: "72%", left: "50%", depth: 60 },
];

function Chip({ chip, index, mx, my }: { chip: (typeof chips)[number]; index: number; mx: MotionValue<number>; my: MotionValue<number> }) {
  const x = useTransform(mx, (v) => v * chip.depth);
  const y = useTransform(my, (v) => v * chip.depth);
  return (
    <motion.div
      style={{ x, y, top: chip.top, left: chip.left }}
      className="absolute"
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9 + index * 0.09, type: "spring", stiffness: 220, damping: 14 }}
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

function RevealLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <motion.span
        className="block"
        initial={{ y: "115%", rotate: 4 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
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
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const chipsY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  const emailHref = isPlaceholder(site.email) ? site.email : `mailto:${site.email}`;
  const icon = "grid h-12 w-12 place-items-center rounded-full border border-line transition-colors hover:bg-fg hover:text-bg";

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh items-center overflow-hidden pb-20 pt-32"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
        spotX.set(e.clientX - r.left);
        spotY.set(e.clientY - r.top);
      }}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spot }} />

      <motion.div className="container-page relative" style={{ y: textY, opacity: textOpacity }}>
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

        <h1 id="hero-title" className="font-display text-[clamp(1.8rem,6.2vw,5.75rem)] font-bold leading-[1]">
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
          className="mt-8 max-w-xl text-lg leading-relaxed text-muted"
        >
          Full Stack Software Engineer building production-ready web applications with React, Next.js,
          TypeScript, Node.js, PostgreSQL and modern AI technologies.
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
            <a href={site.resume} download className="inline-flex h-12 items-center rounded-full border border-line px-7 text-[0.9375rem] font-semibold transition-colors hover:bg-fg/10">
              Download Resume
            </a>
          </Magnetic>
          <Magnetic>
            <TransitionLink href="/contact" label="Contact" color="coral" className="inline-flex h-12 items-center rounded-full px-5 text-[0.9375rem] font-semibold underline decoration-coral decoration-2 underline-offset-[6px]">
              Let’s Connect
            </TransitionLink>
          </Magnetic>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-7 flex gap-2">
          <SmartLink href={site.github} label="GitHub" className={icon}><GitHubIcon /></SmartLink>
          <SmartLink href={site.linkedin} label="LinkedIn" className={icon}><LinkedInIcon /></SmartLink>
          <SmartLink href={emailHref} label="Email" className={icon}><MailIcon /></SmartLink>
        </motion.div>
      </motion.div>

      {/* Floating stack: decorative, hidden from assistive tech and small screens. */}
      <motion.div aria-hidden style={{ y: chipsY }} className="absolute bottom-16 right-8 hidden h-[15rem] w-[30rem] lg:block">
        {chips.map((c, i) => (
          <Chip key={c.label} chip={c} index={i} mx={mx} my={my} />
        ))}
      </motion.div>

      {/* Scroll cue: rotating text ring */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 hidden h-28 w-28 -translate-x-1/2 md:block"
      >
        <motion.svg viewBox="0 0 120 120" className="h-full w-full" animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }}>
          <defs>
            <path id="ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
          </defs>
          <text className="fill-current text-[10px] font-semibold uppercase">
            <textPath href="#ring" textLength="274" lengthAdjust="spacing">Scroll · Full Stack · AI · Scroll · </textPath>
          </text>
        </motion.svg>
        <motion.span className="absolute inset-0 grid place-items-center" animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDownIcon size={22} />
        </motion.span>
      </motion.div>
    </section>
  );
}
