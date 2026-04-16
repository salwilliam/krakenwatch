import './Nav.css';

const tabs = [
  { id: 'home',      label: 'Home',    icon: '⚓' },
  { id: 'ink',       label: 'Ink',     icon: '📊' },
  { id: 'corporate', label: 'Payward', icon: '🗺' },
  { id: 'alpha',     label: 'Briefs',  icon: '📋' },
  { id: 'about',     label: 'About',   icon: '🌐' },
  { id: 'contact',   label: 'Contact', icon: '✉',  href: 'https://x.com/KrakWatch' },
];

export default function Nav({ activeTab, onTabChange }) {
  return (
    <header className="nav">
      {/* Top row: brand + external actions */}
      <div className="nav-top">
        <button className="nav-brand" onClick={() => onTabChange('home')}>
          <img src="/stamp-pirate.png" alt="Kraken Watch" className="nav-mascot" />
          <span className="nav-brand-name">Kraken Watch</span>
          <span className="nav-beta">beta</span>
        </button>
        <div className="nav-actions">
          <a href="https://x.com/KrakWatch" target="_blank" rel="noopener noreferrer" className="nav-x" title="Follow on X">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://terminal.spreads.fi/?ref=ZSNKR2" target="_blank" rel="noopener noreferrer" className="nav-spreads">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Spreads Terminal
          </a>
        </div>
      </div>

      {/* Bottom row: tab links */}
      <nav className="nav-tabs">
        {tabs.map(tab => {
          if (tab.href) {
            return (
              <a key={tab.id} href={tab.href} target="_blank" rel="noopener noreferrer" className="nav-tab">
                <span>{tab.icon}</span> {tab.label}
              </a>
            );
          }
          return (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
