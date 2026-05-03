import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';
import MethodologyTooltip from '../components/MethodologyTooltip';

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

function SourceBadge({ src }) {
  const bg = src === 'Kalshi' ? 'hsl(220 45% 88%)' : 'hsl(270 35% 88%)';
  const fg = src === 'Kalshi' ? 'hsl(220 50% 35%)' : 'hsl(270 40% 35%)';
  return (
    <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
      style={{ background: bg, color: fg, fontFamily: 'var(--font-display)' }}>{src}</span>
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

export default function KrakenMap({ onNav }) {
  const { data } = useSiteData();
  const sm = data?.secondary_market;
  const ipo = data?.ipo;
  const ink = data?.ink;
  const pm = data?.prediction_markets;
  const updated = data?.updated_display || 'April 22, 2026';

  return (
    <>
      <Helmet>
        <title>Kraken Map — Kraken Watch</title>
        <meta name="description" content="Live Kraken IPO odds, prediction markets, secondary share pricing, Ink TVL, and regulatory signals — updated every 4 hours." />
        <link rel="canonical" href="https://krakenwatch.com/" />
        <meta property="og:title" content="Kraken Map — Kraken Watch" />
        <meta property="og:description" content="Live Kraken IPO odds, prediction markets, and secondary share pricing." />
        <meta property="og:url" content="https://krakenwatch.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kraken Map — Kraken Watch" />
        <meta name="twitter:description" content="Live Kraken IPO odds, prediction markets, secondary share pricing, Ink TVL, and regulatory signals — updated every 4 hours." />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-6 max-w-[900px] mx-auto">

        {/* Hero */}
        <div className="flex justify-center pt-2">
          <img src="/stamp-ship.png" alt="Kraken Map" className="object-contain" style={{ width: '90px', height: '90px' }} />
        </div>
        <div className="text-center flex flex-col items-center gap-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
            Starboard ho!
          </h1>
          <p className="text-sm" style={{ fontFamily: 'var(--font-serif)', color: qp, opacity: 0.7 }}>
            Live data · updated every 4 hours
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'IPO Odds',      value: ipo?.avg_pct != null ? `${ipo.avg_pct}%` : '—',             sub: 'avg. implied · 2026',    tooltip: true },
            { label: 'Share Price',   value: sm?.avg_pps  != null ? `$${sm.avg_pps.toFixed(2)}` : '—',  sub: 'secondary avg · 4 venues', tooltip: true },
            { label: 'Ink TVL',       value: ink?.tvl_millions != null ? `$${ink.tvl_millions}M` : '—', sub: 'total value locked' },
            { label: 'Ink Protocols', value: ink?.protocol_count != null ? `${ink.protocol_count}` : '—', sub: 'live on chain' },
          ].map(({ label, value, sub, tooltip }) => (
            <div key={label} className="rounded-lg p-4 flex flex-col gap-1" style={cardStyle}>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)', color: ut }}>{label}{tooltip && <MethodologyTooltip />}</p>
              <p className="text-3xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: on }}>{value}</p>
              <p className="text-[10px]" style={{ color: ut, fontStyle: 'italic' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Prediction Markets ── */}
        <div className="rounded-xl overflow-hidden" style={{ border: '2px solid hsl(33 35% 60%)', background: 'hsl(38 40% 90%)' }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: 'hsl(33 28% 82%)', borderBottom: '1px solid hsl(33 25% 70%)' }}>
            <span className="text-base font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>⚓ Prediction Markets</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: 'hsl(120 30% 85%)', color: 'hsl(120 35% 30%)' }}>LIVE</span>
          </div>

          <div className="px-4 pt-2 pb-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest pt-2 pb-0.5" style={{ color: ut }}>IPO Signal</p>

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

            <p className="text-[10px] font-semibold uppercase tracking-widest pt-3 pb-0.5" style={{ color: ut }}>Regulatory</p>

            <PredRow label="Clarity Act signed into law in 2026"
              pct={pm?.regulatory?.clarity_act_pct}
              src="Polymarket"
              href="https://polymarket.com/event/clarity-act-signed-into-law-in-2026" />
            <PredRow label="Crypto market structure bill before Aug 1, 2026"
              pct={pm?.regulatory?.crypto_structure_aug_pct}
              src="Kalshi"
              href="https://kalshi.com/markets/kxcryptostructure/crypto-market-structure/kxcryptostructure-26jan" />
          </div>

          {/* Underwriter watch */}
          {pm?.underwriters?.length > 0 && (
            <div className="px-4 pt-1 pb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest pt-3 pb-1" style={{ color: ut }}>Underwriter Watch</p>
              <p className="text-[10px] mb-2.5" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>
                Which bank leads the Kraken IPO? (markets are not mutually exclusive)
              </p>
              <div className="space-y-2">
                {pm.underwriters.map(u => (
                  <div key={u.ticker} className="flex items-center gap-3">
                    <span className="text-xs w-36 shrink-0" style={{ color: qp, fontFamily: 'var(--font-serif)' }}>{u.bank}</span>
                    <div className="flex-1">
                      <PctBar pct={u.pct} />
                    </div>
                  </div>
                ))}
              </div>
              <a href="https://kalshi.com/markets/kxkrakenbankpublic/kraken-ipo/kxkrakenbankpublic-27jan01"
                target="_blank" rel="noopener noreferrer"
                className="text-[10px] mt-2 inline-block hover:underline" style={{ color: ut }}>
                Source: Kalshi KXKRAKENBANKPUBLIC →
              </a>
            </div>
          )}
        </div>

        {/* Secondary market */}
        <div className="rounded-xl overflow-hidden" style={cardStyle}>
          <div className="px-4 py-3" style={{ background: 'hsl(33 28% 82%)', borderBottom: '1px solid hsl(33 25% 70%)' }}>
            <span className="text-base font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>📊 Secondary Market</span>
          </div>
          <div className="px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Hiive',        value: sm?.hiive_pps  ? `$${sm.hiive_pps}` : '—' },
              { label: 'Forge',        value: sm?.forge_pps  ? `$${sm.forge_pps}` : '—' },
              { label: 'NASDAQ PM',    value: sm?.npm_pps    ? `$${sm.npm_pps}` : '—' },
              { label: 'Notice',       value: sm?.notice_pps ? `$${sm.notice_pps}` : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)', color: ut }}>{label}</p>
                <p className="text-xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: on }}>{value}</p>
              </div>
            ))}
          </div>
          <div className="px-4 pb-3">
            <p className="text-[10px]" style={{ color: ut }}>
              Weighted avg<MethodologyTooltip />: <span className="font-bold" style={{ color: on }}>{sm?.avg_pps ? `$${sm.avg_pps}` : '—'}</span>
              {sm?.volume_30d_est_m ? ` · Est. 30D vol ~$${sm.volume_30d_est_m}M across venues` : ''}
            </p>
          </div>
        </div>

        {/* Ink Markets cross-link */}
        <div className="rounded-xl p-4 flex items-start gap-4" style={cardStyle}>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-display)', color: ut }}>Ink L2 Markets</p>
            <p className="text-sm" style={{ fontFamily: 'var(--font-serif)', color: qp }}>
              Kraken's OP Stack L2 — live TVL, protocol metrics, and INK token FDV prediction markets.
            </p>
          </div>
          <button onClick={() => onNav && onNav('ink')}
            className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ fontFamily: 'var(--font-display)', background: qp, color: 'hsl(38 60% 88%)' }}>
            Ink Markets →
          </button>
        </div>

        <p className="text-[10px] text-center pb-4 pt-2" style={{ color: ut }}>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded mr-1"
            style={{ background: 'hsl(33 28% 82%)', border: '1px solid hsl(33 25% 70%)' }}>
            ↻ Updated daily · {updated}
          </span>
          Kraken Watch is independent research, not affiliated with Kraken or Payward. Aggregated figures are derived from market data using Kraken Watch&apos;s proprietary method.
        </p>
      </div>
    </>
  );
}
