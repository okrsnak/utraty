# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS — no build step, no runtime dependencies. Unit tests via Node's built-in `node:test`. Deployed to GitHub Pages (public repo) as an installable PWA (Safari → Přidat na plochu).

## Users

- **Primary:** the developer's girlfriend. Czech, iPhone. Wants to log every spend right after paying and see where the money went in each pay period (food, dance, rent, …).
- **Secondary:** the developer, also on iPhone, with their own separate data, own payday and own categories.

Logging happens on the go, one-handed, seconds after paying (shop counter, after dance class). Reviewing happens in the evening or around payday.

## Product Purpose

A personal spending log counted in pay periods. Open → type the amount → tap a category → done. The period summary answers "kolik jsem utratila za jídlo / tanec / nájem a kolik celkem" at a glance. Success means she is still logging after the first month.

## Positioning

Periods follow the payday, not the calendar month (default 10. → 9. of the next month, configurable per person). Entry is a three-tap reflex: no account, no bank connection, no ads.

## Operating Context

iPhone home-screen web app, Czech UI, CZK. Works offline. Each phone keeps its own data in local storage; no server, login or sync. Backup by JSON export/import through the iOS share sheet.

## Capabilities and Constraints

- Entry: amount in CZK (up to 2 decimals), category, date (defaults to today), optional note.
- Any written expense can be edited later in Přehled (amount, category, date, note), with undo (user request); a note can also be added straight from the strip after saving.
- Period starts on the configured payday and includes it; it ends the day before the next payday. Paydays moved by weekends are deliberately ignored. A payday beyond the month's length clamps to the last day.
- Categories: starts with Jídlo, Tanec, Nájem, Ostatní. Users can add, rename and archive; archived categories keep their history.
- Category picking (user request): the most used categories are one-tap labels; a typeable field searches all categories (case- and accent-insensitive), creates a new one when the name does not exist, or offers to restore an archived one.
- Restoring a backup replaces all data, so it asks once inline and can still be undone for a few seconds.
- Damaged records are skipped one by one, never the whole dataset; unreadable data is set aside and can be saved from Nastavení.
- Summary per period: per-category totals and overall total, with navigation to earlier periods.
- Undo after save/delete instead of confirmation dialogs.
- Recurring payments (user request): rent, insurance, subscriptions. Each has a name, amount, category, a frequency (monthly, quarterly, half-yearly, yearly) and a first payment date. They are written automatically on the due day when the app opens; missed ones are caught up and none is ever written twice. Přehled shows the ones still due in the current period as "Ještě přijde".
- Out of scope for now: income / remaining budget, charts, shared budgets or sync.
- Open decisions: app name (working name "Útraty"), final category list ("doladíme spolu").

## Evidence on Hand

No real spending data. Demo and test data must be synthetic.

## Product Principles

1. Logging beats accuracy: an entry takes under five seconds or it will not happen.
2. The pay period is the unit of truth.
3. Private by construction: data never leaves the phone unless she exports it.
4. Forgiving over careful: undo instead of confirmation prompts.
5. Everyday Czech, not finance jargon.

## Accessibility & Inclusion

Used in bright daylight and at night: light and dark. Touch targets at least 44 pt, one-handed reach for the entry flow, respects reduced motion.
