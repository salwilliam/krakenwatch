import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';

function useProtocols() {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ink/protocols')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setProtocols(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return { protocols, loading };
}

function fmt(n) {
  if (n == null) return '—';
  if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  if (Math.abs(n) >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(0);
}

function fmtPct(n) {
  if (n == null) return '—';
  const s = n.toFixed(2);
  return (n >= 0 ? '+' : '') + s + '%';
}

const ut = 'hsl(30 20% 38%)';
const qp = 'hsl(28 40% 14%)';
const on = 'hsl(350 55% 32%)';
const cardStyle = { border: '2px solid hsl(33 35% 60%)', background: 'hsl(38 40% 90%)' };

export default function InkL2() {
  const { data, loading: summaryLoading } = useSiteData();
  const { protocols, loading: protLoading } = useProtocols();
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
                  {summaryLoading ? '—' : `$${ink?.tvl_millions}M`}
                </div>
                <div className="ink-stat-label">Total Value Locked</div>
                <div className="ink-stat-src">Source: DeFiLlama</div>
              </div>
              <div className="ink-stat">
                <div className="ink-stat-value">
                  {summaryLoading ? '—' : ink?.protocol_count}
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

        {/* Protocol table */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3"
            style={{ fontFamily: 'var(--font-display)', color: ut }}>
            Protocols by TVL
          </p>

          {protLoading && (
            <p style={{ color: ut, fontStyle: 'italic', fontSize: '0.85rem' }}>Loading protocols…</p>
          )}

          {!protLoading && protocols.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={cardStyle}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-serif)', fontSize: '0.82rem', color: qp }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid hsl(33 35% 60%)', background: 'hsl(33 28% 82%)' }}>
                    <th style={{ textAlign: 'left', padding: '0.6rem 1rem', fontFamily: 'var(--font-display)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: ut }}>#</th>
                    <th style={{ textAlign: 'left', padding: '0.6rem 0.5rem', fontFamily: 'var(--font-display)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: ut }}>Protocol</th>
                    <th style={{ textAlign: 'left', padding: '0.6rem 0.5rem', fontFamily: 'var(--font-display)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: ut }}>Category</th>
                    <th style={{ textAlign: 'right', padding: '0.6rem 1rem', fontFamily: 'var(--font-display)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: ut }}>TVL</th>
                    <th style={{ textAlign: 'right', padding: '0.6rem 1rem', fontFamily: 'var(--font-display)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: ut }}>24h</th>
                    <th style={{ textAlign: 'right', padding: '0.6rem 1rem', fontFamily: 'var(--font-display)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: ut }}>7d</th>
                  </tr>
                </thead>
                <tbody>
                  {protocols.map((p, i) => (
                    <tr key={p.slug} style={{ borderBottom: '1px solid hsl(33 28% 75%)', background: i % 2 === 0 ? 'transparent' : 'hsl(38 40% 93%)' }}>
                      <td style={{ padding: '0.55rem 1rem', color: ut, fontSize: '0.75rem' }}>{i + 1}</td>
                      <td style={{ padding: '0.55rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {p.logo && <img src={p.logo} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }} />}
                          <a href={p.url || '#'} target="_blank" rel="noopener noreferrer"
                            style={{ color: on, fontWeight: 600, textDecoration: 'none' }}
                            onMouseOver={e => e.target.style.opacity = '0.7'}
                            onMouseOut={e => e.target.style.opacity = '1'}>
                            {p.name}
                          </a>
                        </div>
                      </td>
                      <td style={{ padding: '0.55rem 0.5rem', color: ut, fontSize: '0.75rem' }}>{p.category}</td>
                      <td style={{ padding: '0.55rem 1rem', textAlign: 'right', fontWeight: 600 }}>{fmt(p.tvlUsd)}</td>
                      <td style={{ padding: '0.55rem 1rem', textAlign: 'right', color: p.change1d >= 0 ? 'hsl(142 50% 35%)' : 'hsl(0 60% 45%)' }}>
                        {fmtPct(p.change1d)}
                      </td>
                      <td style={{ padding: '0.55rem 1rem', textAlign: 'right', color: p.change7d >= 0 ? 'hsl(142 50% 35%)' : 'hsl(0 60% 45%)' }}>
                        {fmtPct(p.change7d)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
