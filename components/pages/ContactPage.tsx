"use client";

import { motion } from "framer-motion";
import { FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/Icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { SmartLink } from "@/components/ui/SmartLink";
import { SplitText } from "@/components/ui/SplitText";
import { site } from "@/data/site";
import { isPlaceholder } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const pill = "inline-flex h-14 items-center gap-2.5 rounded-full border border-line px-7 text-base font-semibold transition-colors hover:bg-fg hover:text-bg";

export function ContactPage() {
  const emailSet = !isPlaceholder(site.email);
  return (
    <div className="relative flex min-h-dvh items-center overflow-hidden pb-20 pt-36">
      {/* Decorative orbit */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-24 hidden h-[34rem] w-[34rem] rounded-full border border-line lg:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {["bg-coral", "bg-lime", "bg-lilac"].map((c, i) => (
          <span key={c} className={`absolute h-8 w-8 rounded-full ${c}`} style={{ top: ["-1rem", "50%", "calc(100% - 1rem)"][i], left: ["50%", "calc(100% - 1rem)", "30%"][i] }} />
        ))}
      </motion.div>

      <div className="container-page relative">
        <h1 className="font-display text-[clamp(3rem,10.5vw,9rem)] font-extrabold leading-[0.95]">
          <SplitText text="Let’s build" />
          <br />
          <SplitText text="something useful." delay={0.2} />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7, ease: EASE }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-muted"
        >
          Whether you’re hiring, building a product, or want to talk engineering and AI, I’d be happy to connect.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7, ease: EASE }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <Magnetic>
            {emailSet ? (
              <a href={`mailto:${site.email}`} className={`${pill} border-transparent bg-lime text-ink hover:bg-lime hover:text-ink`}>
                <MailIcon size={20} /> {site.email}
              </a>
            ) : (
              <span className={`${pill} border-dashed border-coral text-coral hover:bg-transparent hover:text-coral`}>
                <MailIcon size={20} /> [ADD EMAIL]
              </span>
            )}
          </Magnetic>
          <Magnetic><SmartLink href={site.linkedin} label="LinkedIn" className={pill}><LinkedInIcon size={20} /> LinkedIn</SmartLink></Magnetic>
          <Magnetic><SmartLink href={site.github} label="GitHub" className={pill}><GitHubIcon size={20} /> GitHub</SmartLink></Magnetic>
          <Magnetic><SmartLink href={site.resume} label="Download resume" download className={pill}><FileIcon size={20} /> Resume</SmartLink></Magnetic>
        </motion.div>
      </div>
    </div>
  );
}
