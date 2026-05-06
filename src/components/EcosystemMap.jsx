import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const protocols = [
  { id: 'tydro', label: 'Tydro', category: 'defi', score: 95, tvl: '$401.7M', description: 'Lending / Money Market (Aave v3). Ink\'s flagship DeFi protocol. Exclusive until Oct 2026.', url: 'https://tydro.com', krakenTier: 'foundation' },
  { id: 'nado', label: 'Nado', category: 'defi', score: 82, tvl: '~$52M', description: 'CLOB DEX — Perps, Spot, Margin. $17B Jan volume. Nado MCP launched Mar 31, 2026.', url: 'https://nadohq.xyz', krakenTier: 'foundation' },
  { id: 'rails', label: 'Rails', category: 'defi', score: 60, description: 'Institutional hybrid perps DEX. $14M raised, Kraken investor.', url: 'https://rails.xyz', krakenTier: 'partner' },
  { id: 'velodrome', label: 'Velodrome', category: 'defi', score: 56, tvl: '$1.05M', description: 'AMM DEX / Liquidity Hub. Dominant Superchain AMM.', url: 'https://velodrome.finance', krakenTier: 'partner' },
  { id: 'dinero', label: 'Dinero', category: 'defi', score: 40, tvl: '~$270K', description: 'Liquid Staking (iETH). Official Kraken staking integration.', url: 'https://dineroprotocol.xyz', krakenTier: 'partner' },
  { id: 'inkyswap', label: 'InkySwap', category: 'defi', score: 28, tvl: '$790K', description: 'Ink-native community DEX. InkyPump graduation venue.', url: 'https://inkyswap.com', krakenTier: 'standard' },
  { id: 'superbridge', label: 'Superbridge', category: 'bridge', score: 45, tvl: '$58.3M', description: 'Canonical OP bridge UI. Native Ink entry point.', url: 'https://superbridge.app', krakenTier: 'standard' },
  { id: 'across', label: 'Across', category: 'bridge', score: 42, description: 'Intent-based bridge. Trust-minimized, sub-minute withdrawals.', url: 'https://across.to', krakenTier: 'standard' },
  { id: 'relay', label: 'Relay', category: 'bridge', score: 35, description: '2.7s median bridge. Instant cross-chain by Reservoir.', url: 'https://relay.link', krakenTier: 'standard' },
  { id: 'layerzero', label: 'LayerZero', category: 'infrastructure', score: 65, description: 'Cross-chain messaging. Powers USDT0, Stargate, USDG0.', url: 'https://layerzero.network', krakenTier: 'standard' },
  { id: 'redstone', label: 'RedStone', category: 'infrastructure', score: 50, description: 'Official Ink oracle partner. First oracle at mainnet.', url: 'https://redstone.finance', krakenTier: 'partner' },
  { id: 'gelato', label: 'Gelato', category: 'infrastructure', score: 48, description: 'RaaS, automation, fault proof challenger. Core security.', url: 'https://gelato.network', krakenTier: 'partner' },
  { id: 'inkmcp', label: 'Ink MCP', category: 'infrastructure', score: 38, description: 'Chain-level MCP server. Agentic stack gateway for local execution.', url: 'https://inkonchain.com', krakenTier: 'foundation' },
  { id: 'krakenwallet', label: 'Kraken Wallet', category: 'infrastructure', score: 55, description: 'Non-custodial. Native Ink wallet. Free ETH withdrawals.', url: 'https://x.com/krakenwallet', krakenTier: 'owned' },
  { id: 'kbtc', label: 'kBTC', category: 'asset', score: 62, description: 'Kraken-issued wrapped BTC. 1:1 backed, SPDI-held. Listed on Tydro, Velodrome, Nado.', url: 'https://invite.kraken.com/JDNW/qu2e5diu', krakenTier: 'owned' },
  { id: 'usdt0', label: 'USDT0', category: 'asset', score: 70, description: 'Omnichain USDT (LayerZero OFT). Debuted on Ink. Primary Tydro/Nado collateral.', url: 'https://x.com/usdt0', krakenTier: 'partner' },
  { id: 'usdg', label: 'USDG', category: 'asset', score: 50, description: 'Paxos stablecoin. Kraken is a founding GDN member.', url: 'https://x.com/usdg', krakenTier: 'partner' },
];

const edges = [
  { source: 'tydro', target: 'nado', type: 'capital', label: 'Users borrow on Tydro → trade on Nado.', value: 5 },
  { source: 'kbtc', target: 'tydro', type: 'capital', label: 'kBTC as Tydro collateral (72% LTV).', value: 4 },
  { source: 'usdt0', target: 'tydro', type: 'capital', label: 'USDT0 primary borrowing asset on Tydro.', value: 4 },
  { source: 'usdt0', target: 'nado', type: 'capital', label: 'USDT0 primary NLP collateral on Nado.', value: 4 },
  { source: 'layerzero', target: 'usdt0', type: 'tech', label: 'LayerZero OFT standard powers USDT0.', value: 5 },
  { source: 'redstone', target: 'tydro', type: 'tech', label: 'RedStone price feeds for all Tydro assets.', value: 3 },
  { source: 'superbridge', target: 'tydro', type: 'liquidity', label: 'Primary bridge entry. Funds flow Ethereum → Tydro.', value: 3 },
  { source: 'nado', target: 'inkmcp', type: 'integration', label: 'Nado MCP: ~50 AI tools for perps/spot.', value: 3 },
  { source: 'tydro', target: 'inkmcp', type: 'integration', label: 'Tydro MCP: Lending ops via AI agents.', value: 2 },
];

const categoryColors = { defi: '#7A2828', bridge: '#2A5C5C', infrastructure: '#3D4A2A', asset: '#6B4A1A' };
const categoryLabels = { defi: 'DeFi', bridge: 'Bridge', infrastructure: 'Infrastructure', asset: 'Asset' };
const edgeColors = { capital: '#7A2828', tech: '#2A5C5C', liquidity: '#6B4A1A', integration: '#3D4A2A' };
const edgeLabels = { capital: 'Capital Flow', tech: 'Tech Dependency', liquidity: 'Liquidity', integration: 'Integration' };

function nodeRadius(score) {
  return 16 + (score / 100) * 44;
}

export default function EcosystemMap({ embedded = false }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 900, height: 700 });
  const [activeNode, setActiveNode] = useState(null);
  const [activeEdge, setActiveEdge] = useState(null);

  const bg = 'hsl(38 38% 91%)';
  const borderCol = 'hsl(33 28% 68%)';
  const textDark = 'hsl(28 40% 16%)';
  const textMuted = 'hsl(30 22% 38%)';

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        setDims({ width: e.contentRect.width || 900, height: 700 });
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || dims.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const nodes = protocols.map(n => ({ ...n }));
    const links = edges.map(e => ({ ...e }));

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => 120 + d.value * 15).strength(0.6))
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(dims.width / 2, dims.height / 2))
      .force('collision', d3.forceCollide(d => nodeRadius(d.score) + 10));

    const linkSel = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', d => edgeColors[d.type])
      .attr('stroke-opacity', 0.25)
      .attr('stroke-width', d => d.value * 1.3);

    const nodeSel = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call(
        d3.drag()
          .on('start', (event, d) => { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on('end', (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    nodeSel.append('circle')
      .attr('r', d => nodeRadius(d.score))
      .attr('fill', d => categoryColors[d.category])
      .attr('fill-opacity', d =>
        d.krakenTier === 'owned' || d.krakenTier === 'foundation' ? 0.82
          : d.krakenTier === 'partner' ? 0.68 : 0.52
      )
      .attr('stroke', d =>
        d.krakenTier === 'owned' ? '#8B6914'
          : d.krakenTier === 'foundation' ? '#7A2828' : 'none'
      )
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.krakenTier === 'foundation' ? '5 3' : 'none');

    nodeSel.append('circle')
      .attr('r', d => nodeRadius(d.score))
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setActiveNode(prev => prev?.id === d.id ? null : d);
      });

    nodeSel.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => nodeRadius(d.score) > 30 ? 4 : nodeRadius(d.score) + 15)
      .attr('fill', d => nodeRadius(d.score) > 30 ? 'hsl(38 50% 92%)' : 'hsl(28 40% 20%)')
      .attr('font-size', d => nodeRadius(d.score) > 45 ? '11px' : nodeRadius(d.score) > 30 ? '10px' : '9px')
      .attr('font-family', "'Trade Winds', Georgia, serif")
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .text(d => d.label);

    svg.on('click', () => setActiveNode(null));

    sim.on('tick', () => {
      linkSel
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      nodeSel.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [dims]);

  return (
    <div className="flex flex-col h-full" data-testid="ecosystem-map" style={{ background: embedded ? 'transparent' : 'hsl(38 30% 86%)' }}>
      {!embedded && (
        <div className="p-4 sm:p-6 pb-2">
          <div className="max-w-[900px] mx-auto">
            <h2 className="text-xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: textDark }}>Ink Starboard</h2>
            <p className="text-sm mt-1" style={{ color: textMuted, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              Core Ink players · Bubble size = composite score (TVL + social + reputation) · Lines = flows & dependencies
            </p>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 pb-2">
        <div className="max-w-[900px] mx-auto flex flex-wrap gap-x-5 gap-y-1.5">
          {Object.entries(categoryColors).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: v, opacity: 0.75 }} />
              <span className="text-[10px] font-semibold" style={{ fontFamily: 'var(--font-display)', color: textMuted, letterSpacing: '0.06em' }}>
                {categoryLabels[k]}
              </span>
            </div>
          ))}
          <div className="w-px h-4 self-center" style={{ background: borderCol }} />
          {Object.entries(edgeColors).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 rounded" style={{ backgroundColor: v, opacity: 0.65 }} />
              <span className="text-[10px]" style={{ color: textMuted, fontFamily: 'var(--font-serif)' }}>{edgeLabels[k]}</span>
            </div>
          ))}
          <div className="w-px h-4 self-center" style={{ background: borderCol }} />
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#8B6914' }} />
            <span className="text-[10px]" style={{ color: textMuted, fontFamily: 'var(--font-serif)' }}>Kraken-issued</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-dashed" style={{ borderColor: '#7A2828' }} />
            <span className="text-[10px]" style={{ color: textMuted, fontFamily: 'var(--font-serif)' }}>Ink Foundation</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 relative overflow-hidden mx-4 sm:mx-6 mb-4 sm:mb-6 rounded-lg"
        style={{ border: `1px solid ${borderCol}`, backgroundColor: 'hsl(38 30% 90%)' }}>
        <svg ref={svgRef} width={dims.width} height={dims.height} className="w-full h-full" style={{ minHeight: 500 }} />

        {activeEdge && (
          <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-sm pointer-events-none z-10">
            <div className="rounded-lg p-3 shadow-md" style={{ background: bg, border: `1px solid ${borderCol}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-0.5 rounded" style={{ backgroundColor: edgeColors[activeEdge.type] }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)', color: textMuted }}>
                  {edgeLabels[activeEdge.type]}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: textDark, fontFamily: 'var(--font-serif)' }}>{activeEdge.label}</p>
            </div>
          </div>
        )}

        {activeNode && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm z-10">
            <div className="rounded-lg p-4 shadow-lg" style={{ background: bg, border: `1.5px solid ${borderCol}` }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[activeNode.category] }} />
                    <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: textDark }}>{activeNode.label}</h3>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{ background: 'hsl(36 22% 80%)', color: textMuted, border: `1px solid ${borderCol}`, fontFamily: 'var(--font-display)' }}>
                    {categoryLabels[activeNode.category]}
                  </span>
                </div>
                <button onClick={() => setActiveNode(null)} className="text-xs opacity-50 hover:opacity-100 shrink-0 mt-0.5"
                  style={{ color: textMuted }}>✕</button>
              </div>
              {activeNode.tvl && (
                <p className="text-sm font-bold mt-2 tabular-nums" style={{ color: textDark, fontFamily: 'var(--font-display)' }}>{activeNode.tvl}</p>
              )}
              <p className="text-xs mt-1 leading-relaxed" style={{ color: textMuted, fontFamily: 'var(--font-serif)' }}>{activeNode.description}</p>
              <a href={activeNode.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold hover:opacity-70"
                style={{ color: 'hsl(350 50% 32%)', fontFamily: 'var(--font-display)' }}>
                Visit ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
