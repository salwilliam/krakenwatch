import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';
import './InkL2.css';

export default function InkL2() {
  const { data, loading } = useSiteData();
  const ink = data?.ink;
  const updated = data?.updated_display;

  return (
    <>
      <Helmet>
        <title>Ink L2 Analytics — Kraken Watch</title>
        <meta name="description" content="Live Ink L2 TVL, protocol count, and ecosystem growth data. Kraken's L2 chain built on the OP Stack." />
        <link rel="canonical" href="https://krakenwatch.com/ink" />
        <meta property="og:title" content="Ink L2 Analytics — Kraken Watch" />
        <meta property="og:description" content="Live Ink L2 TVL, protocol count, and ecosystem growth data." />
        <meta property="og:url" content="https://krakenwatch.com/ink" />
      </Helmet>

      <main className="ink-page" id="ink-l2">
        <section className="ink-hero">
          <div className="ink-hero-inner">
            <img src="/ink-binnacle-seal.png" alt="Ink" className="ink-seal" />
            <h1 className="ink-title">Ink L2</h1>
            <p className="ink-sub">Kraken's OP Stack L2 — live ecosystem metrics</p>
          </div>
        </section>

        <section className="ink-metrics" id="ink-metrics">
          <div className="ink-metrics-inner">
            <div className="ink-stat-grid">
              <div className="ink-stat">
                <div className="ink-stat-value">
                  {loading ? '—' : `$${ink?.tvl_millions}M`}
                </div>
                <div className="ink-stat-label">Total Value Locked</div>
                <div className="ink-stat-src">Source: DeFiLlama</div>
              </div>
              <div className="ink-stat">
                <div className="ink-stat-value">
                  {loading ? '—' : ink?.protocol_count}
                </div>
                <div className="ink-stat-label">Live Protocols</div>
                <div className="ink-stat-src">Source: DeFiLlama</div>
              </div>
            </div>
            {updated && (
              <p className="ink-updated">↻ Updated {updated}</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
