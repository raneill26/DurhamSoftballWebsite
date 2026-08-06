-- ============================================================================
-- Durham Softball - Supabase schema
-- Run once in the Supabase SQL editor (Dashboard > SQL Editor > New query).
--
-- Security model
--   * The browser only ever uses the ANON key. That is safe by design, but ONLY
--     because every table has Row Level Security on and no policies, so direct
--     table access is denied. All access goes through the functions below.
--   * Team passcodes are bcrypt hashed, never sent to the browser.
--   * The service_role key must NEVER appear in this repo or any page.
-- ============================================================================

create extension if not exists pgcrypto;

create table if not exists seasons (
  id          text primary key,
  label       text not null,
  starts_on   date,
  is_current  boolean not null default false
);

create table if not exists teams (
  id            text primary key,
  name          text not null,
  league        text not null check (league in ('A','B')),
  season_id     text not null references seasons(id) on delete cascade,
  passcode_hash text,
  created_at    timestamptz not null default now()
);

create table if not exists players (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  email       text not null,
  phone       text,
  team_id     text references teams(id) on delete set null,
  season_id   text not null references seasons(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (email, season_id)
);

-- One signed waiver per player per season.
create table if not exists waivers (
  id               uuid primary key default gen_random_uuid(),
  player_id        uuid not null references players(id) on delete cascade,
  season_id        text not null references seasons(id) on delete cascade,
  waiver_version   text not null,
  signed_name      text not null,
  signed_at        timestamptz not null default now(),
  -- Evidence for ESIGN / UETA: exactly what they agreed to, and that they meant it.
  agreed_text_hash text not null,
  signature_image  text,   -- data URL of the drawn signature, null if typed
  ip_address       inet,
  user_agent       text,
  unique (player_id, season_id)
);

create table if not exists registrations (
  id           uuid primary key default gen_random_uuid(),
  player_id    uuid not null references players(id) on delete cascade,
  season_id    text not null references seasons(id) on delete cascade,
  amount_cents integer,
  currency     text not null default 'usd',
  status       text not null default 'pending'
               check (status in ('pending','paid','refunded','waived')),
  provider     text,
  provider_ref text,
  created_at   timestamptz not null default now(),
  unique (player_id, season_id)
);

create table if not exists attendance (
  id          uuid primary key default gen_random_uuid(),
  game_id     integer not null,
  team_id     text not null references teams(id) on delete cascade,
  player_id   uuid not null references players(id) on delete cascade,
  status      text not null default 'in' check (status in ('in','out','maybe')),
  noted_by    text,
  updated_at  timestamptz not null default now(),
  unique (game_id, player_id)
);

create index if not exists attendance_game_team_idx on attendance (game_id, team_id);
create index if not exists players_team_idx on players (team_id, season_id);

create table if not exists team_sessions (
  token      uuid primary key default gen_random_uuid(),
  team_id    text not null references teams(id) on delete cascade,
  expires_at timestamptz not null default now() + interval '12 hours'
);

-- Deny everything by default. No policies are created on purpose.
alter table seasons       enable row level security;
alter table teams         enable row level security;
alter table players       enable row level security;
alter table waivers       enable row level security;
alter table registrations enable row level security;
alter table attendance    enable row level security;
alter table team_sessions enable row level security;

-- ---------------------------------------------------------------- public read
create or replace function public_teams(p_season text)
returns table (id text, name text, league text, has_login boolean)
language sql security definer set search_path = public as $$
  select t.id, t.name, t.league, (t.passcode_hash is not null)
  from teams t where t.season_id = p_season order by t.name;
$$;

-- ---------------------------------------------------------------- team login
create or replace function team_login(p_team_id text, p_passcode text)
returns table (token uuid, team_id text, team_name text, expires_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare v_hash text; v_name text;
begin
  select passcode_hash, name into v_hash, v_name from teams where id = p_team_id;
  if v_hash is null or not (crypt(p_passcode, v_hash) = v_hash) then
    raise exception 'invalid passcode' using errcode = '28000';
  end if;
  delete from team_sessions where expires_at < now();
  return query
    insert into team_sessions (team_id) values (p_team_id)
    returning team_sessions.token, team_sessions.team_id, v_name, team_sessions.expires_at;
end; $$;

create or replace function session_team(p_token uuid)
returns text language sql security definer set search_path = public as $$
  select team_id from team_sessions where token = p_token and expires_at > now();
$$;

-- ---------------------------------------------------------------- attendance
create or replace function team_roster(p_token uuid, p_game_id integer)
returns table (player_id uuid, full_name text, status text, waiver_signed boolean)
language plpgsql security definer set search_path = public as $$
declare v_team text;
begin
  v_team := session_team(p_token);
  if v_team is null then raise exception 'session expired' using errcode = '28000'; end if;
  return query
    select p.id, p.full_name, coalesce(a.status, 'maybe'),
           exists (select 1 from waivers w where w.player_id = p.id and w.season_id = p.season_id)
    from players p
    left join attendance a on a.player_id = p.id and a.game_id = p_game_id
    where p.team_id = v_team
    order by p.full_name;
end; $$;

create or replace function mark_attendance(
  p_token uuid, p_game_id integer, p_player_id uuid, p_status text, p_noted_by text default null)
returns void language plpgsql security definer set search_path = public as $$
declare v_team text;
begin
  v_team := session_team(p_token);
  if v_team is null then raise exception 'session expired' using errcode = '28000'; end if;
  if not exists (select 1 from players where id = p_player_id and team_id = v_team) then
    raise exception 'player not on this team' using errcode = '42501';
  end if;
  insert into attendance (game_id, team_id, player_id, status, noted_by)
  values (p_game_id, v_team, p_player_id, p_status, p_noted_by)
  on conflict (game_id, player_id)
  do update set status = excluded.status, noted_by = excluded.noted_by, updated_at = now();
end; $$;

-- ---------------------------------------------------------------- registration
create or replace function register_player(
  p_season text, p_full_name text, p_email text, p_phone text, p_team_id text,
  p_waiver_version text, p_signed_name text, p_agreed_hash text, p_user_agent text,
  p_signature_image text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_player uuid;
begin
  if length(trim(p_full_name)) < 2 then raise exception 'name required'; end if;
  if p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'valid email required'; end if;
  if length(trim(p_signed_name)) < 2 then raise exception 'signature required'; end if;

  if p_team_id is not null and not exists (
       select 1 from teams where id = p_team_id and season_id = p_season) then
    raise exception 'unknown team for this season';
  end if;

  insert into players (full_name, email, phone, team_id, season_id)
  values (trim(p_full_name), lower(trim(p_email)), p_phone, p_team_id, p_season)
  on conflict (email, season_id) do update
    set full_name = excluded.full_name, phone = excluded.phone, team_id = excluded.team_id
  returning id into v_player;

  insert into waivers (player_id, season_id, waiver_version, signed_name, agreed_text_hash,
                       user_agent, signature_image)
  values (v_player, p_season, p_waiver_version, trim(p_signed_name), p_agreed_hash,
          p_user_agent, p_signature_image)
  on conflict (player_id, season_id) do nothing;

  insert into registrations (player_id, season_id, status)
  values (v_player, p_season, 'pending')
  on conflict (player_id, season_id) do nothing;

  return v_player;
end; $$;

-- ---------------------------------------------------------------- grants
revoke all on all tables in schema public from anon;
grant execute on function public_teams(text)         to anon;
grant execute on function team_login(text, text)     to anon;
grant execute on function team_roster(uuid, integer) to anon;
grant execute on function mark_attendance(uuid, integer, uuid, text, text) to anon;
grant execute on function register_player(text, text, text, text, text, text, text, text, text, text) to anon;
revoke execute on function session_team(uuid) from anon;

-- ---------------------------------------------------------------- admin only
-- Run from the SQL editor:  select set_team_passcode('alp416', 'legion2026');
create or replace function set_team_passcode(p_team_id text, p_passcode text)
returns void language sql security definer set search_path = public as $$
  update teams set passcode_hash = crypt(p_passcode, gen_salt('bf', 10)) where id = p_team_id;
$$;
revoke execute on function set_team_passcode(text, text) from anon;

-- ============================================================================
-- ADMIN
-- Lets the league owner manage photos and roll the season over without code.
-- Same pattern as team login: one passcode, hashed, server-verified, token.
-- ============================================================================

create table if not exists admin_settings (
  id            boolean primary key default true check (id),
  passcode_hash text
);
insert into admin_settings (id) values (true) on conflict (id) do nothing;

create table if not exists admin_sessions (
  token      uuid primary key default gen_random_uuid(),
  expires_at timestamptz not null default now() + interval '8 hours'
);

create table if not exists photos (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  caption    text,
  season_id  text references seasons(id) on delete set null,
  sort_order integer not null default 0,
  is_wide    boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists champions (
  id        uuid primary key default gen_random_uuid(),
  season_id text references seasons(id) on delete set null,
  label     text not null,              -- 'Spring 2025' when there is no season row
  league    text,
  team_name text,
  photo_url text,
  caption   text
);

alter table admin_settings enable row level security;
alter table admin_sessions enable row level security;
alter table photos         enable row level security;
alter table champions      enable row level security;

-- Set the admin passcode from the SQL editor:
--   select set_admin_passcode('something-long');
create or replace function set_admin_passcode(p_passcode text)
returns void language sql security definer set search_path = public as $$
  update admin_settings set passcode_hash = crypt(p_passcode, gen_salt('bf', 10)) where id;
$$;
revoke execute on function set_admin_passcode(text) from anon;

create or replace function admin_login(p_passcode text)
returns table (token uuid, expires_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare v_hash text;
begin
  select passcode_hash into v_hash from admin_settings where id;
  if v_hash is null or not (crypt(p_passcode, v_hash) = v_hash) then
    raise exception 'invalid passcode' using errcode = '28000';
  end if;
  delete from admin_sessions where expires_at < now();
  return query insert into admin_sessions default values
    returning admin_sessions.token, admin_sessions.expires_at;
end; $$;

create or replace function is_admin(p_token uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from admin_sessions where token = p_token and expires_at > now());
$$;
revoke execute on function is_admin(uuid) from anon;

-- ---------------------------------------------------------------- photos
create or replace function list_photos(p_season text default null)
returns table (id uuid, url text, caption text, season_id text, sort_order integer, is_wide boolean)
language sql security definer set search_path = public as $$
  select p.id, p.url, p.caption, p.season_id, p.sort_order, p.is_wide
  from photos p
  where p_season is null or p.season_id = p_season
  order by p.sort_order, p.created_at desc;
$$;

create or replace function admin_save_photo(
  p_token uuid, p_id uuid, p_url text, p_caption text, p_season text,
  p_sort integer default 0, p_wide boolean default false)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if not is_admin(p_token) then raise exception 'not signed in' using errcode='28000'; end if;
  if p_id is null then
    insert into photos (url, caption, season_id, sort_order, is_wide)
    values (p_url, p_caption, p_season, p_sort, p_wide) returning id into v_id;
  else
    update photos set url=p_url, caption=p_caption, season_id=p_season,
                      sort_order=p_sort, is_wide=p_wide
    where id=p_id returning id into v_id;
  end if;
  return v_id;
end; $$;

create or replace function admin_delete_photo(p_token uuid, p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin(p_token) then raise exception 'not signed in' using errcode='28000'; end if;
  delete from photos where id = p_id;
end; $$;

-- ---------------------------------------------------------------- champions
create or replace function list_champions()
returns table (id uuid, label text, league text, team_name text, photo_url text, caption text)
language sql security definer set search_path = public as $$
  select c.id, c.label, c.league, c.team_name, c.photo_url, c.caption
  from champions c order by c.label desc;
$$;

create or replace function admin_save_champion(
  p_token uuid, p_id uuid, p_label text, p_league text,
  p_team text, p_photo text, p_caption text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if not is_admin(p_token) then raise exception 'not signed in' using errcode='28000'; end if;
  if p_id is null then
    insert into champions (label, league, team_name, photo_url, caption)
    values (p_label, p_league, p_team, p_photo, p_caption) returning id into v_id;
  else
    update champions set label=p_label, league=p_league, team_name=p_team,
                         photo_url=p_photo, caption=p_caption
    where id=p_id returning id into v_id;
  end if;
  return v_id;
end; $$;

create or replace function admin_delete_champion(p_token uuid, p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin(p_token) then raise exception 'not signed in' using errcode='28000'; end if;
  delete from champions where id = p_id;
end; $$;

-- ---------------------------------------------------------------- seasons
create or replace function list_seasons()
returns table (id text, label text, starts_on date, is_current boolean, team_count bigint)
language sql security definer set search_path = public as $$
  select s.id, s.label, s.starts_on, s.is_current,
         (select count(*) from teams t where t.season_id = s.id)
  from seasons s order by s.starts_on desc nulls last, s.id desc;
$$;

-- Roll the league into a new season. Optionally carry the current teams over,
-- which is the normal case: same charities, fresh records.
create or replace function admin_new_season(
  p_token uuid, p_id text, p_label text, p_starts date,
  p_copy_teams boolean default true, p_make_current boolean default true)
returns text language plpgsql security definer set search_path = public as $$
declare v_prev text;
begin
  if not is_admin(p_token) then raise exception 'not signed in' using errcode='28000'; end if;
  if p_id is null or length(trim(p_id)) = 0 then raise exception 'season id required'; end if;

  select id into v_prev from seasons where is_current limit 1;

  insert into seasons (id, label, starts_on, is_current)
  values (trim(p_id), p_label, p_starts, false)
  on conflict (id) do update set label = excluded.label, starts_on = excluded.starts_on;

  if p_copy_teams and v_prev is not null then
    insert into teams (id, name, league, season_id)
    select t.id || '-' || trim(p_id), t.name, t.league, trim(p_id)
    from teams t where t.season_id = v_prev
    on conflict (id) do nothing;
  end if;

  if p_make_current then
    update seasons set is_current = false;
    update seasons set is_current = true where id = trim(p_id);
  end if;

  return trim(p_id);
end; $$;

create or replace function admin_set_current_season(p_token uuid, p_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin(p_token) then raise exception 'not signed in' using errcode='28000'; end if;
  update seasons set is_current = false;
  update seasons set is_current = true where id = p_id;
end; $$;

create or replace function admin_set_team_passcode(p_token uuid, p_team_id text, p_passcode text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin(p_token) then raise exception 'not signed in' using errcode='28000'; end if;
  update teams set passcode_hash = crypt(p_passcode, gen_salt('bf', 10)) where id = p_team_id;
end; $$;

-- ---------------------------------------------------------------- grants
grant execute on function admin_login(text)                       to anon;
grant execute on function list_photos(text)                       to anon;
grant execute on function list_champions()                        to anon;
grant execute on function list_seasons()                          to anon;
grant execute on function admin_save_photo(uuid, uuid, text, text, text, integer, boolean) to anon;
grant execute on function admin_delete_photo(uuid, uuid)          to anon;
grant execute on function admin_save_champion(uuid, uuid, text, text, text, text, text) to anon;
grant execute on function admin_delete_champion(uuid, uuid)       to anon;
grant execute on function admin_new_season(uuid, text, text, date, boolean, boolean) to anon;
grant execute on function admin_set_current_season(uuid, text)    to anon;
grant execute on function admin_set_team_passcode(uuid, text, text) to anon;

-- ============================================================================
-- Storage bucket for uploaded photos.
-- Create a PUBLIC bucket named "photos" in Dashboard > Storage, then run this
-- so signed-in admins can upload and the public can read.
-- ============================================================================
-- insert into storage.buckets (id, name, public) values ('photos','photos',true)
--   on conflict (id) do nothing;
--
-- create policy "public read photos" on storage.objects
--   for select using (bucket_id = 'photos');
-- create policy "anon upload photos" on storage.objects
--   for insert with check (bucket_id = 'photos');
