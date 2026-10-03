/**
 * Central personal configuration.
 *
 * Every value that is "mine" lives here. Anything still wrapped in `[ADD …]`
 * is a placeholder: the UI renders it as a clearly-marked, non-clickable chip
 * instead of a dead link. Replace the value and it becomes a real link.
 */

export const MY_NAME = "Akshi";
export const MY_TITLE =
  "Software Engineer | Full Stack Developer | AI-Integrated Applications";
export const MY_EMAIL = "[ADD EMAIL]";
export const MY_GITHUB = "[ADD GITHUB URL]";
export const MY_LINKEDIN = "[ADD LINKEDIN URL]";
/** Drop your PDF at public/resume.pdf (or point this at a hosted URL). */
export const MY_RESUME = "/resume.pdf";
export const MY_LOCATION = "[ADD LOCATION]";
/** Path under /public or a remote URL. Leave null to hide the portrait. */
export const MY_PROFILE_IMAGE: string | null = "/profile.jpg";

export type ProjectUrls = { github?: string; live?: string };

/**
 * Per-project links, keyed by project slug.
 * Omit a key to hide that link; use "[ADD PROJECT URL]" to show a visible placeholder.
 */
export const PROJECT_URLS: Record<string, ProjectUrls> = {
  followuphub: {
    github: "https://github.com/Akshit171203/FollowUpHub",
    live: "https://follow-up-hub.vercel.app",
  },
  corover: { live: "https://corover.ai" },
};

export const site = {
  name: MY_NAME,
  title: MY_TITLE,
  role: "Full Stack Web Developer",
  company: "CoRover",
  since: "January 2025",
  tagline: "Software Engineer · Full Stack · AI",
  email: MY_EMAIL,
  github: MY_GITHUB,
  linkedin: MY_LINKEDIN,
  resume: MY_RESUME,
  location: MY_LOCATION,
  profileImage: MY_PROFILE_IMAGE,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Software engineer and full stack developer building production web applications with React, Next.js, TypeScript, Node.js, PostgreSQL and AI-powered applications.",
} as const;
