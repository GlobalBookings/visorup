/**
 * Cloudflare Pages Function — edge SEO prerender for VisorUp
 *
 * VisorUp is a client-rendered SPA, so without this, crawlers and social
 * scrapers that don't execute JS (Facebook, X, LinkedIn, Slack, WhatsApp,
 * and non-rendering bots) only ever see the static homepage <title>, meta,
 * canonical and image — for every URL.
 *
 * This function runs at the edge for every request. For HTML documents it
 * injects the correct per-URL <title>, description, Open Graph / Twitter tags,
 * canonical link and Article JSON-LD (looked up from seo-manifest.json) using
 * HTMLRewriter. It applies to ALL user-agents (not just bots) so there is no
 * cloaking — the SPA simply re-sets the same values once its JS runs.
 *
 * Non-HTML responses (JS, CSS, images, sitemap.xml, the manifest itself) pass
 * through untouched. If the platform returns a hard 404 for a deep SPA link,
 * the function falls back to serving the index.html shell so client routing
 * still works.
 */

const SITE = 'https://visorup.co.uk';

// Parsed manifest cached for the lifetime of the isolate.
let MANIFEST = null;
async function getManifest(env, origin) {
  if (MANIFEST) return MANIFEST;
  try {
    const res = await env.ASSETS.fetch(new URL('/seo-manifest.json', origin).toString());
    MANIFEST = res.ok ? await res.json() : {};
  } catch {
    MANIFEST = {};
  }
  return MANIFEST;
}

function normalizePath(p) {
  try { p = decodeURIComponent(p); } catch { /* keep raw */ }
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p || '/';
}

function absImage(img) {
  if (!img) return SITE + '/public/images/heroes/homepage.jpg';
  return /^https?:\/\//.test(img) ? img : SITE + '/' + String(img).replace(/^\/+/, '');
}

function looksLikeNavigation(request, pathname) {
  const accept = request.headers.get('accept') || '';
  const lastSeg = pathname.split('/').pop() || '';
  const hasFileExt = lastSeg.includes('.');
  return accept.includes('text/html') && !hasFileExt;
}

/* ── HTMLRewriter handlers ───────────────────────────────────────────── */
class SetAttr {
  constructor(attr, value) { this.attr = attr; this.value = value; }
  element(el) { if (this.value != null && this.value !== '') el.setAttribute(this.attr, this.value); }
}
class SetText {
  constructor(text) { this.text = text; }
  element(el) { if (this.text) el.setInnerContent(this.text); }
}
class AppendToHead {
  constructor(html) { this.html = html; }
  element(el) { if (this.html) el.append(this.html, { html: true }); }
}

function buildRewriter(meta, canonical) {
  const title = meta.t || 'VisorUp — Motorcycle Adventures Across Britain';
  const desc = meta.d || '';
  const image = absImage(meta.i);
  const type = meta.ty === 'article' ? 'article' : 'website';

  let rw = new HTMLRewriter()
    .on('title', new SetText(title))
    .on('meta[name="description"]', new SetAttr('content', desc))
    .on('meta[property="og:title"]', new SetAttr('content', title))
    .on('meta[property="og:description"]', new SetAttr('content', desc))
    .on('meta[property="og:url"]', new SetAttr('content', canonical))
    .on('meta[property="og:type"]', new SetAttr('content', type))
    .on('meta[property="og:image"]', new SetAttr('content', image))
    .on('meta[name="twitter:title"]', new SetAttr('content', title))
    .on('meta[name="twitter:description"]', new SetAttr('content', desc))
    .on('meta[name="twitter:image"]', new SetAttr('content', image))
    .on('link[rel="canonical"]', new SetAttr('href', canonical));

  if (type === 'article') {
    const graph = [{
      '@type': 'Article',
      headline: title.replace(/\s+—\s+VisorUp$/, ''),
      description: desc,
      image,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      author: { '@type': 'Organization', name: 'The VisorUp Team', url: SITE },
      publisher: { '@type': 'Organization', name: 'VisorUp', url: SITE, logo: { '@type': 'ImageObject', url: SITE + '/public/icons/icon-512x512.png' } },
    }];
    if (meta.pd) graph[0].datePublished = meta.pd;
    if (meta.md) graph[0].dateModified = meta.md;
    const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    rw = rw.on('head', new AppendToHead('<script type="application/ld+json" data-ld="prerender">' + ld + '</script>'));
  }
  return rw;
}

/* ── entry point ─────────────────────────────────────────────────────── */
export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const pathname = normalizePath(url.pathname);
  const canonical = SITE + pathname;

  let res;
  try { res = await next(); } catch { return next(); }

  const contentType = res.headers.get('content-type') || '';
  const isHtml = contentType.includes('text/html');

  // Hard 404 on a navigation request → serve the SPA shell so routing works.
  if (!isHtml && res.status === 404 && looksLikeNavigation(request, pathname)) {
    try {
      const shell = await env.ASSETS.fetch(new URL('/index.html', url.origin).toString());
      if (shell.ok) {
        res = new Response(shell.body, { status: 200, headers: shell.headers });
      } else {
        return res;
      }
    } catch {
      return res;
    }
  } else if (!isHtml) {
    return res; // assets, json, xml, etc. — untouched
  }

  const manifest = await getManifest(env, url.origin);
  const meta = manifest[pathname];
  if (!meta) return res; // unknown route — leave the shell defaults in place

  const transformed = buildRewriter(meta, canonical).transform(res);
  const headers = new Headers(transformed.headers);
  headers.set('x-visorup-seo', 'edge');
  return new Response(transformed.body, { status: transformed.status, statusText: transformed.statusText, headers });
}
