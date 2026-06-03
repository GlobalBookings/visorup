import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createLogger } from '../core/logger.js';

const log = createLogger('repo');
const GH_TOKEN = process.env.GITHUB_TOKEN;
const GH_REPO = process.env.GITHUB_REPO || 'GlobalBookings/visorup';
const CHECKOUT_DIR = '/app/data/repo-checkout';

export function getWorkDir(localFallback) {
  // If WORK_DIR is explicitly set, use it
  if (process.env.WORK_DIR) return process.env.WORK_DIR;

  // If running locally (not in Docker), use the repo root
  if (fs.existsSync(localFallback) && fs.existsSync(path.join(localFallback, 'articles.js'))) {
    return localFallback;
  }

  // Running in Docker — clone/pull the repo
  return ensureRepoCheckout();
}

function ensureRepoCheckout() {
  if (!GH_TOKEN) {
    log.error('GITHUB_TOKEN required for repo checkout');
    throw new Error('GITHUB_TOKEN not set');
  }

  const repoUrl = `https://x-access-token:${GH_TOKEN}@github.com/${GH_REPO}.git`;

  if (fs.existsSync(path.join(CHECKOUT_DIR, '.git'))) {
    log.info('Pulling latest from main...');
    execSync('git fetch origin main && git reset --hard origin/main', { cwd: CHECKOUT_DIR, stdio: 'pipe' });
  } else {
    log.info('Cloning repo...');
    fs.mkdirSync(CHECKOUT_DIR, { recursive: true });
    execSync(`git clone --depth 1 ${repoUrl} "${CHECKOUT_DIR}"`, { stdio: 'pipe' });
  }

  execSync('git config user.email "agent@visorup.co.uk"', { cwd: CHECKOUT_DIR, stdio: 'pipe' });
  execSync('git config user.name "VisorUp Agent"', { cwd: CHECKOUT_DIR, stdio: 'pipe' });

  log.info(`Repo checked out at ${CHECKOUT_DIR}`);
  return CHECKOUT_DIR;
}
