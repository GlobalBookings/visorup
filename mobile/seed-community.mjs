// One-off seed: creates a "Sample Rider" account and a few benign ride-report
// posts so the App Review demo account has other-user content to report/block.
// Run from the mobile/ dir:  node seed-community.mjs
// Optional overrides: SEED_EMAIL=... SEED_PASSWORD=... node seed-community.mjs
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const here = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(join(here, '.env'), 'utf8');
const get = (k) => {
  const m = env.match(new RegExp('^' + k + '=(.*)$', 'm'));
  return m ? m[1].trim() : undefined;
};

const URL = process.env.SEED_URL || get('EXPO_PUBLIC_SUPABASE_URL');
const KEY = process.env.SEED_ANON_KEY || get('EXPO_PUBLIC_SUPABASE_ANON_KEY');
const EMAIL = process.env.SEED_EMAIL || 'sample.rider@visorup.co.uk';
const PASSWORD = process.env.SEED_PASSWORD || 'VisorUpSample!2026';
const NAME = process.env.SEED_NAME || 'Sample Rider';

if (!URL || !KEY) {
  console.error('Missing Supabase URL/key (checked env vars and mobile/.env).');
  process.exit(1);
}

const supabase = createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });

const POSTS = [
  {
    type: 'ride-report',
    body: 'Cracking loop around Snowdonia today — the A4086 over Pen-y-Pass was glorious in the morning light. Stopped for a brew at Pete\'s Eats in Llanberis. Roads were dry and quiet.',
    destination_slug: 'Snowdonia, Wales',
    miles: 187,
  },
  {
    type: 'photo',
    body: 'Sunrise over the North York Moors before the crowds turned up. Worth the 5am alarm.',
    destination_slug: 'North York Moors',
    miles: 0,
  },
  {
    type: 'question',
    body: 'Heading up the NC500 next month — anyone got a favourite overnight stop between Durness and Tongue? Looking for something biker-friendly with secure parking.',
    destination_slug: 'NC500, Scotland',
    miles: 0,
  },
  {
    type: 'ride-report',
    body: 'Quick blast through the Peak District. Snake Pass was busy but the Strines route was empty and brilliant. Bike ran perfectly.',
    destination_slug: 'Peak District',
    miles: 96,
  },
];

async function ensureSession() {
  let r = await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
  if (r.data?.session) return r.data.session;

  const su = await supabase.auth.signUp({ email: EMAIL, password: PASSWORD, options: { data: { full_name: NAME } } });
  if (su.error && !/already registered/i.test(su.error.message)) throw su.error;
  if (su.data?.session) return su.data.session;

  r = await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
  if (r.data?.session) return r.data.session;

  throw new Error(
    'Could not get a session for the sample account. Email confirmation is likely enabled on this project. ' +
    (r.error?.message || '')
  );
}

(async () => {
  const session = await ensureSession();
  const user = session.user;
  console.log('Signed in as sample author:', user.email, user.id);

  // Make sure the author has a friendly display name.
  await supabase.from('profiles').update({ display_name: NAME }).eq('id', user.id);

  // Avoid duplicating posts on re-runs.
  const { data: existing } = await supabase
    .from('community_posts')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);
  if (existing && existing.length > 0) {
    console.log('Sample author already has posts — skipping insert. Done.');
    return;
  }

  let ok = 0;
  for (const p of POSTS) {
    const { error } = await supabase.from('community_posts').insert({
      user_id: user.id,
      type: p.type,
      title: '',
      body: p.body,
      photos: [],
      route_slug: null,
      destination_slug: p.destination_slug,
      miles: p.miles || null,
      rating: null,
      bike: '',
      tags: [],
    });
    if (error) { console.error('Insert failed:', error.message); }
    else { ok++; }
  }
  console.log(`Inserted ${ok}/${POSTS.length} sample posts.`);
  console.log('Sample author credentials -> email:', EMAIL, '| password:', PASSWORD);
})().catch((e) => {
  console.error('SEED ERROR:', e.message);
  process.exit(2);
});
