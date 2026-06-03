import { createLogger } from '../core/logger.js';

const log = createLogger('sitemap');

export async function fetchSitemapUrls(sitemapUrl) {
  log.info(`Fetching sitemap: ${sitemapUrl}`);
  const res = await fetch(sitemapUrl);
  const xml = await res.text();

  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  log.info(`Found ${urls.length} URLs in sitemap`);
  return urls;
}

export function categorizeUrl(url) {
  const path = new URL(url).pathname;
  if (path.startsWith('/guides/')) return 'guide';
  if (path.startsWith('/routes/')) return 'route';
  if (path.startsWith('/build-route')) return 'tool';
  if (path.startsWith('/plan-trip')) return 'tool';
  return 'page';
}
