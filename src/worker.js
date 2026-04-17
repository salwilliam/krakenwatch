export default {
  async fetch(request, env) {
    // Serve static assets and let Cloudflare handle SPA fallback policy.
    return env.ASSETS.fetch(request);
  },
};
