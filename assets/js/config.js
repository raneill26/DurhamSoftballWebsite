/* ==========================================================================
   Durham Softball - runtime config

   The Supabase ANON key is meant to be public. It is safe here ONLY because
   every table has Row Level Security on with no policies, so all access runs
   through the SECURITY DEFINER functions in supabase/schema.sql.
   NEVER put the service_role key in this file.

   Leave values blank and the site still works: registration, waiver, and
   attendance show a "not connected yet" state instead of breaking.
   ========================================================================== */
window.DS_CONFIG = {
  // Supabase > Project Settings > Data API
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',

  // Hosted checkout. Stripe Payment Link, or a PayPal hosted button URL.
  // These are public URLs, nothing secret.
  REGISTRATION_FEE_URL: '',
  REGISTRATION_FEE_LABEL: 'Season registration',
  DONATE_URL: 'https://paypal.me/plaync',

  CURRENT_SEASON: '2026-summer',
  WAIVER_VERSION: '2026-v1'
};
