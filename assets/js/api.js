/* ==========================================================================
   Durham Softball - Supabase RPC client
   Plain fetch, no SDK, so the site stays dependency free.
   Each call maps to a function in supabase/schema.sql.
   ========================================================================== */
(function (global) {
  'use strict';
  var cfg = global.DS_CONFIG || {};

  function configured() { return !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY); }

  function rpc(fn, args) {
    if (!configured()) return Promise.reject(new Error('NOT_CONFIGURED'));
    return fetch(cfg.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': cfg.SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + cfg.SUPABASE_ANON_KEY
      },
      body: JSON.stringify(args || {})
    }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (body) {
        if (!r.ok) {
          var msg = (body && (body.message || body.hint)) || ('Request failed (' + r.status + ')');
          var e = new Error(msg); e.status = r.status; throw e;
        }
        return body;
      });
    });
  }

  var KEY = 'ds_team_session';
  function saveSession(s) { try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function loadSession() {
    try {
      var s = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (s && new Date(s.expires_at) > new Date()) return s;
    } catch (e) {}
    return null;
  }
  function clearSession() { try { sessionStorage.removeItem(KEY); } catch (e) {} }

  function sha256Hex(text) {
    if (!(global.crypto && global.crypto.subtle)) return Promise.resolve('unavailable');
    return global.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
      .then(function (buf) {
        return Array.from(new Uint8Array(buf))
          .map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      });
  }

  global.DSAPI = {
    configured: configured,
    session: loadSession,
    logout: clearSession,

    teamLogin: function (teamId, passcode) {
      return rpc('team_login', { p_team_id: teamId, p_passcode: passcode })
        .then(function (rows) {
          var s = Array.isArray(rows) ? rows[0] : rows;
          if (!s || !s.token) throw new Error('Invalid passcode');
          saveSession(s); return s;
        });
    },

    roster: function (gameId) {
      var s = loadSession();
      if (!s) return Promise.reject(new Error('NO_SESSION'));
      return rpc('team_roster', { p_token: s.token, p_game_id: gameId });
    },

    markAttendance: function (gameId, playerId, status, notedBy) {
      var s = loadSession();
      if (!s) return Promise.reject(new Error('NO_SESSION'));
      return rpc('mark_attendance', {
        p_token: s.token, p_game_id: gameId, p_player_id: playerId,
        p_status: status, p_noted_by: notedBy || null
      });
    },

    registerPlayer: function (data, waiverText) {
      return sha256Hex(waiverText).then(function (hash) {
        return rpc('register_player', {
          p_season: cfg.CURRENT_SEASON,
          p_full_name: data.fullName, p_email: data.email, p_phone: data.phone || null,
          p_waiver_version: cfg.WAIVER_VERSION, p_signed_name: data.signedName,
          p_agreed_hash: hash, p_user_agent: navigator.userAgent
        });
      });
    }
  };
})(window);
