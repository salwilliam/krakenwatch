import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';

const primary = 'hsl(28 40% 14%)';
const muted = 'hsl(30 20% 40%)';
const accent = 'hsl(350 50% 32%)';
const cardBg = 'hsl(38 40% 90%)';
const cardBorder = 'hsl(33 35% 60%)';
const sectionBg = 'hsl(33 28% 82%)';
const darkHeaderBg = 'hsl(30 30% 24%)';
const darkHeaderBorder = 'hsl(30 25% 32%)';
const darkHeaderText = 'hsl(38 50% 78%)';
const bg = 'hsl(38 38% 93%)';
const border = 'hsl(33 28% 70%)';

const CAT_BADGE = {
  DEX:      { bg: 'hsl(270 35% 88%)', fg: 'hsl(270 40% 35%)' },
  Bridge:   { bg: 'hsl(180 38% 84%)', fg: 'hsl(180 50% 26%)' },
  Lending:  { bg: 'hsl(220 45% 88%)', fg: 'hsl(220 50% 35%)' },
  Wallet:   { bg: 'hsl(35 55% 86%)',  fg: 'hsl(35 50% 28%)' },
  Exchange: { bg: 'hsl(150 38% 84%)', fg: 'hsl(150 48% 26%)' },
  DCA:      { bg: 'hsl(50 50% 85%)',  fg: 'hsl(50 45% 26%)' },
  Explorer: { bg: 'hsl(0 0% 87%)',    fg: 'hsl(0 0% 30%)' },
};

const kpis = [
  { label: 'Total Value Locked', value: '$536.48M', sublabel: 'L2Beat TVS',  delta: '+488.5%', positive: true },
  { label: 'Bridged TVL',        value: '$829.94M', sublabel: 'Cross-chain', delta: null,      positive: true },
  { label: 'Total Transactions', value: '251.5M',   sublabel: 'All-time',    delta: null,      positive: true },
  { label: 'Total Addresses',    value: '8.35M',    sublabel: 'Unique',      delta: null,      positive: true },
  { label: 'Daily Transactions', value: '447,821',  sublabel: '24h avg',     delta: '+12.3%',  positive: true },
];

function CategoryBadge({ category }) {
  const s = CAT_BADGE[category] || { bg: sectionBg, fg: muted };
  return (
    <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
      style={{ background: s.bg, color: s.fg, fontFamily: 'var(--font-display)' }}>
      {category}
    </span>
  );
}

function SlideOutPanel({ app, onClose }) {
  const panelRef = useRef(null);
  const { steps, url: directUrl } = app.action;
  const finalStep = steps?.find(s => s.url);
  const ctaUrl = finalStep?.url || directUrl;

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: 'rgba(20, 15, 10, 0.55)' }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={panelRef}
        className="relative flex flex-col w-full max-w-sm h-full overflow-y-auto"
        style={{ background: cardBg, borderLeft: `2px solid ${cardBorder}`, boxShadow: '-4px 0 24px rgba(0,0,0,0.18)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 sticky top-0 z-10"
          style={{ background: darkHeaderBg, borderBottom: `1px solid ${darkHeaderBorder}` }}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'hsl(38 40% 55%)', fontFamily: 'var(--font-display)' }}>
              How to use
            </p>
            <p className="text-base font-bold" style={{ fontFamily: 'var(--font-display)', color: darkHeaderText }}>
              {app.name}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="mt-0.5 flex items-center justify-center w-7 h-7 rounded transition-opacity hover:opacity-70 shrink-0"
            style={{ color: 'hsl(38 40% 60%)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Steps */}
        <div className="flex-1 px-5 py-5 space-y-5">
          {steps?.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: accent, color: 'hsl(38 60% 92%)', fontFamily: 'var(--font-display)' }}>
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: primary }}>{s.step}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: muted, fontFamily: 'var(--font-serif)' }}>{s.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {ctaUrl && (
          <div className="px-5 pb-6 pt-2" style={{ borderTop: `1px solid ${cardBorder}` }}>
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm font-bold px-4 py-3 rounded-lg transition-opacity hover:opacity-85"
              style={{ background: darkHeaderBg, color: darkHeaderText, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textDecoration: 'none' }}
            >
              Go to {app.name} ↗
            </a>
            <p className="text-[10px] text-center mt-2" style={{ color: muted, fontStyle: 'italic' }}>
              Opens in a new tab · Kraken Watch is not affiliated with {app.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AppCard({ app, onAction }) {
  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
      <div className="px-4 pt-3.5 pb-3 flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <CategoryBadge category={app.category} />
          <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: primary }}>{app.name}</span>
        </div>
        <p className="text-xs leading-relaxed mb-2" style={{ fontFamily: 'var(--font-serif)', color: primary, opacity: 0.85 }}>
          {app.description}
        </p>
        {app.context_note && app.context_note !== 'placeholder — to be filled by site owner' && (
          <p className="text-[10px] leading-snug" style={{ color: muted, fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
            {app.context_note}
          </p>
        )}
      </div>
      <div className="px-4 pb-3.5 pt-1" style={{ borderTop: `1px solid hsl(33 28% 78%)` }}>
        <button
          onClick={() => onAction(app)}
          className="w-full text-xs font-bold px-3 py-2 rounded-lg transition-opacity hover:opacity-85"
          style={{ background: darkHeaderBg, color: darkHeaderText, fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
        >
          {app.action.label}
          {app.action.type === 'link' ? ' ↗' : ' →'}
        </button>
      </div>
    </div>
  );
}

function FilterTabs({ categories, active, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors"
          style={{
            fontFamily: 'var(--font-display)',
            background: active === cat ? darkHeaderBg : sectionBg,
            color: active === cat ? darkHeaderText : muted,
            border: `1px solid ${active === cat ? 'transparent' : border}`,
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default function InkL2() {
  const [apps, setApps] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [openPanel, setOpenPanel] = useState(null);

  useEffect(() => {
    fetch('/ink-apps.json')
      .then(r => r.json())
      .then(setApps)
      .catch(() => {});
  }, []);

  const categories = ['All', ...new Set(apps.map(a => a.category))];
  const filtered = activeFilter === 'All' ? apps : apps.filter(a => a.category === activeFilter);

  function handleAction(app) {
    if (app.action.type === 'link') {
      window.open(app.action.url, '_blank', 'noopener,noreferrer');
    } else {
      setOpenPanel(app);
    }
  }

  return (
    <>
      <Helmet>
        <title>Ink Ecosystem — Kraken Watch</title>
        <meta name="description" content="Explore apps, assets, and activity across the Ink onchain ecosystem. Live TVL, protocol data, and ecosystem growth metrics." />
        <link rel="canonical" href="https://krakenwatch.com/ink" />
        <meta property="og:title" content="Ink Ecosystem — Kraken Watch" />
        <meta property="og:description" content="Explore apps, assets, and activity across the Ink onchain ecosystem." />
        <meta property="og:url" content="https://krakenwatch.com/ink" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ink Ecosystem — Kraken Watch" />
        <meta name="twitter:description" content="Explore apps, assets, and activity across the Ink onchain ecosystem. Live TVL, protocol data, and ecosystem growth metrics." />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-5 max-w-[900px] mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <img src="/stamp-squid.png" alt="Ink" className="object-contain" style={{ width: '100px', height: '100px' }} />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: primary }}>
            Ink Ecosystem
          </h1>
          <p className="text-sm max-w-md" style={{ fontFamily: 'var(--font-serif)', color: muted }}>
            Scour the onchain frontier for Ink dapps, data, and plunder.
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full mt-1"
            style={{ background: sectionBg, border: `1px solid ${cardBorder}`, color: muted, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            ↻ Data updates daily
          </span>
        </div>

        {/* ── KPI Strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpis.map(kpi => (
            <div key={kpi.label} className="rounded-lg p-4 relative overflow-hidden"
              style={{ background: bg, border: `1px solid ${border}` }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-display)', color: muted }}>
                {kpi.label}
              </p>
              <p className="text-xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: primary }}>
                {kpi.value}
              </p>
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

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
          <span style={{ color: 'hsl(30 30% 55%)', fontSize: '1.1rem' }}>⚓</span>
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
        </div>

        {/* ── App Directory ── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)', color: primary }}>App Directory</h2>
              <p className="text-[11px]" style={{ color: muted, fontFamily: 'var(--font-serif)' }}>
                {apps.length} vetted apps · click an action to get started
              </p>
            </div>
          </div>

          {apps.length > 0 && (
            <>
              <FilterTabs categories={categories} active={activeFilter} onChange={setActiveFilter} />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map(app => (
                  <AppCard key={app.id} app={app} onAction={handleAction} />
                ))}
                {filtered.length === 0 && (
                  <p className="col-span-2 text-sm text-center py-8" style={{ color: muted }}>No apps in this category yet.</p>
                )}
              </div>
            </>
          )}

          {apps.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm" style={{ color: muted, fontFamily: 'var(--font-serif)' }}>Loading app directory…</p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <p className="text-[10px] text-center pb-4 pt-2" style={{ color: muted }}>
          Kraken Watch is independent research, not affiliated with Kraken or Payward. App listings are curated for action-readiness; nothing executes on-site.
        </p>

      </div>

      {openPanel && <SlideOutPanel app={openPanel} onClose={() => setOpenPanel(null)} />}
    </>
  );
}
