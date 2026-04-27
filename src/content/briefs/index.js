import artemis from './artemis-kraken-ink-advantage.js';
import mantic from './ink-alpha-mantic-prediction-markets.js';
import bitnomial from './kraken-bitnomial-cftc-stack.js';
import nado from './nadohq-docs-ai-agent-mcp.js';
import ipoOdds from './kraken-ipo-odds-75-percent.js';
import deutscheBorse from './deutsche-borse-200m-kraken-stake.js';
import inkPoints from './ink-points-l2-growth-engine.js';
import agenticPb from './agentic-prime-brokerage-ink.js';
import mooreCfo from './payward-appoints-robert-moore-cfo.js';

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
].sort((a, b) => new Date(b.date) - new Date(a.date));

export default briefs;

export function getBriefBySlug(slug) {
  return briefs.find(b => b.slug === slug) ?? null;
}
