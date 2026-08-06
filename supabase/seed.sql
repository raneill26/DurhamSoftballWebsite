-- Generated from assets/js/data.js. Safe to re-run.

insert into seasons (id,label,starts_on,is_current) values
  ('2026-summer','2026 Summer','2026-08-16',true)
  on conflict (id) do update set label=excluded.label, is_current=excluded.is_current;

insert into teams (id,name,league,season_id) values
  ('alp416','American Legion Post 416','A','2026-summer'),
  ('bike','Bike Durham','A','2026-summer'),
  ('book','BookHarvest','A','2026-summer'),
  ('bcll','Bull City Little League','A','2026-summer'),
  ('gotr','Girls on the Run of the Triangle','A','2026-summer'),
  ('hfnh','Housing for New Hope','A','2026-summer'),
  ('kdb','Keep Durham Beautiful','A','2026-summer'),
  ('mow','Meals on Wheels of Durham','A','2026-summer'),
  ('ncfff','NC Fallen Firefighters Foundation','A','2026-summer'),
  ('sdll','South Durham Little League','A','2026-summer'),
  ('aps','Animal Protection Society of Durham','B','2026-summer'),
  ('bcw','Bull City Woodshop','B','2026-summer'),
  ('hope','Hope Animal Rescue','B','2026-summer'),
  ('josh','Josh’s Hope','B','2026-summer'),
  ('mlt','Miracle League of the Triangle','B','2026-summer'),
  ('nccadv','NC Coalition Against Domestic Violence','B','2026-summer'),
  ('porch','PORCH-Durham','B','2026-summer'),
  ('spa','Senior PharmAssist','B','2026-summer'),
  ('umd','Urban Ministries of Durham','B','2026-summer'),
  ('v2v','Vets To Vets United','B','2026-summer')
  on conflict (id) do update set name=excluded.name, league=excluded.league;

-- Give every team a passcode. Change these before going live, then
-- hand each captain only their own code.
-- select set_team_passcode('alp416', 'CHANGE-ME');
-- select set_team_passcode('bike', 'CHANGE-ME');
-- select set_team_passcode('book', 'CHANGE-ME');
-- select set_team_passcode('bcll', 'CHANGE-ME');
-- select set_team_passcode('gotr', 'CHANGE-ME');
-- select set_team_passcode('hfnh', 'CHANGE-ME');
-- select set_team_passcode('kdb', 'CHANGE-ME');
-- select set_team_passcode('mow', 'CHANGE-ME');
-- select set_team_passcode('ncfff', 'CHANGE-ME');
-- select set_team_passcode('sdll', 'CHANGE-ME');
-- select set_team_passcode('aps', 'CHANGE-ME');
-- select set_team_passcode('bcw', 'CHANGE-ME');
-- select set_team_passcode('hope', 'CHANGE-ME');
-- select set_team_passcode('josh', 'CHANGE-ME');
-- select set_team_passcode('mlt', 'CHANGE-ME');
-- select set_team_passcode('nccadv', 'CHANGE-ME');
-- select set_team_passcode('porch', 'CHANGE-ME');
-- select set_team_passcode('spa', 'CHANGE-ME');
-- select set_team_passcode('umd', 'CHANGE-ME');
-- select set_team_passcode('v2v', 'CHANGE-ME');
