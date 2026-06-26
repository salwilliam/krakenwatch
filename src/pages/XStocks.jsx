import { Helmet } from 'react-helmet-async';
import PageHeroImage from '../components/PageHeroImage';
import { useSiteData } from '../hooks/useSiteData';

const HERO_IMAGE = '/xstocks-hero.png';

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

const KR = (path) => `https://blog.kraken.com${path}`;
const KW = (slug) => `https://krakenwatch.com/blog/${slug}`;

const DEPLOYMENTS = [
  { date: 'May 22, 2025',  text: 'Kraken and Solana announced upcoming xStocks trading and onchain support',           href: 'https://www.businesswire.com/news/home/20250522493630/en/Kraken-Partners-with-Backed-to-Launch-xStocks-on-Solana-Bringing-Tokenized-Equities-to-the-Masses' },
  { date: 'Jun 12, 2025',  text: 'Alchemy Pay integrated fiat onramps for xStocks purchases',                         href: 'https://www.prnewswire.com/apac/news-releases/alchemy-pay-partners-with-backed-to-integrate-xstocks-on-its-platform-pioneering-the-first-direct-fiat-access-to-tokenized-stocks-and-etfs-302480096.html' },
  { date: 'Jun 30, 2025',  text: 'Kraken launched live xStocks trading',                                              href: KR('/product/xstocks/tokenized-equities-now-available') },
  { date: 'Jun 30, 2025',  text: 'Bybit launched xStocks trading',                                                    href: 'https://www.prnewswire.com/news-releases/bybits-bridge-to-wall-street-gets-wider-with-xstocks-tokenized-equities-302494473.html' },
  { date: 'Jun 30, 2025',  text: 'Raydium added xStocks liquidity pools',                                             href: 'https://solana.com/news/case-study-xstocks' },
  { date: 'Jun 30, 2025',  text: 'Jupiter enabled xStocks routing and swaps',                                         href: 'https://solana.com/news/case-study-xstocks' },
  { date: 'Jun 30, 2025',  text: 'Kamino Finance enabled xStocks collateral and lending markets',                     href: 'https://thedefiant.io/news/defi/kamino-becomes-first-major-defi-lender-to-accept-tokenized-stocks-as-collateral' },
  { date: 'Jun 30, 2025',  text: 'Phantom integrated xStocks asset visibility and access',                            href: 'https://solana.com/news/case-study-xstocks' },
  { date: 'Jun 30, 2025',  text: 'Solflare integrated xStocks asset visibility and access',                           href: 'https://solana.com/news/case-study-xstocks' },
  { date: 'Jul 2025',      text: 'Gate.io launched xStocks trading section',                                          href: 'https://www.globenewswire.com/news-release/2025/07/03/3109777/0/en/Gate-Launches-xStocks-Trading-Section-Bridging-Crypto-Finance-and-Global-Capital-Markets.html' },
  { date: 'Sep 2, 2025',   text: 'xStocks expanded from Solana onto Ethereum/EVM rails',                             href: KR('/product/xstocks/launch-on-ethereum') },
  { date: 'Oct 2, 2025',   text: 'Telegram Wallet ecosystem announced xStocks access',                                href: 'https://finance.yahoo.com/news/telegram-let-users-trade-tokenized-060216124.html' },
  { date: 'Nov 20, 2025',  text: 'xPort launched tokenization infrastructure for issuing tokenized assets',           href: 'https://xstocks.fi/us/news/introducing-xport-the-in-specie-tokenization-engine' },
  { date: 'Dec 12, 2025',  text: 'Chainlink CCIP enabled crosschain xStocks transfers',                              href: 'https://www.coindesk.com/web3/2025/12/12/backed-chainlink-launch-xbridge-to-move-tokenized-stocks-between-solana-and-ethereum' },
  { date: 'Dec 18, 2025',  text: 'Wallet in Telegram enabled xStocks access for TON users',                          href: KR('/product/xstocks/wallet-in-telegram') },
  { date: 'Feb 9, 2026',   text: 'xStocks expanded deeper Solana native liquidity infrastructure',                    href: KR('/product/xstocks/25-billion-in-total-transaction-volume') },
  { date: 'Feb 24, 2026',  text: 'Kraken launched tokenized equity perpetual futures tied to xStocks',                href: KR('/product/xstocks/tokenized-equity-perpetual-futures') },
  { date: 'Mar 5, 2026',   text: 'Talos integrated institutional xStocks access',                                     href: 'https://www.talos.com/insights/xstocks-tokenized-equities-now-supported-through-talos' },
  { date: 'Mar 5, 2026',   text: 'xChange launched RFQ infrastructure for institutional execution',                   href: KR('/product/xstocks/introducing-xchange') },
  { date: 'Mar 9, 2026',   text: 'Nasdaq partnership expanded institutional market infrastructure connectivity',       href: KR('/news/payward-partners-with-nasdaq') },
  { date: 'Mar 27, 2026',  text: 'Fundrise launched tokenized private tech exposure through xStocks rails',           href: KR('/product/xstocks/fundrise-vcx-tokenize-leading-private-tech-companies') },
  { date: 'Mar 30, 2026',  text: 'Morpho and Flowdesk launched xStocks related DeFi vault infrastructure',           href: 'https://xstocks.fi/us/news' },
  { date: 'Apr 15, 2026',  text: 'Luno highlighted xStocks expansion use cases in emerging markets',                  href: 'https://www.moneyweb.co.za/moneyweb-crypto/luno-launches-tokenised-us-stocks/' },
  { date: 'Apr 28, 2026',  text: 'CoinRoutes integrated institutional xStocks routing',                               href: KR('/product/xstocks/coinroutes-integration') },
  { date: 'Apr 29, 2026',  text: 'Bitso launched xStocks access in Latin America',                                    href: KR('/product/xstocks/bitso-integration') },
  { date: 'Apr 30, 2026',  text: 'BNB Chain integrated xStocks trading infrastructure',                               href: KW('ink-alpha-xstocks-bnb-chain') },
  { date: 'Apr 30, 2026',  text: 'PancakeSwap enabled xStocks trading liquidity',                                     href: 'https://www.bnbchain.org/en/blog/xstocks-is-now-live-on-bnb-chain-with-50-tokenized-equities-with-100-more-coming-soon' },
  { date: 'Apr 30, 2026',  text: 'CowSwap enabled xStocks routing and trading',                                       href: 'https://www.cryptotimes.io/2026/04/30/xstocks-expands-to-bnb-chain-with-50-tokenized-stocks-and-etfs/' },
  { date: 'May 7, 2026',   text: 'Mantle integrated xStocks support',                                                 href: 'https://www.newswire.ca/news-releases/mantle-bybit-and-fluxion-bring-xstocks-tokenized-equities-to-institutional-standard-with-atomic-rfq-896908163.html' },
  { date: 'May 8, 2026',   text: 'CF Benchmarks launched regulated index and corporate actions infrastructure for xStocks',  href: KW('cf-benchmarks-xstocks-indices') },
  { date: 'May 12, 2026',  text: 'Franklin Templeton ETFs were announced for future xStocks support',                 href: KW('payward-franklin-templeton-tokenized-assets') },
  { date: 'May 13, 2026',  text: 'Kamino Finance expanded xStocks lending market support',                            href: 'https://www.theblock.co/post/362284/solana-based-decentralized-lending-protocol-kamino-integrates-tokenized-xstocks-as-collateral-option' },
  { date: 'May 19, 2026',  text: 'Bitget Wallet integrated xStocks access for self custodial users',                  href: 'https://financefeeds.com/bitget-wallet-pushes-tokenized-equities-into-mainstream-crypto-wallets/' },
];

function DeploymentTracker() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
      <div className="px-5 pt-4 pb-3" style={{ borderBottom: `1px solid ${cardBorder}`, background: sectionBg }}>
        <h2 className="text-base font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: primary }}>
          xStocks Deployment Tracker
        </h2>
        <p className="text-[11px] mt-0.5" style={{ fontFamily: 'var(--font-sans)', color: muted }}>
          {DEPLOYMENTS.length} integrations &amp; partnerships · May 2025 – present
        </p>
      </div>
      <div className="px-5 py-4">
        {/* Desktop: date-left + dot + description-right timeline */}
        <div className="relative hidden sm:block">
          <div className="absolute left-[7.5rem] top-0 bottom-0 w-px" style={{ background: cardBorder }} />
          <div>
            {DEPLOYMENTS.map((d, i) => (
              <div key={i} className="flex items-start gap-0">
                <span
                  className="shrink-0 text-right pr-3 pt-[3px] text-[11px] tabular-nums leading-snug"
                  style={{ width: '7.5rem', fontFamily: 'var(--font-sans)', color: muted }}
                >
                  {d.date}
                </span>
                <div className="relative shrink-0 flex flex-col items-center" style={{ width: '1px' }}>
                  <div
                    className="w-2 h-2 rounded-full shrink-0 -translate-x-[3px] mt-[5px]"
                    style={{ background: accent, border: `2px solid ${cardBg}`, outline: `1px solid ${accent}` }}
                  />
                </div>
                {d.href ? (
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 pl-3 pb-3 text-[12px] leading-snug hover:opacity-70 transition-opacity"
                    style={{ fontFamily: 'var(--font-sans)', color: primary, textDecoration: 'none' }}
                  >
                    {d.text} <span style={{ color: accent, fontSize: '0.65rem' }}>↗</span>
                  </a>
                ) : (
                  <p className="flex-1 pl-3 pb-3 text-[12px] leading-snug" style={{ fontFamily: 'var(--font-sans)', color: primary }}>
                    {d.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Mobile: stacked date above description */}
        <div className="relative sm:hidden">
          <div className="absolute left-[3px] top-0 bottom-0 w-px" style={{ background: cardBorder }} />
          <div>
            {DEPLOYMENTS.map((d, i) => (
              <div key={i} className="flex items-start gap-0 pl-4 pb-3">
                <div
                  className="absolute w-2 h-2 rounded-full -translate-x-[3px] mt-[5px]"
                  style={{ background: accent, border: `2px solid ${cardBg}`, outline: `1px solid ${accent}`, left: '3px' }}
                />
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-[10px] tabular-nums leading-none"
                    style={{ fontFamily: 'var(--font-sans)', color: muted }}
                  >
                    {d.date}
                  </span>
                  {d.href ? (
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] leading-snug hover:opacity-70 transition-opacity"
                      style={{ fontFamily: 'var(--font-sans)', color: primary, textDecoration: 'none' }}
                    >
                      {d.text} <span style={{ color: accent, fontSize: '0.65rem' }}>↗</span>
                    </a>
                  ) : (
                    <p className="text-[12px] leading-snug" style={{ fontFamily: 'var(--font-sans)', color: primary }}>
                      {d.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
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
      insight: `Aggregate market cap and 24h volume across ${xs?.asset_count ?? '41'} CoinGecko-tracked xStocks tokens. Targeting 500+ tokens by end of 2026.`,
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
        'Kraken — ~62%',
        'Ink L2 — ~18%',
        'Kraken OTC — institutional block trades',
        'xChange — Ethereum + Solana (new)',
        'Other venues — ~20%',
      ],
      insight: 'Estimated distribution across venues. xChange adds atomic settlement on Ethereum and Solana alongside Ink L2.',
    },
    {
      id: 'narrative',
      title: 'Narrative Signals',
      source: 'curated',
      action: 'Explore',
      data: [
        'SpaceX xStock ($SPCXX) now live — #1 by 24h volume across all tokenized equities',
        'CF Benchmarks: regulated index and corporate actions infrastructure now live',
        'Franklin Templeton ETFs announced for xStocks integration',
        'Nasdaq partnership: issuer-sponsored equity token infrastructure',
        'xChange launched: atomic settlement on Ethereum and Solana',
      ],
      insight: 'Manually curated signals on xStocks ecosystem developments, partnerships, and adoption milestones.',
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
        className="flex items-center justify-between gap-2 px-4 pt-2 pb-2"
        style={{ background: h.bg, borderBottom: `1px solid ${h.border}` }}
      >
        <p className="text-sm font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: h.text }}>
          {mod.title}
        </p>
        <ActionBadge action={mod.action} />
      </div>

      <div className="px-4 pt-2 pb-1 flex-1">
        <ul className="space-y-1">
          {mod.data.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: primary, fontFamily: 'var(--font-sans)' }}>
              <span className="shrink-0 mt-px" style={{ color: accent }}>›</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-4 pb-2.5 pt-1.5" style={{ borderTop: `1px solid hsl(33 28% 78%)` }}>
        <p className="text-xs leading-snug" style={{ fontFamily: 'var(--font-sans)', color: muted, fontStyle: 'italic' }}>
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
        <meta property="og:image" content={`https://krakenwatch.com${HERO_IMAGE}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="xStocks Helm — Kraken Watch" />
        <meta name="twitter:description" content="Track signals across the tokenized equity ecosystem." />
        <meta name="twitter:image" content={`https://krakenwatch.com${HERO_IMAGE}`} />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-5 max-w-[1100px] mx-auto">

        <PageHeroImage src={HERO_IMAGE} alt="xStocks Signal Board" priority />

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

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
          <span style={{ color: 'hsl(30 30% 55%)', fontSize: '1.1rem' }}>◈</span>
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
        </div>

        <DeploymentTracker />

        <div className="flex justify-center pb-2">
          <img src="/stamp-ship.png" alt="xStocks" className="object-contain" style={{ width: '100px', height: '100px' }} />
        </div>

      </div>
    </>
  );
}
