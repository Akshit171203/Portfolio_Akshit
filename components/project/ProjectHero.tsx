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

/**
 * Full-bleed opening: the demo video (or first screenshot) fills the screen with the title over it,
 * then shrinks into a rounded card as you scroll. Falls back to the project colour without media.
 */
export function ProjectHero({ project: p }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref);
  const [paused, setPaused] = useState(false);
  const media = p.screens?.[0];
  const video = media?.video;
  const urls = getProjectUrls(p.slug);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.55], [1, 0.9]);
  const radius = useTransform(scrollYProgress, [0, 0.55], [0, 44]);
  const textY = useTransform(scrollYProgress, [0, 0.45], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.38], [1, 0]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && !paused && !reduce) v.play().catch(() => {});
    else v.pause();
  }, [inView, paused, reduce]);

  const pillBase = "inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:-translate-y-0.5";

  return (
    <section ref={ref} aria-labelledby="project-title" className="relative h-[170dvh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <motion.div
          style={reduce ? undefined : { scale, borderRadius: radius }}
          className="absolute inset-0 overflow-hidden bg-black will-change-transform"
        >
          {video ? (
            <video
              ref={videoRef}
              aria-hidden
              muted
              loop
              playsInline
              preload="metadata"
              poster={media!.src}
              className="h-full w-full object-cover object-top"
            >
              <source src={video.webm} type="video/webm" />
              <source src={video.mp4} type="video/mp4" />
            </video>
          ) : media ? (
            <motion.div className="h-full w-full" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: EASE }}>
              <Image src={media.src} alt="" fill priority sizes="100vw" className="object-cover object-top" />
            </motion.div>
          ) : (
            <div className="h-full w-full" style={{ background: `var(--${p.color})` }}>
              <span aria-hidden className="font-display absolute -bottom-24 -right-6 select-none text-[28rem] font-extrabold leading-none text-ink/10">
                {p.name.charAt(0)}
              </span>
            </div>
          )}
          {(video || media) && (
            <>
              <div aria-hidden className="absolute inset-0 bg-black/55" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </>
          )}
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: textY, opacity: textOpacity }}
          className={`absolute inset-0 flex flex-col justify-end pb-14 sm:pb-20 ${video || media ? "text-white" : "text-ink"}`}
        >
          <div className="container-page">
            <TransitionLink href="/work" label="Work" color="lime" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold opacity-80 transition-opacity hover:opacity-100">
              <ArrowLeftIcon size={16} /> All work
            </TransitionLink>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
              className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold uppercase tracking-[0.18em] opacity-80"
            >
              <span>{p.kind}</span>
              {p.period && (
                <>
                  <span aria-hidden>·</span>
                  <span>{p.period}</span>
                </>
              )}
            </motion.p>

            <h1 id="project-title" className="font-display text-[clamp(3.25rem,12.5vw,11.5rem)] font-extrabold leading-[0.88] tracking-[-0.045em]">
              <SplitText text={p.name} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
              className="mt-7 max-w-2xl text-lg font-medium leading-snug opacity-90 sm:text-2xl"
            >
              {p.tagline}
            </motion.p>

            {(urls.live || urls.github) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
                className="mt-8 flex flex-wrap gap-3"
              >
                {urls.live && (
                  <SmartLink
                    href={urls.live}
                    label={`${p.name} live site`}
                    className={`${pillBase} ${video || media ? "bg-white text-black" : "bg-ink text-[#f4f1ea]"}`}
                  >
                    <ArrowUpRightIcon size={16} /> Visit live site
                  </SmartLink>
                )}
                {urls.github && (
                  <SmartLink
                    href={urls.github}
                    label={`${p.name} source on GitHub`}
                    className={`${pillBase} border ${video || media ? "border-white/40 text-white hover:bg-white/10" : "border-ink/40 text-ink hover:bg-ink/10"}`}
                  >
                    <GitHubIcon size={16} /> Source code
                  </SmartLink>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          aria-hidden
          style={reduce ? undefined : { opacity: textOpacity }}
          className="absolute bottom-8 right-6 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 sm:flex"
        >
          Scroll
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowDownIcon size={16} />
          </motion.span>
        </motion.div>

        {video && (
          <button
            type="button"
            aria-label={paused || reduce ? "Play background video" : "Pause background video"}
            onClick={() => setPaused((v) => !v)}
            className="absolute right-6 top-24 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-transform hover:scale-110"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
              {paused || reduce ? <path d="M3 1.8v10.4a.6.6 0 0 0 .9.5l8.3-5.2a.6.6 0 0 0 0-1L3.9 1.3a.6.6 0 0 0-.9.5z" /> : (
                <>
                  <rect x="2" y="1.5" width="3.5" height="11" rx="1" />
                  <rect x="8.5" y="1.5" width="3.5" height="11" rx="1" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
