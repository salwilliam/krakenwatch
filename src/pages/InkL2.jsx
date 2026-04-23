import { Helmet } from 'react-helmet-async';
import EcosystemMap from '../components/EcosystemMap';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Label,
  Cell,
} from 'recharts';

const bg = 'hsl(38 38% 93%)';
const border = 'hsl(33 28% 70%)';
const primary = 'hsl(28 40% 14%)';
const muted = 'hsl(30 20% 40%)';
const accent = 'hsl(350 50% 32%)';

const kpis = [
  { label: 'Total Value Locked', value: '$536.48M', sublabel: 'L2Beat TVS', delta: '+488.5%', positive: true },
  { label: 'Bridged TVL', value: '$829.94M', sublabel: 'Cross-chain', delta: null, positive: true },
  { label: 'Total Transactions', value: '251.5M', sublabel: 'All-time', delta: null, positive: true },
  { label: 'Total Addresses', value: '8.35M', sublabel: 'Unique', delta: null, positive: true },
  { label: 'Daily Transactions', value: '447,821', sublabel: '24h avg', delta: '+12.3%', positive: true },
];

const polymarketData = [
  { threshold: 'Above $250M', prob: 0.695, volume: '$73.2K' },
  { threshold: 'Above $500M', prob: 0.525, volume: '$256.6K' },
  { threshold: 'Above $1B', prob: 0.255, volume: '$157.5K' },
  { threshold: 'Above $2B', prob: 0.09, volume: '$10.2K' },
  { threshold: 'Above $3B', prob: 0.053, volume: '$6.9K' },
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
  { name: 'kBTC', value: 244.93, pct: '29.5%' },
  { name: 'USDT0', value: 235.05, pct: '28.3%' },
  { name: 'USDG', value: 107.48, pct: '12.9%' },
  { name: 'WETH', value: 57.54, pct: '6.9%' },
  { name: 'sUSDe', value: 45.85, pct: '5.5%' },
  { name: 'USDC', value: 44.69, pct: '5.4%' },
  { name: 'ezETH', value: 35.24, pct: '4.2%' },
  { name: 'rsETH', value: 17.2, pct: '2.1%' },
  { name: 'Other', value: 42, pct: '5.1%' },
];
const barColors = ['#7B61FF', '#20C9A6', '#5B8DEF', '#E9A74A', '#C27AFF', '#3DD68C', '#FF7B93', '#5EC4D4', '#6B7280'];

const protocols = [
  { name: 'Tydro', type: 'Lending', tvl: '~$380M TVL', detail: 'Aave v3 white-label', color: '#7B61FF' },
  { name: 'Nado', type: 'Perp DEX', tvl: '$17B Jan volume', detail: '5-15ms latency', color: '#20C9A6' },
  { name: 'Rails', type: 'Institutional Perps', tvl: 'KYC/Compliant', detail: 'Kraken Ventures-backed', color: '#5B8DEF' },
  { name: 'Velodrome', type: 'AMM DEX', tvl: 'Superchain native', detail: '', color: '#E9A74A' },
  { name: 'Morpho', type: 'Modular Lending', tvl: '', detail: '', color: '#C27AFF' },
  { name: 'Uniswap', type: 'AMM DEX', tvl: '', detail: '', color: '#FF7B93' },
  { name: 'Curve', type: 'Stableswap', tvl: '', detail: '', color: '#3DD68C' },
  { name: 'Spark', type: 'Lending', tvl: '', detail: 'MakerDAO/Sky', color: '#5EC4D4' },
];

const milestones = [
  { date: 'Dec 18, 2024', title: 'Mainnet Launch', detail: 'Ink L2 goes live on Optimism Superchain', highlight: false },
  { date: 'Jan 22, 2025', title: 'Stage 1 Decentralization', detail: 'Governance framework established', highlight: false },
  { date: 'Jun 17, 2025', title: 'INK Token Announced', detail: 'Native token for ecosystem incentives', highlight: false },
  { date: 'Oct 15, 2025', title: 'Tydro Launch', detail: '+3,800% TVL growth — Aave v3 white-label', highlight: true },
  { date: 'Jan 2026', title: 'Nado Beta', detail: '$17B volume — perpetual DEX', highlight: true },
  { date: 'Jan 15, 2026', title: 'Peak TVL $572.8M', detail: 'All-time high total value locked', highlight: true },
  { date: 'Apr 7, 2026', title: 'L2Beat Interop Dashboard', detail: 'Cross-chain analytics integration', highlight: false },
  { date: 'Q2-Q3 2026', title: 'INK Token TGE', detail: 'Projected token generation event', highlight: false },
];

function TvlTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'hsl(38 35% 92%)', border: '1px solid hsl(33 25% 65%)', borderRadius: 6, padding: '6px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: primary }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 700, color: primary, fontVariantNumeric: 'tabular-nums' }}>${payload[0].value}M</p>
    </div>
  );
}

function BridgeTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: 'hsl(38 35% 92%)', border: '1px solid hsl(33 25% 65%)', borderRadius: 6, padding: '6px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: primary }}>{d.name}</p>
      <p style={{ fontSize: 13, fontWeight: 700, color: primary, fontVariantNumeric: 'tabular-nums' }}>${d.value.toFixed(2)}M</p>
      <p style={{ fontSize: 11, color: muted }}>{d.pct} of total</p>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: border }}>
        <h3 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)', color: primary }}>{title}</h3>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: muted, fontFamily: 'var(--font-serif)' }}>{subtitle}</p>}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

export default function InkL2() {
  return (
    <>
      <Helmet>
        <title>Ink L2 Analytics — Kraken Watch</title>
        <meta name="description" content="Live Ink L2 TVL, protocol count, and ecosystem growth data. Kraken's L2 chain built on the OP Stack." />
        <link rel="canonical" href="https://krakenwatch.com/ink" />
        <meta property="og:title" content="Ink L2 Analytics — Kraken Watch" />
        <meta property="og:description" content="Live Ink L2 TVL, protocol count, and ecosystem growth data." />
        <meta property="og:url" content="https://krakenwatch.com/ink" />
      </Helmet>

      <div className="p-6 space-y-6 max-w-[900px] mx-auto">
        <div className="flex justify-center">
          <img src="/stamp-binnacle.png" alt="Ink" className="object-contain" style={{ width: '100px', height: '100px' }} />
        </div>

        <SectionCard
          title="INK Token FDV Forecast"
          subtitle="Polymarket implied probability · one day after token launch"
        >
          <div className="flex items-center justify-end mb-4">
            <a href="https://polymarket.com/event/ink-fdv-above-one-day-after-launch" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded"
              style={{ color: accent, fontFamily: 'var(--font-serif)', border: `1px solid ${border}` }}>
              Polymarket ↗
            </a>
          </div>
          <div className="space-y-3">
            {polymarketData.map(({ threshold, prob, volume }) => (
              <div key={threshold}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: primary }}>{threshold}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px]" style={{ color: muted, fontFamily: 'var(--font-serif)' }}>Vol {volume}</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: prob >= 0.5 ? 'hsl(150 40% 30%)' : accent, fontFamily: 'var(--font-display)' }}>
                      {(prob * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'hsl(33 28% 80%)' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${prob * 100}%`,
                    background: prob >= 0.5
                      ? 'linear-gradient(to right, hsl(150 40% 40%), hsl(150 50% 30%))'
                      : `linear-gradient(to right, ${accent}, hsl(25 55% 38%))`,
                  }} />
                </div>
              </div>
            ))}
            <p className="text-[11px] pt-1" style={{ color: muted, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              Market probabilities reflect crowd consensus and are not financial advice. INK token has not yet launched.
            </p>
          </div>
        </SectionCard>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpis.map(kpi => (
            <div key={kpi.label} className="rounded-lg p-4 relative overflow-hidden"
              style={{ background: bg, border: `1px solid ${border}` }}
              data-testid={`kpi-${kpi.label.toLowerCase().replace(/\s/g, '-')}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)', color: muted }}>
                  {kpi.label}
                </span>
              </div>
              <div className="text-xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: primary }}>
                {kpi.value}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px]" style={{ color: muted, fontFamily: 'var(--font-serif)' }}>{kpi.sublabel}</span>
                {kpi.delta && (
                  <span className="text-[11px] font-semibold tabular-nums" style={{ color: kpi.positive ? 'hsl(150 40% 30%)' : 'hsl(0 50% 40%)', fontFamily: 'var(--font-display)' }}>
                    {kpi.delta}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${accent}, hsl(25 55% 38%))`, opacity: 0.5 }} />
            </div>
          ))}
        </div>

        <SectionCard title="TVL Growth: $0.97M → $481.7M" subtitle="DeFi TVL since mainnet launch (Dec 2024)">
          <div className="w-full h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tvlChartData} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                <defs>
                  <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.35} />
                    <stop offset="60%" stopColor="#7B61FF" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#7B61FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 19% 16%)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(215 10% 55%)' }} tickLine={false} axisLine={{ stroke: 'hsl(215 19% 16%)' }} interval={2} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(215 10% 55%)' }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1 ? `$${v}M` : ''} width={65} />
                <Tooltip content={<TvlTooltip />} />
                <ReferenceLine x="Oct '25" stroke="#20C9A6" strokeDasharray="4 4" strokeWidth={1.5}>
                  <Label value="Tydro Launch" position="top" fill="#20C9A6" fontSize={11} fontWeight={600} offset={10} />
                </ReferenceLine>
                <Area type="monotone" dataKey="value" stroke="#7B61FF" strokeWidth={2.5} fill="url(#tvlGradient)" dot={false} activeDot={{ r: 4, stroke: '#7B61FF', strokeWidth: 2, fill: '#0D1117' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Bridged Assets Breakdown" subtitle="$829.94M total bridged value">
          <div className="w-full h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bridgedAssets} layout="vertical" margin={{ top: 5, right: 40, bottom: 5, left: 5 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(215 10% 55%)' }} tickLine={false} axisLine={{ stroke: 'hsl(215 19% 16%)' }} tickFormatter={v => `$${v}M`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'hsl(210 20% 85%)', fontWeight: 500 }} tickLine={false} axisLine={false} width={55} />
                <Tooltip content={<BridgeTooltip />} cursor={{ fill: 'rgba(123, 97, 255, 0.06)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={22}>
                  {bridgedAssets.map((_, i) => <Cell key={i} fill={barColors[i]} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <div>
          <h3 className="text-base font-bold mb-3 tracking-wide" style={{ fontFamily: 'var(--font-display)', color: primary }}>Ecosystem Protocols</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {protocols.map(p => (
              <div key={p.name} className="rounded-xl border relative overflow-hidden transition-colors"
                style={{ background: bg, borderColor: border }}
                data-testid={`protocol-${p.name.toLowerCase()}`}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-sm font-semibold" style={{ color: primary }}>{p.name}</span>
                  </div>
                  <span className="inline-flex text-[10px] font-medium px-2 py-0.5 rounded-md mb-2"
                    style={{ background: 'hsl(36 22% 80%)', color: primary, border: `1px solid ${border}` }}>
                    {p.type}
                  </span>
                  {p.tvl && <p className="text-xs tabular-nums mt-1" style={{ color: muted }}>{p.tvl}</p>}
                  {p.detail && <p className="text-[11px] mt-0.5" style={{ color: muted }}>{p.detail}</p>}
                </div>
                <div className="absolute top-0 left-0 w-[2px] h-full" style={{ backgroundColor: p.color, opacity: 0.5 }} />
              </div>
            ))}
          </div>
        </div>

        <SectionCard title="Ecosystem Map" subtitle="Key projects and relationships on Ink">
          <div style={{ height: 700, margin: '-1rem' }}>
            <EcosystemMap embedded={true} />
          </div>
        </SectionCard>

        <SectionCard title="Growth Milestones" subtitle="Key events in Ink's development">
          <div className="relative pl-6">
            <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#7B61FF] via-[#7B61FF]/50 to-transparent" />
            <div className="space-y-5">
              {milestones.map((m, i) => (
                <div key={i} className="relative flex gap-4">
                  <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: m.highlight ? '#7B61FF' : 'hsl(33 25% 58%)', background: m.highlight ? '#7B61FF' : 'hsl(38 30% 84%)' }} />
                  <div>
                    <p className="text-[11px] font-semibold tabular-nums" style={{ color: 'hsl(215 10% 50%)', fontFamily: 'var(--font-serif)' }}>{m.date}</p>
                    <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: m.highlight ? primary : 'hsl(28 30% 30%)' }}>{m.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: muted, fontFamily: 'var(--font-serif)' }}>{m.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <p className="text-[10px] text-center pb-4 pt-2" style={{ color: muted }}>
          Bubble size = composite score · Kraken Watch is independent research
        </p>
      </div>
    </>
  );
}
