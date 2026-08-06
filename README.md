# Durham Softball - Redesign Prototype (v2)

Open **`index.html`** in a browser. No build step, no server. All nav links work.

## What changed in v2

**Fixed the double navigation bar.** A header rule (`.site-header .wrap`) had higher CSS
specificity than the mobile drawer's `display:none`, so the drawer rendered at desktop width and
laid itself out as a flex row - which is why "About Us" and "Donation Pool" were wrapping onto two
lines. The top bar now uses its own `.header-bar` class, and the drawer is hard-hidden above
1040px. There's a regression check for this in the verification script.

**Calmed the palette.** v1 had five colors competing: navy, lime, orange, blue A-league pills, and
purple B-league pills. Now it's deep navy, **one** accent (clay orange) for calls to action, and a
muted gold reserved *only* for the HOME marker - so the yellow means something instead of just
being decoration. League badges are neutral outlines. Green and red appear only where they carry
information (run differential, streaks).

**Photos lead the design.** Full-bleed game photo behind the hero and every page header, a photo
band on the homepage, real photos on the About sponsorship cards, and a dedicated `photos.html`
gallery. The dark navy is now a frame for the images rather than competing with them.

**Real schedule - all 80 games.** Pulled from the official 2026 Summer Calendar (whose own
subtitle reads "Home vs. Away", confirming first-listed = home). Validated: 8 game days × 10
games, no team or time collisions, every team exactly 4 home / 4 away, zero cross-league
matchups, every game keeps its real game ID and links back to the live game page. No placeholders
anywhere.

**Team pages.** `team.html?id=<team>` gives each team their full 8-game schedule with home/away
tagged per game, their record, and their charity. Team names are clickable from the schedule
cards, the standings tables, and the partner grid. Spot-checked against the live American Legion
Post 416 page - dates, times, opponents, and game IDs all match.

**@PlayDurham X feed** on the homepage, with a fallback: if X blocks or stalls the embed (which it
often does), a clean card appears within 4 seconds pointing at the profile and Facebook instead of
leaving a blank hole.

## Pages

`index` · `schedule` · `standings` · `teams` · `team` (detail) · `photos` · `about` · `rules` ·
`directions` · `donations`

## The home/away fix

Four reinforcing signals on every matchup: standard away-on-top order, explicit `HOME`/`AWAY`
tags, the home row tinted with a gold rail, and "Home team bats last" on every card. Home and away
are stored as explicit fields in the data - never positional.

## Still honest about

- **Standings show 0-0** because the season genuinely opens Aug 16. A "Sample results" toggle
  previews a populated table.
- **Past seasons** are in the standings season picker, but only 2026 Summer has real data in this
  site. Earlier seasons link out to the current WordPress pages until their results are imported.
- **Champions page** lists only Spring 2025, the one season with a check photo I could find. I did
  not invent a champions list. Add the rest under `CHAMPIONS` in `assets/js/data.js` (season, team,
  photo) and they appear automatically.
- **Photo season tags** are inferred from the league's own file names and upload dates, so a few
  probably need correcting. They live in `PHOTOS` in `assets/js/data.js`.
- **Charity write-ups**: only American Legion Post 416 has real text. The other 19 show a cause
  line plus a link to their current page. I did not want to invent copy about real non-profits.

## Application features

Beyond the static pages, the site now has a registration and waiver flow, hosted-checkout payments,
and per-team attendance logging backed by Supabase. See **SETUP.md** for wiring it up.

- `register.html` collects player details, presents the waiver, captures a typed signature, and
  hands off to a payment link
- `team.html` has a captain passcode gate and per-game attendance
- `supabase/schema.sql` is the database, security model, and every function the site calls
- `supabase/seed.sql` loads the season and all 20 teams
- `assets/js/config.js` holds the keys and payment URLs. Blank by default

**The waiver in `assets/js/waiver.js` is a draft and has not been reviewed by a lawyer.** Read the
top of SETUP.md before collecting real signatures.

## Editing

Everything the public site displays comes from `assets/js/data.js`. Teams, the schedule, photos,
champions, and the season archive are all plain arrays in that one file. No HTML needs touching to
update a score, add a photo, or record a champion.

## Shipping

Deployed on Netlify from this repo. `netlify.toml` publishes the repo root with no build step, so
every push to `main` redeploys. HTTPS is automatic.
