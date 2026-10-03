"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SmartLink } from "@/components/ui/SmartLink";
import { VelocityMarquee } from "@/components/ui/VelocityMarquee";
import { site } from "@/data/site";
import { isPlaceholder } from "@/lib/utils";
import { TransitionLink } from "./TransitionLink";

const LETTER_COLORS = ["hover:text-coral", "hover:text-lime", "hover:text-lilac", "hover:text-sky", "hover:text-butter"];

export function Footer() {
  const emailHref = isPlaceholder(site.email) ? site.email : `mailto:${site.email}`;
  const link = "inline-block py-1 underline-offset-4 hover:underline";

  return (
    <footer className="mt-24 overflow-hidden border-t border-line pt-10">
      <TransitionLink href="/contact" label="Contact" color="coral" data-cursor="Talk" className="block py-4">
        <span className="sr-only">Let’s build something useful. Contact me.</span>
        <VelocityMarquee speed={-3}>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} aria-hidden className="font-display mr-10 flex items-center gap-10 whitespace-nowrap text-5xl font-bold sm:text-7xl">
              Let’s build something useful
              <span className="grid h-12 w-12 place-items-center rounded-full bg-coral text-ink sm:h-16 sm:w-16">
                <ArrowRightIcon size={28} />
              </span>
            </span>
          ))}
        </VelocityMarquee>
      </TransitionLink>

      <div className="container-page mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-sm font-medium">
        <ul className="flex flex-wrap gap-x-6">
          <li><TransitionLink href="/work" label="Work" color="lime" className={link}>Work</TransitionLink></li>
          <li><TransitionLink href="/about" label="About" color="lilac" className={link}>About</TransitionLink></li>
          <li><TransitionLink href="/contact" label="Contact" color="coral" className={link}>Contact</TransitionLink></li>
        </ul>
        <ul className="flex flex-wrap gap-x-6">
          <li><SmartLink href={site.github} label="GitHub" className={link}>GitHub</SmartLink></li>
          <li><SmartLink href={site.linkedin} label="LinkedIn" className={link}>LinkedIn</SmartLink></li>
          <li><SmartLink href={emailHref} label="Email" className={link}>Email</SmartLink></li>
          <li><SmartLink href={site.resume} label="Resume" className={link}>Resume</SmartLink></li>
        </ul>
      </div>

      <div aria-hidden className="container-page select-none">
        <p className="font-display flex justify-between pt-6 text-[clamp(5rem,27vw,26rem)] font-extrabold leading-[0.78]">
          {[...site.name.toUpperCase()].map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: "60%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 120, damping: 14 }}
              whileHover={{ y: "-6%", scale: 1.06 }}
              className={`inline-block transition-colors duration-200 ${LETTER_COLORS[i % LETTER_COLORS.length]}`}
            >
              {ch}
            </motion.span>
          ))}
        </p>
      </div>

      <div className="container-page flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:justify-between">
        <p>© 2026 {site.name} · {site.tagline}</p>
        <p>Built with Next.js</p>
      </div>
    </footer>
  );
}
