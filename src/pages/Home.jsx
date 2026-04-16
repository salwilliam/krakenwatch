import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';
import './Home.css';

function MetricCard({ label, value, sub }) {
  return (
    <div className="metric-card">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

export default function Home({ onNav }) {
  const { data, loading } = useSiteData();

  const ipo = data?.ipo;
  const ink = data?.ink;
  const sec = data?.secondary_market;
  const updated = data?.updated_display ?? '—';

  return (
    <>
      <Helmet>
        <title>Kraken Watch — Ink L2 & Payward Analytics</title>
        <meta name="description" content="Independent analytics dashboard for the Kraken/Payward ecosystem. Ink L2 data, Payward corporate map, ecosystem intel — updated daily." />
        <link rel="canonical" href="https://krakenwatch.com/" />
        <meta property="og:title" content="Kraken Watch — Ink L2 & Payward Analytics" />
        <meta property="og:description" content="Independent analytics dashboard for the Kraken/Payward ecosystem. Ink L2 data, Payward corporate map, ecosystem intel — updated daily." />
        <meta property="og:url" content="https://krakenwatch.com/" />
        <meta property="og:image" content="https://krakenwatch.com/og-image.jpg" />
      </Helmet>

      <main className="home">
        {/* Hero */}
        <section className="hero" id="dashboard">
          <div className="hero-inner">
            <img src="/stamp-ship.png" alt="Ship stamp" className="hero-stamp" />
            <h1 className="hero-title">Starboard Ho!</h1>
            <p className="hero-sub">Live data · updated daily</p>

            <div className="metrics-grid">
              {loading ? (
                Array.from({length: 4}).map((_, i) => (
                  <div key={i} className="metric-card skeleton" />
                ))
              ) : (
                <>
                  <MetricCard label="IPO ODDS"      value={ipo  ? `${ipo.avg_pct}%`     : '—'} sub="avg. implied · 2026" />
                  <MetricCard label="SHARE PRICE"   value={sec  ? `$${sec.avg_pps}`      : '—'} sub="secondary avg · 4 venues" />
                  <MetricCard label="INK TVL"        value={ink  ? `$${ink.tvl_millions}M` : '—'} sub="total value locked" />
                  <MetricCard label="INK PROTOCOLS" value={ink  ? ink.protocol_count       : '—'} sub="live on chain" />
                </>
              )}
            </div>

            <p className="hero-updated">⚡ Updated daily · {updated}</p>
          </div>
        </section>

        {/* Anchor divider */}
        <div className="anchor-divider">
          <span className="anchor-icon">⚓</span>
        </div>

        {/* Explore cards */}
        <section className="explore-section" id="explore">
          <div className="explore-inner">
            <h2 className="explore-heading">Explore</h2>
            <div className="explore-grid">
              <button
                className="explore-card"
                onClick={() => onNav && onNav('ink')}
                data-nav="ink"
              >
                <img src="/ink-binnacle-seal.png" alt="Ink" className="explore-seal" />
                <div className="explore-body">
                  <p className="explore-title">Ink Starboard</p>
                  <p className="explore-desc">TVL, protocol count, ecosystem metrics & INK token data — updated daily.</p>
                </div>
              </button>
              <button
                className="explore-card"
                onClick={() => onNav && onNav('corporate')}
                data-nav="corporate"
              >
                <img src="/payward-kraken-seal.png" alt="Payward" className="explore-seal" />
                <div className="explore-body">
                  <p className="explore-title">Kraken Map</p>
                  <p className="explore-desc">Secondary market pricing, IPO forecast, corporate entities, acquisitions & board data.</p>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Prediction Markets */}
        <section className="markets-section" id="markets">
          <div className="section-inner">
            <h2 className="section-title">Prediction Markets</h2>
            <div className="markets-grid">
              {loading ? (
                Array.from({length: 3}).map((_, i) => <div key={i} className="market-card skeleton" />)
              ) : (
                <>
                  <div className="market-card">
                    <div className="market-venue">Polymarket</div>
                    <div className="market-odds">{ipo?.polymarket_pct ?? '—'}%</div>
                    <div className="market-label">Kraken IPO in 2026</div>
                  </div>
                  <div className="market-card">
                    <div className="market-venue">Kalshi</div>
                    <div className="market-odds">{ipo?.kalshi_pct ?? '—'}%</div>
                    <div className="market-label">Kraken IPO in 2026</div>
                  </div>
                  <div className="market-card market-card--avg">
                    <div className="market-venue">Blended Avg</div>
                    <div className="market-odds">{ipo?.avg_pct ?? '—'}%</div>
                    <div className="market-label">avg. implied probability</div>
                  </div>
                </>
              )}
            </div>
            <p className="markets-note">Market probabilities reflect crowd consensus and are not financial advice.</p>
          </div>
        </section>

        {/* Secondary Market */}
        <section className="secondary-section" id="secondary">
          <div className="section-inner">
            <h2 className="section-title">Secondary Market</h2>
            {loading ? (
              <div className="secondary-grid">
                {Array.from({length: 4}).map((_, i) => <div key={i} className="secondary-card skeleton" />)}
              </div>
            ) : (
              <>
                <div className="secondary-grid">
                  {[
                    { venue: 'Hiive',      val: sec?.hiive_pps,  href: 'https://www.hiive.com/securities/kraken-stock' },
                    { venue: 'Forge Global', val: sec?.forge_pps, href: 'https://forgeglobal.com/kraken_stock/' },
                    { venue: 'Nasdaq PM',  val: sec?.npm_pps,   href: 'https://www.nasdaqprivatemarket.com/company/kraken/' },
                    { venue: 'Notice',     val: sec?.notice_pps, href: 'https://notice.co/c/kraken' },
                  ].map(({ venue, val, href }) => (
                    <a key={venue} href={href} target="_blank" rel="noopener noreferrer" className="secondary-card">
                      <div className="secondary-venue">{venue}</div>
                      <div className="secondary-price">${val ?? '—'}</div>
                    </a>
                  ))}
                </div>
                {sec?.volume_note && (
                  <p className="secondary-note">{sec.volume_note}</p>
                )}
                <p className="secondary-disclaimer">Prices are indicative secondary market data, not official valuations.</p>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
