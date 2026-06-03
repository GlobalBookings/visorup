import 'dotenv/config';
import { schedule, listJobs } from './core/scheduler.js';
import { createLogger } from './core/logger.js';
import { sendSlack, slackHeader, slackSection } from './core/slack.js';
import { run as runGA4 } from './agents/ga4-briefing.js';
import { run as runKeywords } from './agents/keyword-miner.js';
import { run as runRankTracker } from './agents/rank-tracker.js';
import { run as runContentRefresher } from './agents/content-refresher.js';
import { run as runInternalLinker } from './agents/internal-linker.js';
import { run as runContentPublisher } from './agents/content-publisher.js';
import { run as runShareableContent } from './agents/shareable-content.js';
import { run as runInfographicGen } from './agents/infographic-generator.js';
import express from 'express';

const log = createLogger('main');
const PORT = parseInt(process.env.APPROVAL_PORT || '3100');

log.info('VisorUp Agent System starting...');

// ── Express server for health check and manual triggers ───
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', agents: listJobs().length, uptime: process.uptime() });
});

const triggerHandlers = {
  'ga4-briefing': runGA4,
  'keyword-miner': runKeywords,
  'rank-tracker': runRankTracker,
  'content-refresher': runContentRefresher,
  'internal-linker': runInternalLinker,
  'content-publisher': runContentPublisher,
  'shareable-content': runShareableContent,
  'infographic-generator': runInfographicGen,
};

app.post('/trigger/:agent', async (req, res) => {
  const agent = req.params.agent;
  const handler = triggerHandlers[agent];
  if (!handler) {
    res.status(404).json({ error: `Unknown agent: ${agent}`, available: Object.keys(triggerHandlers) });
    return;
  }
  res.json({ status: 'triggered', agent });
  try { await handler(); } catch (err) { log.error(`Triggered ${agent} failed: ${err.message}`); }
});

app.listen(PORT, () => { log.info(`Server listening on port ${PORT}`); });

// ── Schedule agents (UK timezone) ─────────────────────────
schedule('GA4 Briefing',        '0 9 * * *',    runGA4);              // 9 AM daily
schedule('Keyword Miner',       '0 10 * * 1',   runKeywords);         // 10 AM Monday
schedule('Rank Tracker',        '0 9 * * 1',    runRankTracker);      // 9 AM Monday
schedule('Content Refresher',   '0 11 * * 2',   runContentRefresher); // 11 AM Tuesday
schedule('Internal Linker',     '0 13 * * 1-5', runInternalLinker);   // 1 PM Mon-Fri
schedule('Content Publisher',   '0 12 * * *',   runContentPublisher); // 12 PM daily
schedule('Shareable Content',   '0 12 * * 3',   runShareableContent); // 12 PM Wednesday
schedule('Infographic Gen',     '0 10 * * 3',   runInfographicGen);   // 10 AM Wednesday

// ── Startup notification ──────────────────────────────────
const jobs = listJobs();
log.info(`${jobs.length} agents scheduled:`);
jobs.forEach(j => log.info(`  ${j.name} → ${j.schedule}`));

await sendSlack([
  slackHeader('VisorUp Agents Online'),
  slackSection(
    jobs.map(j => `• *${j.name}* → \`${j.schedule}\``).join('\n') +
    '\n\n_Manual triggers: POST /trigger/{agent-name}_'
  ),
], 'Agent system started');

log.info('Agent system running. Press Ctrl+C to stop.');
