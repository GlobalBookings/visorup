import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger } from './logger.js';
import { sendSlack, slackHeader, slackSection, slackDivider } from './slack.js';

const log = createLogger('email');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const INBOX_FILE = path.join(DATA_DIR, 'inbox.json');
const SENT_FILE = path.join(DATA_DIR, 'sent.json');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@visorup.co.uk';

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadInbox() {
  ensureDataDir();
  if (fs.existsSync(INBOX_FILE)) return JSON.parse(fs.readFileSync(INBOX_FILE, 'utf8'));
  return [];
}

function saveInbox(emails) {
  ensureDataDir();
  fs.writeFileSync(INBOX_FILE, JSON.stringify(emails, null, 2));
}

function loadSent() {
  ensureDataDir();
  if (fs.existsSync(SENT_FILE)) return JSON.parse(fs.readFileSync(SENT_FILE, 'utf8'));
  return [];
}

function saveSent(emails) {
  ensureDataDir();
  fs.writeFileSync(SENT_FILE, JSON.stringify(emails, null, 2));
}

export function verifyWebhook(payload, signature) {
  if (!RESEND_WEBHOOK_SECRET) return true;
  if (!signature) return false;

  try {
    const hmac = crypto.createHmac('sha256', RESEND_WEBHOOK_SECRET);
    hmac.update(typeof payload === 'string' ? payload : JSON.stringify(payload));
    const expected = hmac.digest('base64');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function handleIncomingEmail(webhookData) {
  const type = webhookData.type;
  const data = webhookData.data || {};

  if (type === 'email.received') {
    const email = {
      id: data.email_id || crypto.randomUUID(),
      from: data.from || 'unknown',
      to: data.to || [],
      subject: data.subject || '(no subject)',
      text: data.text || '',
      html: data.html || '',
      date: data.created_at || new Date().toISOString(),
      read: false,
    };

    const inbox = loadInbox();
    inbox.unshift(email);
    if (inbox.length > 500) inbox.length = 500;
    saveInbox(inbox);

    log.info(`Email received from ${email.from}: ${email.subject}`);

    sendSlack([
      slackHeader('New Email — VisorUp'),
      slackSection(
        `:envelope: *${email.subject}*\n` +
        `From: *${email.from}*\n` +
        `${(email.text || '').slice(0, 300)}${(email.text || '').length > 300 ? '...' : ''}`
      ),
      slackDivider(),
      slackSection('_Check the <https://visorup.co.uk/iron-horse-hq|admin panel> to reply._'),
    ], `New email from ${email.from}`).catch(() => {});

    return email;
  }

  if (type === 'email.delivered' || type === 'email.bounced') {
    log.info(`Email event: ${type} — ${data.email_id || 'unknown'}`);
  }

  return null;
}

export function getInbox(page = 1, limit = 20) {
  const inbox = loadInbox();
  const start = (page - 1) * limit;
  const unread = inbox.filter(e => !e.read).length;
  return {
    emails: inbox.slice(start, start + limit),
    total: inbox.length,
    unread,
    page,
    pages: Math.ceil(inbox.length / limit),
  };
}

export function getEmail(id) {
  const inbox = loadInbox();
  const email = inbox.find(e => e.id === id);
  if (email && !email.read) {
    email.read = true;
    saveInbox(inbox);
  }
  return email || null;
}

export function deleteEmail(id) {
  const inbox = loadInbox();
  const idx = inbox.findIndex(e => e.id === id);
  if (idx === -1) return false;
  inbox.splice(idx, 1);
  saveInbox(inbox);
  return true;
}

export function getSent(page = 1, limit = 20) {
  const sent = loadSent();
  const start = (page - 1) * limit;
  return {
    emails: sent.slice(start, start + limit),
    total: sent.length,
    page,
    pages: Math.ceil(sent.length / limit),
  };
}

export async function sendEmail({ to, subject, html, text, replyTo }) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

  const body = {
    from: FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject,
  };
  if (html) body.html = html;
  if (text && !html) body.text = text;
  if (replyTo) body.reply_to = replyTo;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await res.json();

  if (!res.ok) {
    log.error(`Send failed: ${JSON.stringify(result)}`);
    throw new Error(result.message || 'Send failed');
  }

  const record = {
    id: result.id,
    to: body.to,
    subject,
    html: html || '',
    text: text || '',
    date: new Date().toISOString(),
  };

  const sent = loadSent();
  sent.unshift(record);
  if (sent.length > 500) sent.length = 500;
  saveSent(sent);

  log.info(`Email sent to ${body.to.join(', ')}: ${subject}`);
  return record;
}
