import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../hooks/useSiteData';

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
  { name: 'Jesse Powell', role: 'Co-Founder & Chairman', x: 'https://x.com/jespow' },
  { name: 'Thanh Luu', role: 'Co-Founder & Director' },
  { name: 'Arjun Sethi', role: 'Co-CEO & Director', x: 'https://x.com/arjunsethi' },
  { name: 'Dan Ciporin', role: 'Independent Director' },
  { name: 'Alison Davis', role: 'Independent Director' },
  { name: 'Christopher Calicott', role: 'Independent Director' },
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
    ],
  },
  {
    region: 'Other',
    entities: [
      { name: 'Payward Canada, Inc.', license: 'FINTRAC + OSC', detail: 'Canadian operations' },
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

const TAGS = ['All', 'Product', 'Acquired', 'Partner', 'Infrastructure', 'Ecosystem', 'Social', 'Sponsorship'];

const TAG_COLORS = {
  Product:        { bg: 'hsl(210 35% 88%)', color: 'hsl(210 55% 30%)', border: 'hsl(210 30% 72%)' },
  Acquired:       { bg: 'hsl(30 40% 85%)',  color: 'hsl(28 55% 28%)',  border: 'hsl(30 35% 65%)' },
  Partner:        { bg: 'hsl(150 25% 86%)', color: 'hsl(150 40% 28%)', border: 'hsl(150 25% 65%)' },
  Infrastructure: { bg: 'hsl(260 25% 88%)', color: 'hsl(260 40% 32%)', border: 'hsl(260 25% 72%)' },
  Ecosystem:      { bg: 'hsl(180 25% 86%)', color: 'hsl(180 45% 26%)', border: 'hsl(180 25% 65%)' },
  Social:         { bg: 'hsl(200 30% 88%)', color: 'hsl(200 45% 28%)', border: 'hsl(200 30% 70%)' },
  Sponsorship:    { bg: 'hsl(45 40% 86%)',  color: 'hsl(38 55% 28%)',  border: 'hsl(45 35% 65%)' },
};

const ecosystemSections = [
  {
    id: 'consumer',
    title: 'Consumer Hub',
    icon: '🏠',
    entities: [
      { name: 'Kraken App', desc: 'Flagship mobile app for spot trading, staking, and asset management.', tag: 'Product', url: 'https://invite.kraken.com/JDNW/qu2e5diu' },
      { name: 'Kraken Pro', desc: 'Advanced trading platform with charting, pro order types, and full API access.', tag: 'Product', url: 'https://invite.kraken.com/JDNW/qu2e5diu' },
      { name: 'Kraken Desktop', desc: 'Native desktop application for professional Kraken trading.', tag: 'Product', url: 'https://invite.kraken.com/JDNW/qu2e5diu' },
      { name: 'Kraken Launch', desc: "Kraken's token launch and initial exchange offering platform.", tag: 'Product' },
      { name: 'Krak', desc: 'Peer-to-peer payments app covering 160+ countries with embedded crypto rails.', tag: 'Product', url: 'https://x.com/krakapp' },
      { name: 'Krak Concierge', desc: "White-glove service tier for Krak's high-value and VIP users.", tag: 'Product' },
      { name: 'Kraken Wallet', desc: 'Self-custody wallet supporting multi-chain asset management and DeFi access.', tag: 'Product', url: 'https://invite.kraken.com/JDNW/qu2e5diu' },
      { name: 'Kraken Listings', desc: 'Process and community hub for new asset listing requests on Kraken.', tag: 'Product' },
      { name: 'Kraken Support', desc: "Global customer support infrastructure for Kraken's user base.", tag: 'Product' },
      { name: 'Kraken+', desc: 'Subscription tier offering enhanced benefits and reduced fees for active users.', tag: 'Product' },
      { name: 'Breakout', desc: 'Proprietary trading platform providing funded accounts for skilled traders.', tag: 'Acquired', url: 'http://breakoutprop.com/' },
      { name: 'Prediction Markets', desc: "Kraken's product for event-based and prediction market trading.", tag: 'Product' },
    ],
  },
  {
    id: 'institutional',
    title: 'Institutional Stack',
    icon: '🏛️',
    entities: [
      { name: 'Kraken Prime', desc: 'Prime brokerage offering deep liquidity, credit, and custody for institutions.', tag: 'Product' },
      { name: 'Payward Services', desc: 'Managed services and operational support entity across the Payward group.', tag: 'Product' },
      { name: 'Kraken Custody', desc: 'Institutional-grade digital asset custody with full regulatory compliance.', tag: 'Product' },
      { name: 'Kraken Financial', desc: 'Wyoming SPDI bank offering crypto-native banking services with a Fed master account.', tag: 'Product' },
      { name: 'Kraken 360', desc: 'End-to-end institutional onboarding and account management service.', tag: 'Product' },
      { name: 'Magna', desc: 'Internal operations and back-office management platform.', tag: 'Product' },
      { name: 'Kraken CLI', desc: "Command-line interface for programmatic access to Kraken's trading APIs.", tag: 'Product' },
      { name: 'Payward Ramp', desc: 'Fiat on/off-ramp infrastructure for converting between crypto and traditional currencies.', tag: 'Product' },
      { name: 'Kraken OTC', desc: 'Over-the-counter desk providing bespoke block trade liquidity.', tag: 'Product' },
      { name: 'Kraken Derivatives US', desc: 'US-regulated derivatives exchange built on the NinjaTrader futures infrastructure.', tag: 'Acquired' },
      { name: 'Kraken Flexline', desc: 'Credit facility allowing institutions to borrow against crypto holdings.', tag: 'Product' },
      { name: 'Kraken Perps', desc: 'Perpetual futures trading product for leveraged crypto positions.', tag: 'Product' },
      { name: 'NinjaTrader', desc: 'Futures brokerage platform with 2M active traders, acquired for $1.5B in 2025.', tag: 'Acquired', url: 'https://ninjatrader.com' },
    ],
  },
  {
    id: 'intelligence',
    title: 'Institutional Intelligence',
    icon: '📊',
    entities: [
      { name: 'CF Benchmarks', desc: 'Provider of regulated crypto benchmarks including the CME Bitcoin Reference Rate.', tag: 'Acquired', url: 'https://cfbenchmarks.com' },
      { name: 'Crypto Insights Group', desc: 'Independent research and analytics firm providing institutional market intelligence on digital assets.', tag: 'Partner' },
    ],
  },
  {
    id: 'ink',
    title: 'Ink Network',
    icon: '🔗',
    entities: [
      { name: 'Ink', desc: "Kraken's Layer 2 blockchain built on the Optimism Superchain.", tag: 'Product', url: 'https://inkonchain.com' },
      { name: 'Ink Foundation', desc: 'Non-profit stewarding the Ink L2 ecosystem and public goods funding.', tag: 'Ecosystem' },
      { name: 'INK Token', desc: 'Native governance and utility token for the Ink ecosystem, pending TGE.', tag: 'Ecosystem' },
    ],
  },
  {
    id: 'defi',
    title: 'DeFi & Yield Layer',
    icon: '⚗️',
    entities: [
      { name: 'DeFi Earn', desc: "Kraken's interface for accessing decentralised lending and yield protocols.", tag: 'Product' },
      { name: 'Tydro', desc: 'Aave v3 white-label lending protocol deployed natively on Ink with ~$380M TVL.', tag: 'Ecosystem', url: 'https://tydro.com' },
      { name: 'xStocks', desc: 'Tokenized equity platform offering 100+ stocks and ETFs on-chain.', tag: 'Acquired', url: 'https://xstocks.fi/' },
      { name: 'Spreads', desc: 'Decentralised derivatives and structured product protocol on Ink.', tag: 'Ecosystem', url: 'https://invite.kraken.com/JDNW/qu2e5diu' },
      { name: 'USDG', desc: 'Global Dollar Network stablecoin used as a key asset across the Ink ecosystem.', tag: 'Partner' },
      { name: 'Beholder', desc: 'Onchain analytics and risk monitoring tool for DeFi positions on Ink.', tag: 'Ecosystem' },
    ],
  },
  {
    id: 'infrastructure',
    title: 'Market Infrastructure Partners',
    icon: '🏗️',
    entities: [
      { name: 'Nasdaq', desc: 'Exchange technology and data partner; Nasdaq Private Market provides Tape D™ pricing.', tag: 'Partner' },
      { name: 'Circle', desc: 'Issuer of USDC; key stablecoin infrastructure partner across Kraken and Ink.', tag: 'Partner' },
      { name: 'Optimism Superchain', desc: 'Layer 2 network stack that Ink is built on; provides shared security and interoperability.', tag: 'Infrastructure' },
      { name: 'Talos', desc: "Institutional trading infrastructure provider powering Kraken's backend liquidity routing.", tag: 'Partner' },
      { name: 'Velodrome', desc: 'Automated market maker native to the Optimism Superchain, deployed on Ink.', tag: 'Ecosystem' },
    ],
  },
  {
    id: 'investment',
    title: 'Investment & Strategic Finance',
    icon: '💼',
    entities: [
      { name: 'Triton Capital', desc: 'Growth equity investor and major institutional shareholder in Payward.', tag: 'Partner' },
      { name: 'Citadel Securities', desc: 'Market maker and strategic investor with liquidity partnerships across Kraken.', tag: 'Partner' },
      { name: 'Tribe Capital', desc: 'Venture capital firm and early institutional investor in Payward.', tag: 'Partner' },
      { name: 'Jane Street', desc: 'Quantitative trading firm with market-making and investment ties to Kraken.', tag: 'Partner' },
      { name: 'DRW', desc: 'Proprietary trading and investment firm with strategic ties via Cumberland division.', tag: 'Partner' },
    ],
  },
  {
    id: 'banking',
    title: 'Banking & Settlement Partners',
    icon: '🏦',
    entities: [
      { name: 'BNY', desc: "US banking partner providing custody and settlement infrastructure for Kraken's operations.", tag: 'Partner' },
      { name: 'Deutsche Börse Group / 360T', desc: 'European exchange and FX infrastructure partner via the 360T FX trading platform.', tag: 'Partner' },
      { name: 'Global Dollar Network', desc: 'Settlement network underpinning the USDG stablecoin used across payment rails.', tag: 'Partner' },
    ],
  },
  {
    id: 'sponsorships',
    title: 'Sports & Brand Sponsorships',
    icon: '🏆',
    entities: [
      { name: 'Williams Racing', desc: 'Formula 1 team; Kraken is title sponsor of the Williams Racing F1 entry.', tag: 'Sponsorship' },
      { name: 'Tottenham Hotspur', desc: 'Premier League football club; Kraken is official crypto exchange partner.', tag: 'Sponsorship' },
      { name: 'Atlético de Madrid', desc: 'Spanish La Liga club; Kraken is official crypto exchange partner.', tag: 'Sponsorship' },
      { name: 'RB Leipzig', desc: 'German Bundesliga club; Kraken is official crypto exchange partner.', tag: 'Sponsorship' },
    ],
  },
  {
    id: 'social',
    title: 'Social & Brand Accounts',
    icon: '📣',
    entities: [
      { name: 'Kraken Global', desc: 'Main global consumer brand account. X: @krakenfx', tag: 'Social', url: 'https://x.com/krakenfx' },
      { name: 'Kraken Institutional', desc: 'Institutional audience account. X: @KrakenInsto', tag: 'Social', url: 'https://x.com/KrakenInsto' },
      { name: 'Kraken Support', desc: 'Global customer support account. X: @krakensupport', tag: 'Social', url: 'https://x.com/krakensupport' },
      { name: 'Kraken UK', desc: 'UK regional account. Instagram: @krakenfxuk', tag: 'Social', url: 'https://instagram.com/krakenfxuk' },
      { name: 'Kraken France (X)', desc: 'French market account. X: @krakenfx_FR', tag: 'Social', url: 'https://x.com/krakenfx_FR' },
      { name: 'Kraken France (Instagram)', desc: 'French market account. Instagram: @krakenfx_fr', tag: 'Social', url: 'https://instagram.com/krakenfx_fr' },
      { name: 'Kraken Germany', desc: 'German market account. Instagram: @krakenfxde', tag: 'Social', url: 'https://instagram.com/krakenfxde' },
      { name: 'Kraken Poland', desc: 'Polish market account. X: @krakenfx_pl', tag: 'Social', url: 'https://x.com/krakenfx_pl' },
      { name: 'Kraken China', desc: 'Chinese market account. X: @KrakenFX_ZH', tag: 'Social', url: 'https://x.com/KrakenFX_ZH' },
      { name: 'xStocks China', desc: 'xStocks Chinese market account. X: @xStocksFi_zh', tag: 'Social', url: 'https://x.com/xStocksFi_zh' },
      { name: 'Kraken Argentina (X)', desc: 'Argentine market account. X: @krakenfx_ar', tag: 'Social', url: 'https://x.com/krakenfx_ar' },
      { name: 'Kraken Argentina (Instagram)', desc: 'Argentine market account. Instagram: @krakenfx_ar', tag: 'Social', url: 'https://instagram.com/krakenfx_ar' },
      { name: 'Kraken Brazil', desc: 'Brazilian market account. Instagram: @krakenfx_br', tag: 'Social', url: 'https://instagram.com/krakenfx_br' },
      { name: 'Kraken LinkedIn', desc: 'Official company LinkedIn page. LinkedIn: @kraken-exchange', tag: 'Social', url: 'https://www.linkedin.com/company/kraken-exchange/' },
      { name: 'Kraken YouTube', desc: 'Official YouTube channel for tutorials and announcements. YouTube: @krakenfx', tag: 'Social', url: 'https://www.youtube.com/@krakenfx' },
      { name: 'NinjaTrader YouTube', desc: 'NinjaTrader platform tutorials and trading content. YouTube: @NinjaTrader', tag: 'Social', url: 'https://www.youtube.com/@NinjaTrader' },
      { name: 'NinjaTrader LinkedIn', desc: 'NinjaTrader official company LinkedIn page. LinkedIn: @ninjatrader', tag: 'Social', url: 'https://www.linkedin.com/company/ninjatrader/' },
    ],
  },
];

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="X (Twitter)" role="img">
      <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor"/>
    </svg>
  );
}

let _igIconSeq = 0;

function InstagramIcon() {
  const gradId = `ig-grad-${++_igIconSeq}`;
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Instagram" role="img">
      <defs>
        <linearGradient id={gradId} x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f09433"/>
          <stop offset="25%" stopColor="#e6683c"/>
          <stop offset="50%" stopColor="#dc2743"/>
          <stop offset="75%" stopColor="#cc2366"/>
          <stop offset="100%" stopColor="#bc1888"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke={`url(#${gradId})`} strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="4" stroke={`url(#${gradId})`} strokeWidth="2" fill="none"/>
      <circle cx="17.5" cy="6.5" r="1" fill={`url(#${gradId})`}/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="LinkedIn" role="img">
      <rect x="2" y="2" width="20" height="20" rx="3" ry="3" fill="#0077B5"/>
      <path d="M7 10h2v7H7v-7zm1-3a1.1 1.1 0 110 2.2A1.1 1.1 0 018 7zm4 3h1.9v1h.03C14.22 10.4 15.1 10 16.1 10c2.1 0 2.9 1.38 2.9 3.17V17h-2v-3.4c0-.82-.01-1.87-1.14-1.87-1.14 0-1.32.89-1.32 1.81V17H12v-7z" fill="white"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="YouTube" role="img">
      <rect x="2" y="5" width="20" height="14" rx="3" fill="#FF0000"/>
      <path d="M10 8.5l5 3.5-5 3.5V8.5z" fill="white"/>
    </svg>
  );
}

function getPlatformIcon(url) {
  if (!url) return null;
  if (url.includes('x.com') || url.includes('twitter.com')) return <XIcon />;
  if (url.includes('instagram.com')) return <InstagramIcon />;
  if (url.includes('linkedin.com')) return <LinkedInIcon />;
  if (url.includes('youtube.com')) return <YouTubeIcon />;
  return null;
}

function TagPill({ tag }) {
  const colors = TAG_COLORS[tag] || { bg: sectionBg, color: ut, border: cardBorder };
  return (
    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0"
      style={{ background: colors.bg, color: colors.color, border: `1px solid ${colors.border}`, fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
      {tag}
    </span>
  );
}

function parseHandleFromDesc(desc) {
  const match = desc.match(/^(.+?)\s+((?:X|Instagram|Twitter|LinkedIn|YouTube):\s*)(@[\w-]+)$/);
  if (!match) return { prefix: desc, platformLabel: null, handle: null };
  return { prefix: match[1], platformLabel: match[2], handle: match[3] };
}

function EntityCard({ entity }) {
  const isSocial = entity.tag === 'Social';
  const platformIcon = isSocial ? getPlatformIcon(entity.url) : null;
  const parsed = isSocial ? parseHandleFromDesc(entity.desc) : null;

  const descContent = isSocial && parsed && parsed.handle ? (
    <p className="text-[10px] leading-relaxed flex-1" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>
      {parsed.prefix}{' '}{parsed.platformLabel}
      <a
        href={entity.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        style={{ color: 'hsl(210 50% 40%)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
      >
        {parsed.handle}
      </a>
    </p>
  ) : (
    <p className="text-[10px] leading-relaxed flex-1" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>{entity.desc}</p>
  );

  const innerCard = (
    <div className="rounded-lg p-3 h-full flex flex-col gap-2 transition-opacity"
      style={{ border: `1px solid ${cardBorder}`, background: sectionBg }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {platformIcon && (
            <span className="shrink-0 flex items-center" style={{ color: 'hsl(210 10% 40%)', marginTop: '1px' }}>
              {platformIcon}
            </span>
          )}
          <p className="text-xs font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: qp }}>{entity.name}</p>
        </div>
        <TagPill tag={entity.tag} />
      </div>
      {descContent}
    </div>
  );

  if (isSocial && entity.url) {
    return (
      <div className="relative hover:opacity-80" style={{ transition: 'opacity 0.15s' }}>
        <a
          href={entity.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${entity.name} profile`}
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            textDecoration: 'none', borderRadius: '0.5rem',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
          <div className="rounded-lg p-3 h-full flex flex-col gap-2"
            style={{ border: `1px solid ${cardBorder}`, background: sectionBg }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {platformIcon && (
                  <span className="shrink-0 flex items-center" style={{ color: 'hsl(210 10% 40%)', marginTop: '1px' }}>
                    {platformIcon}
                  </span>
                )}
                <p className="text-xs font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: qp }}>{entity.name}</p>
              </div>
              <TagPill tag={entity.tag} />
            </div>
            <p className="text-[10px] leading-relaxed flex-1" style={{ color: ut, fontFamily: 'var(--font-serif)', pointerEvents: 'none' }}>
              {parsed && parsed.handle ? (
                <>
                  {parsed.prefix}{' '}{parsed.platformLabel}
                  <a
                    href={entity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'hsl(210 50% 40%)',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      pointerEvents: 'auto',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    {parsed.handle}
                  </a>
                </>
              ) : entity.desc}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (entity.url) {
    return (
      <a href={entity.url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80" style={{ textDecoration: 'none' }}>
        {innerCard}
      </a>
    );
  }
  return innerCard;
}

function SectionBlock({ section, activeFilter }) {
  const visible = activeFilter === 'All'
    ? section.entities
    : section.entities.filter(e => e.tag === activeFilter);

  if (visible.length === 0) return null;

  return (
    <div className="rounded-xl w-full" style={{ border: `2px solid ${cardBorder}`, background: cardBg, overflow: 'visible' }}>
      <div className="px-4 py-3 flex items-center gap-2 rounded-t-xl" style={{ background: darkHeaderBg, borderBottom: `1px solid ${darkHeaderBorder}` }}>
        <span className="text-sm" style={{ color: 'hsl(38 55% 72%)' }}>{section.icon}</span>
        <span className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)', color: darkHeaderText }}>{section.title}</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded"
          style={{ background: 'hsl(30 25% 32%)', color: 'hsl(38 40% 65%)', border: `1px solid hsl(30 20% 38%)`, fontFamily: 'var(--font-display)' }}>
          {visible.length}
        </span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visible.map((entity, i) => (
            <EntityCard key={i} entity={entity} />
          ))}
        </div>
      </div>
    </div>
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
        <div className="absolute top-[5px] left-0 right-0 h-[1.5px]"
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

const SOURCE_BADGE = {
  Kalshi:     { bg: 'hsl(220 45% 88%)', fg: 'hsl(220 50% 35%)' },
  Polymarket: { bg: 'hsl(270 35% 88%)', fg: 'hsl(270 40% 35%)' },
};

function SourceBadge({ src }) {
  const s = SOURCE_BADGE[src] || { bg: sectionBg, fg: ut };
  return (
    <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
      style={{ background: s.bg, color: s.fg, fontFamily: 'var(--font-display)' }}>
      {src}
    </span>
  );
}

function PctBar({ pct }) {
  const n = parseFloat(pct);
  const w = isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(33 25% 76%)' }}>
        <div className="h-full rounded-full" style={{
          width: `${w}%`,
          background: w >= 50
            ? 'linear-gradient(to right, hsl(150 40% 40%), hsl(150 50% 30%))'
            : `linear-gradient(to right, ${on}, hsl(25 55% 38%))`,
        }} />
      </div>
      <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: on, fontFamily: 'var(--font-display)' }}>
        {isNaN(n) ? '—' : `${n}%`}
      </span>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="rounded-xl w-full" style={{ border: `2px solid ${cardBorder}`, background: cardBg, overflow: 'visible' }}>
      <div className="px-4 py-3 flex items-center gap-2 rounded-t-xl" style={{ background: darkHeaderBg, borderBottom: `1px solid ${darkHeaderBorder}` }}>
        <span className="text-sm" style={{ color: 'hsl(38 55% 72%)' }}>{icon}</span>
        <span className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)', color: darkHeaderText }}>{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function normalizePct(raw) {
  const n = parseFloat(raw);
  if (isNaN(n)) return null;
  return n <= 1 ? Math.round(n * 1000) / 10 : n;
}

export default function Payward() {
  const [activeFilter, setActiveFilter] = useState('All');
  const { data } = useSiteData();
  const sm = data?.secondary_market;
  const pm = data?.prediction_markets;
  const ipoKalshi = normalizePct(pm?.ipo?.kalshi_pct);
  const ipoPoly   = normalizePct(pm?.ipo?.polymarket_pct);
  const ipoAvg    = ipoKalshi != null && ipoPoly != null
    ? Math.round((ipoKalshi + ipoPoly) / 2 * 10) / 10
    : (ipoKalshi ?? ipoPoly ?? null);
  const mktcap16b = normalizePct(pm?.ipo?.mktcap_16b_pct);

  return (
    <>
      <Helmet>
        <title>Payward Map — Kraken Watch</title>
        <meta name="description" content="Mapping Payward, Kraken, and the broader ecosystem across products, infrastructure, and onchain activity. Entities, partners, sponsorships, and acquisitions." />
        <link rel="canonical" href="https://krakenwatch.com/payward" />
        <meta property="og:title" content="Payward Map — Kraken Watch" />
        <meta property="og:description" content="Mapping Payward, Kraken, and the broader ecosystem across products, infrastructure, and onchain activity." />
        <meta property="og:url" content="https://krakenwatch.com/payward" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Payward Map — Kraken Watch" />
        <meta name="twitter:description" content="Mapping Payward, Kraken, and the broader ecosystem across products, infrastructure, and onchain activity. Entities, partners, sponsorships, and acquisitions." />
      </Helmet>

      <div className="p-4 sm:p-6 space-y-6 w-full max-w-[1100px] mx-auto">
        <div className="w-full rounded-xl overflow-hidden shadow-lg border-2" style={{ borderColor: 'hsl(30 30% 60%)' }}>
          <img src="/payward-hero.png" alt="Krakenland map of the Payward ecosystem" className="w-full object-cover" />
        </div>

        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: qp }}>
            Payward Map
          </h1>
          <p className="text-sm max-w-lg" style={{ fontFamily: 'var(--font-serif)', color: ut }}>
            Chart the full Payward corporate armada.
          </p>
          <p className="text-[10px] max-w-md" style={{ fontFamily: 'var(--font-serif)', color: ut, fontStyle: 'italic' }}>
            Includes Payward-owned entities, products, partners, sponsorships, and ecosystem projects. Not every entry is owned by Payward.
          </p>
        </div>

        {/* ── 3-column data strip ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">

          {/* Secondary Market Pricing */}
          <div className="rounded-xl overflow-hidden flex flex-col" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
            <div className="px-4 pt-3.5 pb-2 flex items-start justify-between gap-3 flex-1">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-display)', color: ut }}>Secondary Market</p>
                <p className="text-sm font-semibold leading-tight mb-2" style={{ fontFamily: 'var(--font-display)', color: qp }}>Payward share price across private venues</p>
                <div className="flex flex-col gap-1 mt-1">
                  {[
                    { label: 'Hiive',     raw: sm?.hiive_pps },
                    { label: 'Forge',     raw: sm?.forge_pps },
                    { label: 'NASDAQ PM', raw: sm?.npm_pps },
                    { label: 'Notice',    raw: sm?.notice_pps },
                  ].map(({ label, raw }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[10px]" style={{ color: ut, fontFamily: 'var(--font-display)' }}>{label}</span>
                      <span className="text-[10px] font-bold tabular-nums" style={{ color: on, fontFamily: 'var(--font-display)' }}>{raw ? `$${raw}` : '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-3xl font-bold tabular-nums leading-none" style={{ fontFamily: 'var(--font-display)', color: on }}>
                  {sm?.avg_pps ? `$${sm.avg_pps}` : '—'}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: ut }}>wtd avg</p>
              </div>
            </div>
            <div className="px-4 pb-3">
              <p className="text-[9px]" style={{ color: ut }}>
                {sm?.volume_30d_est_m ? `Est. 30D vol ~$${sm.volume_30d_est_m}M · ` : ''}updated every 4 hours
              </p>
            </div>
          </div>

          {/* IPO Odds */}
          <div className="rounded-xl overflow-hidden flex flex-col" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
            <div className="px-4 pt-3.5 pb-2 flex items-start justify-between gap-3 flex-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <SourceBadge src="Kalshi" />
                  <SourceBadge src="Polymarket" />
                </div>
                <p className="text-sm font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: qp }}>Kraken IPO by Dec 31, 2026</p>
                {(ipoKalshi != null || ipoPoly != null) && (
                  <div className="mt-2 flex flex-col gap-0.5">
                    {ipoKalshi != null && (
                      <p className="text-[10px] tabular-nums" style={{ color: ut }}>Kalshi {ipoKalshi}%</p>
                    )}
                    {ipoPoly != null && (
                      <p className="text-[10px] tabular-nums" style={{ color: ut }}>Polymarket {ipoPoly}%</p>
                    )}
                  </div>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-3xl font-bold tabular-nums leading-none" style={{ fontFamily: 'var(--font-display)', color: on }}>
                  {ipoAvg != null ? `${ipoAvg}%` : '—'}
                </p>
              </div>
            </div>
            <div className="px-4 pb-3">
              <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'hsl(33 25% 76%)' }}>
                <div className="h-full rounded-full" style={{
                  width: `${Math.min(100, Math.max(0, ipoAvg ?? 0))}%`,
                  background: (ipoAvg ?? 0) >= 50
                    ? 'linear-gradient(to right, hsl(150 40% 40%), hsl(150 50% 30%))'
                    : `linear-gradient(to right, ${on}, hsl(25 55% 38%))`,
                }} />
              </div>
              <p className="text-[9px]" style={{ color: ut }}>updated every 4 hours</p>
            </div>
            <div className="px-4 pb-3.5 pt-1" style={{ borderTop: `1px solid ${cardBorder}` }}>
              <a href="https://polymarket.com/event/kraken-ipo-in-2025" target="_blank" rel="noopener noreferrer"
                className="block w-full text-center text-xs font-bold px-3 py-2 rounded-lg transition-opacity hover:opacity-85"
                style={{ background: darkHeaderBg, color: darkHeaderText, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textDecoration: 'none' }}>
                Trade ↗
              </a>
            </div>
          </div>

          {/* IPO Market Cap >$16B */}
          <div className="rounded-xl overflow-hidden flex flex-col" style={{ border: `2px solid ${cardBorder}`, background: cardBg }}>
            <div className="px-4 pt-3.5 pb-2 flex items-start justify-between gap-3 flex-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <SourceBadge src="Polymarket" />
                </div>
                <p className="text-sm font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: qp }}>IPO market cap above $16B at listing</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-3xl font-bold tabular-nums leading-none" style={{ fontFamily: 'var(--font-display)', color: on }}>
                  {mktcap16b != null ? `${mktcap16b}%` : '—'}
                </p>
              </div>
            </div>
            <div className="px-4 pb-3">
              <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'hsl(33 25% 76%)' }}>
                <div className="h-full rounded-full" style={{
                  width: `${Math.min(100, Math.max(0, mktcap16b ?? 0))}%`,
                  background: (mktcap16b ?? 0) >= 50
                    ? 'linear-gradient(to right, hsl(150 40% 40%), hsl(150 50% 30%))'
                    : `linear-gradient(to right, ${on}, hsl(25 55% 38%))`,
                }} />
              </div>
              <p className="text-[9px]" style={{ color: ut }}>updated every 4 hours</p>
            </div>
            <div className="px-4 pb-3.5 pt-1" style={{ borderTop: `1px solid ${cardBorder}` }}>
              <a href="https://polymarket.com/event/kraken-ipo-closing-market-cap-above" target="_blank" rel="noopener noreferrer"
                className="block w-full text-center text-xs font-bold px-3 py-2 rounded-lg transition-opacity hover:opacity-85"
                style={{ background: darkHeaderBg, color: darkHeaderText, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textDecoration: 'none' }}>
                Trade ↗
              </a>
            </div>
          </div>

        </div>

        {/* ── Filter tabs ── */}
        <div className="flex flex-wrap gap-2 justify-center">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.04em',
                background: activeFilter === tag ? qp : sectionBg,
                color: activeFilter === tag ? 'hsl(38 50% 85%)' : ut,
                border: `1px solid ${activeFilter === tag ? qp : cardBorder}`,
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {ecosystemSections.map(section => (
          <SectionBlock key={section.id} section={section} activeFilter={activeFilter} />
        ))}

        {activeFilter === 'All' && (
          <>
            <SectionCard title="Board of Directors" icon="⚓">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {boardMembers.map((m, i) => (
                  <div key={i} className="rounded-lg p-3" style={{ border: `1px solid ${cardBorder}`, background: sectionBg }}>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold" style={{ fontFamily: 'var(--font-display)', color: qp }}>{m.name}</p>
                      {m.x && (
                        <a href={m.x} target="_blank" rel="noopener noreferrer"
                          className="shrink-0 transition-opacity hover:opacity-70" aria-label={`${m.name} on X`}
                          style={{ color: 'hsl(210 10% 40%)' }}>
                          <XIcon />
                        </a>
                      )}
                    </div>
                    <p className="text-[10px] mt-0.5" style={{ color: ut, fontFamily: 'var(--font-serif)' }}>{m.role}</p>
                  </div>
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
          </>
        )}

        <div className="text-center py-4">
          <p className="text-[11px]" style={{ color: ut, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            More entities, data modules, and ecosystem profiles will be added as the map expands.
          </p>
        </div>

        <div className="flex justify-center pb-4">
          <img src="/stamp-ship.png" alt="Payward" className="object-contain" style={{ width: '100px', height: '100px' }} />
        </div>
      </div>
    </>
  );
}
