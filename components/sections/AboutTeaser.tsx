"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Magnetic } from "@/components/ui/Magnetic";

const STATEMENT =
  "I’m a software engineer focused on building reliable, scalable and user-centric web applications, across frontend architecture, backend APIs, databases, real-time systems and AI-powered product experiences.";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  );
}

/** Scroll-driven statement: each word lights up as it passes the middle of the screen. */
export function AboutTeaser() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const words = STATEMENT.split(" ");

  return (
    <section aria-labelledby="about-teaser" className="py-24 sm:py-36">
      <div className="container-page">
        <h2 id="about-teaser" className="mb-8 text-sm font-semibold uppercase tracking-widest text-muted">
          About
        </h2>
        <p ref={ref} className="font-display max-w-5xl text-[clamp(1.75rem,4.2vw,3.5rem)] font-semibold leading-[1.15]">
          <span className="sr-only">{STATEMENT}</span>
          <span aria-hidden>
            {words.map((w, i) => (
              <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
            ))}
          </span>
        </p>
        <div className="mt-10">
          <Magnetic>
            <TransitionLink href="/about" label="About" color="lilac" className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-7 font-semibold transition-colors hover:bg-fg hover:text-bg">
              More about me <ArrowRightIcon size={16} />
            </TransitionLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
