export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isHtmlRoute =
      request.method === 'GET' &&
      url.pathname !== '/' &&
      !url.pathname.startsWith('/assets/') &&
      !url.pathname.includes('.');

    // For SPA routes like /ink and /alpha-briefs, serve index directly.
    if (isHtmlRoute) {
      url.pathname = '/index.html';
      return env.ASSETS.fetch(new Request(url.toString(), request));
    }

    return env.ASSETS.fetch(request);
  },
};
