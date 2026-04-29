import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import briefs from '../content/briefs/index.js';

function BriefCard({ brief }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const paragraphs = brief.body.split('\n\n');
  const preview = paragraphs.slice(0, 1).join('\n\n');
  const rest = paragraphs.slice(1);

  return (
    <div className="parchment-card rounded-lg overflow-hidden" data-testid={`brief-${brief.slug}`}>
      <div className="h-[3px]" style={{ background: 'hsl(350 50% 32%)' }} />
      {brief.image && (
        <div
          className="overflow-hidden cursor-pointer w-full"
          style={{ aspectRatio: '2048 / 819' }}
          onClick={() => navigate(`/blog/${brief.slug}`)}
        >
          <img src={brief.image} alt="" className="w-full h-full object-cover object-center" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em', background: 'hsl(36 28% 80%)', color: 'hsl(28 40% 22%)', border: '1px solid hsl(33 25% 65%)' }}>
            {brief.tag}
          </span>
          <div className="flex items-center gap-1 text-xs" style={{ color: 'hsl(30 20% 48%)' }}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {brief.dateDisplay}
          </div>
        </div>
        <h3
          className="text-lg font-bold leading-snug mb-2 cursor-pointer hover:opacity-70 transition-opacity"
          style={{ fontFamily: 'var(--font-display)', color: 'hsl(28 40% 16%)' }}
          onClick={() => navigate(`/blog/${brief.slug}`)}
        >
          {brief.title}
        </h3>
        <div className="text-sm leading-relaxed space-y-3" style={{ fontFamily: 'var(--font-serif)', color: 'hsl(28 30% 28%)' }}>
          <p style={{ whiteSpace: 'pre-line' }}>{preview}</p>
          {expanded && rest.map((p, i) => <p key={i} style={{ whiteSpace: 'pre-line' }}>{p}</p>)}
        </div>
        {rest.length > 0 && (
          <button onClick={() => setExpanded(!expanded)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'hsl(350 50% 35%)' }}>
            {expanded ? (
              <><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>Collapse</>
            ) : (
              <><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>Read full brief</>
            )}
          </button>
        )}
        <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid hsl(33 25% 72%)' }}>
          <a href={brief.xUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-70"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'hsl(350 50% 35%)' }}
            data-testid={`link-brief-${brief.slug}`}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            View on X
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <button
            onClick={() => navigate(`/blog/${brief.slug}`)}
            className="inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'hsl(28 40% 40%)' }}>
            Permalink
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogArchive() {
  return (
    <>
      <Helmet>
        <title>Blog — Kraken Watch</title>
        <meta name="description" content="Short-form intelligence on Kraken, Ink L2, and the Payward ecosystem. Updated as events develop." />
        <link rel="canonical" href="https://krakenwatch.com/blog" />
        <meta property="og:title" content="Blog — Kraken Watch" />
        <meta property="og:description" content="Short-form intelligence on Kraken, Ink L2, and the Payward ecosystem. Updated as events develop." />
        <meta property="og:url" content="https://krakenwatch.com/blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog — Kraken Watch" />
        <meta name="twitter:description" content="Short-form intelligence on Kraken, Ink L2, and the Payward ecosystem. Updated as events develop." />
      </Helmet>

      <div className="p-6 space-y-6 max-w-[900px] mx-auto">
        <div className="w-full rounded-xl overflow-hidden shadow-lg border-2" style={{ borderColor: 'hsl(30 30% 60%)' }}>
          <img src="/alpha-briefs-hero.png" alt="Blog" className="w-full object-cover" />
        </div>

        <div>
          <div className="map-divider mt-2" />
          <p className="text-sm mt-2" style={{ color: 'hsl(30 20% 42%)', fontFamily: 'var(--font-serif)' }}>
            Actionable insight from across the Kraken universe.
          </p>
        </div>

        <div className="space-y-4">
          {briefs.map(brief => <BriefCard key={brief.slug} brief={brief} />)}
        </div>
      </div>
    </>
  );
}
