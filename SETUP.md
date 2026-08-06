# Setup guide

The site runs fine with none of this done. Registration, the waiver, and attendance simply show a
"not connected yet" notice until you finish step 1.

---

## The waiver

`assets/js/waiver.js` now holds the league's **real** waiver text, transcribed verbatim from the
Jotform already in use (form `210598080020042`). All six statements are reproduced word for word,
and each is a separate required checkbox, matching the paper form.

Do not reword it casually. The site hashes this exact text at signing time and stores the hash, so
you can prove precisely what any given player agreed to. Changing one character changes the hash.
If the wording is updated, change it in both places and bump `WAIVER_VERSION` in
`assets/js/config.js`.

**Still worth a lawyer's eye.** Text that has been in use is not the same as text that has been
reviewed. Two things specifically:

- **Anyone under 18 needs a parent or guardian to sign.** Neither the Jotform nor this form handles
  that. Both assume every player is an adult. This one asks the signer to confirm they are 18+.
- How long signed waivers must be kept, and who is allowed to see them.

### Keeping Jotform, or replacing it

You can do either.

**Replace it** (what is built now): registration, waiver, and team assignment happen in one step,
and waiver status flows straight into the attendance screen so captains see who has not signed. One
database, no per-signature cost.

**Keep Jotform**: no migration, and it captures a drawn signature rather than a typed one, which is
slightly stronger evidence. The catch is that attendance would not know who has signed unless we
wire a Jotform webhook into the database. That is a Netlify Function and maybe an hour of work.

### One thing to fix on the Jotform either way

Its team dropdown is out of date. It still lists six organisations that are not in the 2026 season:
Crayons2Calculators, Durham Bulls Youth Athletic League, Families Moving Forward, Play NC,
Preservation Durham, and SwingPals. It is also titled "2025 Durham Softball Player Liability Waiver"
while the body says 2026.

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
