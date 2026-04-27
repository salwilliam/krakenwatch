// EMBEDDED_SITE_DATA is updated automatically by scripts/refresh-site-data.mjs
const EMBEDDED_SITE_DATA = {"updated_at":"2026-04-27T16:25:42.107Z","updated_display":"April 27, 2026","ink":{"tvl_millions":293.4,"protocol_count":26},"ipo":{"polymarket_pct":73,"kalshi_pct":64.5,"avg_pct":69.8},"secondary_market":{"hiive_pps":34.44,"forge_pps":33.25,"npm_pps":37.69,"notice_pps":47.52,"avg_pps":35.73,"volume_30d_est_m":13.5,"volume_note":"Est. 30D vol. across all venues · based on Hiive H50 activity","updated":"April 27, 2026"},"prediction_markets":{"ipo":{"kalshi_pct":64.5,"polymarket_pct":73,"mktcap_16b_pct":62,"largest_excl_spacex_pct":4.3},"underwriters":[{"bank":"Bank of America","ticker":"BOA","pct":72},{"bank":"Morgan Stanley","ticker":"MS","pct":62},{"bank":"Citigroup","ticker":"CITI","pct":58.5},{"bank":"JPMorgan Chase","ticker":"JPM","pct":58},{"bank":"Goldman Sachs","ticker":"GS","pct":56}],"regulatory":{"clarity_act_pct":46.5,"crypto_structure_aug_pct":31},"ink_fdv":{"above_250m_pct":83,"above_500m_pct":73,"above_1b_pct":44.5,"above_2b_pct":15.5}}};

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
