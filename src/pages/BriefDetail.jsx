import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

const BRIEFS_BY_SLUG = {
  'kraken-ipo-outlook-2026': {
    title: 'Kraken IPO Outlook 2026',
    description:
      'Prediction market signals, secondary pricing, and timeline analysis for the Kraken / Payward public offering.',
    tag: 'IPO',
  },
  'ink-l2-ecosystem-brief': {
    title: 'Ink L2 Ecosystem Brief',
    description:
      "TVL trajectory, protocol growth, and competitive positioning for Kraken's Ink L2 chain.",
    tag: 'Ink L2',
  },
  'payward-corporate-map': {
    title: 'Payward Corporate Map',
    description:
      'Mapping the full Payward entity structure — subsidiaries, regulatory filings, and jurisdiction footprint.',
    tag: 'Payward',
  },
};

export default function BriefDetail() {
  const { slug } = useParams();
  const brief = BRIEFS_BY_SLUG[slug];

  if (!brief) {
    return (
      <main className="max-w-[900px] mx-auto px-4 py-10">
        <Helmet>
          <title>Brief Not Found — Kraken Watch</title>
          <meta name="description" content="The requested Kraken Watch brief could not be found." />
          <link rel="canonical" href={`https://krakenwatch.com/alpha-briefs/${slug}`} />
        </Helmet>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          Brief not found
        </h1>
        <p className="mt-3">
          The brief you requested does not exist yet. Please check the Alpha Briefs index.
        </p>
        <Link to="/alpha-briefs" className="inline-block mt-5 underline">
          Back to Alpha Briefs
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[900px] mx-auto px-4 py-10">
      <Helmet>
        <title>{`${brief.title} — Kraken Watch`}</title>
        <meta name="description" content={brief.description} />
        <link rel="canonical" href={`https://krakenwatch.com/alpha-briefs/${slug}`} />
        <meta property="og:title" content={`${brief.title} — Kraken Watch`} />
        <meta property="og:description" content={brief.description} />
        <meta property="og:url" content={`https://krakenwatch.com/alpha-briefs/${slug}`} />
      </Helmet>

      <p
        className="inline-flex px-2 py-1 rounded text-xs uppercase tracking-wider"
        style={{ background: 'hsl(33 28% 82%)', border: '1px solid hsl(33 25% 70%)' }}
      >
        {brief.tag}
      </p>
      <h1 className="text-3xl mt-4 font-bold" style={{ fontFamily: 'var(--font-display)' }}>
        {brief.title}
      </h1>
      <p className="mt-4">{brief.description}</p>
      <p className="mt-6 text-sm opacity-80">
        Full brief content is coming soon. This URL now resolves correctly for sharing and indexing.
      </p>
      <Link to="/alpha-briefs" className="inline-block mt-5 underline">
        Back to Alpha Briefs
      </Link>
    </main>
  );
}
