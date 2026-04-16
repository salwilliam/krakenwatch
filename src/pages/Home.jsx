import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';
import './Home.css';

function MetricCard({ label, value, sub }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-sub">{sub}</div>
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
        <meta property="og:description" content="Independent analytics dashboard for the Kraken/Payward ecosystem." />
        <meta property="og:url" content="https://krakenwatch.com/" />
        <meta property="og:image" content="https://krakenwatch.com/og-image.jpg" />
      </Helmet>

      <main className="home">

        {/* Hero — parchment background, ship stamp, title, 2×2 metrics */}
        <section className="hero" id="dashboard">
          <div className="hero-inner">
            <img src="/stamp-ship.png" alt="Kraken Watch" className="hero-stamp" />
            <h1 className="hero-title">Starboard ho!</h1>
            <p className="hero-sub">Live data · updated daily</p>

            <div className="metrics-grid">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="metric-card skeleton" />
                ))
              ) : (
                <>
                  <MetricCard label="IPO ODDS"      value={ipo ? `${ipo.avg_pct}%`        : '—'} sub="avg. implied · 2026" />
                  <MetricCard label="SHARE PRICE"   value={sec ? `$${sec.avg_pps}`         : '—'} sub="secondary avg · 4 venues" />
                  <MetricCard label="INK TVL"        value={ink ? `$${ink.tvl_millions}M`  : '—'} sub="total value locked" />
                  <MetricCard label="INK PROTOCOLS" value={ink ? `${ink.protocol_count}`   : '—'} sub="live on chain" />
                </>
              )}
            </div>
          </div>
        </section>

        {/* Anchor divider */}
        <div className="anchor-divider" aria-hidden="true">
          <div className="anchor-line" />
          <span className="anchor-icon">⚓</span>
          <div className="anchor-line" />
        </div>

        {/* Explore */}
        <section className="explore-section" id="explore">
          <div className="explore-inner">
            <p className="explore-heading">Explore</p>
            <div className="explore-grid">
              <button className="explore-card" onClick={() => onNav('ink')}>
                <p className="explore-title">Ink Starboard</p>
                <p className="explore-desc">TVL, protocol count, ecosystem metrics & INK token data — updated daily.</p>
              </button>
              <button className="explore-card" onClick={() => onNav('corporate')}>
                <p className="explore-title">Kraken Map</p>
                <p className="explore-desc">Secondary market pricing, IPO forecast, corporate entities, acquisitions & board data.</p>
              </button>
            </div>
          </div>
        </section>

        {/* Footer-style updated bar */}
        <div className="home-footer">
          <span className="home-footer-pill">↻ Updated daily · {updated}</span>
          <span className="home-footer-disclaimer">Kraken Watch is independent research, not affiliated with Kraken or Payward</span>
        </div>

      </main>
    </>
  );
}
