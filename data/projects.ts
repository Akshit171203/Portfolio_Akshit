import { PROJECT_URLS } from "./site";

export type AccentColor = "coral" | "lime" | "lilac" | "sky" | "butter" | "mint" | "pink";

export type Project = {
  slug: string;
  name: string;
  period?: string;
  kind: string;
  tagline: string;
  points: string[];
  stack: string[];
  /** Shows an [ADD TECH STACK] chip when the stack hasn't been provided. */
  stackPlaceholder?: boolean;
  color: AccentColor;
  note?: string;
  role?: string;
  /** Animated counters shown on the project page. */
  stats?: { to: number; decimals?: number; suffix?: string; label: string }[];
  /** Small caption shown under the stats (e.g. where figures come from). */
  statsNote?: string;
  /** Illustrative flows shown as a lit-up sequence. */
  flows?: { title: string; steps: string[] }[];
  /** Problems hit and how they were solved. */
  challenges?: { title: string; body: string }[];
  /** Design decisions, as short "what and why" pairs. */
  decisions?: { q: string; a: string }[];
  /** Product screenshots (2880x1800). The first one is the hero image. */
  screens?: { src: string; alt: string; caption: string }[];
  /** Where the screenshots come from. */
  screensNote?: string;
  /** A short intro, shown first on the project page. */
  overview?: string[];
  /** "What's inside": a grid of notable parts of the build. */
  features?: { title: string; body: string }[];
};

export const projects: Project[] = [
  {
    slug: "followuphub",
    name: "FollowUpHub",
    period: "Jan 2026 – Present",
    kind: "Full-stack product",
    role: "Sole developer",
    tagline:
      "Follow-up and task automation built around Jira integrations, reminders and real-time notifications.",
    points: [
      "A reminder engine runs every minute. Cooldowns of 60, 15 or 5 minutes depend on the reminder policy, and three escalation levels kick in as a reminder gets ignored (1, 3 and 5 times).",
      "Jira sync runs every 5 minutes: assigned tickets become follow-ups, and tickets closed in Jira are closed here. Level 2+ Jira escalations alert Slack and email the user's manager.",
      "Jira API tokens are stored with AES-256-GCM. Sessions use 5-minute access tokens with rotating refresh tokens in Redis, and a replayed old token revokes the whole session.",
      "Socket.IO pushes notifications to per-user rooms, respecting quiet hours, and streams AI-drafted messages chunk by chunk.",
      "Gemini turns free text into a structured follow-up, drafts follow-up messages, and writes a daily 8am digest.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "REST APIs",
      "Socket.IO",
      "PostgreSQL",
      "Drizzle ORM",
      "Redis",
      "Zod",
      "Gemini API",
      "Docker",
      "GitHub Actions",
      "Vercel",
      "Render",
    ],
    color: "coral",
    stats: [
      { to: 3, label: "escalation levels" },
      { to: 5, suffix: " min", label: "Jira sync interval" },
      { to: 9, label: "PostgreSQL tables" },
      { to: 63, label: "commits" },
    ],
    statsNote: "Counted from the repository.",
    screens: [
      {
        src: "/projects/followuphub/dashboard.webp",
        alt: "FollowUpHub overview dashboard with pipeline counts, urgency breakdown and a six-month bar chart",
        caption: "Overview: pipeline, urgency and six months of activity",
      },
      {
        src: "/projects/followuphub/followups.webp",
        alt: "Follow-ups list showing status, due date, escalation level and ignore count on each card",
        caption: "Each follow-up shows its escalation level and how many reminders were ignored",
      },
      {
        src: "/projects/followuphub/ai-draft.webp",
        alt: "Follow-up detail dialog with the AI Drafting Assistant showing a generated message",
        caption: "Detail view with the AI Drafting Assistant, streamed over Socket.IO",
      },
      {
        src: "/projects/followuphub/ai-quick-add.webp",
        alt: "AI Quick Add dialog with free text parsed into title, assignee and due date fields",
        caption: "AI Quick Add: free text becomes structured fields to review",
      },
      {
        src: "/projects/followuphub/jira.webp",
        alt: "Jira integration page with synced tickets, priority badges and escalation levels",
        caption: "Jira integration: synced tickets with their escalation level",
      },
      {
        src: "/projects/followuphub/notifications.webp",
        alt: "Notification panel with grouped escalation and reminder notifications and an unread count",
        caption: "Notifications grouped per follow-up, with unread counts",
      },
    ],
    screensNote: "Screens are the real frontend running against sample data.",
    flows: [
      {
        title: "Jira to notifications",
        steps: ["Jira API", "Sync job (5 min)", "Follow-ups in PostgreSQL", "Reminder engine", "Socket.IO push"],
      },
      {
        title: "Escalation",
        steps: ["Cron (every minute)", "Overdue follow-ups", "Cooldown check", "Level 1 → 2 → 3", "Slack + manager email"],
      },
      {
        title: "AI draft",
        steps: ["Generate draft", "Gemini stream", "ai:draft:chunk over Socket.IO", "Live text in the UI"],
      },
    ],
    challenges: [
      {
        title: "Email from a host that blocks SMTP",
        body: "Render's free tier blocks outbound SMTP, so Gmail SMTP worked locally and failed in production. I tried Resend, went back to Nodemailer, then moved to the Gmail HTTP API through googleapis with an OAuth2 refresh token. It is plain HTTPS, so the host can't block it.",
      },
      {
        title: "Safari rejected the login cookie",
        body: "The frontend (Vercel) and API (Render) are on different domains, and Safari's tracking prevention drops the cookie, so iPhone and Mac users couldn't sign in. I moved to Bearer tokens in localStorage. The trade-off is that tokens in localStorage are exposed to XSS, so I shortened access tokens to 5 minutes and added rotating refresh tokens with reuse detection.",
      },
      {
        title: "Production-only crashes",
        body: "The API crashed on Render because Node resolved DNS to IPv6. Forcing IPv4-first fixed it. Hard-coded localhost URLs broke OAuth and verification emails until every URL came from the environment.",
      },
      {
        title: "Real-time notifications that misbehaved",
        body: "Duplicate socket listeners, stale closures in optimistic updates, a single throttle shared by every task, and window access during server rendering. Fixed with one-time listener setup, refs, per-group throttling and SSR guards.",
      },
    ],
    decisions: [
      {
        q: "No Redis adapter for Socket.IO",
        a: "The API runs as one instance, so the default in-memory adapter already delivers per-user events. I removed the unused adapter and would add it back once there is more than one process.",
      },
      {
        q: "OAuth without Passport",
        a: "I wrote the Google and GitHub authorization-code flows by hand. GitHub can hide a user's email, so the flow makes a second call to the user emails endpoint.",
      },
      {
        q: "Reconcile Jira instead of trusting it",
        a: "Jira simply stops returning completed tickets. After each sync, any open Jira follow-up that wasn't in the latest response is closed locally and logged to the timeline.",
      },
    ],
  },
  {
    slug: "corover",
    name: "CoRover.ai",
    kind: "Production website",
    role: "Primary developer",
    tagline: "The CoRover.ai company website: a CMS-driven Next.js site that marketing can edit without a deploy.",
    overview: [
      "CoRover.ai is the public website for CoRover's conversational and agentic AI platform and BharatGPT. It is the company's marketing, lead-generation and information hub: products, industries, platform pages, resources, careers and legal pages.",
      "I was the primary developer from the first week of the March 2026 rebuild: 100 of the repository's 107 commits. I built the page templates, moved hardcoded content and the navigation into Sanity, added the forms and mail, hardened the site after a penetration test, and kept it fast with ISR. Careers was a shared effort with a teammate.",
    ],
    points: [
      "Pages are assembled in Sanity from reusable blocks (feature grids, stat bars, CTA banners, FAQs), so a new product page needs no code change. The Studio is embedded in the app at /studio.",
      "Hardcoded pages, the media kit, deck, pricing and the navigation were moved into the CMS, and static images moved to the Sanity CDN, so marketing can change them without a release.",
      "Server-rendered with 60-second ISR, plus a secret-protected revalidation webhook that Sanity calls on publish.",
      "Forms go through API routes: a reCAPTCHA-verified contact form, and submissions stored in Sanity and emailed through Microsoft Graph.",
      "After a penetration test: HSTS, framing and content-type headers, a report-only Content-Security-Policy with its own reporting endpoint, and an allow-list sanitiser for CMS-provided HTML.",
      "Clean URLs: a root-level route turns /brochure into a redirect to the PDF in the CMS, and 54 redirects map legacy URLs to the current structure.",
    ],
    features: [
      { title: "29 routes", body: "Products, industries, functions, platform, business, company (about, careers, investors, media), resources (case studies, newsroom, videos), blog, brochures, deck, pricing and legal pages." },
      { title: "Homepage", body: "A Spline-backed hero, platform stats, tabbed industries and integrations, a capabilities carousel, filterable testimonials and a video section." },
      { title: "Blog", body: "Portable Text rendering with tables and a generated table of contents." },
      { title: "Navigation from the CMS", body: "The header merges the Sanity navigation with a static fallback, and normalises links so a pasted absolute URL can't break routing." },
      { title: "Cookie consent", body: "A dialog with necessary, analytics, marketing and functional categories, stored in localStorage. Analytics and the chatbot load after the page is interactive." },
      { title: "Demo booking and chatbot", body: "Calendly for demo booking, and CoRover's own chatbot widget embedded and loaded lazily." },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Sanity CMS",
      "GROQ",
      "Framer Motion",
      "Spline",
      "shadcn/ui",
      "Microsoft Graph",
      "reCAPTCHA",
    ],
    color: "lime",
    stats: [
      { to: 100, label: "commits by me, of 107 in the repo" },
      { to: 31, suffix: "K+", label: "lines of app code in src/" },
      { to: 42, label: "Sanity schema files (incl. 12 reusable section blocks)" },
      { to: 54, label: "redirects from legacy URLs" },
      { to: 81, suffix: "M+", label: "monthly unique visitors (Cloudflare-observed)" },
      { to: 1.57, decimals: 2, suffix: "B+", label: "requests per month (Cloudflare-observed)" },
    ],
    statsNote:
      "The first four are counted from the repository (March to September 2026). The last two are Cloudflare-observed platform metrics: the scale the site runs at, not traffic I generated.",
    screens: [
      {
        src: "/projects/corover/home.webp",
        alt: "CoRover.ai homepage hero: Enterprise-grade WhatsApp Agents to accelerate and grow your business",
        caption: "Homepage hero",
      },
      {
        src: "/projects/corover/home-industries.webp",
        alt: "Homepage industries section with a tabbed list of industries and the Integrations section below",
        caption: "Homepage: tabbed industries, then integrations",
      },
      {
        src: "/projects/corover/home-capabilities.webp",
        alt: "Homepage capabilities carousel with Customer Support, Human Resources, Sales and Marketing and Finance cards",
        caption: "Homepage: capabilities carousel",
      },
      {
        src: "/projects/corover/product-page.webp",
        alt: "BharatGPT product page header with description and feature badges",
        caption: "Product page, rendered from a Sanity document",
      },
      {
        src: "/projects/corover/feature-grid.webp",
        alt: "BharatGPT page with a numbered grid of six feature cards",
        caption: "Feature grid, one of the reusable CMS section blocks",
      },
      {
        src: "/projects/corover/platform.webp",
        alt: "CoRover.ai platform page: Channels and Integrations Supported, with isometric illustration",
        caption: "Platform page with integrations hero",
      },
    ],
    screensNote: "Screenshots of the live site at corover.ai.",
    flows: [
      {
        title: "Publish flow",
        steps: ["Editor publishes in Sanity Studio", "Webhook", "/api/revalidate", "Next.js cache refreshes", "Visitors see the change"],
      },
      {
        title: "Form submission",
        steps: ["Visitor submits", "API route", "Saved in Sanity", "Email via Microsoft Graph"],
      },
    ],
    challenges: [
      {
        title: "A root-level catch-all that collides with everything",
        body: "The clean-URL route for PDFs lives at the site root, so any page or route handler with the same path breaks the build. I converted it from a route handler to a server component page that returns notFound() for anything unknown.",
      },
      {
        title: "CMS content that breaks local routing",
        body: "Editors sometimes paste absolute URLs (https://corover.ai/page) instead of relative paths, which sends local development to production. The header normalises every navigation link before rendering it.",
      },
      {
        title: "A sanitiser that crashed static builds",
        body: "To fix XSS findings from the pentest I first used isomorphic-dompurify, which crashed static generation. I replaced it with sanitize-html and an explicit allow-list of tags and attributes, which works in both SSG and SSR.",
      },
      {
        title: "Redirects flagged as a large payload",
        body: "Legacy-URL redirects were done inside Server Components, which the pentest flagged. I moved them into next.config as 301s, so they are answered before any page renders.",
      },
    ],
    decisions: [
      {
        q: "Embed the CMS in the app",
        a: "Sanity Studio is served from the same Next.js app at /studio, so editors never leave the domain and there is one deployment to manage.",
      },
      {
        q: "Server Components first",
        a: "Data is fetched on the server and passed down as props, so there is no global client state library. Client state is limited to UI details such as the mobile menu and accordions.",
      },
      {
        q: "ISR plus a webhook, not pure SSR",
        a: "Pages are served from cache and regenerated every 60 seconds, and a publish webhook can refresh a page immediately. That keeps the site fast without making editors wait.",
      },
      {
        q: "Navigation in the CMS, with a fallback",
        a: "Marketing can edit the menu in Sanity, and the header still renders a static version if the CMS data is missing or malformed.",
      },
    ],
  },

  {
    slug: "builder-v2",
    name: "BuilderV2",
    kind: "Internal SaaS",
    tagline: "An internal agentic AI SaaS platform. I built the frontend and its UI architecture.",
    points: [
      "Complex application UI on a reusable component system",
      "State management for agent-oriented product interfaces",
    ],
    stack: ["React", "TypeScript", "Vite", "Zustand", "Radix UI"],
    color: "lilac",
    role: "Frontend engineering and UI architecture",
  },
  {
    slug: "hdfc-translator",
    name: "HDFC Bank Translator",
    period: "Feb – Apr 2026",
    kind: "Enterprise web app",
    tagline: "A localization and translation web application built for HDFC Bank.",
    points: [
      "Frontend engineering for an enterprise application",
      "Localization workflow and user experience",
    ],
    stack: [],
    stackPlaceholder: true,
    color: "sky",
    role: "Frontend engineering",
  },
  {
    slug: "corover-bot-widget",
    name: "CoRover Bot Widget",
    period: "Dec 2025 – Feb 2026",
    kind: "Embeddable widget",
    tagline: "A React bot widget with SSE audio streaming and text-to-speech.",
    points: [
      "Interactive conversational UI with a real-time audio experience",
      "The hard part: streaming and handling asynchronous audio in the browser",
    ],
    stack: ["React", "SSE", "Text-to-speech"],
    color: "butter",
    flows: [{ title: "Audio data path (conceptual)", steps: ["Bot reply", "Text-to-speech", "SSE stream", "Audio chunks", "Playback"] }],
  },
  {
    slug: "bharatgpt",
    name: "BharatGPT Website",
    period: "Jun 2025 – Mar 2026",
    kind: "Corporate website",
    tagline: "Corporate website where I was Lead Frontend Developer.",
    points: [
      "CMS migration and content-driven pages",
      "Frontend architecture and reusable components",
    ],
    stack: ["React", "Next.js", "Sanity CMS"],
    color: "mint",
    role: "Lead Frontend Developer",
  },
  {
    slug: "kanha-ai",
    name: "Kanha AI",
    period: "Feb 2026 – Present",
    kind: "Product experience",
    tagline: "An AI-focused product and marketing experience. Ongoing.",
    points: ["Built with React and Vite"],
    stack: ["React", "Vite"],
    color: "pink",
  },
];

export function getProjectUrls(slug: string) {
  return PROJECT_URLS[slug] ?? {};
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
