"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { site } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";
import { TransitionLink } from "./TransitionLink";

const LINKS = [
  { href: "/work", label: "Work", color: "lime" },
  { href: "/about", label: "About", color: "lilac" },
  { href: "/contact", label: "Contact", color: "coral" },
];

export function Nav() {
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24 });
  const [hidden, setHidden] = useState(false);
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  // The menu is "open for a path", so it closes itself when the route changes.
  const open = openAt === pathname;

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240);
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-coral" />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden && !open ? -90 : 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav
          aria-label="Primary"
          className="flex w-full max-w-xl items-center justify-between gap-2 rounded-full border border-line bg-bg/80 py-1.5 pl-5 pr-1.5 backdrop-blur-md sm:w-auto sm:gap-4"
        >
          <TransitionLink href="/" label="Home" color="ink" className="font-display text-lg font-bold" aria-label={`${site.name}, home`}>
            {site.name}
            <span className="text-coral">.</span>
          </TransitionLink>

          <ul className="hidden items-center sm:flex" onMouseLeave={() => setHover(null)}>
            {LINKS.map((l) => (
              <li key={l.href}>
                <TransitionLink
                  href={l.href}
                  label={l.label}
                  color={l.color}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  onMouseEnter={() => setHover(l.href)}
                  onFocus={() => setHover(l.href)}
                  onBlur={() => setHover(null)}
                  className="relative block rounded-full px-4 py-2 text-sm font-medium"
                >
                  {hover === l.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-fg/10"
                      transition={{ type: "spring", stiffness: 500, damping: 36 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                  {isActive(l.href) && (
                    <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-coral" />
                  )}
                </TransitionLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center rounded-full bg-fg px-5 text-sm font-semibold text-bg sm:inline-flex"
            >
              Resume
            </a>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpenAt(open ? null : pathname)}
              className="grid h-10 w-10 place-items-center rounded-full bg-fg text-bg sm:hidden"
            >
              {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "circle(0% at 90% 4%)" }}
            animate={{ clipPath: "circle(150% at 90% 4%)" }}
            exit={{ clipPath: "circle(0% at 90% 4%)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-lime px-8 text-ink sm:hidden"
          >
            <ul>
              {[{ href: "/", label: "Home", color: "ink" }, ...LINKS].map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TransitionLink
                      href={l.href}
                      label={l.label}
                      color={l.color}
                      onClick={() => setOpenAt(null)}
                      className="font-display block py-1 text-6xl font-bold"
                    >
                      {l.label}
                    </TransitionLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 w-fit items-center rounded-full bg-ink px-6 font-semibold text-lime"
            >
              Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
