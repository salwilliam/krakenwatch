import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';

const qp = 'hsl(28 40% 14%)';
const ut = 'hsl(30 20% 38%)';
const on = 'hsl(350 55% 32%)';
const cardBg = 'hsl(38 40% 90%)';
const cardBorder = 'hsl(33 35% 60%)';
const sectionBg = 'hsl(33 28% 82%)';
const accent = 'hsl(350 50% 32%)';
const darkHeaderBg = 'hsl(30 30% 24%)';
const darkHeaderBorder = 'hsl(30 25% 32%)';
const darkHeaderText = 'hsl(38 50% 78%)';

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
  const n = parseFloat(pct);
  const w = isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(33 25% 76%)' }}>
        <div className="h-full rounded-full" style={{
          width: `${w}%`,
          background: w >= 50
            ? 'linear-gradient(to right, hsl(150 40% 40%), hsl(150 50% 30%))'
            : `linear-gradient(to right, ${accent}, hsl(25 55% 38%))`,
        }} />
      </div>
      <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: on, fontFamily: 'var(--font-display)' }}>
        {isNaN(n) ? '—' : `${n}%`}
      </span>
    </div>
  );
}

function normalizePct(raw) {
  const n = parseFloat(raw);
  if (isNaN(n)) return null;
  return n <= 1 ? Math.round(n * 1000) / 10 : n;
}

function GroupModule({ title, subtitle, ctaUrl, ctaLabel, children }) {
  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
      <div className="px-4 pt-3.5 pb-2">
        <p className="text-sm font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: qp }}>{title}</p>
        {subtitle && <p className="text-[10px] mt-0.5" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>{subtitle}</p>}
      </div>
      <div className="px-4 pb-4 flex-1">
        {children}
      </div>
      {ctaUrl && ctaLabel && (
        <div className="px-4 pb-3.5 pt-2" style={{ borderTop: `1px solid ${cardBorder}` }}>
          <a href={ctaUrl} target="_blank" rel="noopener noreferrer"
            className="block w-full text-center text-xs font-bold px-3 py-2 rounded-lg transition-opacity hover:opacity-85"
            style={{ background: darkHeaderBg, color: darkHeaderText, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textDecoration: 'none' }}>
            {ctaLabel} ↗
          </a>
        </div>
      )}
    </div>
  );
}

function MarketCard({ name, pct, sources, href, note, subRows }) {
  const pctNum = normalizePct(pct);
  const barWidth = Math.min(100, Math.max(0, pctNum ?? 0));
  const displayPct = pctNum != null ? pctNum : null;
  const srcs = Array.isArray(sources) ? sources : [sources].filter(Boolean);

  return (
    <div className="rounded-xl overflow-hidden flex flex-col h-full" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
      <div className="px-4 pt-3.5 pb-2 flex items-start justify-between gap-3 flex-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            {srcs.map(s => <SourceBadge key={s} src={s} />)}
          </div>
          <p className="text-sm font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: qp }}>
            {name}
          </p>
          {note && <p className="text-[10px] mt-1 leading-snug" style={{ color: ut, fontStyle: 'italic' }}>{note}</p>}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-3xl font-bold tabular-nums leading-none" style={{ fontFamily: 'var(--font-display)', color: on }}>
            {displayPct == null ? '—' : `${displayPct}%`}
          </p>
          {subRows && subRows.map(r => {
            const sub = normalizePct(r.pct);
            return (
              <p key={r.src} className="text-[10px] mt-0.5 tabular-nums" style={{ color: ut }}>
                {r.src} {sub != null ? `${sub}%` : '—'}
              </p>
            );
          })}
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(33 25% 76%)' }}>
          <div className="h-full rounded-full" style={{
            width: `${barWidth}%`,
            background: barWidth >= 50
              ? 'linear-gradient(to right, hsl(150 40% 40%), hsl(150 50% 30%))'
              : `linear-gradient(to right, ${accent}, hsl(25 55% 38%))`,
          }} />
        </div>
        <p className="text-[9px] mt-1.5" style={{ color: ut }}>updated every 4 hours</p>
      </div>
      {href && (
        <div className="px-4 pb-3.5 pt-2" style={{ borderTop: `1px solid ${cardBorder}` }}>
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="block w-full text-center text-xs font-bold px-3 py-2 rounded-lg transition-opacity hover:opacity-85"
            style={{ background: darkHeaderBg, color: darkHeaderText, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textDecoration: 'none' }}>
            Trade ↗
          </a>
        </div>
      )}
    </div>
  );
}

export default function Prediction() {
  const { data } = useSiteData();
  const pm = data?.prediction_markets;
  const updated = data?.updated_display || 'May 1, 2026';

  const ipoKalshi = pm?.ipo?.kalshi_pct;
  const ipoPoly   = pm?.ipo?.polymarket_pct;
  const ipoAvg    = ipoKalshi != null && ipoPoly != null
    ? Math.round((ipoKalshi + ipoPoly) / 2 * 10) / 10
    : (ipoKalshi ?? ipoPoly ?? null);

  return (
    <>
      <Helmet>
        <title>Prediction Watch — Kraken Watch</title>
        <meta name="description" content="Track prediction market data and key signals across crypto, macro, and global events. Daily Kraken IPO odds and regulatory market forecasts." />
        <link rel="canonical" href="https://krakenwatch.com/prediction" />
        <meta property="og:title" content="Prediction Watch — Kraken Watch" />
        <meta property="og:description" content="Track prediction market data and key signals across crypto, macro, and global events." />
        <meta property="og:url" content="https://krakenwatch.com/prediction" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prediction Watch — Kraken Watch" />
        <meta name="twitter:description" content="Daily Kraken IPO odds, underwriter watch, and regulatory prediction markets." />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-6 max-w-[1100px] mx-auto">

        {/* ── Hero Image ── */}
        <div className="w-full rounded-xl overflow-hidden shadow-lg border-2" style={{ borderColor: 'hsl(30 30% 60%)' }}>
          <img src="/prediction-hero.png" alt="Prediction Watch" className="w-full object-cover" />
        </div>

        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
            Prediction Watch
          </h1>
          <p className="text-sm max-w-md" style={{ fontFamily: 'var(--font-serif)', color: ut }}>
            Track forecast signals tied to Kraken and Ink.
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full mt-1"
            style={{ background: sectionBg, border: `1px solid ${cardBorder}`, color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            ↻ Updates every 4h
          </span>
        </div>

        {/* ── Flat markets grid: IPO + Regulatory only ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
          <MarketCard
            name="Kraken IPO by Dec 31, 2026"
            pct={ipoAvg}
            sources={['Kalshi', 'Polymarket']}
            href="https://polymarket.com/event/kraken-ipo-in-2025"
            subRows={[
              { src: 'Kalshi', pct: ipoKalshi },
              { src: 'Polymarket', pct: ipoPoly },
            ]}
          />
          <MarketCard
            name="IPO market cap above $16B at listing"
            pct={pm?.ipo?.mktcap_16b_pct}
            sources="Polymarket"
            href="https://polymarket.com/event/kraken-ipo-closing-market-cap-above"
          />
          <MarketCard
            name="Largest IPO of 2026 (excl. SpaceX)"
            pct={pm?.ipo?.largest_excl_spacex_pct}
            sources="Polymarket"
            href="https://polymarket.com/event/largest-ipo-by-market-cap-in-2026-287"
            note="Conditional: raw 0.5% ÷ non-SpaceX pool ~10.5%"
          />
          <MarketCard
            name="Clarity Act signed into law in 2026"
            pct={pm?.regulatory?.clarity_act_pct}
            sources="Polymarket"
            href="https://polymarket.com/event/clarity-act-signed-into-law-in-2026"
          />
          <MarketCard
            name="Crypto market structure bill by Aug 1, 2026"
            pct={pm?.regulatory?.crypto_structure_aug_pct}
            sources="Kalshi"
            href="https://kalshi.com/markets/kxcryptostructure/crypto-market-structure/kxcryptostructure-26jan"
          />

          {/* ── Underwriter Watch ── */}
          <GroupModule
            title="Underwriter Watch"
            subtitle="Not mutually exclusive · Kalshi"
            ctaUrl="https://kalshi.com/markets/kxkrakenbankpublic/kraken-ipo/kxkrakenbankpublic-27jan01"
            ctaLabel="Trade"
          >
            {pm?.underwriters?.length > 0 ? (
              <div>
                {pm.underwriters.map(u => {
                  const pctVal = normalizePct(u.pct);
                  return (
                    <a
                      key={u.ticker}
                      href="https://kalshi.com/markets/kxkrakenbankpublic/kraken-ipo/kxkrakenbankpublic-27jan01"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-2 border-b last:border-b-0 transition-opacity hover:opacity-75"
                      style={{ borderColor: 'hsl(33 25% 78%)', textDecoration: 'none' }}
                    >
                      <span className="text-xs font-semibold shrink-0 w-24" style={{ color: qp, fontFamily: 'var(--font-display)' }}>{u.bank}</span>
                      <div className="flex-1 min-w-0"><PctBar pct={pctVal} /></div>
                      <SourceBadge src="Kalshi" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>No underwriter data available.</p>
            )}
          </GroupModule>

          {/* ── INK Token FDV ── */}
          <GroupModule
            title="INK Token FDV"
            subtitle="FDV one day after token launch · Polymarket"
            ctaUrl="https://polymarket.com/event/ink-fdv-above-one-day-after-launch"
            ctaLabel="Trade"
          >
            <div>
              {[
                { label: '$250M+', field: 'above_250m_pct' },
                { label: '$500M+', field: 'above_500m_pct' },
                { label: '$1B+',   field: 'above_1b_pct' },
                { label: '$2B+',   field: 'above_2b_pct' },
              ].map(({ label, field }) => {
                const pctVal = normalizePct(pm?.ink_fdv?.[field]);
                return (
                  <a
                    key={field}
                    href="https://polymarket.com/event/ink-fdv-above-one-day-after-launch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-2 border-b last:border-b-0 transition-opacity hover:opacity-75"
                    style={{ borderColor: 'hsl(33 25% 78%)', textDecoration: 'none' }}
                  >
                    <span className="text-xs font-semibold shrink-0 w-16" style={{ color: qp, fontFamily: 'var(--font-display)' }}>{label}</span>
                    <div className="flex-1 min-w-0"><PctBar pct={pctVal} /></div>
                    <SourceBadge src="Polymarket" />
                  </a>
                );
              })}
            </div>
          </GroupModule>

        </div>

        {/* ── Footer ── */}
        <div className="flex justify-center pb-2">
          <img src="/stamp-prediction.png" alt="Prediction Watch" className="object-contain" style={{ width: '100px', height: '100px' }} />
        </div>
        <p className="text-[10px] text-center pb-4 pt-2" style={{ color: ut }}>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded mr-1"
            style={{ background: 'hsl(33 28% 82%)', border: '1px solid hsl(33 25% 70%)' }}>
            ↻ Updated daily · {updated}
          </span>
          Kraken Watch is independent research, not affiliated with Kraken or Payward. Aggregated figures derived from market data using Kraken Watch&apos;s proprietary method.
        </p>

      </div>
    </>
  );
}
