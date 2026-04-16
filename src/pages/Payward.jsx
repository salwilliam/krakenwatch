
export default function Payward() {
  return (
    <>
      <Helmet>
        <title>Payward Corporate Map — Kraken Watch</title>
        <meta name="description" content="Full Payward entity structure, subsidiaries, regulatory filings, and jurisdiction footprint for the Kraken parent company." />
        <link rel="canonical" href="https://krakenwatch.com/payward" />
        <meta property="og:title" content="Payward Corporate Map — Kraken Watch" />
        <meta property="og:description" content="Full Payward entity structure, subsidiaries, regulatory filings, and jurisdiction footprint." />
        <meta property="og:url" content="https://krakenwatch.com/payward" />
      </Helmet>

      <main className="payward-page" id="payward">
        <section className="payward-hero">
          <div className="payward-hero-inner">
            <img src="/payward-kraken-seal.png" alt="Payward" className="payward-seal" />
            <h1 className="payward-title">Payward</h1>
            <p className="payward-sub">Corporate structure, entities & regulatory footprint</p>
          </div>
        </section>

        <section className="payward-content" id="payward-entities">
          <div className="payward-content-inner">
            <p className="payward-placeholder">
              Entity map and corporate structure brief coming soon. See <a href="/alpha-briefs">Alpha Briefs</a> for the full Payward report.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
