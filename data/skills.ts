/**
 * Only technologies found in code I wrote or changed across the projects on this site.
 * Where each one comes from:
 *   Python, FastAPI ............ PDF Translator
 *   SQL, Drizzle, pgvector ..... FollowUpHub, OpsFlow, PDF Translator
 *   BullMQ, Vitest, RAG ........ OpsFlow
 *   TanStack Query ............. WhatsApp platform
 *   Redux, TTS playback ........ BuilderV2
 *   AG Grid .................... GRSE dashboard
 *   Sanity ..................... CoRover.ai, BharatGPT
 *   react-i18next .............. SRA Console
 *   Gemini, streaming .......... FollowUpHub, OpsFlow, PDF Translator
 * Add a skill here only when a project page can back it up.
 */
export const skillGroups: { name: string; skills: string[] }[] = [
  { name: "Languages", skills: ["JavaScript", "TypeScript", "Python", "SQL"] },
  {
    name: "Frontend",
    skills: ["React", "Next.js", "Vite", "HTML", "CSS", "Tailwind CSS", "shadcn/ui", "Radix UI", "Framer Motion"],
  },
  {
    name: "UI & data libraries",
    skills: ["TanStack Query", "Zustand", "Redux", "React Router", "React Flow", "Recharts", "AG Grid", "react-i18next", "Sanity CMS"],
  },
  {
    name: "Backend",
    skills: ["Node.js", "Express.js", "FastAPI", "REST APIs", "Socket.IO", "BullMQ", "JWT auth", "Zod", "Jira API"],
  },
  { name: "Databases", skills: ["PostgreSQL", "Redis", "Drizzle ORM", "pgvector"] },
  {
    name: "AI / GenAI",
    skills: [
      "LLM APIs (Gemini)",
      "RAG",
      "Embeddings",
      "Prompt Engineering",
      "Streaming responses",
      "Vision models",
      "TTS playback",
      "Conversational agent UIs",
      "AI product integration",
    ],
  },
  { name: "DevOps & testing", skills: ["Docker", "Git", "GitHub Actions", "Vercel", "Render", "Vitest"] },
];
