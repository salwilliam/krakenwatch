// EMBEDDED_SITE_DATA is updated automatically by scripts/refresh-site-data.mjs
const EMBEDDED_SITE_DATA = {"updated_at":"2026-04-23T16:40:09.526Z","updated_display":"April 23, 2026","ink":{"tvl_millions":287.1,"protocol_count":26},"ipo":{"polymarket_pct":75.5,"kalshi_pct":66,"avg_pct":68.5},"secondary_market":{"hiive_pps":34.79,"forge_pps":33.25,"npm_pps":37.69,"notice_pps":48.49,"avg_pps":36.01,"volume_30d_est_m":13.5,"volume_note":"Est. 30D vol. across all venues · based on Hiive H50 activity","updated":"April 23, 2026"},"prediction_markets":{"ipo":{"kalshi_pct":66,"polymarket_pct":75.5,"mktcap_16b_pct":71,"largest_excl_spacex_pct":4.8},"underwriters":[{"bank":"Bank of America","ticker":"BOA","pct":71.5},{"bank":"Morgan Stanley","ticker":"MS","pct":63},{"bank":"JPMorgan Chase","ticker":"JPM","pct":59},{"bank":"Citigroup","ticker":"CITI","pct":59},{"bank":"Goldman Sachs","ticker":"GS","pct":57.5}],"regulatory":{"clarity_act_pct":42.5,"crypto_structure_aug_pct":34.5},"ink_fdv":{"above_250m_pct":83.5,"above_500m_pct":66.5,"above_1b_pct":53.5,"above_2b_pct":19.5}}};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/site-data.json') {
      return new Response(JSON.stringify(EMBEDDED_SITE_DATA), {
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
