export default function Footer({ activeTab }) {
  if (activeTab === 'kraken' || activeTab === 'ink' || activeTab === 'payward') return null;
  return (
    <footer style={{ backgroundColor: 'var(--nav-bg)', borderTop: '1px solid var(--nav-border)' }}
      className="text-center py-5 px-4 text-xs shrink-0"
    >
      <p style={{ color: 'hsl(38 20% 55%)' }}>
        Kraken Watch is independent research, not affiliated with Kraken or Payward. © {new Date().getFullYear()}
      </p>
      <p className="mt-1" style={{ color: 'hsl(38 15% 45%)', fontSize: '0.7rem' }}>
        Data updated daily ·{' '}
        <a href="https://x.com/KrakWatch" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(38 25% 62%)' }}>
          @KrakWatch
        </a>
      </p>
    </footer>
  );
}
