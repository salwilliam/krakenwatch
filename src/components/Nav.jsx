import { useLocation, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { SubscribeModal } from '@workspace/subscribe';

// ── Icons ────────────────────────────────────────────────────────────────────

const IconPrediction = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
);
const IconInk = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
    <path d="M12 2C8 7 5 10.5 5 14a7 7 0 0 0 14 0c0-3.5-3-7-7-12z"/><path d="M12 14.5a2.5 2.5 0 0 1 2.5 2.5"/>
  </svg>
);
const IconPayward = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
    <rect x="2" y="7" width="20" height="14" rx="1.5"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);
const IconXStocks = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
    <polyline points="3 17 8 12 12 16 17 9 21 13"/><line x1="3" y1="20" x2="21" y2="20"/>
    <line x1="8" y1="20" x2="8" y2="12"/><line x1="17" y1="20" x2="17" y2="9"/>
  </svg>
);
const IconVs = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
    <line x1="3" y1="6" x2="10" y2="18"/><line x1="10" y1="6" x2="3" y2="18"/>
    <line x1="14" y1="6" x2="21" y2="6"/><line x1="14" y1="12" x2="19" y2="12"/><line x1="14" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconBlog = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconExperimental = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
    <path d="M9 3h6"/><path d="M10 3v6.5L5.5 17A2 2 0 0 0 7.4 20h9.2a2 2 0 0 0 1.9-3L14 9.5V3"/>
    <line x1="6" y1="14" x2="18" y2="14"/>
  </svg>
);
const IconAbout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const IconChevron = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-3 h-3 shrink-0 transition-transform duration-200"
    style={{ transform: open ? 'rotate(180deg)' : 'none' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ── Nav groups ───────────────────────────────────────────────────────────────

const GROUPS = [
  {
    label: 'Dashboards',
    links: [
      { href: '/prediction',        label: 'Prediction', Icon: IconPrediction },
      { href: '/ink',               label: 'Ink',        Icon: IconInk        },
      { href: '/payward',           label: 'Payward',    Icon: IconPayward    },
      { href: '/xstocks',           label: 'xStocks',    Icon: IconXStocks    },
    ],
  },
  {
    label: 'Analysis',
    links: [
      { href: '/kraken-vs-coinbase', label: 'KRAK vs. COIN', Icon: IconVs          },
      { href: '/blog',               label: 'Blog',         Icon: IconBlog        },
      { href: '/experimental',       label: 'Experimental', Icon: IconExperimental },
      { href: '/about',              label: 'About',        Icon: IconAbout       },
    ],
  },
];

// ── Dropdown component ───────────────────────────────────────────────────────

function NavDropdown({ group, anyActive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap select-none transition-all duration-150 border-b-2"
        style={{
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.04em',
          color: anyActive ? 'hsl(38 60% 85%)' : 'hsl(38 25% 55%)',
          borderBottomColor: anyActive ? 'hsl(38 55% 68%)' : 'transparent',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <span className="hidden sm:inline">{group.label}</span>
        <span className="sm:hidden">{group.label === 'Dashboards' ? 'Dash' : 'More'}</span>
        <IconChevron open={open} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-0 w-44 rounded-b-lg shadow-xl overflow-hidden z-50"
          style={{ background: 'hsl(30 30% 18%)', border: '1px solid hsl(30 25% 28%)', borderTop: 'none' }}
        >
          {group.links.map(({ href, label, Icon }) => (
            <Link
              key={href}
              to={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-white/5"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.04em',
                color: 'hsl(38 35% 65%)',
                textDecoration: 'none',
              }}
            >
              <Icon />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main nav ─────────────────────────────────────────────────────────────────

export default function Nav() {
  const location = useLocation();
  const [subOpen, setSubOpen] = useState(false);

  function groupHasActive(group) {
    return group.links.some(({ href }) => {
      if (href === '/prediction' || href === '/ink' || href === '/payward') {
        return location.pathname === href;
      }
      return location.pathname === href || location.pathname.startsWith(href + '/');
    });
  }

  return (
    <>
      <header
        className="sticky top-0 z-50 shrink-0"
        style={{ backgroundColor: 'var(--nav-bg)', borderBottom: '1px solid var(--nav-border)' }}
        data-testid="top-nav"
      >
        <div className="flex items-center justify-between px-3 sm:px-6 pt-1.5 sm:pt-2 pb-0">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-3 shrink-0 transition-opacity hover:opacity-80">
            <img src="/logo-lighthouse.png" alt="Kraken Watch logo" className="object-contain shrink-0 w-8 h-8 sm:w-[84px] sm:h-[84px]" />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-2xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: 'hsl(38 60% 82%)' }}>
                  Kraken Watch
                </span>
                <span className="hidden sm:inline text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{ fontFamily: 'var(--font-sans)', color: 'hsl(38 35% 58%)', border: '1px solid hsl(38 25% 42%)', letterSpacing: '0.12em' }}>
                  beta
                </span>
              </div>
              <p className="hidden sm:block text-[10px] mt-0.5" style={{ fontFamily: 'var(--font-serif)', color: 'hsl(38 25% 52%)', fontStyle: 'italic' }}>
                Chart the crypto frontier in one handy place.
              </p>
            </div>
          </Link>

          {/* Right side: dropdowns + Subscribe + X button */}
          <div className="flex items-center">
            {/* Dropdown nav tabs */}
            <nav className="flex items-center" data-testid="tab-nav">
              {GROUPS.map(group => (
                <NavDropdown key={group.label} group={group} anyActive={groupHasActive(group)} />
              ))}
            </nav>

            {/* Subscribe button */}
            <button
              onClick={() => setSubOpen(true)}
              className="hidden sm:flex items-center ml-2 px-3 py-1.5 rounded text-xs font-semibold transition-all hover:opacity-80"
              style={{
                background: 'hsl(38 40% 30%)',
                color: 'hsl(38 55% 80%)',
                border: '1px solid hsl(38 35% 42%)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.05em',
                cursor: 'pointer',
              }}
            >
              Subscribe
            </button>

            {/* X button */}
            <a
              href="https://x.com/KrakWatch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded text-xs font-semibold transition-all hover:opacity-80"
              style={{
                background: 'hsl(0 0% 10%)',
                color: 'hsl(0 0% 92%)',
                border: '1px solid hsl(0 0% 22%)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.05em',
              }}
            >
              <IconX />
              <span className="hidden sm:inline">@KrakWatch</span>
            </a>
          </div>

        </div>
      </header>

      <SubscribeModal
        isOpen={subOpen}
        onClose={() => setSubOpen(false)}
        source="header"
      />
    </>
  );
}
