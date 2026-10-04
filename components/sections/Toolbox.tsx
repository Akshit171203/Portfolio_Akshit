"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { skillGroups } from "@/data/skills";

const EASE = [0.22, 1, 0.36, 1] as const;
const COLORS = ["coral", "lime", "lilac", "sky", "butter", "mint", "pink"] as const;
/** How long each area stays up before the next one takes over. */
const INTERVAL = 3800;

/**
 * Home: an index of the areas I work in, and one colour card that shows the skills of whichever is selected.
 * It steps through the areas on its own while it is on screen, and holds still while someone is hovering or using the keyboard on it.
 */
export function Toolbox() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const playing = inView && !paused && !reduced;

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % skillGroups.length), INTERVAL);
    return () => clearTimeout(t);
  }, [playing, active]);

  const group = skillGroups[active];
  const color = COLORS[active % COLORS.length];

  return (
    <section
      ref={ref}
      aria-labelledby="toolbox"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className="border-y border-line py-16 sm:py-24"
    >
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-3 sm:mb-12">
          <div>
            <h2 id="toolbox" className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
              <span aria-hidden className="h-2 w-2 rounded-full bg-coral" />
              Toolbox
            </h2>
            <p className="font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-semibold leading-[1.05] tracking-tight">What I build with.</p>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">It steps through on its own. Hover or tap an area to pick one.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-10">
          {/* The index */}
          <div role="tablist" aria-orientation="vertical" aria-label="Skill areas" className="grid grid-cols-2 gap-2 lg:col-span-5 lg:grid-cols-1 lg:gap-0 lg:border-t lg:border-line">
            {skillGroups.map((g, i) => {
              const on = i === active;
              const c = COLORS[i % COLORS.length];
              return (
                <button
                  key={g.name}
                  type="button"
                  role="tab"
                  id={`toolbox-tab-${i}`}
                  aria-selected={on}
                  aria-controls="toolbox-panel"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={(e) => { setActive(i); if (e.currentTarget.matches(":focus-visible")) setPaused(true); }}
                  onBlur={() => setPaused(false)}
                  className={`group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border lg:overflow-visible px-4 py-3 text-left transition-colors duration-300 lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-[0.95rem] ${
                    on ? "border-fg/40" : "border-line"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-300"
                      style={{ background: `var(--${c})`, transform: on ? "scale(1.7)" : "scale(1)" }}
                    />
                    <span
                      className={`font-display text-base font-semibold leading-none tracking-tight transition-all duration-300 sm:text-lg lg:text-[1.6rem] ${
                        on ? "text-fg lg:translate-x-2" : "text-muted group-hover:text-fg"
                      }`}
                    >
                      {g.name}
                    </span>
                  </span>
                  <span className={`shrink-0 text-xs font-semibold tabular-nums transition-colors ${on ? "text-fg" : "text-muted"}`}>
                    {String(g.skills.length).padStart(2, "0")}
                  </span>
                  {on && playing && (
                    <motion.span
                      key={`bar-${active}`}
                      aria-hidden
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left"
                      style={{ background: `var(--${c})` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* The card */}
          <div role="tabpanel" id="toolbox-panel" aria-labelledby={`toolbox-tab-${active}`} className="lg:col-span-7">
            <div
              className="relative flex min-h-[19rem] flex-col gap-7 overflow-hidden rounded-[2rem] p-7 text-ink transition-colors duration-500 sm:h-[24rem] sm:p-9"
              style={{ background: `var(--${color})`, "--c": `var(--${color})` } as CSSProperties}
            >
              {/* A large faint count fills the lower corner */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={`n-${active}`}
                  aria-hidden
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 0.13, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="font-display pointer-events-none absolute -bottom-6 right-6 select-none text-[11rem] font-extrabold leading-none tracking-tighter sm:text-[15rem]"
                >
                  {String(group.skills.length).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>

              <div className="relative flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
                <span>{group.name}</span>
                <span>{group.skills.length} skills</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.ul
                  key={active}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ staggerChildren: 0.045 }}
                  aria-label={`${group.name} skills`}
                  className="relative flex flex-wrap gap-2.5 sm:gap-3"
                >
                  {group.skills.map((s) => (
                    <motion.li
                      key={s}
                      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="font-display cursor-default rounded-full border-2 border-ink px-4 py-1.5 text-lg font-bold leading-tight tracking-tight transition-colors duration-300 hover:bg-ink hover:[color:var(--c)] sm:px-5 sm:py-2 sm:text-2xl"
                    >
                      {s}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
