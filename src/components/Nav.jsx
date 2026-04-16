import './Nav.css';

const tabs = [
  { id: 'home',      label: 'Home',    icon: '⚓' },
  { id: 'ink',       label: 'Ink',     icon: '🦑' },
  { id: 'corporate', label: 'Payward', icon: '🗺' },
  { id: 'alpha',     label: 'Briefs',  icon: '📜' },
  { id: 'about',     label: 'About',   icon: '🌐' },
];

export default function Nav({ activeTab, onTabChange }) {
  return (
    <header className="nav" data-testid="top-nav">
      <div className="nav-inner">
        {/* Brand */}
        <button className="nav-brand" onClick={() => onTabChange('home')}>
          <img src="/stamp-pirate.png" alt="Kraken Watch mascot" className="nav-mascot" />
          <span className="nav-brand-name">KRAKEN WATCH</span>
          <span className="nav-beta">beta</span>
        </button>

        {/* Tab links */}
        <nav className="nav-links">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}
          <a
            href="https://x.com/KrakWatch"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link nav-link--external"
            title="Follow on X"
          >
            <svg className="nav-x-icon" viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href="https://terminal.spreads.fi/?ref=ZSNKR2"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-spreads"
          >
            Spreads Terminal ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
