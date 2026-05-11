// EMBEDDED_SITE_DATA is updated automatically by scripts/refresh-site-data.mjs
// and serves as a fallback when KV is unavailable.
const EMBEDDED_SITE_DATA = {"updated_at":"2026-05-11T14:35:37.676Z","updated_display":"May 11, 2026","ink":{"tvl_millions":292.3,"protocol_count":28},"ipo":{"polymarket_pct":59.5,"kalshi_pct":66.5,"avg_pct":66.2},"secondary_market":{"hiive_pps":32.53,"forge_pps":32.52,"npm_pps":37.69,"notice_pps":48.85,"avg_pps":34.72,"volume_30d_est_m":13.5,"volume_note":"Est. 30D vol. across all venues · based on Hiive H50 activity","updated":"May 11, 2026"},"prediction_markets":{"ipo":{"kalshi_pct":66.5,"polymarket_pct":59.5,"mktcap_16b_pct":48,"largest_excl_spacex_pct":2.2},"underwriters":[{"bank":"Bank of America","ticker":"BOA","pct":68.5},{"bank":"Morgan Stanley","ticker":"MS","pct":60},{"bank":"JPMorgan Chase","ticker":"JPM","pct":57},{"bank":"Citigroup","ticker":"CITI","pct":54.5},{"bank":"Goldman Sachs","ticker":"GS","pct":53}],"regulatory":{"clarity_act_pct":62,"crypto_structure_aug_pct":67},"ink_fdv":{"above_250m_pct":83,"above_500m_pct":67,"above_1b_pct":37.5,"above_2b_pct":17}}};

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
        headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=300, stale-while-revalidate=60' },
      });
    }

    // SPA fallback: serve index.html for all non-file paths so client-side routing works
    const isFile = /\.[a-zA-Z0-9]+$/.test(url.pathname);
    if (!isFile) {
      const indexUrl = new URL('/', url);
      return env.ASSETS.fetch(new Request(indexUrl, request));
    }

    return env.ASSETS.fetch(request);
  },
};
