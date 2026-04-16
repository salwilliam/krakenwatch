import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const briefs = [
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
    description: 'TVL trajectory, protocol growth, and competitive positioning for Kraken\'s Ink L2 chain.',
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

export default function AlphaBriefs() {
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

        <section className="ab-list" id="briefs-list">
          <div className="ab-list-inner">
            {briefs.map(brief => (
              <article key={brief.id} className="brief-card" id={`brief-${brief.id}`}>
                <div className="brief-img-wrap">
                  <img src={brief.image} alt={brief.title} className="brief-img" loading="lazy" />
                </div>
                <div className="brief-body">
                  <span className="brief-tag">{brief.tag}</span>
                  <h2 className="brief-title">{brief.title}</h2>
                  <p className="brief-date">{brief.date}</p>
                  <p className="brief-desc">{brief.description}</p>
                  <Link
                    to={`/alpha-briefs/${brief.slug}`}
                    className="brief-cta"
                  >
                    Read Brief →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
