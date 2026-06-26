import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';

const SITE_DATA_PATH = new URL('../public/site-data.json', import.meta.url);
const INK_APP_METRICS_PATH = new URL('../public/ink-app-metrics.json', import.meta.url);
const INK_APPS_PATH = new URL('../public/ink-apps.json', import.meta.url);

const SECONDARY_BASE_WEIGHTS = {
  hiive_pps: 0.4,
  forge_pps: 0.3,
  npm_pps: 0.2,
  notice_pps: 0.1,
};

const MAX_OUTLIER_DEVIATION = 0.5;

// Any scraped per-share price outside this range is silently discarded
// and the previously known good value is preserved instead.
const SECONDARY_PPS_MIN = 10;
const SECONDARY_PPS_MAX = 500;

function isPlausiblePps(value) {
  return Number.isFinite(value) && value >= SECONDARY_PPS_MIN && value <= SECONDARY_PPS_MAX;
}

function parseNumeric(input) {
  if (input == null) {
    return null;
  }
  if (typeof input === 'number' && Number.isFinite(input)) {
    return input;
  }
  if (typeof input === 'string') {
    const cleaned = input.replace(/[$,%\s,]/g, '');
    const value = Number.parseFloat(cleaned);
    return Number.isFinite(value) ? value : null;
  }
  return null;
}

function round(value, decimals = 1) {
  if (!Number.isFinite(value)) {
    return null;
  }
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function safeJsonParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function weightedAverage(entries) {
  const valid = entries.filter(
    (entry) => Number.isFinite(entry.value) && Number.isFinite(entry.weight) && entry.weight > 0,
  );

  if (!valid.length) {
    return null;
  }

  const totalWeight = valid.reduce((sum, entry) => sum + entry.weight, 0);
  if (totalWeight <= 0) {
    return null;
  }

  return valid.reduce((sum, entry) => sum + entry.value * entry.weight, 0) / totalWeight;
}

function median(values) {
  if (!values.length) {
    return null;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function parseDateFromText(value) {
  if (!value) {
    return null;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function freshnessMultiplier(sourceDate, now) {
  if (!sourceDate) {
    return 0.35;
  }
  const ageMs = Math.max(0, now.getTime() - sourceDate.getTime());
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  // exponential-like linear cap:
  // <=2d -> ~1.0, 14d -> ~0.6, >=45d -> 0.2
  if (ageDays <= 2) {
    return 1;
  }
  if (ageDays >= 45) {
    return 0.2;
  }
  return 1 - ((ageDays - 2) / (45 - 2)) * 0.8;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 30_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} at ${url}`);
    }
    return response;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms: ${url}`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url, options = {}) {
  const response = await fetchWithTimeout(url, options);
  return response.text();
}

async function fetchJson(url, options = {}) {
  const response = await fetchWithTimeout(url, options);
  return response.json();
}

async function withRetries(name, fn, retries = 3) {
  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await delay(1000 * attempt);
      }
    }
  }
  throw new Error(`${name} failed after ${retries} attempts: ${lastError?.message ?? 'unknown error'}`);
}

async function runOptional(name, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`${name} unavailable: ${error.message}`);
    return null;
  }
}

async function getDefiLlamaData() {
  const [chains, protocols] = await Promise.all([
    withRetries('DeFiLlama chains', () => fetchJson('https://api.llama.fi/v2/chains')),
    withRetries('DeFiLlama protocols', () => fetchJson('https://api.llama.fi/protocols')),
  ]);

  const inkChain = chains.find((chain) => String(chain.name || '').toLowerCase() === 'ink');
  if (!inkChain || !Number.isFinite(inkChain.tvl)) {
    throw new Error('Ink chain TVL not found in DeFiLlama response');
  }

  const protocolCount = protocols.filter(
    (protocol) => Array.isArray(protocol.chains) && protocol.chains.some((c) => String(c).toLowerCase() === 'ink'),
  ).length;

  return {
    tvl_millions: round(inkChain.tvl / 1_000_000, 1),
    protocol_count: protocolCount,
  };
}

const COINGECKO_XSTOCKS_IDS = [
  'circle-xstock', 'tesla-xstock', 'microstrategy-xstock', 'sp500-xstock',
  'nasdaq-xstock', 'alphabet-xstock', 'intel-xstock', 'gold-xstock',
  'marvell-xstock', 'coinbase-xstock', 'amazon-xstock', 'robinhood-xstock',
  'meta-xstock', 'microsoft-xstock', 'broadcom-xstock', 'vanguard-xstock',
  'chevron-xstock', 'eli-lilly-xstock', 'berkshire-hathaway-xstock',
  'gamestop-xstock', 'linde-xstock', 'walmart-xstock', 'tqqq-xstock',
  'pepsico-xstock', 'abbvie-xstock', 'merck-xstock', 'abbott-xstock',
  'thermo-fisher-xstock', 'honeywell-xstock', 'unitedhealth-xstock',
  'johnson-johnson-xstock', 'home-depot-xstock', 'comcast-xstock',
  'apple-xstock', 'nvidia-xstock', 'mastercard-xstock', 'visa-xstock',
  'palantir-xstock', 'crowdstrike-xstock', 'netflix-xstock', 'spacex-xstocks',
].join(',');

async function getXStocksMarketData() {
  const data = await withRetries('CoinGecko xStocks', () =>
    fetchJson(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINGECKO_XSTOCKS_IDS}&order=market_cap_desc&sparkline=false&per_page=250`,
    ),
  );
  if (!Array.isArray(data) || !data.length) throw new Error('CoinGecko returned empty');

  const totalMcap = data.reduce((s, t) => s + (t.market_cap || 0), 0);
  const totalVol  = data.reduce((s, t) => s + (t.total_volume || 0), 0);

  const byMcap = [...data]
    .sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0))
    .slice(0, 5)
    .map((t) => ({
      symbol:          (t.symbol || '').toUpperCase(),
      mcap_m:          round(t.market_cap / 1_000_000, 1),
      vol_24h_m:       round(t.total_volume / 1_000_000, 1),
      change_24h_pct:  round(t.price_change_percentage_24h, 1),
      share_pct:       round((t.market_cap / totalMcap) * 100, 1),
    }));

  const byVol = [...data]
    .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
    .slice(0, 5)
    .map((t) => ({
      symbol:         (t.symbol || '').toUpperCase(),
      vol_24h_m:      round(t.total_volume / 1_000_000, 1),
      change_24h_pct: round(t.price_change_percentage_24h, 1),
    }));

  return {
    total_market_cap_millions: round(totalMcap / 1_000_000, 1),
    total_vol_24h_millions:    round(totalVol / 1_000_000, 1),
    asset_count:               data.length,
    asset_leaders:             byMcap,
    top_volume:                byVol,
  };
}

async function getCoinbaseStockData() {
  const data = await withRetries('Yahoo Finance COIN', () =>
    fetchJson(
      'https://query1.finance.yahoo.com/v8/finance/chart/COIN?interval=1d&range=2d',
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KrakenWatch/1.0)', Accept: 'application/json' } },
    ),
  );
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta?.regularMarketPrice) throw new Error('COIN price not found');
  const price = meta.regularMarketPrice;
  const prevClose = meta.previousClose ?? meta.chartPreviousClose;
  return {
    price_usd: round(price, 2),
    market_cap_millions: meta.marketCap ? round(meta.marketCap / 1_000_000, 0) : null,
    change_pct: (prevClose && prevClose > 0) ? round((price - prevClose) / prevClose * 100, 2) : null,
  };
}

async function getBaseChainData() {
  const chains = await withRetries('DeFiLlama Base TVL', () => fetchJson('https://api.llama.fi/v2/chains'));
  const base = chains.find((c) => String(c.name || '').toLowerCase() === 'base');
  if (!base || !Number.isFinite(base.tvl)) throw new Error('Base chain TVL not found');
  const dex = await runOptional('DeFiLlama Base DEX', () =>
    fetchJson('https://api.llama.fi/overview/dexs/Base?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume'),
  );
  return {
    tvl_millions: round(base.tvl / 1_000_000, 0),
    dex_24h_millions: dex?.total24h != null ? round(dex.total24h / 1_000_000, 1) : null,
    dex_7d_millions: dex?.total7d != null ? round(dex.total7d / 1_000_000, 1) : null,
  };
}

async function getInkDexData() {
  const data = await withRetries('DeFiLlama Ink DEX', () =>
    fetchJson(
      'https://api.llama.fi/overview/dexs/Ink?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume',
    ),
  );
  return {
    volume_24h_millions:  data.total24h  != null ? round(data.total24h  / 1_000_000, 2) : null,
    volume_7d_millions:   data.total7d   != null ? round(data.total7d   / 1_000_000, 2) : null,
    volume_30d_millions:  data.total30d  != null ? round(data.total30d  / 1_000_000, 1) : null,
    change_1d_pct:        data.change_1d != null ? round(data.change_1d, 1)              : null,
    change_7d_pct:        data.change_7d != null ? round(data.change_7d, 1)              : null,
    protocols:            Array.isArray(data.protocols) ? data.protocols : [],
  };
}

// Map from our app id to DeFiLlama protocol slug(s) to try (case-insensitive)
const INK_APP_PROTOCOL_SLUGS = {
  tydro:    ['tydro'],
  velodrome: ['velodrome-v2', 'velodrome'],
  curve:    ['curve-dex', 'curve'],
  across:   ['across', 'across-protocol'],
  nado:     ['nado'],
  inkyswap: ['inkyswap'],
  sentry:   ['sentry', 'tsunami-v3'],
  inkdca:   ['inkdca'],
  inkypump: ['inkypump'],
};

async function getInkAppMetrics(inkDexProtocols) {
  const metrics = {};

  // ── TVL per protocol via DeFiLlama /protocols ───────────────────────────
  try {
    const protocols = await withRetries('DeFiLlama protocols (Ink apps)', () =>
      fetchJson('https://api.llama.fi/protocols'),
    );
    const inkProtocols = protocols.filter(
      (p) => Array.isArray(p.chains) && p.chains.some((c) => String(c).toLowerCase() === 'ink'),
    );

    for (const [appId, slugs] of Object.entries(INK_APP_PROTOCOL_SLUGS)) {
      const match = inkProtocols.find((p) =>
        slugs.some(
          (s) =>
            String(p.slug ?? '').toLowerCase() === s.toLowerCase() ||
            String(p.name ?? '').toLowerCase() === s.toLowerCase(),
        ),
      );
      if (!match) continue;

      // Prefer Ink-specific TVL from chainTvls; fall back to total tvl
      const chainEntry = match.chainTvls?.Ink;
      const inkTvl =
        typeof chainEntry === 'number'
          ? chainEntry
          : typeof chainEntry?.tvl === 'number'
            ? chainEntry.tvl
            : Number.isFinite(match.tvl)
              ? match.tvl
              : null;

      if (Number.isFinite(inkTvl) && inkTvl > 0) {
        metrics[appId] = metrics[appId] ?? {};
        metrics[appId].tvl_millions = round(inkTvl / 1_000_000, 2);
      }
    }
  } catch (err) {
    console.warn(`Ink app TVL fetch failed: ${err.message}`);
  }

  // ── 24h DEX volume per protocol (from already-fetched DEX overview) ─────
  const dexProtos = Array.isArray(inkDexProtocols) ? inkDexProtocols : [];
  for (const [appId, slugs] of Object.entries(INK_APP_PROTOCOL_SLUGS)) {
    const match = dexProtos.find((p) =>
      slugs.some(
        (s) =>
          String(p.slug ?? '').toLowerCase() === s.toLowerCase() ||
          String(p.name ?? '').toLowerCase().includes(s.toLowerCase()) ||
          String(p.displayName ?? '').toLowerCase().includes(s.toLowerCase()),
      ),
    );
    if (match?.total24h != null) {
      metrics[appId] = metrics[appId] ?? {};
      metrics[appId].volume_24h_millions = round(match.total24h / 1_000_000, 2);
    }
  }

  // ── Unique active users per protocol via DeFiLlama /overview/users/Ink ──
  try {
    const usersData = await withRetries('DeFiLlama Ink users', () =>
      fetchJson(
        'https://api.llama.fi/overview/users/Ink?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true',
      ),
    );
    const userProtos = Array.isArray(usersData?.protocols) ? usersData.protocols : [];
    for (const [appId, slugs] of Object.entries(INK_APP_PROTOCOL_SLUGS)) {
      const match = userProtos.find((p) =>
        slugs.some(
          (s) =>
            String(p.slug ?? '').toLowerCase() === s.toLowerCase() ||
            String(p.name ?? '').toLowerCase().includes(s.toLowerCase()) ||
            String(p.displayName ?? '').toLowerCase().includes(s.toLowerCase()),
        ),
      );
      const users = match?.total24h ?? match?.totalUsers ?? null;
      if (users != null && Number.isFinite(users) && users > 0) {
        metrics[appId] = metrics[appId] ?? {};
        metrics[appId].unique_users_24h = Math.round(users);
      }
    }
  } catch (err) {
    console.warn(`Ink app users fetch failed: ${err.message}`);
  }

  return metrics;
}

function extractPolymarketMarket(eventPayload) {
  if (!Array.isArray(eventPayload) || !eventPayload.length) {
    return null;
  }
  const event = eventPayload[0];
  if (!Array.isArray(event.markets)) {
    return null;
  }

  const active2026 = event.markets.find(
    (market) =>
      market.active === true &&
      market.closed === false &&
      typeof market.question === 'string' &&
      market.question.toLowerCase().includes('by december 31, 2026'),
  );

  return active2026 ?? event.markets.find((market) => market.active === true && market.closed === false) ?? null;
}

function parsePolymarketProbability(market) {
  if (!market) {
    return null;
  }
  const yesBid = parseNumeric(market.bestBid);
  const yesAsk = parseNumeric(market.bestAsk);
  if (yesBid != null && yesAsk != null && yesBid >= 0 && yesAsk <= 1.1) {
    return (yesBid + yesAsk) / 2;
  }

  const prices = safeJsonParse(market.outcomePrices, null);
  if (Array.isArray(prices) && prices.length) {
    const yes = parseNumeric(prices[0]);
    if (yes != null) {
      return yes;
    }
  }

  return parseNumeric(market.lastTradePrice);
}

async function getPolymarketData() {
  const events = await withRetries('Polymarket event', () =>
    fetchJson('https://gamma-api.polymarket.com/events?slug=kraken-ipo-in-2025'),
  );
  const market = extractPolymarketMarket(events);
  if (!market) {
    throw new Error('Polymarket active market not found');
  }

  const probability = parsePolymarketProbability(market);
  if (probability == null) {
    throw new Error('Polymarket probability missing');
  }

  const spread = (() => {
    const bid = parseNumeric(market.bestBid);
    const ask = parseNumeric(market.bestAsk);
    if (bid == null || ask == null) {
      return 0.08;
    }
    return Math.max(0.01, ask - bid);
  })();

  const volume = parseNumeric(market.volume24hr ?? market.volume1wk ?? market.volumeNum ?? market.volume);
  const openInterest = parseNumeric(market.openInterest);
  const liquidityWeight = Math.max(1, (volume ?? 0) / 1000 + (openInterest ?? 0) / 10000);
  const spreadPenalty = 1 / Math.max(0.01, spread * 100);

  return {
    pct: round(probability * 100, 1),
    weight: Math.max(0.15, liquidityWeight * spreadPenalty),
  };
}

async function getKalshiData() {
  const payload = await withRetries('Kalshi market', () =>
    fetchJson('https://api.elections.kalshi.com/trade-api/v2/markets/KXIPO-26-KRAKEN'),
  );
  const market = payload?.market;
  if (!market) {
    throw new Error('Kalshi market payload missing');
  }

  const yesBid = parseNumeric(market.yes_bid_dollars);
  const yesAsk = parseNumeric(market.yes_ask_dollars);
  const lastPrice = parseNumeric(market.last_price_dollars);

  let probability = null;
  if (yesBid != null && yesAsk != null) {
    probability = (yesBid + yesAsk) / 2;
  } else {
    probability = lastPrice;
  }

  if (probability == null) {
    throw new Error('Kalshi probability missing');
  }

  const spread = yesBid != null && yesAsk != null ? Math.max(0.01, yesAsk - yesBid) : 0.08;
  const volume = parseNumeric(market.volume_24h_fp ?? market.volume_fp);
  const openInterest = parseNumeric(market.open_interest_fp);
  const liquidityWeight = Math.max(1, (volume ?? 0) / 200 + (openInterest ?? 0) / 5000);
  const spreadPenalty = 1 / Math.max(0.01, spread * 100);

  return {
    pct: round(probability * 100, 1),
    weight: Math.max(0.15, liquidityWeight * spreadPenalty),
  };
}

function extractFirstCurrency(html, contextRegex = null) {
  if (!html) {
    return null;
  }

  let target = html;
  if (contextRegex) {
    const ctx = target.match(contextRegex);
    if (ctx?.[0]) {
      target = ctx[0];
    }
  }

  const direct = target.match(/\$([0-9]{1,4}(?:\.[0-9]{1,2})?)/);
  if (!direct) {
    return null;
  }
  return parseNumeric(direct[1]);
}

async function getHiivePrice() {
  const html = await withRetries('Hiive page', () =>
    fetchText('https://www.hiive.com/securities/kraken-stock', {
      headers: { 'user-agent': 'Mozilla/5.0 (KrakenWatch refresh bot)' },
    }),
  );
  return extractFirstCurrency(html, /Kraken Stock[\s\S]{0,800}/i);
}

async function getNpmPriceAndDate() {
  const html = await withRetries('Nasdaq Private Market page', () =>
    fetchText('https://www.nasdaqprivatemarket.com/company/kraken/', {
      headers: { 'user-agent': 'Mozilla/5.0 (KrakenWatch refresh bot)' },
    }),
  );

  // Extract the region around the price heading, then scan ALL dollar amounts
  // and return the first one that passes the plausibility range ($10–$500).
  // This skips UI noise values like $9, $5, $1 that appear before the real price.
  let target = html;
  const ctx = html.match(/Kraken Stock Price Per Share[\s\S]{0,1200}/i);
  if (ctx?.[0]) target = ctx[0];

  const allAmounts = [...target.matchAll(/\$([0-9]{1,4}(?:\.[0-9]{1,2})?)/g)];
  const pps = allAmounts.map((m) => parseNumeric(m[1])).find((v) => isPlausiblePps(v)) ?? null;

  const updatedMatch = html.match(/Updated\s+([A-Za-z]{3,9},?\s+\d{4})/i);
  const sourceDate = updatedMatch ? parseDateFromText(updatedMatch[1]) : null;
  return { pps, sourceDate };
}

async function getForgePriceAndDate() {
  const html = await withRetries('Forge page', () =>
    fetchText('https://forgeglobal.com/kraken_stock/', {
      headers: { 'user-agent': 'Mozilla/5.0 (KrakenWatch refresh bot)' },
    }),
  );

  const priceMatch = html.match(/Kraken Forge Price is \$([0-9]+(?:\.[0-9]{1,2})?)/i);
  const dateMatch = html.match(/as of ([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i);

  return {
    pps: priceMatch ? parseNumeric(priceMatch[1]) : null,
    sourceDate: dateMatch ? parseDateFromText(dateMatch[1]) : null,
  };
}

// ── Prediction Markets ──────────────────────────────────────────────────────

async function getPolymarketSingleEvent(slug, questionFilter) {
  const events = await withRetries(`Polymarket ${slug}`, () =>
    fetchJson(`https://gamma-api.polymarket.com/events?slug=${slug}`),
  );
  if (!Array.isArray(events) || !events.length) throw new Error('No events');
  const markets = events[0]?.markets ?? [];
  const market = questionFilter
    ? (markets.find(m => m.active && !m.closed && m.question?.includes(questionFilter)) ??
       markets.find(m => m.question?.includes(questionFilter)) ??
       markets[0])
    : (markets.find(m => m.active && !m.closed) ?? markets[0]);
  if (!market) throw new Error('Market not found');
  const prices = safeJsonParse(market.outcomePrices, ['0']);
  const yes = parseNumeric(Array.isArray(prices) ? prices[0] : null);
  if (yes == null) throw new Error('No price');
  return round(yes * 100, 1);
}

async function getKalshiMarket(ticker) {
  const payload = await withRetries(`Kalshi ${ticker}`, () =>
    fetchJson(`https://api.elections.kalshi.com/trade-api/v2/markets/${ticker}`),
  );
  const market = payload?.market;
  if (!market) throw new Error('Missing market');
  const bid = parseNumeric(market.yes_bid_dollars);
  const ask = parseNumeric(market.yes_ask_dollars);
  const last = parseNumeric(market.last_price_dollars);
  let prob = null;
  if (bid != null && ask != null) prob = (bid + ask) / 2;
  else if (last != null) prob = last;
  if (prob == null) throw new Error('Missing price');
  return round(prob * 100, 1);
}

async function getKalshiSeries(seriesTicker, limit = 20) {
  const payload = await withRetries(`Kalshi series ${seriesTicker}`, () =>
    fetchJson(`https://api.elections.kalshi.com/trade-api/v2/markets?series_ticker=${seriesTicker}&limit=${limit}`),
  );
  return payload?.markets ?? [];
}

async function getPredictionMarkets(existing) {
  const ex = existing?.prediction_markets ?? {};

  const [
    clarityAct,
    mktcap16b,
    largestIPO,
    inkFdv250m,
    inkFdv500m,
    inkFdv1b,
    inkFdv2b,
    kalshiIPO,
    kalshiCryptoAug,
    kalshiUnderwriterMarkets,
  ] = await Promise.allSettled([
    getPolymarketSingleEvent('clarity-act-signed-into-law-in-2026'),
    getPolymarketSingleEvent('kraken-ipo-closing-market-cap-above', '$16B'),
    getPolymarketSingleEvent('largest-ipo-by-market-cap-in-2026-287', 'Kraken'),
    getPolymarketSingleEvent('ink-fdv-above-one-day-after-launch', '$250M'),
    getPolymarketSingleEvent('ink-fdv-above-one-day-after-launch', '$500M'),
    getPolymarketSingleEvent('ink-fdv-above-one-day-after-launch', '$1B'),
    getPolymarketSingleEvent('ink-fdv-above-one-day-after-launch', '$2B'),
    getKalshiMarket('KXIPO-26-KRAKEN'),
    getKalshiMarket('KXCRYPTOSTRUCTURE-26JAN-AUG'),
    getKalshiSeries('KXKRAKENBANKPUBLIC'),
  ]);

  const val = (settled, fallback) =>
    settled.status === 'fulfilled' ? settled.value : fallback;

  // Underwriters: build array from live series data
  const BANK_LABELS = { MS: 'Morgan Stanley', JPM: 'JPMorgan Chase', GS: 'Goldman Sachs', CITI: 'Citigroup', BOA: 'Bank of America' };
  const exUnderwriters = ex.underwriters ?? [];

  let underwriters;
  if (kalshiUnderwriterMarkets.status === 'fulfilled') {
    underwriters = kalshiUnderwriterMarkets.value
      .filter(m => m.ticker?.startsWith('KXKRAKENBANKPUBLIC-'))
      .map(m => {
        const suffix = m.ticker.split('-').pop();
        const label = BANK_LABELS[suffix] ?? suffix;
        const bid = parseNumeric(m.yes_bid_dollars);
        const ask = parseNumeric(m.yes_ask_dollars);
        const last = parseNumeric(m.last_price_dollars);
        let pct = null;
        if (bid != null && ask != null) pct = round((bid + ask) / 2 * 100, 1);
        else if (last != null) pct = round(last * 100, 1);
        return { bank: label, ticker: suffix, pct };
      })
      .filter(u => u.pct != null)
      .sort((a, b) => b.pct - a.pct);
  } else {
    underwriters = exUnderwriters;
  }

  // Kraken ex-SpaceX: compute conditional from raw Kraken + SpaceX prices
  let largestExSpaceX = ex.ipo?.largest_excl_spacex_pct ?? 4.3;
  if (largestIPO.status === 'fulfilled') {
    // We fetched Kraken's raw %, compute conditional
    // Also fetch SpaceX price to compute conditional
    try {
      const spaceXPct = await getPolymarketSingleEvent('largest-ipo-by-market-cap-in-2026-287', 'SpaceX');
      const krakenRaw = largestIPO.value / 100;
      const spaceXRaw = spaceXPct / 100;
      const pool = Math.max(0.01, 1 - spaceXRaw);
      largestExSpaceX = round((krakenRaw / pool) * 100, 1);
    } catch {
      largestExSpaceX = ex.ipo?.largest_excl_spacex_pct ?? 4.3;
    }
  }

  return {
    ipo: {
      kalshi_pct: val(kalshiIPO, ex.ipo?.kalshi_pct),
      polymarket_pct: ex.ipo?.polymarket_pct,
      mktcap_16b_pct: val(mktcap16b, ex.ipo?.mktcap_16b_pct),
      largest_excl_spacex_pct: largestExSpaceX,
    },
    underwriters,
    regulatory: {
      clarity_act_pct: val(clarityAct, ex.regulatory?.clarity_act_pct),
      crypto_structure_aug_pct: val(kalshiCryptoAug, ex.regulatory?.crypto_structure_aug_pct),
    },
    ink_fdv: {
      above_250m_pct: val(inkFdv250m, ex.ink_fdv?.above_250m_pct),
      above_500m_pct: val(inkFdv500m, ex.ink_fdv?.above_500m_pct),
      above_1b_pct: val(inkFdv1b, ex.ink_fdv?.above_1b_pct),
      above_2b_pct: val(inkFdv2b, ex.ink_fdv?.above_2b_pct),
    },
  };
}

async function getNoticePrice() {
  const extractFromMirror = async () => {
    const mirrorText = await withRetries(
      'Notice mirror page',
      () => fetchText('https://r.jina.ai/http://notice.co/c/kraken'),
      2,
    );

    // Mirror tends to expose an explicit headline like:
    // "Kraken Stock $49.06 | ..."
    const mirrorMatch = mirrorText.match(/Kraken Stock\s*\$([0-9]+(?:\.[0-9]{1,2})?)/i);
    if (mirrorMatch) {
      return parseNumeric(mirrorMatch[1]);
    }

    return extractFirstCurrency(mirrorText, /Kraken[\s\S]{0,1200}/i);
  };

  try {
    const html = await withRetries(
      'Notice page',
      () =>
        fetchText('https://notice.co/c/kraken', {
          headers: { 'user-agent': 'Mozilla/5.0 (KrakenWatch refresh bot)' },
        }),
      2,
    );
    const directValue = extractFirstCurrency(html, /Kraken[\s\S]{0,1200}/i);
    if (directValue != null) {
      return directValue;
    }
  } catch {
    // Fall through to mirror source when Notice blocks bot traffic.
  }

  try {
    return await extractFromMirror();
  } catch {
    return null;
  }
}

function buildSecondaryMarket(existing, live, now) {
  const merged = {
    hiive_pps:  (isPlausiblePps(live.hiive_pps)  ? live.hiive_pps  : null) ?? existing.hiive_pps  ?? null,
    forge_pps:  (isPlausiblePps(live.forge_pps)  ? live.forge_pps  : null) ?? existing.forge_pps  ?? null,
    npm_pps:    (isPlausiblePps(live.npm_pps)    ? live.npm_pps    : null) ?? existing.npm_pps    ?? null,
    notice_pps: (isPlausiblePps(live.notice_pps) ? live.notice_pps : null) ?? existing.notice_pps ?? null,
    avg_pps: existing.avg_pps ?? null,
    volume_30d_est_m: existing.volume_30d_est_m ?? null,
    volume_note: existing.volume_note ?? '',
    updated: now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }),
  };

  const prices = [
    { key: 'hiive_pps', value: merged.hiive_pps },
    { key: 'forge_pps', value: merged.forge_pps },
    { key: 'npm_pps', value: merged.npm_pps },
    { key: 'notice_pps', value: merged.notice_pps },
  ].filter((entry) => Number.isFinite(entry.value));

  if (!prices.length) {
    return merged;
  }

  const med = median(prices.map((entry) => entry.value));
  const filtered = prices.filter((entry) => {
    if (!Number.isFinite(med) || med <= 0) {
      return true;
    }
    return Math.abs(entry.value - med) / med <= MAX_OUTLIER_DEVIATION;
  });

  const byKey = Object.fromEntries(filtered.map((entry) => [entry.key, entry.value]));

  const candidates = filtered.map((entry) => {
    const baseWeight = SECONDARY_BASE_WEIGHTS[entry.key] ?? 0.1;
    const sourceDate =
      entry.key === 'forge_pps'
        ? live.forge_date ?? null
        : entry.key === 'npm_pps'
          ? live.npm_date ?? null
          : now;
    const weight = baseWeight * freshnessMultiplier(sourceDate, now);
    return { value: entry.value, weight };
  });

  const avg = weightedAverage(candidates);
  if (avg != null) {
    merged.avg_pps = round(avg, 2);
  } else if (Number.isFinite(existing.avg_pps)) {
    merged.avg_pps = existing.avg_pps;
  }

  // Preserve canonical source fields even if filtered out from averaging.
  // Fall back to existing (last known good) — never to the outlier live value.
  merged.hiive_pps  = byKey.hiive_pps  ?? existing.hiive_pps  ?? null;
  merged.forge_pps  = byKey.forge_pps  ?? existing.forge_pps  ?? null;
  merged.npm_pps    = byKey.npm_pps    ?? existing.npm_pps    ?? null;
  merged.notice_pps = byKey.notice_pps ?? existing.notice_pps ?? null;

  return merged;
}

async function main() {
  const now = new Date();
  const existingRaw = await readFile(SITE_DATA_PATH, 'utf8');
  const existing = safeJsonParse(existingRaw, {});

  const [ink, inkDex, xstocksMkt, poly, kalshi, hiive, forge, npm, notice, coinbaseStock, baseChain] = await Promise.all([
    getDefiLlamaData(),
    runOptional('Ink DEX', getInkDexData),
    runOptional('CoinGecko xStocks', getXStocksMarketData),
    runOptional('Polymarket IPO', getPolymarketData),
    runOptional('Kalshi IPO', getKalshiData),
    runOptional('Hiive', getHiivePrice),
    runOptional('Forge', getForgePriceAndDate),
    runOptional('NPM', getNpmPriceAndDate),
    runOptional('Notice', getNoticePrice),
    runOptional('Coinbase stock (COIN)', getCoinbaseStockData),
    runOptional('Base chain', getBaseChainData),
  ]);

  const inkAppMetrics = await runOptional('Ink app metrics', () =>
    getInkAppMetrics(inkDex?.protocols ?? []),
  );

  const ipoCandidates = [
    ...(poly   ? [{ value: poly.pct,   weight: poly.weight   }] : []),
    ...(kalshi ? [{ value: kalshi.pct, weight: kalshi.weight }] : []),
  ];

  const ipoAvg = weightedAverage(ipoCandidates);

  const secondaryMarket = buildSecondaryMarket(
    existing.secondary_market ?? {},
    {
      hiive_pps: hiive,
      forge_pps: forge?.pps ?? null,
      npm_pps: npm?.pps ?? null,
      notice_pps: notice,
      forge_date: forge?.sourceDate ?? null,
      npm_date: npm?.sourceDate ?? null,
    },
    now,
  );

  // Fetch extended prediction markets (best-effort)
  const predMarkets = await runOptional('Prediction markets', () => getPredictionMarkets(existing));

  // Sync the main IPO polymarket_pct into prediction_markets.ipo
  const finalPredMarkets = predMarkets
    ? {
        ...predMarkets,
        ipo: {
          ...predMarkets.ipo,
          polymarket_pct: poly?.pct ?? predMarkets.ipo?.polymarket_pct,
          kalshi_pct: kalshi?.pct ?? predMarkets.ipo?.kalshi_pct,
        },
      }
    : existing.prediction_markets ?? null;

  const updated = {
    updated_at: now.toISOString(),
    updated_display: now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }),
    ink,
    ipo: {
      polymarket_pct: poly?.pct   ?? existing.ipo?.polymarket_pct ?? null,
      kalshi_pct:     kalshi?.pct ?? existing.ipo?.kalshi_pct     ?? null,
      avg_pct: ipoAvg != null ? round(ipoAvg, 1) : existing.ipo?.avg_pct ?? null,
    },
    secondary_market: secondaryMarket,
    ...(finalPredMarkets != null ? { prediction_markets: finalPredMarkets } : {}),
    xstocks: {
      ink_tvl_millions:      ink.tvl_millions,
      ink_protocol_count:    ink.protocol_count,
      ink_dex_24h_millions:  inkDex?.volume_24h_millions  ?? existing.xstocks?.ink_dex_24h_millions  ?? null,
      ink_dex_7d_millions:   inkDex?.volume_7d_millions   ?? existing.xstocks?.ink_dex_7d_millions   ?? null,
      ink_dex_30d_millions:  inkDex?.volume_30d_millions  ?? existing.xstocks?.ink_dex_30d_millions  ?? null,
      ink_dex_change_1d_pct: inkDex?.change_1d_pct        ?? existing.xstocks?.ink_dex_change_1d_pct ?? null,
      ink_dex_change_7d_pct: inkDex?.change_7d_pct        ?? existing.xstocks?.ink_dex_change_7d_pct ?? null,
      total_market_cap_millions: xstocksMkt?.total_market_cap_millions ?? existing.xstocks?.total_market_cap_millions ?? null,
      total_vol_24h_millions:    xstocksMkt?.total_vol_24h_millions    ?? existing.xstocks?.total_vol_24h_millions    ?? null,
      asset_count:               xstocksMkt?.asset_count               ?? existing.xstocks?.asset_count               ?? null,
      asset_leaders:             xstocksMkt?.asset_leaders             ?? existing.xstocks?.asset_leaders             ?? null,
      top_volume:                xstocksMkt?.top_volume                ?? existing.xstocks?.top_volume                ?? null,
      last_refreshed: now.toISOString(),
    },
    coinbase_stock: {
      price_usd:           coinbaseStock?.price_usd           ?? existing.coinbase_stock?.price_usd           ?? null,
      market_cap_millions: coinbaseStock?.market_cap_millions ?? existing.coinbase_stock?.market_cap_millions ?? null,
      change_pct:          coinbaseStock?.change_pct          ?? existing.coinbase_stock?.change_pct          ?? null,
      last_refreshed: now.toISOString(),
    },
    base_l2: {
      tvl_millions:     baseChain?.tvl_millions     ?? existing.base_l2?.tvl_millions     ?? null,
      dex_24h_millions: baseChain?.dex_24h_millions ?? existing.base_l2?.dex_24h_millions ?? null,
      dex_7d_millions:  baseChain?.dex_7d_millions  ?? existing.base_l2?.dex_7d_millions  ?? null,
      last_refreshed: now.toISOString(),
    },
    ink_app_metrics: {
      ...(existing.ink_app_metrics ?? {}),
      ...(inkAppMetrics ?? {}),
      last_refreshed: now.toISOString(),
    },
  };

  await writeFile(SITE_DATA_PATH, `${JSON.stringify(updated, null, 2)}\n`);
  console.log('Updated public/site-data.json successfully.');

  // ── Write standalone ink-app-metrics.json (stale-safe) ──────────────────
  // server.mjs proxies /site-data.json to the API server (returns 502 when API
  // is offline), so the static preview uses this separate file directly.
  // Merge fresh results over existing values so a partial fetch failure never
  // blanks out metrics that were successfully populated on a prior run.
  let existingAppMetrics = {};
  try {
    const raw = await readFile(INK_APP_METRICS_PATH, 'utf8');
    const parsed = safeJsonParse(raw, {});
    const { last_refreshed: _lr, ...rest } = parsed;
    existingAppMetrics = rest;
  } catch {
    // File doesn't exist yet — start fresh
  }
  const appMetricsPayload = {
    ...existingAppMetrics,
    ...(inkAppMetrics ?? {}),
    last_refreshed: now.toISOString(),
  };
  await writeFile(INK_APP_METRICS_PATH, `${JSON.stringify(appMetricsPayload, null, 2)}\n`);
  console.log('Updated public/ink-app-metrics.json successfully.');

  // ── Merge metrics fields into ink-apps.json entries ─────────────────────
  // The metrics (tvl_millions, volume_24h_millions, unique_users_24h) are
  // written directly into each app entry so the static JSON file itself is
  // a live leaderboard. Curated fields (description, action, etc.) are
  // always preserved; metrics are set to null when no data is available.
  try {
    const appsRaw = await readFile(INK_APPS_PATH, 'utf8');
    const apps = safeJsonParse(appsRaw, []);
    const mergedApps = apps.map((app) => {
      const m = appMetricsPayload[app.id] ?? {};
      return {
        ...app,
        tvl_millions:        m.tvl_millions        ?? app.tvl_millions        ?? null,
        volume_24h_millions: m.volume_24h_millions ?? app.volume_24h_millions ?? null,
        unique_users_24h:    m.unique_users_24h    ?? app.unique_users_24h    ?? null,
      };
    });
    await writeFile(INK_APPS_PATH, `${JSON.stringify(mergedApps, null, 2)}\n`);
    console.log('Updated public/ink-apps.json with live metrics.');
  } catch (err) {
    console.warn(`Failed to update ink-apps.json: ${err.message}`);
  }

  // Also embed the updated data into src/worker.js so the CF Worker serves live data
  const WORKER_PATH = new URL('../src/worker.js', import.meta.url);
  try {
    const workerSrc = await readFile(WORKER_PATH, 'utf8');
    const newWorkerSrc = workerSrc.replace(
      /^const EMBEDDED_SITE_DATA = \{[\s\S]*?\};/m,
      `const EMBEDDED_SITE_DATA = ${JSON.stringify(updated)};`,
    );
    if (newWorkerSrc === workerSrc) {
      throw new Error('Could not locate EMBEDDED_SITE_DATA block in src/worker.js');
    }
    await writeFile(WORKER_PATH, newWorkerSrc);
    console.log('Updated EMBEDDED_SITE_DATA in src/worker.js');
  } catch (err) {
    throw err;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
