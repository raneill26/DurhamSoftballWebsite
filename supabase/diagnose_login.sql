-- ============================================================================
-- Why is a passcode being rejected? Run this whole file and read the output.
-- ============================================================================

-- 1. Where does pgcrypto live, and can crypt() be reached at all?
select e.extname, n.nspname as installed_in
from pg_extension e join pg_namespace n on n.oid = e.extnamespace
where e.extname = 'pgcrypto';

-- 2. Do the login functions exist, and what search_path are they pinned to?
select p.proname,
       pg_get_function_identity_arguments(p.oid) as args,
       p.proconfig as settings
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('admin_login','team_login','set_admin_passcode','set_team_passcode')
order by p.proname;

-- 3. Can anon actually execute them?
select p.proname, has_function_privilege('anon', p.oid, 'execute') as anon_may_call
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname in ('admin_login','team_login')
order by p.proname;

-- 4. Is an admin passcode actually stored?
select case when passcode_hash is null then 'NO ADMIN PASSCODE SET'
            else 'admin passcode is set' end as admin_state
from admin_settings;

-- 5. How many teams have a passcode?
select count(*) filter (where passcode_hash is not null) as teams_with_passcode,
       count(*) as teams_total
from teams;

-- 6. Prove crypt() round-trips. Expect: true
select crypt('test-value', gen_salt('bf', 10)) is not null as crypt_works;
