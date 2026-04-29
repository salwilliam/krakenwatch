import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { getBriefBySlug } from '../content/briefs/index.js';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const brief = getBriefBySlug(slug);

  if (!brief) {
    return (
      <div className="p-6 max-w-[900px] mx-auto text-center" style={{ color: 'hsl(28 30% 28%)', fontFamily: 'var(--font-serif)' }}>
        <p className="text-lg mt-12">Brief not found.</p>
        <button
          onClick={() => navigate('/blog')}
          className="mt-4 text-sm font-semibold hover:opacity-70 transition-opacity"
          style={{ fontFamily: 'var(--font-display)', color: 'hsl(350 50% 35%)' }}>
          ← Back to Blog
        </button>
      </div>
    );
  }

  const paragraphs = brief.body.split('\n\n');

  return (
    <>
      <Helmet>
        <title>{brief.title} — Kraken Watch</title>
        <meta name="description" content={brief.description} />
        <link rel="canonical" href={`https://krakenwatch.com/blog/${brief.slug}`} />
        <meta property="og:title" content={`${brief.title} — Kraken Watch`} />
        <meta property="og:description" content={brief.description} />
        <meta property="og:url" content={`https://krakenwatch.com/blog/${brief.slug}`} />
        {brief.image && <meta property="og:image" content={`https://krakenwatch.com${brief.image}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${brief.title} — Kraken Watch`} />
        <meta name="twitter:description" content={brief.description} />
      </Helmet>

      <div className="p-6 max-w-[900px] mx-auto">
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-1 text-xs font-semibold mb-6 hover:opacity-70 transition-opacity"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'hsl(28 40% 40%)' }}>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Blog
        </button>

        <article className="parchment-card rounded-lg overflow-hidden">
          <div className="h-[3px]" style={{ background: 'hsl(350 50% 32%)' }} />

          {brief.image && (
            <div className="overflow-hidden w-full" style={{ aspectRatio: '2048 / 819' }}>
              <img src={brief.image} alt="" className="w-full h-full object-cover object-center" />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em', background: 'hsl(36 28% 80%)', color: 'hsl(28 40% 22%)', border: '1px solid hsl(33 25% 65%)' }}>
                {brief.tag}
              </span>
              <div className="flex items-center gap-1 text-xs" style={{ color: 'hsl(30 20% 48%)' }}>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {brief.dateDisplay}
              </div>
            </div>

            <h1 className="text-2xl font-bold leading-snug mb-6"
              style={{ fontFamily: 'var(--font-display)', color: 'hsl(28 40% 16%)' }}>
              {brief.title}
            </h1>

            <div className="space-y-4 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'hsl(28 30% 28%)' }}>
              {paragraphs.map((p, i) => (
                <p key={i} style={{ whiteSpace: 'pre-line' }}>{p}</p>
              ))}
            </div>

            <div className="mt-8 pt-4 flex flex-wrap items-center gap-3" style={{ borderTop: '1px solid hsl(33 25% 72%)' }}>
              <a href={brief.xUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-70"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'hsl(350 50% 35%)' }}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                View on X
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
              {brief.tags && brief.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded"
                  style={{ background: 'hsl(36 20% 88%)', color: 'hsl(28 35% 38%)', border: '1px solid hsl(33 20% 75%)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
