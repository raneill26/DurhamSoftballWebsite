-- Generated from assets/js/data.js. Safe to re-run.

insert into organizations (id,name,short_name,cause,blurb,logo_url,website,legacy_url,status,sort_order) values
  ('alp416','American Legion Post 416','American Legion Post 416','Veteran services & military families','As the only veterans’ service organization located in Research Triangle Park, American Legion Post 416 relentlessly champions veterans and military members, supports military families, and works hard to meet the unique needs of our community in the South Durham County / Northwest Wake County, North Carolina area.','assets/logos/ALP416.jpg','https://al416nc.wixsite.com/al416nc','https://durhamsoftball.com/teams/american-legion-post-416/','active',0),
  ('bike','Bike Durham','Bike Durham','Safe streets & transit advocacy',null,'assets/logos/bike.jpg',null,'https://durhamsoftball.com/teams/bike-durham/','active',1),
  ('book','BookHarvest','BookHarvest','Books & literacy for every child',null,'assets/logos/BookHarvest.jpg',null,'https://durhamsoftball.com/teams/bookharvest/','active',2),
  ('bcll','Bull City Little League','Bull City Little League','Youth baseball in Durham',null,'assets/logos/bcll.jpg',null,'https://durhamsoftball.com/teams/bull-city-little-league/','active',3),
  ('gotr','Girls on the Run of the Triangle','Girls on the Run of the Triangle','Confidence & health for girls',null,'assets/logos/GOTR.jpg',null,'https://durhamsoftball.com/teams/girls-on-the-run-of-the-triangle/','active',4),
  ('hfnh','Housing for New Hope','Housing for New Hope','Ending homelessness in Durham',null,'assets/logos/HFNH.jpg',null,'https://durhamsoftball.com/teams/housing-for-new-hope/','active',5),
  ('kdb','Keep Durham Beautiful','Keep Durham Beautiful','Litter cleanup & greening',null,'assets/logos/KDB.jpg',null,'https://durhamsoftball.com/teams/keep-durham-beautiful/','active',6),
  ('mow','Meals on Wheels of Durham','Meals on Wheels of Durham','Meals for homebound neighbors',null,'assets/logos/Meals.jpg',null,'https://durhamsoftball.com/teams/meals-on-wheels-of-durham/','active',7),
  ('ncfff','NC Fallen Firefighters Foundation','NC Fallen Firefighters Foundation','Support for firefighter families',null,'assets/logos/NCFFF.jpg',null,'https://durhamsoftball.com/teams/north-carolina-fallen-firefighters-foundation/','active',8),
  ('sdll','South Durham Little League','South Durham Little League','Youth baseball, ages 4-16',null,'assets/logos/SDLL.jpg','https://tshq.bluesombrero.com/sdllnc','https://durhamsoftball.com/teams/south-durham-little-league/','active',9),
  ('aps','Animal Protection Society of Durham','Animal Protection Society of Durham','Shelter & care for ~4,000 animals a year',null,'assets/logos/APS.jpg','https://www.apsofdurham.org/','https://durhamsoftball.com/teams/animal-protection-society-of-durham/','active',10),
  ('bcw','Bull City Woodshop','Bull City Woodshop','Woodworking education & access',null,'assets/logos/BCW.jpg',null,'https://durhamsoftball.com/teams/bull-city-woodshop/','active',11),
  ('hope','Hope Animal Rescue','Hope Animal Rescue','Rescue & rehoming',null,'assets/logos/HAR.jpg',null,'https://durhamsoftball.com/teams/hope-animal-rescue/','active',12),
  ('josh','Josh’s Hope','Josh’s Hope','Young adult mental health',null,'assets/logos/JoshsHope.jpg',null,'https://durhamsoftball.com/teams/joshs-hope/','active',13),
  ('mlt','Miracle League of the Triangle','Miracle League of the Triangle','Baseball for children with special needs',null,'assets/logos/Miracle.jpg','https://www.mltriangle.com/','https://durhamsoftball.com/teams/miracle-league-of-the-triangle/','active',14),
  ('nccadv','NC Coalition Against Domestic Violence','NC Coalition Against Domestic Violence','Survivor advocacy statewide',null,'assets/logos/NCCADV.jpg',null,'https://durhamsoftball.com/teams/north-carolina-coalition-against-domestic-violence/','active',15),
  ('porch','PORCH-Durham','PORCH-Durham','Hunger relief food drives',null,'assets/logos/PORCH.jpg',null,'https://durhamsoftball.com/teams/porch-durham/','active',16),
  ('spa','Senior PharmAssist','Senior PharmAssist','Medication help for seniors',null,'assets/logos/Pharm.jpg',null,'https://durhamsoftball.com/teams/senior-pharmassist/','active',17),
  ('umd','Urban Ministries of Durham','Urban Ministries of Durham','Food, shelter & clothing',null,'assets/logos/UMD.jpg',null,'https://durhamsoftball.com/teams/urban-ministries-of-durham/','active',18),
  ('v2v','Vets To Vets United','Vets To Vets United','Veteran peer support',null,'assets/logos/V2V.jpg',null,'https://durhamsoftball.com/teams/vets-to-vets-united/','active',19),
  ('c2c','Crayons2Calculators','Crayons2Calculators','School supplies for classrooms',null,'assets/logos/C2C.jpg',null,'https://durhamsoftball.com/teams/crayons2calculators/','inactive',20),
  ('dbyal','Durham Bulls Youth Athletic League','Durham Bulls Youth Athletic League','Youth athletics in Durham',null,'assets/logos/DBYAL.jpg',null,'https://durhamsoftball.com/teams/durham-bulls-youth-athletic-league/','inactive',21),
  ('fmf','Families Moving Forward','Families Moving Forward','Housing for families',null,'assets/logos/FMF.jpg',null,'https://durhamsoftball.com/teams/families-moving-forward/','inactive',22),
  ('plaync','Play NC','Play NC','The non-profit that runs the league',null,'assets/logos/PlayNC.jpg',null,'https://durhamsoftball.com/teams/play-nc/','inactive',23),
  ('presdur','Preservation Durham','Preservation Durham','Historic preservation',null,'assets/logos/PD.jpg',null,'https://durhamsoftball.com/teams/preservation-durham/','inactive',24),
  ('swing','SwingPals','SwingPals','Golf and mentorship for youth',null,'assets/logos/SwingPals.jpg',null,'https://durhamsoftball.com/teams/swingpals/','inactive',25),
  ('cpcanc','Central Piedmont Community Action','Central Piedmont Community Action','Community action agency',null,'assets/logos/CPCAP.jpg',null,'https://durhamsoftball.com/teams/central-piedmont-community-action-of-north-carolina/','former',26),
  ('dwd','Don’t Waste Durham','Don’t Waste Durham','Waste reduction',null,'assets/logos/DWD.jpg',null,'https://durhamsoftball.com/teams/dont-waste-durham/','former',27),
  ('treesd','TreesDurham','TreesDurham','Tree planting and canopy',null,'assets/logos/Trees.jpg',null,'https://durhamsoftball.com/teams/treesdurham/','former',28)
  on conflict (id) do update set name=excluded.name, short_name=excluded.short_name,
    cause=excluded.cause, logo_url=excluded.logo_url, website=excluded.website,
    legacy_url=excluded.legacy_url, status=excluded.status;

-- blurb is intentionally NOT overwritten on re-run, so admin edits survive.
