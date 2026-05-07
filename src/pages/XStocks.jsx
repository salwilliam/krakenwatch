import { Helmet } from 'react-helmet-async';
import moduleData from '../data/xstocks-modules.json';

const primary = 'hsl(28 40% 14%)';
const muted = 'hsl(30 20% 40%)';
const accent = 'hsl(350 50% 32%)';
const cardBg = 'hsl(38 40% 90%)';
const cardBorder = 'hsl(33 35% 60%)';
const sectionBg = 'hsl(33 28% 82%)';
const darkHeaderBg = 'hsl(30 30% 24%)';
const darkHeaderBorder = 'hsl(30 25% 32%)';
const darkHeaderText = 'hsl(38 50% 78%)';

const ACTION_BADGE = {
  Monitor: { bg: sectionBg,             fg: muted },
  Trade:   { bg: 'hsl(38 55% 85%)',     fg: 'hsl(35 50% 28%)' },
  Enter:   { bg: 'hsl(150 38% 84%)',    fg: 'hsl(150 48% 26%)' },
  Explore: { bg: 'hsl(270 35% 88%)',    fg: 'hsl(270 40% 35%)' },
};

function ActionBadge({ action }) {
  const s = ACTION_BADGE[action] || ACTION_BADGE.Monitor;
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0"
      style={{ background: s.bg, color: s.fg, fontFamily: 'var(--font-display)' }}
    >
      {action}
    </span>
  );
}

function SignalModule({ mod }) {
  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
      <div
        className="flex items-center justify-between gap-2 px-4 pt-3 pb-2.5"
        style={{ background: darkHeaderBg, borderBottom: `1px solid ${darkHeaderBorder}` }}
      >
        <p className="text-sm font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: darkHeaderText }}>
          {mod.title}
        </p>
        <ActionBadge action={mod.action} />
      </div>

      <div className="px-4 pt-3 pb-2 flex-1">
        <ul className="space-y-1.5">
          {mod.data.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: primary, fontFamily: 'var(--font-display)' }}>
              <span className="shrink-0 mt-px" style={{ color: accent }}>›</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-4 pb-4 pt-2" style={{ borderTop: `1px solid hsl(33 28% 78%)` }}>
        <p className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: muted, fontStyle: 'italic' }}>
          {mod.insight}
        </p>
      </div>
    </div>
  );
}

export default function XStocks() {
  const { lastUpdated, modules } = moduleData;
  const updatedDisplay = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <>
      <Helmet>
        <title>xStocks Signal Board — Kraken Watch</title>
        <meta name="description" content="Track tokenized equity signals across Kraken and partner venues. Volume, momentum, venue distribution, and narrative signals for xStocks." />
        <link rel="canonical" href="https://krakenwatch.com/xstocks" />
        <meta property="og:title" content="xStocks Signal Board — Kraken Watch" />
        <meta property="og:description" content="Track tokenized equity signals across Kraken and partner venues." />
        <meta property="og:url" content="https://krakenwatch.com/xstocks" />
        <meta property="og:image" content="https://krakenwatch.com/xstocks-bnb-hero.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="xStocks Signal Board — Kraken Watch" />
        <meta name="twitter:description" content="Track tokenized equity signals across Kraken and partner venues." />
        <meta name="twitter:image" content="https://krakenwatch.com/xstocks-bnb-hero.png" />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-5 max-w-[1100px] mx-auto">

        {/* ── Hero Image ── */}
        <div className="w-full rounded-xl overflow-hidden shadow-lg border-2" style={{ borderColor: 'hsl(30 30% 60%)' }}>
          <img src="/xstocks-bnb-hero.png" alt="xStocks Signal Board" className="w-full object-cover" />
        </div>

        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: primary }}>
            xStocks Signal Board
          </h1>
          <p className="text-sm max-w-md" style={{ fontFamily: 'var(--font-serif)', color: muted }}>
            Track tokenized equity signals across Kraken and partner venues.
          </p>
          {updatedDisplay && (
            <span
              className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full mt-1"
              style={{ background: sectionBg, border: `1px solid ${cardBorder}`, color: muted, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
            >
              Updated {updatedDisplay}
            </span>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
          <span style={{ color: 'hsl(30 30% 55%)', fontSize: '1.1rem' }}>◈</span>
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
        </div>

        {/* ── Signal Modules Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map(mod => (
            <SignalModule key={mod.id} mod={mod} />
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-center pb-2">
          <img src="/stamp-ship.png" alt="xStocks" className="object-contain" style={{ width: '100px', height: '100px' }} />
        </div>
        <p className="text-[10px] text-center pb-4 pt-2" style={{ color: muted }}>
          Kraken Watch is independent research, not affiliated with Kraken or Payward. Signal data is manually curated and updated periodically.
        </p>

      </div>
    </>
  );
}
