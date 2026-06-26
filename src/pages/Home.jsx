import { Link } from 'react-router-dom';

const SECTIONS = [
  { to: '/ink',        label: 'Ink Ecosystem',    bgPos: '0% 0%' },
  { to: '/payward',    label: 'Payward Map',       bgPos: '100% 0%' },
  { to: '/prediction', label: 'Prediction Watch',  bgPos: '0% 100%' },
  { to: '/xstocks',    label: 'xStocks Helm',      bgPos: '100% 100%' },
];

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f2ece0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          color: '#2a2318',
          letterSpacing: '0.05em',
          margin: '0 0 28px 0',
          textAlign: 'center',
        }}
      >
        Kraken Watch
      </h1>

      <style>{`
        .kw-desktop { display: block; }
        .kw-mobile  { display: none;  }
        @media (max-width: 639px) {
          .kw-desktop { display: none;  }
          .kw-mobile  { display: flex;  }
        }
        .kw-fight-card:hover { opacity: 0.9; }
        .kw-fight-card:hover .kw-fight-label { opacity: 1; }
        .kw-fight-label { opacity: 0; transition: opacity 0.2s; }
      `}</style>

      {/* Desktop: composite image with transparent overlay links */}
      <div className="kw-desktop" style={{ position: 'relative', width: '100%', maxWidth: '900px' }}>
        <img
          src="/landing-grid.png"
          alt="Kraken Watch sections"
          style={{ width: '100%', display: 'block', borderRadius: '8px' }}
          draggable={false}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
          }}
        >
          {SECTIONS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              aria-label={label}
              style={{ display: 'block', cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>

      {/* Mobile: stacked single-column cards, each showing its quadrant */}
      <div className="kw-mobile" style={{ flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '480px' }}>
        {SECTIONS.map(({ to, label, bgPos }) => (
          <Link
            key={to}
            to={to}
            aria-label={label}
            style={{
              display: 'block',
              borderRadius: '10px',
              overflow: 'hidden',
              aspectRatio: '16 / 9',
              backgroundImage: 'url(/landing-grid.png)',
              backgroundSize: '200% 200%',
              backgroundPosition: bgPos,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* KR vs CB fight card — full width strip below grid */}
      <Link
        to="/kraken-vs-coinbase"
        className="kw-fight-card"
        style={{
          display: 'block',
          marginTop: '16px',
          width: '100%',
          maxWidth: '900px',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
          textDecoration: 'none',
          cursor: 'pointer',
          border: '2px solid hsl(30 30% 55%)',
          transition: 'opacity 0.2s',
        }}
      >
        <img
          src="/brief-kraken-vs-coinbase.png"
          alt="Kraken vs Coinbase — investor comparison"
          draggable={false}
          style={{ width: '100%', display: 'block', maxHeight: '180px', objectFit: 'cover', objectPosition: 'center 22%' }}
        />
        <div
          className="kw-fight-label"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '10px 16px',
            background: 'linear-gradient(transparent, rgba(20,12,6,0.82))',
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            color: 'hsl(38 55% 78%)',
            letterSpacing: '0.05em',
          }}
        >
          Kraken vs Coinbase — Live Investor Dashboard →
        </div>
      </Link>

    </div>
  );
}
