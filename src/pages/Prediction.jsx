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

function normalizePct(raw) {
  const n = parseFloat(raw);
  if (isNaN(n)) return null;
  return n <= 1 ? Math.round(n * 1000) / 10 : n;
}

function MarketCard({ name, pct, sources, href, note, subRows }) {
  const pctNum = normalizePct(pct);
  const barWidth = Math.min(100, Math.max(0, pctNum ?? 0));
  const displayPct = pctNum != null ? pctNum : null;
  const srcs = Array.isArray(sources) ? sources : [sources].filter(Boolean);

  const inner = (
    <div className="rounded-xl overflow-hidden flex flex-col h-full" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
      <div className="px-4 pt-3.5 pb-2 flex items-start justify-between gap-3">
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
        <p className="text-[9px] mt-1.5" style={{ color: ut }}>updated daily{href ? ' · click to view market ↗' : ''}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full transition-opacity hover:opacity-90" style={{ textDecoration: 'none' }}>
      {inner}
    </a>
  ) : inner;
}

function SectionDivider({ title }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="flex-1 h-px" style={{ background: 'hsl(30 25% 72%)' }} />
      <span className="text-[10px] font-bold uppercase tracking-widest px-1" style={{ fontFamily: 'var(--font-display)', color: muted }}>
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: 'hsl(30 25% 72%)' }} />
    </div>
  );
}

const priceSourceRows = [
  { key: 'hiive',  label: 'Hiive',            href: 'https://www.hiive.com/securities/kraken-stock',             field: 'hiive_pps',  note: 'weighted avg' },
  { key: 'forge',  label: 'Forge Global',      href: 'https://forgeglobal.com/kraken_stock/',                    field: 'forge_pps',  note: 'Forge Price™' },
  { key: 'npm',    label: 'Nasdaq Private Mkt', href: 'https://www.nasdaqprivatemarket.com/company/kraken/',      field: 'npm_pps',    note: 'Tape D™' },
  { key: 'notice', label: 'Notice',            href: 'https://notice.co/c/kraken',                               field: 'notice_pps', note: 'algorithmic' },
];

function SecondaryMarketModule({ sm }) {
  return (
    <div className="rounded-xl overflow-hidden w-full" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
      <div className="px-5 py-3 flex items-center gap-3" style={{ background: darkHeaderBg, borderBottom: `1px solid ${darkHeaderBorder}` }}>
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(38 55% 72%)' }}>
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        <span className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)', color: darkHeaderText }}>Private Market Share Price</span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-display)', color: ut }}>
              Secondary Market Fair Value<MethodologyTooltip />
            </p>
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
                Prices are indicative secondary market data, not official valuations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Prediction() {
  const { data } = useSiteData();
  const sm = data?.secondary_market;
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
        <meta name="description" content="Track prediction market data and key signals across crypto, macro, and global events. Daily Kraken IPO odds, INK token forecasts, and secondary market pricing." />
        <link rel="canonical" href="https://krakenwatch.com/prediction" />
        <meta property="og:title" content="Prediction Watch — Kraken Watch" />
        <meta property="og:description" content="Track prediction market data and key signals across crypto, macro, and global events." />
        <meta property="og:url" content="https://krakenwatch.com/prediction" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prediction Watch — Kraken Watch" />
        <meta name="twitter:description" content="Track prediction market data and key signals across crypto, macro, and global events. Daily Kraken IPO odds, INK token forecasts, and secondary market pricing." />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-5 max-w-[900px] mx-auto">

        {/* ── Header ── */}
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

        {/* ── Private Market Prices ── */}
        <SecondaryMarketModule sm={sm} />

        {/* ── IPO Prediction Markets ── */}
        <SectionDivider title="IPO Prediction Markets" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>

        {/* ── Underwriter Watch ── */}
        <SectionDivider title="Underwriter Watch" />
        <p className="text-[11px] -mt-2" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>
          Which bank leads the Kraken IPO? Markets are not mutually exclusive.
        </p>

        {pm?.underwriters?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pm.underwriters.map(u => (
              <MarketCard
                key={u.ticker}
                name={`${u.bank} leads Kraken IPO`}
                pct={u.pct}
                sources="Kalshi"
                href="https://kalshi.com/markets/kxkrakenbankpublic/kraken-ipo/kxkrakenbankpublic-27jan01"
              />
            ))}
          </div>
        )}

        {/* ── INK Token FDV ── */}
        <SectionDivider title="INK Token FDV" />
        <p className="text-[11px] -mt-2" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>
          Polymarket — implied probability one day after token launch
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'INK FDV above $250M', field: 'above_250m_pct' },
            { label: 'INK FDV above $500M', field: 'above_500m_pct' },
            { label: 'INK FDV above $1B',   field: 'above_1b_pct' },
            { label: 'INK FDV above $2B',   field: 'above_2b_pct' },
          ].map(({ label, field }) => (
            <MarketCard
              key={field}
              name={label}
              pct={pm?.ink_fdv?.[field]}
              sources="Polymarket"
              href="https://polymarket.com/event/ink-fdv-above-one-day-after-launch"
            />
          ))}
        </div>

        {/* ── Regulatory ── */}
        <SectionDivider title="Regulatory" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>

        {/* ── Footer ── */}
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
