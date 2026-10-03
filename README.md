# Akshi — Portfolio

A multi-page portfolio (Home, Work, project pages, About, Contact) with a curtain transition between routes. Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion (the only extra dependency).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where to edit

| What | File |
| --- | --- |
| Name, email, GitHub, LinkedIn, resume, location, per-project links | [`data/site.ts`](data/site.ts) |
| Projects (add one by appending an object) | [`data/projects.ts`](data/projects.ts) |
| Skills marquee | [`data/skills.ts`](data/skills.ts) |

## Placeholders

Anything still `[ADD …]` renders as a dashed chip, and its link is disabled instead of dead. Search for `[ADD`.

- `data/site.ts`: `MY_EMAIL`, `MY_GITHUB`, `MY_LINKEDIN`, `MY_LOCATION`, FollowUpHub URLs
- `public/resume.pdf` — not included; add your PDF (or point `MY_RESUME` at a hosted URL)
- HDFC Bank Translator: tech stack

## Motion

- `components/TransitionProvider.tsx` — the route curtain. Use `TransitionLink` for any internal link that should trigger it.
- `Cursor`, `Tilt`, `Magnetic`, `SplitText`, `VelocityMarquee`, `PulseFlow`, `CountUp` live in `components/ui` and are reusable.
- The home page's pinned horizontal showcase falls back to a vertical list on small screens and under reduced motion.

## Notes

- Theme is `[data-theme]` on `<html>`, set before first paint (dark by default). Colours are CSS variables in `app/globals.css`.
- All motion is Framer Motion; `MotionConfig reducedMotion="user"` respects `prefers-reduced-motion`.
- Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) for correct Open Graph, sitemap and robots URLs.
