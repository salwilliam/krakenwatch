const tabs = [
  { id: 'home',      label: 'Home' },
  { id: 'ink',       label: 'Ink' },
  { id: 'corporate', label: 'Payward' },
  { id: 'alpha',     label: 'Briefs' },
  { id: 'about',     label: 'About' },
  { id: 'contact',   label: '✉ Contact', href: 'https://x.com/KrakWatch' },
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
                {tab.label}
              </a>
            );
          }
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)}
              className={cls} style={style} data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
