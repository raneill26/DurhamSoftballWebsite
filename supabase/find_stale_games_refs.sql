-- ============================================================================
-- Find whatever still references games.home_team_id.
-- Nothing in schema.sql creates it, so it is a leftover object in the database.
-- Run each query on its own: the Supabase editor only shows the last result.
-- ============================================================================

-- 1. FUNCTIONS whose body mentions the old column names
select n.nspname  as schema,
       p.proname  as function_name,
       pg_get_function_identity_arguments(p.oid) as args
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname not in ('pg_catalog','information_schema')
  and p.prosrc ilike '%home_team_id%'
order by 1,2;

-- 2. VIEWS whose definition mentions them
select schemaname, viewname
from pg_views
where definition ilike '%home_team_id%'
  and schemaname not in ('pg_catalog','information_schema');

-- 3. What columns does games actually have right now?
select column_name, data_type
from information_schema.columns
where table_schema='public' and table_name='games'
order by ordinal_position;

-- 4. Any other table with a home_team_id column (a stray copy of games?)
select table_schema, table_name
from information_schema.columns
where column_name = 'home_team_id';
