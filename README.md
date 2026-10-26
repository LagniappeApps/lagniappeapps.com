# lagniappeapps.com

Company website for LAGNIAPPE SOLUTIONS LLC. Static HTML/CSS, no client-side JavaScript,
no cookies, no analytics, no third-party resources (enforced by a Content-Security-Policy
meta tag and a CI check). Hosted free on GitHub Pages.

## Layout

- `content/*.md`: page text. `privacy-habit-tracker.md` and `terms-habit-tracker.md` are Legal's
  habit tracker drafts with the company-site edits applied (see `legal/EDITS.md`). The app name
  isn't locked, so the build fails if the working app name appears anywhere in `_site/`.
- `legal/`: verbatim copies of the source drafts (habit-tracker `master` @ adf0013) for diffing.
- `public/`: static files copied as-is (`styles.css`, `404.html`, `CNAME`, `robots.txt`).
- `scripts/build.mjs`: renders `content/` to `_site/` (Node 22, no dependencies).

## Build locally

```bash
GO_LIVE_DATE="November 2, 2026" node scripts/build.mjs --strict
python3 -m http.server -d _site 8000   # or any static server
```

Links are relative, so the site works both at `https://soaringindian.github.io/<repo>/`
and at `https://lagniappeapps.com/` (only `404.html` uses root paths).

## Deploy

`.github/workflows/pages.yml` builds on every PR and deploys `main` to GitHub Pages
(ubuntu runners, no schedules, about 1 minute per run). The build fails until the
`GO_LIVE_DATE` repository variable is set: use the real go-live date, never a past date.

## Updating a policy

Bump "Last updated", add a line to the policy's "Version history", and for material
changes also set a new "Effective" date (not earlier than the publish date). Legal
re-reviews the text diff first. URLs never change: `/privacy/<app-slug>/`, `/terms/<app-slug>/`.

## Pages

| URL | Purpose |
| --- | --- |
| `/` | Home |
| `/contact/` | Email only |
| `/support/` | Support placeholder |
| `/privacy/` | Company privacy hub (website hosting, emails, rights, contact) |
| `/privacy/habit-tracker/` | Habit tracker app privacy policy (App Store / Play URL) |
| `/terms/` | Terms hub |
| `/terms/habit-tracker/` | Habit tracker app Terms of Use |
| `/delete/` | Data deletion (Legal guidance §4) |
| `/s/` | Static placeholder for future in-app links. Has no scripts, so it can never read, log or send the URL fragment (`#t=..&k=..`); `noindex`, `no-referrer`. |
