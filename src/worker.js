export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) {
      return response;
    }

    // Serve index for unknown routes so SPA deep links resolve.
    const url = new URL(request.url);
    url.pathname = '/index.html';
    const indexRequest = new Request(url.toString(), request);
    return env.ASSETS.fetch(indexRequest);
  },
};
