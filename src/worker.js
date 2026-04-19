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
      const patched = html.replace(
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
