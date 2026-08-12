-- ============================================================================
-- Set passcodes. Run in the Supabase SQL editor.
-- Replace every CHANGE-ME before running. Give each captain only their code.
-- ============================================================================

-- 1. Admin passcode (this is the one for /admin.html)
select set_admin_passcode('Ryan123');

-- 2. Team passcodes (captains, for logging attendance)
select set_team_passcode('alp416',                    'LEGIONS');   -- American Legion Post 416
select set_team_passcode('aps',                       'PROTECTERS');   -- Animal Protection Society of Durham
select set_team_passcode('bike',                      'BIKERS');   -- Bike Durham
select set_team_passcode('book',                      'HARVESTERS');   -- BookHarvest
select set_team_passcode('bcll',                      'SDLL>');   -- Bull City Little League
select set_team_passcode('bcw',                       'WORKSHOPS');   -- Bull City Woodshop
select set_team_passcode('gotr',                      'RUNNERS');   -- Girls on the Run of the Triangle
select set_team_passcode('hope',                      'HOPEANIMAL');   -- Hope Animal Rescue
select set_team_passcode('hfnh',                      'HOUSING4');   -- Housing for New Hope
select set_team_passcode('josh',                      'HOPEJ');   -- Josh’s Hope
select set_team_passcode('kdb',                       'KEEPDURHAM');   -- Keep Durham Beautiful
select set_team_passcode('mow',                       'WHEEL');   -- Meals on Wheels of Durham
select set_team_passcode('mlt',                       'MIRACLETRI');   -- Miracle League of the Triangle
select set_team_passcode('nccadv',                    'COALITIONNC');   -- NC Coalition Against Domestic Violence
select set_team_passcode('ncfff',                     'NCFIREFIGHTERS');   -- NC Fallen Firefighters Foundation
select set_team_passcode('porch',                     'WELOVEBEER');   -- PORCH-Durham
select set_team_passcode('spa',                       'SENIORPHARM');   -- Senior PharmAssist
select set_team_passcode('sdll',                      'WELOVEMENTOCK');   -- South Durham Little League
select set_team_passcode('umd',                       'URBANDURHAM');   -- Urban Ministries of Durham
select set_team_passcode('v2v',                       'V2VU');   -- Vets To Vets United

select (select passcode_hash is not null from admin_settings) as admin_set,
       count(*) filter (where passcode_hash is not null) as teams_with_passcode,
       count(*) as teams_total
from teams;
