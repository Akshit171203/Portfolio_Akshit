"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Animate when scrolled into view instead of on mount. */
  inView?: boolean;
};

/** Letters rise out of a mask one after another. The whole string stays readable to assistive tech. */
export function SplitText({ text, as: Tag = "span", className, delay = 0, inView }: Props) {
  const trigger = inView
    ? { whileInView: { y: 0 }, viewport: { once: true, margin: "0px 0px -10% 0px" } }
    : { animate: { y: 0 } };
  let n = 0;
  return (
    <Tag className={className} aria-label={text}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
          {[...word].map((ch, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              initial={{ y: "115%" }}
              {...trigger}
              transition={{ duration: 0.8, delay: delay + 0.025 * n++, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          ))}
          {wi < text.split(" ").length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
