import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const qp = 'hsl(28 40% 14%)';
const ut = 'hsl(30 20% 38%)';
const on = 'hsl(350 55% 32%)';

const STATIC_BRIEFS = [
  {
    id: 'ipo',
    slug: 'kraken-ipo-outlook-2026',
    title: 'Kraken IPO Outlook 2026',
    date: 'April 2026',
    description: 'Prediction market signals, secondary pricing, and timeline analysis for the Kraken / Payward public offering.',
    image: '/brief-ipo-header.jpg',
    tag: 'IPO',
  },
  {
    id: 'ink',
    slug: 'ink-l2-ecosystem-brief',
    title: 'Ink L2 Ecosystem Brief',
    date: 'April 2026',
    description: "TVL trajectory, protocol growth, and competitive positioning for Kraken's Ink L2 chain.",
    image: '/brief-ink-points-header.jpg',
    tag: 'Ink L2',
  },
  {
    id: 'db',
    slug: 'payward-corporate-map',
    title: 'Payward Corporate Map',
    date: 'April 2026',
    description: 'Mapping the full Payward entity structure — subsidiaries, regulatory filings, and jurisdiction footprint.',
    image: '/brief-db-header.jpg',
    tag: 'Payward',
  },
];

function useAiBriefs() {
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/briefs')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setBriefs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return { briefs, loading };
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function AlphaBriefs() {
  const { briefs: aiBriefs, loading } = useAiBriefs();

  return (
    <>
      <Helmet>
        <title>Alpha Briefs — Kraken Watch</title>
        <meta name="description" content="In-depth research briefs on the Kraken/Payward ecosystem: IPO timelines, Ink L2 growth, and Payward corporate structure." />
        <link rel="canonical" href="https://krakenwatch.com/alpha-briefs" />
        <meta property="og:title" content="Alpha Briefs — Kraken Watch" />
        <meta property="og:description" content="In-depth research briefs on the Kraken/Payward ecosystem: IPO timelines, Ink L2 growth, and Payward corporate structure." />
        <meta property="og:url" content="https://krakenwatch.com/alpha-briefs" />
        <meta property="og:image" content="https://krakenwatch.com/alpha-briefs-hero.png" />
      </Helmet>

      <main className="alpha-briefs">
        <section className="ab-hero" id="alpha-briefs">
          <div className="ab-hero-inner">
            <img src="/alpha-briefs-hero.png" alt="Alpha Briefs" className="ab-hero-img" />
            <p className="ab-eyebrow">☠ Intelligence</p>
            <h1 className="ab-title">Alpha Briefs</h1>
            <p className="ab-sub">Original research on the Kraken/Payward/Ink ecosystem</p>
          </div>
        </section>

        {/* Live AI-generated intelligence briefs */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem 2rem' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3"
            style={{ fontFamily: 'var(--font-display)', color: ut }}>
            Daily Intelligence
          </p>

          {loading && (
            <p style={{ color: ut, fontStyle: 'italic', fontSize: '0.85rem' }}>Loading briefs…</p>
          )}

          {!loading && aiBriefs.length === 0 && (
            <p style={{ color: ut, fontStyle: 'italic', fontSize: '0.85rem' }}>No intelligence briefs yet — check back soon.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {aiBriefs.map(brief => (
              <div key={brief.slug}
                className="rounded-xl p-5"
                style={{ border: '2px solid hsl(33 35% 60%)', background: 'hsl(38 40% 90%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded"
                    style={{ background: on, color: 'hsl(38 60% 92%)', fontFamily: 'var(--font-display)' }}>
                    {brief.kind || 'general'}
                  </span>
                  <span className="text-[10px]" style={{ color: ut }}>{formatDate(brief.publishedAt)}</span>
                </div>
                <h2 className="text-lg font-bold mb-2"
                  style={{ fontFamily: 'var(--font-display)', color: qp }}>
                  {brief.title}
                </h2>
                <p className="text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-serif)', color: qp, opacity: 0.8 }}>
                  {brief.summary}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Static research briefs */}
        <section className="ab-list" id="briefs-list">
          <div className="ab-list-inner">
            {STATIC_BRIEFS.map(brief => (
              <article key={brief.id} className="brief-card" id={`brief-${brief.id}`}>
                <div className="brief-img-wrap">
                  <img src={brief.image} alt={brief.title} className="brief-img" loading="lazy" />
                </div>
                <div className="brief-body">
                  <span className="brief-tag">{brief.tag}</span>
                  <h2 className="brief-title">{brief.title}</h2>
                  <p className="brief-date">{brief.date}</p>
                  <p className="brief-desc">{brief.description}</p>
                  <a href={`/alpha-briefs/${brief.slug}`} className="brief-cta">
                    Read Brief →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
