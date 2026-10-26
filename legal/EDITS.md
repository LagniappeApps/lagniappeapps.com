# Edits applied for the company site (for Legal's text re-review)

Guidance: `company/legal/reviews/2026-10-26-company-site-legal-pages.md` (company repo): §0–§4 (809a58c) and the "Re-review of EDITS.md" + §R (c4e281c), plus CEO updates of Oct 26 (app name not locked; Sentry not configured).
Source: habit-tracker `master` @ adf0013, `product/legal/privacy.md`, `terms.md` (verbatim copies here as `habit-tracker-*.md`).
Full diff: `diff legal/habit-tracker-privacy.md content/privacy-habit-tracker.md` (same for terms).

**App name:** not locked (CEO). No product name is published. `[APP NAME]` → "our habit tracker app (the "App")" on first mention, then "the App". Titles: "Privacy Policy: our habit tracker app", "Terms of Use: our habit tracker app" (re-review). Neutral slugs, kept permanently: `/privacy/habit-tracker/`, `/terms/habit-tracker/`. The build and CI fail if the working name appears anywhere in `_site/`.

**Waitlist removed (re-review §4).** Verified Oct 26: no Terraform state anywhere on the box (only the committed provider lock files), no `AZURE_*` (or any) Actions secrets/variables/environments on lagniappe-habit-tracker or lagniappe-app-002, and both "Site Deploy" runs (Oct 14) skipped the Azure deploy step because the token secret doesn't exist. No Azure resources, no waitlist table, no sign-ups. Add a waitlist section back as a dated policy update before any form goes live. Brevo, Azure and Microsoft are therefore no longer mentioned anywhere.

## Habit tracker privacy (`content/privacy-habit-tracker.md`)
| Item | Change |
| --- | --- |
| §2.1 | Removed the DRAFT/lawyer banner |
| §2.2 / re-review | Title "Privacy Policy: our habit tracker app"; intro "Our habit tracker app (the "App") is made by…" |
| §2.3 | **Effective** / **Last updated** = `{{GO_LIVE_DATE}}` (actual publish day, set at build); "Version history" added |
| §2.15 | "This policy covers our habit tracker app (the "App") as it works today…" under the dates |
| §2.12 | §1 "Very little from the App, and none of it identifies you." |
| re-review §4 | Waitlist removed: summary bullet, §1 second paragraph, §9 (deleted; §10–§14 renumbered to §9–§13), §10 (now §9) "The website waitlist is for people 16 and older.", §12 (now §11) "If you joined the waitlist…", "Waitlist emails are processed based on your consent", Microsoft and Brevo transfer sentences |
| §R + option A | §5 rewritten as commitments only (text below). §10 (was §11): "Crash reports, if any, are kept by Sentry for a limited time; see section 5." §11 (was §12): Sentry removed from "process data in the United States"; added "Before we turn crash reporting on in a release, we'll update this section with where Sentry processes data and how transfers are protected." Sentry privacy link kept |
| §2.13 | Children section: added Switzerland |
| §2.9 | Contact: removed `[POSTAL ADDRESS …]`; email only |
| §2.8 | Master's crash opt-in paragraph and the short-version crash bullet kept **unchanged** |

### Crash reporting §5 (option A with §R interim text): NEEDS LEGAL APPROVAL

> ## 5. Crash reports (Sentry)
>
> To fix bugs, the App can send crash and error reports to Sentry, a crash-reporting service. This only happens in releases where we've turned it on, and only while "Send crash reports" is on in the App. Before we turn crash reporting on in a release, we'll set Sentry not to store your IP address and update this section with where Sentry stores reports and how long it keeps them.
>
> When crash reporting is on, a report will include only technical details: the error and where in the code it happened, the app version, device model, operating system version, and the screen in the App where it happened. Reports will not contain your name, your email, or an account, and your IP address will not be stored. We will configure the App to remove your habit names and "tiny version" text, file paths on your device, user and network-request details, console logs, and the text of anything you tapped before a report is sent. Crash reports will not be linked to you or used for advertising.
>
> **Crash reports are optional.** _(master's opt-in paragraph and bullets, unchanged)_
>
> Sentry privacy policy: https://sentry.io/privacy/

`/delete` crash row: "(only in releases where crash reporting is turned on, and only while "Send crash reports" is on)" / "Kept by Sentry for a limited time (see our privacy policy)." (§R wording.)

**Option B (not built):** leave crash reporting out until configured: drop the short-version crash bullet, replace §5 with "The App doesn't send crash reports. If we add crash reporting, we'll update this policy and tell you in the App before it's turned on.", drop the crash sentences in §10/§11 and the `/delete` crash row.

When the Developer confirms region, retention, "Prevent Storing of IP Addresses" and `sendDefaultPii: false` (§R), swap in the specific text with a version-history line, before any release ships with `EXPO_PUBLIC_SENTRY_DSN` set.

## Habit tracker terms (`content/terms-habit-tracker.md`)
| Item | Change |
| --- | --- |
| §2.1 | Removed the DRAFT/lawyer banner |
| §2.2 | Title "Terms of Use: our habit tracker app"; "for our habit tracker app (the "App")"; §4 "The App is a habit tool." |
| §2.3 | Effective / Last updated = go-live date; "Version history" added |
| re-review (venue) | §16: "Any dispute will be handled in the state or federal courts located in Seminole County, Florida." EU/EEA/UK/CH consumer carve-out sentence kept unchanged (master has no separate small-claims clause) |
| — | §18 email made a mailto link |

## Company hub `/privacy/` (`content/privacy.md`)
- "This website": re-review §2 wording (GitHub Pages, GitHub, Inc., USA; IP logged and stored for security; GitHub General Privacy Statement link; no cookies, analytics or third-party resources). Azure dropped.
- "Emails you send us": re-review §2 retention and legal-basis wording, plus "Our email is handled in Google Workspace (Gmail), provided by Google." (MX = smtp.google.com). **Legal: confirm the provider sentence.**
- "Your rights" one-liner (re-review §2). "Who we are", app policy list, Contact, Version history.

## `/delete/` (`content/delete.md`)
Guidance §4 with: generic app name; waitlist row removed (re-review §4); crash row per §R; RevenueCat "Purchase records" row = re-review §5 wording verbatim; no sharing content (re-review §3; X9 additions due before v1.2).

## Not from Legal (Deployer/CEO copy)
`/` home (scoped per re-review §6: "Our first app, a habit tracker, keeps your habits on your phone, with no ads and no tracking."; "Our habit tracker app: coming soon"), `/contact/`, `/support/` (terms link per re-review §6), `/terms/` hub, `/s/` placeholder.

## Legal OK, Oct 26 (44c3093 approved with these edits)
- Habit tracker privacy §5 now opens "Crash reporting isn't turned on yet. We plan to use Sentry, a crash-reporting service, to help us find and fix bugs." The "we'll set Sentry not to store your IP address…" and "We will configure the App to remove…" commitments are kept.
- §10 and the `/delete` crash row: "kept by Sentry for a limited time" → "kept by Sentry for a limited period, which we'll state here before crash reporting is turned on."
- `/privacy/` hub: new "Service providers" list naming GitHub, Inc. (GitHub Pages) and Google LLC (Google Workspace), linked to https://policies.google.com/privacy; the email section now says "provided by Google LLC".

## Legal F8, 1f6999f (CEO: v1 ships with no crash reporting, no Sentry DSN)
Source: company `legal/reviews/2026-10-26-privacy-crash-off-v1.md` @ 1f6999f, §4 F8; §5 text from habit-tracker `writer/privacy-v1-no-crash` @ 6a1c556 (`product/legal/privacy.md` §5 paragraph 1 and closing line) plus F1 paragraph 2. Supersedes the option A / §R crash text and the "Legal OK, Oct 26" crash edits above.
- Short-version crash bullet → "No crash reports. This version of the App doesn't send crash reports. If we add them later, we'll update this policy first."
- §5 "Crash reports" → 6a1c556 §5 paragraph 1 + F1 paragraph 2 (phone diagnostics sharing, App Store Connect / Play Console, TestFlight) + closing line. Sentry, region-based opt-in, "Send crash reports" switch text and the Sentry privacy link deleted. The hidden `<!-- Legal: ... -->` note isn't copied (the site build doesn't strip HTML comments); it stays in the app policy source.
- §10 Retention: crash-report sentence deleted.
- §11 EU/UK: "we process crash reports based on your consent (…)" and the "Before we turn crash reporting on…" sentence deleted; now "we process purchase data to provide what you bought (performance of a contract)".
- `/delete`: crash-report row deleted.
- Not applied here (app-policy fixes, outside F8): F3's email legal-basis and "RevenueCat and Google (for our email)" transfer wording. Raise with Legal if the website copy should match.

## Legal F3, Oct 26
- `/privacy/` hub "Emails you send us": Legal's F3 text applied verbatim (Google Workspace (Google LLC); purpose = reply only; legal basis GDPR Art. 6(1)(f) legitimate interest; US processing under the EU-U.S. DPF and its UK and Swiss extensions, or SCCs; link to https://policies.google.com/privacy). It replaces the earlier "Our email is handled in Google Workspace (Gmail)…", "We use it only to reply and to fix problems." and "Where GDPR applies, we rely on our legitimate interest…" sentences. Kept: the opening "If you email us…" sentence, the retention sentence and the Delete your data link. Google LLC stays in "Service providers". The section heading supplies F3's "Emails you send us." lead-in.
