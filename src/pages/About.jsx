import { Helmet } from 'react-helmet-async';

const qp = 'hsl(28 40% 14%)';
const b5 = 'hsl(350 55% 32%)';
const ut = 'hsl(30 20% 38%)';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About — Kraken Watch</title>
        <meta name="description" content="Kraken Watch is independent research tracking Kraken, Payward, and Ink L2. Daily analytics on IPO odds, share pricing, and the onchain ecosystem." />
        <link rel="canonical" href="https://krakenwatch.com/about" />
        <meta property="og:title" content="About — Kraken Watch" />
        <meta property="og:description" content="Kraken Watch is independent research tracking Kraken, Payward, and Ink L2." />
        <meta property="og:url" content="https://krakenwatch.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About — Kraken Watch" />
        <meta name="twitter:description" content="Kraken Watch is independent research tracking Kraken, Payward, and Ink L2." />
      </Helmet>
    <div className="max-w-[900px] mx-auto p-4 sm:p-6 flex flex-col items-center gap-6">
      <div className="w-full rounded-xl overflow-hidden shadow-lg border-2" style={{ borderColor: 'hsl(30 30% 60%)', height: '280px' }}>
        <img src="/about-hero.png" alt="Kraken Watch crew at the docks" className="w-full h-full object-cover" />
      </div>
      <div className="w-full flex flex-col gap-5 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
          Ahoy, matey! Welcome t' the Watch!
        </h1>
        <p className="text-base sm:text-lg leading-relaxed" style={{ fontFamily: "'Trade Winds', Georgia, serif", color: qp, opacity: 0.85 }}>
          Kraken Watch set sail in April 2026 to forge signals and scuttlebutt from across Kraken, Payward, Ink, and the digital asset frontier into actionable insight.
        </p>
        <p className="text-base sm:text-lg leading-relaxed" style={{ fontFamily: "'Trade Winds', Georgia, serif", color: qp, opacity: 0.85 }}>
          <a href="https://x.com/KrakWatch" target="_blank" rel="noopener noreferrer"
            className="font-semibold underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity"
            style={{ color: b5 }}>Join the crew on X</a>{' '}
          🏴‍☠️
        </p>
        <p className="text-base sm:text-lg leading-relaxed" style={{ fontFamily: "'Trade Winds', Georgia, serif", color: qp, opacity: 0.85 }}>
          Created by{' '}
          <a href="https://x.com/salwilliam" target="_blank" rel="noopener noreferrer"
            className="font-semibold underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity"
            style={{ color: b5 }}>@salwilliam</a>
        </p>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
          <span style={{ color: 'hsl(30 30% 55%)', fontSize: '1.1rem' }}>⚓</span>
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
          {[
            { href: '/prediction', label: 'Prediction Watch', desc: 'Spy ye forecast markets for omens of Ink and Kraken.' },
            { href: '/ink', label: 'Ink Ecosystem', desc: 'Scour the onchain frontier for Ink dapps, data, and plunder.' },
            { href: '/payward', label: 'Payward Map', desc: 'Chart the full Payward armada: Kraken wares, prize ships, and battle standards.' },
            { href: '/blog', label: 'Blog', desc: 'Actionable insight from across the Kraken universe.' },
            { href: '/experimental', label: 'Experimental', desc: "Greenhorn modules, still gettin' their sea legs." },
          ].map(({ href, label, desc }) => (
            <a key={href} href={href}
              className="rounded-lg p-3 transition-opacity hover:opacity-80"
              style={{ border: '1px solid hsl(33 35% 60%)', background: 'hsl(38 40% 90%)', textDecoration: 'none' }}>
              <p className="text-xs font-bold" style={{ fontFamily: 'var(--font-display)', color: qp }}>{label}</p>
              <p className="text-[10px] mt-1 leading-relaxed" style={{ fontFamily: "'Trade Winds', Georgia, serif", color: ut }}>{desc}</p>
            </a>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-1">
          <a href="https://x.com/KrakWatch" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ fontFamily: 'var(--font-display)', background: 'hsl(28 40% 14%)', color: 'hsl(38 60% 88%)', letterSpacing: '0.04em' }}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Follow on X
          </a>
          <a href="https://terminal.spreads.fi/?ref=ZSNKR2" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ fontFamily: 'var(--font-display)', background: 'hsl(350 55% 32%)', color: 'hsl(38 60% 92%)', letterSpacing: '0.04em' }}>
            Trade ↗
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
