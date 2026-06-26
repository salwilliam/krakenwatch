import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';
import PageHeroImage from '../components/PageHeroImage';
import {
  KRAKEN_CONFIG,
  COINBASE_CONFIG,
  SCENARIO_CONFIG,
  STRATEGIC_CONFIG,
  FAIR_VALUE_CONFIG,
} from '../data/kraken-vs-coinbase-config';

const HERO_IMAGE = '/brief-kraken-vs-coinbase-v2.png';

const primary    = 'hsl(28 40% 14%)';
const muted      = 'hsl(30 22% 30%)';
const cardBg     = 'hsl(38 40% 90%)';
const cardBorder = 'hsl(33 35% 60%)';
const sectionBg  = 'hsl(33 28% 82%)';

const KR_COL = { bg: 'hsl(350 28% 22%)', text: 'hsl(350 45% 82%)', onLight: 'hsl(350 60% 30%)', label: 'Kraken' };
const CB_COL = { bg: 'hsl(210 35% 22%)', text: 'hsl(210 50% 82%)', onLight: 'hsl(210 60% 32%)', label: 'Coinbase' };
const WIN_BG = 'hsl(150 25% 88%)';
const WIN_FG = 'hsl(150 40% 28%)';

function r1(v) { return v == null ? null : Math.round(v * 10) / 10; }
function r2(v) { return v == null ? null : Math.round(v * 100) / 100; }
function fmtM(v) { return v == null ? '—' : `$${Math.round(v).toLocaleString()}M`; }
function fmtB(v) { return v == null ? '—' : `$${r1(v / 1000)}B`; }
function fmtPct(v) { if (v == null) return '—'; return `${v >= 0 ? '+' : ''}${r1(v)}%`; }
function fmtX(v) { return v == null ? '—' : `${r1(v)}×`; }
function fmtPps(v) { return v == null ? '—' : `$${r2(v)}`; }

function computeScenario(cfg, currentPrice) {
  return Object.entries(cfg.scenarios).map(([key, s]) => {
    const fwdRev = cfg.revenue_base_m * (1 + s.revenue_growth_pct / 100);
    const equity = fwdRev * s.revenue_multiple * (1 - (cfg.private_discount_pct ?? 0) / 100);
    const impliedPrice = equity / cfg.shares_m;
    const upside = currentPrice ? r1((impliedPrice / currentPrice - 1) * 100) : null;
    return { key, label: s.label, color: s.color, revenue_growth_pct: s.revenue_growth_pct, revenue_multiple: s.revenue_multiple, fwd_revenue_m: Math.round(fwdRev), implied_equity_m: Math.round(equity), implied_price: r2(impliedPrice), upside_pct: upside };
  });
}

function SectionHeader({ title, badge }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-3"
      style={{ background: 'hsl(30 30% 20%)', borderBottom: `1px solid hsl(30 25% 30%)` }}>
      <h2 className="text-base font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: 'hsl(38 50% 78%)' }}>{title}</h2>
      {badge && (
        <span className="text-xs px-2 py-0.5 rounded shrink-0" style={{ background: 'hsl(30 25% 30%)', color: 'hsl(38 35% 65%)', fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}>{badge}</span>
      )}
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>{children}</div>
  );
}

function ChipCell({ val, note, win }) {
  return (
    <div className="rounded p-2.5 min-w-0" style={{ background: win ? WIN_BG : sectionBg }}>
      <div className="text-base font-semibold text-center leading-snug break-words"
        style={{ color: win ? WIN_FG : primary, fontFamily: 'var(--font-sans)' }}>{val}</div>
      {note && (
        <div className="text-sm text-center mt-1 leading-snug break-words"
          style={{ color: muted, fontFamily: 'var(--font-sans)' }}>{note}</div>
      )}
    </div>
  );
}

function ColHeaders() {
  return (
    <div className="grid grid-cols-2 gap-1.5 px-3 sm:px-4 pt-2 pb-1">
      {[KR_COL, CB_COL].map(cfg => (
        <div key={cfg.label} className="text-[11px] font-bold px-1.5 py-1 rounded text-center"
          style={{ background: cfg.bg, color: cfg.text, fontFamily: 'var(--font-display)' }}>
          {cfg.label}
        </div>
      ))}
    </div>
  );
}

function CompRow({ label, kVal, kNote, cbVal, cbNote, better, tag }) {
  return (
    <div className="px-3 sm:px-4 py-2.5" style={{ borderBottom: `1px solid ${cardBorder}` }}>
      <div className="text-sm font-semibold mb-2 flex items-center gap-1.5 flex-wrap"
        style={{ color: primary, fontFamily: 'var(--font-sans)' }}>
        {label}
        {tag && (
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{
              background: tag === 'live' ? 'hsl(150 40% 14%)' : 'hsl(30 25% 28%)',
              color:      tag === 'live' ? 'hsl(150 65% 60%)' : 'hsl(38 35% 65%)',
              border:     `1px solid ${tag === 'live' ? 'hsl(150 35% 24%)' : 'hsl(30 20% 36%)'}`,
            }}>
            {tag === 'live' ? '● live' : tag}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <ChipCell val={kVal}  note={kNote}  win={better === 'kraken'}   />
        <ChipCell val={cbVal} note={cbNote} win={better === 'coinbase'} />
      </div>
    </div>
  );
}

function ValuationTable({ krakenMcap, coinbaseMcap, krakenPps, coinbase, xstocks, inkL2, baseL2 }) {
  const kRev  = KRAKEN_CONFIG.financials.revenue_ttm_m;
  const cbRev = COINBASE_CONFIG.financials.revenue_ttm_m;
  const kRevMult  = (krakenMcap && kRev)  ? r1(krakenMcap  / kRev)  : null;
  const cbRevMult = (coinbaseMcap && cbRev) ? r1(coinbaseMcap / cbRev) : null;
  const cbPE = (coinbaseMcap && COINBASE_CONFIG.financials.net_income_ttm_m)
    ? r1(coinbaseMcap / COINBASE_CONFIG.financials.net_income_ttm_m) : null;

  function lo(a, b) { if (a == null || b == null) return null; return a < b ? 'kraken' : b < a ? 'coinbase' : null; }
  function hi(a, b) { if (a == null || b == null) return null; return a > b ? 'kraken' : b > a ? 'coinbase' : null; }

  return (
    <Card>
      <SectionHeader title="Valuation & Financials" badge="live where noted" />
      <ColHeaders />
      <CompRow label="Share price" tag="live"
        kVal={fmtPps(krakenPps)}  kNote="secondary market avg"
        cbVal={fmtPps(coinbase?.price_usd)} cbNote="COIN — NASDAQ"
        better={null} />
      <CompRow label="Equity value / market cap" tag="live"
        kVal={krakenMcap ? fmtB(krakenMcap) : '—'} kNote="implied (est. shares)"
        cbVal={coinbaseMcap ? fmtB(coinbaseMcap) : '—'} cbNote="public market cap"
        better={lo(krakenMcap, coinbaseMcap)} />
      <CompRow label="Revenue TTM"
        kVal={fmtM(kRev)}  kNote={KRAKEN_CONFIG.financials.revenue_ttm_note}
        cbVal={fmtM(cbRev)} cbNote={COINBASE_CONFIG.financials.revenue_ttm_note}
        better={hi(kRev, cbRev)} />
      <CompRow label="Revenue growth YoY"
        kVal={KRAKEN_CONFIG.financials.revenue_growth_note}  kNote="Q1 2026"
        cbVal="+30%"  cbNote="FY2025 vs FY2024"
        better={null} />
      <CompRow label="EBITDA (FY2024 est.)"
        kVal={fmtM(KRAKEN_CONFIG.financials.ebitda_fy2024_est_m)} kNote={KRAKEN_CONFIG.financials.ebitda_fy2024_note}
        cbVal={fmtM(COINBASE_CONFIG.financials.ebitda_ttm_m)} cbNote="FY2025 TTM est. (Kraken FY2025 undisclosed — FY2024 used)"
        better={null} />
      <CompRow label="EBITDA margin (FY2024 est.)"
        kVal={`~${KRAKEN_CONFIG.financials.ebitda_margin_fy2024_est_pct}%`} kNote="Est. typical ops — Q1 2026 compressed by $2.65B M&A cycle"
        cbVal={`~${COINBASE_CONFIG.financials.ebitda_margin_pct}%`} cbNote="FY2025 est. (one year later than Kraken column)"
        better={null} />
      <CompRow label="Net income TTM"
        kVal="Not disclosed" kNote="Q1 2026 adj. EBITDA $18M — intentionally compressed by M&A spend"
        cbVal={fmtM(COINBASE_CONFIG.financials.net_income_ttm_m)} cbNote="estimated FY2025"
        better={null} />
      <CompRow label="Equity Value / Revenue" tag="live"
        kVal={fmtX(kRevMult)}  kNote="implied equity / TTM rev"
        cbVal={fmtX(cbRevMult)} cbNote="market cap / TTM rev"
        better={lo(kRevMult, cbRevMult)} />
      <CompRow label="P/E"
        kVal="N/A" kNote="not disclosed"
        cbVal={fmtX(cbPE)} cbNote="live market cap / FY2025 est. net income"
        better={null} />
      <CompRow label="Platform trading volume (Q1 2026)"
        kVal="$357B" kNote="Total Platform Transaction Volume (crypto + derivatives)"
        cbVal="$393B" cbNote="Q1 2026 (10-Q)"
        better="coinbase" />
      <CompRow label="xStocks / tokenized equity vol (24h)" tag="live"
        kVal={xstocks?.total_vol_24h_millions ? `$${xstocks.total_vol_24h_millions}M` : '—'} kNote="40 tracked on CoinGecko / 100 announced live"
        cbVal="None" cbNote="no tokenized equity product"
        better="kraken" />
      <CompRow label="L2 TVL" tag="live"
        kVal={inkL2?.tvl_millions ? `$${inkL2.tvl_millions}M` : '—'} kNote="Ink L2 (DeFiLlama)"
        cbVal={baseL2?.tvl_millions ? fmtB(baseL2.tvl_millions) : '—'} cbNote="Base (DeFiLlama)"
        better={hi(inkL2?.tvl_millions, baseL2?.tvl_millions)} />
      <CompRow label="Assets on platform / users"
        kVal="$40B AoP" kNote="6.1M funded accounts (+47% YoY) as of Q1 2026"
        cbVal="100M+ verified" cbNote="~9M monthly transacting users"
        better={null} />
    </Card>
  );
}

const VERDICT_FACTORS = [
  { label: 'Current revenue multiple',        winner: 'coinbase', note: 'Coinbase ~5× TTM rev; Kraken ~7× at secondary-market pricing' },
  { label: 'Profitability',                   winner: 'coinbase', note: 'EBITDA $3.3B est. (FY2025); Kraken compressed by $2.65B M&A cycle' },
  { label: 'Growth',                          winner: 'coinbase', note: '+30% FY2025; Kraken Q1 +3% (cyclically suppressed by active M&A)' },
  { label: 'Tokenization upside',             winner: 'kraken',   note: 'xStocks — 100 tokens live, 500+ targeted by end 2026. Coinbase: none.' },
  { label: 'Regulatory depth',                winner: 'kraken',   note: 'SPDI charter, MiCA CASP, CFTC FCM+DCM, SEC BD+RIA — 7 jurisdictions' },
  { label: 'IPO / re-rating optionality',     winner: 'kraken',   note: 'Private → public re-rating event on IPO. Asymmetric upside not available in COIN.' },
  { label: 'Strategic upside at current price', winner: 'kraken', note: 'Secondary discount + xStocks lead + regulatory footprint not fully priced at current secondary levels.' },
];

function KrakenWatchVerdict() {
  const krakenWins = VERDICT_FACTORS.filter(f => f.winner === 'kraken').length;
  const cbWins     = VERDICT_FACTORS.filter(f => f.winner === 'coinbase').length;
  const krakenPct  = 55;
  const cbPct      = 45;

  return (
    <Card>
      <SectionHeader title="Kraken Watch Verdict" badge="model output — not investment advice" />
      <div className="p-4 space-y-4">

        <div>
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="text-sm mb-0.5" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>Current preference</div>
              <div className="text-xl font-bold" style={{ color: KR_COL.onLight, fontFamily: 'var(--font-display)' }}>
                Kraken
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm mb-0.5" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>Conviction</div>
              <div className="text-base font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>
                <span style={{ color: KR_COL.onLight }}>Kraken {krakenPct}%</span>
                <span style={{ color: muted }}> / </span>
                <span style={{ color: CB_COL.onLight }}>Coinbase {cbPct}%</span>
              </div>
            </div>
          </div>
          <div className="flex rounded-full overflow-hidden" style={{ height: '10px', border: `1px solid ${cardBorder}` }}>
            <div style={{ width: `${krakenPct}%`, background: KR_COL.bg }} />
            <div style={{ width: `${cbPct}%`,     background: CB_COL.bg }} />
          </div>
        </div>

        <p className="text-base leading-relaxed" style={{ color: primary, fontFamily: 'var(--font-sans)' }}>
          At current prices, Kraken Watch gives a slight preference to Kraken because the secondary-market
          discount, IPO optionality, xStocks exposure, and regulatory footprint create more strategic upside,
          despite Coinbase's stronger current profitability, growth, and Base ecosystem scale.
        </p>

        <div>
          <div className="text-xs font-semibold mb-2 uppercase tracking-wide"
            style={{ color: muted, fontFamily: 'var(--font-display)' }}>Factor winners</div>
          <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${cardBorder}` }}>
            {VERDICT_FACTORS.map((f, i) => (
              <div key={f.label} className="flex items-start gap-3 px-3 py-2.5"
                style={{ borderBottom: i < VERDICT_FACTORS.length - 1 ? `1px solid ${cardBorder}` : 'none', background: i % 2 === 0 ? sectionBg : cardBg }}>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold" style={{ color: primary, fontFamily: 'var(--font-sans)' }}>{f.label}</span>
                  <div className="text-sm mt-0.5 leading-snug" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>{f.note}</div>
                </div>
                <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap self-start mt-0.5"
                  style={{
                    background: f.winner === 'kraken' ? KR_COL.bg : CB_COL.bg,
                    color:      f.winner === 'kraken' ? KR_COL.text : CB_COL.text,
                    fontFamily: 'var(--font-display)',
                  }}>
                  {f.winner === 'kraken' ? 'Kraken' : 'Coinbase'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-1.5 text-right">
            <span className="text-sm" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>
              Kraken {krakenWins}/{VERDICT_FACTORS.length} · Coinbase {cbWins}/{VERDICT_FACTORS.length}
            </span>
          </div>
        </div>

      </div>
    </Card>
  );
}

function FairValueBlock({ krakenPps, coinbasePrice }) {
  const rows = [
    { company: 'Kraken',   col: KR_COL, current: krakenPps,     currentNote: 'secondary market avg', fmv: FAIR_VALUE_CONFIG.kraken.fmv,   basis: FAIR_VALUE_CONFIG.kraken.basis   },
    { company: 'Coinbase', col: CB_COL, current: coinbasePrice, currentNote: 'COIN · NASDAQ',        fmv: FAIR_VALUE_CONFIG.coinbase.fmv, basis: FAIR_VALUE_CONFIG.coinbase.basis },
  ];

  return (
    <div className="px-3 sm:px-4 pt-4 pb-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
      <div className="text-xs font-semibold mb-2 uppercase tracking-wide"
        style={{ color: muted, fontFamily: 'var(--font-display)' }}>Kraken Watch Fair Value</div>
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${cardBorder}` }}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Company', 'Current Price', 'KW Fair Value', 'Implied Upside'].map(h => (
                <th key={h} className="px-3 py-2 text-left text-sm uppercase tracking-wide"
                  style={{ background: sectionBg, color: muted, fontFamily: 'var(--font-display)', borderBottom: `1px solid ${cardBorder}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const upside = r.current ? r1((r.fmv / r.current - 1) * 100) : null;
              return (
                <tr key={r.company} style={{ borderTop: i === 0 ? 'none' : `1px solid ${cardBorder}` }}>
                  <td className="px-3 py-2.5">
                    <span className="text-sm font-bold px-2 py-0.5 rounded"
                      style={{ background: r.col.bg, color: r.col.text, fontFamily: 'var(--font-display)' }}>{r.company}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="text-base font-semibold" style={{ color: primary, fontFamily: 'var(--font-sans)' }}>
                      {r.current ? fmtPps(r.current) : '—'}
                    </div>
                    <div className="text-sm" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>{r.currentNote}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="text-base font-bold" style={{ color: primary, fontFamily: 'var(--font-sans)' }}>{fmtPps(r.fmv)}</div>
                    <div className="text-sm" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>{r.basis}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-base font-bold"
                      style={{ color: upside != null ? (upside >= 0 ? WIN_FG : 'hsl(350 45% 35%)') : muted, fontFamily: 'var(--font-sans)' }}>
                      {upside != null ? fmtPct(upside) : '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-sm mt-1.5 italic" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>
        KW Fair Value is a model estimate based on the base scenario — not a price target.
      </p>
    </div>
  );
}

function ScenarioModel({ krakenPps, coinbasePrice }) {
  const krakenRows   = computeScenario(SCENARIO_CONFIG.kraken, krakenPps);
  const coinbaseRows = computeScenario(SCENARIO_CONFIG.coinbase, coinbasePrice);

  function UpsideCell({ v }) {
    if (v == null) return <td className="px-2 py-2 text-center text-sm" style={{ color: muted }}>—</td>;
    return <td className="px-2 py-2 text-center text-sm font-semibold" style={{ color: v >= 0 ? WIN_FG : 'hsl(350 45% 35%)' }}>{fmtPct(v)}</td>;
  }

  const theadContent = ['Scenario', 'Rev Δ', 'Multiple', 'Equity', 'Implied $', 'Upside'];
  const thead = (
    <thead>
      <tr>{theadContent.map(h => (
        <th key={h} className="px-2 py-2 text-center text-sm uppercase tracking-wide whitespace-nowrap"
          style={{ color: muted, fontFamily: 'var(--font-display)', background: sectionBg }}>{h}</th>
      ))}</tr>
    </thead>
  );

  function ScenRow({ row }) {
    return (
      <tr style={{ borderBottom: `1px solid ${cardBorder}` }}>
        <td className="px-2 py-2 text-sm font-bold whitespace-nowrap" style={{ color: row.color, fontFamily: 'var(--font-display)' }}>{row.label}</td>
        <td className="px-2 py-2 text-center text-sm whitespace-nowrap" style={{ color: primary, fontFamily: 'var(--font-sans)' }}>{fmtPct(row.revenue_growth_pct)}</td>
        <td className="px-2 py-2 text-center text-sm whitespace-nowrap" style={{ color: primary, fontFamily: 'var(--font-sans)' }}>{fmtX(row.revenue_multiple)}</td>
        <td className="px-2 py-2 text-center text-sm whitespace-nowrap" style={{ color: primary, fontFamily: 'var(--font-sans)' }}>{fmtB(row.implied_equity_m)}</td>
        <td className="px-2 py-2 text-center text-sm font-semibold whitespace-nowrap" style={{ color: primary, fontFamily: 'var(--font-sans)' }}>{fmtPps(row.implied_price)}</td>
        <UpsideCell v={row.upside_pct} />
      </tr>
    );
  }

  function ScenBlock({ cfg, rows, side, currentPrice, currentNote, discount }) {
    const col = side === 'kraken' ? KR_COL : CB_COL;
    return (
      <div>
        <div className="flex flex-wrap items-center gap-1.5 mb-2 px-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: col.bg, color: col.text, fontFamily: 'var(--font-display)' }}>{col.label}</span>
          <span className="text-sm" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>
            Base rev: {fmtM(cfg.revenue_base_m)} · Price: {fmtPps(currentPrice)} ({currentNote}){discount ? ` · ${discount}% private discount` : ''}
          </span>
        </div>
        <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${cardBorder}` }}>
          <table className="w-full border-collapse" style={{ minWidth: '400px' }}>
            {thead}
            <tbody>{rows.map(r => <ScenRow key={r.key} row={r} />)}</tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <SectionHeader title="Kraken Watch Valuation Model" badge="scenarios — not price targets" />
      <FairValueBlock krakenPps={krakenPps} coinbasePrice={coinbasePrice} />
      <div className="p-3 sm:p-4 space-y-4">
        <ScenBlock cfg={SCENARIO_CONFIG.kraken}   rows={krakenRows}   side="kraken"   currentPrice={krakenPps}     currentNote="secondary market" discount={SCENARIO_CONFIG.kraken.private_discount_pct} />
        <ScenBlock cfg={SCENARIO_CONFIG.coinbase} rows={coinbaseRows} side="coinbase" currentPrice={coinbasePrice} currentNote="COIN" />
        <p className="text-sm italic" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>
          Scenario outputs, not price targets. Revenue multiples are illustrative. Kraken uses est. {SCENARIO_CONFIG.kraken.shares_m}M diluted shares.
        </p>
      </div>
    </Card>
  );
}

function StrategicTable() {
  return (
    <Card>
      <SectionHeader title="Strategic Position" badge="periodically updated" />
      <ColHeaders />
      {STRATEGIC_CONFIG.rows.map((row, i) => (
        <CompRow key={i} label={row.label} kVal={row.kraken} cbVal={row.coinbase} better={null} />
      ))}
    </Card>
  );
}

export default function KrakenVsCoinbase() {
  const { data, loading } = useSiteData();

  const coinbaseStock = data?.coinbase_stock  ?? null;
  const secondary     = data?.secondary_market ?? null;
  const xstocks       = data?.xstocks          ?? null;
  const inkL2         = data?.ink              ?? null;
  const baseL2        = data?.base_l2          ?? null;

  const krakenPps    = secondary?.avg_pps ?? null;
  const krakenMcap   = krakenPps ? Math.round(krakenPps * KRAKEN_CONFIG.equity.shares_est_m) : null;
  const coinbaseMcap = coinbaseStock?.market_cap_millions
    ?? (coinbaseStock?.price_usd ? Math.round(coinbaseStock.price_usd * COINBASE_CONFIG.equity.shares_diluted_m) : null);
  const updatedDisplay = data?.updated_display ?? null;

  return (
    <>
      <Helmet>
        <title>Kraken vs Coinbase — Live Investor Dashboard — Kraken Watch</title>
        <meta name="description" content="Compare Kraken and Coinbase as investments: revenue, valuation multiples, L2 ecosystems, tokenized equity exposure, and 12-month scenario modeling." />
        <link rel="canonical" href="https://krakenwatch.com/kraken-vs-coinbase" />
        <meta property="og:title" content="Kraken vs Coinbase — Live Investor Dashboard" />
        <meta property="og:description" content="Side-by-side investor comparison: revenue, valuation, tokenization, L2 ecosystems, and scenario analysis." />
        <meta property="og:url" content="https://krakenwatch.com/kraken-vs-coinbase" />
        <meta property="og:image" content={`https://krakenwatch.com${HERO_IMAGE}`} />
        <meta name="twitter:image" content={`https://krakenwatch.com${HERO_IMAGE}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="p-3 sm:p-5 space-y-4 max-w-3xl mx-auto">

        {/* Hero image */}
        <PageHeroImage src={HERO_IMAGE} alt="Kraken vs Coinbase — FIGHT!" priority />

        {/* Hero title card */}
        <div className="rounded-xl overflow-hidden"
          style={{ border: `2px solid hsl(30 25% 32%)` }}>
          <div className="p-5 sm:p-7 text-center space-y-2"
            style={{ background: 'hsl(30 30% 20%)' }}>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-wide"
              style={{ fontFamily: 'var(--font-display)', color: 'hsl(38 60% 82%)' }}>
              Kraken vs Coinbase
            </h1>
            <p className="text-base" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(38 30% 62%)' }}>
              Live investor dashboard — revenue, valuation, tokenization &amp; scenarios
            </p>
            <p className="text-sm" style={{ fontFamily: 'var(--font-sans)', color: 'hsl(38 25% 48%)', fontStyle: 'italic' }}>
              If I had capital to deploy today, would I rather own Kraken private shares or Coinbase public stock?
            </p>
            {updatedDisplay && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: 'hsl(30 25% 28%)', border: `1px solid hsl(30 22% 36%)`, color: 'hsl(38 30% 60%)', fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}>
                Updated {updatedDisplay}
              </span>
            )}
            <div className="flex justify-center items-center gap-6 pt-2 flex-wrap">
            {[
              { label: 'Kraken share price', val: krakenPps, sub: 'secondary market avg', col: KR_COL },
              { label: 'Coinbase (COIN)',     val: coinbaseStock?.price_usd, sub: coinbaseStock?.change_pct != null ? fmtPct(coinbaseStock.change_pct) + ' today' : 'NASDAQ', col: CB_COL },
            ].map(({ label, val, sub, col }) => (
              <div key={label} className="text-center">
                <div className="text-xs mb-0.5" style={{ color: 'hsl(38 25% 52%)', fontFamily: 'var(--font-sans)' }}>{label}</div>
                <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: col.text }}>
                  {loading ? '…' : fmtPps(val)}
                </div>
                <div className="text-xs" style={{ color: 'hsl(38 25% 48%)', fontFamily: 'var(--font-sans)' }}>{sub}</div>
              </div>
            ))}
            </div>
          </div>
        </div>

        <ValuationTable krakenMcap={krakenMcap} coinbaseMcap={coinbaseMcap} krakenPps={krakenPps}
          coinbase={coinbaseStock} xstocks={xstocks} inkL2={inkL2} baseL2={baseL2} />

        <KrakenWatchVerdict />

        <ScenarioModel krakenPps={krakenPps} coinbasePrice={coinbaseStock?.price_usd} />

        <StrategicTable />

        {/* Data freshness */}
        <div className="rounded-xl p-4 space-y-2" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
          <div className="text-sm font-semibold" style={{ color: primary, fontFamily: 'var(--font-display)' }}>Data Refresh Schedule</div>
          <div className="grid gap-1.5 text-sm" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>
            {[
              { tag: '● live', desc: 'COIN price (Yahoo Finance), xStocks market data (CoinGecko), Ink & Base L2 metrics (DeFiLlama)', freq: 'Daily · 8am UTC (Cloudflare cron)' },
              { tag: 'manual', desc: 'Kraken secondary market prices (Hiive, Forge, NPM, Notice)', freq: 'Per session — updated when new quotes available' },
              { tag: 'manual', desc: 'Prediction market odds (Kalshi, Polymarket)', freq: 'Per session — updated when odds move materially' },
              { tag: 'periodic', desc: 'Financials, EBITDA estimates, strategic position', freq: 'When quarterly reports or material news is published' },
            ].map(({ tag, desc, freq }) => (
              <div key={desc} className="flex gap-2 items-start">
                <span className="shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded mt-0.5"
                  style={{
                    background: tag === '● live' ? 'hsl(150 40% 14%)' : 'hsl(30 25% 28%)',
                    color:      tag === '● live' ? 'hsl(150 65% 60%)' : 'hsl(38 35% 65%)',
                    border:     `1px solid ${tag === '● live' ? 'hsl(150 35% 24%)' : 'hsl(30 20% 36%)'}`,
                  }}>{tag}</span>
                <div>
                  <span style={{ color: primary }}>{desc}</span>
                  <span className="ml-1 opacity-70"> — {freq}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl p-4" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
          <p className="text-sm leading-relaxed" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>
            <strong style={{ color: primary }}>Disclaimer:</strong> For informational purposes only — not investment advice.
            Kraken financials are from the May 18 2026 Payward Q1 press release plus estimates. Coinbase financials are from SEC filings.
            Scenario outputs are illustrative — not price targets. Kraken implied market cap uses an estimated share count (not confirmed via S-1).
            Kraken's fully diluted share count is not publicly disclosed. Estimated diluted shares are derived from reported prior financing valuation and share-price data.
          </p>
          <p className="text-sm mt-2 flex flex-wrap gap-x-2 gap-y-0.5" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>
            {[
              { label: 'Payward Q1 2026', href: 'https://www.payward.com/press-release/q1-2026-financial-highlights' },
              { label: 'Coinbase SEC filings', href: 'https://investor.coinbase.com' },
              { label: 'DeFiLlama', href: 'https://defillama.com' },
              { label: 'CoinGecko', href: 'https://www.coingecko.com' },
              { label: 'Hiive', href: 'https://www.hiive.com' },
              { label: 'Forge', href: 'https://forgeglobal.com' },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ color: primary }}>{label}</a>
            ))}
          </p>
        </div>

      </div>
    </>
  );
}
