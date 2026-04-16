import { Helmet } from 'react-helmet-async';
import './About.css';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About — Kraken Watch</title>
        <meta name="description" content="Kraken Watch is independent research on the Kraken/Payward and Ink ecosystem. Launched April 10, 2026." />
      </Helmet>
      <main className="about-page">
        <section className="about-hero">
          <div className="about-inner">
            <img src="/stamp-squid.png" alt="Squid stamp" className="about-stamp" />
            <h1 className="about-title">About</h1>
            <p className="about-sub">Independent dispatches on the Payward & Ink ecosystem</p>
          </div>
        </section>
        <section className="about-content">
          <div className="about-content-inner">
            <div className="about-card">
              <p>On April 10, 2026, we launched our own site — same credo: useful insights and data from across the Kraken, Payward, and Ink universe.</p>
              <p className="about-note">Kraken Watch is independent research, not affiliated with Kraken or Payward.</p>
              <div className="about-links">
                <a href="https://x.com/KrakWatch" target="_blank" rel="noopener noreferrer" className="about-link">
                  Follow @KrakWatch on X ↗
                </a>
                <a href="https://x.com/salwilliam" target="_blank" rel="noopener noreferrer" className="about-link">
                  @salwilliam ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
