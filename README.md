# IU National Pan-Hellenic Council Website

Production website for the National Pan-Hellenic Council at Indiana
University Bloomington — the campus council of the Divine Nine, the nine
historically Black international Greek-letter organizations. Built to be
maintained by non-technical student officers after handoff: all content is
edited through an embedded CMS studio, and every operational task is
documented in [HANDOFF.md](./HANDOFF.md).

**Status:** feature-complete on curated placeholder data; awaiting the live
Sanity project, Vercel deployment, and council-verified content. See
[docs/BASELINE.md](./docs/BASELINE.md) for the audit trail.

## Features

- **Eight chapter pages** (`/organizations/[slug]`) with researched founding
  data, chapter status (active/inactive with editable status notes), colors,
  founders, and per-chapter events — statically generated, 404 on unknown slugs
- **Events** with URL-shareable filters, automatic upcoming/past split derived
  from the start time (never stored), timezone-pinned formatting
  (`America/Indiana/Indianapolis`), per-event **.ics calendar downloads**, and
  Event JSON-LD
- **Spam-resistant contact form**: Zod validation with per-field accessible
  errors, honeypot + submission-timing checks that return a fake success to
  bots, IP-keyed token-bucket rate limiting, and plain-text email via Resend —
  with graceful degradation when unconfigured
- **Embedded Sanity Studio** at `/studio` (noindexed; access via Sanity project
  membership) with officer-friendly schemas: required alt text on all images,
  publication-approval gate on officer contact info, plain-language field help
- **On-demand revalidation**: a Sanity webhook hits `/api/revalidate`
  (constant-time secret check) and expires exactly the affected content tag —
  publish-to-live in seconds with no redeploy

## Security & accessibility

- Per-request **nonce-based CSP** with `strict-dynamic` (middleware:
  `src/proxy.ts`), scoped relaxation only for the Studio SPA; X-Frame-Options
  DENY, nosniff, strict referrer policy, locked-down Permissions-Policy
- The contact inbox address is a **server-side env var, never CMS content**
  (Sanity datasets are CDN-readable; publishing the inbox would invite spam)
- No raw-HTML block type exists anywhere in Portable Text — editors never get
  an HTML escape hatch
- Skip link, correct heading hierarchy and landmarks, two-color focus ring
  that clears contrast on every surface, persistent `aria-live` form regions,
  Escape-closable mobile nav with focus return, `prefers-reduced-motion`
  respected, single deliberate light theme

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript strict) |
| Styling | Tailwind CSS v4 (CSS-first tokens, IU brand palette) |
| CMS | Sanity 6 + next-sanity (embedded Studio, GROQ, tag revalidation) |
| Email | Resend (contact form) |
| Validation | Zod 4 |
| Tests | Vitest (unit) · Playwright + axe (e2e & accessibility) |
| CI | GitHub Actions: typecheck → lint → unit tests → build |

## Local setup

```bash
nvm use               # Node version from .nvmrc
npm ci
cp .env.example .env.local   # fill in values — every var is documented there
npm run dev           # http://localhost:3000
```

The site runs without any env vars (CMS-less placeholder mode, contact form
degrades gracefully). To connect a real Sanity project and seed it with the
chapter data, follow the comments in `.env.example` and `sanity/seed.ts` —
and read the seed-script warning in [HANDOFF.md](./HANDOFF.md) first.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run test` / `test:watch` | Vitest unit suite |
| `npm run test:e2e` | Playwright smoke, contact-form, and axe a11y specs |

## Deployment & operations

Deployment (Vercel), environment variables per environment, the Sanity
webhook, rollback, and the annual officer-transition ritual are all covered
in [HANDOFF.md](./HANDOFF.md) and
[docs/TRANSITION_CHECKLIST.md](./docs/TRANSITION_CHECKLIST.md).

## Trademarks & content

The code in this repository is MIT-licensed (see [LICENSE](./LICENSE)). The
names, Greek letters, crests, and brand colors of the Divine Nine
organizations, and the NPHC and Indiana University names and marks, belong to
their respective owners and are **not** covered by that license. Photos of
identifiable people require documented consent before publication.

---

Built by [Jose Torres](https://github.com/CNBloo) for the IU National
Pan-Hellenic Council.
