# Deployment Runbook (Workers Canonical)

This project now uses a **single production deployment path**:

- Cloudflare Workers service: `wispy-sun-811e`
- Custom domain: `krakenwatch.com`

## Source of truth

- Production traffic is served through the Worker proxy in `src/worker.js`.
- Canonical baseline target is `https://1d2a3088.krakenwatch.pages.dev`.
- Deploy workflow: `.github/workflows/deploy.yml`.

## Critical rules

1. Do not route `krakenwatch.com` to a second production project.
2. Do not upload Pages `_redirects` into Workers assets.
3. Keep only one production-capable domain binding active.
4. While emergency proxy mode is active, both must stay true:
   - `src/worker.js` proxies to `1d2a3088.krakenwatch.pages.dev`
   - `wrangler.workers.toml` contains `run_worker_first = true`

## Deploy checks

After each merge (automated in CI and also safe to run manually):

1. Verify workflow success (`Deploy to Cloudflare Workers`).
2. Verify hashes/signatures on:
   - `https://krakenwatch.com/`
   - `https://wispy-sun-811e.krakenwatch.workers.dev/`
   - Baseline comparison target: `https://1d2a3088.krakenwatch.pages.dev/`
3. Verify routes return `200` and signatures match baseline:
   - `/`
   - `/ink`
   - `/payward`
   - `/alpha-briefs`
   - `/about`

## Incident-prevention guardrails in CI

The deploy workflow now hard-fails if either condition regresses:

- Proxy host pin removed from `src/worker.js`
- `run_worker_first = true` missing in `wrangler.workers.toml`

After deployment, CI also compares production + worker route signatures to the
known-good baseline route-by-route (`/`, `/ink`, `/payward`, `/alpha-briefs`, `/about`).

## Preview policy: single canonical codepath only

- PR preview URLs must use the same canonical proxy codepath as production.
- No preview workflow may deploy alternate built bundles as standalone app previews.
- `.github/workflows/pr-preview.yml` must:
  - validate canonical proxy invariants (`run_worker_first = true` and pinned proxy hostname)
  - publish the deterministic canonical preview URL: `https://wispy-sun-811e.krakenwatch.workers.dev`
- Any preview implementation that serves source-built assets directly is disallowed.

## Cloudflare cleanup target

Once stable:

- Keep `wispy-sun-811e` as canonical production target.
- Remove or disable production domain routing on the Pages project to prevent split deployments.
