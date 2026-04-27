export default {
  slug: "nadohq-docs-ai-agent-mcp",
  title: "Alpha Brief: NadoHQ Turns Their Docs Into an AI Agent (MCP Server)",
  date: "2026-04-16",
  dateDisplay: "Apr 16, 2026",
  category: "Ink Ecosystem",
  tags: ["Ink", "NadoHQ", "AI", "MCP", "DeFi"],
  description: "NadoHQ ships nado-dev-mcp, an MCP server that makes their entire developer knowledge base queryable by any AI tool — 24 doc resources, 13 tools, two personas.",
  image: "/alpha-briefs-hero.png",
  status: "published",
  xUrl: "https://x.com/KrakWatch/status/2044624891056714167",
  tag: "Ink Ecosystem",
  body: `@_kodziak announced that @nadoHQ shipped nado-dev-mcp — an MCP server that makes their entire developer knowledge base queryable by any AI tool. 24 doc resources, 13 tools, two personas. Not a chatbot wrapper — a structured, context-aware system any MCP client can plug into directly.

Two modes:
- Tech Lead — fuzzy-searches SDK docs, returns working TypeScript with correct imports, flags edge cases proactively
- Support — runs live chain diagnostics across 7 indexer streams: subaccount health, signer status, positions, order history, liquidation events

Static docs are a losing strategy in an AI-primary dev environment. Protocols that ship machine-readable, tool-compatible knowledge layers onboard developers faster and cut support overhead. The deeper play is the pairing: Nado already shipped nado-trading-mcp for execution. Add nado-dev-mcp for knowledge and you have a full agentic loop — an AI that can reason about the protocol and act on it in the same session.

Watch for other DeFi protocols forking this pattern. Ink ecosystem agent narrative becoming a tradeable theme if the coordinated builder push continues publicly.

— @KrakWatch`,
};
