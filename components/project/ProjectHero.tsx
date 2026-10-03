"use client";

import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowDownIcon, ArrowLeftIcon, ArrowUpRightIcon, GitHubIcon } from "@/components/ui/Icons";
import { SmartLink } from "@/components/ui/SmartLink";
import { SplitText } from "@/components/ui/SplitText";
import { getProjectUrls, type Project } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;

/** A circle of text that turns slowly. Decorative. */
function Badge({ label }: { label: string }) {
  const text = `${label} • ${label} • `;
  return (
    <div aria-hidden className="relative hidden h-32 w-32 shrink-0 lg:block">
      <svg viewBox="0 0 120 120" className="absolute inset-0 motion-safe:animate-[spin_22s_linear_infinite]">
        <defs>
          <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text fill="currentColor" fontSize="10.5" fontWeight="700" letterSpacing="3.1" className="uppercase">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <ArrowDownIcon size={26} />
      </span>
    </div>
  );
}

/** The browser frame the demo plays in. It tilts up out of the page and flattens as it scrolls into view. */
function Stage({ project: p }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "-5% 0px -5% 0px" });
  const [paused, setPaused] = useState(false);
  const media = p.screens![0];
  const video = media.video;
  const live = getProjectUrls(p.slug).live;
  const host = live ? new URL(live).host : p.name;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && !paused && !reduce) v.play().catch(() => {});
    else v.pause();
  }, [inView, paused, reduce]);

  return (
    <div ref={ref} className="relative mt-10 sm:mt-12" style={{ perspective: "1800px" }}>
      {/* the page colour starts halfway down the frame, so the frame straddles the two */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 top-1/2 bg-bg" />
      <motion.div
        style={reduce ? undefined : { rotateX, scale, y, transformOrigin: "50% 100%" }}
        className="container-page relative will-change-transform"
      >
        <div className="mx-auto w-full max-w-[75rem] overflow-hidden rounded-2xl border border-white/10 bg-[#141412] shadow-[0_60px_120px_-40px_rgb(0_0_0/0.55)]">
          <div aria-hidden className="flex items-center gap-3 px-4 py-3">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b4a]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffd75e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#86e3b5]" />
            </span>
            <span className="mx-auto max-w-[60%] truncate rounded-full bg-white/[0.07] px-4 py-1 text-xs font-medium text-white/60">{host}</span>
            <span className="w-[3.25rem]" />
          </div>
          <div className="relative aspect-[16/10] bg-black">
            {video ? (
              <video
                ref={videoRef}
                aria-label={media.alt}
                muted
                loop
                playsInline
                preload="metadata"
                poster={media.src}
                className="h-full w-full object-cover object-top"
              >
                <source src={video.webm} type="video/webm" />
                <source src={video.mp4} type="video/mp4" />
              </video>
            ) : (
              <Image src={media.src} alt={media.alt} fill priority sizes="(min-width: 1200px) 1200px, 94vw" className="object-cover object-top" />
            )}
            {media.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur">
                {media.badge}
              </span>
            )}
            {video && (
              <button
                type="button"
                aria-label={paused || reduce ? "Play demo video" : "Pause demo video"}
                onClick={() => setPaused((v) => !v)}
                className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-transform hover:scale-110"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                  {paused || reduce ? (
                    <path d="M3 1.8v10.4a.6.6 0 0 0 .9.5l8.3-5.2a.6.6 0 0 0 0-1L3.9 1.3a.6.6 0 0 0-.9.5z" />
                  ) : (
                    <>
                      <rect x="2" y="1.5" width="3.5" height="11" rx="1" />
                      <rect x="8.5" y="1.5" width="3.5" height="11" rx="1" />
                    </>
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Opening: the page takes the project's colour. Title and one-line pitch sit on flat colour (nothing behind
 * them to fight with), and the demo rises below in a browser frame.
 */
export function ProjectHero({ project: p, index, total }: { project: Project; index: number; total: number }) {
  const urls = getProjectUrls(p.slug);
  const hasMedia = !!p.screens?.length;
  const long = p.name.length > 15;
  const pill = "inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:-translate-y-0.5";

  return (
    <section aria-labelledby="project-title" className="relative overflow-hidden text-ink" style={{ background: `var(--${p.color})` }}>
      <div aria-hidden className="grain pointer-events-none absolute inset-0" />
      {!hasMedia && (
        <span aria-hidden className="font-display pointer-events-none absolute -bottom-32 -right-8 select-none text-[34rem] font-extrabold leading-none text-ink/10">
          {p.name.charAt(0)}
        </span>
      )}

      <div className="container-page relative pt-28 sm:pt-32">
        <div className="flex items-center justify-between gap-4">
          <TransitionLink href="/work" label="Work" color="lime" className="inline-flex items-center gap-2 text-sm font-semibold opacity-80 transition-opacity hover:opacity-100">
            <ArrowLeftIcon size={16} /> All work
          </TransitionLink>
          <p className="font-display text-sm font-bold tabular-nums opacity-80">
            {String(index + 1).padStart(2, "0")}
            <span className="opacity-50"> / {String(total).padStart(2, "0")}</span>
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold uppercase tracking-[0.2em] sm:mt-14"
        >
          <span>{p.kind}</span>
          {p.period && (
            <>
              <span aria-hidden className="opacity-50">/</span>
              <span>{p.period}</span>
            </>
          )}
        </motion.p>

        <h1
          id="project-title"
          className="font-display mt-5 font-extrabold leading-[0.88] tracking-[-0.045em]"
          style={{ fontSize: long ? "clamp(2.75rem, 8.6vw, 8rem)" : "clamp(3rem, 12.5vw, 11rem)" }}
        >
          <SplitText text={p.name} />
        </h1>

        <div className="mt-8 flex flex-col justify-between gap-8 sm:mt-10 lg:flex-row lg:items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
            className="max-w-2xl text-xl font-medium leading-snug sm:text-2xl"
          >
            {p.tagline}
          </motion.p>
          <div className="flex items-center gap-8">
            {(urls.live || urls.github) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.8, ease: EASE }}
                className="flex flex-wrap gap-3"
              >
                {urls.live && (
                  <SmartLink href={urls.live} label={`${p.name} live site`} className={`${pill} bg-ink text-[#f4f1ea]`}>
                    <ArrowUpRightIcon size={16} /> Visit live site
                  </SmartLink>
                )}
                {urls.github && (
                  <SmartLink href={urls.github} label={`${p.name} source on GitHub`} className={`${pill} border border-ink/40 hover:bg-ink/10`}>
                    <GitHubIcon size={16} /> Source code
                  </SmartLink>
                )}
              </motion.div>
            )}
            <Badge label="Case study" />
          </div>
        </div>
      </div>

      {hasMedia ? <Stage project={p} /> : <div className="h-24 sm:h-32" />}
    </section>
  );
}
