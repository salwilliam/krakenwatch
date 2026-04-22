import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';

const qp = 'hsl(28 40% 14%)';
const ut = 'hsl(30 20% 38%)';
const on = 'hsl(350 55% 32%)';
const cardStyle = { border: '2px solid hsl(33 35% 60%)', background: 'hsl(38 40% 90%)' };

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

export default function InkMarkets({ onNav }) {
  const { data } = useSiteData();
  const ink = data?.ink;
  const pm = data?.prediction_markets;
  const updated = data?.updated_display || 'April 22, 2026';

  return (
    <>
      <Helmet>
        <title>Ink Markets — Kraken Watch</title>
        <meta name="description" content="Ink L2 live TVL, protocol count, and INK token FDV prediction markets. Kraken's OP Stack chain." />
        <link rel="canonical" href="https://krakenwatch.com/ink" />
        <meta property="og:title" content="Ink Markets — Kraken Watch" />
        <meta property="og:description" content="Ink L2 live TVL, protocol count, and INK token FDV prediction markets." />
        <meta property="og:url" content="https://krakenwatch.com/ink" />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-6 max-w-[900px] mx-auto">

        {/* Hero */}
        <div className="flex justify-center pt-2">
          <img src="/ink-binnacle-seal.png" alt="Ink L2" className="object-contain" style={{ width: '90px', height: '90px' }} />
        </div>
        <div className="text-center flex flex-col items-center gap-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
            Ink <span className="fancy-accent">Markets</span>
          </h1>
          <p className="text-sm" style={{ fontFamily: 'var(--font-serif)', color: qp, opacity: 0.7 }}>
            Kraken's OP Stack L2 · live metrics
          </p>
        </div>

        {/* Chain metrics */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Value Locked', value: ink?.tvl_millions != null ? `$${ink.tvl_millions}M` : '—', sub: 'source: DeFiLlama' },
            { label: 'Live Protocols',     value: ink?.protocol_count != null ? `${ink.protocol_count}` : '—', sub: 'source: DeFiLlama' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="rounded-lg p-4 flex flex-col gap-1" style={cardStyle}>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)', color: ut }}>{label}</p>
              <p className="text-3xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: on }}>{value}</p>
              <p className="text-[10px]" style={{ color: ut, fontStyle: 'italic' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* INK FDV Prediction Markets */}
        <div className="rounded-xl overflow-hidden" style={{ border: '2px solid hsl(33 35% 60%)', background: 'hsl(38 40% 90%)' }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: 'hsl(33 28% 82%)', borderBottom: '1px solid hsl(33 25% 70%)' }}>
            <span className="text-base font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>⚓ Prediction Markets</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: 'hsl(120 30% 85%)', color: 'hsl(120 35% 30%)' }}>LIVE</span>
          </div>

          <div className="px-4 pt-2 pb-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest pt-2 pb-0.5" style={{ color: ut }}>INK Token FDV at Launch</p>
            <p className="text-[11px] mb-3" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>
              Polymarket — FDV one day after token launch
            </p>

            {[
              { label: 'FDV above $250M', pct: pm?.ink_fdv?.above_250m_pct },
              { label: 'FDV above $500M', pct: pm?.ink_fdv?.above_500m_pct },
              { label: 'FDV above $1B',   pct: pm?.ink_fdv?.above_1b_pct },
              { label: 'FDV above $2B',   pct: pm?.ink_fdv?.above_2b_pct },
            ].map(({ label, pct }) => (
              <div key={label} className="flex flex-col gap-1 py-2 border-b last:border-b-0" style={{ borderColor: 'hsl(33 25% 78%)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: 'hsl(270 35% 88%)', color: 'hsl(270 40% 35%)', fontFamily: 'var(--font-display)' }}>
                    Polymarket
                  </span>
                  <a href="https://polymarket.com/event/ink-fdv-above-one-day-after-launch" target="_blank" rel="noopener noreferrer"
                    className="text-xs hover:underline" style={{ color: qp, fontFamily: 'var(--font-serif)' }}>
                    {label}
                  </a>
                </div>
                <PctBar pct={pct} />
              </div>
            ))}

            <p className="text-[10px] mt-3" style={{ color: ut }}>
              Markets resolve based on the fully-diluted valuation of INK token one day after public launch.
            </p>
          </div>
        </div>

        {/* About Ink */}
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-display)', color: ut }}>About Ink</p>
          <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: qp }}>
            Ink is Kraken's Ethereum L2 chain, built on the OP Stack. It launched in November 2024 and is designed to bring Kraken's crypto exchange users on-chain, enabling DeFi, NFTs, and native crypto applications.
          </p>
          <div className="flex gap-3 mt-3 flex-wrap">
            {[
              { label: 'Explorer', href: 'https://explorer.inkonchain.com' },
              { label: 'Bridge', href: 'https://inkonchain.com/bridge' },
              { label: 'Ecosystem', href: 'https://inkonchain.com/ecosystem' },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="text-xs font-semibold px-3 py-1 rounded transition-opacity hover:opacity-75"
                style={{ background: 'hsl(33 35% 82%)', color: qp, fontFamily: 'var(--font-display)' }}>
                {label} →
              </a>
            ))}
          </div>
        </div>

        {/* Kraken Map cross-link */}
        <div className="rounded-xl p-4 flex items-start gap-4" style={cardStyle}>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-display)', color: ut }}>Kraken Map</p>
            <p className="text-sm" style={{ fontFamily: 'var(--font-serif)', color: qp }}>
              IPO odds, secondary share pricing, prediction markets for the Kraken/Payward IPO and regulatory milestones.
            </p>
          </div>
          <button onClick={() => onNav && onNav('kraken')}
            className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ fontFamily: 'var(--font-display)', background: qp, color: 'hsl(38 60% 88%)' }}>
            Kraken Map →
          </button>
        </div>

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
