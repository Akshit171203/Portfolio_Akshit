"use client";

import { motion } from "framer-motion";

type Props = {
  steps: string[];
  /** CSS colour of the lit pill, e.g. "var(--coral)". */
  fill: string;
  /** CSS colour of the label on the lit pill. */
  fillText?: string;
  /** Tailwind classes for the resting pill. */
  idleClass?: string;
  stepTime?: number;
  label: string;
};

/** A row of steps that light up one after another, looping. Purely illustrative. */
export function PulseFlow({ steps, fill, fillText = "var(--ink)", idleClass = "bg-fg/10", stepTime = 0.7, label }: Props) {
  const cycle = steps.length * stepTime + 1.2;
  return (
    <ol aria-label={label} className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <motion.span
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: stepTime, delay: i * stepTime, repeat: Infinity, repeatDelay: cycle - stepTime, ease: "easeInOut" }}
            className={`relative inline-block rounded-full px-4 py-2 text-sm font-semibold sm:text-base ${idleClass}`}
          >
            {s}
            <motion.span
              aria-hidden
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: stepTime, delay: i * stepTime, repeat: Infinity, repeatDelay: cycle - stepTime, ease: "easeInOut" }}
              className="absolute inset-0 grid place-items-center rounded-full"
              style={{ background: fill, color: fillText }}
            >
              {s}
            </motion.span>
          </motion.span>
          {i < steps.length - 1 && (
            <span aria-hidden className="font-semibold opacity-50">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
