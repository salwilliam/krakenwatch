export default {
  async fetch(request, env) {
    // Emergency pin: proxy to known-good deployment while source parity is resolved.
    const incomingUrl = new URL(request.url);

    // Preview-only asset route: serve Blackbeard from local worker assets so the
    // test-host About override can load the actual font file instead of HTML fallback.
    if (
      incomingUrl.hostname === 'wispy-sun-811e.krakenwatch.workers.dev' &&
      incomingUrl.pathname === '/fonts/blackbeard.woff' &&
      env &&
      env.ASSETS
    ) {
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);
    url.hostname = '1d2a3088.krakenwatch.pages.dev';

    const response = await fetch(new Request(url.toString(), request));

    // Preview-only tweak: use Blackbeard for About page body text on workers.dev test host.
    if (
      incomingUrl.hostname === 'wispy-sun-811e.krakenwatch.workers.dev' &&
      (response.headers.get('content-type') || '').includes('text/html')
    ) {
      const html = await response.text();
      const patched = html.replace(
        '</head>',
        '<style id="about-blackbeard-test-only">@font-face{font-family:"Blackbeard";font-style:normal;font-weight:400;font-display:swap;src:url("/fonts/blackbeard.woff") format("woff")}p.text-base, p.text-base.sm\\:text-lg{font-family:"Blackbeard","Trade Winds",Georgia,serif!important;line-height:1.5;letter-spacing:.01em}</style></head>',
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
