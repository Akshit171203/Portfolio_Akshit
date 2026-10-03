export const skillGroups: { name: string; skills: string[] }[] = [
  { name: "Languages", skills: ["JavaScript", "TypeScript", "C++", "Python", "SQL"] },
  {
    name: "Frontend",
    skills: ["React", "Next.js", "HTML", "CSS", "Tailwind CSS", "Framer Motion", "Vite", "Radix UI"],
  },
  { name: "Backend", skills: ["Node.js", "Express.js", "REST APIs", "Socket.IO"] },
  { name: "Databases", skills: ["PostgreSQL", "Redis", "Drizzle ORM"] },
  {
    name: "AI / GenAI",
    skills: ["LLM APIs", "RAG", "Retrieval", "AI Agents", "Prompt Engineering", "TTS", "AI product integration"],
  },
  { name: "DevOps / Infra", skills: ["Docker", "Git", "GitHub Actions", "Vercel", "Render"] },
];

/** Two rows for the scrolling marquee. */
export const skillRows: string[][] = [
  ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite", "Radix UI", "JavaScript"],
  ["Node.js", "Express.js", "PostgreSQL", "Redis", "Socket.IO", "LLM APIs", "RAG", "AI Agents", "Docker"],
];
