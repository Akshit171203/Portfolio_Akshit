"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Phase = "idle" | "covering" | "navigating" | "revealing";
type GoOptions = { label?: string; color?: string };
type State = { phase: Phase; from: string; href: string; label: string; color: string };

const Ctx = createContext<(href: string, opts?: GoOptions) => void>(() => {});
export const usePageTransition = () => useContext(Ctx);

const BARS = 5;
const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Route-change curtain: five bars sweep up to cover the page, the router navigates while the
 * screen is covered, then the bars lift away. Phases are derived from the pathname, so no effect
 * is needed to detect that the new page has arrived.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [state, setState] = useState<State>({ phase: "idle", from: "", href: "", label: "", color: "lime" });

  const phase: Phase =
    state.phase === "navigating" && pathname !== state.from ? "revealing" : state.phase;

  const go = useCallback(
    (href: string, opts: GoOptions = {}) => {
      if (reduce) return router.push(href);
      if (state.phase !== "idle" || href === pathname) return;
      setState({ phase: "covering", from: pathname, href, label: opts.label ?? "", color: opts.color ?? "lime" });
    },
    [reduce, router, state.phase, pathname],
  );

  const onBarDone = () => {
    if (phase === "covering") {
      setState((s) => ({ ...s, phase: "navigating" }));
      router.push(state.href);
      // Safety net: never leave the user stuck behind the curtain.
      window.setTimeout(() => setState((s) => (s.phase === "navigating" ? { ...s, phase: "idle" } : s)), 8000);
    } else if (phase === "revealing") {
      setState((s) => ({ ...s, phase: "idle" }));
    }
  };

  const covered = phase === "covering" || phase === "navigating";

  return (
    <Ctx.Provider value={go}>
      {children}
      <div
        aria-hidden
        className="fixed inset-0 z-[90] flex"
        style={{ pointerEvents: phase === "idle" ? "none" : "auto", visibility: phase === "idle" ? "hidden" : "visible" }}
      >
        {Array.from({ length: BARS }, (_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1"
            style={{ background: `var(--${state.color})`, originY: phase === "revealing" ? 0 : 1 }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: covered ? 1 : 0 }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
            onAnimationComplete={i === BARS - 1 ? onBarDone : undefined}
          />
        ))}
        <motion.p
          className={`font-display pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-[clamp(3rem,13vw,11rem)] font-bold leading-none ${state.color === "ink" ? "text-lime" : "text-ink"}`}
          initial={false}
          animate={covered ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
          transition={{ duration: 0.4, delay: covered ? 0.4 : 0 }}
        >
          {state.label}
        </motion.p>
      </div>
    </Ctx.Provider>
  );
}
