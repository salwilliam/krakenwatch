import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
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

export default function Home() {
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
        <section className="hero" id="dashboard">
          <div className="hero-inner">
            <p className="hero-eyebrow">☠ Live Data</p>
            <h1 className="hero-title">Starboard ho!</h1>
            <p className="hero-sub">Live data · updated daily</p>

            <div className="metrics-grid">
              {loading ? (
                <>
                  <div className="metric-card skeleton" />
                  <div className="metric-card skeleton" />
                  <div className="metric-card skeleton" />
                  <div className="metric-card skeleton" />
                </>
              ) : (
                <>
                  <MetricCard
                    label="IPO Odds"
                    value={ipo ? `${ipo.avg_pct}%` : '—'}
                    sub="avg. implied · 2026"
                  />
                  <MetricCard
                    label="Share Price"
                    value={sec ? `$${sec.avg_pps}` : '—'}
                    sub="secondary avg · 4 venues"
                  />
                  <MetricCard
                    label="Ink TVL"
                    value={ink ? `$${ink.tvl_millions}M` : '—'}
                    sub="total value locked"
                  />
                  <MetricCard
                    label="Ink Protocols"
                    value={ink ? ink.protocol_count : '—'}
                    sub="live on chain"
                  />
                </>
              )}
            </div>

            <div className="hero-actions">
              <Link to="/alpha-briefs" className="btn-primary">Alpha Briefs</Link>
              <Link to="/ink" className="btn-secondary">Ink L2 Data</Link>
            </div>

            <p className="hero-updated">
              ↻ Updated daily · {updated}
            </p>
          </div>
        </section>

        <section className="markets-section" id="markets">
          <div className="section-inner">
            <h2 className="section-title">Prediction Markets</h2>
            <div className="markets-grid">
              {loading ? (
                <div className="market-card skeleton tall" />
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
                    <div className="market-label">implied probability</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="secondary-section" id="secondary">
          <div className="section-inner">
            <h2 className="section-title">Secondary Market</h2>
            {loading ? (
              <div className="market-card skeleton tall" />
            ) : (
              <div className="secondary-grid">
                {[
                  { venue: 'Hiive', val: sec?.hiive_pps },
                  { venue: 'Forge Global', val: sec?.forge_pps },
                  { venue: 'Nasdaq PM', val: sec?.npm_pps },
                  { venue: 'Notice', val: sec?.notice_pps },
                ].map(({ venue, val }) => (
                  <div key={venue} className="secondary-card">
                    <div className="secondary-venue">{venue}</div>
                    <div className="secondary-price">${val ?? '—'}</div>
                  </div>
                ))}
              </div>
            )}
            {sec && (
              <p className="secondary-note">{sec.volume_note}</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
