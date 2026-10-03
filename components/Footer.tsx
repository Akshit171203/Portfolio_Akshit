"use client";

import { motion } from "framer-motion";
import { ArrowDownIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { SmartLink } from "@/components/ui/SmartLink";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { isPlaceholder } from "@/lib/utils";
import { TransitionLink } from "./TransitionLink";

const EASE = [0.22, 1, 0.36, 1] as const;
const LETTER_COLORS = ["hover:text-coral", "hover:text-lime", "hover:text-lilac", "hover:text-sky", "hover:text-butter"];

export function Footer() {
  const emailHref = isPlaceholder(site.email) ? site.email : `mailto:${site.email}`;
  const link = "inline-block py-1 text-[0.9375rem] font-medium underline-offset-4 transition-colors hover:text-fg hover:underline";
  const heading = "mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted";

  return (
    <footer className="mt-24 overflow-hidden pt-4 sm:mt-32">
      {/* Call to action: a gradient card with the one thing I want you to do */}
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] p-8 text-ink sm:rounded-[2.5rem] sm:p-14"
          style={{ background: "linear-gradient(135deg, var(--lime) 0%, var(--sky) 55%, var(--lilac) 100%)" }}
        >
          <div aria-hidden className="grain pointer-events-none absolute inset-0" />
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-[#f4f1ea]">
                <span aria-hidden className="h-2 w-2 rounded-full bg-lime" />
                Say hello
              </p>
              <h2 className="font-display max-w-3xl text-[clamp(2.25rem,6vw,5rem)] font-extrabold leading-[0.98] tracking-tight">Let’s build something useful.</h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed opacity-80">Hiring, building a product, or want to talk engineering and AI? I’d be happy to connect.</p>
            </div>
            <Magnetic>
              <TransitionLink
                href="/contact"
                label="Contact"
                color="coral"
                data-cursor="Talk"
                className="group inline-flex h-16 shrink-0 items-center gap-4 self-start rounded-full bg-ink pl-8 pr-3 text-lg font-semibold text-[#f4f1ea] lg:self-auto"
              >
                Get in touch
                <span className="grid h-10 w-10 place-items-center rounded-full bg-coral text-ink transition-transform duration-300 group-hover:-rotate-45">
                  <ArrowRightIcon size={20} />
                </span>
              </TransitionLink>
            </Magnetic>
          </div>
        </motion.div>
      </div>

      {/* Columns */}
      <div className="container-page mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12 md:gap-x-8">
        <div className="col-span-2 md:col-span-4">
          <p className="font-display text-3xl font-extrabold leading-none tracking-tight">{site.fullName}</p>
          <p className="mt-4 max-w-xs leading-relaxed text-muted">
            {site.role} at {site.company}, building production web applications and AI-powered products.
          </p>
        </div>

        <nav aria-label="Pages" className="md:col-span-2">
          <p className={heading}>Pages</p>
          <ul>
            <li><TransitionLink href="/" label="Home" color="ink" className={link}>Home</TransitionLink></li>
            <li><TransitionLink href="/work" label="Work" color="lime" className={link}>Work</TransitionLink></li>
            <li><TransitionLink href="/about" label="About" color="lilac" className={link}>About</TransitionLink></li>
            <li><TransitionLink href="/contact" label="Contact" color="coral" className={link}>Contact</TransitionLink></li>
          </ul>
        </nav>

        <nav aria-label="Projects" className="md:col-span-3">
          <p className={heading}>Selected work</p>
          <ul>
            {projects.slice(0, 5).map((p) => (
              <li key={p.slug}>
                <TransitionLink href={`/work/${p.slug}`} label={p.name} color={p.color} className={link}>
                  {p.name}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Elsewhere" className="md:col-span-3">
          <p className={heading}>Elsewhere</p>
          <ul>
            <li><SmartLink href={site.github} label="GitHub" className={link}>GitHub</SmartLink></li>
            <li><SmartLink href={site.linkedin} label="LinkedIn" className={link}>LinkedIn</SmartLink></li>
            <li><SmartLink href={emailHref} label="Email" className={link}>Email</SmartLink></li>
            <li><SmartLink href={site.resume} label="Resume" className={link}>Resume</SmartLink></li>
          </ul>
        </nav>
      </div>

      {/* The name, large. Each letter lights up on hover. */}
      <div aria-hidden className="container-page select-none">
        <p className="font-display flex justify-between pt-14 text-[clamp(3rem,min(24vw,19rem),19rem)] font-extrabold leading-[0.78]">
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

      <div className="container-page mt-4 flex flex-col gap-4 border-t border-line py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {site.fullName} · {site.tagline}</p>
        <div className="flex items-center gap-6">
          <p>Built with Next.js</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 font-semibold text-fg"
          >
            Back to top
            <span className="grid h-8 w-8 place-items-center rounded-full border border-line transition-colors group-hover:bg-fg group-hover:text-bg">
              <ArrowDownIcon size={14} className="rotate-180" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
