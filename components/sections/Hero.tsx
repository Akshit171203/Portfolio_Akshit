"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowDownIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/Icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { SmartLink } from "@/components/ui/SmartLink";
import { site } from "@/data/site";
import { isPlaceholder } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function RevealLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em] lg:whitespace-nowrap">
      <motion.span className="block" initial={{ y: "115%", rotate: 4 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 0.9, delay, ease: EASE }}>
        {children}
      </motion.span>
    </span>
  );
}

/** Soft colour blobs that drift slowly behind the hero. Opacity follows the theme through --glow. */
function Glow() {
  const blob = "absolute rounded-full blur-[110px] sm:blur-[130px]";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: "var(--glow)" }}>
      <motion.div
        className={`${blob} -left-[12%] top-[2%] h-[30rem] w-[30rem] bg-coral sm:h-[40rem] sm:w-[40rem]`}
        animate={{ x: [0, 90, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${blob} -right-[10%] top-[0%] h-[28rem] w-[28rem] bg-lilac sm:h-[38rem] sm:w-[38rem]`}
        animate={{ x: [0, -80, 0], y: [0, 70, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${blob} bottom-[-18%] left-[28%] h-[26rem] w-[26rem] bg-lime sm:h-[36rem] sm:w-[36rem]`}
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${blob} bottom-[8%] right-[8%] h-[20rem] w-[20rem] bg-sky sm:h-[28rem] sm:w-[28rem]`}
        animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const spotX = useSpring(useMotionValue(-400), { stiffness: 120, damping: 24 });
  const spotY = useSpring(useMotionValue(-400), { stiffness: 120, damping: 24 });
  const spot = useMotionTemplate`radial-gradient(520px circle at ${spotX}px ${spotY}px, var(--spot), transparent 65%)`;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const emailHref = isPlaceholder(site.email) ? site.email : `mailto:${site.email}`;
  const icon = "grid h-11 w-11 place-items-center rounded-full border border-line bg-bg/40 backdrop-blur transition-colors hover:bg-fg hover:text-bg";

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh items-center overflow-hidden pb-24 pt-32"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        spotX.set(e.clientX - r.left);
        spotY.set(e.clientY - r.top);
      }}
    >
      <Glow />
      <div aria-hidden className="grain pointer-events-none absolute inset-0" />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spot }} />
      {/* fade into the page colour so the next section starts clean */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <motion.div className="container-page relative text-center" style={{ y: textY, opacity: textOpacity }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-bg/40 px-4 py-2 text-sm font-medium backdrop-blur"
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

        <h1 id="hero-title" className="font-display text-[clamp(2.1rem,5.6vw,5.25rem)] font-bold leading-[1.02] tracking-tight">
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
          className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted"
        >
          Full Stack Software Engineer building production-ready web applications with React, Next.js, TypeScript, Node.js, PostgreSQL and modern AI technologies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Magnetic>
            <TransitionLink href="/work" label="Work" color="lime" className="inline-flex h-12 items-center gap-2 rounded-full bg-fg px-7 text-[0.9375rem] font-semibold text-bg">
              View Work <ArrowDownIcon size={16} className="-rotate-90" />
            </TransitionLink>
          </Magnetic>
          <Magnetic>
            <TransitionLink href="/contact" label="Contact" color="coral" className="inline-flex h-12 items-center rounded-full border border-line bg-bg/40 px-7 text-[0.9375rem] font-semibold backdrop-blur transition-colors hover:bg-fg/10">
              Let’s Connect
            </TransitionLink>
          </Magnetic>
          <span aria-hidden className="mx-1 hidden h-8 w-px bg-line sm:block" />
          <SmartLink href={site.github} label="GitHub" className={icon}><GitHubIcon /></SmartLink>
          <SmartLink href={site.linkedin} label="LinkedIn" className={icon}><LinkedInIcon /></SmartLink>
          <SmartLink href={emailHref} label="Email" className={icon}><MailIcon /></SmartLink>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        aria-hidden
        className="absolute inset-x-0 bottom-7 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted"
      >
        Scroll
        <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDownIcon size={14} />
        </motion.span>
      </motion.p>
    </section>
  );
}
