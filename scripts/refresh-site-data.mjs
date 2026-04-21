import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';

const SITE_DATA_PATH = new URL('../public/site-data.json', import.meta.url);

const SECONDARY_BASE_WEIGHTS = {
  hiive_pps: 0.4,
  forge_pps: 0.3,
  npm_pps: 0.2,
  notice_pps: 0.1,
};

const MAX_OUTLIER_DEVIATION = 0.5;

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

async function fetchText(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} at ${url}`);
  }
  return response.text();
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} at ${url}`);
  }
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
  const pps = extractFirstCurrency(html, /Kraken Stock Price Per Share[\s\S]{0,1200}/i);
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
    hiive_pps: live.hiive_pps ?? existing.hiive_pps ?? null,
    forge_pps: live.forge_pps ?? existing.forge_pps ?? null,
    npm_pps: live.npm_pps ?? existing.npm_pps ?? null,
    notice_pps: live.notice_pps ?? existing.notice_pps ?? null,
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
  merged.hiive_pps = byKey.hiive_pps ?? merged.hiive_pps;
  merged.forge_pps = byKey.forge_pps ?? merged.forge_pps;
  merged.npm_pps = byKey.npm_pps ?? merged.npm_pps;
  merged.notice_pps = byKey.notice_pps ?? merged.notice_pps;

  return merged;
}

async function main() {
  const now = new Date();
  const existingRaw = await readFile(SITE_DATA_PATH, 'utf8');
  const existing = safeJsonParse(existingRaw, {});

  const [ink, poly, kalshi, hiive, npm, forge, notice] = await Promise.all([
    getDefiLlamaData(),
    getPolymarketData(),
    getKalshiData(),
    runOptional('Hiive', getHiivePrice),
    runOptional('Nasdaq Private Market', getNpmPriceAndDate),
    runOptional('Forge', getForgePriceAndDate),
    runOptional('Notice', getNoticePrice),
  ]);

  const ipoCandidates = [
    { value: poly.pct, weight: poly.weight },
    { value: kalshi.pct, weight: kalshi.weight },
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
      polymarket_pct: poly.pct,
      kalshi_pct: kalshi.pct,
      avg_pct: ipoAvg != null ? round(ipoAvg, 1) : existing.ipo?.avg_pct ?? null,
    },
    secondary_market: secondaryMarket,
  };

  await writeFile(SITE_DATA_PATH, `${JSON.stringify(updated, null, 2)}\n`);
  console.log('Updated public/site-data.json successfully.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
