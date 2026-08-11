/* ==========================================================================
   Durham Softball - League data
   All 80 games of the 2026 Summer season are real, transcribed from the
   official 2026 Summer Calendar (which lists "Home vs. Away").
   Validated: 8 game days x 10 games, no team/time collisions,
   every team 4 home / 4 away, no cross-league matchups.
   ========================================================================== */
(function (global) {
  'use strict';

  var CDN = '/assets/logos/';
  var CDN2 = '/assets/Photos/';
  var CHARITY_IMG = '/assets/charities/';   // optional: <org id>.jpg, e.g. aps.jpg

  /* ---------- Teams ---------- */
  var TEAMS = [
    { id:'alp416', name:'American Legion Post 416',        short:'Am. Legion 416',   league:'A', logo:CDN+'ALP416.jpg',    url:'https://durhamsoftball.com/teams/american-legion-post-416/', site:'https://al416nc.wixsite.com/al416nc', cause:'Veteran services & military families',
      blurb:'As the only veterans’ service organization located in Research Triangle Park, American Legion Post 416 relentlessly champions veterans and military members, supports military families, and works hard to meet the unique needs of our community in the South Durham County / Northwest Wake County, North Carolina area.' },
    { id:'bike',   name:'Bike Durham',                     short:'Bike Durham',      league:'A', logo:CDN+'bike.jpg',      url:'https://durhamsoftball.com/teams/bike-durham/', cause:'Safe streets & transit advocacy' },
    { id:'book',   name:'BookHarvest',                     short:'BookHarvest',      league:'A', logo:CDN+'BookHarvest.jpg',url:'https://durhamsoftball.com/teams/bookharvest/', cause:'Books & literacy for every child' },
    { id:'bcll',   name:'Bull City Little League',         short:'Bull City LL',     league:'A', logo:CDN+'bcll.jpg',      url:'https://durhamsoftball.com/teams/bull-city-little-league/', cause:'Youth baseball in Durham' },
    { id:'gotr',   name:'Girls on the Run of the Triangle',short:'Girls on the Run', league:'A', logo:CDN+'GOTR.jpg',      url:'https://durhamsoftball.com/teams/girls-on-the-run-of-the-triangle/', cause:'Confidence & health for girls' },
    { id:'hfnh',   name:'Housing for New Hope',            short:'Housing New Hope', league:'A', logo:CDN+'HFNH.jpg',      url:'https://durhamsoftball.com/teams/housing-for-new-hope/', cause:'Ending homelessness in Durham' },
    { id:'kdb',    name:'Keep Durham Beautiful',           short:'Keep Durham Btfl', league:'A', logo:CDN+'KDB.jpg',       url:'https://durhamsoftball.com/teams/keep-durham-beautiful/', cause:'Litter cleanup & greening' },
    { id:'mow',    name:'Meals on Wheels of Durham',       short:'Meals on Wheels',  league:'A', logo:CDN+'Meals.jpg',     url:'https://durhamsoftball.com/teams/meals-on-wheels-of-durham/', cause:'Meals for homebound neighbors' },
    { id:'ncfff',  name:'NC Fallen Firefighters Foundation',short:'NC Fallen FF',    league:'A', logo:CDN+'NCFFF.jpg',     url:'https://durhamsoftball.com/teams/north-carolina-fallen-firefighters-foundation/', cause:'Support for firefighter families' },
    { id:'sdll',   name:'South Durham Little League',      short:'South Durham LL',  league:'A', logo:CDN+'SDLL.jpg',      url:'https://durhamsoftball.com/teams/south-durham-little-league/', site:'https://tshq.bluesombrero.com/sdllnc', cause:'Youth baseball, ages 4-16' },

    { id:'aps',    name:'Animal Protection Society of Durham', short:'APS of Durham', league:'B', logo:CDN+'APS.jpg',       url:'https://durhamsoftball.com/teams/animal-protection-society-of-durham/', site:'https://www.apsofdurham.org/', cause:'Shelter & care for ~4,000 animals a year' },
    { id:'bcw',    name:'Bull City Woodshop',              short:'BC Woodshop',      league:'B', logo:CDN+'BCW.jpg',       url:'https://durhamsoftball.com/teams/bull-city-woodshop/', cause:'Woodworking education & access' },
    { id:'hope',   name:'Hope Animal Rescue',              short:'Hope Animal',      league:'B', logo:CDN+'HAR.jpg',       url:'https://durhamsoftball.com/teams/hope-animal-rescue/', cause:'Rescue & rehoming' },
    { id:'josh',   name:'Josh’s Hope',                     short:'Josh’s Hope',      league:'B', logo:CDN+'JoshsHope.jpg', url:'https://durhamsoftball.com/teams/joshs-hope/', cause:'Young adult mental health' },
    { id:'mlt',    name:'Miracle League of the Triangle',  short:'Miracle League',   league:'B', logo:CDN+'Miracle.jpg',   url:'https://durhamsoftball.com/teams/miracle-league-of-the-triangle/', site:'https://www.mltriangle.com/', cause:'Baseball for children with special needs' },
    { id:'nccadv', name:'NC Coalition Against Domestic Violence', short:'NCCADV',    league:'B', logo:CDN+'NCCADV.jpg',    url:'https://durhamsoftball.com/teams/north-carolina-coalition-against-domestic-violence/', cause:'Survivor advocacy statewide' },
    { id:'porch',  name:'PORCH-Durham',                    short:'PORCH-Durham',     league:'B', logo:CDN+'PORCH.jpg',     url:'https://durhamsoftball.com/teams/porch-durham/', cause:'Hunger relief food drives' },
    { id:'spa',    name:'Senior PharmAssist',              short:'Senior PharmAsst', league:'B', logo:CDN+'Pharm.jpg',     url:'https://durhamsoftball.com/teams/senior-pharmassist/', cause:'Medication help for seniors' },
    { id:'umd',    name:'Urban Ministries of Durham',      short:'Urban Ministries', league:'B', logo:CDN+'UMD.jpg',       url:'https://durhamsoftball.com/teams/urban-ministries-of-durham/', cause:'Food, shelter & clothing' },
    { id:'v2v',    name:'Vets To Vets United',             short:'Vets to Vets',     league:'B', logo:CDN+'V2V.jpg',       url:'https://durhamsoftball.com/teams/vets-to-vets-united/', cause:'Veteran peer support' }
  ];

  var byId = {};
  TEAMS.forEach(function (t) { byId[t.id] = t; });


  /* ---------- Partner charities without an active team ----------
     These organisations are still partnered with Durham Softball, they just
     do not have a team fielded this season. They appear on the charities page
     with a "Partner" tag instead of an A or B League tag, and they are NOT
     offered on the registration team dropdown.
     status: 'partner' = current partner, no team this season
             'former'  = past partner
     Sourced from the league's current Non-Profit Partners menu. */
  var PARTNERS = [
    { id:'c2c',    name:'Crayons2Calculators',                 status:'partner', logo:CDN+'C2C.jpg', url:'https://durhamsoftball.com/teams/crayons2calculators/', cause:'School supplies for classrooms' },
    { id:'dbyal',  name:'Durham Bulls Youth Athletic League',   status:'partner', logo:CDN+'DBYAL.jpg',                                                        url:'https://durhamsoftball.com/teams/durham-bulls-youth-athletic-league/', cause:'Youth athletics in Durham' },
    { id:'fmf',    name:'Families Moving Forward',              status:'partner', logo:CDN+'FMF.jpg', url:'https://durhamsoftball.com/teams/families-moving-forward/', cause:'Housing for families' },
    { id:'plaync', name:'Play NC',                              status:'partner', logo:CDN+'PlayNC.jpg',              url:'https://durhamsoftball.com/teams/play-nc/', cause:'The non-profit that runs the league' },
    { id:'presdur',name:'Preservation Durham',                  status:'partner', logo:CDN+'PD.jpg',              url:'https://durhamsoftball.com/teams/preservation-durham/', cause:'Historic preservation' },
    { id:'swing',  name:'SwingPals',                            status:'partner', logo:CDN+'SwingPals.jpg',            url:'https://durhamsoftball.com/teams/swingpals/', cause:'Golf and mentorship for youth' },

    { id:'cpcanc', name:'Central Piedmont Community Action',    status:'former',  logo:CDN+'CPCAP.jpg', url:'https://durhamsoftball.com/teams/central-piedmont-community-action-of-north-carolina/', cause:'Community action agency' },
    { id:'dwd',    name:'Don\u2019t Waste Durham',                 status:'former',  logo:CDN+'DWD.jpg', url:'https://durhamsoftball.com/teams/dont-waste-durham/', cause:'Waste reduction' },
    { id:'treesd', name:'TreesDurham',                          status:'former',  logo:CDN+'Trees.jpg', url:'https://durhamsoftball.com/teams/treesdurham/', cause:'Tree planting and canopy' }
  ];

  /* Every organisation the charities page shows: active teams first, then
     partners without a team, then former partners. */
  /* Charity photos are opt-in. List an id here once you drop
     assets/charities/<id>.jpg in, and the spotlight will use it instead of
     the logo. Anything not listed falls back to the logo panel. */
  var CHARITY_PHOTOS = [];

  function photoFor(id){
    return CHARITY_PHOTOS.indexOf(id) > -1 ? CHARITY_IMG + id + '.jpg' : null;
  }

  function allOrgs(){
    return TEAMS.map(function(t){
      return { id:t.id, name:t.name, logo:t.logo, url:t.url, cause:t.cause, blurb:t.blurb,
               site:t.site, photo:photoFor(t.id),
               partnerStatus:'active', league:t.league, isTeam:true };
    }).concat(PARTNERS.map(function(p){
      return { id:p.id, name:p.name, logo:p.logo, url:p.url, cause:p.cause, blurb:p.blurb,
               site:p.site, photo:photoFor(p.id),
               partnerStatus: p.status === 'former' ? 'former' : 'inactive',
               league:null, isTeam:false };
    }));
  }

  function orgById(id){
    var m = allOrgs().filter(function(o){ return o.id === id; });
    return m.length ? m[0] : null;
  }

  var STATUS_LABEL = {
    active:   'Active partner',
    inactive: 'Inactive partner',
    former:   'Past partner'
  };

  /* Playoff cut per league. A League sends its top 8, B League its top 2,
     to the end-of-season tournament. */
  var PLAYOFF_CUT = { A: 8, B: 2 };

  /* ---------- Photos (from the league's own library) ---------- */
  var PHOTOS = [
    { src:CDN2+'2025-Spring-Softball-Champs.jpg', caption:'Spring 2025 champions', season:'2025-spring', wide:true },
  ];

  /* Photo seasons. Season tags above are inferred from the league's own file
     names and upload dates, so a few may need correcting. Add new seasons here
     and tag photos with the matching id. */
  var PHOTO_SEASONS = [
    { id:'2025-spring',  label:'Spring 2025' },
    { id:'2023-summer',  label:'Summer 2023' },
    { id:'sponsorships', label:'Sponsorships' }
  ];

  /* ---------- Champions ----------
     Only seasons we have a confirmed photo for are listed. Add past champions
     here as their check photos turn up: each needs season, team, and photo. */
  var CHAMPIONS = [
    { season:'Spring 2025', league:'', team:'', teamId:null,
      photo:CDN2+'2025-Spring-Softball-Champs.jpg',
      caption:'Spring 2025 champions' }
  ];

  /* ---------- Season archive ----------
     2026 Summer is live in this site. Earlier seasons still live on the
     current WordPress site until their results are imported. */
  var SEASON_ARCHIVE = [
    { id:'2026-summer', label:'2026 Summer', live:true },
    { id:'2025-summer', label:'2025 Summer', live:false,
      standings:'https://durhamsoftball.com/2025-summer-standings/',
      schedule:'https://durhamsoftball.com/schedule/2025-summer-calendar/' },
    { id:'2025-spring', label:'2025 Spring', live:false,
      standings:'https://durhamsoftball.com/2025-summer-standings/',
      schedule:'https://durhamsoftball.com/schedule/2025-summer-calendar/' }
  ];

  var HERO_PHOTO = CDN2 + 'softball.jpg';

  /* ---------- Season config ---------- */
  var SEASON = {
    label: '2026 Summer',
    number: 16,
    opener: '2026-08-16',
    venue: 'Pineywood Park',
    venueAddress: '400 E Woodcroft Pkwy, Durham, NC 27713',
    xHandle: 'PlayDurham'
  };

  var GAMES = [
    { id:6462, d:'2026-08-16', t:'09:10', h:'ncfff', a:'alp416' },
    { id:6461, d:'2026-08-16', t:'10:05', h:'porch', a:'hope' },
    { id:6457, d:'2026-08-16', t:'11:00', h:'josh', a:'umd' },
    { id:6458, d:'2026-08-16', t:'11:55', h:'aps', a:'spa' },
    { id:6459, d:'2026-08-16', t:'12:50', h:'bcw', a:'v2v' },
    { id:6460, d:'2026-08-16', t:'13:45', h:'book', a:'kdb' },
    { id:6456, d:'2026-08-16', t:'14:40', h:'hfnh', a:'mow' },
    { id:6455, d:'2026-08-16', t:'15:35', h:'mlt', a:'nccadv' },
    { id:6463, d:'2026-08-16', t:'16:30', h:'bcll', a:'sdll' },
    { id:6464, d:'2026-08-16', t:'17:25', h:'bike', a:'gotr' },
    { id:6413, d:'2026-08-23', t:'09:10', h:'spa', a:'josh' },
    { id:6414, d:'2026-08-23', t:'10:05', h:'kdb', a:'alp416' },
    { id:6415, d:'2026-08-23', t:'11:00', h:'porch', a:'nccadv' },
    { id:6416, d:'2026-08-23', t:'11:55', h:'mow', a:'bcll' },
    { id:6417, d:'2026-08-23', t:'12:50', h:'mlt', a:'v2v' },
    { id:6418, d:'2026-08-23', t:'13:45', h:'hfnh', a:'book' },
    { id:6419, d:'2026-08-23', t:'14:40', h:'bcw', a:'umd' },
    { id:6420, d:'2026-08-23', t:'15:35', h:'aps', a:'hope' },
    { id:6421, d:'2026-08-23', t:'16:30', h:'ncfff', a:'bike' },
    { id:6422, d:'2026-08-23', t:'17:25', h:'sdll', a:'gotr' },
    { id:6465, d:'2026-08-30', t:'09:10', h:'gotr', a:'mow' },
    { id:6466, d:'2026-08-30', t:'10:05', h:'alp416', a:'hfnh' },
    { id:6467, d:'2026-08-30', t:'11:00', h:'hope', a:'spa' },
    { id:6468, d:'2026-08-30', t:'11:55', h:'kdb', a:'ncfff' },
    { id:6469, d:'2026-08-30', t:'12:50', h:'bcll', a:'book' },
    { id:6470, d:'2026-08-30', t:'13:45', h:'bike', a:'sdll' },
    { id:6471, d:'2026-08-30', t:'14:40', h:'v2v', a:'porch' },
    { id:6473, d:'2026-08-30', t:'15:35', h:'josh', a:'bcw' },
    { id:6474, d:'2026-08-30', t:'16:30', h:'umd', a:'mlt' },
    { id:6475, d:'2026-08-30', t:'17:25', h:'nccadv', a:'aps' },
    { id:6423, d:'2026-09-06', t:'09:10', h:'mow', a:'alp416' },
    { id:6424, d:'2026-09-06', t:'10:05', h:'nccadv', a:'josh' },
    { id:6425, d:'2026-09-06', t:'11:00', h:'sdll', a:'kdb' },
    { id:6426, d:'2026-09-06', t:'11:55', h:'book', a:'gotr' },
    { id:6427, d:'2026-09-06', t:'12:50', h:'aps', a:'mlt' },
    { id:6428, d:'2026-09-06', t:'13:45', h:'hfnh', a:'bike' },
    { id:6429, d:'2026-09-06', t:'14:40', h:'umd', a:'porch' },
    { id:6430, d:'2026-09-06', t:'15:35', h:'v2v', a:'spa' },
    { id:6431, d:'2026-09-06', t:'16:30', h:'bcw', a:'hope' },
    { id:6433, d:'2026-09-06', t:'17:25', h:'bcll', a:'ncfff' },
    { id:6476, d:'2026-09-13', t:'09:10', h:'bcw', a:'aps' },
    { id:6477, d:'2026-09-13', t:'10:05', h:'gotr', a:'bcll' },
    { id:6478, d:'2026-09-13', t:'11:00', h:'spa', a:'nccadv' },
    { id:6479, d:'2026-09-13', t:'11:55', h:'bike', a:'kdb' },
    { id:6480, d:'2026-09-13', t:'12:50', h:'alp416', a:'sdll' },
    { id:6481, d:'2026-09-13', t:'13:45', h:'v2v', a:'umd' },
    { id:6482, d:'2026-09-13', t:'14:40', h:'mow', a:'book' },
    { id:6483, d:'2026-09-13', t:'15:35', h:'porch', a:'mlt' },
    { id:6484, d:'2026-09-13', t:'16:30', h:'hope', a:'josh' },
    { id:6485, d:'2026-09-13', t:'17:25', h:'ncfff', a:'hfnh' },
    { id:6434, d:'2026-09-20', t:'09:10', h:'ncfff', a:'book' },
    { id:6435, d:'2026-09-20', t:'10:05', h:'hope', a:'v2v' },
    { id:6436, d:'2026-09-20', t:'11:00', h:'spa', a:'porch' },
    { id:6437, d:'2026-09-20', t:'11:55', h:'umd', a:'nccadv' },
    { id:6438, d:'2026-09-20', t:'12:50', h:'bike', a:'alp416' },
    { id:6439, d:'2026-09-20', t:'13:45', h:'mlt', a:'bcw' },
    { id:6440, d:'2026-09-20', t:'14:40', h:'kdb', a:'bcll' },
    { id:6441, d:'2026-09-20', t:'15:35', h:'sdll', a:'mow' },
    { id:6442, d:'2026-09-20', t:'16:30', h:'gotr', a:'hfnh' },
    { id:6443, d:'2026-09-20', t:'17:25', h:'aps', a:'josh' },
    { id:6486, d:'2026-09-27', t:'09:10', h:'josh', a:'porch' },
    { id:6487, d:'2026-09-27', t:'10:05', h:'gotr', a:'ncfff' },
    { id:6488, d:'2026-09-27', t:'11:00', h:'hope', a:'mlt' },
    { id:6489, d:'2026-09-27', t:'11:55', h:'v2v', a:'aps' },
    { id:6490, d:'2026-09-27', t:'12:50', h:'nccadv', a:'bcw' },
    { id:6491, d:'2026-09-27', t:'13:45', h:'alp416', a:'bcll' },
    { id:6493, d:'2026-09-27', t:'14:40', h:'sdll', a:'hfnh' },
    { id:6494, d:'2026-09-27', t:'15:35', h:'spa', a:'umd' },
    { id:6495, d:'2026-09-27', t:'16:30', h:'book', a:'bike' },
    { id:6496, d:'2026-09-27', t:'17:25', h:'kdb', a:'mow' },
    { id:6444, d:'2026-10-04', t:'09:10', h:'hfnh', a:'kdb' },
    { id:6445, d:'2026-10-04', t:'10:05', h:'nccadv', a:'hope' },
    { id:6446, d:'2026-10-04', t:'11:00', h:'book', a:'sdll' },
    { id:6447, d:'2026-10-04', t:'11:55', h:'mow', a:'ncfff' },
    { id:6448, d:'2026-10-04', t:'12:50', h:'alp416', a:'gotr' },
    { id:6449, d:'2026-10-04', t:'13:45', h:'josh', a:'v2v' },
    { id:6450, d:'2026-10-04', t:'14:40', h:'bcll', a:'bike' },
    { id:6451, d:'2026-10-04', t:'15:35', h:'mlt', a:'spa' },
    { id:6453, d:'2026-10-04', t:'16:30', h:'porch', a:'bcw' },
    { id:6454, d:'2026-10-04', t:'17:25', h:'umd', a:'aps' }
  ];

  /* ---------- Build schedule from the flat game list ---------- */
  function fmtTime(t) {
    var p = t.split(':'), h = parseInt(p[0], 10), m = p[1];
    var ap = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ':' + m + ' ' + ap;
  }

  function buildSchedule() {
    var byDate = {}, order = [];
    GAMES.forEach(function (g) {
      if (!byDate[g.d]) { byDate[g.d] = []; order.push(g.d); }
      byDate[g.d].push({
        id: 'g' + g.id,
        gameId: g.id,
        time: fmtTime(g.t),
        time24: g.t,
        date: g.d,
        home: g.h,
        away: g.a,
        league: byId[g.h].league,
        venue: SEASON.venue,
        placeholder: false
      });
    });
    order.sort();
    return order.map(function (d, i) {
      byDate[d].sort(function (a, b) { return a.time24 < b.time24 ? -1 : 1; });
      return { week: i + 1, date: d, games: byDate[d] };
    });
  }

  var SCHEDULE = buildSchedule();

  function teamGames(teamId) {
    var out = [];
    SCHEDULE.forEach(function (day) {
      day.games.forEach(function (g) {
        if (g.home === teamId || g.away === teamId) {
          out.push({ game: g, day: day, isHome: g.home === teamId,
                     opponent: byId[g.home === teamId ? g.away : g.home] });
        }
      });
    });
    return out;
  }

  /* ---------- Results ----------
     Season opens Aug 16, so live records are genuinely 0-0.
     Sample mode fills deterministic scores for the first 4 weeks. */
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }

  function buildSampleResults() {
    var r = rng(20260816), out = {};
    SCHEDULE.slice(0, 4).forEach(function (day) {
      day.games.forEach(function (g) {
        var hs = 4 + Math.floor(r() * 16), as = 4 + Math.floor(r() * 16);
        if (hs === as && r() > 0.35) hs += 1;
        out[g.id] = { home: hs, away: as };
      });
    });
    return out;
  }

  var SAMPLE_RESULTS = buildSampleResults();

  function computeStandings(results) {
    var rec = {};
    TEAMS.forEach(function (t) { rec[t.id] = { w:0, l:0, t:0, rs:0, ra:0, form:[] }; });

    SCHEDULE.forEach(function (day) {
      day.games.forEach(function (g) {
        var res = results && results[g.id];
        if (!res) return;
        var h = rec[g.home], a = rec[g.away];
        h.rs += res.home; h.ra += res.away;
        a.rs += res.away; a.ra += res.home;
        if (res.home > res.away)      { h.w++; a.l++; h.form.push('w'); a.form.push('l'); }
        else if (res.home < res.away) { a.w++; h.l++; a.form.push('w'); h.form.push('l'); }
        else                          { h.t++; a.t++; h.form.push('t'); a.form.push('t'); }
      });
    });

    return TEAMS.map(function (team) {
      var s = rec[team.id], gp = s.w + s.l + s.t;
      var pct = gp ? (s.w + s.t * 0.5) / gp : 0;
      var streak = { type:'-', n:0 };
      for (var i = s.form.length - 1; i >= 0; i--) {
        if (i === s.form.length - 1) streak = { type:s.form[i], n:1 };
        else if (s.form[i] === streak.type) streak.n++;
        else break;
      }
      return { team:team, gp:gp, w:s.w, l:s.l, t:s.t, pct:pct,
               rs:s.rs, ra:s.ra, diff:s.rs - s.ra, streak:streak, last5:s.form.slice(-5) };
    });
  }

  function standingsPosition(teamId, results){
    var t = byId[teamId];
    var rows = computeStandings(results).filter(function(r){ return r.team.league === t.league; });
    rows.sort(function(a,b){
      if(b.pct !== a.pct) return b.pct - a.pct;
      if(b.diff !== a.diff) return b.diff - a.diff;
      if(b.rs !== a.rs) return b.rs - a.rs;
      return a.team.name.localeCompare(b.team.name);
    });
    for(var i=0;i<rows.length;i++) if(rows[i].team.id===teamId) return { pos:i+1, of:rows.length, row:rows[i] };
    return null;
  }

  var REVIEWS = [
    { quote:'Wonderful opportunity to support our local charities, while having a blast playing softball. Fun for the whole family!!', name:'Terry Morris', role:'Executive Director, Vets to Vets United', img:CDN2+'Reviews_Terry.jpg' },
    { quote:'Playing in this league, I have been able to meet people from throughout the Durham community and have fun playing a game I love, all while raising money for charities that give back directly to our community.', name:'Alex Turner', role:'Player, since 2018', img:CDN2+'Reviews_Alex.jpg' },
    { quote:'I’ve had a ton of fun so far and have gotten to know friendly new people in the Durham area. The league is super chill, which makes it way more fun and easier to play.', name:'Jen Standish', role:'Player, since 2018', img:CDN2+'Reviews_Jen.jpg' }
  ];

  global.DS = {
    CDN: CDN,
    CDN2: CDN2,
    LOGO: '/assets/logos/DurhamSoftball.jpg',
    LOGO_FALLBACK: 'https://durhamsoftball.com/wp-content/uploads/2023/12/cropped-Durham-Softball-Logo-By-Play-NC.jpg',
    HERO_PHOTO: HERO_PHOTO,
    PHOTOS: PHOTOS,
    PHOTO_SEASONS: PHOTO_SEASONS,
    CHAMPIONS: CHAMPIONS,
    SEASON_ARCHIVE: SEASON_ARCHIVE,
    TEAMS: TEAMS,
    PARTNERS: PARTNERS,
    allOrgs: allOrgs,
    orgById: orgById,
    STATUS_LABEL: STATUS_LABEL,
    PLAYOFF_CUT: PLAYOFF_CUT,
    CHARITY_PHOTOS: CHARITY_PHOTOS,
    byId: byId,
    SEASON: SEASON,
    SCHEDULE: SCHEDULE,
    GAMES: GAMES,
    teamGames: teamGames,
    SAMPLE_RESULTS: SAMPLE_RESULTS,
    computeStandings: computeStandings,
    standingsPosition: standingsPosition,
    REVIEWS: REVIEWS
  };
})(window);
