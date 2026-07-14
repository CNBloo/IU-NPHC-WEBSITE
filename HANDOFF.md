# Officer Handoff Guide

This guide is for the next IU NPHC webmaster / web chair. It assumes you can
follow instructions carefully but does **not** assume coding experience.
Anything that genuinely requires a developer is marked as such.

> **Status note:** the site is not yet deployed. Sections marked *(pending
> setup)* become fully accurate once the Sanity project, Vercel deployment,
> Resend account, and domain exist. Update this file with real URLs at launch.

## What runs where

| Service | What it does | Where to log in |
|---|---|---|
| **Vercel** *(pending setup)* | Hosts the website; every push to `main` deploys automatically | vercel.com |
| **Sanity** *(pending setup)* | Stores all editable content (organizations, events, officers, FAQs); edited through the site's own `/studio` page | sanity.io/manage |
| **Resend** *(pending setup)* | Sends contact-form submissions to the council inbox | resend.com |
| **GitHub** *(pending setup)* | Stores the code and runs automated checks | github.com |
| **Domain registrar** *(pending setup)* | Owns the site's web address | (registrar chosen at purchase) |

## Day-to-day operations (no code needed)

All content editing happens at **`<site URL>/studio`** after logging in with a
Sanity account that has been invited to the project:

- **Add or edit an event** — Studio → Events. Set the start date/time in
  Bloomington local time; the site automatically files it under "Past" once
  the time passes. Leave "End" blank if there's no firm end time.
- **Edit an organization** — Studio → Organizations. The **status** field
  (Active/Inactive) controls the badge on the site; when a chapter is
  inactive, fill in the **status note** (e.g. expected return) — it shows on
  the listing and the chapter's page.
- **Add an officer** — Studio → Officers. **Email and phone appear on the
  site ONLY when "Approved for publication" is checked. Never check it
  without the officer's written OK.**
- **Update FAQs / site settings** — Studio → FAQs / Site Settings. Every
  image requires alt text (a one-line description for screen readers); the
  Studio will not let you publish without it.
- **Read contact-form messages** — they arrive by email at the address in
  `CONTACT_RECIPIENT_EMAIL` (see below). They are not stored anywhere else.

Published changes appear on the live site within seconds — no deploy needed.
If an edit doesn't show up after a minute, see Troubleshooting.

## Environment variables

These live in **Vercel → Project → Settings → Environment Variables** (and in
a local `.env.local` for developers). `.env.example` in the repo documents
each one. Summary:

| Variable | What breaks if it's wrong |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` | Site can't read any CMS content |
| `SANITY_API_VERSION` | Leave as-is |
| `SANITY_READ_TOKEN` | CMS reads fail (must be a **Viewer** token, never editor/admin) |
| `SANITY_REVALIDATE_SECRET` | Studio edits stop appearing on the live site (must match the webhook secret in manage.sanity.io) |
| `RESEND_API_KEY` | Contact form shows a friendly error instead of sending |
| `CONTACT_RECIPIENT_EMAIL` | Contact messages go to the wrong inbox. **This is deliberately NOT stored in Sanity** — CMS content is publicly readable, and publishing the inbox address would invite spam |
| `CONTACT_SENDER_EMAIL` | Must be a verified sender on the Resend domain |
| `NEXT_PUBLIC_SITE_URL` | Search-engine metadata and sitemap point at the wrong address |
| `SANITY_SEED_TOKEN` | Local-only, for the one-time seed script. **Never set this on Vercel** |

## The seed script (developers only)

`sanity/seed.ts` pre-fills the Sanity dataset with the researched chapter
data in `src/data/`. **Running it again OVERWRITES any edits officers have
made in the Studio.** Rule: it is only ever run once, at initial setup,
before editors start working. After that, treat `src/data/` as historical
reference — the CMS is the source of truth.

## What requires a developer

- Changing page layouts, adding new page types, or changing Sanity schemas
- Dependency updates: Dependabot opens PRs weekly. Safe to merge when the CI
  checks are green and the Vercel preview link looks right. If unsure, leave
  them — they accumulate harmlessly.
- Rate limiting: the contact form allows 5 submissions/minute per visitor,
  in-memory. If real spam ever gets through, the documented upgrade is an
  Upstash/Vercel KV-backed limiter (swap `src/lib/rate-limit.ts`; call sites
  don't change).

## Content the council still needs to verify

- Official colors for Delta Sigma Theta, Sigma Gamma Rho, and Alpha Kappa
  Alpha (currently close approximations, labeled as such on chapter pages)
- Sigma Gamma Rho's IU charter date (currently "not documented")
- Kappa Alpha Psi's return timeline (status note says anticipated 2027)
- Executive board names and photos — **written permission required** before
  publishing anyone's name, photo, email, or phone
- Real photos for the home hero (with consent and usage rights); `/public`
  currently ships no photos and the hero shows brand-color gradients

## Break-glass: something is wrong on the live site

1. **A bad content edit** — Studio → open the document → menu (⋮) → Review
   changes / History → restore an earlier version. Publish.
2. **A bad deploy** *(pending setup)* — Vercel dashboard → Deployments → find
   the last good deployment → ⋯ → **Instant Rollback**.
3. **Studio edits not appearing** — manage.sanity.io → API → Webhooks → check
   the delivery log for failures; confirm the webhook secret matches
   `SANITY_REVALIDATE_SECRET` in Vercel.
4. **Contact form erroring** — check `RESEND_API_KEY` in Vercel and the
   Resend dashboard for a suspended domain/quota.

## Governance: who owns what

**Goal: no single student's personal account owns anything.** If the
webmaster graduates holding all the logins, the site dies with their IU
email. At handoff:

1. Create a **council-owned Google account** (e.g. `iunphc.web@gmail.com`).
   Its password lives in the council's officer-transition records, not with
   one person.
2. That account becomes the owner of: a **GitHub organization** (the repo is
   transferred into it — GitHub preserves history and redirects), the
   **Vercel** account/project, the **Sanity** organization/project, the
   **Resend** account, and the **domain registrar** login.
3. Individual officers are added as *members/editors* on each service and
   removed when they graduate. The council account is the recovery root.

See `docs/TRANSITION_CHECKLIST.md` for the annual ritual.
