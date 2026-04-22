const qp = 'hsl(28 40% 14%)';
const b5 = 'hsl(350 55% 32%)';

export default function About() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-10 flex flex-col items-center gap-8">
      <div className="w-full rounded-xl overflow-hidden shadow-lg border-2" style={{ borderColor: 'hsl(30 30% 60%)' }}>
        <img src="/alpha-briefs-hero.png" alt="Kraken Watch crew at the docks" className="w-full object-cover" style={{ maxHeight: '380px', objectPosition: 'center top' }} />
      </div>
      <div className="w-full flex flex-col gap-5 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
          Ahoy, matey! Welcome t\' the <span className="fancy-accent">Watch</span>!
        </h1>
        <p className="text-base sm:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: qp, opacity: 0.85 }}>
          Kraken Watch set sail in April 2026 to plunder signals, scuttlebutt, and actionable insight from across the vast seas of Kraken, Payward, Ink, and the digital asset frontier.
        </p>
        <p className="text-base sm:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: qp, opacity: 0.85 }}>
          <a href="https://x.com/KrakWatch" target="_blank" rel="noopener noreferrer"
            className="font-semibold underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity"
            style={{ color: b5 }}>Join the crew on X</a>{' '}
          🏴‍☠️
        </p>
        <p className="text-base sm:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: qp, opacity: 0.85 }}>
          Created by{' '}
          <a href="https://x.com/salwilliam" target="_blank" rel="noopener noreferrer"
            className="font-semibold underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity"
            style={{ color: b5 }}>@salwilliam</a>
        </p>

        {/* Anchor divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
          <span style={{ color: 'hsl(30 30% 55%)', fontSize: '1.1rem' }}>⚓</span>
          <div className="flex-1 h-px" style={{ background: 'hsl(30 30% 70%)' }} />
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
            Spreads Terminal ↗
          </a>
        </div>
      </div>
    </div>
  );
}
