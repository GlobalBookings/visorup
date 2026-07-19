/**
 * Affiliate Revenue Agent — VisorUp
 *
 * SportsBikeShop's affiliate programme is a bespoke in-house portal
 * (email + password + email 2FA), so there is no API. This agent logs in
 * with Puppeteer, reads the 2FA code from the Resend inbox (forward the
 * SportsBikeShop 2FA email to an address that hits /email/incoming), scrapes
 * the dashboard's headline numbers, and posts them to Slack.
 *
 * Because it drives a login-gated page we can't see, selectors are best-effort
 * and overridable via env. It logs the dashboard text and saves a debug dump so
 * the selectors/regex can be tuned to the real portal.
 *
 * Required env:
 *   AFFILIATE_EMAIL, AFFILIATE_PASSWORD
 * Optional env:
 *   AFFILIATE_URL            (default https://www.sportsbikeshop.co.uk/affiliates)
 *   AFFILIATE_2FA_FROM       (sender substring for the 2FA email, default 'sportsbikeshop')
 *   AFFILIATE_2FA_SUBJECT    (subject substring, optional)
 *   AFFILIATE_SEL_EMAIL / _PASSWORD / _SUBMIT / _2FA / _2FA_SUBMIT  (CSS overrides)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { createLogger } from '../core/logger.js';
import {
  sendSlack, slackHeader, slackSection, slackDivider, slackFields,
} from '../core/slack.js';
import { findRecentEmail } from '../core/email.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DEBUG_FILE = path.join(DATA_DIR, 'affiliate-last.txt');

const log = createLogger('affiliate-revenue');

const URL = process.env.AFFILIATE_URL || 'https://www.sportsbikeshop.co.uk/affiliates';
const EMAIL = process.env.AFFILIATE_EMAIL;
const PASSWORD = process.env.AFFILIATE_PASSWORD;
const TWOFA_FROM = (process.env.AFFILIATE_2FA_FROM || 'sportsbikeshop').trim();
const TWOFA_SUBJECT = (process.env.AFFILIATE_2FA_SUBJECT || '').trim();

const SEL = {
  email: process.env.AFFILIATE_SEL_EMAIL || 'input[type="email"], input[name="email"], input[name="username"]',
  password: process.env.AFFILIATE_SEL_PASSWORD || 'input[type="password"], input[name="password"]',
  submit: process.env.AFFILIATE_SEL_SUBMIT || 'button[type="submit"], input[type="submit"]',
  twofa: process.env.AFFILIATE_SEL_2FA || 'input[name*="code" i], input[name*="otp" i], input[name*="token" i], input[autocomplete="one-time-code"]',
  twofaSubmit: process.env.AFFILIATE_SEL_2FA_SUBMIT || 'button[type="submit"], input[type="submit"]',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Pull a 4-8 digit code out of an email body.
function extractCode(email) {
  const haystack = `${email.subject}\n${email.text || ''}\n${(email.html || '').replace(/<[^>]*>/g, ' ')}`;
  const m = haystack.match(/\b(\d{4,8})\b/);
  return m ? m[1] : null;
}

async function waitForCode(sinceMs, { tries = 20, intervalMs = 3000 } = {}) {
  for (let i = 0; i < tries; i++) {
    const email = findRecentEmail({ fromIncludes: TWOFA_FROM, subjectIncludes: TWOFA_SUBJECT, sinceMs });
    if (email) {
      const code = extractCode(email);
      if (code) {
        log.info(`2FA code found in email "${email.subject}"`);
        return code;
      }
    }
    await sleep(intervalMs);
  }
  return null;
}

async function typeInto(page, selector, value) {
  const el = await page.$(selector);
  if (!el) return false;
  await el.click({ clickCount: 3 }).catch(() => {});
  await el.type(value, { delay: 30 });
  return true;
}

async function clickFirst(page, selector) {
  const el = await page.$(selector);
  if (!el) return false;
  await el.click().catch(() => {});
  return true;
}

// Parse a labelled number/currency out of visible page text.
function parseMetric(text, labels) {
  for (const label of labels) {
    // e.g. "Commission £123.45" or "Clicks: 1,234" — number can be before or after the label
    const after = new RegExp(`${label}[^\\d£€]{0,20}(£?\\s?[\\d,]+(?:\\.\\d+)?)`, 'i');
    const before = new RegExp(`(£?\\s?[\\d,]+(?:\\.\\d+)?)[^\\d£€]{0,20}${label}`, 'i');
    const m = text.match(after) || text.match(before);
    if (m) return m[1].replace(/\s/g, '');
  }
  return null;
}

function scrapeMetrics(text) {
  return {
    clicks: parseMetric(text, ['clicks', 'click throughs', 'referrals']),
    sales: parseMetric(text, ['sales', 'orders', 'conversions']),
    commission: parseMetric(text, ['commission', 'earnings', 'earned', 'balance', 'payable']),
  };
}

export async function run() {
  if (!EMAIL || !PASSWORD) {
    log.warn('AFFILIATE_EMAIL / AFFILIATE_PASSWORD not set — skipping');
    return;
  }

  log.info('Starting affiliate revenue scrape...');
  const loginStart = Date.now();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let metrics = null;
  let note = '';

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 45000 });

    // The login form may be gated behind a Cloudflare challenge; give it a moment.
    const emailReady = await page.waitForSelector(SEL.email, { timeout: 12000 }).then(() => true).catch(() => false);
    if (!emailReady) {
      const challenged = await page.$('[name="cf-turnstile-response"], #challenge-form, iframe[src*="challenges.cloudflare"]');
      if (challenged) {
        throw new Error('Blocked by Cloudflare bot challenge (Turnstile) — the login form never rendered. Headless automation is being blocked; see options in the runbook.');
      }
    }

    // ── login ──
    const gotEmail = await typeInto(page, SEL.email, EMAIL);
    const gotPass = await typeInto(page, SEL.password, PASSWORD);
    if (!gotEmail || !gotPass) throw new Error('Could not find login fields — set AFFILIATE_SEL_EMAIL/_PASSWORD');
    await clickFirst(page, SEL.submit);
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});

    // ── 2FA (if the portal asks for it) ──
    const twofaField = await page.$(SEL.twofa);
    if (twofaField) {
      log.info('2FA prompt detected — waiting for code email...');
      const code = await waitForCode(loginStart);
      if (!code) throw new Error('2FA code did not arrive in the inbox in time');
      await typeInto(page, SEL.twofa, code);
      await clickFirst(page, SEL.twofaSubmit);
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
    }

    // ── scrape dashboard ──
    await sleep(1500);
    const bodyText = await page.evaluate(() => document.body.innerText || '');
    ensureDataDir();
    fs.writeFileSync(DEBUG_FILE, bodyText, 'utf-8');

    if (/sign in|log ?in|password/i.test(bodyText) && bodyText.length < 400) {
      throw new Error('Still on the login page after submit — check credentials/selectors');
    }

    metrics = scrapeMetrics(bodyText);
    const found = Object.values(metrics).filter(Boolean).length;
    if (found === 0) {
      note = 'Logged in, but could not parse any figures. Dashboard text saved to data/affiliate-last.txt — share it and I will tune the selectors.';
      log.warn(note);
    } else if (found < 3) {
      note = 'Parsed some figures; a few are missing. See data/affiliate-last.txt to refine parsing.';
    }
  } catch (err) {
    log.error(`Affiliate scrape failed: ${err.message}`);
    note = `Scrape error: ${err.message}`;
  } finally {
    await browser.close().catch(() => {});
  }

  // ── report ──
  const blocks = [
    slackHeader('💰 VisorUp — Affiliate Revenue (SportsBikeShop)'),
    slackSection(`*${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}*`),
    slackDivider(),
  ];

  if (metrics && Object.values(metrics).some(Boolean)) {
    blocks.push(slackFields([
      ['Clicks', metrics.clicks || 'n/a'],
      ['Sales', metrics.sales || 'n/a'],
      ['Commission', metrics.commission ? (metrics.commission.startsWith('£') ? metrics.commission : `£${metrics.commission}`) : 'n/a'],
    ]));
  } else {
    blocks.push(slackSection('_No figures parsed this run._'));
  }

  if (note) blocks.push(slackSection(`_${note}_`));
  blocks.push(slackDivider());
  blocks.push(slackSection('_Affiliate Revenue Agent — VisorUp_'));

  await sendSlack(blocks, 'VisorUp Affiliate Revenue');
  log.info('Affiliate revenue report posted');
}

export default { run };
