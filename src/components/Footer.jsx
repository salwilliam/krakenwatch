import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>
        Kraken Watch is independent research, not affiliated with Kraken or Payward. &copy; {year}
      </p>
      <p className="footer-sub">
        Data updated daily · <a href="https://x.com/KrakWatch" target="_blank" rel="noopener noreferrer">@KrakWatch</a>
      </p>
    </footer>
  );
}
