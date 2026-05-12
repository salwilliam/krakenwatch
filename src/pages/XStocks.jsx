import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';

const primary    = 'hsl(28 40% 14%)';
const muted      = 'hsl(30 20% 40%)';
const accent     = 'hsl(350 50% 32%)';
const cardBg     = 'hsl(38 40% 90%)';
const cardBorder = 'hsl(33 35% 60%)';
const sectionBg  = 'hsl(33 28% 82%)';

const SOURCE_HEADER = {
  live:      { bg: 'hsl(150 35% 22%)', border: 'hsl(150 30% 30%)', text: 'hsl(150 40% 78%)', label: 'Live' },
  estimated: { bg: 'hsl(35 45% 22%)',  border: 'hsl(35 40% 30%)',  text: 'hsl(38 50% 78%)',  label: 'Est.' },
  curated:   { bg: 'hsl(270 28% 24%)', border: 'hsl(270 25% 33%)', text: 'hsl(270 40% 80%)', label: 'Curated' },
};

const ACTION_BADGE = {
  Monitor: { bg: sectionBg,            fg: muted },
  Trade:   { bg: 'hsl(38 55% 85%)',    fg: 'hsl(35 50% 28%)' },
  Explore: { bg: 'hsl(270 35% 88%)',   fg: 'hsl(270 40% 35%)' },
};

function fmtM(v) {
  if (v == null) return '—';
  return `$${v}M`;
}

function fmtPct(v) {
  if (v == null) return '—';
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v}%`;
}

function fmtLeaders(leaders) {
  if (!leaders?.length) return ['—'];
  const top3share = leaders.slice(0, 3).reduce((s, t) => s + (t.share_pct || 0), 0);
  return [
    ...leaders.slice(0, 3).map((t, i) => `${i + 1}. ${t.symbol} — ${t.share_pct}%`),
    `Top 3 share: ${Math.round(top3share)}%`,
  ];
}

function fmtTopVolume(topVol) {
  if (!topVol?.length) return ['—'];
  return topVol.slice(0, 4).map((t, i) => {
    const chg = t.change_24h_pct != null
      ? ` (${t.change_24h_pct >= 0 ? '+' : ''}${t.change_24h_pct}%)`
      : '';
    return `${i + 1}. ${t.symbol} — $${t.vol_24h_m}M${chg}`;
  });
}

function buildModules(xs) {
  const leaders = xs?.asset_leaders ?? null;
  const topVol  = xs?.top_volume   ?? null;

  return [
    {
      id: 'xstocks-market',
      title: 'xStocks Market',
      source: 'live',
      action: 'Monitor',
      data: [
        `Market Cap: ${xs?.total_market_cap_millions != null ? '$' + xs.total_market_cap_millions + 'M' : '—'}`,
        `24h Volume: ${xs?.total_vol_24h_millions != null ? '$' + xs.total_vol_24h_millions + 'M' : '—'}`,
        `Tokens tracked: ${xs?.asset_count ?? '—'}`,
      ],
      insight: 'Aggregate market cap and 24h trading volume across tracked xStocks tokens. CoinGecko.',
    },
    {
      id: 'asset-leaders',
      title: 'Asset Leaders',
      source: leaders ? 'live' : 'estimated',
      action: 'Trade',
      data: leaders ? fmtLeaders(leaders) : ['1. AAPLx — ~31%', '2. GOOGLx — ~18%', '3. TSLAx — ~12%', 'Top 3 share: ~61%'],
      insight: leaders
        ? 'Ranked by market cap share across tracked xStocks tokens. CoinGecko.'
        : 'Extrapolated from global retail equity popularity.',
    },
    {
      id: 'volume-leaders',
      title: 'Volume Leaders',
      source: topVol ? 'live' : 'estimated',
      action: 'Trade',
      data: topVol ? fmtTopVolume(topVol) : ['—'],
      insight: topVol
        ? '24h trading volume across all venues. CoinGecko aggregated market data.'
        : 'Volume data loading.',
    },
    {
      id: 'ink-dex',
      title: 'Ink DEX Volume',
      source: 'live',
      action: 'Monitor',
      data: [
        `24h Volume: ${fmtM(xs?.ink_dex_24h_millions)}`,
        `7d Volume: ${fmtM(xs?.ink_dex_7d_millions)}`,
        `30d Volume: ${fmtM(xs?.ink_dex_30d_millions)}`,
      ],
      insight: 'All DEX activity across Ink L2, the settlement layer for xStocks and onchain RWA trading.',
    },
    {
      id: 'venue-distribution',
      title: 'Venue Distribution',
      source: 'estimated',
      action: 'Trade',
      data: [
        'Kraken — ~68%',
        'Ink L2 — ~19%',
        'Other venues — ~13%',
      ],
      insight: 'Based on Kraken as the original xStocks launch venue and Ink L2 as a newer integration.',
    },
    {
      id: 'narrative',
      title: 'Narrative Signals',
      source: 'curated',
      action: 'Explore',
      data: [
        'CF Benchmarks launched xStocks reference indices',
        'xStocks live on BNB Chain via PancakeSwap',
        'Otomate integrated xStocks on Ink L2',
      ],
      insight: 'Manually curated signals on xStocks ecosystem developments and adoption milestones.',
    },
  ];
}

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
  const h = SOURCE_HEADER[mod.source] || SOURCE_HEADER.curated;
  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
      <div
        className="flex items-center justify-between gap-2 px-4 pt-3 pb-2.5"
        style={{ background: h.bg, borderBottom: `1px solid ${h.border}` }}
      >
        <p className="text-sm font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: h.text }}>
          {mod.title}
        </p>
        <ActionBadge action={mod.action} />
      </div>

      <div className="px-4 pt-3 pb-2 flex-1">
        <ul className="space-y-1.5">
          {mod.data.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: primary, fontFamily: 'var(--font-sans)' }}>
              <span className="shrink-0 mt-px" style={{ color: accent }}>›</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-4 pb-4 pt-2" style={{ borderTop: `1px solid hsl(33 28% 78%)` }}>
        <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans)', color: muted, fontStyle: 'italic' }}>
          {mod.insight}
        </p>
      </div>
    </div>
  );
}

function SkeletonModule() {
  return (
    <div className="rounded-xl overflow-hidden flex flex-col animate-pulse" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
      <div className="h-10 px-4" style={{ background: SOURCE_HEADER.live.bg }} />
      <div className="px-4 pt-3 pb-2 flex-1 space-y-2">
        {[1,2,3].map(i => <div key={i} className="h-4 rounded" style={{ background: sectionBg }} />)}
      </div>
      <div className="px-4 pb-4 pt-2">
        <div className="h-3 rounded w-3/4" style={{ background: sectionBg }} />
      </div>
    </div>
  );
}

export default function XStocks() {
  const { data, loading } = useSiteData();
  const xs = data?.xstocks ?? null;
  const modules = buildModules(xs);

  const updatedDisplay = xs?.last_refreshed
    ? new Date(xs.last_refreshed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : data?.updated_display ?? null;

  return (
    <>
      <Helmet>
        <title>xStocks Helm — Kraken Watch</title>
        <meta name="description" content="Track signals across the tokenized equity ecosystem. Volume, momentum, and narrative signals for xStocks." />
        <link rel="canonical" href="https://krakenwatch.com/xstocks" />
        <meta property="og:title" content="xStocks Helm — Kraken Watch" />
        <meta property="og:description" content="Track signals across the tokenized equity ecosystem." />
        <meta property="og:url" content="https://krakenwatch.com/xstocks" />
        <meta property="og:image" content="https://krakenwatch.com/xstocks-hero.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="xStocks Helm — Kraken Watch" />
        <meta name="twitter:description" content="Track signals across the tokenized equity ecosystem." />
        <meta name="twitter:image" content="https://krakenwatch.com/xstocks-hero.png" />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-5 max-w-[1100px] mx-auto">

        <div className="w-full rounded-xl overflow-hidden shadow-lg border-2" style={{ borderColor: 'hsl(30 30% 60%)' }}>
          <img src="/xstocks-hero.png" alt="xStocks Signal Board" className="w-full object-cover" />
        </div>

        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: primary }}>
            xStocks Helm
          </h1>
          <p className="text-sm max-w-md" style={{ fontFamily: 'var(--font-sans)', color: muted }}>
            Track signals across the tokenized equity ecosystem.
          </p>
          {updatedDisplay && (
            <span
              className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full mt-1"
              style={{ background: sectionBg, border: `1px solid ${cardBorder}`, color: muted, fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}
            >
              Updated {updatedDisplay}
            </span>
          )}
          <div className="flex items-center gap-4 text-[10px] mt-1" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: SOURCE_HEADER.live.bg, border: `1px solid ${SOURCE_HEADER.live.border}` }} />
              Live data
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: SOURCE_HEADER.estimated.bg, border: `1px solid ${SOURCE_HEADER.estimated.border}` }} />
              Estimated
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: SOURCE_HEADER.curated.bg, border: `1px solid ${SOURCE_HEADER.curated.border}` }} />
              Curated
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
          <span style={{ color: 'hsl(30 30% 55%)', fontSize: '1.1rem' }}>◈</span>
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonModule key={i} />)
            : modules.map(mod => <SignalModule key={mod.id} mod={mod} />)
          }
        </div>

        <p className="text-center text-[10px]" style={{ color: muted, fontFamily: 'var(--font-sans)' }}>
          Sources:{' '}
          <a href="https://defillama.com/chain/Ink" target="_blank" rel="noopener noreferrer" style={{ color: primary }}>DeFiLlama</a>
          {' · '}
          <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer" style={{ color: primary }}>CoinGecko</a>
          {' · '}
          <a href="https://invite.kraken.com/JDNW/qu2e5diu" target="_blank" rel="noopener noreferrer" style={{ color: primary }}>Kraken</a>
          {' · '}
          <a href="https://xstocks.fi/" target="_blank" rel="noopener noreferrer" style={{ color: primary }}>xStocks</a>
          {' · '}
          <a href="https://www.cfbenchmarks.com/" target="_blank" rel="noopener noreferrer" style={{ color: primary }}>CF Benchmarks</a>
        </p>

        <div className="flex justify-center pb-2">
          <img src="/stamp-ship.png" alt="xStocks" className="object-contain" style={{ width: '100px', height: '100px' }} />
        </div>

      </div>
    </>
  );
}
