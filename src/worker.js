export default {
  async fetch(request, env) {
    // Keep site-data on the current Worker deployment so daily refresh commits
    // on main become live without waiting for baseline Pages parity updates.
    const requestUrl = new URL(request.url);
    if (requestUrl.pathname === '/site-data.json' && env?.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    // Emergency pin: proxy to known-good deployment while source parity is resolved.
    const incomingUrl = new URL(request.url);

    const isAboutTypographyHost =
      incomingUrl.hostname === 'wispy-sun-811e.krakenwatch.workers.dev' ||
      incomingUrl.hostname === 'krakenwatch.com';

    // Host-scoped asset route: serve Blackbeard from local worker assets so the
    // About override can load the actual font file instead of HTML fallback.
    if (
      isAboutTypographyHost &&
      incomingUrl.pathname === '/fonts/blackbeard.woff' &&
      env &&
      env.ASSETS
    ) {
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);
    url.hostname = '1d2a3088.krakenwatch.pages.dev';

    const response = await fetch(new Request(url.toString(), request));

    // Host-scoped tweak: use Blackbeard for About page body text.
    if (
      isAboutTypographyHost &&
      (response.headers.get('content-type') || '').includes('text/html')
    ) {
      const html = await response.text();
      const textPatched = html.replace(
        "Kraken Watch first set sail on X, gathering the signals and scuttlebutt of the Kraken ecosystem into one handy port o' call.",
        'Kraken Watch set sail in April 2026 to plunder signals, scuttlebutt, and actionable insight from across the vast seas of Kraken, Payward, Ink, and the rising frontier of digital assets beyond.',
      ).replace(
        'On April 10, 2026, we launched our own site — same credo: useful insights and data from across the Kraken, Payward, and Ink universe.',
        '',
      ).replace(
        /Created by\s*<a href="https:\/\/x\.com\/salwilliam"[^>]*>@salwilliam<\/a>\./,
        'Join the crew on <a href="https://x.com/KrakWatch" target="_blank" rel="noopener noreferrer" class="font-semibold underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity" style="color: hsl(350 55% 32%)">@krakwatch</a> on X 🏴‍☠️</p><p class="text-base sm:text-lg leading-relaxed" style="font-family: var(--font-serif); color: hsl(28 40% 14%); opacity: 0.85">Created by <a href="https://x.com/salwilliam" target="_blank" rel="noopener noreferrer" class="font-semibold underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity" style="color: hsl(350 55% 32%)">@salwilliam</a>',
      );
      const patched = textPatched.replace(
        '</head>',
        '<style id="about-blackbeard-test-only">@font-face{font-family:"Blackbeard";font-style:normal;font-weight:400;font-display:swap;src:url("/fonts/blackbeard.woff") format("woff")}p.text-base, p.text-base.sm\\:text-lg{font-family:"Blackbeard","Trade Winds",Georgia,serif!important;line-height:1.5;letter-spacing:.01em;text-align:left!important}</style></head>',
      );
      return new Response(patched, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    return response;
  },
};
