"use client";

import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { Tilt } from "@/components/ui/Tilt";
import type { Project } from "@/data/projects";

type Screen = NonNullable<Project["screens"]>[number];

const INTERVAL = 5000;

function PlayGlyph({ playing }: { playing: boolean }) {
  return playing ? (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="currentColor">
      <rect x="2" y="1.5" width="3.5" height="11" rx="1" />
      <rect x="8.5" y="1.5" width="3.5" height="11" rx="1" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="currentColor">
      <path d="M3 1.8v10.4a.6.6 0 0 0 .9.5l8.3-5.2a.6.6 0 0 0 0-1L3.9 1.3a.6.6 0 0 0-.9.5z" />
    </svg>
  );
}

/**
 * Interactive viewer for a project's recordings and screenshots: one browser frame, a thumbnail strip.
 * A video plays once when it scrolls into view, then the tour moves on through the stills by itself.
 * It stops advancing for good as soon as the visitor takes over. Reduced-motion users get posters only.
 */
export function ProductTour({ screens, color }: { screens: Screen[]; color: string }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [blocked, setBlocked] = useState(false); // autoplay refused by the browser
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px" });
  const reduce = useReducedMotion();
  const n = screens.length;
  const cur = screens[i];
  const isVideo = Boolean(cur.video);

  // Gentle parallax while the section scrolls past
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [26, -26]);

  const advance = () => {
    setDir(1);
    setBlocked(false);
    setI((v) => (v + 1) % n);
  };
  const go = (next: number) => {
    setAuto(false);
    setBlocked(false);
    setDir(next > i ? 1 : -1);
    setI((next + n) % n);
  };

  // Stills advance on a timer. A video advances when it ends, unless the browser refused to play it.
  const timerOn = auto && inView && !reduce && (!isVideo || blocked);
  useEffect(() => {
    if (!timerOn) return;
    const t = setInterval(() => {
      setDir(1);
      setBlocked(false);
      setI((v) => (v + 1) % n);
    }, INTERVAL);
    return () => clearInterval(t);
  }, [timerOn, n]);

  // Play the video only while it is visible and nobody has paused it.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && !reduce && !paused) {
      v.play().catch(() => setBlocked(true));
    } else {
      v.pause();
    }
  }, [i, inView, reduce, paused]);

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="carousel"
      aria-label="Product demo and screenshots"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
    >
      <motion.div style={reduce ? undefined : { y }} className="relative isolate">
        {/* Soft colour glow behind the frame */}
        <div aria-hidden className="absolute -inset-6 -z-10 rounded-[3rem] opacity-20 blur-3xl" style={{ background: `var(--${color})` }} />

        <Tilt max={2}>
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_80px_-35px_rgb(0_0_0/0.55)]">
            <div aria-hidden className="flex items-center gap-1.5 border-b border-line px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-coral" />
              <span className="h-2.5 w-2.5 rounded-full bg-butter" />
              <span className="h-2.5 w-2.5 rounded-full bg-mint" />
              <span className="ml-3 truncate rounded-full bg-fg/[0.06] px-3 py-0.5 text-[0.6875rem] font-medium text-muted">{cur.caption}</span>
            </div>

            <div className="relative aspect-[8/5] overflow-hidden bg-bg">
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div
                  key={cur.src}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 60, scale: 1.02 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: dir * -60 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  {cur.video ? (
                    <video
                      ref={videoRef}
                      muted
                      playsInline
                      preload="metadata"
                      loop={!auto}
                      poster={cur.src}
                      aria-label={cur.alt}
                      onEnded={() => auto && advance()}
                      className="h-full w-full object-cover object-top"
                    >
                      <source src={cur.video.webm} type="video/webm" />
                      <source src={cur.video.mp4} type="video/mp4" />
                    </video>
                  ) : (
                    <Image src={cur.src} alt={cur.alt} fill sizes="(min-width: 1024px) 900px, 100vw" className="object-cover object-top" priority={i === 0} />
                  )}
                </motion.div>
              </AnimatePresence>

              {cur.badge && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-ink/90 px-3 py-1.5 text-xs font-semibold text-[#f4f1ea] backdrop-blur">
                  <span aria-hidden className="relative flex h-2 w-2">
                    <motion.span
                      className="absolute inline-flex h-full w-full rounded-full"
                      style={{ background: `var(--${color})` }}
                      animate={{ scale: [1, 2.4], opacity: [0.8, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                    />
                    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: `var(--${color})` }} />
                  </span>
                  {cur.badge}
                </span>
              )}

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                {isVideo ? (
                  <button
                    type="button"
                    aria-label={paused || reduce ? "Play demo" : "Pause demo"}
                    onClick={() => {
                      setAuto(false);
                      setPaused((p) => !p);
                    }}
                    className="grid h-10 w-10 place-items-center rounded-full bg-ink/90 text-[#f4f1ea] backdrop-blur transition-transform hover:scale-110"
                  >
                    <PlayGlyph playing={!(paused || reduce)} />
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  {[
                    { label: "Previous", d: -1, Icon: ArrowLeftIcon },
                    { label: "Next", d: 1, Icon: ArrowRightIcon },
                  ].map(({ label, d, Icon }) => (
                    <button
                      key={label}
                      type="button"
                      aria-label={`${label} item`}
                      onClick={() => go(i + d)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-ink/90 text-[#f4f1ea] backdrop-blur transition-transform hover:scale-110"
                    >
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Tilt>
      </motion.div>

      <div aria-live="polite" className="mt-5 flex min-h-6 items-baseline gap-2 text-sm text-muted">
        <span className="font-semibold text-fg">{String(i + 1).padStart(2, "0")}</span>
        <span>/ {String(n).padStart(2, "0")}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={cur.caption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            · {cur.caption}
          </motion.span>
        </AnimatePresence>
      </div>

      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {screens.map((s, idx) => {
          const on = idx === i;
          return (
            <li key={s.src}>
              <button
                type="button"
                aria-label={`Show: ${s.caption}`}
                aria-current={on}
                onClick={() => go(idx)}
                className={`group relative block w-full overflow-hidden rounded-lg border transition-all ${on ? "border-transparent" : "border-line opacity-60 hover:opacity-100"}`}
                style={on ? { boxShadow: `0 0 0 2px var(--${color})` } : undefined}
              >
                <span className="relative block aspect-[8/5]">
                  <Image src={s.src} alt="" fill sizes="160px" className="object-cover object-top" />
                  {s.video && (
                    <span aria-hidden className="absolute inset-0 grid place-items-center bg-ink/35 text-[#f4f1ea]">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-ink/80">
                        <PlayGlyph playing={false} />
                      </span>
                    </span>
                  )}
                </span>
                {on && timerOn && !s.video && (
                  <motion.span
                    key={`${i}-bar`}
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1 origin-left"
                    style={{ background: `var(--${color})` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
