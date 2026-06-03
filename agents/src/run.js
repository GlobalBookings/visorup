import 'dotenv/config';
import { createLogger } from './core/logger.js';

const log = createLogger('runner');
const agentName = process.argv[2];

if (!agentName) {
  console.log('Usage: node src/run.js <agent-name>');
  console.log('Available agents:');
  console.log('  ga4-briefing');
  console.log('  keyword-miner');
  console.log('  rank-tracker');
  console.log('  content-refresher');
  console.log('  internal-linker');
  console.log('  content-publisher');
  console.log('  shareable-content');
  console.log('  infographic-generator');
  process.exit(1);
}

const agents = {
  'ga4-briefing': () => import('./agents/ga4-briefing.js'),
  'keyword-miner': () => import('./agents/keyword-miner.js'),
  'rank-tracker': () => import('./agents/rank-tracker.js'),
  'content-refresher': () => import('./agents/content-refresher.js'),
  'internal-linker': () => import('./agents/internal-linker.js'),
  'content-publisher': () => import('./agents/content-publisher.js'),
  'shareable-content': () => import('./agents/shareable-content.js'),
  'infographic-generator': () => import('./agents/infographic-generator.js'),
};

if (!agents[agentName]) {
  log.error(`Unknown agent: ${agentName}`);
  process.exit(1);
}

log.info(`Running ${agentName}...`);
const start = Date.now();

try {
  const mod = await agents[agentName]();
  const result = await mod.run();
  log.info(`${agentName} completed in ${((Date.now() - start) / 1000).toFixed(1)}s`);
  if (result) console.log(JSON.stringify(result, null, 2));
} catch (err) {
  log.error(`${agentName} failed: ${err.message}`);
  console.error(err);
  process.exit(1);
}
