const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
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

const IconBriefs = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
    <path d="M14 2v6h6"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="13" y2="17"/>
  </svg>
);

const IconAbout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 8h.01"/>
    <path d="M11 12h1v4h1"/>
  </svg>
);

const IconExperimental = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <path d="M9 3h6v7l3.5 8.5A1 1 0 0 1 17.6 20H6.4a1 1 0 0 1-.9-1.5L9 10V3z"/>
    <line x1="9" y1="3" x2="15" y2="3"/>
    <path d="M7.5 15h9"/>
  </svg>
);

const IconContact = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const tabs = [
  { id: 'home',         label: 'Home',         Icon: IconHome },
  { id: 'ink',          label: 'Ink',           Icon: IconInk },
  { id: 'corporate',    label: 'Payward',       Icon: IconPayward },
  { id: 'alpha',        label: 'Briefs',        Icon: IconBriefs },
  { id: 'about',        label: 'About',         Icon: IconAbout },
  { id: 'experimental', label: 'Experimental',  Icon: IconExperimental },
  { id: 'contact',      label: 'Contact',       Icon: IconContact, href: 'https://x.com/KrakWatch' },
];

export default function Nav({ activeTab, onTabChange }) {
  return (
    <header className="sticky top-0 z-50 shrink-0" style={{ backgroundColor: 'var(--nav-bg)', borderBottom: '1px solid var(--nav-border)' }} data-testid="top-nav">
      {/* Top row */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-2 pb-1">
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/stamp-pirate.png"
            alt="Kraken Watch mascot"
            className="object-contain shrink-0"
            style={{ width: '80px', height: '80px' }}
          />
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
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://x.com/KrakWatch"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded transition-opacity hover:opacity-70"
            style={{ color: 'hsl(38 35% 65%)' }}
            aria-label="@KrakWatch on X"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
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
            <span className="hidden sm:inline">Spreads Terminal</span>
          </a>
        </div>
      </div>

      {/* Tab row */}
      <nav className="flex items-center gap-0 px-4 sm:px-6 pb-0 overflow-x-auto" data-testid="tab-nav">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          const cls = "flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all duration-150 select-none border-b-2";
          const style = {
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em',
            color: active ? 'hsl(38 60% 85%)' : 'hsl(38 25% 52%)',
            borderBottomColor: active ? 'hsl(38 55% 68%)' : 'transparent',
            background: 'transparent',
          };
          if (tab.href) {
            return (
              <a key={tab.id} href={tab.href} target="_blank" rel="noopener noreferrer"
                className={cls}
                style={{ ...style, color: 'hsl(38 25% 52%)', borderBottomColor: 'transparent' }}
              >
                <tab.Icon />
                {tab.label}
              </a>
            );
          }
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)}
              className={cls} style={style} data-testid={`tab-${tab.id}`}
            >
              <tab.Icon />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
