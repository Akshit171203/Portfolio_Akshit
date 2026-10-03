"use client";

import { motion } from "framer-motion";
import { PulseFlow } from "@/components/ui/PulseFlow";

const STEPS = ["PDF", "Parse", "Chunk", "Embed", "Retrieve", "LLM", "Two voices", "Audio stream"];

export function Building() {
  return (
    <section aria-labelledby="building-title" className="px-3 py-10 sm:px-6 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[80rem] overflow-hidden rounded-[2rem] bg-lime px-6 py-14 text-ink sm:rounded-[3rem] sm:px-14 sm:py-20"
      >
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-lime">
          <motion.span aria-hidden className="h-2 w-2 rounded-full bg-lime" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
          Currently building · not shipped yet
        </p>
        <h2 id="building-title" className="font-display max-w-4xl text-[clamp(2.25rem,6.5vw,5rem)] font-bold leading-[1.02]">
          AI Document → Podcast
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">
          Upload a PDF or article, and get a conversation between two AI voices, streamed back as audio. I’m
          exploring it as a way to go deeper on retrieval, LLMs and text-to-speech inside a real product.
        </p>
        <div className="mt-12">
          <PulseFlow steps={STEPS} fill="var(--ink)" fillText="var(--lime)" idleClass="bg-ink/10" label="Planned pipeline" />
        </div>
      </motion.div>
    </section>
  );
}
