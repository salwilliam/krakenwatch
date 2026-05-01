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

function ModuleShell({ number, title, children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '2px solid hsl(33 35% 60%)', background: 'hsl(38 40% 90%)' }}>
      <div className="px-4 py-3 flex items-center gap-2 flex-wrap"
        style={{ background: 'hsl(33 28% 82%)', borderBottom: '1px solid hsl(33 25% 70%)' }}>
        <span className="text-[11px] font-bold tabular-nums w-6 h-6 flex items-center justify-center rounded-full shrink-0"
          style={{ background: on, color: 'hsl(38 60% 92%)', fontFamily: 'var(--font-display)' }}>
          {number}
        </span>
        <span className="text-sm font-bold tracking-wide flex-1"
          style={{ fontFamily: 'var(--font-display)', color: qp }}>{title}</span>
      </div>
      <div className="px-4 py-4">
        {children}
      </div>
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
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide"
            style={{ fontFamily: 'var(--font-display)', color: qp }}>
            Experimental
          </h1>
          <p className="text-sm max-w-lg" style={{ fontFamily: 'var(--font-serif)', color: qp, opacity: 0.7 }}>
            Greenhorn modules, still gettin' their sea legs.
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

        {/* ── MODULE 1 ── */}
        <ModuleShell number="1" title="Key Metrics Overview">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'IPO Odds',      value: ipo?.avg_pct != null ? `${ipo.avg_pct}%` : '—',            sub: 'avg. implied · 2026' },
              { label: 'Share Price',   value: sm?.avg_pps  != null ? `$${sm.avg_pps.toFixed(2)}` : '—', sub: 'secondary avg · 4 venues' },
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

        {/* ── MODULE 2 ── */}
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

        {/* ── MODULE 3 ── */}
        <ModuleShell number="3" title="Prediction Markets — Regulatory">
          <p className="text-[10px] font-semibold uppercase tracking-widest pb-1" style={{ color: ut }}>Regulatory</p>
          <PredRow label="Clarity Act signed into law in 2026"
            pct={pm?.regulatory?.clarity_act_pct}
            src="Polymarket"
            href="https://polymarket.com/event/clarity-act-signed-into-law-in-2026" />
          <PredRow label="Crypto market structure bill before Aug 1, 2026"
            pct={pm?.regulatory?.crypto_structure_aug_pct}
            src="Kalshi"
            href="https://kalshi.com/markets/kxcryptostructure/crypto-market-structure/kxcryptostructure-26jan" />
        </ModuleShell>

        {/* ── MODULE 4 ── */}
        <ModuleShell number="4" title="Underwriter Watch">
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

        {/* ── MODULE 5 ── */}
        <ModuleShell number="5" title="Secondary Market Pricing">
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

        {/* ── MODULE 6 ── */}
        <ModuleShell number="6" title="Ink Chain Metrics">
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
        </ModuleShell>

        {/* ── MODULE 7 ── */}
        <ModuleShell number="7" title="INK Token FDV Prediction Markets">
          <p className="text-[10px] font-semibold uppercase tracking-widest pb-0.5" style={{ color: ut }}>INK Token FDV at Launch</p>
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
                <SourceBadge src="Polymarket" />
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
        </ModuleShell>

        {/* ── MODULE 8 ── */}
        <ModuleShell number="8" title="About Ink">
          <p className="text-sm leading-relaxed mb-3" style={{ fontFamily: 'var(--font-serif)', color: qp }}>
            Ink is Kraken's Ethereum L2 chain, built on the OP Stack. It launched in November 2024 and is designed to bring Kraken's crypto exchange users on-chain, enabling DeFi, NFTs, and native crypto applications.
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
