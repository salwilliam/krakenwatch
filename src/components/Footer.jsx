// Footer is only shown on non-home tabs
export default function Footer({ activeTab }) {
  if (activeTab === 'home') return null;
  return (
    <footer style={{
      background: 'var(--nav-bg)',
      borderTop: '1px solid var(--nav-border)',
      color: 'hsl(38 20% 55%)',
      textAlign: 'center',
      padding: '1.25rem',
      fontSize: '0.78rem',
      marginTop: 'auto',
    }}>
      <p>Kraken Watch is independent research, not affiliated with Kraken or Payward. © {new Date().getFullYear()}</p>
      <p style={{ marginTop: '0.2rem', fontSize: '0.72rem', color: 'hsl(38 15% 45%)' }}>
        Data updated daily · <a href="https://x.com/KrakWatch" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(38 25% 62%)' }}>@KrakWatch</a>
      </p>
    </footer>
  );
}
