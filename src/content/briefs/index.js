import artemis from './artemis-kraken-ink-advantage.js';
import mantic from './ink-alpha-mantic-prediction-markets.js';
import bitnomial from './kraken-bitnomial-cftc-stack.js';
import nado from './nadohq-docs-ai-agent-mcp.js';
import ipoOdds from './kraken-ipo-odds-75-percent.js';
import deutscheBorse from './deutsche-borse-200m-kraken-stake.js';
import inkPoints from './ink-points-l2-growth-engine.js';
import agenticPb from './agentic-prime-brokerage-ink.js';
import mooreCfo from './payward-appoints-robert-moore-cfo.js';
import roadmap from './kraken-watch-roadmap-beyond-dashboard.js';
import xstocksBnb from './ink-alpha-xstocks-bnb-chain.js';
import sentry from './ink-alpha-sentry-token-markets.js';
import otomate from './otomate-ink-launch.js';
import reap from './payward-acquires-reap.js';
import moneygram from './kraken-moneygram-cash-pickup.js';
import cfBenchmarks from './cf-benchmarks-xstocks-indices.js';
import franklinTempleton from './payward-franklin-templeton-tokenized-assets.js';
import q1Results from './payward-q1-2026-results.js';

const briefs = [
  artemis,
  mantic,
  bitnomial,
  nado,
  ipoOdds,
  deutscheBorse,
  inkPoints,
  agenticPb,
  mooreCfo,
  roadmap,
  xstocksBnb,
  sentry,
  otomate,
  reap,
  moneygram,
  cfBenchmarks,
  franklinTempleton,
  q1Results,
].sort((a, b) => new Date(b.date) - new Date(a.date));

export default briefs;

export function getBriefBySlug(slug) {
  return briefs.find(b => b.slug === slug) ?? null;
}
