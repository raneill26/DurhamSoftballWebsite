# Setup guide

The site runs fine with none of this done. Registration, the waiver, and attendance simply show a
"not connected yet" notice until you finish step 1.

---

## Before anything else: the waiver needs a lawyer

`assets/js/waiver.js` contains a **draft** waiver. I assembled it from the league's own Rules page
plus the sections a release like this normally has. **It has not been reviewed by an attorney and
it is not legal advice.**

Have a North Carolina attorney review it before you collect a single real signature. Worth raising
with them:

- North Carolina law on enforceability of pre-injury liability releases
- Whether Play NC's insurance carrier requires particular wording
- **Anyone under 18 needs a parent or guardian to sign.** The current form assumes every player is
  18+ and asks them to confirm it. If you ever allow minors, that flow has to be built separately
- How long signed waivers must be kept, and who is allowed to see them

When the wording changes, bump `WAIVER_VERSION` in `assets/js/config.js` so old and new signatures
stay distinguishable in the database.

---

## 1. Supabase (database, free tier is plenty)

1. Create a project at [supabase.com](https://supabase.com). Pick a region near NC.
2. **SQL Editor > New query**, paste all of `supabase/schema.sql`, run it.
3. New query again, paste `supabase/seed.sql`, run it. That loads the season and all 20 teams.
4. Give each team a passcode. In the SQL editor:
   ```sql
   select set_team_passcode('alp416', 'pick-something-here');
   ```
   Repeat per team. `supabase/seed.sql` has a commented line for each one ready to edit.
   Hand each captain only their own code.
5. **Project Settings > Data API**, copy the Project URL and the `anon` / `public` key into
   `assets/js/config.js`.

### On that anon key

It is safe in the repo. It is designed to be public. It is only safe *because* every table has Row
Level Security enabled with no policies, so the key can read and write nothing directly. All access
goes through the `SECURITY DEFINER` functions in the schema.

**Never put the `service_role` key anywhere in this repo.** That one bypasses all security.

---

## 2. Payments

Card details never touch this site. Both options below hand payment off to a processor.

**Stripe** (recommended for fees): create a Payment Link for the season fee, paste the URL into
`REGISTRATION_FEE_URL` in `assets/js/config.js`. Stripe has discounted nonprofit pricing worth
asking about.

**PayPal**: you already use `paypal.me/plaync` and it is wired to `DONATE_URL`. You can use a PayPal
hosted button for the fee too.

Right now a paid fee is not automatically written back to the `registrations` table, so its status
stays `pending`. Closing that loop needs a webhook, which means a Netlify Function. Worth doing once
real money is flowing; not needed to launch.

---

## 3. HTTPS

Already done. Netlify issues and renews a certificate automatically, including on a custom domain.
Nothing to configure.

---

## 4. How the pieces fit

```
Player registers  ->  register.html  ->  register_player()  ->  players + waivers + registrations
                                                                        |
Captain signs in  ->  team.html      ->  team_login()      ->  team_sessions (12hr token)
                                     ->  team_roster()     ->  reads players + waivers
                                     ->  mark_attendance() ->  writes attendance
```

Captains see a "Waiver not signed" flag next to any player without one, so the rule enforces itself
at the field.

---

## 5. Things to decide before launch

- **Assigning players to teams.** `register_player()` creates the player but leaves `team_id` null,
  because you balance teams by hand. Set it in the Supabase table editor, or tell me and I'll build
  a small admin page.
- **Data retention.** Decide how long you keep waivers and attendance, and write it down. You are
  holding names, emails, and phone numbers for 350+ people.
- **Who can see the database.** Supabase access is per-account. Keep the number of people with
  dashboard access small.
- **Passcode rotation.** Shared codes leak. Rotate every season with `set_team_passcode()`.

### What shared passcodes are and are not

Good enough for attendance: low stakes, and captains change every season. **Not** suitable for
anything sensitive. Do not put payment info, waiver PDFs, or personal data behind a shared code. If
you ever need that, we move to real per-captain accounts.
