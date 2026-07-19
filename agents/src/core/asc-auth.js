import crypto from 'node:crypto';

/**
 * App Store Connect API auth.
 *
 * Generates a short-lived ES256 JWT signed with your App Store Connect API
 * private key (.p8). No external dependency: Node's crypto can emit the
 * JOSE (IEEE P1363 R||S) signature ES256 requires directly.
 *
 * Required env:
 *   ASC_ISSUER_ID    — Issuer ID from App Store Connect > Users and Access > Integrations
 *   ASC_KEY_ID       — the API key's Key ID
 *   ASC_PRIVATE_KEY  — contents of the AuthKey_XXXX.p8 (PEM). \n escapes are allowed.
 */

const ISSUER_ID = process.env.ASC_ISSUER_ID;
const KEY_ID = process.env.ASC_KEY_ID;

function normalisePrivateKey(raw) {
  if (!raw) return null;
  let k = raw.trim();
  // Allow escaped newlines when the key is stored on one line.
  if (k.includes('\\n')) k = k.replace(/\\n/g, '\n');
  // A well-formed multi-line PEM can be used as-is.
  if (k.includes('-----BEGIN') && k.includes('\n')) return k;
  // Otherwise reconstruct a valid PKCS#8 PEM from whatever we were given
  // (single-line with headers glued on, or raw base64 with no headers).
  const body = k.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  if (!body) return k;
  const wrapped = body.match(/.{1,64}/g).join('\n');
  return `-----BEGIN PRIVATE KEY-----\n${wrapped}\n-----END PRIVATE KEY-----\n`;
}

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

export function ascConfigured() {
  return !!(ISSUER_ID && KEY_ID && normalisePrivateKey(process.env.ASC_PRIVATE_KEY));
}

export function getAscToken() {
  const privateKey = normalisePrivateKey(process.env.ASC_PRIVATE_KEY);
  if (!ISSUER_ID || !KEY_ID || !privateKey) {
    throw new Error('Missing ASC_ISSUER_ID, ASC_KEY_ID or ASC_PRIVATE_KEY in .env');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'ES256', kid: KEY_ID, typ: 'JWT' };
  const payload = {
    iss: ISSUER_ID,
    iat: now,
    exp: now + 60 * 15, // Apple rejects tokens valid for more than 20 minutes.
    aud: 'appstoreconnect-v1',
  };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signature = crypto.sign('sha256', Buffer.from(signingInput), {
    key: privateKey,
    dsaEncoding: 'ieee-p1363',
  });

  return `${signingInput}.${signature.toString('base64url')}`;
}

export async function ascFetch(pathOrUrl, { responseType = 'json' } = {}) {
  const token = getAscToken();
  const url = pathOrUrl.startsWith('http')
    ? pathOrUrl
    : `https://api.appstoreconnect.apple.com${pathOrUrl}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json, application/a-gzip' },
  });

  if (responseType === 'buffer') {
    return { ok: res.ok, status: res.status, buffer: Buffer.from(await res.arrayBuffer()) };
  }

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  return { ok: res.ok, status: res.status, data, text };
}
