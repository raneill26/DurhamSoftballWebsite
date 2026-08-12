-- ============================================================================
-- Set passcodes. Run in the Supabase SQL editor.
-- Replace every CHANGE-ME before running. Give each captain only their code.
-- ============================================================================

-- 1. Admin passcode (this is the one for /admin.html)
select set_admin_passcode('CHANGE-ME-ADMIN');

-- 2. Team passcodes (captains, for logging attendance)
select set_team_passcode('alp416',                    'CHANGE-ME');   -- American Legion Post 416
select set_team_passcode('aps',                       'CHANGE-ME');   -- Animal Protection Society of Durham
select set_team_passcode('bike',                      'CHANGE-ME');   -- Bike Durham
select set_team_passcode('book',                      'CHANGE-ME');   -- BookHarvest
select set_team_passcode('bcll',                      'CHANGE-ME');   -- Bull City Little League
select set_team_passcode('bcw',                       'CHANGE-ME');   -- Bull City Woodshop
select set_team_passcode('gotr',                      'CHANGE-ME');   -- Girls on the Run of the Triangle
select set_team_passcode('hope',                      'CHANGE-ME');   -- Hope Animal Rescue
select set_team_passcode('hfnh',                      'CHANGE-ME');   -- Housing for New Hope
select set_team_passcode('josh',                      'CHANGE-ME');   -- Josh’s Hope
select set_team_passcode('kdb',                       'CHANGE-ME');   -- Keep Durham Beautiful
select set_team_passcode('mow',                       'CHANGE-ME');   -- Meals on Wheels of Durham
select set_team_passcode('mlt',                       'CHANGE-ME');   -- Miracle League of the Triangle
select set_team_passcode('nccadv',                    'CHANGE-ME');   -- NC Coalition Against Domestic Violence
select set_team_passcode('ncfff',                     'CHANGE-ME');   -- NC Fallen Firefighters Foundation
select set_team_passcode('porch',                     'CHANGE-ME');   -- PORCH-Durham
select set_team_passcode('spa',                       'CHANGE-ME');   -- Senior PharmAssist
select set_team_passcode('sdll',                      'CHANGE-ME');   -- South Durham Little League
select set_team_passcode('umd',                       'CHANGE-ME');   -- Urban Ministries of Durham
select set_team_passcode('v2v',                       'CHANGE-ME');   -- Vets To Vets United

-- 3. Confirm they took. Expect: admin set, and 20 teams with a passcode.
select (select passcode_hash is not null from admin_settings) as admin_set,
       count(*) filter (where passcode_hash is not null) as teams_with_passcode,
       count(*) as teams_total
from teams;
