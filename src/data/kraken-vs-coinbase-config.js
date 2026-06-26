
// ─────────────────────────────────────────────────────────────────────────────
// Kraken vs Coinbase — Manual / Periodic Update Config
// Update this file when new quarterly financials are published.
// Live data (price, market cap, TVL, DEX volume) comes from site-data.json.
// Last reviewed: June 2026 — Payward Q1 2026 press release (May 18, 2026)
// ─────────────────────────────────────────────────────────────────────────────

export const KRAKEN_CONFIG = {
  name: 'Kraken (Payward)',
  ticker: null,
  status: 'Private',
  financials: {
    // Q1 2026 per Payward press release (May 18 2026)
    revenue_q1_2026_m: 507,
    revenue_q1_2026_note: '+3% YoY. Market cap fell 23%, industry spot vol fell 38% — Payward outperformed.',
    // TTM = estimated; Q2–Q4 2025 not separately disclosed
    revenue_ttm_m: 2100,
    revenue_ttm_note: 'Estimated. Q1 2026 = $507M reported. FY2025 not fully reported.',
    revenue_fy2025_m: null,
    revenue_fy2024_m: 1500,
    revenue_fy2024_note: 'FY2024 per public reporting',
    revenue_growth_note: 'Q1 2026 vs Q1 2025: +3%. Payward outperformed industry (-38% spot vol).',
    // FY2024: bull market year — industry exchange margins typically 25–40%
    ebitda_fy2024_est_m: 450,
    ebitda_fy2024_note: 'FY2024 estimated ~$450M (est. 30% margin on $1.5B revenue). Bull market; industry comparables 25–40%. Not publicly confirmed.',
    ebitda_margin_fy2024_est_pct: 30,
    // FY2021: one of the most profitable years for any crypto exchange
    ebitda_fy2021_note: 'FY2021: reported ~$1.1B net income on ~$1.3B revenue — ~85% net margin. Among the most profitable crypto companies globally that year.',
    // Q1 2026 is anomalously low — active M&A investment cycle
    ebitda_q1_2026_m: 18,
    ebitda_q1_2026_note: 'Q1 2026 adj. EBITDA $18M. Intentionally compressed — $2.65B in active acquisitions (NinjaTrader $1.5B, Bitnomial $550M, Reap $600M). "We\'re not optimizing for today\'s EBITDA."',
    net_income_ttm_m: null,
    profitability_note: 'FY2024 est. ~$450M EBITDA (~30% margin). Q1 2026 anomalously low ($18M) due to heavy M&A spend. FY2021 reportedly ~$1.1B net income.',
    as_of: 'Q1 2026',
    source: 'Payward Q1 2026 press release (May 18, 2026) — payward.com/press-release/q1-2026-financial-highlights',
  },
  operating: {
    // Per Q1 2026 press release
    platform_vol_q1_2026_b: 357,
    platform_vol_note: 'Total Platform Transaction Volume (crypto + derivatives)',
    spot_share_pct_march_2026: 5.2,
    spot_share_note: 'Kraken spot market share climbed from ~3.5% (mid-2025) to 5.2% (March 2026)',
    futures_darts_yoy_pct: 51,
    futures_note: 'Futures DARTs +51% YoY driven by NinjaTrader, Breakout, and expanded futures offerings',
    assets_on_platform_b: 40,
    assets_on_platform_note: '$40B AoP as of March 31 2026. +11% YoY (+48% ex-price changes). Reflects continued net inflows.',
    funded_accounts_m: 6.1,
    funded_accounts_growth_pct: 47,
    funded_accounts_note: '6.1M funded accounts, +47% YoY',
    spot_retention_vs_peak_pct: 59,
    spot_retention_note: 'Retained 59% of spot vol vs Dec 2024 peak — 2.2× better than largest competitors (~27%)',
  },
  equity: {
    // Estimated diluted share count — derived from ~$20B financing round at ~$61–62/share
    // $20B / $61.5 ≈ 325M shares. Not confirmed via S-1.
    shares_est_m: 325,
    shares_note: 'Estimated diluted shares derived from reported financing valuation and share-price data. Not confirmed via S-1.',
  },
  products: {
    xstocks_count: 100,
    xstocks_target: '500+ by end of 2026',
    xstocks_note: 'xStocks reached 100 tokenized equities in Q1 2026. Plan to expand to 500+ by end of 2026.',
    new_q1: [
      'Equities trading on Kraken Desktop (US stocks & ETFs)',
      'TradFi futures on Kraken Pro for EU (70 markets: oil, gold, S&P 500, Nasdaq 100)',
      'xChange: atomic settlement across Ethereum and Solana',
      'DeFi Earn (up to 8% APY)',
      'US retail margin trading (CFTC-regulated spot)',
    ],
  },
  l2: { name: 'Ink', slug: 'ink', tvl_source: 'ink.tvl_millions' },
};

export const COINBASE_CONFIG = {
  name: 'Coinbase',
  ticker: 'COIN',
  status: 'Public (NASDAQ: COIN)',
  financials: {
    revenue_q1_2026_m: 2033,
    revenue_ttm_m: 8526,
    revenue_ttm_note: 'FY2025 = $8.526B (reported 10-K). Q1 2026 = $2.033B (reported 10-Q).',
    revenue_fy2025_m: 8526,
    revenue_fy2024_m: 6567,
    revenue_fy2024_note: 'FY2024 per Coinbase 10-K',
    revenue_growth_yoy_pct: 30,
    revenue_growth_note: 'FY2025 vs FY2024: +30%',
    ebitda_ttm_m: 3300,
    ebitda_margin_pct: 39,
    ebitda_note: 'FY2025 EBITDA estimated from reported operating metrics.',
    net_income_ttm_m: 2900,
    profitability_note: 'FY2025 EBITDA and net income estimated from reported operating metrics.',
    as_of: 'Q1 2026',
    source: 'Coinbase SEC filings (10-K FY2025, 10-Q Q1 2026)',
  },
  operating: {
    spot_vol_q1_2026_b: 393,
    spot_vol_note: 'Q1 2026 total trading volume $393B (Coinbase 10-Q)',
    derivatives_note: 'Coinbase Derivatives (CFTC FCM). Coinbase International Exchange.',
  },
  equity: {
    shares_diluted_m: 252,
    shares_note: 'Diluted shares from Coinbase SEC filings.',
  },
  products: {
    l2_name: 'Base',
    usdc_note: 'USDC ecosystem (Circle partnership) — Base for payments',
  },
  l2: { name: 'Base', slug: 'base', tvl_source: 'base_l2.tvl_millions' },
};

// ─── Scenario Model Assumptions ────────────────────────────────────────────
export const SCENARIO_CONFIG = {
  kraken: {
    revenue_base_m: 2100,
    private_discount_pct: 20,
    shares_m: KRAKEN_CONFIG.equity.shares_est_m,
    scenarios: {
      bear: { label: 'Bear', revenue_growth_pct: -15, ebitda_margin_pct: 15, revenue_multiple: 5,  color: 'hsl(350 40% 28%)' },
      base: { label: 'Base', revenue_growth_pct:  15, ebitda_margin_pct: 28, revenue_multiple: 9,  color: 'hsl(33 40% 40%)'  },
      bull: { label: 'Bull', revenue_growth_pct:  50, ebitda_margin_pct: 38, revenue_multiple: 14, color: 'hsl(150 35% 28%)' },
    },
  },
  coinbase: {
    revenue_base_m: 8526,
    private_discount_pct: 0,
    shares_m: COINBASE_CONFIG.equity.shares_diluted_m,
    scenarios: {
      bear: { label: 'Bear', revenue_growth_pct: -20, ebitda_margin_pct: 25, revenue_multiple: 4,  color: 'hsl(350 40% 28%)' },
      base: { label: 'Base', revenue_growth_pct:  10, ebitda_margin_pct: 38, revenue_multiple: 7,  color: 'hsl(33 40% 40%)'  },
      bull: { label: 'Bull', revenue_growth_pct:  35, ebitda_margin_pct: 42, revenue_multiple: 11, color: 'hsl(150 35% 28%)' },
    },
  },
};

// ─── Strategic Position (manually updated) ─────────────────────────────────
export const STRATEGIC_CONFIG = {
  rows: [
    {
      label: 'Company status',
      kraken: 'Private — IPO targeted H2 2026',
      coinbase: 'Public — NASDAQ: COIN since Apr 2021',
    },
    {
      label: 'Public filings',
      kraken: 'Draft S-1 filed (not yet public)',
      coinbase: 'Full SEC reporting (10-K, 10-Q quarterly)',
    },
    {
      label: 'Tokenized stocks',
      kraken: 'xStocks — 100 tokens live. Ethereum, Solana, BNB Chain. Plan: 500+ by end 2026.',
      coinbase: 'No tokenized equity product as of June 2026',
    },
    {
      label: 'Layer 2 network',
      kraken: 'Ink (Optimism Superchain) — live since Dec 2024',
      coinbase: 'Base (Optimism Superchain) — live since Aug 2023',
    },
    {
      label: 'Derivatives',
      kraken: 'NinjaTrader ($1.5B), Bitnomial ($550M, CFTC DCM/DCO/FCM), Small Exchange. Futures DARTs +51% YoY.',
      coinbase: 'Coinbase Derivatives (CFTC FCM). International Derivatives Exchange.',
    },
    {
      label: 'Major licenses',
      kraken: 'FinCEN MSB, FCA, MiCA CASP, CFTC FCM, SEC BD + RIA, Wyoming SPDI, AUSTRAC',
      coinbase: 'FinCEN MSB, FCA, MiCA CASP, CFTC FCM, NYDFS BitLicense',
    },
    {
      label: 'Banking / payments',
      kraken: 'Wyoming SPDI (Kraken Financial). Reap ($600M, H2 2026) adds stablecoin + card rails.',
      coinbase: 'No banking charter. USDC ecosystem (Circle) + Base for payments.',
    },
    {
      label: 'Major partnerships',
      kraken: 'Nasdaq (equity token issuance infra, Mar 2026) · Mastercard (Kraken Card, EU/EEA)',
      coinbase: 'Circle / USDC (Centre consortium co-founder) · Visa (Coinbase Card)',
    },
  ],
};

// ─── Kraken Watch Fair Value (base-case model estimate) ─────────────────────
export const FAIR_VALUE_CONFIG = {
  kraken:   { fmv: 50,  basis: 'Base scenario · 15% rev growth · 9× multiple · 20% private discount' },
  coinbase: { fmv: 225, basis: 'Base scenario · 10% rev growth · 7× multiple' },
};
