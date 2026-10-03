"use client";

import { motion } from "framer-motion";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import { TransitionLink } from "@/components/TransitionLink";
import { ArrowRightIcon, ArrowUpRightIcon, FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/Icons";
import { SplitText } from "@/components/ui/SplitText";
import { site } from "@/data/site";
import { isExternal, isPlaceholder } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type Channel = {
  label: string;
  /** What is shown as the value: an address, a handle, or a hint. */
  value: string;
  href?: string;
  /** Unset values in data/site.ts start with [ADD …]; the row is then shown as a clearly-marked, non-clickable placeholder. */
  placeholder: boolean;
  color: "lime" | "sky" | "pink" | "butter";
  icon: ComponentType<{ size?: number }>;
  download?: boolean;
  hint: string;
};

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function channels(): Channel[] {
  const emailSet = !isPlaceholder(site.email);
  const linkedinSet = !isPlaceholder(site.linkedin);
  const githubSet = !isPlaceholder(site.github);
  return [
    {
      label: "Email",
      value: emailSet ? site.email : "[ADD EMAIL]",
      href: emailSet ? `mailto:${site.email}` : undefined,
      placeholder: !emailSet,
      color: "lime",
      icon: MailIcon,
      hint: "The fastest way to reach me",
    },
    {
      label: "LinkedIn",
      value: linkedinSet ? host(site.linkedin) : "[ADD LINKEDIN URL]",
      href: linkedinSet ? site.linkedin : undefined,
      placeholder: !linkedinSet,
      color: "sky",
      icon: LinkedInIcon,
      hint: "Work history and updates",
    },
    {
      label: "GitHub",
      value: githubSet ? `@${site.github.split("/").filter(Boolean).pop()}` : "[ADD GITHUB URL]",
      href: githubSet ? site.github : undefined,
      placeholder: !githubSet,
      color: "pink",
      icon: GitHubIcon,
      hint: "Code, including this portfolio",
    },
    {
      label: "Resume",
      value: "Download the PDF",
      href: isPlaceholder(site.resume) ? undefined : site.resume,
      placeholder: isPlaceholder(site.resume),
      color: "butter",
      icon: FileIcon,
      download: true,
      hint: "One page, kept up to date",
    },
  ];
}

function Row({ c, index }: { c: Channel; index: number }) {
  const Icon = c.icon;
  const shared = "group relative flex items-center gap-4 overflow-hidden rounded-3xl p-5 sm:gap-5 sm:p-6";
  const body: ReactNode = (
    <>
      <span
        aria-hidden
        className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full text-ink transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"
        style={{ background: `var(--${c.color})` } as CSSProperties}
      >
        <Icon size={22} />
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-[0.18em] opacity-60">{c.label}</span>
        <span className={`font-display mt-1 block truncate text-xl font-bold leading-tight sm:text-2xl ${c.placeholder ? "text-coral" : ""}`}>{c.value}</span>
        <span className="mt-0.5 hidden text-sm opacity-60 sm:block">{c.hint}</span>
      </span>
      {!c.placeholder && (
        <span
          aria-hidden
          className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-current opacity-60 transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-transparent group-hover:bg-ink group-hover:text-lime group-hover:opacity-100"
        >
          <ArrowRightIcon size={18} />
        </span>
      )}
    </>
  );

  const motionProps = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.6 + index * 0.1, duration: 0.7, ease: EASE },
  };

  if (c.placeholder || !c.href) {
    return (
      <motion.li {...motionProps}>
        <span
          role="link"
          aria-disabled="true"
          aria-label={`${c.label} (not set yet)`}
          className={`${shared} cursor-not-allowed border border-dashed border-coral/60`}
        >
          {body}
        </span>
      </motion.li>
    );
  }
  return (
    <motion.li {...motionProps}>
      <a
        href={c.href}
        aria-label={`${c.label}: ${c.value}`}
        download={c.download || undefined}
        {...(isExternal(c.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`${shared} border border-line transition-colors duration-500 hover:border-transparent hover:text-ink`}
        onMouseEnter={(e) => (e.currentTarget.style.background = `var(--${c.color})`)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "")}
      >
        {body}
      </a>
    </motion.li>
  );
}

export function ContactPage() {
  const list = channels();
  return (
    <div className="relative overflow-hidden pb-24 pt-32 sm:pb-32 sm:pt-40">
      {/* A slow orbit sits behind the page: three dots circling, purely decorative */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-48 top-16 hidden h-[40rem] w-[40rem] rounded-full border border-line opacity-70 lg:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        {["bg-coral", "bg-lime", "bg-lilac"].map((c, i) => (
          <span key={c} className={`absolute h-7 w-7 rounded-full ${c}`} style={{ top: ["-0.875rem", "50%", "calc(100% - 0.875rem)"][i], left: ["50%", "calc(100% - 0.875rem)", "30%"][i] }} />
        ))}
      </motion.div>

      <div className="container-page relative grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
        <section aria-labelledby="contact-title" className="lg:col-span-7">
          <p className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            <span aria-hidden className="h-2 w-2 rounded-full bg-lime" />
            Contact
          </p>
          <h1 id="contact-title" className="font-display text-[clamp(2.75rem,7.2vw,6.25rem)] font-extrabold leading-[0.95] tracking-tight">
            <SplitText text="Let’s build" />
            <br />
            <SplitText text="something useful." delay={0.2} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: EASE }}
            className="mt-8 max-w-lg text-lg leading-relaxed text-muted"
          >
            Whether you’re hiring, building a product, or want to talk engineering and AI, I’d be happy to connect.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <p className="flex items-center gap-3 text-sm font-medium">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-lime" />
              {site.role} at {site.company}, since {site.since}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 text-sm font-semibold"
          >
            <span className="text-muted">Not sure yet? Have a look first:</span>
            <TransitionLink href="/work" label="Work" color="lime" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
              The work <ArrowUpRightIcon size={14} />
            </TransitionLink>
            <TransitionLink href="/about" label="About" color="lilac" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
              About me <ArrowUpRightIcon size={14} />
            </TransitionLink>
          </motion.div>
        </section>

        <section aria-label="Ways to get in touch" className="lg:col-span-5">
          <ul className="space-y-3">
            {list.map((c, i) => (
              <Row key={c.label} c={c} index={i} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
