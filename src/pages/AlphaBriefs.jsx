import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const briefs = [
  {
    id: 7,
    title: `Alpha Brief: Payward Acquires Bitnomial for $550M — Clearing the CFTC Trifecta`,
    date: `Apr 23, 2026`,
    headerImage: `/brief-bitnomial-header.png`,
    summary: `Payward is acquiring Bitnomial for up to $550M in cash and stock. Bitnomial is the first crypto-native U.S. exchange to hold the full CFTC license trifecta of exchange, clearinghouse, and brokerage, and the deal values Payward at $20B with expected close in H1 2026.

Why This Matters
- Provides fully regulated U.S. derivatives foundation that took Bitnomial more than a decade to build.
- Extends Kraken's U.S. derivatives build after NinjaTrader and Small Exchange, tying distribution, venue, and clearing into one stack.
- Opens B2B distribution via Payward Services to fintechs, banks, brokerages, and payment providers through a single integration.

Actionable Alpha

This is the real clearing-layer move. Front ends are replaceable. Settlement, margin, collateral, and contract design are not.

Bitnomial already built crypto settlement, crypto collateral, unified books, and 24/7 market structure around digital assets. Kraken now controls the regulated rails instead of renting access.

Expect faster rollout of U.S. spot margin, perps, options, and eventually tokenized or hybrid products after close.

ACTION → Get your APIs, capital, and trading flows set up on Kraken Pro now. Ink Points Season 1 is live, and more activity should increase your points balance and potential drop upside before this acquisition brings new products and derivatives volume onto Kraken.

— @KrakWatch`,
    url: `https://x.com/KrakWatch/status/2045160895873982658`,
    tag: `Corporate · Derivatives · IPO Watch`,
  },
  {
    id: 6,
    title: `Alpha Brief: NadoHQ Turns Their Docs Into an AI Agent (MCP Server)`,
    date: `Apr 16, 2026`,
    headerImage: `/alpha-briefs-hero.png`,
    summary: `@_kodziak announced that @nadoHQ shipped nado-dev-mcp — an MCP server that makes their entire developer knowledge base queryable by any AI tool. 24 doc resources, 13 tools, two personas. Not a chatbot wrapper — a structured, context-aware system any MCP client can plug into directly.

Two modes:
- Tech Lead — fuzzy-searches SDK docs, returns working TypeScript with correct imports, flags edge cases proactively
- Support — runs live chain diagnostics across 7 indexer streams: subaccount health, signer status, positions, order history, liquidation events

Static docs are a losing strategy in an AI-primary dev environment. Protocols that ship machine-readable, tool-compatible knowledge layers onboard developers faster and cut support overhead. The deeper play is the pairing: Nado already shipped nado-trading-mcp for execution. Add nado-dev-mcp for knowledge and you have a full agentic loop — an AI that can reason about the protocol and act on it in the same session.

Watch for other DeFi protocols forking this pattern. Ink ecosystem agent narrative becoming a tradeable theme if the coordinated builder push continues publicly.

— @KrakWatch`,
    url: `https://x.com/KrakWatch/status/2044624891056714167`,
    tag: `Ink Ecosystem`,
  },
  {
    id: 5,
    title: `Alpha Brief: Kraken IPO Odds Hit 75% — Something Is Moving the Market`,
    date: `Apr 14, 2026`,
    headerImage: `/brief-ipo-header.jpg`,
    summary: `Kraken's IPO prediction markets made a violent move today. Polymarket at 77%. Kalshi at 73.5%. Average: 75.2% — up ~25 points from this morning's open.

The backdrop: Payward confidentially filed its S-1 in November 2025, then paused the process in March citing market conditions. Today's catalyst is unclear — Deutsche Börse's $200M stake announced this morning is one input. Reports of CEO comments on the IPO process are circulating, though details remain unconfirmed. Markets may also simply be conflating the DB deal with IPO momentum.

What's certain: prediction market participants are pricing a meaningfully higher probability that the process is back on. Whether that reflects new information or optimistic interpretation, the directional signal is hard to ignore.

— @KrakWatch`,
    url: `https://x.com/KrakWatch`,
    tag: `IPO Watch`,
  },
  {
    id: 4,
    title: `Alpha Brief: Deutsche Börse's $200M Kraken Stake Builds the Institutional Bridge`,
    date: `Apr 14, 2026`,
    headerImage: `/brief-db-header.jpg`,
    summary: `Deutsche Börse Group — operator of the Frankfurt Stock Exchange, Eurex, and Clearstream — is acquiring a $200M stake in Payward, Inc., the parent company behind Kraken. The structure: a secondary share transaction yielding 1.5% fully diluted equity, implying a $13.3B valuation. Closing expected Q2, subject to regulatory approvals.

This deepens a strategic partnership announced in December 2025. The roadmap spans trading, custody, settlement, collateral management, and tokenized assets — running both directions.

Already in motion: Kraken integrates with 360T, Deutsche Börse's FX venue, giving Kraken clients bank-grade liquidity for fiat on/off-ramps. Deutsche Börse's network gets Kraken Embed for white-label crypto trading and custody across Europe and the US.

Coming: Eurex derivatives on Kraken. Clearstream-held securities tokenized and distributed to Kraken's client base. xStocks integrated into 360X — expanding tokenized equities reach significantly.

The Bottom Line: Deutsche Börse gets a crypto distribution channel for its institutional network. Kraken gets European regulatory credibility and a blue-chip anchor on the cap table ahead of its IPO. The $200M is the price of a two-way bridge between Europe's largest regulated exchange infrastructure and the most institutionally-positioned crypto exchange in the US.

— @KrakWatch`,
    url: `https://x.com/KrakWatch/status/2044116263992013178`,
    tag: `Corporate · IPO Watch · Institutional`,
  },
  {
    id: 3,
    title: `Alpha Brief: Ink Points Turns Kraken's 15M Users Into an L2 Growth Engine`,
    date: `Apr 14, 2026`,
    headerImage: `/brief-ink-points-header.jpg`,
    summary: `Most L2s grow bottom-up — a protocol launches, farmers show up, TVL gets rented. Ink is built different.

Kraken just wired its 15M+ user, KYC'd, regulated exchange into the @inkonchain ecosystem via Ink Points — a loyalty program rewarding trading, staking, and engagement on Kraken Pro. Season 1 started April 6. No other L2 has a distribution channel like this. That's not a feature — it's a moat.

Three platforms now have confirmed Ink incentives: @tydrohq (lending/borrowing, Season 2 live), @nadoHQ (perp DEX, dual INK + Nado rewards), and now Kraken Pro. Each addition draws more users toward Ink before day one of any token launch — manufacturing demand before supply exists.

Follow the FDV logic. More points earners → more bridging → higher TVS → stronger launch narrative. Polymarket prices $INK above $500M FDV at 52.5%. The points program is a direct, bullish input to that number.

There's also an IPO angle. Kraken showing it can move custody customers into active DeFi participants — not just hold their assets — changes the story for public market investors. A growing, engaged on-chain user base tied to the exchange strengthens the thesis that Kraken's crypto-native strategy has real traction beyond spot trading.

The Bottom Line: Ink Points is Kraken using its regulated, 15M-user exchange as a top-down growth engine for its own L2. Anyone positioning for a $INK airdrop or holding Kraken ecosystem exposure should treat this as structurally bullish.

— @KrakWatch`,
    url: `https://x.com/KrakWatch/status/2044093823127527837`,
    tag: `Ink · IPO Watch · DeFi`,
  },
  {
    id: 1,
    title: `Alpha Brief: Agentic Prime Brokerage on Ink`,
    date: `Apr 8, 2026`,
    summary: `A live demonstration of an onchain agent treating Ink as a single execution grid — reading positions, shifting collateral, and routing trades through Tydro and Nado from a single prompt. Three MCP servers wired into a shared brain: Tydro lending hooks, Nado spot/perp rails, and Ink MCP for chain state. Prime brokerage rewritten as code.`,
    url: `https://x.com/KrakWatch/status/2042024028941017562`,
    tag: `DeFi · Agentic`,
  },
  {
    id: 2,
    title: `Alpha Brief: Payward Appoints Robert Moore as CFO`,
    date: `Apr 8, 2026`,
    summary: `Payward promoted Robert Moore to Chief Financial Officer effective immediately. Moore joined four years ago, led the NinjaTrader acquisition, and built the company's financial architecture. The bullish read: internal talent deep enough to promote from within. The bear case: institutional investors and underwriters may prefer external public-market pedigree. Watch IR, treasury, and public-company reporting hires as the signal.`,
    url: `https://x.com/KrakWatch/status/2041992852381561000`,
    tag: `Corporate · IPO Watch`,
  },
];

function BriefCard({ brief }) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = brief.summary.split('\n\n');
  const preview = paragraphs.slice(0, 1).join('\n\n');
  const rest = paragraphs.slice(1);

  return (
    <div className="parchment-card rounded-lg overflow-hidden" data-testid={`brief-${brief.id}`}>
      <div className="h-[3px]" style={{ background: 'hsl(350 50% 32%)' }} />
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em', background: 'hsl(36 28% 80%)', color: 'hsl(28 40% 22%)', border: '1px solid hsl(33 25% 65%)' }}>
            {brief.tag}
          </span>
          <div className="flex items-center gap-1 text-xs" style={{ color: 'hsl(30 20% 48%)' }}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {brief.date}
          </div>
        </div>
        <h3 className="text-lg font-bold leading-snug mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'hsl(28 40% 16%)' }}>
          {brief.title}
        </h3>
        <div className="text-sm leading-relaxed space-y-3" style={{ fontFamily: 'var(--font-serif)', color: 'hsl(28 30% 28%)' }}>
          <p style={{ whiteSpace: 'pre-line' }}>{preview}</p>
          {expanded && rest.map((p, i) => <p key={i} style={{ whiteSpace: 'pre-line' }}>{p}</p>)}
        </div>
        {rest.length > 0 && (
          <button onClick={() => setExpanded(!expanded)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'hsl(350 50% 35%)' }}>
            {expanded ? (
              <><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>Collapse</>
            ) : (
              <><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>Read full brief</>
            )}
          </button>
        )}
        <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid hsl(33 25% 72%)' }}>
          <a href={brief.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-70"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'hsl(350 50% 35%)' }}
            data-testid={`link-brief-${brief.id}`}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            View on X
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AlphaBriefs() {
  return (
    <>
      <Helmet>
        <title>Alpha Briefs — Kraken Watch</title>
        <meta name="description" content="Short-form intelligence on Kraken, Ink L2, and the Payward ecosystem. Updated as events develop." />
        <link rel="canonical" href="https://krakenwatch.com/briefs" />
      </Helmet>

      <div className="p-6 space-y-6 max-w-[900px] mx-auto">
        <div className="w-full rounded-xl overflow-hidden shadow-lg border-2" style={{ borderColor: 'hsl(30 30% 60%)' }}>
          <img src="/alpha-briefs-hero.png" alt="Alpha Briefs" className="w-full object-cover" />
        </div>

        <div>
          <div className="map-divider mt-2" />
          <p className="text-sm mt-2" style={{ color: 'hsl(30 20% 42%)', fontFamily: 'var(--font-serif)' }}>
            Short-form intelligence on Kraken, Ink L2, and the Payward ecosystem. Updated as events develop.
          </p>
        </div>

        <div className="space-y-4">
          {briefs.map(brief => <BriefCard key={brief.id} brief={brief} />)}
        </div>
      </div>
    </>
  );
}
