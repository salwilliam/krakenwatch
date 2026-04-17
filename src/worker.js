export default {
  async fetch(request, env) {
    // Emergency pin: proxy to known-good deployment while source parity is resolved.
    const url = new URL(request.url);
    url.hostname = '1d2a3088.krakenwatch.pages.dev';
    return fetch(new Request(url.toString(), request));
  },
};
