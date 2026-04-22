const tabs = [
  { id: 'kraken',  label: 'Kraken Map',  url: '/' },
  { id: 'ink',     label: 'Ink Markets', url: '/ink' },
  { id: 'payward', label: 'Payward',     url: '/payward' },
  { id: 'alpha',   label: 'Briefs',      url: '/alpha-briefs' },
  { id: 'about',   label: 'About',       url: '/about' },
  { id: 'contact', label: '✉ Contact',   href: 'https://x.com/KrakWatch' },
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
            Trade
          </a>
        </div>
      </div>

      {/* Tab row */}
      <nav className="flex items-end px-4 sm:px-6 gap-1 overflow-x-auto" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          if (tab.href) {
            return (
              <a
                key={tab.id}
                href={tab.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-t transition-colors"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'hsl(38 25% 55%)',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                }}
              >
                {tab.label}
              </a>
            );
          }
          return (
            <a
              key={tab.id}
              href={tab.url}
              role="tab"
              aria-selected={isActive}
              onClick={(e) => { e.preventDefault(); onTabChange(tab.id); }}
              className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-t transition-colors"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.05em',
                color: isActive ? 'hsl(38 55% 80%)' : 'hsl(38 25% 55%)',
                background: isActive ? 'hsl(38 35% 88%)' : 'transparent',
                borderBottom: isActive ? 'none' : undefined,
                textDecoration: 'none',
              }}
            >
              {tab.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
