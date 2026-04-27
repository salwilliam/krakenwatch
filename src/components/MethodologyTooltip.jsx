import { useState, useRef, useEffect } from 'react';

const TEXT = 'Derived from multiple market data sources using Kraken Watch\u2019s proprietary methodology.';

export default function MethodologyTooltip() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    document.addEventListener('touchstart', handle);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('touchstart', handle);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex items-center" style={{ verticalAlign: 'middle' }}>
      <button
        type="button"
        aria-label="Methodology information"
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{
          background: 'none',
          border: 'none',
          padding: '0 2px',
          cursor: 'pointer',
          color: 'hsl(30 20% 55%)',
          fontSize: '0.65rem',
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        ⓘ
      </button>
      {open && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '5px',
            width: '200px',
            background: 'hsl(28 40% 14%)',
            color: 'hsl(38 50% 82%)',
            fontSize: '0.65rem',
            lineHeight: 1.4,
            padding: '6px 8px',
            borderRadius: '5px',
            pointerEvents: 'none',
            zIndex: 50,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            whiteSpace: 'normal',
            textAlign: 'center',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
          }}
        >
          {TEXT}
        </span>
      )}
    </span>
  );
}
