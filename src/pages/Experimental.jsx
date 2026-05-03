import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';
import EcosystemMap from '../components/EcosystemMap';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Label, Cell,
} from 'recharts';

const qp = 'hsl(28 40% 14%)';
const ut = 'hsl(30 20% 38%)';
const on = 'hsl(350 55% 32%)';
const cardStyle = { border: '2px solid hsl(33 35% 60%)', background: 'hsl(38 40% 90%)' };
const sectionBg = 'hsl(33 28% 82%)';
const bg = 'hsl(38 38% 93%)';
const border = 'hsl(33 28% 70%)';
const cardBorder = 'hsl(33 35% 60%)';
const darkHeaderBg = 'hsl(30 30% 24%)';
const darkHeaderBorder = 'hsl(30 25% 32%)';
const darkHeaderText = 'hsl(38 50% 78%)';
const accent = 'hsl(350 50% 32%)';

const SOURCE_BADGE = {
  Kalshi:     { bg: 'hsl(220 45% 88%)', fg: 'hsl(220 50% 35%)' },
  Polymarket: { bg: 'hsl(270 35% 88%)', fg: 'hsl(270 40% 35%)' },
};

function SourceBadge({ src }) {
  const s = SOURCE_BADGE[src] || { bg: sectionBg, fg: ut };
  return (
    <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
      style={{ background: s.bg, color: s.fg, fontFamily: 'var(--font-display)' }}>
      {src}
    </span>
  );
}

function PctBar({ pct }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(33 25% 75%)' }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct || 0)}%`, background: on }} />
      </div>
      <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: on, fontFamily: 'var(--font-display)' }}>
        {pct != null ? `${pct}%` : '—'}
      </span>
    </div>
  );
}

function PredRow({ label, pct, src, href, note }) {
  return (
    <div className="flex flex-col gap-1 py-2.5 border-b last:border-b-0" style={{ borderColor: 'hsl(33 25% 78%)' }}>
      <div className="flex items-center gap-2 flex-wrap">
        <SourceBadge src={src} />
        {href
          ? <a href={href} target="_blank" rel="noopener noreferrer"
              className="text-xs hover:underline" style={{ color: qp, fontFamily: 'var(--font-serif)' }}>{label}</a>
          : <span className="text-xs" style={{ color: qp, fontFamily: 'var(--font-serif)' }}>{label}</span>
        }
      </div>
      <PctBar pct={pct} />
      {note && <p className="text-[10px]" style={{ color: ut }}>{note}</p>}
    </div>
  );
}

function InkMarketCard({ name, pct, href }) {
  const barWidth = Math.min(100, Math.max(0, pct ?? 0));
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full transition-opacity hover:opacity-90" style={{ textDecoration: 'none' }}>
      <div className="rounded-xl overflow-hidden flex flex-col h-full" style={{ border: `2px solid ${cardBorder}`, background: bg }}>
        <div className="px-4 pt-3.5 pb-2 flex items-start justify-between gap-3 flex-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <SourceBadge src="Polymarket" />
            </div>
            <p className="text-sm font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: qp }}>{name}</p>
          </div>
          <p className="text-3xl font-bold tabular-nums leading-none shrink-0" style={{ fontFamily: 'var(--font-display)', color: on }}>
            {pct != null ? `${pct}%` : '—'}
          </p>
        </div>
        <div className="px-4 pb-3">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(33 25% 76%)' }}>
            <div className="h-full rounded-full" style={{ width: `${barWidth}%`, background: `linear-gradient(to right, ${accent}, hsl(25 55% 38%))` }} />
          </div>
          <p className="text-[9px] mt-1.5" style={{ color: ut }}>updated daily · click to view market ↗</p>
        </div>
      </div>
    </a>
  );
}

function ModuleShell({ number, title, subtitle, children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `2px solid ${cardBorder}`, background: bg }}>
      <div className="px-4 py-3 flex items-center gap-2 flex-wrap"
        style={{ background: darkHeaderBg, borderBottom: `1px solid ${darkHeaderBorder}` }}>
        <span className="text-[11px] font-bold tabular-nums w-6 h-6 flex items-center justify-center rounded-full shrink-0"
          style={{ background: on, color: 'hsl(38 60% 92%)', fontFamily: 'var(--font-display)' }}>
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: darkHeaderText }}>{title}</span>
          {subtitle && <p className="text-[10px] mt-0.5" style={{ color: 'hsl(38 35% 60%)', fontFamily: 'var(--font-serif)' }}>{subtitle}</p>}
        </div>
      </div>
      <div className="px-4 py-4">
        {children}
      </div>
    </div>
  );
}

const inkKpis = [
  { label: 'Total Value Locked',  value: '$536.48M', sub: 'L2Beat TVS',   delta: '+488.5%' },
  { label: 'Bridged TVL',         value: '$829.94M', sub: 'Cross-chain',  delta: null },
  { label: 'Total Transactions',  value: '251.5M',   sub: 'All-time',     delta: null },
  { label: 'Total Addresses',     value: '8.35M',    sub: 'Unique',       delta: null },
  { label: 'Daily Transactions',  value: '447,821',  sub: '24h avg',      delta: '+12.3%' },
];

const tvlChartData = [
  { month: "Dec '24", value: 0.97 },
  { month: "Jan '25", value: 2 },
  { month: "Feb '25", value: 5.49 },
  { month: "Mar '25", value: 4.29 },
  { month: "Apr '25", value: 4.04 },
  { month: "May '25", value: 6.88 },
  { month: "Jun '25", value: 7.4 },
  { month: "Jul '25", value: 8.63 },
  { month: "Aug '25", value: 9.22 },
  { month: "Sep '25", value: 8.68 },
  { month: "Oct '25", value: 111.7 },
  { month: "Nov '25", value: 288.1 },
  { month: "Dec '25", value: 409.5 },
  { month: "Jan '26", value: 526 },
  { month: "Feb '26", value: 437.7 },
  { month: "Mar '26", value: 472.1 },
  { month: "Apr '26", value: 481.7 },
];

const bridgedAssets = [
  { name: 'kBTC',   value: 244.93, pct: '29.5%' },
  { name: 'USDT0',  value: 235.05, pct: '28.3%' },
  { name: 'USDG',   value: 107.48, pct: '12.9%' },
  { name: 'WETH',   value: 57.54,  pct: '6.9%' },
  { name: 'sUSDe',  value: 45.85,  pct: '5.5%' },
  { name: 'USDC',   value: 44.69,  pct: '5.4%' },
  { name: 'ezETH',  value: 35.24,  pct: '4.2%' },
  { name: 'rsETH',  value: 17.2,   pct: '2.1%' },
  { name: 'Other',  value: 42,     pct: '5.1%' },
];
const barColors = ['#7B61FF','#20C9A6','#5B8DEF','#E9A74A','#C27AFF','#3DD68C','#FF7B93','#5EC4D4','#6B7280'];

const protocols = [
  { name: 'Tydro',    type: 'Lending',              tvl: '~$380M TVL',    detail: 'Aave v3 white-label',      color: '#7B61FF' },
  { name: 'Nado',     type: 'Perp DEX',             tvl: '$17B Jan volume', detail: '5-15ms latency',         color: '#20C9A6' },
  { name: 'Rails',    type: 'Institutional Perps',  tvl: 'KYC/Compliant', detail: 'Kraken Ventures-backed',   color: '#5B8DEF' },
  { name: 'Velodrome',type: 'AMM DEX',              tvl: 'Superchain native', detail: '',                     color: '#E9A74A' },
  { name: 'Morpho',   type: 'Modular Lending',      tvl: '',              detail: '',                         color: '#C27AFF' },
  { name: 'Uniswap',  type: 'AMM DEX',              tvl: '',              detail: '',                         color: '#FF7B93' },
  { name: 'Curve',    type: 'Stableswap',           tvl: '',              detail: '',                         color: '#3DD68C' },
  { name: 'Spark',    type: 'Lending',              tvl: '',              detail: 'MakerDAO/Sky',              color: '#5EC4D4' },
];

const milestones = [
  { date: 'Dec 18, 2024', title: 'Mainnet Launch',          detail: 'Ink L2 goes live on Optimism Superchain',   highlight: false },
  { date: 'Jan 22, 2025', title: 'Stage 1 Decentralization', detail: 'Governance framework established',          highlight: false },
  { date: 'Jun 17, 2025', title: 'INK Token Announced',     detail: 'Native token for ecosystem incentives',      highlight: false },
  { date: 'Oct 15, 2025', title: 'Tydro Launch',            detail: '+3,800% TVL growth — Aave v3 white-label',   highlight: true },
  { date: 'Jan 2026',     title: 'Nado Beta',               detail: '$17B volume — perpetual DEX',                highlight: true },
  { date: 'Jan 15, 2026', title: 'Peak TVL $572.8M',        detail: 'All-time high total value locked',           highlight: true },
  { date: 'Apr 7, 2026',  title: 'L2Beat Interop Dashboard', detail: 'Cross-chain analytics integration',         highlight: false },
  { date: 'Q2-Q3 2026',   title: 'INK Token TGE',           detail: 'Projected token generation event',           highlight: false },
];

function TvlTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'hsl(38 35% 92%)', border: '1px solid hsl(33 25% 65%)', borderRadius: 6, padding: '6px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: qp }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 700, color: qp, fontVariantNumeric: 'tabular-nums' }}>${payload[0].value}M</p>
    </div>
  );
}

function BridgeTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: 'hsl(38 35% 92%)', border: '1px solid hsl(33 25% 65%)', borderRadius: 6, padding: '6px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: qp }}>{d.name}</p>
      <p style={{ fontSize: 13, fontWeight: 700, color: qp, fontVariantNumeric: 'tabular-nums' }}>${d.value.toFixed(2)}M</p>
      <p style={{ fontSize: 11, color: ut }}>{d.pct} of total</p>
    </div>
  );
}

export default function Experimental() {
  const { data } = useSiteData();
  const sm = data?.secondary_market;
  const ipo = data?.ipo;
  const ink = data?.ink;
  const pm = data?.prediction_markets;
  const updated = data?.updated_display || 'April 22, 2026';

  return (
    <>
      <Helmet>
        <title>Experimental — Kraken Watch</title>
        <meta name="description" content="Staging area for all proposed Kraken Map and Ink Markets modules under development." />
        <link rel="canonical" href="https://krakenwatch.com/experimental" />
        <meta property="og:title" content="Experimental — Kraken Watch" />
        <meta property="og:description" content="Staging area for all proposed Kraken Map and Ink Markets modules under development." />
        <meta property="og:url" content="https://krakenwatch.com/experimental" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Experimental — Kraken Watch" />
        <meta name="twitter:description" content="Staging area for all proposed Kraken Map and Ink Markets modules under development." />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-6 max-w-[900px] mx-auto">

        <div className="w-full rounded-xl overflow-hidden shadow-lg border-2" style={{ borderColor: 'hsl(30 30% 60%)' }}>
          <img src="/experimental-hero.png" alt="Experimental staging area" className="w-full object-cover" />
        </div>

        <div className="text-center flex flex-col items-center gap-2 pt-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: 'hsl(33 28% 82%)', color: ut, border: '1px solid hsl(33 25% 70%)', fontFamily: 'var(--font-display)' }}>
            ⚗ Staging Area
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
            Experimental
          </h1>
          <p className="text-sm max-w-lg" style={{ fontFamily: 'var(--font-serif)', color: qp, opacity: 0.7 }}>
            New modules still getting their sea legs.
          </p>
          <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-display)', color: ut }}>
            Yar!{' '}
            <a href="https://x.com/KrakWatch" target="_blank" rel="noopener noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: on }}>Request a feature.</a>
          </p>
          <p className="text-sm" style={{ fontFamily: 'var(--font-display)', color: ut }}>
            <a href="https://x.com/KrakWatch" target="_blank" rel="noopener noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: on }}>Submit a story.</a>
          </p>
        </div>

        {/* ── MODULE 1 — Key Metrics Overview ── */}
        <ModuleShell number="1" title="Key Metrics Overview">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'IPO Odds',      value: ipo?.avg_pct != null ? `${ipo.avg_pct}%` : '—',             sub: 'avg. implied · 2026' },
              { label: 'Share Price',   value: sm?.avg_pps  != null ? `$${sm.avg_pps.toFixed(2)}` : '—',  sub: 'secondary avg · 4 venues' },
              { label: 'Ink TVL',       value: ink?.tvl_millions != null ? `$${ink.tvl_millions}M` : '—', sub: 'total value locked' },
              { label: 'Ink Protocols', value: ink?.protocol_count != null ? `${ink.protocol_count}` : '—', sub: 'live on chain' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="rounded-lg p-4 flex flex-col gap-1" style={cardStyle}>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)', color: ut }}>{label}</p>
                <p className="text-3xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: on }}>{value}</p>
                <p className="text-[10px]" style={{ color: ut, fontStyle: 'italic' }}>{sub}</p>
              </div>
            ))}
          </div>
        </ModuleShell>

        {/* ── MODULE 2 — Prediction Markets: IPO Signal ── */}
        <ModuleShell number="2" title="Prediction Markets — IPO Signal">
          <p className="text-[10px] font-semibold uppercase tracking-widest pb-1" style={{ color: ut }}>IPO Signal</p>
          <PredRow label="Kraken IPO before end of 2026"
            pct={pm?.ipo?.kalshi_pct ?? ipo?.kalshi_pct}
            src="Kalshi"
            href="https://kalshi.com/markets/kxipo/ipos/kxipo-26" />
          <PredRow label="Kraken IPO by Dec 31, 2026"
            pct={pm?.ipo?.polymarket_pct ?? ipo?.polymarket_pct}
            src="Polymarket"
            href="https://polymarket.com/event/kraken-ipo-in-2025" />
          <PredRow label="Kraken IPO closing market cap above $16B"
            pct={pm?.ipo?.mktcap_16b_pct}
            src="Polymarket"
            href="https://polymarket.com/event/kraken-ipo-closing-market-cap-above" />
          <PredRow label="Kraken: largest IPO 2026 (excl. SpaceX)"
            pct={pm?.ipo?.largest_excl_spacex_pct}
            src="Polymarket"
            href="https://polymarket.com/event/largest-ipo-by-market-cap-in-2026-287"
            note="Conditional: Kraken raw 0.5% ÷ non-SpaceX pool ~10.5%" />
        </ModuleShell>

        {/* ── MODULE 3 — Underwriter Watch ── */}
        <ModuleShell number="3" title="Underwriter Watch">
          <p className="text-[10px] mb-2" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>
            Which bank leads the Kraken IPO? (markets are not mutually exclusive)
          </p>
          {pm?.underwriters?.length > 0 ? (
            <div className="space-y-2">
              {pm.underwriters.map(u => (
                <div key={u.ticker} className="flex items-center gap-3">
                  <span className="text-xs w-36 shrink-0" style={{ color: qp, fontFamily: 'var(--font-serif)' }}>{u.bank}</span>
                  <div className="flex-1"><PctBar pct={u.pct} /></div>
                </div>
              ))}
              <a href="https://kalshi.com/markets/kxkrakenbankpublic/kraken-ipo/kxkrakenbankpublic-27jan01"
                target="_blank" rel="noopener noreferrer"
                className="text-[10px] mt-2 inline-block hover:underline" style={{ color: ut }}>
                Source: Kalshi KXKRAKENBANKPUBLIC →
              </a>
            </div>
          ) : (
            <p className="text-xs" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>No underwriter data available.</p>
          )}
        </ModuleShell>

        {/* ── MODULE 4 — Secondary Market Pricing ── */}
        <ModuleShell number="4" title="Secondary Market Pricing">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
            {[
              { label: 'Hiive',     value: sm?.hiive_pps  ? `$${sm.hiive_pps}` : '—' },
              { label: 'Forge',     value: sm?.forge_pps  ? `$${sm.forge_pps}` : '—' },
              { label: 'NASDAQ PM', value: sm?.npm_pps    ? `$${sm.npm_pps}` : '—' },
              { label: 'Notice',    value: sm?.notice_pps ? `$${sm.notice_pps}` : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)', color: ut }}>{label}</p>
                <p className="text-xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: on }}>{value}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px]" style={{ color: ut }}>
            Weighted avg: <span className="font-bold" style={{ color: on }}>{sm?.avg_pps ? `$${sm.avg_pps}` : '—'}</span>
            {sm?.volume_30d_est_m ? ` · Est. 30D vol ~$${sm.volume_30d_est_m}M across venues` : ''}
          </p>
        </ModuleShell>

        {/* ── MODULE 5 — Ink Chain Metrics ── */}
        <ModuleShell number="5" title="Ink Chain Metrics" subtitle="Source: L2Beat, DeFiLlama · periodically updated">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {inkKpis.map(({ label, value, sub, delta }) => (
              <div key={label} className="rounded-lg p-3 flex flex-col gap-0.5 relative overflow-hidden" style={cardStyle}>
                <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)', color: ut }}>{label}</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: on }}>{value}</p>
                  {delta && (
                    <span className="text-[9px] font-semibold px-1 py-0.5 rounded"
                      style={{ background: 'hsl(150 30% 84%)', color: 'hsl(150 45% 28%)', fontFamily: 'var(--font-display)' }}>
                      {delta}
                    </span>
                  )}
                </div>
                <p className="text-[9px]" style={{ color: ut, fontStyle: 'italic' }}>{sub}</p>
                <div className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(to right, ${accent}, hsl(25 55% 38%))`, opacity: 0.45 }} />
              </div>
            ))}
          </div>
        </ModuleShell>

        {/* ── MODULE 6 — INK Token FDV Prediction Markets ── */}
        <ModuleShell number="6" title="INK Token FDV — Prediction Markets">
          <p className="text-[11px] mb-4" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>
            Polymarket markets on INK&apos;s fully-diluted valuation one day after token launch.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'INK FDV above $250M', field: 'above_250m_pct' },
              { label: 'INK FDV above $500M', field: 'above_500m_pct' },
              { label: 'INK FDV above $1B',   field: 'above_1b_pct' },
              { label: 'INK FDV above $2B',   field: 'above_2b_pct' },
            ].map(({ label, field }) => (
              <InkMarketCard
                key={field}
                name={label}
                pct={pm?.ink_fdv?.[field]}
                href="https://polymarket.com/event/ink-fdv-above-one-day-after-launch"
              />
            ))}
          </div>
          <p className="text-[10px] mt-3" style={{ color: ut }}>
            Markets resolve based on the fully-diluted valuation of INK token one day after public launch.
          </p>
        </ModuleShell>

        {/* ── MODULE 7 — TVL Growth Chart ── */}
        <ModuleShell number="7" title="TVL Growth: $0.97M → $481.7M" subtitle="DeFi TVL since mainnet launch (Dec 2024)">
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tvlChartData} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                <defs>
                  <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.35} />
                    <stop offset="60%" stopColor="#7B61FF" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#7B61FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(33 20% 78%)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: ut }} tickLine={false} axisLine={{ stroke: 'hsl(33 20% 72%)' }} interval={2} />
                <YAxis tick={{ fontSize: 10, fill: ut }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1 ? `$${v}M` : ''} width={62} />
                <Tooltip content={<TvlTooltip />} />
                <ReferenceLine x="Oct '25" stroke="#20C9A6" strokeDasharray="4 4" strokeWidth={1.5}>
                  <Label value="Tydro Launch" position="top" fill="#20C9A6" fontSize={10} fontWeight={600} offset={8} />
                </ReferenceLine>
                <Area type="monotone" dataKey="value" stroke="#7B61FF" strokeWidth={2.5} fill="url(#tvlGradient)"
                  dot={false} activeDot={{ r: 4, stroke: '#7B61FF', strokeWidth: 2, fill: 'hsl(38 38% 93%)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ModuleShell>

        {/* ── MODULE 8 — Bridged Assets ── */}
        <ModuleShell number="8" title="Bridged Assets Breakdown" subtitle="$829.94M total bridged value">
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bridgedAssets} layout="vertical" margin={{ top: 5, right: 40, bottom: 5, left: 5 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: ut }} tickLine={false} axisLine={{ stroke: 'hsl(33 20% 72%)' }} tickFormatter={v => `$${v}M`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: qp, fontWeight: 500 }} tickLine={false} axisLine={false} width={55} />
                <Tooltip content={<BridgeTooltip />} cursor={{ fill: 'rgba(123, 97, 255, 0.06)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={22}>
                  {bridgedAssets.map((_, i) => <Cell key={i} fill={barColors[i]} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ModuleShell>

        {/* ── MODULE 9 — Ecosystem Protocols ── */}
        <ModuleShell number="9" title="Ecosystem Protocols">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {protocols.map(p => (
              <div key={p.name} className="rounded-xl border relative overflow-hidden"
                style={{ background: bg, borderColor: border }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="text-sm font-semibold" style={{ color: qp, fontFamily: 'var(--font-display)' }}>{p.name}</span>
                  </div>
                  <span className="inline-flex text-[10px] font-medium px-2 py-0.5 rounded-md mb-2"
                    style={{ background: sectionBg, color: qp, border: `1px solid ${border}`, fontFamily: 'var(--font-display)' }}>
                    {p.type}
                  </span>
                  {p.tvl  && <p className="text-xs tabular-nums mt-1"  style={{ color: ut }}>{p.tvl}</p>}
                  {p.detail && <p className="text-[11px] mt-0.5" style={{ color: ut }}>{p.detail}</p>}
                </div>
                <div className="absolute top-0 left-0 w-[2px] h-full" style={{ backgroundColor: p.color, opacity: 0.5 }} />
              </div>
            ))}
          </div>
        </ModuleShell>

        {/* ── MODULE 10 — Ecosystem Map ── */}
        <ModuleShell number="10" title="Ecosystem Map" subtitle="Key projects and relationships on Ink">
          <div style={{ height: 700, margin: '-1rem' }}>
            <EcosystemMap embedded={true} />
          </div>
        </ModuleShell>

        {/* ── MODULE 11 — Growth Milestones ── */}
        <ModuleShell number="11" title="Growth Milestones" subtitle="Key events in Ink's development">
          <div className="relative pl-6">
            <div className="absolute left-[9px] top-2 bottom-2 w-[2px]"
              style={{ background: 'linear-gradient(to bottom, #7B61FF, rgba(123,97,255,0.5), transparent)' }} />
            <div className="space-y-5">
              {milestones.map((m, i) => (
                <div key={i} className="relative flex gap-4">
                  <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2"
                    style={{ borderColor: m.highlight ? '#7B61FF' : 'hsl(33 25% 58%)', background: m.highlight ? '#7B61FF' : 'hsl(38 30% 84%)' }} />
                  <div>
                    <p className="text-[11px] font-semibold tabular-nums" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>{m.date}</p>
                    <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: m.highlight ? qp : 'hsl(28 30% 30%)' }}>{m.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>{m.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ModuleShell>

        {/* ── MODULE 12 — NFTs / Memecoins ── */}
        <ModuleShell number="12" title="NFTs &amp; Memecoins" subtitle="Community-driven activity on Ink">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'NFTs',      icon: '🖼️', desc: 'Collections, marketplaces, and creator activity on Ink.' },
              { label: 'Memecoins', icon: '🐸', desc: 'Token launches and community-driven assets on Ink.' },
            ].map(({ label, icon, desc }) => (
              <div key={label} className="rounded-lg overflow-hidden" style={{ border: `2px solid ${cardBorder}`, background: bg }}>
                <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: darkHeaderBg, borderBottom: `1px solid ${darkHeaderBorder}` }}>
                  <span style={{ color: 'hsl(38 55% 72%)' }}>{icon}</span>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)', color: darkHeaderText }}>{label}</span>
                  <span className="ml-auto text-[9px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'hsl(38 40% 30%)', color: 'hsl(38 60% 80%)', border: '1px solid hsl(38 35% 40%)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}>
                    Coming Soon
                  </span>
                </div>
                <div className="p-5 flex flex-col items-center justify-center gap-2 text-center" style={{ minHeight: '90px' }}>
                  <p className="text-[11px]" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>{desc}</p>
                  <p className="text-[10px]" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Module in development — charting the frontier.</p>
                </div>
              </div>
            ))}
          </div>
        </ModuleShell>

        {/* ── MODULE 13 — About Ink ── */}
        <ModuleShell number="13" title="About Ink">
          <p className="text-sm leading-relaxed mb-3" style={{ fontFamily: 'var(--font-serif)', color: qp }}>
            Ink is Kraken&apos;s Ethereum L2 chain, built on the OP Stack. It launched in November 2024 and is designed to bring Kraken&apos;s crypto exchange users on-chain, enabling DeFi, NFTs, and native crypto applications.
          </p>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'Explorer',  href: 'https://explorer.inkonchain.com' },
              { label: 'Bridge',    href: 'https://inkonchain.com/bridge' },
              { label: 'Ecosystem', href: 'https://inkonchain.com/ecosystem' },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="text-xs font-semibold px-3 py-1 rounded transition-opacity hover:opacity-75"
                style={{ background: 'hsl(33 35% 82%)', color: qp, fontFamily: 'var(--font-display)' }}>
                {label} →
              </a>
            ))}
          </div>
        </ModuleShell>

        <p className="text-[10px] text-center pb-4 pt-2" style={{ color: ut }}>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded mr-1"
            style={{ background: 'hsl(33 28% 82%)', border: '1px solid hsl(33 25% 70%)' }}>
            ↻ Updated daily · {updated}
          </span>
          Kraken Watch is independent research, not affiliated with Kraken or Payward
        </p>
      </div>
    </>
  );
}
