// EMBEDDED_SITE_DATA is updated automatically by scripts/refresh-site-data.mjs
// and serves as a fallback when KV is unavailable.
const EMBEDDED_SITE_DATA = {"updated_at":"2026-07-15T13:21:59.023Z","updated_display":"July 15, 2026","ink":{"tvl_millions":122.9,"protocol_count":30},"ipo":{"polymarket_pct":24.5,"kalshi_pct":23,"avg_pct":23.7},"secondary_market":{"hiive_pps":29.8,"forge_pps":31.12,"npm_pps":32.85,"notice_pps":31.53,"avg_pps":30.7,"volume_30d_est_m":13.5,"volume_note":"Est. 30D vol. across all venues · based on Hiive H50 activity","updated":"July 15, 2026"},"prediction_markets":{"ipo":{"kalshi_pct":23,"polymarket_pct":24.5,"mktcap_16b_pct":22.5,"largest_excl_spacex_pct":0.7},"underwriters":[{"bank":"Citigroup","ticker":"CITI","pct":25.5},{"bank":"JPMorgan Chase","ticker":"JPM","pct":18.5},{"bank":"Bank of America","ticker":"BOA","pct":16},{"bank":"Goldman Sachs","ticker":"GS","pct":8.5},{"bank":"Morgan Stanley","ticker":"MS","pct":5}],"regulatory":{"clarity_act_pct":37.5,"crypto_structure_aug_pct":4.7},"ink_fdv":{"above_250m_pct":55.5,"above_500m_pct":30,"above_1b_pct":18.5,"above_2b_pct":9.5}},"xstocks":{"ink_tvl_millions":122.9,"ink_protocol_count":30,"ink_dex_24h_millions":3.56,"ink_dex_7d_millions":16.47,"ink_dex_30d_millions":75.9,"ink_dex_change_1d_pct":-3.3,"ink_dex_change_7d_pct":15.5,"total_market_cap_millions":382.1,"total_vol_24h_millions":44,"asset_count":41,"asset_leaders":[{"symbol":"TSLAX","mcap_m":58.3,"vol_24h_m":4.7,"change_24h_pct":0.3,"share_pct":15.3},{"symbol":"CRCLX","mcap_m":44.9,"vol_24h_m":8.9,"change_24h_pct":3.1,"share_pct":11.7},{"symbol":"SPYX","mcap_m":44.3,"vol_24h_m":1.8,"change_24h_pct":0.5,"share_pct":11.6},{"symbol":"MSTRX","mcap_m":38.3,"vol_24h_m":1.5,"change_24h_pct":5.1,"share_pct":10},{"symbol":"NVDAX","mcap_m":36.3,"vol_24h_m":4.5,"change_24h_pct":1.9,"share_pct":9.5}],"top_volume":[{"symbol":"CRCLX","vol_24h_m":8.9,"change_24h_pct":3.1},{"symbol":"TSLAX","vol_24h_m":4.7,"change_24h_pct":0.3},{"symbol":"SPCXX","vol_24h_m":4.6,"change_24h_pct":-1.9},{"symbol":"NVDAX","vol_24h_m":4.5,"change_24h_pct":1.9},{"symbol":"AAPLX","vol_24h_m":3.6,"change_24h_pct":0.9}],"last_refreshed":"2026-07-15T13:21:59.023Z"},"coinbase_stock":{"price_usd":163.99,"market_cap_millions":6,"change_pct":1.5,"last_refreshed":"2026-07-15T13:21:59.023Z"},"base_l2":{"tvl_millions":4557,"dex_24h_millions":1226,"dex_7d_millions":5875.5,"last_refreshed":"2026-07-15T13:21:59.023Z"},"ink_app_metrics":{"tydro":{"tvl_millions":61.37},"velodrome":{"tvl_millions":0.06,"volume_24h_millions":0},"curve":{"tvl_millions":0,"volume_24h_millions":0},"inkyswap":{"tvl_millions":0.48},"sentry":{"tvl_millions":0.02,"volume_24h_millions":0},"nado":{"volume_24h_millions":0.27},"last_refreshed":"2026-07-15T13:21:59.023Z"}};

// Per-post OG metadata for social crawlers (scrapers can't run JS)
const BRIEFS_META = {"agentic-prime-brokerage-ink": {"title": "Alpha Brief: Agentic Prime Brokerage on Ink", "description": "A live demonstration of an onchain agent treating Ink as a single execution grid — reading positions, shifting collateral, and routing trades through Tydro and Nado from a single prompt.", "image": null}, "artemis-kraken-ink-advantage": {"title": "Ink Alpha: Artemis report outlines the Kraken + Ink advantage", "description": "Artemis frames Kraken as more than an exchange — with clearing, token issuance, tokenization rails, banking optionality, and Ink as the settlement layer. The real upside starts if those rails scale.", "image": "/brief-artemis-header.png"}, "cf-benchmarks-xstocks-indices": {"title": "CF Benchmarks Brings Index Infrastructure to xStocks", "description": "CF Benchmarks launched a regulated index and corporate actions suite for xStocks, giving tokenized equities the institutional reference data infrastructure they need.", "image": "/brief-cf-benchmarks-xstocks.png"}, "deutsche-borse-200m-kraken-stake": {"title": "Alpha Brief: Deutsche Börse", "description": "Deutsche Börse Group acquires a $200M stake in Payward at a $13.3B valuation, deepening a strategic partnership spanning trading, custody, settlement, and tokenized assets.", "image": "/brief-db-header.jpg"}, "ink-alpha-mantic-prediction-markets": {"title": "Ink Alpha: Mantic Is Bringing Prediction Markets Onchain", "description": "Mantic is a beta-stage prediction market protocol built on Ink, with a roadmap moving from testnet simulation to token launch and mainnet market launch.", "image": "/brief-mantic-header.png"}, "ink-alpha-sentry-token-markets": {"title": "Ink Alpha: Sentry Unleashes Instant Token Markets", "description": "Sentry is live on Ink, pairing a token launch factory with Tsunami V3 — a concentrated-liquidity DEX — so every new token opens a live pool the moment it launches.", "image": "/brief-sentry-header.png"}, "ink-alpha-xstocks-bnb-chain": {"title": "BNB Chain Opens the xStocks Floodgate", "description": "xStocks are now live on BNB Chain, with 50+ tokenized U.S. stocks and ETFs available through PancakeSwap and CowSwap. The race shifts from listings to use cases.", "image": "/xstocks-bnb-hero.png"}, "ink-points-l2-growth-engine": {"title": "Alpha Brief: Ink Points Turns Kraken", "description": "Kraken wires its 15M+ user exchange into the Ink ecosystem via Ink Points — a loyalty program rewarding trading, staking, and engagement on Kraken Pro.", "image": "/brief-ink-points-header.jpg"}, "krak-btc-vaults": {"title": "Krak Adds Bitcoin DeFi Yield", "description": "Krak launched BTC Vaults, letting users earn up to 2.5% variable APY on their Bitcoin — a signal that Payward is turning Krak into a consumer DeFi gateway.", "image": "/brief-krak-btc-vaults.png"}, "kraken-bitnomial-cftc-stack": {"title": "Alpha Brief: Payward Acquires Bitnomial for $550M — Clearing the CFTC Trifecta", "description": "Payward acquires Bitnomial for up to $550M, gaining the first crypto-native U.S. exchange to hold the full CFTC license trifecta: exchange, clearinghouse, and brokerage.", "image": "/brief-bitnomial-header.png"}, "kraken-ipo-odds-75-percent": {"title": "Alpha Brief: Kraken IPO Odds Hit 75% — Something Is Moving the Market", "description": "Kraken's IPO prediction markets made a violent move. Polymarket at 77%, Kalshi at 73.5%, average 75.2% — up ~25 points from the morning open.", "image": "/brief-ipo-header.jpg"}, "kraken-moneygram-cash-pickup": {"title": "Kraken and MoneyGram Connect Crypto to Cash Worldwide", "description": "Kraken partnered with MoneyGram to let customers cash out crypto at nearly 500k physical locations across 100+ countries — the first step in a broader payments partnership.", "image": "/brief-kraken-moneygram.png"}, "kraken-tempo-exchange-partner": {"title": "Kraken Becomes Tempo", "description": "Kraken is becoming core infrastructure for Stripe and Paradigm's Tempo stablecoin payments chain — its first U.S. centralized exchange partner.", "image": "/brief-kraken-tempo-exchange-partner.png"}, "kraken-watch-roadmap-beyond-dashboard": {"title": "Kraken Watch: Navigating Beyond the Dashboard", "description": "Where Kraken Watch is headed: a roadmap for Prediction Watch, Ink Ecosystem, Payward Map, and the action layer we're building next.", "image": "/brief-roadmap-header.png"}, "kraken-world-cup-2026": {"title": "Kraken Enters the World Cup Arena", "description": "Kraken is now the Official Crypto Exchange Supporter of the FIFA World Cup 2026 — placing it beside Visa, Bank of America, and Coca-Cola on the world's biggest sporting stage.", "image": "/brief-kraken-world-cup-2026.png"}, "nadohq-docs-ai-agent-mcp": {"title": "Alpha Brief: NadoHQ Turns Their Docs Into an AI Agent (MCP Server)", "description": "NadoHQ ships nado-dev-mcp, an MCP server that makes their entire developer knowledge base queryable by any AI tool — 24 doc resources, 13 tools, two personas.", "image": "/alpha-briefs-hero.png"}, "otomate-ink-launch": {"title": "Otomate Raises Its Flag on Ink", "description": "Otomate is now live on Ink, combining crypto trading, tokenized xStocks, automation strategies, and AI into one onchain interface.", "image": "/otomate-ink-launch.png"}, "payward-acquires-reap": {"title": "Payward Recruits Reap Into Its Global Payments Armada", "description": "Payward is acquiring Reap for up to $600M, adding stablecoin settlement, card issuing, and global treasury rails to its expanding financial stack.", "image": "/brief-reap-acquisition.png"}, "payward-appoints-robert-moore-cfo": {"title": "Alpha Brief: Payward Appoints Robert Moore as CFO", "description": "Payward promotes Robert Moore to Chief Financial Officer. Moore joined four years ago, led the NinjaTrader acquisition, and built the company's financial architecture.", "image": null}, "payward-franklin-templeton-tokenized-assets": {"title": "Franklin Templeton Sails With Payward", "description": "One of the world's largest asset managers is now building institutional tokenized finance infrastructure with Payward — covering BENJI integration, tokenized yield products, and xStocks expansion.", "image": "/brief-franklin-templeton.png"}, "payward-onyx-prediction-markets": {"title": "Payward Leads $20M Onyx Round to Power Prediction Markets", "description": "Kraken parent Payward has led a $20 million Series A in sports prediction platform Onyx at a $220M post-money valuation — with a strategic infrastructure deal attached.", "image": "/brief-payward-onyx-prediction-markets.png"}, "payward-q1-2026-results": {"title": "Payward Drives Growth Despite Risk-Off Q1", "description": "Payward's Q1 2026 results show revenue up 3% YoY to $507M despite a 23% drop in crypto market cap and a 38% decline in spot volumes — a sign the company is becoming less cyclical and more durable.", "image": "/brief-payward-q1-2026.png"}, "kraken-bittensor-dtao": {"title": "Kraken Integrates Bittensor dTAO — Seven Subnet Tokens Listed", "description": "Kraken has completed native integration of Bittensor’s dTAO architecture and will list its first seven subnet tokens: Chutes, Hippius, Lium, Score, Targon, Ridges AI, and Vanta.", "image": "/brief-bittensor-dtao.png"}};

// Per-page OG metadata for non-blog routes (scrapers can't run react-helmet)
const PAGE_META = {
  '/kraken-vs-coinbase': {
    title: 'Kraken vs Coinbase — Live Investor Dashboard — Kraken Watch',
    description: 'Side-by-side investor comparison: revenue, valuation, tokenization, L2 ecosystems, and scenario analysis.',
    image: '/brief-kraken-vs-coinbase-v2.png',
  },
  '/payward': {
    title: 'Payward Map — Kraken Watch',
    description: 'Mapping Payward, Kraken, and the broader ecosystem across products, infrastructure, and onchain activity.',
    image: '/payward-hero.png',
  },
  '/ink': {
    title: 'Ink Ecosystem — Kraken Watch',
    description: 'Explore apps, assets, and activity across the Ink onchain ecosystem.',
    image: '/ink-hero.png',
  },
  '/prediction': {
    title: 'Prediction Watch — Kraken Watch',
    description: 'Track prediction market data and key signals across crypto, macro, and global events.',
    image: '/prediction-hero.png',
  },
  '/xstocks': {
    title: 'xStocks Helm — Kraken Watch',
    description: 'Track signals across the tokenized equity ecosystem.',
    image: '/xstocks-hero.png',
  },
  '/blog': {
    title: 'Blog — Kraken Watch',
    description: 'Short-form intelligence on Kraken, Ink L2, and the Payward ecosystem. Updated as events develop.',
    image: '/alpha-briefs-hero.png',
  },
  '/about': {
    title: 'About — Kraken Watch',
    description: 'Kraken Watch is independent research tracking Kraken, Payward, and Ink L2.',
    image: '/about-hero.png',
  },
};

// ── Worker helpers (Worker-runtime compatible) ───────────────────────────────

function r(value, decimals = 1) {
  if (!Number.isFinite(value)) return null;
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

async function fetchJ(url, timeoutMs = 25000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const XSTOCKS_CG_IDS = 'circle-xstock,tesla-xstock,microstrategy-xstock,sp500-xstock,nasdaq-xstock,alphabet-xstock,intel-xstock,gold-xstock,marvell-xstock,coinbase-xstock,amazon-xstock,robinhood-xstock,meta-xstock,microsoft-xstock,broadcom-xstock,vanguard-xstock,chevron-xstock,eli-lilly-xstock,berkshire-hathaway-xstock,gamestop-xstock,linde-xstock,walmart-xstock,tqqq-xstock,pepsico-xstock,abbvie-xstock,merck-xstock,abbott-xstock,thermo-fisher-xstock,honeywell-xstock,unitedhealth-xstock,johnson-johnson-xstock,home-depot-xstock,comcast-xstock,apple-xstock,nvidia-xstock,mastercard-xstock,visa-xstock,palantir-xstock,crowdstrike-xstock,netflix-xstock';

async function refreshSiteData(env) {
  const [chainsRes, protocolsRes, inkDexRes, cgRes] = await Promise.allSettled([
    fetchJ('https://api.llama.fi/v2/chains'),
    fetchJ('https://api.llama.fi/protocols'),
    fetchJ('https://api.llama.fi/overview/dexs/Ink?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume'),
    fetchJ(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${XSTOCKS_CG_IDS}&order=market_cap_desc&sparkline=false&per_page=250`),
  ]);

  let inkTvl = null, protocolCount = null;
  if (chainsRes.status === 'fulfilled') {
    const ink = chainsRes.value.find(c => String(c.name || '').toLowerCase() === 'ink');
    if (ink && Number.isFinite(ink.tvl)) inkTvl = r(ink.tvl / 1_000_000, 1);
  }
  if (protocolsRes.status === 'fulfilled') {
    protocolCount = protocolsRes.value.filter(
      p => Array.isArray(p.chains) && p.chains.some(c => String(c).toLowerCase() === 'ink'),
    ).length;
  }

  let dex24h = null, dex7d = null, dex30d = null, dexC1d = null, dexC7d = null;
  if (inkDexRes.status === 'fulfilled') {
    const d = inkDexRes.value;
    dex24h  = d.total24h  != null ? r(d.total24h  / 1_000_000, 2) : null;
    dex7d   = d.total7d   != null ? r(d.total7d   / 1_000_000, 2) : null;
    dex30d  = d.total30d  != null ? r(d.total30d  / 1_000_000, 1) : null;
    dexC1d  = d.change_1d != null ? r(d.change_1d, 1) : null;
    dexC7d  = d.change_7d != null ? r(d.change_7d, 1) : null;
  }

  let cgMarket = null;
  let coinbaseStock = null;
  if (cgRes.status === 'fulfilled' && Array.isArray(cgRes.value) && cgRes.value.length) {
    const data = cgRes.value;
    const totalMcap = data.reduce((s, t) => s + (t.market_cap || 0), 0);
    const totalVol  = data.reduce((s, t) => s + (t.total_volume || 0), 0);
    const byMcap = [...data]
      .sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0))
      .slice(0, 5)
      .map(t => ({
        symbol:         (t.symbol || '').toUpperCase(),
        mcap_m:         r(t.market_cap / 1e6, 1),
        vol_24h_m:      r(t.total_volume / 1e6, 1),
        change_24h_pct: r(t.price_change_percentage_24h, 1),
        share_pct:      r((t.market_cap / totalMcap) * 100, 1),
      }));
    const byVol = [...data]
      .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
      .slice(0, 5)
      .map(t => ({
        symbol:         (t.symbol || '').toUpperCase(),
        vol_24h_m:      r(t.total_volume / 1e6, 1),
        change_24h_pct: r(t.price_change_percentage_24h, 1),
      }));
    const coinXStock = data.find(t => t.id === 'coinbase-xstock');
    if (coinXStock?.current_price) {
      coinbaseStock = {
        price_usd:           r(coinXStock.current_price, 2),
        market_cap_millions: coinXStock.market_cap ? r(coinXStock.market_cap / 1e6, 0) : null,
        change_pct:          r(coinXStock.price_change_percentage_24h, 2),
      };
    }
    cgMarket = {
      total_market_cap_millions: r(totalMcap / 1e6, 1),
      total_vol_24h_millions:    r(totalVol / 1e6, 1),
      asset_count:               data.length,
      asset_leaders:             byMcap,
      top_volume:                byVol,
    };
  }

  let existing = { ...EMBEDDED_SITE_DATA };
  try {
    const kv = await env.SITE_DATA.get('site-data', { type: 'json' });
    if (kv) existing = kv;
  } catch (_) {}

  const now = new Date();
  const updated = {
    ...existing,
    updated_at: now.toISOString(),
    updated_display: now.toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
    }),
    ink: {
      tvl_millions:   inkTvl        ?? existing.ink?.tvl_millions,
      protocol_count: protocolCount ?? existing.ink?.protocol_count,
    },
    xstocks: {
      ink_tvl_millions:          inkTvl        ?? existing.xstocks?.ink_tvl_millions,
      ink_protocol_count:        protocolCount ?? existing.xstocks?.ink_protocol_count,
      ink_dex_24h_millions:      dex24h        ?? existing.xstocks?.ink_dex_24h_millions,
      ink_dex_7d_millions:       dex7d         ?? existing.xstocks?.ink_dex_7d_millions,
      ink_dex_30d_millions:      dex30d        ?? existing.xstocks?.ink_dex_30d_millions,
      ink_dex_change_1d_pct:     dexC1d        ?? existing.xstocks?.ink_dex_change_1d_pct,
      ink_dex_change_7d_pct:     dexC7d        ?? existing.xstocks?.ink_dex_change_7d_pct,
      total_market_cap_millions: cgMarket?.total_market_cap_millions ?? existing.xstocks?.total_market_cap_millions,
      total_vol_24h_millions:    cgMarket?.total_vol_24h_millions    ?? existing.xstocks?.total_vol_24h_millions,
      asset_count:               cgMarket?.asset_count               ?? existing.xstocks?.asset_count,
      asset_leaders:             cgMarket?.asset_leaders             ?? existing.xstocks?.asset_leaders,
      top_volume:                cgMarket?.top_volume                ?? existing.xstocks?.top_volume,
      last_refreshed: now.toISOString(),
    },
    coinbase_stock: {
      price_usd:           coinbaseStock?.price_usd           ?? existing.coinbase_stock?.price_usd           ?? null,
      market_cap_millions: coinbaseStock?.market_cap_millions ?? existing.coinbase_stock?.market_cap_millions ?? null,
      change_pct:          coinbaseStock?.change_pct          ?? existing.coinbase_stock?.change_pct          ?? null,
    },
  };

  await env.SITE_DATA.put('site-data', JSON.stringify(updated));
}

// ── Exported handlers ────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/site-data.json') {
      let data = EMBEDDED_SITE_DATA;
      try {
        const kv = await env.SITE_DATA.get('site-data', { type: 'json' });
        if (kv) data = kv;
      } catch (_) {}
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'cache-control': 'public, max-age=300, stale-while-revalidate=60',
        },
      });
    }

    // For non-file paths: serve SPA HTML with injected site data to eliminate flash
    const isFile = /\.[a-zA-Z0-9]+$/.test(url.pathname);
    if (!isFile) {
      // Resolve site data (KV → embedded fallback)
      let siteData = EMBEDDED_SITE_DATA;
      try {
        const kv = await env.SITE_DATA.get('site-data', { type: 'json' });
        if (kv) siteData = kv;
      } catch (_) {}

      // Always serve index.html for SPA routes — never pass through a 3xx from ASSETS
      const indexResponse = await env.ASSETS.fetch(
        new Request(new URL('/', url), request),
      );
      const html = await indexResponse.text();
      let injected = html.replace(
        '</head>',
        `<script>window.__SITE_DATA__=${JSON.stringify(siteData)};</script></head>`,
      );

      // Rewrite OG/Twitter meta tags so social scrapers get per-route previews
      const blogMatch = url.pathname.match(/^\/blog\/([^/]+)\/?$/);
      const cleanPath = url.pathname.replace(/\/$/, '') || '/';
      const meta = blogMatch
        ? BRIEFS_META[blogMatch[1]] ?? null
        : PAGE_META[cleanPath] ?? null;
      if (meta) {
        const origin = 'https://krakenwatch.com';
        const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
        if (meta.title) {
          const t = blogMatch ? esc(meta.title) + ' — Kraken Watch' : esc(meta.title);
          injected = injected.replace(/(<meta property="og:title" content=")[^"]*(")/g, `$1${t}$2`);
          injected = injected.replace(/(<meta name="twitter:title" content=")[^"]*(")/g, `$1${t}$2`);
        }
        if (meta.description) {
          const d = esc(meta.description);
          injected = injected.replace(/(<meta property="og:description" content=")[^"]*(")/g, `$1${d}$2`);
          injected = injected.replace(/(<meta name="twitter:description" content=")[^"]*(")/g, `$1${d}$2`);
        }
        if (meta.image) {
          const img = `${origin}${meta.image}`;
          injected = injected.replace(/(<meta property="og:image" content=")[^"]*(")/g, `$1${img}$2`);
          injected = injected.replace(/(<meta name="twitter:image" content=")[^"]*(")/g, `$1${img}$2`);
        }
        const canonicalPath = blogMatch ? `/blog/${blogMatch[1]}` : cleanPath;
        injected = injected.replace(/(<meta property="og:url" content=")[^"]*(")/g, `$1${origin}${canonicalPath}$2`);
      }

      // Strip any headers that could signal a redirect to crawlers
      const safeHeaders = {};
      for (const [k, v] of indexResponse.headers) {
        const lower = k.toLowerCase();
        if (lower === 'location' || lower === 'refresh') continue;
        safeHeaders[k] = v;
      }

      return new Response(injected, {
        status: 200,
        headers: {
          ...safeHeaders,
          'content-type': 'text/html; charset=utf-8',
          // Prevent Cloudflare from caching HTML — each SPA route needs its own OG tags injected
          'Cache-Control': 'no-store',
        },
      });
    }

    return env.ASSETS.fetch(request);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(refreshSiteData(env));
  },
};
