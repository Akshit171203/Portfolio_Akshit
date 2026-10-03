"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const PALETTE = ["var(--coral)", "var(--lime)", "var(--lilac)", "var(--sky)", "var(--butter)", "var(--mint)", "var(--pink)"];

type Props = { src: string; alt: string; mode: "photo" | "cutout" };

/** A small piece that sits in front of the portrait and shifts more than the photo does. */
function Floating({
  nx,
  ny,
  depth,
  className,
  children,
  delay,
}: {
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  depth: number;
  className: string;
  children: React.ReactNode;
  delay: number;
}) {
  const x = useTransform(nx, (v) => v * depth);
  const y = useTransform(ny, (v) => v * depth);
  return (
    <motion.div style={{ x, y, z: 70 }} className={`absolute ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring", stiffness: 220, damping: 14 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 3.5 + delay, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.15, rotate: -5 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Burst() {
  const parts = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const d = 110 + (i % 3) * 40;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, c: PALETTE[i % PALETTE.length], s: 8 + (i % 4) * 3 };
  });
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-20">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: p.s, height: p.s, background: p.c, marginLeft: -p.s / 2, marginTop: -p.s / 2 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

/**
 * Interactive portrait. The pointer position anywhere on screen drives several layers at different
 * depths: the backing shapes drift one way, the card tilts in 3D, the photo slides inside its frame,
 * and the chips in front move furthest. Click it for a burst. Touch and reduced-motion users get a
 * gentle idle float instead of pointer tracking.
 */
export function Portrait({ src, alt, mode }: Props) {
  const reduce = useReducedMotion();
  const nx = useSpring(useMotionValue(0), { stiffness: 110, damping: 18 });
  const ny = useSpring(useMotionValue(0), { stiffness: 110, damping: 18 });
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      nx.set(e.clientX / window.innerWidth - 0.5);
      ny.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, nx, ny]);

  const rotateY = useTransform(nx, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(ny, [-0.5, 0.5], [10, -10]);
  const imgX = useTransform(nx, (v) => v * -34);
  const imgY = useTransform(ny, (v) => v * -26);
  const backX = useTransform(nx, (v) => v * 46);
  const backY = useTransform(ny, (v) => v * 36);
  const backX2 = useTransform(nx, (v) => v * -30);
  const backY2 = useTransform(ny, (v) => v * -22);
  const gx = useTransform(nx, (v) => (v + 0.5) * 100);
  const gy = useTransform(ny, (v) => (v + 0.5) * 100);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.3), transparent 55%)`;

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[22rem] sm:max-w-[26rem] lg:mx-0 lg:ml-auto" style={{ perspective: 1100 }}>
      <motion.div
        className="relative h-full w-full"
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Backing shapes: move opposite to the card so the scene feels deep */}
        <motion.div
          aria-hidden
          style={{ x: backX, y: backY }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 14 }}
          className="absolute -inset-5 rounded-[3rem] bg-lime"
        />
        <motion.div
          aria-hidden
          style={{ x: backX2, y: backY2 }}
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 120, damping: 12 }}
          className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full border-[10px] border-coral"
        />
        <motion.div
          aria-hidden
          style={{ x: backX2, y: backY }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.55, type: "spring", stiffness: 120, damping: 12 }}
          className="absolute -right-6 -top-8 h-16 w-16 rounded-full bg-lilac"
        />

        {/* The card */}
        <motion.button
          type="button"
          aria-label={`${alt}. Press for a surprise.`}
          onClick={() => setBurst((b) => b + 1)}
          data-cursor="Hi!"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          whileTap={{ scale: 0.96 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 140, damping: 16 }}
          className="relative block h-full w-full text-left"
        >
          {mode === "photo" ? (
            <span className="relative block h-full w-full overflow-hidden rounded-[2.5rem] bg-surface">
              <motion.span style={{ x: imgX, y: imgY, scale: 1.14 }} className="absolute inset-0 block">
                <Image src={src} alt={alt} fill priority sizes="(min-width: 1024px) 26rem, 80vw" className="object-cover object-[20%_30%]" />
              </motion.span>
              <motion.span aria-hidden style={{ background: glare }} className="absolute inset-0 mix-blend-soft-light" />
            </span>
          ) : (
            <span className="relative block h-full w-full">
              <span aria-hidden className="absolute inset-x-[6%] bottom-0 top-[22%] rounded-full bg-coral" />
              <motion.span style={{ x: imgX, y: imgY, z: 40 }} className="absolute inset-0 block">
                <Image src={src} alt={alt} fill priority sizes="(min-width: 1024px) 26rem, 80vw" className="scale-110 object-contain object-bottom" />
              </motion.span>
            </span>
          )}

          <Floating nx={nx} ny={ny} depth={70} delay={0.9} className="-left-6 top-[14%]">
            <span className="block rounded-full bg-sky px-5 py-2.5 font-display text-lg font-semibold text-ink shadow-[0_8px_0_0_rgb(0_0_0/0.18)]">React</span>
          </Floating>
          <Floating nx={nx} ny={ny} depth={90} delay={1.05} className="-right-8 top-[40%]">
            <span className="block rounded-full bg-fg px-5 py-2.5 font-display text-lg font-semibold text-bg shadow-[0_8px_0_0_rgb(0_0_0/0.18)]">Next.js</span>
          </Floating>
          <Floating nx={nx} ny={ny} depth={60} delay={1.2} className="-left-10 bottom-[18%]">
            <span className="block rounded-full bg-butter px-5 py-2.5 font-display text-lg font-semibold text-ink shadow-[0_8px_0_0_rgb(0_0_0/0.18)]">Node.js</span>
          </Floating>
          <Floating nx={nx} ny={ny} depth={100} delay={1.35} className="-bottom-5 right-[10%]">
            <span className="block rounded-full bg-coral px-5 py-2.5 font-display text-lg font-semibold text-ink shadow-[0_8px_0_0_rgb(0_0_0/0.18)]">+ AI</span>
          </Floating>

          {burst > 0 && <Burst key={burst} />}
        </motion.button>
      </motion.div>
    </div>
  );
}
