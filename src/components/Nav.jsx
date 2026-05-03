import { useLocation, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const IconPrediction = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const IconInk = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <path d="M12 2C8 7 5 10.5 5 14a7 7 0 0 0 14 0c0-3.5-3-7-7-12z"/>
    <path d="M12 14.5a2.5 2.5 0 0 1 2.5 2.5"/>
  </svg>
);

const IconPayward = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="1.5"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);

const IconBlog = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconExperimental = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <path d="M9 3h6"/>
    <path d="M10 3v6.5L5.5 17A2 2 0 0 0 7.4 20h9.2a2 2 0 0 0 1.9-3L14 9.5V3"/>
    <line x1="6" y1="14" x2="18" y2="14"/>
  </svg>
);

const IconAbout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const primaryNavLinks = [
  { href: '/prediction', label: 'Prediction', Icon: IconPrediction },
  { href: '/ink', label: 'Ink Ecosystem', Icon: IconInk },
  { href: '/payward', label: 'Payward Map', Icon: IconPayward },
];

const menuItems = [
  { href: '/blog', label: 'Blog', Icon: IconBlog, external: false },
  { href: '/about', label: 'About', Icon: IconAbout, external: false },
  { href: '/experimental', label: 'Experimental', Icon: IconExperimental, external: false },
  { href: 'https://x.com/KrakWatch', label: '@KrakWatch on X', Icon: IconX, external: true },
];

const menuItemStyle = {
  fontFamily: 'var(--font-display)',
  letterSpacing: '0.04em',
  color: 'hsl(38 35% 65%)',
  textDecoration: 'none',
};

function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex flex-col items-center justify-center w-8 h-8 gap-1.5 rounded transition-opacity hover:opacity-70"
        style={{ color: 'hsl(38 35% 65%)' }}
      >
        <span className="block w-4 h-px transition-all duration-200" style={{ background: 'currentColor', transform: open ? 'translateY(5px) rotate(45deg)' : 'none' }} />
        <span className="block w-4 h-px transition-all duration-200" style={{ background: 'currentColor', opacity: open ? 0 : 1 }} />
        <span className="block w-4 h-px transition-all duration-200" style={{ background: 'currentColor', transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none' }} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-lg shadow-xl overflow-hidden z-50"
          style={{ background: 'hsl(30 30% 18%)', border: '1px solid hsl(30 25% 28%)' }}
        >
          {menuItems.map(item => (
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-white/5"
                style={menuItemStyle}
              >
                <item.Icon />
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-white/5"
                style={menuItemStyle}
              >
                <item.Icon />
                {item.label}
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 shrink-0" style={{ backgroundColor: 'var(--nav-bg)', borderBottom: '1px solid var(--nav-border)' }} data-testid="top-nav">
      <div className="flex items-center justify-between px-4 sm:px-6 pt-2 pb-1">
        <a href="/prediction" className="flex items-center gap-3 shrink-0 transition-opacity hover:opacity-80">
          <img
            src="/stamp-pirate.png"
            alt="Kraken Watch mascot"
            className="object-contain shrink-0"
            style={{ width: '80px', height: '80px' }}
          />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span
                className="text-2xl font-bold tracking-wide"
                style={{ fontFamily: 'var(--font-display)', color: 'hsl(38 60% 82%)' }}
              >
                Kraken Watch
              </span>
              <span
                className="hidden sm:inline text-[10px] font-medium px-1.5 py-0.5 rounded"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'hsl(38 35% 58%)',
                  border: '1px solid hsl(38 25% 42%)',
                  letterSpacing: '0.12em',
                }}
              >
                beta
              </span>
            </div>
            <p className="hidden sm:block text-[10px] mt-0.5" style={{ fontFamily: 'var(--font-serif)', color: 'hsl(38 25% 52%)', fontStyle: 'italic' }}>
              Chart the crypto frontier in one handy place.
            </p>
          </div>
        </a>

        <div className="flex items-center gap-2">
          <a
            href="https://terminal.spreads.fi/?ref=ZSNKR2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all"
            style={{
              background: 'hsl(350 45% 28%)',
              color: 'hsl(38 50% 85%)',
              border: '1px solid hsl(350 35% 38%)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.05em',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            <span className="hidden sm:inline">Trade</span>
          </a>
          <HamburgerMenu />
        </div>
      </div>

      <nav className="flex items-center gap-0 px-4 sm:px-6 pb-0 overflow-x-auto" data-testid="tab-nav">
        {primaryNavLinks.map(({ href, label, Icon }) => {
          const active = location.pathname === href ||
            (href === '/prediction' && (location.pathname === '/' || location.pathname === '')) ||
            (href !== '/prediction' && href !== '/ink' && href !== '/payward' && location.pathname.startsWith(href + '/'));
          const cls = "flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all duration-150 select-none border-b-2";
          const style = {
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em',
            color: active ? 'hsl(38 60% 85%)' : 'hsl(38 25% 52%)',
            borderBottomColor: active ? 'hsl(38 55% 68%)' : 'transparent',
            textDecoration: 'none',
          };
          return (
            <a key={href} href={href} className={cls} style={style} data-testid={`tab-${href.replace('/', '')}`}>
              <Icon />
              {label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
