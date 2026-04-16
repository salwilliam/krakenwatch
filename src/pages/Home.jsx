import { useSiteData } from '../hooks/useSiteData';

// Exact color constants from the live bundle
const qp = 'hsl(28 40% 14%)';   // foreground dark brown
const ut = 'hsl(30 20% 38%)';   // muted label color  
const on = 'hsl(350 55% 32%)';  // crimson value color

function Footer({ extra }) {
  const { data } = useSiteData();
  const updated = data?.updated_display || 'April 10, 2026';
  return (
    <p className="text-[10px] text-center pb-4 pt-2" style={{ color: ut }}>
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded mr-1"
        style={{ background: 'hsl(33 28% 82%)', border: '1px solid hsl(33 25% 70%)' }}
      >
        ↻ Updated daily · {updated}
      </span>
      {extra && <>{extra} · </>}
      Kraken Watch is independent research, not affiliated with Kraken or Payward
    </p>
  );
}

export default function Home({ onNav }) {
  const { data } = useSiteData();
  const sm = data?.secondary_market;
  const ipo = data?.ipo;
  const ink = data?.ink;

  const cardStyle = {
    border: '2px solid hsl(33 35% 60%)',
    background: 'hsl(38 40% 90%)',
  };

  return (
    <div className="p-6 space-y-6 max-w-[900px] mx-auto">
      {/* Ship stamp */}
      <div className="flex justify-center">
        <img src="/stamp-ship.png" alt="Ship" className="object-contain" style={{ width: '100px', height: '100px' }} />
      </div>

      {/* Title */}
      <div className="text-center flex flex-col items-center gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
          Starboard ho!
        </h1>
        <p className="text-sm" style={{ fontFamily: 'var(--font-serif)', color: qp, opacity: 0.7 }}>
          Live data · updated daily
        </p>
      </div>

      {/* 2×2 / 4-col metric grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'IPO Odds',      value: ipo?.avg_pct != null ? `${ipo.avg_pct}%` : '—',              sub: 'avg. implied · 2026' },
          { label: 'Share Price',   value: sm?.avg_pps  != null ? `$${sm.avg_pps.toFixed(2)}` : '—',   sub: 'secondary avg · 4 venues' },
          { label: 'Ink TVL',       value: ink?.tvl_millions != null ? `$${ink.tvl_millions}M` : '—',  sub: 'total value locked' },
          { label: 'Ink Protocols', value: ink?.protocol_count != null ? `${ink.protocol_count}` : '—', sub: 'live on chain' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-lg p-4 flex flex-col gap-1" style={cardStyle}>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)', color: ut }}>
              {label}
            </p>
            <p className="text-3xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: on }}>
              {value}
            </p>
            <p className="text-[10px]" style={{ color: ut, fontStyle: 'italic' }}>
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Anchor divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
        <span style={{ color: 'hsl(30 30% 55%)', fontSize: '1.1rem' }}>⚓</span>
        <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
      </div>

      {/* Explore heading */}
      <p className="text-center text-sm font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)', color: ut }}>
        Explore
      </p>

      {/* Explore cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <button
          onClick={() => onNav && onNav('ink')}
          className="rounded-xl overflow-hidden text-left transition-opacity hover:opacity-80 cursor-pointer"
          style={cardStyle}
        >
          <div className="p-4">
            <p className="text-lg font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
              Ink Starboard
            </p>
            <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-serif)', color: qp, opacity: 0.75 }}>
              TVL, protocol count, ecosystem metrics & INK token data — updated daily.
            </p>
          </div>
        </button>
        <button
          onClick={() => onNav && onNav('corporate')}
          className="rounded-xl overflow-hidden text-left transition-opacity hover:opacity-80 cursor-pointer"
          style={cardStyle}
        >
          <div className="p-4">
            <p className="text-lg font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
              Kraken Map
            </p>
            <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-serif)', color: qp, opacity: 0.75 }}>
              Secondary market pricing, IPO forecast, corporate entities, acquisitions & board data.
            </p>
          </div>
        </button>
      </div>

      <Footer />
    </div>
  );
}
