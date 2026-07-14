# Annual Officer Transition Checklist

Run this every spring when the web role changes hands. Most items take a
minute each; the whole list is under an hour.

## Accounts

- [ ] Rotate the council Google account password; update the council's
      transition records with the new one
- [ ] Sanity (manage.sanity.io → project → Members): remove graduated
      officers, invite the new webmaster as **Editor** (Administrator only
      for the actual web chair)
- [ ] GitHub organization: remove graduated members, add new ones
- [ ] Confirm the Vercel login still works from the council account
- [ ] Confirm the Resend dashboard shows the sending domain as **verified**
- [ ] Domain registrar: confirm auto-renew is ON and the payment method is
      current (an expired card here takes the whole site down)

## Site health

- [ ] Click through every page: home, About, Member Organizations (and one
      chapter page), Executive Board, Events, Resources, Contact
- [ ] Submit a test message through the contact form; confirm it arrives at
      the council inbox
- [ ] Log in at `/studio`, make a trivial edit (e.g. tweak a FAQ), publish,
      and confirm it appears on the live site within a minute; revert it
- [ ] Check GitHub → Pull Requests for a Dependabot backlog; merge the green
      ones or ask a CS-major member to review
- [ ] Check Vercel → Deployments: latest deployment green

## Content

- [ ] Update Executive Board entries (with written permission for any
      published contact info or photos)
- [ ] Archive or delete stale events; add the fall calendar
- [ ] Re-check organization statuses (any chapter returning or going
      inactive? Update status + status note)
- [ ] Review the outstanding verification list in HANDOFF.md — can any
      approximate colors or missing dates be confirmed this year?

## Handoff hygiene

- [ ] Walk the incoming webmaster through HANDOFF.md end to end
- [ ] Confirm they can log into every service in the "What runs where" table
- [ ] Update HANDOFF.md if anything in it has drifted from reality
