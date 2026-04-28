import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';
import MethodologyTooltip from '../components/MethodologyTooltip';

const qp = 'hsl(28 40% 14%)';
const ut = 'hsl(30 20% 38%)';
const on = 'hsl(350 55% 32%)';
const cardBg = 'hsl(38 40% 90%)';
const cardBorder = 'hsl(33 35% 60%)';
const sectionBg = 'hsl(33 28% 82%)';
const darkHeaderBg = 'hsl(30 30% 24%)';
const darkHeaderBorder = 'hsl(30 25% 32%)';
const darkHeaderText = 'hsl(38 50% 78%)';
const accent = 'hsl(350 50% 32%)';
const muted = 'hsl(30 20% 40%)';
const bg = 'hsl(38 38% 93%)';
const border = 'hsl(33 28% 70%)';

const mktCapBars = [
  { label: '$16B', pct: 38, note: 'floor' },
  { label: '$18B', pct: 31, note: '' },
  { label: '$20B', pct: 29, note: '' },
  { label: '$22B', pct: 24, note: '' },
  { label: '$24B+', pct: 25, note: 'bull' },
];

const priceSourceRows = [
  { key: 'hiive', label: 'Hiive', href: 'https://www.hiive.com/securities/kraken-stock', field: 'hiive_pps', note: 'weighted avg' },
  { key: 'forge', label: 'Forge Global', href: 'https://forgeglobal.com/kraken_stock/', field: 'forge_pps', note: 'Forge Price™' },
  { key: 'npm', label: 'Nasdaq Private Mkt', href: 'https://www.nasdaqprivatemarket.com/company/kraken/', field: 'npm_pps', note: 'Tape D™' },
  { key: 'notice', label: 'Notice', href: 'https://notice.co/c/kraken', field: 'notice_pps', note: 'algorithmic' },
];

const inkPolymarketData = [
  { threshold: 'Above $250M', prob: 0.695, volume: '$73.2K' },
  { threshold: 'Above $500M', prob: 0.525, volume: '$256.6K' },
  { threshold: 'Above $1B', prob: 0.255, volume: '$157.5K' },
  { threshold: 'Above $2B', prob: 0.09, volume: '$10.2K' },
  { threshold: 'Above $3B', prob: 0.053, volume: '$6.9K' },
];

function DataModuleCard({ title, icon, children }) {
  return (
    <div className="rounded-lg overflow-hidden w-full" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
      <div className="px-5 py-3 flex items-center gap-3" style={{ background: darkHeaderBg, borderBottom: `1px solid ${darkHeaderBorder}` }}>
        <span className="shrink-0" style={{ color: 'hsl(38 55% 72%)' }}>{icon}</span>
        <span className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)', color: darkHeaderText }}>{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function IpoForecastModule({ ipo }) {
  const avg = ipo?.avg_pct;
  const poly = ipo?.polymarket_pct;
  const kalshi = ipo?.kalshi_pct;
  return (
    <DataModuleCard title="Kraken IPO Forecast" icon={
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    }>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-display)', color: ut }}>IPO by Dec 31 2026<MethodologyTooltip /></p>
          <p className="text-5xl font-bold tabular-nums leading-none" style={{ fontFamily: 'var(--font-display)', color: on }}>
            {avg == null ? '—' : `${avg}%`}
          </p>
          <p className="text-[11px] mt-1.5" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>avg. implied probability</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <a href="https://polymarket.com/event/kraken-ipo-in-2025" target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium underline decoration-dotted" style={{ color: ut }}>Polymarket</a>
              <span className="text-sm font-bold tabular-nums" style={{ color: on }}>{poly == null ? '—' : `${poly}%`}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <a href="https://kalshi.com/markets/kxipo/ipos/kxipo-26" target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium underline decoration-dotted" style={{ color: ut }}>Kalshi</a>
              <span className="text-sm font-bold tabular-nums" style={{ color: on }}>{kalshi == null ? '—' : `${kalshi}%`}</span>
            </div>
          </div>
          <p className="text-[10px] mt-3" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Mid-market prices · updated daily</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-display)', color: ut }}>Likely Market Cap at Listing</p>
          <div className="space-y-1.5">
            {mktCapBars.map(({ label, pct, note }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs font-mono w-12 shrink-0 text-right" style={{ color: ut }}>{label}</span>
                <div className="flex-1 rounded-full overflow-hidden h-2" style={{ background: 'hsl(33 25% 76%)' }}>
                  <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: `hsl(350 ${40 + pct / 3}% ${45 - pct / 5}%)` }} />
                </div>
                <span className="text-xs tabular-nums font-semibold w-8 shrink-0" style={{ color: on }}>{pct}%</span>
                {note && <span className="text-[10px] hidden sm:inline" style={{ color: ut, fontStyle: 'italic' }}>{note}</span>}
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-2" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Polymarket market cap data · ~$20B current private valuation</p>
        </div>
      </div>
    </DataModuleCard>
  );
}

function SecondaryMarketModule({ sm }) {
  return (
    <DataModuleCard title="Private Market Share Price" icon={
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    }>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-display)', color: ut }}>Secondary Market Fair Value<MethodologyTooltip /></p>
          <p className="text-5xl font-bold tabular-nums leading-none" style={{ fontFamily: 'var(--font-display)', color: on }}>
            {sm?.avg_pps == null ? '—' : `$${sm.avg_pps.toFixed(2)}`}
          </p>
          <p className="text-[11px] mt-1.5" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>avg. across 4 secondary venues</p>
          <div className="mt-3 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-display)', color: ut }}>Est. 30D Volume<MethodologyTooltip /></p>
            <p className="text-2xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: on }}>
              {sm?.volume_30d_est_m == null ? '—' : `~$${sm.volume_30d_est_m}M`}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              {sm?.volume_note || 'Est. 30D secondary volume'}
            </p>
          </div>
          <p className="text-[10px] mt-3" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Snapshot · updated daily · not financial advice</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-display)', color: ut }}>Price by Source</p>
          <div className="space-y-2">
            {priceSourceRows.map(({ key, label, href, field, note }) => {
              const val = sm?.[field];
              return (
                <div key={key} className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-medium underline decoration-dotted" style={{ color: ut }}>{label}</a>
                    <span className="text-[10px]" style={{ color: ut, fontStyle: 'italic' }}>{note}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums" style={{ color: on }}>
                    {val == null ? '—' : `$${val.toFixed(2)}`}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-2" style={{ borderTop: '1px solid hsl(33 30% 72%)' }}>
            <p className="text-[10px]" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              Prices are indicative secondary market data, not official valuations. Volume is estimated from platform activity data and public disclosures.
            </p>
          </div>
        </div>
      </div>
    </DataModuleCard>
  );
}

function InkFdvModule() {
  return (
    <DataModuleCard title="INK Token FDV Forecast" icon={
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 7 5 10.5 5 14a7 7 0 0 0 14 0c0-3.5-3-7-7-12z"/>
        <path d="M12 14.5a2.5 2.5 0 0 1 2.5 2.5"/>
      </svg>
    }>
      <div className="flex items-center justify-end mb-4">
        <a href="https://polymarket.com/event/ink-fdv-above-one-day-after-launch" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] px-2 py-1 rounded"
          style={{ color: accent, fontFamily: 'var(--font-serif)', border: `1px solid ${border}` }}>
          Polymarket ↗
        </a>
      </div>
      <p className="text-[10px] mb-3" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
        Implied probability · one day after token launch
      </p>
      <div className="space-y-3">
        {inkPolymarketData.map(({ threshold, prob, volume }) => (
          <div key={threshold}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: qp }}>{threshold}</span>
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
    </DataModuleCard>
  );
}


export default function Prediction() {
  const { data } = useSiteData();
  const ipo = data?.ipo;
  const sm = data?.secondary_market;
  const ink = data?.ink;
  const updated = data?.updated_display || 'April 28, 2026';

  const cardStyle = {
    border: `2px solid ${cardBorder}`,
    background: cardBg,
  };

  return (
    <>
      <Helmet>
        <title>Prediction Watch — Kraken Watch</title>
        <meta name="description" content="Track prediction market data and key signals across crypto, macro, and global events. Daily Kraken IPO odds, INK token forecasts, and secondary market pricing." />
        <link rel="canonical" href="https://krakenwatch.com/prediction" />
        <meta property="og:title" content="Prediction Watch — Kraken Watch" />
        <meta property="og:description" content="Track prediction market data and key signals across crypto, macro, and global events." />
        <meta property="og:url" content="https://krakenwatch.com/prediction" />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-6 max-w-[900px] mx-auto">
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <img src="/stamp-prediction.png" alt="Prediction Watch" className="object-contain" style={{ width: '100px', height: '100px' }} />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
            Prediction Watch
          </h1>
          <p className="text-sm max-w-md" style={{ fontFamily: 'var(--font-serif)', color: ut }}>
            Spy ye forecast markets for omens of Ink and Kraken.
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full mt-1"
            style={{ background: sectionBg, border: `1px solid ${cardBorder}`, color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            ↻ Data updates daily
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
          <span style={{ color: 'hsl(30 30% 55%)', fontSize: '1.1rem' }}>⚓</span>
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
        </div>

        <IpoForecastModule ipo={ipo} />
        <SecondaryMarketModule sm={sm} />
        <InkFdvModule />

        <p className="text-[10px] text-center pb-4 pt-2" style={{ color: ut }}>
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded mr-1"
            style={{ background: 'hsl(33 28% 82%)', border: '1px solid hsl(33 25% 70%)' }}
          >
            ↻ Updated daily · {updated}
          </span>
          Kraken Watch is independent research, not affiliated with Kraken or Payward. Aggregated figures are derived from market data using Kraken Watch&apos;s proprietary method.
        </p>
      </div>
    </>
  );
}
