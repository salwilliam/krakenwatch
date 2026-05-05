// EMBEDDED_SITE_DATA is updated automatically by scripts/refresh-site-data.mjs
// and serves as a fallback when KV is unavailable.
const EMBEDDED_SITE_DATA = {"updated_at":"2026-05-05T06:11:48.028Z","updated_display":"May 5, 2026","ink":{"tvl_millions":322.6,"protocol_count":28},"ipo":{"polymarket_pct":63,"kalshi_pct":67.5,"avg_pct":66.8},"secondary_market":{"hiive_pps":35.43,"forge_pps":32.52,"npm_pps":37.69,"notice_pps":47.13,"avg_pps":35.89,"volume_30d_est_m":13.5,"volume_note":"Est. 30D vol. across all venues · based on Hiive H50 activity","updated":"May 5, 2026"},"prediction_markets":{"ipo":{"kalshi_pct":67.5,"polymarket_pct":63,"mktcap_16b_pct":50.5,"largest_excl_spacex_pct":6.7},"underwriters":[{"bank":"Bank of America","ticker":"BOA","pct":68.5},{"bank":"Morgan Stanley","ticker":"MS","pct":60},{"bank":"Citigroup","ticker":"CITI","pct":56},{"bank":"JPMorgan Chase","ticker":"JPM","pct":55.5},{"bank":"Goldman Sachs","ticker":"GS","pct":54.5}],"regulatory":{"clarity_act_pct":69.5,"crypto_structure_aug_pct":45},"ink_fdv":{"above_250m_pct":81,"above_500m_pct":73.5,"above_1b_pct":40.5,"above_2b_pct":17.5}}};

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
