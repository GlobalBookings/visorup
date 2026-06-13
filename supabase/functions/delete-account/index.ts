// Supabase Edge Function: delete-account
// Permanently deletes the authenticated user's data and their auth account.
// Required by App Store Guideline 5.1.1(v) (in-app account deletion).
//
// Deploy:
//   supabase functions deploy delete-account
// (SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are injected
//  automatically by the Supabase platform — no manual secrets needed.)
//
// The mobile app calls it via:
//   supabase.functions.invoke('delete-account', { method: 'POST' })
// which forwards the user's JWT in the Authorization header.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace('Bearer ', '').trim();
    if (!jwt) return json({ error: 'Missing authorization' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Identify the caller from their JWT.
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: 'Invalid session' }, 401);

    const uid = user.id;
    const admin = createClient(supabaseUrl, serviceKey);

    // Best-effort data cleanup (in case foreign keys aren't ON DELETE CASCADE).
    // Errors here are non-fatal; the auth-user delete below is the critical step.
    await admin.from('community_comments').delete().eq('user_id', uid);
    await admin.from('community_likes').delete().eq('user_id', uid);
    await admin.from('community_posts').delete().eq('user_id', uid);
    await admin.from('saved_trips').delete().eq('user_id', uid);
    await admin.from('user_bikes').delete().eq('user_id', uid);
    await admin.from('profiles').delete().eq('id', uid);

    const { error: delErr } = await admin.auth.admin.deleteUser(uid);
    if (delErr) return json({ error: delErr.message }, 500);

    return json({ success: true }, 200);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
