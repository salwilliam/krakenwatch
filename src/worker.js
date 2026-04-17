export default {
  async fetch(request, env) {
    // Let Cloudflare static assets routing handle SPA fallback.
    return env.ASSETS.fetch(request);
  },
};
