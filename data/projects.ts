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
  screens?: {
    /** Image path, or the poster frame when `video` is set. */
    src: string;
    alt: string;
    caption: string;
    video?: { mp4: string; webm: string };
    /** Small pill shown over the frame, e.g. "Live demo". */
    badge?: string;
    /** Width / height of the image. Defaults to 1.6 (2880x1800). */
    ratio?: number;
  }[];
  /** Where the screenshots come from. */
  screensNote?: string;
  /** A short intro, shown first on the project page. */
  overview?: string[];
  /** "What's inside": a grid of notable parts of the build. */
  features?: { title: string; body: string }[];
  /** How the system works underneath, when the author did not write that layer. Shown with an honest attribution note. */
  architecture?: { title: string; body: string }[];
  architectureNote?: string;
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
        src: "/projects/followuphub/demo-poster.jpg",
        video: { mp4: "/projects/followuphub/demo.mp4", webm: "/projects/followuphub/demo.webm" },
        badge: "Live demo",
        alt: "Screen recording of FollowUpHub: AI Quick Add turns a sentence into a follow-up, an AI draft streams in word by word, and an escalation notification arrives in real time",
        caption: "Live demo: AI Quick Add, a streamed AI draft, and a real-time escalation notification",
      },
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
    screensNote: "The demo and screenshots are the real frontend running against sample data.",
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
    slug: "whatsapp-platform",
    name: "WhatsApp Platform",
    period: "Sep 2026 – Present",
    kind: "Multi-tenant SaaS",
    role: "Frontend engineer: tenant dashboard and superadmin console",
    tagline: "A multi-tenant WhatsApp Business Solution Provider platform. I work on its two frontends: the tenant dashboard and the superadmin console.",
    overview: [
      "A production platform that lets businesses run WhatsApp at scale: Cloud API integration, a visual chatbot flow builder, a live agent inbox, broadcast campaigns, template management, analytics, forms, calling and a public API. Each business is a tenant with its own workspace, team roles and API keys, and resellers and platform operators sit above them.",
      "It is a team product. I joined in September 2026 and work on both frontends: I wrote 48 of the repository's 111 commits, about half of the dashboard's source and roughly two thirds of the superadmin's components. The API, database and workers were written by a teammate, so the section on how the platform works describes what the UIs are built on, not work I authored.",
    ],
    points: [
      "Rebuilt the dashboard's UI foundation: custom components migrated to shadcn/ui and Radix primitives, hardcoded colours replaced with design tokens and CSS variables, and a persisted dark mode.",
      "Upgraded both apps to Next.js 15.5 and React 19 to close critical CVEs, tightened the security config, and moved to strict TypeScript with zero-warning linting.",
      "Broke up the heaviest screens (inbox, flows, broadcasts, contacts, and a 1,209-line superadmin file) into focused components, and redesigned broadcasts with a searchable table and stats.",
      "Made the app accessible and responsive: a dev-only axe auditor, jsx-a11y linting, dark-mode contrast fixes, a mobile sidebar drawer and bottom navigation.",
      "Replaced infinite spinners with request timeouts and a retry screen, and fixed session and auth race conditions.",
      "Built the WhatsApp calling settings and workspace configuration pages, integrated the forms builder, and added the auth showcase with a theme switch.",
    ],
    features: [
      { title: "Live agent inbox", body: "Real-time conversations over Socket.IO, with assignment, notes, status changes and handoff from a bot." },
      { title: "Visual flow builder", body: "Chatbot flows drawn on a React Flow canvas: messages, questions, conditions, API calls, templates and agent handoff." },
      { title: "Broadcasts and scheduling", body: "Campaigns with recipients, duplication, CSV export and scheduled sends." },
      { title: "Contacts, segments and leads", body: "Import with preview, segmentation and a leads view." },
      { title: "Analytics", body: "Summary cards, time series with period comparison, and top questions." },
      { title: "Forms, knowledge and AI", body: "A forms builder with responses, knowledge sources for AI agents, and AI-assisted flow generation." },
      { title: "Calling", body: "WhatsApp calling settings, call permissions and an in-browser WebRTC call UI." },
      { title: "Developers", body: "API keys, webhooks and API integration settings." },
    ],
    architecture: [
      {
        title: "Tenant resolution",
        body: "The tenant comes from the signed JWT's tid claim. A header or subdomain is only a fallback before a token exists, because a header can be spoofed and a signature cannot. Suspended tenants get a 403, tenant and membership lookups are cached in Redis (5 and 2 minutes), and membership is checked separately, so a valid token for a non-member is still rejected.",
      },
      {
        title: "Sessions and tokens",
        body: "Tokens carry the user, tenant, role, session id and the partner and platform-admin claims. The session id ties a token to a Session row, which is how listing and revoking devices works. Expired and invalid tokens return different error codes, so the frontend knows when to refresh.",
      },
      {
        title: "Two kinds of RBAC",
        body: "requireRole is hierarchical, so an Admin passes an Agent check. requirePermission is finer: a member's effective capabilities are the role defaults plus per-user overrides, and Owner always passes. Coarse roles are simple to reason about; capabilities cover the exceptions without inventing new roles.",
      },
      {
        title: "Three tiers above the tenant",
        body: "Tenant user, then partner (a reseller), then platform admin. One gate admits a partner or a platform admin, another admits only the platform admin. That is why the superadmin console has its own auth context and token keys, separate from the dashboard.",
      },
      {
        title: "API keys",
        body: "Machine access to the public API uses wsa_ keys. Only a hash is stored, never the raw key. Keys have scopes, an expiry and revocation, and are bound to a WhatsApp number. The middleware sets the tenant, so downstream code treats the request like a normal tenant request.",
      },
      {
        title: "Rate limiting",
        body: "300 requests per 15 minutes globally and 20 per 15 minutes on auth endpoints, to slow brute force. Counters live in Redis, so the limits hold across several API instances.",
      },
      {
        title: "Webhook authentication",
        body: "Meta signs each payload with HMAC-SHA256. The check uses a constant-time comparison and verifies the signature before trusting the phone number id to pick the tenant, which means the route needs the raw body and is mounted before the JSON parser.",
      },
      {
        title: "Audit log and errors",
        body: "Mutating platform actions write an audit record, and a failed audit write never blocks the operator's action. Errors carry machine-readable codes, and validation and database errors are mapped to consistent, readable responses.",
      },
    ],
    architectureNote:
      "The API, database and workers were written by a teammate. I include this because both frontends are shaped by it, and I work with it every day.",
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Radix UI",
      "TanStack Query",
      "Zustand",
      "React Flow",
      "Socket.IO",
      "Recharts",
      "Vitest",
    ],
    color: "mint",
    screens: [
      {
        src: "/projects/whatsapp-platform/demo-poster.jpg",
        video: { mp4: "/projects/whatsapp-platform/demo.mp4", webm: "/projects/whatsapp-platform/demo.webm" },
        badge: "Walkthrough",
        alt: "Screen recording of the WhatsApp Platform: dashboard overview, a shared inbox conversation, the flow builder, broadcasts, analytics and the superadmin console",
        caption: "Walkthrough: overview, inbox, flow builder, broadcasts, analytics and the superadmin console",
      },
      {
        src: "/projects/whatsapp-platform/overview.webp",
        alt: "WhatsApp Platform dashboard overview with conversation, message, delivery and read-rate cards, a message volume chart and a Broadcast Studio panel",
        caption: "Tenant dashboard: overview with KPIs, message volume and active flows",
      },
      {
        src: "/projects/whatsapp-platform/inbox.webp",
        alt: "Shared team inbox with a conversation list, a chat thread showing bot and agent replies, and a contact side panel",
        caption: "Shared inbox: bot hand-off, agent replies and the contact panel",
      },
      {
        src: "/projects/whatsapp-platform/flow-builder.webp",
        alt: "Visual flow builder with a node palette and a canvas showing a branching order-status bot",
        caption: "Flow builder: drag-and-drop WhatsApp bots on a React Flow canvas",
      },
      {
        src: "/projects/whatsapp-platform/broadcasts.webp",
        alt: "Broadcasts screen with campaign stats, status tabs and a searchable campaigns table",
        caption: "Broadcasts: campaign stats, status tabs and a searchable table",
      },
      {
        src: "/projects/whatsapp-platform/analytics.webp",
        alt: "Analytics screen with sent, delivered, new conversation and bot session cards, a delivery funnel and an AI insights panel",
        caption: "Analytics: delivery funnel and conversation health",
      },
      {
        src: "/projects/whatsapp-platform/admin-dashboard.webp",
        alt: "Superadmin partner dashboard showing central balance and WhatsApp spend by message category",
        caption: "Superadmin: partner balance and spend by message category",
      },
      {
        src: "/projects/whatsapp-platform/admin-platform.webp",
        alt: "Superadmin platform overview with partners, tenants, live WhatsApp accounts, queues, health and kill switches",
        caption: "Superadmin: platform-wide overview, queues, health and kill switches",
      },
      {
        src: "/projects/whatsapp-platform/admin-health.webp",
        alt: "Superadmin platform health page listing infrastructure and worker probes with pass and warning states",
        caption: "Superadmin: platform health probes",
      },
    ],
    screensNote:
      "These are the real dashboard and superadmin frontends running locally against a mock API with made-up sample data. No customer data is shown.",
    stats: [
      { to: 48, label: "commits by me, of 111 in the repo" },
      { to: 40, label: "dashboard pages" },
      { to: 16, label: "superadmin pages" },
      { to: 130, suffix: "+", label: "API endpoints the dashboard consumes" },
    ],
    statsNote: "Counted from the repository. Page and endpoint counts cover both frontends, not only the parts I wrote.",
    flows: [
      {
        title: "A tenant request",
        steps: ["Dashboard", "Express API", "JWT and tenant (Redis cache)", "RBAC", "PostgreSQL"],
      },
      {
        title: "An inbound WhatsApp message",
        steps: ["Meta webhook", "Signature check", "Tenant lookup", "Message handler", "Socket.IO room", "Agent inbox"],
      },
    ],
    challenges: [
      {
        title: "Spinners that never ended",
        body: "API calls had no timeout, so a slow or unreachable server looked like a hung page. I added a 20-second timeout and a retry screen, and made the auth hook tell \"the server can't be reached\" apart from \"the server rejected you\".",
      },
      {
        title: "A network blip logging everyone out",
        body: "Any failed auth check was treated as a lost session. Now only a 401 or 403 ends the session, and sign-out does a full page reload so one user's cached data can never appear for the next person on the same tab.",
      },
      {
        title: "The mobile drawer inherited desktop state",
        body: "On phones the sidebar drawer picked up the desktop \"collapsed to icons\" state and rendered half-empty. I separated the two states and restored the mobile bottom navigation.",
      },
      {
        title: "Dark mode with hardcoded colours",
        body: "Colours were scattered through components, so dark mode produced unreadable combinations. I moved them to design tokens and CSS variables, then fixed the remaining contrast findings.",
      },
    ],
    decisions: [
      {
        q: "shadcn/ui on Radix, not custom components",
        a: "Radix handles focus, keyboard and ARIA behaviour, and shadcn keeps the code in the repo to adapt. It replaced a pile of hand-rolled dialogs and form controls that had rendering bugs.",
      },
      {
        q: "Zustand for client state, TanStack Query for server state",
        a: "Server data stays in the query cache, and small client concerns such as theme, language and the active WhatsApp number moved from React contexts into stores, which avoids re-rendering whole trees.",
      },
      {
        q: "Design tokens before dark mode",
        a: "Theming only works if colours come from one place. Tokens first made dark mode, contrast fixes and the theme switch a small change instead of a rewrite.",
      },
    ],
  },
  {
    slug: "grse-dashboard",
    name: "GRSE Analytics Dashboard",
    period: "Sep – Oct 2026",
    kind: "Analytics dashboard",
    role: "Frontend developer: redesign, analytics wiring and Brand Studio",
    tagline:
      "A chatbot analytics dashboard for CoRover and BharatGPT assistants, re-skinned and rebuilt for a client, with a Brand Studio that themes each new chatbot from one JSON file.",
    overview: [
      "The dashboard shows how a chatbot is used: messages, users, intents, sentiment, devices, where people are, every conversation, feedback and grievances. It started as a React and Vite app for another client's assistant, and the same codebase now serves new chatbots by changing a tenant id and a branding file.",
      "I joined an app that already existed. Teammates wrote the shell, sign-in, tenant config, knowledge base and employee pages. My part, from late September 2026, was the GRSE dashboard: I redesigned the screens and charts, wired them to the analytics APIs, added the grievance and training-feedback tables and PDF reports, and built the Brand Studio and the theme system behind it. By git blame that is about a third of today's code, 24 of 36 commits.",
    ],
    points: [
      "Built Brand Studio: a hidden page where a designer edits colours, gradient, chart and status colours, fonts, corner radius, shadows, logos and copy, and watches the real app update beside it (login or dashboard, desktop or mobile, light or dark), with contrast warnings.",
      "Made the whole UI themeable from one branding.json. Hard-coded colours became CSS variables, and charts, tooltips, the data grid and the map follow the same file. The file can be dropped next to index.html, so a new chatbot needs no rebuild.",
      "Wired the dashboard to 11 analytics endpoints. Each response is mapped to the shape its panel expects, and a failing endpoint shows flagged sample data instead of breaking the page.",
      "Redesigned the charts: a query-trend lollipop with the peak and average marked, a ranked intents donut, heat-row weekly pattern, a returning-users gauge, a dot-matrix device split, a metric explorer, and a live user map with three map styles.",
      "Added conversation, grievance and training-feedback tables on AG Grid with server paging, filters, category chips, row detail, CSV export, and a PDF report built in the browser.",
      "Redesigned the sidebar (grouped navigation, collapsible with hover peek, user card) and the login page, and moved attachment and image links onto short-lived signed URLs.",
    ],
    features: [
      { title: "Brand Studio", body: "Six tabs (colours, charts, surfaces, type, logos, text), a live preview of the real app in a phone or desktop frame, import and export of branding.json." },
      { title: "Theme system", body: "One JSON file drives CSS variables, chart palettes, the map style, fonts from Google Fonts, the favicon and the tab title, and is cached for instant first paint." },
      { title: "Trends and intents", body: "A query trend chart with the peak and average marked, and top intents with a full ranked breakdown, shown under the KPI cards." },
      { title: "Insight panels", body: "Metric explorer, weekly pattern, sentiments, user growth, device split and a language, input and algorithm breakdown." },
      { title: "Live user map", body: "Regions as bubbles with a ranked panel, three map styles, and tap-to-zoom." },
      { title: "Conversations", body: "A server-paged table with filters, a chat viewer, CSV export and a landscape PDF report of the selected range." },
      { title: "Grievances and feedback", body: "Category chips, row detail, signed attachment links and CSV export, plus a training-feedback table for the bot team." },
      { title: "Bot resources", body: "Carousel images and marquee links for the test and production bots, loaded through signed URLs." },
    ],
    architecture: [
      { title: "One app, many chatbots", body: "The signed-in user carries an appId. A config map decides which sidebar tabs and KPI tiles that tenant sees, and an unknown tenant sees only the dashboard." },
      { title: "Sign-in", body: "Credentials, then an OTP step with a captcha, then a bearer token stored in the browser. A gate in the app shell shows the login page until a token exists." },
      { title: "Global date range", body: "A context holds the selected range. Every widget reads it, and changing it refetches all of them." },
      { title: "Same-origin API", body: "The browser calls relative paths. In development Vite proxies them to the UAT server, and in production a reverse proxy does the same." },
    ],
    architectureNote:
      "The app shell, sign-in, tenant config and date-range context were written by teammates before I joined. I include them because everything I built sits on top of them.",
    stack: [
      "React 19",
      "Vite",
      "Tailwind CSS",
      "AG Grid",
      "Recharts",
      "Leaflet",
      "jsPDF",
      "Lucide",
      "ESLint",
    ],
    color: "butter",
    screens: [
      {
        src: "/projects/grse-dashboard/demo-poster.jpg",
        video: { mp4: "/projects/grse-dashboard/demo.mp4", webm: "/projects/grse-dashboard/demo.webm" },
        badge: "Walkthrough",
        alt: "Screen recording of the analytics dashboard: scrolling through charts, the live map, conversations and grievances, switching theme, then editing the look in Brand Studio",
        caption: "Walkthrough: the dashboard, the theme switch and Brand Studio",
      },
      {
        src: "/projects/grse-dashboard/dashboard.webp",
        alt: "Analytics dashboard overview with five KPI cards, a query trend chart and a top intents donut with a ranked list",
        caption: "Overview: KPIs, query trend and top intents",
      },
      {
        src: "/projects/grse-dashboard/insights.webp",
        ratio: 2.317,
        alt: "Metric explorer with a metric rail and area chart, beside a weekly query pattern drawn as heat rows",
        caption: "Metric explorer and weekly pattern",
      },
      {
        src: "/projects/grse-dashboard/live-map.webp",
        ratio: 2.054,
        alt: "Live user map of India with bubble markers, a ranked top-regions panel and Streets, Minimal and Satellite style buttons",
        caption: "Live user map with a ranked regions panel",
      },
      {
        src: "/projects/grse-dashboard/conversations.webp",
        ratio: 1.598,
        alt: "Conversations table with date, time, question, answer, intent and sentiment columns, plus Download CSV and PDF report buttons",
        caption: "Conversations: server paging, CSV and PDF export",
      },
      {
        src: "/projects/grse-dashboard/grievances.webp",
        ratio: 1.5,
        alt: "Grievances table with category filter chips, sortable columns and a category pill on each row",
        caption: "Grievances: category chips, sorting and filters",
      },
      {
        src: "/projects/grse-dashboard/brand-studio.webp",
        ratio: 1.44,
        alt: "Brand Studio with tabbed colour controls on the left and a live preview of the login page on the right",
        caption: "Brand Studio: edit on the left, the real app updates on the right",
      },
      {
        src: "/projects/grse-dashboard/light-theme.webp",
        alt: "The same dashboard overview in the light theme",
        caption: "The light theme, from the same branding file",
      },
    ],
    screensNote:
      "These are the real frontend running locally against a mock API. Every name, number and question is made up, and the map tiles come from OpenStreetMap.",
    stats: [
      { to: 24, label: "commits by me, of 36 in the repo" },
      { to: 5000, suffix: "+", label: "lines of today's code written by me, of about 14,900" },
      { to: 11, label: "analytics endpoints wired to panels" },
      { to: 6, label: "tabs of controls in Brand Studio" },
    ],
    statsNote: "Counted from git blame and the commit log of the repository.",
    flows: [
      {
        title: "Branding a new chatbot",
        steps: ["Open Brand Studio", "Edit colours, fonts and logos", "Check contrast warnings", "Export branding.json", "Drop it beside index.html", "Live with no rebuild"],
      },
      {
        title: "Loading the dashboard",
        steps: ["Pick a date range", "11 analytics calls in parallel", "Map each reply to a panel", "Render the charts", "Flag any panel on sample data"],
      },
    ],
    challenges: [
      {
        title: "Grid filter menus that showed the table through them",
        body: "The data grid's body is transparent, so its filter popup and operator list inherited that and the table text showed behind the menu. I gave the menus a solid surface, border and shadow through the grid's theme settings, in both light and dark.",
      },
      {
        title: "A map API with no coordinates",
        body: "The geo endpoint returned zero for latitude and longitude. I plot the cities I could place from a small lookup and still list every region in the ranked panel, so nothing is hidden.",
      },
      {
        title: "A theme editor that can produce unreadable screens",
        body: "Letting a designer pick any colour makes low-contrast text easy. Studio checks pairs against WCAG contrast ratios and warns, and dark-theme controls use a lighter accent so Studio stays readable while you edit.",
      },
      {
        title: "One failing endpoint should not blank the page",
        body: "A non-OK reply returns null instead of throwing, so the other calls still land. Panels without data fall back to sample data and carry a Pending flag, so a mock is never mistaken for real numbers.",
      },
    ],
    decisions: [
      {
        q: "A JSON file instead of a settings database",
        a: "A branding.json can be reviewed, copied to the next chatbot and replaced on a live server without a rebuild. A database would have needed an admin API for something that changes a few times a year.",
      },
      {
        q: "Layout stays in code, only the look is configurable",
        a: "Which widgets exist and where they sit is code. Letting config rearrange the page would multiply the states to test, and every client so far has wanted the same structure in a different skin.",
      },
      {
        q: "Load the PDF library on demand",
        a: "jsPDF is only fetched when someone presses the PDF report button, so it stays out of the main bundle.",
      },
      {
        q: "Signed URLs that fall back to the original",
        a: "Attachments and images are swapped for short-lived signed links. If that endpoint is unavailable the original link is used, so nothing breaks while the backend catches up.",
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
        src: "/projects/corover/demo-poster.jpg",
        video: { mp4: "/projects/corover/demo.mp4", webm: "/projects/corover/demo.webm" },
        badge: "Live site",
        alt: "Screen recording scrolling through the CoRover.ai homepage: hero, platform, industries, integrations and capabilities",
        caption: "Scroll-through of the live homepage",
      },
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
    screensNote: "Recording and screenshots of the live site at corover.ai.",
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
    period: "Jul 2025 – Present",
    kind: "Internal SaaS",
    role: "Frontend developer: Creative Studio, website chat-widget designer and agent UI",
    tagline:
      "An agentic AI platform for building and deploying conversational agents. I work on its frontend and built its Creative Studio and website chat-widget designer.",
    overview: [
      "BuilderV2 is where a team builds an AI agent: pick the model and voice, write the prompt, add knowledge, tools and intents, test it, and embed it on a website. Around the agents sit chatflows, executions, variables, a human review inbox, telephony, voice cloning, API docs and a fine-tuning studio.",
      "It is a big team codebase with several contributors and about 2,200 commits. I joined in July 2025 and have about 390 of them, which by git blame is about 34,600 of 281,500 lines. The workflow editor and the fine-tuning studio are large sub-apps written mostly by others. Leave those out and my share is about 32,000 of 122,700 lines, roughly a quarter.",
    ],
    points: [
      "Built the Creative Studio from scratch, about 6,700 lines, nearly all of them mine: a tool hub with an image generator, a voice generator, a video enhancer and Spaces, an infinite canvas for planning work.",
      "Built the video enhancer's interface: resumable uploads of large files, job progress over a socket with a polling fallback, a review step before anything is published, and YouTube publishing. The analysis and FFmpeg work happens on the backend.",
      "Built the website chat-widget designer: avatar cropping, colour palettes and per-colour controls, a gradient builder, carousel, image, video and YouTube message settings, a live preview of the widget, and the embed script to copy.",
      "Built the Classic NLP screen: intent categories, intents, training utterances, a confidence threshold and a GenAI fallback switch, with an intent creation sheet and category editing.",
      "Built the Media Hub drawer: upload images or videos or paste a YouTube link, review what the AI tagged, and manage a library of media for the agent.",
      "Shaped the shared UI from the first weeks: consistent layouts across Tools, Chatflows, Agentflows and Variables, mobile and responsive fixes, toasts, confirmation dialogs, loading states, and the sidebar.",
    ],
    features: [
      { title: "Chat-widget designer", body: "Style the website widget with palettes, advanced colours, bubbles and message types, and watch a live preview change as you edit." },
      { title: "Creative Studio", body: "A hub for generating images and voice, enhancing video and planning on a canvas, with pinned tools and projects." },
      { title: "Video enhancer", body: "Upload a video, review the plan the AI proposes, then publish to YouTube. Progress arrives live over a socket." },
      { title: "Spaces", body: "An infinite canvas built on Excalidraw, with templates for flowcharts, mind maps, kanban boards and wireframes, saved per space in the browser." },
      { title: "Image and voice", body: "An image generator with reference slots, aspect ratio and batch count, and a voice generator with a choice of voices." },
      { title: "Classic NLP", body: "Intent-based answers for questions that must be exact, organised into categories and trained from example phrases." },
      { title: "Media Hub", body: "Upload media or a YouTube link for an agent to use in answers, with AI-generated tags and a searchable library." },
      { title: "Agent settings", body: "Pages for the agent, LLMs, voice, data source, security, integrations and analytics, plus usage, support and partners screens." },
    ],
    architecture: [
      { title: "Agents are personas", body: "The agent list and details come from a personas API and are reshaped on the client into one agent model the whole UI shares." },
      { title: "Cookie-based sign-in", body: "The server sets HttpOnly cookies, so the app asks for the profile on load. A 200 means signed in, and route guards read the result from the store." },
      { title: "Two backends", body: "Most calls go through a proxy under the workflow API, while the agentic builder service has its own base URL and is used by Creative Studio and parts of Classic NLP." },
      { title: "Sub-apps in their own folders", body: "The workflow editor and the fine-tuning studio live in separate source folders, and the platform mounts them under its own sidebar." },
    ],
    architectureNote:
      "The sign-in flow, the API layer, the workflow editor and the fine-tuning studio were mostly written by teammates. I include them because everything I built runs inside them.",
    stack: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Radix UI", "Zustand", "Excalidraw", "Socket.IO", "React Flow", "Framer Motion", "Axios"],
    color: "lilac",
    screens: [
      {
        src: "/projects/builder-v2/login.webp",
        alt: "BuilderV2 sign-in page with an email and password form, Google and GitHub sign-in, and a preview of the platform on the left",
        caption: "Sign in: the way into the platform",
      },
      {
        src: "/projects/builder-v2/agent-ui.webp",
        alt: "Website integration screen with Agent UI controls, an Ocean colour palette selected, and a live preview of the blue chat widget",
        caption: "Chat-widget designer: pick a palette and the live preview follows",
      },
      {
        src: "/projects/builder-v2/website-configurator.webp",
        ratio: 1.22,
        alt: "The full widget designer with the Advanced Theme panel open, showing six colour fields beside the live chat preview",
        caption: "Advanced theme: six colour fields drive the widget",
      },
      {
        src: "/projects/builder-v2/classic-nlp.webp",
        alt: "Classic NLP screen with intent categories and an expanded Orders category listing its intents",
        caption: "Classic NLP: categories, intents and training phrases",
      },
      {
        src: "/projects/builder-v2/creative-studio.webp",
        alt: "Creative Studio home with tool cards for image, video, video enhancer, audio, spaces and 3D, plus projects and pinned tools",
        caption: "Creative Studio home: tools, projects and spaces",
      },
      {
        src: "/projects/builder-v2/image-generator.webp",
        alt: "Image generator workspace with model, reference slots, prompt box, aspect ratio and count controls",
        caption: "Image generator: references, prompt, aspect ratio and count",
      },
      {
        src: "/projects/builder-v2/video-enhancer.webp",
        alt: "Video enhancer with a drag-and-drop upload area, a YouTube connection card and a four-step explanation",
        caption: "Video enhancer: upload, enhance, draft and review before publishing",
      },
      {
        src: "/projects/builder-v2/spaces.webp",
        alt: "My Spaces screen listing three canvases and a new space card",
        caption: "Spaces: your canvases in one place",
      },
      {
        src: "/projects/builder-v2/space-templates.webp",
        alt: "Explore Templates screen with flowchart, mind map, kanban board, user journey, wireframe and sprint retro templates",
        caption: "Space templates: start from a ready-made layout",
      },
      {
        src: "/projects/builder-v2/agents.webp",
        alt: "Agents list with names, purposes, status and last-updated times",
        caption: "Agents: the list every workflow starts from",
      },
    ],
    screensNote:
      "This is a company product, so these are stills only, taken from the real frontend running locally against a mock API with made-up agents and data.",
    stats: [
      { to: 390, suffix: "+", label: "commits by me, of about 2,200 in the repo" },
      { to: 34600, suffix: "+", label: "lines in today's code written by me, of about 281,500" },
      { to: 355, label: "source files I have written part of" },
      { to: 6700, suffix: "+", label: "lines in Creative Studio, nearly all of them mine" },
    ],
    statsNote: "Counted from git blame and the commit log. The workflow editor and fine-tuning studio are included in the totals, and I wrote very little of them.",
    challenges: [
      {
        title: "A video that is too big for one request",
        body: "Enhancer uploads can be gigabytes. The UI sends them in resumable chunks sized to what the storage service expects, shows progress, and picks up the job over a socket, falling back to polling if the socket is unavailable.",
      },
      {
        title: "A designer with a lot of settings",
        body: "The widget has colours, sizes, message types and media. Putting them in one store slice and driving the preview from the same state keeps what you edit and what you see from drifting apart.",
      },
      {
        title: "Making a big UI feel like one product",
        body: "Early screens were built one at a time. I went back through Tools, Chatflows, Agentflows, Variables and the agent pages to line up headings, spacing and a four-column layout, then fixed the mobile views.",
      },
    ],
    decisions: [
      {
        q: "Show the plan before publishing",
        a: "The video enhancer ends in a review step. Publishing to someone's YouTube channel cannot be undone quietly, so nothing goes out until the person has seen the title, description and chapters.",
      },
      {
        q: "Keep Spaces in the browser",
        a: "Canvases are saved in the browser, one per space. That makes them open instantly and needs no backend, but they do not sync across devices.",
      },
      {
        q: "Mark unfinished tools honestly",
        a: "Video generation, clip editing and 3D appear in the studio with a Soon Available badge instead of being hidden, so the roadmap is visible without pretending the tools work.",
      },
    ],
  },
  {
    slug: "sra-console",
    name: "SRA Console",
    period: "Sep 2026",
    kind: "Government web app",
    role: "Frontend developer: three-language support, admin screens and ingestion forms",
    tagline:
      "An admin console for the Slum Rehabilitation Authority's document pipeline: upload, track and ask questions. I built its admin screens and Hindi and Marathi support.",
    overview: [
      "SRA Console is a React app where staff of the Slum Rehabilitation Authority, Brihanmumbai (Government of Maharashtra) upload departmental documents, follow each one through an automated pipeline, and then ask questions across them. The pipeline has 14 statuses, from discovered and queued through text extraction, OCR, metadata extraction and indexing to ready, plus a failed state at each stage. Five departments each upload their own document type: allotment letters, Annexure-II, Finance NOCs, Town Planning NOCs and CTSO NOCs.",
      "A teammate wrote the first version, with the dashboard, documents, ingestion, reprocess and chat screens. I joined in September 2026 and made 8 of the branch's 13 commits. By git blame, ignoring one formatting-only commit, that is 3,188 of 6,561 lines, or about 2,000 of 5,380 if the translation files are left out.",
    ],
    points: [
      "Added Hindi and Marathi next to English with react-i18next: about 350 strings per language, a language switcher that remembers the choice, and every screen moved off hard-coded text.",
      "Built the Audit Log: filter by action (sign-in, failed sign-in, view, download, delete, public lookup), user and document, choose 20, 50 or 100 rows, and load more.",
      "Built the Users screen for admins: create a user with a role (admin, operator or viewer) and a department, activate or deactivate accounts, and reset anyone's password.",
      "Built Pipeline Health: queue counts (active, waiting, delayed, failed, paused) and recent jobs, each with a coloured status.",
      "Added change-password and reset-password dialogs that enforce a 12-character password with upper case, lower case, a digit and a symbol, and added email and password checks to sign-in in all three languages.",
      "Extended ingestion with the Town Planning and CTSO document types and an optional DCR sub-rule picker, 33(10) or 33(11), for those and for FC NOCs.",
    ],
    features: [
      { title: "Document pipeline", body: "Every document shows where it is across 14 statuses, with one colour per status shared by pills, badges and bars." },
      { title: "Uploads by department", body: "Each of the five departments uploads its own document type, with an optional DCR sub-rule for NOCs." },
      { title: "Reprocess", body: "Send documents back through the pipeline, one at a time or in bulk by status and document type." },
      { title: "Document Assistant", body: "A chat with quick-start options, replies that can open a document, and voice input." },
      { title: "Users and roles", body: "Admins create accounts, assign a department and a role, switch accounts off and reset passwords." },
      { title: "Audit log", body: "A filterable record of who signed in and who viewed, downloaded or deleted what." },
      { title: "Pipeline health", body: "Queue counts and recent jobs, so a stuck pipeline is easy to spot." },
      { title: "Three languages", body: "English, Hindi and Marathi across every screen, switchable at any time." },
    ],
    architecture: [
      { title: "Admin-only routes", body: "Users, Audit Log and Pipeline Health sit behind a guard and are left out of the menu for anyone who is not an admin." },
      { title: "Token sign-in", body: "A token is kept in the browser, and any 401 clears it and signs the person out everywhere in the app." },
      { title: "A base path", body: "The app is served under a sub-path, and the router and the API client share it." },
      { title: "Codes, not text", body: "The API returns codes such as INDEXING_FAILED, so statuses, document types, roles and departments each map to a translated label." },
    ],
    architectureNote:
      "The first version of the app, the API client, the dashboard and the documents and chat screens were written by a teammate. I include them because everything I built plugs into them.",
    stack: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "React Router", "react-i18next", "Recharts"],
    color: "pink",
    screens: [
      {
        src: "/projects/sra-console/login.webp",
        alt: "SRA Console sign-in page with the Slum Rehabilitation Authority logo, an email and password form, a language switcher and a theme toggle",
        caption: "Sign in, with a language switcher and a theme toggle",
      },
    ],
    screensNote:
      "This is a government client's system, so only the sign-in page is shown, taken from the real frontend running locally. It has no data on it.",
    stats: [
      { to: 8, label: "commits by me, of 13 on the branch" },
      { to: 3188, label: "lines in today's code written by me, of 6,561" },
      { to: 3, label: "languages across every screen" },
      { to: 348, label: "strings translated into each language" },
    ],
    statsNote: "Counted from git blame and the commit log. A formatting-only commit is ignored so it does not count as my work.",
    flows: [
      {
        title: "A document's journey",
        steps: ["Upload", "Validate the file", "Extract text", "OCR if needed", "Extract metadata", "Normalise", "Index", "Ready"],
      },
      {
        title: "Opening an admin page",
        steps: ["Sign in", "Token stored", "Fetch my profile", "Role known", "Admin pages unlock"],
      },
    ],
    challenges: [
      {
        title: "An audit API with no paging",
        body: "The endpoint takes a limit and nothing else. So Load more asks again with a bigger limit and replaces the list, and the screen guesses there is more only when a full page comes back.",
      },
      {
        title: "Admins bounced on refresh",
        body: "After a reload the app does not know the user's role until the profile call returns. The admin guard waits for that, so an admin who refreshes the Audit Log stays on it.",
      },
      {
        title: "Translating a live app",
        body: "Moving every screen to translation keys touched about twenty files in one change. The API sends codes rather than words, so statuses, document types, roles and departments each needed keys of their own.",
      },
    ],
    decisions: [
      {
        q: "English as the fallback",
        a: "If a string is missing in Hindi or Marathi, the screen shows the English text instead of a blank or a raw key, so a late translation never breaks a page.",
      },
      {
        q: "Departments kept as a table in the client",
        a: "There is no API that lists departments, and a department user needs their own document type available to upload. A complete table in the client avoids a screen that cannot be used.",
      },
      {
        q: "Hide admin pages instead of showing errors",
        a: "Someone without admin rights never sees the Users, Audit Log or Pipeline Health links, and a direct visit sends them home.",
      },
    ],
  },
  {
    slug: "hdfc-translator",
    name: "HDFC Bank Translator",
    period: "Jan – Apr 2026",
    kind: "Enterprise web app",
    role: "Full-stack developer: translation service, sign-in and interface",
    tagline:
      "A document translator for HDFC Bank. Upload a PDF or an image and get it back in Hindi, Marathi, Tamil, Telugu or Malayalam with the layout kept.",
    overview: [
      "You upload a PDF or an image, choose the two languages, and watch the original and the translation side by side. For a PDF with real text, the service reads every text block with its position, font size and colour, translates the blocks with Gemini, and writes them back onto the original page in a matching Noto font. A scanned PDF has no text to read, so each page is rendered as an image and translated by Gemini's vision model. Images take the same route.",
      "It is three parts: a FastAPI translation API, a Node sign-in service and a React front end. The repository has 8 commits across two clones, and all of them are mine.",
    ],
    points: [
      "Built the translation API in FastAPI: upload, translate, status and download endpoints, with each job running in the background and reporting a message and a percentage that the interface polls every second.",
      "Made PDF translation keep the layout: text is extracted as blocks with their position, font, size and colour, translated a page at a time with numbered markers so every block lands back in the right place, then written into the original page.",
      "Added a fallback for scanned PDFs and images: when a PDF has no text blocks, each page is rendered at double resolution and translated by the vision model, with prompt rules for tables, bullets, headings and image placeholders.",
      "Supported six languages with the right fonts: Devanagari for Hindi and Marathi, and Tamil, Telugu and Malayalam, with English as a source or a target.",
      "Built the sign-in service on Express 5 and Postgres: sign-up, sign-in, email verification, forgot and reset password, Google and GitHub sign-in, an admin-only route, and Redis rate limits on sign-up, sign-in and password reset.",
      "Built the React interface: sign-in and sign-up pages, a side-by-side Original and Translated workspace with a live progress bar, and downloads as a PDF or as Markdown.",
    ],
    features: [
      { title: "Layout-kept PDFs", body: "The translated PDF has the same pages, positions, sizes and colours as the original, only in the new language." },
      { title: "Scanned documents", body: "Pages with no text are read as images by a vision model, so scans and photos translate too." },
      { title: "Six languages", body: "English, Hindi, Marathi, Tamil, Telugu and Malayalam, each with a font that can draw it." },
      { title: "Live progress", body: "A progress bar and a message such as 'Translating to Hindi' while the job runs." },
      { title: "Side by side", body: "The original and the translation sit next to each other, so the two can be checked line by line." },
      { title: "Export", body: "Download the translated PDF, or the Markdown when the source was an image or a scan." },
      { title: "Sign-in", body: "Email and password, or Google or GitHub, with email verification and password reset." },
      { title: "Rate limits", body: "Sign-up, sign-in, password-reset and resend-verification requests are limited per IP address over a five-minute window." },
    ],
    architecture: [
      { title: "Three services", body: "A Python API for translation, a Node service for accounts and a React app, each started on its own port from one script." },
      { title: "Jobs in memory", body: "Translation jobs are kept in the API's memory for now, which keeps the first version simple but means they do not survive a restart." },
      { title: "Polling", body: "The interface asks for a job's status every second, which is enough to make the progress bar feel smooth." },
      { title: "A font per language", body: "The font is chosen from the target language, because a PDF can only show a script if it embeds a font for it." },
    ],
    stack: ["React 19", "Vite", "Tailwind CSS", "Python", "FastAPI", "Gemini", "PyMuPDF", "WeasyPrint", "Express", "PostgreSQL", "Drizzle ORM", "Redis"],
    color: "sky",
    screens: [
      {
        src: "/projects/hdfc-translator/translated.webp",
        alt: "The translator showing an English sample document on the left and its Hindi translation on the right, with Download Markdown and Export PDF buttons",
        caption: "A finished translation next to its original",
      },
      {
        src: "/projects/hdfc-translator/uploaded.webp",
        alt: "The document settings panel with a PDF uploaded, English to Hindi selected, and the original shown on the left",
        caption: "Upload a file and pick the languages",
      },
      {
        src: "/projects/hdfc-translator/progress.webp",
        alt: "The translation in progress, with a progress bar at 62 percent and a message about translating page 1",
        caption: "Live progress while the job runs",
      },
      {
        src: "/projects/hdfc-translator/login.webp",
        alt: "The sign-in page with CoRover, BharatGPT and HDFC Bank logos, an email and password form, and two feature cards",
        caption: "Sign in",
      },
    ],
    screensNote: "This is a client's tool, so these are stills only. They show a made-up sample document, not real bank content, and come from the real frontend running against a mock API.",
    stats: [
      { to: 8, label: "commits in the repository, all mine" },
      { to: 3, label: "services: translation, sign-in and the interface" },
      { to: 6, label: "languages with matching fonts" },
      { to: 3000, suffix: "+", label: "lines of application code across the three services" },
    ],
    statsNote: "Counted from the commit log and the source files, leaving out tests, lock files and styles.",
    flows: [
      {
        title: "Translating a PDF",
        steps: ["Upload", "Read text blocks", "Translate page by page", "Pick the font", "Rebuild the PDF", "Download"],
      },
      {
        title: "Translating a scan",
        steps: ["Upload", "No text found", "Render each page", "Vision translation", "Markdown preview"],
      },
    ],
    challenges: [
      {
        title: "Translating words without moving them",
        body: "Sending a whole page to a model would lose where each line sat. So every block is numbered, sent with its page for context, and the reply must keep the numbers so each translation goes back to its own box.",
      },
      {
        title: "A PDF that is really a picture",
        body: "A scanned PDF has no text to extract, which would give an empty result. The service notices that no text blocks came back and switches to translating each page as an image.",
      },
      {
        title: "Scripts that need their own fonts",
        body: "A PDF can only show Hindi, Tamil or Malayalam if a font for that script is embedded. The service picks a Noto font from the target language and falls back to Devanagari.",
      },
    ],
    decisions: [
      {
        q: "Read the text first, use vision as a fallback",
        a: "Reading real text keeps each block's original position, size and colour exactly. The vision route returns Markdown, which has no exact positions, so it is used only when there is no text to read.",
      },
      {
        q: "Poll for progress instead of sockets",
        a: "One request a second is simple, and for a job that runs for seconds to a minute it keeps the progress bar moving smoothly.",
      },
      {
        q: "Keep accounts in their own service",
        a: "Sign-in has its own database, cache and rate limits, so the translation API can stay focused on documents.",
      },
    ],
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
    role: "Lead frontend developer",
    tagline:
      "The public website for BharatGPT, CoRover's sovereign AI model. A single-page React site where every section is edited in a CMS.",
    overview: [
      "The site introduces BharatGPT in one long page: a hero, a strip of trusted brands, an introduction, a features section, a benefits grid, a video you can watch in your language, and a footer. Dark and light sections alternate down the page.",
      "None of the words or pictures live in the code. Each section asks a Sanity CMS for its own content, and the CMS's editing studio is built into the site at /studio, so the team can change the copy, swap an image or add a video link without a developer.",
    ],
    points: [
      "Built each section as a React component that fetches its own content from Sanity with a small query: hero, introduction, capabilities, benefits, video and footer, plus site settings for the navigation, logos and the call to action.",
      "Embedded the Sanity Studio at /studio and wrote a schema for every section, so editors can change text, images, links and even a video URL for each language.",
      "Served different images to different screens: the CMS holds separate desktop and mobile versions of the hero, the logos and each feature card, and the layout switches at 1024 pixels.",
      "Alternated dark and light themed sections down the page, and animated each one in as it scrolls into view with Framer Motion.",
      "Built the video section: pick a language and the matching YouTube video plays through the YouTube player API, then the thumbnail returns when it ends.",
      "Wrote migration scripts that moved the original content and images into Sanity, with the write token kept in an environment variable and never in the code.",
    ],
    features: [
      { title: "Hero", body: "A tagline, a three-part headline, a short paragraph, a call to action and a product image, all editable." },
      { title: "Trusted by", body: "A row of partner logos managed as a list in the CMS." },
      { title: "Introduction", body: "A heading with a highlighted word, an image and long paragraphs that fold behind a Read More link." },
      { title: "Capabilities", body: "Feature cards with their own images, some spanning the full width, on a light section." },
      { title: "Benefits", body: "A grid of cards with an icon, a title and a description that react as you hover." },
      { title: "Video in your language", body: "A language picker above a video player, with a different link for each language." },
      { title: "Site settings", body: "The logo for each theme and screen size, the navigation links and the call-to-action button." },
      { title: "Built-in studio", body: "The editing studio lives on the same site, so content changes need no code and no deploy." },
    ],
    architecture: [
      { title: "A static front end", body: "A Create React App site with no server of its own. It builds to plain files and talks only to the CMS." },
      { title: "Content as data", body: "One document type per section in Sanity, read through the CMS's fast read-only CDN." },
      { title: "Studio on the same site", body: "Opening /studio swaps the page for the editing studio, so there is one project to host." },
      { title: "Write access kept out", body: "The site only reads. Anything that writes, such as the migration scripts, needs a token that never ships with the site." },
    ],
    stack: ["React 19", "Create React App", "Sanity CMS", "Framer Motion", "CSS", "YouTube player API"],
    color: "mint",
    screens: [
      {
        src: "/projects/bharatgpt/demo-poster.jpg",
        video: { mp4: "/projects/bharatgpt/demo.mp4", webm: "/projects/bharatgpt/demo.webm" },
        badge: "Scroll-through",
        alt: "Screen recording scrolling through the BharatGPT website: the hero, introduction, features, benefits and video sections",
        caption: "A scroll through the whole page",
      },
      {
        src: "/projects/bharatgpt/introduction.webp",
        alt: "The introduction section with the heading Introducing BharatGPT, a logo image and long paragraphs about the sovereign AI model",
        caption: "The introduction, on a dark section",
      },
      {
        src: "/projects/bharatgpt/features.webp",
        alt: "The light features section with the heading Everything you need to build the agents of the future and two feature cards",
        caption: "Features, on a light section",
      },
      {
        src: "/projects/bharatgpt/capability-cards.webp",
        alt: "Two feature cards with phone mock-ups showing a chatbot type picker and a language picker",
        caption: "Capability cards with their own images",
      },
      {
        src: "/projects/bharatgpt/benefits.webp",
        alt: "A dark grid of benefit cards: versatility, accessibility, accuracy and scalability",
        caption: "The benefits grid",
      },
      {
        src: "/projects/bharatgpt/video-section.webp",
        alt: "The video section headed Ready for a Reveal with a language picker offering English and Hindi",
        caption: "The video section, with a language picker",
      },
    ],
    screensNote: "A public website, shown as it renders from its real code and its live CMS content.",
    stats: [
      { to: 7, label: "sections, each with its own content type in the CMS" },
      { to: 1, label: "studio, built into the site at /studio" },
      { to: 4200, suffix: "+", label: "lines of code and styles" },
    ],
    statsNote: "Counted from the source files I was given. The repository came without its history, so this is size, not a share of the work.",
    flows: [
      {
        title: "Editing the site",
        steps: ["Open /studio", "Change a section", "Publish", "The CDN serves it", "The page shows it"],
      },
      {
        title: "Playing a video",
        steps: ["Pick a language", "Find that language's link", "Press play", "YouTube player loads", "Back to the thumbnail"],
      },
    ],
    challenges: [
      {
        title: "Content that must not live in the code",
        body: "Moving every word and image into the CMS meant a schema for each section and a small query in each component, plus scripts to move the existing content across without retyping it.",
      },
      {
        title: "One page, two screen sizes",
        body: "The same section needs a different image on a phone. The CMS stores both versions, and each component picks the right one when the window is wider or narrower than 1024 pixels.",
      },
      {
        title: "A video for each language",
        body: "Each language has its own link, so the player is built only when someone presses play. When the video ends, the page returns to the thumbnail.",
      },
    ],
    decisions: [
      {
        q: "A CMS instead of a settings file",
        a: "A settings file still needs a developer and a deploy for every edit. A CMS lets the team change the copy themselves, which matters for a site that keeps changing as the product does.",
      },
      {
        q: "The studio on the same site",
        a: "Putting the studio at /studio means one project and one place to deploy, instead of a second site to look after.",
      },
      {
        q: "Alternate dark and light sections",
        a: "A long page on one background gets tiring. Switching theme for the features section gives the page a clear rhythm and marks where a new idea starts.",
      },
    ],
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
