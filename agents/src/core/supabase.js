import { createLogger } from './logger.js';

const log = createLogger('supabase');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function supabaseConfigured() {
  return !!(SUPABASE_URL && SERVICE_KEY);
}

/**
 * Count rows in a table via PostgREST, optionally filtered.
 * Uses the service-role key, so it bypasses RLS and sees every row.
 *
 * @param {string} table   table name, e.g. 'profiles'
 * @param {object} filters PostgREST filter params, e.g. { created_at: 'gte.2026-01-01' }
 * @returns {Promise<number|null>} the count, or null if the table/column is missing.
 */
async function countWithParams(table, params) {
  if (!supabaseConfigured()) return null;

  params.set('select', 'id');
  params.set('limit', '1');

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
      method: 'HEAD',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: 'count=exact',
        Range: '0-0',
      },
    });

    if (!res.ok && res.status !== 206) {
      log.warn(`count ${table} → ${res.status}`);
      return null;
    }

    // PostgREST returns the total in Content-Range as "0-0/<count>".
    const range = res.headers.get('content-range');
    if (!range) return null;
    const total = range.split('/')[1];
    if (total === '*' || total == null) return null;
    return Number(total);
  } catch (err) {
    log.warn(`count ${table} failed: ${err.message}`);
    return null;
  }
}

export async function countRows(table, filters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) params.set(key, value);
  return countWithParams(table, params);
}

/**
 * Count rows where `column` falls in [gteIso, ltIso). Used for
 * week-over-week windows (this week vs last week).
 */
export async function countBetween(table, column, gteIso, ltIso) {
  const params = new URLSearchParams();
  params.append(column, `gte.${gteIso}`);
  params.append(column, `lt.${ltIso}`);
  return countWithParams(table, params);
}

function isoDaysAgo(days) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

/**
 * Best-effort community/app metrics. Every field degrades to null if the
 * table or timestamp column isn't present, so the report never hard-fails.
 */
export async function getCommunityMetrics() {
  const since7 = isoDaysAgo(7);

  const [
    totalRiders, newRiders7d,
    totalRoutes, newRoutes7d, publicRoutes,
    posts7d, bikes,
  ] = await Promise.all([
    countRows('profiles'),
    countRows('profiles', { created_at: `gte.${since7}` }),
    countRows('saved_trips'),
    countRows('saved_trips', { created_at: `gte.${since7}` }),
    countRows('saved_trips', { is_public: 'eq.true' }),
    countRows('community_posts', { created_at: `gte.${since7}` }),
    countRows('user_bikes'),
  ]);

  return {
    totalRiders, newRiders7d,
    totalRoutes, newRoutes7d, publicRoutes,
    posts7d, bikes,
  };
}
