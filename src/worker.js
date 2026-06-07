// EMBEDDED_SITE_DATA is updated automatically by scripts/refresh-site-data.mjs
// and serves as a fallback when KV is unavailable.
const EMBEDDED_SITE_DATA = {"updated_at":"2026-06-07T21:04:43.356Z","updated_display":"June 7, 2026","ink":{"tvl_millions":201.6,"protocol_count":30},"ipo":{"polymarket_pct":30.5,"kalshi_pct":43.5,"avg_pct":43.2},"secondary_market":{"hiive_pps":31.37,"forge_pps":37.46,"npm_pps":9,"notice_pps":35.19,"avg_pps":34.13,"volume_30d_est_m":13.5,"volume_note":"Est. 30D vol. across all venues · based on Hiive H50 activity","updated":"June 7, 2026"},"prediction_markets":{"ipo":{"kalshi_pct":43.5,"polymarket_pct":30.5,"mktcap_16b_pct":27,"largest_excl_spacex_pct":0.6},"underwriters":[{"bank":"Bank of America","ticker":"BOA","pct":47.5},{"bank":"Citigroup","ticker":"CITI","pct":43},{"bank":"Morgan Stanley","ticker":"MS","pct":40.5},{"bank":"JPMorgan Chase","ticker":"JPM","pct":38.5},{"bank":"Goldman Sachs","ticker":"GS","pct":36.5}],"regulatory":{"clarity_act_pct":50.5,"crypto_structure_aug_pct":25},"ink_fdv":{"above_250m_pct":63,"above_500m_pct":59.5,"above_1b_pct":27.5,"above_2b_pct":13}},"xstocks":{"ink_tvl_millions":201.6,"ink_protocol_count":30,"ink_dex_24h_millions":3.7,"ink_dex_7d_millions":74.72,"ink_dex_30d_millions":150.8,"ink_dex_change_1d_pct":-80.1,"ink_dex_change_7d_pct":72.3,"total_market_cap_millions":301.7,"total_vol_24h_millions":31.1,"asset_count":40,"asset_leaders":[{"symbol":"TSLAX","mcap_m":55.4,"vol_24h_m":4.1,"change_24h_pct":0.4,"share_pct":18.4},{"symbol":"CRCLX","mcap_m":42.4,"vol_24h_m":4.5,"change_24h_pct":4.2,"share_pct":14},{"symbol":"SPYX","mcap_m":35.7,"vol_24h_m":1.7,"change_24h_pct":-0.3,"share_pct":11.8},{"symbol":"NVDAX","mcap_m":34,"vol_24h_m":5.8,"change_24h_pct":0,"share_pct":11.3},{"symbol":"QQQX","mcap_m":26.5,"vol_24h_m":0.9,"change_24h_pct":0.2,"share_pct":8.8}],"top_volume":[{"symbol":"NVDAX","vol_24h_m":5.8,"change_24h_pct":0},{"symbol":"CRCLX","vol_24h_m":4.5,"change_24h_pct":4.2},{"symbol":"TSLAX","vol_24h_m":4.1,"change_24h_pct":0.4},{"symbol":"GOOGLX","vol_24h_m":3.2,"change_24h_pct":-0.1},{"symbol":"AAPLX","vol_24h_m":2.7,"change_24h_pct":-0.6}],"last_refreshed":"2026-06-07T21:04:43.356Z"}};

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
      const injected = html.replace(
        '</head>',
        `<script>window.__SITE_DATA__=${JSON.stringify(siteData)};</script></head>`,
      );

      // Strip any headers that could signal a redirect to crawlers
      const safeHeaders = {};
      for (const [k, v] of indexResponse.headers) {
        const lower = k.toLowerCase();
        if (lower === 'location' || lower === 'refresh') continue;
        safeHeaders[k] = v;
      }

      return new Response(injected, {
        status: 200,
        headers: { ...safeHeaders, 'content-type': 'text/html; charset=utf-8' },
      });
    }

    return env.ASSETS.fetch(request);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(refreshSiteData(env));
  },
};
