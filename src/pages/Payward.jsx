import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const qp = 'hsl(28 40% 14%)';
const ut = 'hsl(30 20% 38%)';
const on = 'hsl(350 55% 32%)';
const cardBg = 'hsl(38 40% 90%)';
const cardBorder = 'hsl(33 35% 60%)';
const sectionBg = 'hsl(33 28% 82%)';

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

function RegionBlock({ region }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${cardBorder}`, background: cardBg }}>
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
      <div className="relative min-w-[700px]">
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
    <div className="rounded-xl overflow-hidden" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ background: sectionBg, borderBottom: `1px solid ${cardBorder}` }}>
        <span className="text-sm" style={{ color: ut }}>{icon}</span>
        <span className="text-sm font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function Payward() {
  return (
    <>
      <Helmet>
        <title>Payward Corporate Map — Kraken Watch</title>
        <meta name="description" content="Full Payward entity structure, subsidiaries, regulatory filings, and jurisdiction footprint for the Kraken parent company." />
        <link rel="canonical" href="https://krakenwatch.com/payward" />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-6 max-w-[960px] mx-auto">
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <img src="/payward-kraken-seal.png" alt="Payward" className="w-16 h-16 object-contain" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
            Payward
          </h1>
          <p className="text-sm max-w-lg" style={{ fontFamily: 'var(--font-serif)', color: ut }}>
            Corporate structure, entities & regulatory footprint
          </p>
        </div>

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
