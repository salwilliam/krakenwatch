export default {
  async fetch(request, env) {
    // Keep site-data on the current Worker deployment so daily refresh commits
    // on main become live without waiting for baseline Pages parity updates.
    const requestUrl = new URL(request.url);
    if (requestUrl.pathname === '/site-data.json' && env?.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    // Emergency pin: proxy to known-good deployment while source parity is resolved.
    const url = new URL(request.url);
    url.hostname = '1d2a3088.krakenwatch.pages.dev';
    return fetch(new Request(url.toString(), request));
  },
};
