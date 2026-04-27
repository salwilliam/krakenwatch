import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';
import MethodologyTooltip from '../components/MethodologyTooltip';

const qp = 'hsl(28 40% 14%)';
const ut = 'hsl(30 20% 38%)';
const on = 'hsl(350 55% 32%)';
const cardBg = 'hsl(38 40% 90%)';
const cardBorder = 'hsl(33 35% 60%)';
const sectionBg = 'hsl(33 28% 82%)';

const darkHeaderBg = 'hsl(30 30% 24%)';
const darkHeaderBorder = 'hsl(30 25% 32%)';
const darkHeaderText = 'hsl(38 50% 78%)';

const boardMembers = [
  { name: 'Jesse Powell', role: 'Co-Founder & Chairman' },
  { name: 'Thanh Luu', role: 'Co-Founder & Director' },
  { name: 'Arjun Sethi', role: 'Co-CEO & Director' },
  { name: 'Dan Ciporin', role: 'Independent Director' },
  { name: 'Alison Davis', role: 'Independent Director' },
  { name: 'Christopher Calicott', role: 'Independent Director' },
];

const products = [
  { name: 'Kraken Exchange', detail: '560+ cryptos, 15M users', url: 'https://kraken.com' },
  { name: 'NinjaTrader', detail: '2M futures traders', url: 'https://ninjatrader.com' },
  { name: 'xStocks', detail: '$25B+ volume, 100+ tokenized stocks', url: 'https://xstocks.fi/' },
  { name: 'Ink L2', detail: 'Optimism Superchain · $536M TVS · Kraken\'s on-chain execution layer', url: 'https://inkonchain.com' },
  { name: 'CF Benchmarks', detail: 'CME BRR, institutional indices', url: 'https://cfbenchmarks.com' },
  { name: 'Krak App', detail: 'P2P payments, 160+ countries', url: 'https://x.com/krakapp' },
  { name: 'Breakout', detail: 'Prop trading, 20K funded accounts', url: 'http://breakoutprop.com/' },
];

const regulatoryEntities = [
  {
    region: 'United States',
    entities: [
      { name: 'Payward Interactive, Inc.', license: 'FinCEN MSB', detail: 'Main exchange entity' },
      { name: 'Payward Financial', license: 'Wyoming SPDI', detail: 'Kraken Financial — Fed master account' },
      { name: 'Kraken Securities LLC', license: 'SEC/FINRA BD', detail: 'US equities broker-dealer' },
      { name: 'Kraken Adviser LLC', license: 'SEC RIA', detail: 'Registered investment adviser' },
      { name: 'NinjaTrader Clearing LLC', license: 'CFTC FCM', detail: 'Kraken Derivatives US — $1.5B acquisition' },
      { name: 'Small Exchange Inc.', license: 'CFTC DCM', detail: '$100M acquisition' },
    ],
  },
  {
    region: 'United Kingdom',
    entities: [
      { name: 'Payward Limited', license: 'FCA Crypto', detail: 'UK crypto operations' },
      { name: 'Payward Services Limited', license: 'FCA EMI', detail: 'Electronic money institution' },
      { name: 'Crypto Facilities Ltd / CF Benchmarks', license: 'FCA', detail: 'Powers CME Bitcoin futures' },
    ],
  },
  {
    region: 'European Union',
    entities: [
      { name: 'Payward Ireland Limited', license: 'CBI EMI', detail: 'EEA passported' },
      { name: 'Payward Europe Solutions Limited', license: 'MiCA CASP', detail: 'Crypto-asset service provider' },
      { name: 'Payward Global Solutions Limited', license: 'MiCA', detail: 'Trading platform' },
      { name: 'Payward Europe Digital Solutions CY', license: 'CySEC MiFID', detail: 'Cyprus MiFID II' },
      { name: 'Payward Europe Limited', license: 'MiCA', detail: '→ Backed Finance AG → Backed Assets JE (xStocks)', children: [
        { name: 'Backed Finance AG', detail: 'Swiss subsidiary' },
        { name: 'Backed Assets JE', detail: 'xStocks tokenized equities' },
      ]},
    ],
  },
  {
    region: 'Asia-Pacific',
    entities: [
      { name: 'Bit Trade Pty Ltd', license: 'AUSTRAC', detail: 'Australia operations' },
      { name: 'Beaufort Fiduciaries', license: 'AFSL', detail: 'Australian derivatives' },
      { name: 'Payward Canada, Inc.', license: 'FINTRAC + OSC', detail: 'Canadian operations' },
    ],
  },
  {
    region: 'Other',
    entities: [
      { name: 'Payward Digital Solutions Ltd', license: 'BMA', detail: 'Bermuda operations' },
      { name: 'Payward Trading Limited Argentina Branch', license: 'CNV VASP', detail: 'Argentina operations' },
    ],
  },
];

const acquisitions = [
  { year: '2016', name: 'Glidera', detail: 'Brokerage platform', value: '', major: false },
  { year: '2019', name: 'Crypto Facilities', detail: 'UK derivatives & indices', value: '$100M+', major: true },
  { year: '2020', name: 'Circle Trade', detail: 'OTC desk', value: '', major: false },
  { year: '2020', name: 'Bit Trade', detail: 'Australian exchange', value: '', major: false },
  { year: '2021', name: 'Staked', detail: 'Staking infrastructure', value: '', major: false },
  { year: '2022', name: 'Blockchain.com Custody', detail: 'Institutional custody', value: '', major: false },
  { year: '2022', name: 'Intellect EU', detail: 'MiFID license', value: '', major: false },
  { year: '2023', name: 'Backed Finance', detail: 'Tokenized securities', value: '', major: false },
  { year: '2024', name: 'TradeStation Crypto', detail: 'Retail crypto accounts', value: '', major: false },
  { year: '2024', name: 'Coin Meester', detail: 'Dutch exchange', value: '', major: false },
  { year: '2025', name: 'NinjaTrader', detail: 'Futures brokerage', value: '$1.5B', major: true },
  { year: '2025', name: 'Small Exchange', detail: 'Derivatives market', value: '$100M', major: true },
  { year: '2025', name: 'Capitalise.ai', detail: 'No-code automation (minor)', value: '', major: false },
  { year: '2026', name: 'Breakout', detail: 'Prop trading platform', value: '', major: false },
];

const mktCapBars = [
  { label: '$16B', pct: 38, note: 'floor' },
  { label: '$18B', pct: 31, note: '' },
  { label: '$20B', pct: 29, note: '' },
  { label: '$22B', pct: 24, note: '' },
  { label: '$24B+', pct: 25, note: 'bull' },
];

const priceSourceRows = [
  { key: 'hiive', label: 'Hiive', href: 'https://www.hiive.com/securities/kraken-stock', field: 'hiive_pps', note: 'weighted avg' },
  { key: 'forge', label: 'Forge Global', href: 'https://forgeglobal.com/kraken_stock/', field: 'forge_pps', note: 'Forge Price™' },
  { key: 'npm', label: 'Nasdaq Private Mkt', href: 'https://www.nasdaqprivatemarket.com/company/kraken/', field: 'npm_pps', note: 'Tape D™' },
  { key: 'notice', label: 'Notice', href: 'https://notice.co/c/kraken', field: 'notice_pps', note: 'algorithmic' },
];

function DataModuleCard({ title, icon, children }) {
  return (
    <div className="rounded-lg overflow-hidden w-full" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
      <div className="px-5 py-3 flex items-center gap-3" style={{ background: darkHeaderBg, borderBottom: `1px solid ${darkHeaderBorder}` }}>
        <span className="shrink-0" style={{ color: 'hsl(38 55% 72%)' }}>{icon}</span>
        <span className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)', color: darkHeaderText }}>{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function IpoForecastModule({ ipo }) {
  const avg = ipo?.avg_pct;
  const poly = ipo?.polymarket_pct;
  const kalshi = ipo?.kalshi_pct;
  return (
    <DataModuleCard title="IPO Forecast" icon={
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    }>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-display)', color: ut }}>IPO by Dec 31 2026<MethodologyTooltip /></p>
          <p className="text-5xl font-bold tabular-nums leading-none" style={{ fontFamily: 'var(--font-display)', color: on }}>
            {avg == null ? '—' : `${avg}%`}
          </p>
          <p className="text-[11px] mt-1.5" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>avg. implied probability</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <a href="https://polymarket.com/event/kraken-ipo-in-2025" target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium underline decoration-dotted" style={{ color: ut }}>Polymarket</a>
              <span className="text-sm font-bold tabular-nums" style={{ color: on }}>{poly == null ? '—' : `${poly}%`}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <a href="https://kalshi.com/markets/kxipo/ipos/kxipo-26" target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium underline decoration-dotted" style={{ color: ut }}>Kalshi</a>
              <span className="text-sm font-bold tabular-nums" style={{ color: on }}>{kalshi == null ? '—' : `${kalshi}%`}</span>
            </div>
          </div>
          <p className="text-[10px] mt-3" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Mid-market prices · updated daily</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-display)', color: ut }}>Likely Market Cap at Listing</p>
          <div className="space-y-1.5">
            {mktCapBars.map(({ label, pct, note }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs font-mono w-12 shrink-0 text-right" style={{ color: ut }}>{label}</span>
                <div className="flex-1 rounded-full overflow-hidden h-2" style={{ background: 'hsl(33 25% 76%)' }}>
                  <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: `hsl(350 ${40 + pct / 3}% ${45 - pct / 5}%)` }} />
                </div>
                <span className="text-xs tabular-nums font-semibold w-8 shrink-0" style={{ color: on }}>{pct}%</span>
                {note && <span className="text-[10px] hidden sm:inline" style={{ color: ut, fontStyle: 'italic' }}>{note}</span>}
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-2" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Polymarket market cap data · ~$20B current private valuation</p>
        </div>
      </div>
    </DataModuleCard>
  );
}

function SecondaryMarketModule({ sm }) {
  return (
    <DataModuleCard title="Private Market Share Price" icon={
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    }>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-display)', color: ut }}>Secondary Market Fair Value<MethodologyTooltip /></p>
          <p className="text-5xl font-bold tabular-nums leading-none" style={{ fontFamily: 'var(--font-display)', color: on }}>
            {sm?.avg_pps == null ? '—' : `$${sm.avg_pps.toFixed(2)}`}
          </p>
          <p className="text-[11px] mt-1.5" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>avg. across 4 secondary venues</p>
          <div className="mt-3 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-display)', color: ut }}>Est. 30D Volume<MethodologyTooltip /></p>
            <p className="text-2xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: on }}>
              {sm?.volume_30d_est_m == null ? '—' : `~$${sm.volume_30d_est_m}M`}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              {sm?.volume_note || 'Est. 30D secondary volume'}
            </p>
          </div>
          <p className="text-[10px] mt-3" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Snapshot · updated daily · not financial advice</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-display)', color: ut }}>Price by Source</p>
          <div className="space-y-2">
            {priceSourceRows.map(({ key, label, href, field, note }) => {
              const val = sm?.[field];
              return (
                <div key={key} className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-medium underline decoration-dotted" style={{ color: ut }}>{label}</a>
                    <span className="text-[10px]" style={{ color: ut, fontStyle: 'italic' }}>{note}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums" style={{ color: on }}>
                    {val == null ? '—' : `$${val.toFixed(2)}`}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-2" style={{ borderTop: '1px solid hsl(33 30% 72%)' }}>
            <p className="text-[10px]" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              Prices are indicative secondary market data, not official valuations. Volume is estimated from platform activity data and public disclosures.
            </p>
          </div>
        </div>
      </div>
    </DataModuleCard>
  );
}

function RegionBlock({ region }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-lg overflow-hidden w-full" style={{ border: `1px solid ${cardBorder}`, background: cardBg }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 text-left transition-colors"
        data-testid={`region-toggle-${region.region.toLowerCase().replace(/\s/g, '-')}`}>
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: ut }}>
          {open ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
        </svg>
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: qp }}>
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: qp }}>{region.region}</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded"
          style={{ background: sectionBg, color: qp, border: `1px solid ${cardBorder}`, fontFamily: 'var(--font-display)' }}>
          {region.entities.length}
        </span>
      </button>
      {open && (
        <div style={{ borderTop: `1px solid ${cardBorder}` }}>
          {region.entities.map((entity, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3"
              style={{ borderBottom: i < region.entities.length - 1 ? `1px solid ${cardBorder}` : 'none' }}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-display)', color: qp }}>{entity.name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>{entity.detail}</p>
                {entity.children && (
                  <div className="mt-1.5 pl-3 border-l-2 space-y-1" style={{ borderColor: cardBorder }}>
                    {entity.children.map((child, j) => (
                      <div key={j}>
                        <p className="text-[10px] font-semibold" style={{ color: qp, fontFamily: 'var(--font-display)' }}>{child.name}</p>
                        <p className="text-[10px]" style={{ color: ut }}>{child.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                style={{ background: sectionBg, color: ut, border: `1px solid ${cardBorder}`, fontFamily: 'var(--font-display)' }}>
                {entity.license}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AcquisitionTimeline() {
  const accentColor = 'hsl(350 50% 32%)';
  const mutedColor = 'hsl(30 20% 40%)';
  return (
    <div className="overflow-x-auto pb-2">
      <div className="relative" style={{ minWidth: '700px' }}>
        <div className="absolute top-5 left-0 right-0 h-[1.5px]"
          style={{ background: `linear-gradient(to right, transparent, ${accentColor}, hsl(25 55% 38%), transparent)` }} />
        <div className="flex justify-between items-start px-4">
          {acquisitions.map((acq, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5" style={{ minWidth: acq.major ? 72 : 52 }}>
              <div className="w-2.5 h-2.5 rounded-full border-2 z-10"
                style={{
                  background: acq.major ? accentColor : 'hsl(38 40% 90%)',
                  borderColor: acq.major ? accentColor : 'hsl(33 35% 60%)',
                  opacity: acq.name === 'Capitalise.ai' ? 0.55 : 1,
                }} />
              <div className="text-center">
                <p className="text-[11px] font-semibold leading-tight"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: acq.major ? qp : 'hsl(28 30% 30%)',
                    opacity: acq.name === 'Capitalise.ai' ? 0.55 : 1,
                  }}>
                  {acq.name}
                </p>
                <p className="text-[9px] mt-0.5 leading-tight" style={{ color: mutedColor }}>{acq.detail}</p>
                {acq.value && (
                  <span className="text-[10px] font-bold" style={{ color: accentColor }}>{acq.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-4 mt-1">
          {acquisitions.map((acq, i) => (
            <div key={i} className="text-center" style={{ minWidth: acq.major ? 72 : 52 }}>
              <p className="text-[9px]" style={{ color: mutedColor, fontFamily: 'var(--font-display)' }}>{acq.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="rounded-xl w-full" style={{ border: `2px solid ${cardBorder}`, background: cardBg, overflow: 'visible' }}>
      <div className="px-4 py-3 flex items-center gap-2 rounded-t-xl" style={{ background: sectionBg, borderBottom: `1px solid ${cardBorder}` }}>
        <span className="text-sm" style={{ color: ut }}>{icon}</span>
        <span className="text-sm font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function Payward() {
  const { data } = useSiteData();
  const ipo = data?.ipo;
  const sm = data?.secondary_market;

  return (
    <>
      <Helmet>
        <title>Payward Corporate Map — Kraken Watch</title>
        <meta name="description" content="Full Payward entity structure, subsidiaries, regulatory filings, and jurisdiction footprint for the Kraken parent company." />
        <link rel="canonical" href="https://krakenwatch.com/payward" />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-6 w-full max-w-[960px] mx-auto">
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <img src="/payward-kraken-seal.png" alt="Payward" className="object-contain" style={{ width: '100px', height: '100px' }} />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
            Payward
          </h1>
          <p className="text-sm max-w-lg" style={{ fontFamily: 'var(--font-serif)', color: ut }}>
            Corporate structure, entities & regulatory footprint
          </p>
        </div>

        <IpoForecastModule ipo={ipo} />
        <SecondaryMarketModule sm={sm} />

        <SectionCard title="Board of Directors" icon="⚓">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {boardMembers.map((m, i) => (
              <div key={i} className="rounded-lg p-3" style={{ border: `1px solid ${cardBorder}`, background: sectionBg }}>
                <p className="text-xs font-bold" style={{ fontFamily: 'var(--font-display)', color: qp }}>{m.name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>{m.role}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Product Portfolio" icon="🏴‍☠️">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                className="rounded-lg p-3 transition-opacity hover:opacity-80"
                style={{ border: `1px solid ${cardBorder}`, background: sectionBg, display: 'block' }}>
                <p className="text-xs font-bold" style={{ fontFamily: 'var(--font-display)', color: qp }}>{p.name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>{p.detail}</p>
              </a>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Acquisition Timeline" icon="📜">
          <AcquisitionTimeline />
        </SectionCard>

        <SectionCard title="Regulatory Entities by Jurisdiction" icon="🗺">
          <div className="space-y-2">
            {regulatoryEntities.map((region, i) => (
              <RegionBlock key={i} region={region} />
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
