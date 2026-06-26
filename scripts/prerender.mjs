import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

const { default: briefs } = await import('../src/content/briefs/index.js');

const baseHtml = readFileSync(resolve(distDir, 'index.html'), 'utf8');

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setMeta(html, { title, description, canonical, ogType, ogUrl, ogTitle, ogDesc, ogImage }) {
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${esc(description)}" />`);
  html = html.replace(/<meta property="og:type"[^>]*\/>/, `<meta property="og:type" content="${esc(ogType)}" />`);
  html = html.replace(/<meta property="og:url"[^>]*\/>/, `<meta property="og:url" content="${esc(ogUrl)}" />`);
  html = html.replace(/<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${esc(ogTitle)}" />`);
  html = html.replace(/<meta property="og:description"[^>]*\/>/, `<meta property="og:description" content="${esc(ogDesc)}" />`);
  if (ogImage) {
    html = html.replace(/<meta property="og:image"[^>]*\/>/, `<meta property="og:image" content="${esc(ogImage)}" />`);
    html = html.replace(/<meta name="twitter:image"[^>]*\/>/, `<meta name="twitter:image" content="${esc(ogImage)}" />`);
  }
  html = html.replace(/<meta name="twitter:title"[^>]*\/>/, `<meta name="twitter:title" content="${esc(ogTitle)}" />`);
  html = html.replace(/<meta name="twitter:description"[^>]*\/>/, `<meta name="twitter:description" content="${esc(ogDesc)}" />`);
  html = html.replace('</head>', `  <link rel="canonical" href="${esc(canonical)}" />\n  </head>`);
  return html;
}

function injectHead(html, snippet) {
  return html.replace('</head>', `${snippet}\n  </head>`);
}

function injectRoot(html, content) {
  return html.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
}

function renderBodyParagraphs(body) {
  return body
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${esc(p)}</p>`)
    .join('\n    ');
}

function webPageJsonLd({ name, description, url, breadcrumbName }) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name,
        description,
        url,
        publisher: {
          '@type': 'Organization',
          name: 'Kraken Watch',
          url: 'https://krakenwatch.com',
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://krakenwatch.com' },
            { '@type': 'ListItem', position: 2, name: breadcrumbName, item: url },
          ],
        },
      },
    ],
  }, null, 2);
}

function blogPostJsonLd(brief) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: brief.title,
    description: brief.description,
    datePublished: brief.date,
    dateModified: brief.date,
    url: `https://krakenwatch.com/blog/${brief.slug}`,
    image: brief.image
      ? `https://krakenwatch.com${brief.image}`
      : 'https://krakenwatch.com/og-image.jpg',
    author: {
      '@type': 'Organization',
      name: 'Kraken Watch',
      url: 'https://krakenwatch.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kraken Watch',
      url: 'https://krakenwatch.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://krakenwatch.com/logo-lighthouse.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://krakenwatch.com/blog/${brief.slug}`,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://krakenwatch.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://krakenwatch.com/blog' },
        { '@type': 'ListItem', position: 3, name: brief.title, item: `https://krakenwatch.com/blog/${brief.slug}` },
      ],
    },
  }, null, 2);
}

console.log('\nPrerendering static HTML...');

// ─── Static pages ─────────────────────────────────────────────────────────────

const staticPages = [
  {
    path: 'prediction',
    title: 'Prediction Watch — Kraken Watch',
    h1: 'Prediction Watch',
    description: 'Track prediction market data and key signals across crypto, macro, and global events. Daily Kraken IPO odds and regulatory market forecasts.',
    url: 'https://krakenwatch.com/prediction',
    sections: [
      { h2: 'Kraken IPO Odds', body: 'Live prediction market probability for a Kraken IPO, aggregated from Polymarket and Kalshi.' },
      { h2: 'Underwriter Watch', body: 'Prediction market odds for major underwriters: Bank of America, Morgan Stanley, JPMorgan Chase, Citigroup, and Goldman Sachs.' },
      { h2: 'Regulatory Markets', body: 'Prediction market signals on U.S. crypto regulation including the Clarity Act and crypto market structure legislation.' },
      { h2: 'Ink FDV Markets', body: 'Prediction market odds for Ink token fully diluted valuation ranges at launch.' },
    ],
  },
  {
    path: 'ink',
    title: 'Ink Ecosystem — Kraken Watch',
    h1: 'Ink Ecosystem',
    description: 'Explore apps, assets, and activity across the Ink onchain ecosystem. Live TVL, protocol data, and ecosystem growth metrics.',
    url: 'https://krakenwatch.com/ink',
    sections: [
      { h2: 'Ink L2 Overview', body: 'Ink is the Kraken-backed Layer 2 blockchain built on the Optimism Superchain. It serves as the settlement layer for Kraken\'s ecosystem including xStocks, DeFi, and tokenized assets.' },
      { h2: 'TVL and Protocol Data', body: 'Live total value locked (TVL) and protocol count across the Ink ecosystem.' },
      { h2: 'App Directory', body: 'Explore apps and protocols building on Ink including DeFi, trading, yield, and infrastructure projects.' },
    ],
  },
  {
    path: 'payward',
    title: 'Payward Map — Kraken Watch',
    h1: 'Payward Map',
    description: 'Mapping Payward, Kraken, and the broader ecosystem across products, infrastructure, and onchain activity. Entities, partners, sponsorships, and acquisitions.',
    url: 'https://krakenwatch.com/payward',
    sections: [
      { h2: 'Consumer Hub', body: 'Kraken consumer products including the main exchange, Kraken Pro, and NFT marketplace.' },
      { h2: 'Institutional Stack', body: 'Kraken institutional products including custody, OTC, and prime brokerage services.' },
      { h2: 'Ink Network', body: 'Ink L2, xStocks tokenized equities, and onchain infrastructure.' },
      { h2: 'DeFi and Yield Layer', body: 'Staking, liquid staking, and yield products across the Payward ecosystem.' },
      { h2: 'Market Infrastructure Partners', body: 'Clearing, settlement, and market infrastructure partnerships.' },
      { h2: 'Investment and Strategic Finance', body: 'Strategic investments, acquisitions, and financial partnerships including Deutsche Börse and Bitnomial.' },
    ],
  },
  {
    path: 'xstocks',
    title: 'xStocks Helm — Kraken Watch',
    h1: 'xStocks Helm',
    description: 'Track tokenized equity signals across Kraken and partner venues. Volume, momentum, venue distribution, and narrative signals for xStocks.',
    url: 'https://krakenwatch.com/xstocks',
    sections: [
      { h2: 'xStocks Overview', body: 'xStocks are tokenized U.S. equities and ETFs tradeable onchain through Kraken, Ink L2, BNB Chain, and other partner venues.' },
      { h2: 'Venue Distribution', body: 'Track xStocks activity across Kraken, PancakeSwap, CowSwap, Ink, and emerging venues.' },
      { h2: 'Narrative Signals', body: 'Monitor adoption signals, new listings, and ecosystem developments for tokenized equities.' },
    ],
  },
  {
    path: 'about',
    title: 'About — Kraken Watch',
    h1: 'Ahoy, matey! Welcome t\' the Watch!',
    description: 'Kraken Watch is independent research tracking Kraken, Payward, and Ink L2. Daily analytics on IPO odds, share pricing, and the onchain ecosystem.',
    url: 'https://krakenwatch.com/about',
    sections: [
      { h2: 'What is Kraken Watch?', body: 'Kraken Watch set sail in April 2026 to forge signals and scuttlebutt from across Kraken, Payward, Ink, and the digital asset frontier into actionable insight.' },
      { h2: 'Follow the crew', body: 'Follow @KrakWatch on X for daily updates. Created by @salwilliam.' },
    ],
    links: [
      { href: '/prediction', label: 'Prediction Watch', desc: 'Track forecast signals tied to Kraken and Ink.' },
      { href: '/ink', label: 'Ink Ecosystem', desc: 'Track Ink dapps, data, and ecosystem activity.' },
      { href: '/payward', label: 'Payward Map', desc: 'Chart the full Payward corporate armada.' },
      { href: '/blog', label: 'Blog', desc: 'Actionable insight from across the Kraken universe.' },
      { href: '/experimental', label: 'Experimental', desc: 'New modules still getting their sea legs.' },
    ],
  },
  {
    path: 'experimental',
    title: 'Experimental — Kraken Watch',
    h1: 'Experimental',
    description: 'Staging area for all proposed Kraken Map and Ink Markets modules under development.',
    url: 'https://krakenwatch.com/experimental',
    sections: [
      { h2: 'Ink Timeline', body: 'Key milestones in the history of Ink L2, from mainnet launch through Stage 1 decentralization and the INK token announcement.' },
      { h2: 'Ink Secondary Market', body: 'Estimated secondary market pricing for Payward equity across platforms including Hiive, Forge, NPM Capital, and Notice.' },
    ],
  },
];

for (const page of staticPages) {
  let html = baseHtml;

  html = setMeta(html, {
    title: page.title,
    description: page.description,
    canonical: page.url,
    ogType: 'website',
    ogUrl: page.url,
    ogTitle: page.title,
    ogDesc: page.description,
    ogImage: 'https://krakenwatch.com/og-image.jpg',
  });

  html = injectHead(
    html,
    `  <script type="application/ld+json">\n${webPageJsonLd({ name: page.title, description: page.description, url: page.url, breadcrumbName: page.h1 })}\n  </script>`,
  );

  const sectionHtml = page.sections
    .map(s => `      <section>\n        <h2>${esc(s.h2)}</h2>\n        <p>${esc(s.body)}</p>\n      </section>`)
    .join('\n');

  const linksHtml = page.links
    ? `\n      <nav>\n${page.links.map(l => `        <a href="${l.href}"><strong>${esc(l.label)}</strong> — ${esc(l.desc)}</a>`).join('\n')}\n      </nav>`
    : '';

  html = injectRoot(
    html,
    `
    <main>
      <h1>${esc(page.h1)}</h1>
      <p>${esc(page.description)}</p>
${sectionHtml}${linksHtml}
    </main>`,
  );

  const dir = resolve(distDir, page.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'index.html'), html);
  console.log(`  ✓ /${page.path}`);
}

// ─── Blog post pages ───────────────────────────────────────────────────────────

for (const brief of briefs) {
  const pageTitle = `${brief.title} — Kraken Watch`;
  const pageUrl = `https://krakenwatch.com/blog/${brief.slug}`;
  const ogImage = brief.image
    ? `https://krakenwatch.com${brief.image}`
    : 'https://krakenwatch.com/og-image.jpg';

  let html = baseHtml;

  html = setMeta(html, {
    title: pageTitle,
    description: brief.description,
    canonical: pageUrl,
    ogType: 'article',
    ogUrl: pageUrl,
    ogTitle: pageTitle,
    ogDesc: brief.description,
    ogImage,
  });

  html = injectHead(
    html,
    `  <script type="application/ld+json">\n${blogPostJsonLd(brief)}\n  </script>`,
  );

  html = injectRoot(
    html,
    `
    <article>
      <header>
        <h1>${esc(brief.title)}</h1>
        <time datetime="${brief.date}">${brief.dateDisplay}</time>
        <p>${esc(brief.description)}</p>
      </header>
      <section>
        ${renderBodyParagraphs(brief.body)}
      </section>
      <nav><a href="/blog">← Alpha Briefs</a></nav>
    </article>`,
  );

  const dir = resolve(distDir, 'blog', brief.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'index.html'), html);
  console.log(`  ✓ /blog/${brief.slug}`);
}

// ─── Blog archive ──────────────────────────────────────────────────────────────

const archiveTitle = 'Alpha Briefs — Kraken Watch';
const archiveDesc = 'Intelligence on Kraken, Ink L2, Payward, and prediction markets. Updated regularly.';
const archiveUrl = 'https://krakenwatch.com/blog';

let archiveHtml = baseHtml;

archiveHtml = setMeta(archiveHtml, {
  title: archiveTitle,
  description: archiveDesc,
  canonical: archiveUrl,
  ogType: 'website',
  ogUrl: archiveUrl,
  ogTitle: archiveTitle,
  ogDesc: archiveDesc,
  ogImage: 'https://krakenwatch.com/og-image.jpg',
});

const blogJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Alpha Briefs — Kraken Watch',
  description: archiveDesc,
  url: archiveUrl,
  publisher: {
    '@type': 'Organization',
    name: 'Kraken Watch',
    url: 'https://krakenwatch.com',
  },
  blogPost: briefs.map(b => ({
    '@type': 'BlogPosting',
    headline: b.title,
    url: `https://krakenwatch.com/blog/${b.slug}`,
    datePublished: b.date,
    description: b.description,
  })),
}, null, 2);

archiveHtml = injectHead(
  archiveHtml,
  `  <script type="application/ld+json">\n${blogJsonLd}\n  </script>`,
);

const archiveItems = briefs
  .map(
    b => `      <li>
        <article>
          <a href="/blog/${b.slug}"><h2>${esc(b.title)}</h2></a>
          <time datetime="${b.date}">${b.dateDisplay}</time>
          <p>${esc(b.description)}</p>
        </article>
      </li>`,
  )
  .join('\n');

archiveHtml = injectRoot(
  archiveHtml,
  `
    <main>
      <h1>Alpha Briefs</h1>
      <p>Intelligence on Kraken, Ink L2, Payward, and prediction markets.</p>
      <nav>
        <a href="/prediction">Prediction Markets</a> ·
        <a href="/ink">Ink L2</a> ·
        <a href="/payward">Payward</a> ·
        <a href="/xstocks">xStocks</a>
      </nav>
      <ul>
${archiveItems}
      </ul>
    </main>`,
);

mkdirSync(resolve(distDir, 'blog'), { recursive: true });
writeFileSync(resolve(distDir, 'blog', 'index.html'), archiveHtml);
console.log('  ✓ /blog');

// ─── Sitemap ───────────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);

const sitemapBriefEntries = briefs
  .map(
    b => `  <url>
    <loc>https://krakenwatch.com/blog/${b.slug}</loc>
    <lastmod>${b.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://krakenwatch.com/prediction</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://krakenwatch.com/ink</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://krakenwatch.com/payward</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://krakenwatch.com/xstocks</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://krakenwatch.com/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://krakenwatch.com/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://krakenwatch.com/experimental</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
${sitemapBriefEntries}
</urlset>`;

writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap);
writeFileSync(resolve(root, 'public', 'sitemap.xml'), sitemap);
console.log('  ✓ sitemap.xml');
console.log('\nPrerender complete.\n');
