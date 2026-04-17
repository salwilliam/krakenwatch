export default {
  async fetch(request, env) {
    // Serve the pinned known-good static artifact bundle directly from Workers assets.
    return env.ASSETS.fetch(request);
  },
};
