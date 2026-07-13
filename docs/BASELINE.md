# Baseline Audit — July 2026

Snapshot of the codebase state after Phase 1 (initial commit `05a187f`), taken before
the completion work began. Kept in-repo so future maintainers can see what was known,
what was deliberate, and why decisions were made.

## Stack (verified)

- **Next.js 16.2.10** (App Router). Note: Next 16 renamed `middleware.ts` to
  `src/proxy.ts` — the nonce-based CSP there is live middleware, not scaffolding.
- React 19, TypeScript strict, Tailwind v4 (CSS-first `@theme` in `globals.css`;
  there is intentionally no `tailwind.config.*`).
- Sanity 6 + next-sanity 13 (schemas/queries written; connected in the Sanity
  integration phase), Zod 4, Resend (contact email).
- Node 26.2.0 via `.nvmrc`; CI runs typecheck → lint → build on the same version.

At baseline: `npm run typecheck` PASS, `npm run lint` PASS, `npm run build` PASS.

## Architecture decisions — do not overturn without a serious reason

1. **`CONTACT_RECIPIENT_EMAIL` lives in an env var, never in Sanity.** CMS content is
   readable through a public-ish CDN API; putting the destination inbox there would
   leak it to spammers.
2. **In-memory token-bucket rate limiting is deliberate for the MVP.** The documented
   upgrade path (if spam appears or the site outgrows one serverless instance) is
   Upstash / Vercel KV — documented, not built.
3. **Officer email/phone render only when `approvedForPublication` is true.** The gate
   is enforced in the GROQ projection *and* at render time.
4. **Organization `status` (active/inactive) + `statusNote` are editor-editable** so
   officers can reactivate a chapter (e.g. Kappa Alpha Psi) without a code change.
   Iota Phi Theta is intentionally absent — never chartered at IU.
5. **Event past/upcoming is derived from `startDateTime` at render time, never stored.**
6. **No raw-HTML block type exists in Portable Text** — editors never get an HTML
   escape hatch.
7. **The design system (cream/crimson/gold tokens) is refined, not replaced.**
8. **No fabricated content, ever** — no invented chapter history, officer names,
   events, statistics, or testimonials. Placeholders say so explicitly.

## Defect register at baseline

| # | Defect | Resolution |
|---|--------|------------|
| 1 | Dark mode half-broken: `@media (prefers-color-scheme: dark)` remapped tokens but hardcoded `bg-white`/`border-black/*` didn't flip → contrast failures | Dark mode removed; `color-scheme: light` enforced. Redesign is a future-enhancement item |
| 2 | Home "Upcoming Events" was a hardcoded TBD stub disconnected from `src/data/events.ts`; three parallel event-render paths | Unified on a single server `EventCard` |
| 3 | Summer event dates used `-05:00` (EST) instead of `-04:00` (EDT); date formatting had no pinned `timeZone` | Offsets fixed; all formatting goes through `src/lib/dates.ts` pinned to `America/Indiana/Indianapolis` |
| 4 | Gold `#B9975B` focus outline on cream `#EEEDEB` fails 3:1 non-text contrast | Two-part crimson focus ring |
| 5 | Contact form status/alert nodes mounted on demand (unreliable announcement); no per-field errors | Persistent live regions + `aria-invalid`/`aria-describedby` |
| 6 | README was create-next-app boilerplate; `HANDOFF.md` referenced but missing | Both written |
| 7 | Seed docstring said `--with-user-token` but code read undocumented `SANITY_AUTH_TOKEN` | Renamed `SANITY_SEED_TOKEN`, documented in `.env.example` |
| 8 | `siteSettings.heroImage` alt not required; `socialLink.platform` free-text; sparse field descriptions | Schema hardening pass |
| 9 | `styled-components` (Sanity Studio peer dep) only transitively installed | Declared as a dependency |
| 10 | `next.config.ts` comment referenced "middleware.ts" (stale) | Fixed |
| 11 | `OrgCard` was a client `useState` expander rendered once per org | Server-rendered link card to `/organizations/[slug]` |
| 12 | `/50`-opacity muted text contrast-borderline in places | Contrast pass |
| 13 | No `images.remotePatterns` for `cdn.sanity.io` — blocks Sanity images via `next/image` | Added |
| 14 | Officer GROQ fetched `email`/`phone` unconditionally (gate was Studio-visibility only) | Gate enforced inside the GROQ projection too |
| 15 | `/public` empty; all hero photos `src: null` | Blocked on real, consented photos from the council |
| 16 | Rate-limit key (`x-forwarded-for`) is spoofable and collapses to a shared "unknown" bucket | Accepted for MVP (see decision 2) |

## What is deliberately NOT tested

- Visual appearance / snapshot tests — churn outweighs value for a one-developer project.
- Sanity Studio internals — third-party code.
- Resend delivery — third party; our graceful-degradation path when it's absent IS tested.
- React component unit tests — server components are exercised by the Playwright e2e
  suite instead; no React Testing Library.

## Content verification debts (officers, not code)

- Official colors for the four orgs whose `colors[].source` is `"approximate"`.
- Sigma Gamma Rho IU charter date (currently unknown/`null`).
- Kappa Alpha Psi return timeline (statusNote says anticipated 2027).
- Exec board names/photos require written permission before `approvedForPublication`
  is ever checked.
- Real event details; real hero/site photos with subject consent and usage rights.
